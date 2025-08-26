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

    const { 
      title, 
      description, 
      priority = 'medium', 
      template_id, 
      context = {}, 
      due_date, 
      estimated_duration 
    } = await req.json();

    if (!title?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create the task
    const { data: task, error: taskError } = await supabase
      .from('tasks_v2')
      .insert({
        template_id,
        title: title.trim(),
        description: description?.trim(),
        status: 'draft',
        priority,
        context,
        estimated_duration,
        due_date,
        created_by: user.id
      })
      .select()
      .single();

    if (taskError) {
      console.error('Task creation error:', taskError);
      throw new Error(`Failed to create task: ${taskError.message}`);
    }

    // Create initial event
    const { error: eventError } = await supabase
      .from('task_events_v2')
      .insert({
        task_id: task.id,
        event_type: 'created',
        details: {
          initial_priority: priority,
          template_used: template_id ? true : false
        },
        created_by: user.id
      });

    if (eventError) {
      console.error('Event creation error:', eventError);
      // Don't fail the task creation for event logging errors
    }

    console.log(`Task created: ${task.id} - ${task.title}`);

    return new Response(
      JSON.stringify({ task }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Task creation failed:', error);
    
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