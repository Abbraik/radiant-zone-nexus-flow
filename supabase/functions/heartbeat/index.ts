import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoopMetrics {
  loop_id: string;
  loop_name: string;
  latest_t_value: number;
  latest_r_value: number;
  latest_i_value: number;
  breach_count: number;
  last_breach_at: string | null;
  claim_velocity: number;
  fatigue_score: number;
  de_state: string;
  heartbeat_at: string | null;
  breach_days: number;
  tri_slope: number;
}

interface TriggerThresholds {
  PERSIST_BREACH_DAYS: number;
  FATIGUE_THRESHOLD: number;
  TRI_SLOPE_THRESHOLD: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Configuration thresholds
    const thresholds: TriggerThresholds = {
      PERSIST_BREACH_DAYS: parseInt(Deno.env.get('PERSIST_BREACH_DAYS') || '7'),
      FATIGUE_THRESHOLD: parseInt(Deno.env.get('FATIGUE_THRESHOLD') || '3'),
      TRI_SLOPE_THRESHOLD: parseFloat(Deno.env.get('TRI_SLOPE_THRESHOLD') || '-0.5'),
    };

    console.log('Starting heartbeat analysis with thresholds:', thresholds);

    // Refresh materialized view first
    const { error: refreshError } = await supabase.rpc('refresh_loop_metrics');
    if (refreshError) {
      console.error('Error refreshing materialized view:', refreshError);
      throw refreshError;
    }

    // Get all loop metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('mv_loop_metrics')
      .select('*');

    if (metricsError) {
      console.error('Error fetching loop metrics:', metricsError);
      throw metricsError;
    }

    console.log(`Processing ${metrics?.length || 0} loops`);

    const results = {
      processed: 0,
      redesign_tasks_created: 0,
      scorecards_updated: 0,
      errors: [] as string[],
    };

    for (const loop of metrics || []) {
      try {
        results.processed++;
        
        // Calculate TRI slope from recent events
        const { data: recentTri, error: triError } = await supabase
          .from('tri_events')
          .select('t_value, r_value, i_value, at')
          .eq('loop_id', loop.loop_id)
          .order('at', { ascending: false })
          .limit(10);

        if (triError) {
          results.errors.push(`Error fetching TRI for ${loop.loop_name}: ${triError.message}`);
          continue;
        }

        let triSlope = 0;
        if (recentTri && recentTri.length >= 2) {
          // Calculate simple slope using first and last values
          const latest = recentTri[0];
          const oldest = recentTri[recentTri.length - 1];
          const timeSpan = new Date(latest.at).getTime() - new Date(oldest.at).getTime();
          const avgLatest = (latest.t_value + latest.r_value + latest.i_value) / 3;
          const avgOldest = (oldest.t_value + oldest.r_value + oldest.i_value) / 3;
          
          if (timeSpan > 0) {
            triSlope = (avgLatest - avgOldest) / (timeSpan / (1000 * 60 * 60 * 24)); // per day
          }
        }

        // Calculate breach days
        let breachDays = 0;
        if (loop.last_breach_at) {
          const lastBreach = new Date(loop.last_breach_at);
          const now = new Date();
          breachDays = Math.floor((now.getTime() - lastBreach.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Update scorecard
        const { error: updateError } = await supabase
          .from('loop_scorecards')
          .upsert({
            loop_id: loop.loop_id,
            user_id: (await supabase.auth.getUser()).data.user?.id || loop.loop_id, // fallback
            claim_velocity: loop.claim_velocity,
            fatigue: loop.fatigue_score,
            tri_slope: triSlope,
            breach_days: breachDays,
            heartbeat_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (updateError) {
          results.errors.push(`Error updating scorecard for ${loop.loop_name}: ${updateError.message}`);
          continue;
        }

        results.scorecards_updated++;

        // Evaluate Learn triggers
        const triggers = [];
        let shouldCreateRedesignTask = false;
        let redesignCapacity = 'reflexive';

        // Persistent breach trigger
        if (breachDays >= thresholds.PERSIST_BREACH_DAYS) {
          triggers.push(`Persistent breach: ${breachDays} days`);
          shouldCreateRedesignTask = true;
          redesignCapacity = 'deliberative';
        }

        // Fatigue trigger
        if (loop.fatigue_score >= thresholds.FATIGUE_THRESHOLD) {
          triggers.push(`High fatigue: ${loop.fatigue_score}`);
          shouldCreateRedesignTask = true;
        }

        // TRI slope trigger (declining performance)
        if (triSlope <= thresholds.TRI_SLOPE_THRESHOLD) {
          triggers.push(`Declining TRI slope: ${triSlope.toFixed(3)}`);
          shouldCreateRedesignTask = true;
        }

        // Check for SRT misalignment
        const { data: activeSrt, error: srtError } = await supabase
          .from('srt_windows')
          .select('window_end')
          .eq('loop_id', loop.loop_id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!srtError && activeSrt && activeSrt.length > 0) {
          const windowEnd = new Date(activeSrt[0].window_end);
          if (new Date() > windowEnd) {
            triggers.push('SRT window expired');
            shouldCreateRedesignTask = true;
          }
        }

        // Check for juror overrides in tasks
        const { data: overrideTasks, error: taskError } = await supabase
          .from('tasks')
          .select('payload')
          .eq('loop_id', loop.loop_id)
          .eq('status', 'in_progress');

        if (!taskError && overrideTasks) {
          const hasOverride = overrideTasks.some(task => 
            task.payload && task.payload.juror_override === true
          );
          
          if (hasOverride) {
            triggers.push('Juror override detected');
            shouldCreateRedesignTask = true;
            redesignCapacity = 'deliberative';
          }
        }

        // Create redesign task if triggers are present
        if (shouldCreateRedesignTask && triggers.length > 0) {
          // Check if redesign task already exists
          const { data: existingTasks } = await supabase
            .from('tasks')
            .select('id')
            .eq('loop_id', loop.loop_id)
            .eq('status', 'todo')
            .ilike('title', `Redesign: ${loop.loop_name}%`);

          if (!existingTasks || existingTasks.length === 0) {
            const reason = `Heartbeat triggers: ${triggers.join(', ')}`;
            
            const { data: taskId, error: taskError } = await supabase.rpc(
              'create_redesign_task',
              {
                loop_uuid: loop.loop_id,
                reason_text: reason,
                task_capacity: redesignCapacity,
              }
            );

            if (taskError) {
              results.errors.push(`Error creating redesign task for ${loop.loop_name}: ${taskError.message}`);
            } else {
              results.redesign_tasks_created++;
              console.log(`Created redesign task for ${loop.loop_name}: ${reason}`);
              
              // Save to reflex memory
              await supabase
                .from('reflex_memory')
                .insert({
                  loop_id: loop.loop_id,
                  before: {
                    tri_slope: loop.tri_slope,
                    breach_days: loop.breach_days,
                    fatigue_score: loop.fatigue_score,
                    claim_velocity: loop.claim_velocity,
                  },
                  after: {
                    tri_slope: triSlope,
                    breach_days: breachDays,
                    fatigue_score: loop.fatigue_score,
                    claim_velocity: loop.claim_velocity,
                  },
                  reason: reason,
                  user_id: (await supabase.auth.getUser()).data.user?.id || loop.loop_id,
                });
            }
          }
        }

        if (triggers.length > 0) {
          console.log(`${loop.loop_name}: ${triggers.join(', ')}`);
        }

      } catch (error) {
        results.errors.push(`Error processing ${loop.loop_name}: ${error.message}`);
        console.error(`Error processing loop ${loop.loop_name}:`, error);
      }
    }

    console.log('Heartbeat analysis complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Heartbeat function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});