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
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const { task_id, status, context = {} } = await req.json();

    if (!task_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Task ID and status are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get current task to track status change
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks_v2')
      .select('status, created_at')
      .eq('id', task_id)
      .single();

    if (fetchError) {
      throw new Error(`Task not found: ${fetchError.message}`);
    }

    // Calculate actual duration for completed tasks
    const updates: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      
      // Calculate duration in minutes
      const createdAt = new Date(currentTask.created_at);
      const completedAt = new Date();
      const durationMinutes = Math.floor((completedAt.getTime() - createdAt.getTime()) / 60000);
      updates.actual_duration = durationMinutes;
    }

    // Update the task
    const { error: updateError } = await supabase
      .from('tasks_v2')
      .update(updates)
      .eq('id', task_id);

    if (updateError) {
      console.error('Task update error:', updateError);
      throw new Error(`Failed to update task: ${updateError.message}`);
    }

    // Create status change event
    const eventType = status === 'active' && currentTask.status === 'paused' ? 'resumed' : status;
    
    const { error: eventError } = await supabase
      .from('task_events_v2')
      .insert({
        task_id,
        event_type: eventType,
        details: {
          previous_status: currentTask.status,
          new_status: status,
          ...context
        },
        created_by: user.id
      });

    if (eventError) {
      console.error('Event creation error:', eventError);
      // Don't fail the status update for event logging errors
    }

    // Handle special status transitions
    switch (status) {
      case 'completed':
        // Check if there are outputs to publish
        if (context.outputs) {
          const { error: outputError } = await supabase
            .from('task_outputs')
            .insert({
              task_id,
              output_type: 'completion_data',
              content: context.outputs,
              published_by: user.id
            });

          if (outputError) {
            console.error('Output publishing error:', outputError);
          }
        }
        break;

      case 'failed':
        // Log failure details
        const { error: failureEventError } = await supabase
          .from('task_events_v2')
          .insert({
            task_id,
            event_type: 'failed',
            details: {
              failure_reason: context.reason || 'Unknown failure',
              error_details: context.error_details
            },
            created_by: user.id
          });

        if (failureEventError) {
          console.error('Failure event error:', failureEventError);
        }
        break;
    }

    console.log(`Task ${task_id} status updated: ${currentTask.status} -> ${status}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        previous_status: currentTask.status,
        new_status: status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Status update failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});