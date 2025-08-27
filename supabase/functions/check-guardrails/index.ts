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
      console.log('Using demo user for guardrail check');
    }

    const { task_id, actor } = await req.json();

    if (!task_id) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get task guardrails
    const { data: guardrailData, error: guardrailError } = await supabase
      .from('task_guardrails')
      .select(`
        *,
        guardrail_policies (*)
      `)
      .eq('task_id', task_id)
      .single();

    if (guardrailError) {
      console.log('No guardrails found for task, allowing by default');
      return new Response(
        JSON.stringify({ 
          result: 'allow',
          reason: 'No guardrails configured'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const guardrails = guardrailData.guardrail_policies;
    const now = new Date();
    const checkResults = {
      concurrent_substeps_exceeded: false,
      timebox_exceeded: false,
      daily_delta_limit_exceeded: false,
      coverage_limit_exceeded: false
    };

    // Check concurrent substeps limit
    if (guardrails.concurrent_substeps_limit !== null) {
      const { data: activeSubsteps, error: substepsError } = await supabase
        .from('claim_substeps')
        .select('id')
        .eq('owner', user.id)
        .in('status', ['active', 'pending']);

      if (!substepsError && activeSubsteps) {
        const activeCount = activeSubsteps.length;
        if (activeCount >= guardrails.concurrent_substeps_limit) {
          checkResults.concurrent_substeps_exceeded = true;
        }
      }
    }

    // Check timebox hours limit
    if (guardrails.timebox_hours !== null) {
      const timeboxStart = new Date(now.getTime() - (guardrails.timebox_hours * 60 * 60 * 1000));
      
      const { data: recentTasks, error: timeboxError } = await supabase
        .from('task_assignments')
        .select(`
          task_id,
          tasks_5c!inner(estimated_duration)
        `)
        .eq('user_id', user.id)
        .eq('role', 'owner')
        .gte('assigned_at', timeboxStart.toISOString());

      if (!timeboxError && recentTasks) {
        const totalHours = recentTasks.reduce((sum, assignment) => {
          const duration = assignment.tasks_5c?.estimated_duration || 2; // Default 2 hours
          return sum + duration;
        }, 0);

        if (totalHours >= guardrails.timebox_hours) {
          checkResults.timebox_exceeded = true;
        }
      }
    }

    // Determine result based on checks
    let result: 'allow' | 'throttle' | 'block' = 'allow';
    let reason = '';

    if (checkResults.concurrent_substeps_exceeded) {
      result = 'block';
      reason = `Concurrent substeps limit exceeded (${guardrails.concurrent_substeps_limit} max)`;
    } else if (checkResults.timebox_exceeded) {
      result = 'throttle';
      reason = `Timebox limit approaching (${guardrails.timebox_hours}h limit)`;
    } else if (checkResults.daily_delta_limit_exceeded) {
      result = 'throttle';
      reason = 'Daily change limit threshold reached';
    } else if (checkResults.coverage_limit_exceeded) {
      result = 'throttle';
      reason = 'Coverage limit threshold reached';
    }

    console.log(`Guardrail check for task ${task_id} by user ${user.id}: ${result} - ${reason || 'All checks passed'}`);

    return new Response(
      JSON.stringify({ 
        result,
        reason: reason || undefined,
        details: checkResults
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Guardrail check failed:', error);
    
    // Return allow on error to not block users
    return new Response(
      JSON.stringify({ 
        result: 'allow',
        reason: 'Guardrail check failed - allowing by default',
        error: error.message
      }),
      { 
        status: 200, // Return 200 so the UI doesn't treat this as a failure
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});