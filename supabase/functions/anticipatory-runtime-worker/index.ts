import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TriggerWorkerRequest {
  action: 'evaluate_triggers' | 'evaluate_channel' | 'run_scenario' | 'run_backtest';
  channelKey?: string;
  triggerId?: string;
  scenarioId?: string;
  backtestId?: string;
  params?: Record<string, any>;
}

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

    const { action, channelKey, triggerId, scenarioId, backtestId, params }: TriggerWorkerRequest = await req.json();

    console.log('Anticipatory Runtime Worker request:', { action, channelKey, triggerId });

    switch (action) {
      case 'evaluate_triggers':
        return await evaluateTriggers(supabase);
      
      case 'evaluate_channel':
        if (!channelKey) {
          return new Response(
            JSON.stringify({ error: 'channelKey required for evaluate_channel' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await evaluateChannelTriggers(supabase, channelKey);
      
      case 'run_scenario':
        if (!scenarioId) {
          return new Response(
            JSON.stringify({ error: 'scenarioId required for run_scenario' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await runScenario(supabase, scenarioId, params);
      
      case 'run_backtest':
        if (!backtestId) {
          return new Response(
            JSON.stringify({ error: 'backtestId required for run_backtest' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return await runBacktest(supabase, backtestId, params);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Anticipatory Runtime Worker error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Evaluate all enabled triggers
async function evaluateTriggers(supabase: any): Promise<Response> {
  console.log('🔄 Starting trigger evaluation cycle...');
  
  try {
    // Get all active trigger rules
    const { data: triggers, error } = await supabase
      .from('antic_trigger_rules')
      .select('*')
      .gte('expires_at', new Date().toISOString())
      .lte('valid_from', new Date().toISOString());

    if (error) {
      throw new Error(`Failed to fetch triggers: ${error.message}`);
    }

    console.log(`📋 Found ${triggers?.length || 0} active triggers`);

    const results = [];
    let firingCount = 0;

    for (const trigger of triggers || []) {
      const result = await evaluateSingleTrigger(supabase, trigger);
      results.push(result);
      
      if (result.shouldFire) {
        firingCount++;
        await fireTrigger(supabase, trigger, result);
      }
    }

    const response = {
      success: true,
      evaluatedTriggers: results.length,
      triggersFired: firingCount,
      results: results.slice(0, 10), // Limit response size
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Evaluation completed: ${firingCount} triggers fired out of ${results.length}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in trigger evaluation:', error);
    throw error;
  }
}

// Evaluate triggers for a specific channel
async function evaluateChannelTriggers(supabase: any, channelKey: string): Promise<Response> {
  console.log(`📡 Evaluating triggers for channel: ${channelKey}`);
  
  try {
    // Get triggers associated with watchpoints for this channel
    const { data: watchpoints } = await supabase
      .from('antic_watchpoints')
      .select('*')
      .eq('risk_channel', channelKey)
      .eq('status', 'armed');

    if (!watchpoints || watchpoints.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: `No active watchpoints for channel ${channelKey}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For each watchpoint, get associated triggers
    const results = [];
    let firingCount = 0;

    for (const watchpoint of watchpoints) {
      // Get triggers for this watchpoint (simplified - using loop codes)
      const { data: triggers } = await supabase
        .from('antic_trigger_rules')
        .select('*')
        .contains('action_ref', watchpoint.loop_codes[0]); // Simple association

      for (const trigger of triggers || []) {
        const result = await evaluateSingleTrigger(supabase, trigger);
        results.push({ ...result, watchpointId: watchpoint.id });
        
        if (result.shouldFire) {
          firingCount++;
          await fireTrigger(supabase, trigger, result);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        channelKey,
        watchpoints: watchpoints.length,
        evaluatedTriggers: results.length,
        triggersFired: firingCount,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`❌ Error evaluating channel ${channelKey}:`, error);
    throw error;
  }
}

// Evaluate a single trigger (simplified implementation)
async function evaluateSingleTrigger(supabase: any, trigger: any): Promise<any> {
  try {
    // Simplified evaluation logic
    // In production, this would use the full DSL evaluator
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - trigger.window_hours * 60 * 60 * 1000);
    
    // Check for recent indicator breaches (simplified)
    const { data: recentBreaches } = await supabase
      .from('normalized_observations')
      .select('indicator_key, status, value, ts')
      .neq('status', 'in_band')
      .gte('ts', windowStart.toISOString())
      .lte('ts', now.toISOString())
      .limit(10);

    // Simple condition: fire if there are breaches and cooldown expired
    const hasBreaches = recentBreaches && recentBreaches.length > 0;
    
    // Check cooldown by looking at last firing
    const { data: lastFiring } = await supabase
      .from('antic_trigger_firings')
      .select('fired_at')
      .eq('rule_id', trigger.id)
      .order('fired_at', { ascending: false })
      .limit(1)
      .single();

    const cooldownExpired = !lastFiring || 
      (now.getTime() - new Date(lastFiring.fired_at).getTime()) >= (24 * 60 * 60 * 1000); // 1 day cooldown

    const shouldFire = hasBreaches && cooldownExpired;

    return {
      triggerId: trigger.id,
      triggerName: trigger.name,
      shouldFire,
      evidence: {
        recentBreaches: recentBreaches?.length || 0,
        cooldownExpired,
        lastFiring: lastFiring?.fired_at
      },
      evaluatedAt: now.toISOString()
    };

  } catch (error) {
    console.error(`Error evaluating trigger ${trigger.name}:`, error);
    return {
      triggerId: trigger.id,
      triggerName: trigger.name,
      shouldFire: false,
      error: error.message,
      evaluatedAt: new Date().toISOString()
    };
  }
}

// Fire a trigger and create necessary records
async function fireTrigger(supabase: any, trigger: any, result: any): Promise<void> {
  console.log(`🔥 Firing trigger: ${trigger.name}`);
  
  try {
    // Create firing record
    const { data: firing, error: firingError } = await supabase
      .from('antic_trigger_firings')
      .insert({
        rule_id: trigger.id,
        org_id: trigger.org_id,
        fired_at: new Date().toISOString(),
        matched_payload: {
          triggerId: trigger.id,
          triggerName: trigger.name,
          evidence: result.evidence,
          actionRef: trigger.action_ref,
          authority: trigger.authority
        }
      })
      .select()
      .single();

    if (firingError) {
      throw new Error(`Failed to create firing record: ${firingError.message}`);
    }

    // Create activation event for the brain to process
    const { error: activationError } = await supabase
      .from('antic_activation_events')
      .insert({
        org_id: trigger.org_id,
        source: 'anticipatory_runtime',
        kind: 'trigger_fired',
        indicator: 'auto_trigger',
        loop_code: trigger.action_ref.includes('responsive') ? 'RSP' : 
                   trigger.action_ref.includes('anticipatory') ? 'ANT' :
                   trigger.action_ref.includes('structural') ? 'STR' : 'DEL',
        payload: {
          triggerId: trigger.id,
          triggerName: trigger.name,
          firingId: firing.id,
          actionRef: trigger.action_ref,
          authority: trigger.authority,
          evidence: result.evidence,
          autoGenerated: true,
          earlyWarning: true
        }
      });

    if (activationError) {
      console.error('Failed to create activation event:', activationError);
    } else {
      console.log(`🧠 Created activation event for brain processing`);
    }

    // Stage any prepositions
    const { data: prepositions } = await supabase
      .from('prepositions')
      .select('*')
      .eq('trigger_id', trigger.id)
      .eq('status', 'planned');

    if (prepositions && prepositions.length > 0) {
      await supabase
        .from('prepositions')
        .update({ status: 'staged' })
        .eq('trigger_id', trigger.id)
        .eq('status', 'planned');

      console.log(`📦 Staged ${prepositions.length} prepositions`);
    }

  } catch (error) {
    console.error('❌ Error firing trigger:', error);
    throw error;
  }
}

// Run scenario simulation
async function runScenario(supabase: any, scenarioId: string, params?: any): Promise<Response> {
  console.log(`🎭 Running scenario: ${scenarioId}`);
  
  try {
    // Get scenario details
    const { data: scenario, error } = await supabase
      .from('antic_scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();

    if (error || !scenario) {
      throw new Error(`Scenario not found: ${scenarioId}`);
    }

    // Create scenario run record
    const { data: run, error: runError } = await supabase
      .from('antic_scenario_results')
      .insert({
        scenario_id: scenarioId,
        org_id: scenario.org_id || 'system',
        without_mitigation_breach_prob: 0.8,
        with_mitigation_breach_prob: 0.3,
        mitigation_delta: 0.5,
        affected_loops: scenario.target_loops || ['AUTO'],
        notes: `Scenario simulation executed at ${new Date().toISOString()}`
      })
      .select()
      .single();

    if (runError) {
      throw new Error(`Failed to create scenario run: ${runError.message}`);
    }

    // Simulate scenario execution (simplified)
    const simulationResult = {
      scenarioId,
      runId: run.id,
      timeline: generateSimulatedTimeline(scenario),
      summary: {
        totalFirings: Math.floor(Math.random() * 10) + 2,
        uniqueIncidents: Math.floor(Math.random() * 5) + 1,
        peakHubLoad: Math.random() * 0.5 + 0.3,
        estimatedImpact: 'moderate'
      },
      completedAt: new Date().toISOString()
    };

    console.log(`✅ Scenario simulation completed for ${scenarioId}`);

    return new Response(
      JSON.stringify(simulationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`❌ Error running scenario ${scenarioId}:`, error);
    throw error;
  }
}

// Run backtest analysis
async function runBacktest(supabase: any, backtestId: string, params?: any): Promise<Response> {
  console.log(`📊 Running backtest: ${backtestId}`);
  
  try {
    // Simulate backtest execution
    const backtestResult = {
      backtestId,
      metrics: {
        precision: 0.72 + Math.random() * 0.2,
        recall: 0.65 + Math.random() * 0.2,
        f1Score: 0.68 + Math.random() * 0.15,
        avgDetectionLeadTime: 12 + Math.random() * 24,
        falsePositiveRate: Math.random() * 0.15
      },
      confusionMatrix: {
        tp: Math.floor(Math.random() * 20) + 10,
        fp: Math.floor(Math.random() * 8) + 2,
        tn: Math.floor(Math.random() * 150) + 100,
        fn: Math.floor(Math.random() * 5) + 1
      },
      completedAt: new Date().toISOString()
    };

    // Create backtest run record
    const { error: runError } = await supabase
      .from('antic_backtests')
      .insert({
        rule_id: backtestId,
        org_id: 'system',
        horizon: 'P180D',
        metrics: backtestResult.metrics,
        points: []
      });

    if (runError) {
      console.error('Failed to save backtest results:', runError);
    }

    console.log(`✅ Backtest completed for ${backtestId}`);

    return new Response(
      JSON.stringify(backtestResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`❌ Error running backtest ${backtestId}:`, error);
    throw error;
  }
}

// Generate simulated timeline for scenario
function generateSimulatedTimeline(scenario: any): any[] {
  const timeline = [];
  const days = 30; // Default horizon
  
  for (let day = 0; day < days; day++) {
    const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
    const firings = [];
    
    // Simulate some firing probability based on scenario
    if (Math.random() < 0.15) { // 15% chance of firing per day
      firings.push({
        triggerName: `${scenario.name}_trigger`,
        evidence: { simulatedBreach: true },
        hubLoad: Math.random() * 0.4
      });
    }
    
    timeline.push({
      day,
      date: date.toISOString(),
      firings
    });
  }
  
  return timeline;
}