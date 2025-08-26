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

    // Get all tasks for summary calculation
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks_v2')
      .select('status, priority, due_date, created_at, completed_at, actual_duration');

    if (tasksError) {
      throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    const now = new Date();
    
    // Initialize counters
    const summary = {
      total_tasks: tasks?.length || 0,
      by_status: {
        draft: 0,
        active: 0,
        paused: 0,
        completed: 0,
        cancelled: 0,
        failed: 0
      },
      by_priority: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      overdue_count: 0,
      sla_breaches: 0,
      avg_completion_time: 0
    };

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ summary }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let totalCompletionTime = 0;
    let completedTasksCount = 0;

    // Process each task
    tasks.forEach(task => {
      // Count by status
      if (summary.by_status.hasOwnProperty(task.status)) {
        summary.by_status[task.status as keyof typeof summary.by_status]++;
      }

      // Count by priority
      if (summary.by_priority.hasOwnProperty(task.priority)) {
        summary.by_priority[task.priority as keyof typeof summary.by_priority]++;
      }

      // Check if overdue
      if (task.due_date && task.status !== 'completed' && task.status !== 'cancelled') {
        const dueDate = new Date(task.due_date);
        if (dueDate < now) {
          summary.overdue_count++;
        }
      }

      // Calculate completion time
      if (task.status === 'completed' && task.actual_duration) {
        totalCompletionTime += task.actual_duration;
        completedTasksCount++;
      }

      // SLA breach detection (simplified - assumes 7 days max for high/critical priority)
      if (task.due_date && (task.priority === 'high' || task.priority === 'critical')) {
        const dueDate = new Date(task.due_date);
        const createdDate = new Date(task.created_at);
        const maxDays = task.priority === 'critical' ? 3 : 7;
        const maxTime = createdDate.getTime() + (maxDays * 24 * 60 * 60 * 1000);
        
        if (task.status === 'completed') {
          const completedDate = new Date(task.completed_at || task.created_at);
          if (completedDate.getTime() > maxTime) {
            summary.sla_breaches++;
          }
        } else if (now.getTime() > maxTime) {
          summary.sla_breaches++;
        }
      }
    });

    // Calculate average completion time
    if (completedTasksCount > 0) {
      summary.avg_completion_time = Math.round(totalCompletionTime / completedTasksCount);
    }

    console.log(`Task summary generated: ${summary.total_tasks} total tasks`);

    return new Response(
      JSON.stringify({ summary }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Summary generation failed:', error);
    
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