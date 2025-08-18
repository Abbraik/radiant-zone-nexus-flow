import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      watchpoints: {
        Row: any
      }
      signal_events: {
        Row: any
      }
      tasks: {
        Row: any
      }
    }
    Functions: {
      evaluate_watchpoints: {
        Returns: any
      }
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Starting watchpoint evaluation...')

    // Call the evaluate_watchpoints function
    const { data: evaluationResult, error: evalError } = await supabaseClient
      .rpc('evaluate_watchpoints')

    if (evalError) {
      console.error('Error evaluating watchpoints:', evalError)
      throw evalError
    }

    console.log('Watchpoint evaluation completed:', evaluationResult)

    // Auto-create tasks for tripped watchpoints with playbooks
    if (evaluationResult?.results && Array.isArray(evaluationResult.results)) {
      for (const result of evaluationResult.results) {
        if (result.tripped) {
          console.log(`Processing tripped watchpoint: ${result.watchpoint_id}`)

          // Get watchpoint details including playbook
          const { data: watchpoint, error: wpError } = await supabaseClient
            .from('watchpoints')
            .select(`
              *,
              playbooks!inner(*)
            `)
            .eq('id', result.watchpoint_id)
            .eq('armed', true)
            .single()

          if (wpError) {
            console.error('Error fetching watchpoint:', wpError)
            continue
          }

          if (watchpoint?.playbooks?.auto_action) {
            console.log(`Auto-creating task for watchpoint ${result.watchpoint_id}`)
            
            // Create responsive task
            const { data: newTask, error: taskError } = await supabaseClient
              .from('tasks')
              .insert({
                title: `Watchpoint Trip: ${watchpoint.indicator}`,
                description: `Automated response to ${watchpoint.indicator} threshold breach (${result.current_value})`,
                zone: 'act',
                task_type: 'watchpoint_response',
                capacity: 'responsive',
                priority: 'high',
                status: 'todo',
                user_id: watchpoint.user_id,
                payload: {
                  watchpoint_id: watchpoint.id,
                  trigger_value: result.current_value,
                  playbook_steps: watchpoint.playbooks.steps,
                  auto_created: true,
                  created_by_watchpoint: true
                }
              })
              .select()
              .single()

            if (taskError) {
              console.error('Error creating task:', taskError)
            } else {
              console.log(`Created task ${newTask.id} for watchpoint ${watchpoint.id}`)
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        evaluation: evaluationResult,
        processed_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in evaluate-watchpoints:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to evaluate watchpoints'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})