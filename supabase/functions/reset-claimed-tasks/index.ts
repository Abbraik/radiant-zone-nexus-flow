import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      tasks_v2: {
        Row: {
          id: string
          status: string
          created_at: string
          updated_at: string
          [key: string]: any
        }
        Update: {
          status?: string
          updated_at?: string
          [key: string]: any
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify user is authenticated and get user ID
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    console.log('🔐 User authenticated:', user.id)

    // Check if user has admin role
    const { data: roles, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    if (roleError) {
      throw new Error('Failed to check user roles')
    }

    const isAdmin = roles?.some(r => ['admin', 'owner'].includes(r.role))
    if (!isAdmin) {
      throw new Error('Insufficient permissions - admin access required')
    }

    console.log('👑 Admin access confirmed for user:', user.id)

    // Get all claimed/active tasks
    const { data: claimedTasks, error: fetchError } = await supabaseClient
      .from('tasks_v2')
      .select('task_id, status, title, capacity')
      .in('status', ['claimed', 'active', 'in_progress'])

    if (fetchError) {
      throw new Error(`Failed to fetch claimed tasks: ${fetchError.message}`)
    }

    console.log('📋 Found claimed tasks:', claimedTasks?.length || 0)

    if (!claimedTasks || claimedTasks.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No claimed tasks to reset',
          resetCount: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Reset all claimed tasks to 'open' status
    const { data: updatedTasks, error: updateError } = await supabaseClient
      .from('tasks_v2')
      .update({ 
        status: 'open',
        updated_at: new Date().toISOString()
      })
      .in('status', ['claimed', 'active', 'in_progress'])
      .select('task_id, title, status, capacity')

    if (updateError) {
      throw new Error(`Failed to reset tasks: ${updateError.message}`)
    }

    console.log('✅ Successfully reset tasks:', updatedTasks?.length || 0)

    // Also clear any associated claims
    const { error: claimsError } = await supabaseClient
      .from('claims')
      .update({ status: 'cancelled' })
      .in('status', ['active', 'pending'])

    if (claimsError) {
      console.warn('⚠️ Warning: Failed to update claims:', claimsError.message)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully reset ${updatedTasks?.length || 0} tasks to available status`,
        resetCount: updatedTasks?.length || 0,
        resetTasks: updatedTasks
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Error resetting claimed tasks:', error.message)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message.includes('permissions') ? 403 : 500
      }
    )
  }
})