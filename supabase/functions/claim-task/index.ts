import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    let user = null;
    
    if (authHeader) {
      // Try to verify the user if auth header exists
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      
      if (!authError && authUser) {
        user = authUser;
      }
    }
    
    // For demo purposes, use a default user if no authenticated user
    if (!user) {
      user = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'demo@example.com'
      };
      console.log('Using demo user for task claiming');
    }

    const { task_id, user_agent, ip_address } = await req.json();

    if (!task_id) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const now = new Date();
    const lockExpiry = new Date(now.getTime() + (30 * 60 * 1000)); // 30 minutes

    // Begin transaction-like operations
    // Step 1: Assert task status is 'available'
    const { data: taskData, error: taskError } = await supabase
      .from('tasks_5c')
      .select('status, title')
      .eq('id', task_id)
      .single();

    if (taskError) {
      throw new Error(`Task not found: ${taskError.message}`);
    }

    if (taskData.status !== 'open') {
      return new Response(
        JSON.stringify({ 
          error: `Task is not available. Current status: ${taskData.status}`,
          success: false
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Step 2: Check for ANY existing locks (active or not)
    const { data: allExistingLocks, error: lockCheckError } = await supabase
      .from('task_locks')
      .select('*')
      .eq('task_id', task_id);

    if (lockCheckError) {
      throw new Error(`Failed to check existing locks: ${lockCheckError.message}`);
    }

    // Check if there are active locks (not released and not expired)
    const activeLocks = allExistingLocks?.filter(lock => 
      lock.released_at === null && new Date(lock.expires_at) > now
    ) || [];

    if (activeLocks.length > 0) {
      const activeLock = activeLocks[0];
      if (activeLock.locked_by !== user.id) {
        return new Response(
          JSON.stringify({ 
            error: 'Task is currently locked by another user',
            locked_by: activeLock.locked_by,
            expires_at: activeLock.expires_at,
            success: false
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Step 3: Upsert task lock (insert or update existing)
    let lockData;
    let lockError;
    
    if (allExistingLocks && allExistingLocks.length > 0) {
      // Update existing lock
      const existingLock = allExistingLocks[0];
      const { data, error } = await supabase
        .from('task_locks')
        .update({
          locked_by: user.id,
          locked_at: now.toISOString(),
          expires_at: lockExpiry.toISOString(),
          released_at: null // Clear any previous release
        })
        .eq('id', existingLock.id)
        .select()
        .single();
      lockData = data;
      lockError = error;
    } else {
      // Insert new lock
      const { data, error } = await supabase
        .from('task_locks')
        .insert({
          task_id,
          locked_by: user.id,
          locked_at: now.toISOString(),
          expires_at: lockExpiry.toISOString()
        })
        .select()
        .single();
      lockData = data;
      lockError = error;
    }

    if (lockError) {
      console.error('Lock creation error:', lockError);
      return new Response(
        JSON.stringify({ 
          error: `Failed to acquire lock: ${lockError.message}`,
          success: false
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Step 4: Upsert task assignment (owner role)
    const { error: assignmentError } = await supabase
      .from('task_assignments')
      .upsert({
        task_id,
        user_id: user.id,
        role: 'owner',
        assigned_at: now.toISOString(),
        assigned_by: user.id
      });

    if (assignmentError) {
      console.error('Assignment error:', assignmentError);
      // Rollback lock if assignment fails
      await supabase
        .from('task_locks')
        .update({ released_at: now.toISOString() })
        .eq('id', lockData.id);
      
      throw new Error(`Failed to assign task: ${assignmentError.message}`);
    }

    // Step 5: Update task status
    const { error: updateError } = await supabase
      .from('tasks_5c')
      .update({ 
        status: 'claimed',
        updated_at: now.toISOString()
      })
      .eq('id', task_id);

    if (updateError) {
      console.error('Task update error:', updateError);
      // Rollback operations
      await supabase
        .from('task_locks')
        .update({ released_at: now.toISOString() })
        .eq('id', lockData.id);
      
      await supabase
        .from('task_assignments')
        .delete()
        .eq('task_id', task_id)
        .eq('user_id', user.id)
        .eq('role', 'owner');
      
      throw new Error(`Failed to update task status: ${updateError.message}`);
    }

    // Step 6: Insert task event
    const { error: eventError } = await supabase
      .from('task_events_v2')
      .insert({
        task_id,
        event_type: 'claimed',
        detail: {
          ip: ip_address,
          user_agent,
          prev_status: 'open',
          claimed_by: user.id,
          lock_id: lockData.id
        },
        created_by: user.id,
        created_at: now.toISOString()
      });

    if (eventError) {
      console.error('Event creation error:', eventError);
      // Don't rollback for event errors, but log them
    }

    console.log(`Task ${task_id} successfully claimed by user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        status: 'claimed',
        task_id,
        locked_by: user.id,
        locked_at: now.toISOString(),
        expires_at: lockExpiry.toISOString(),
        success: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Task claim failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});