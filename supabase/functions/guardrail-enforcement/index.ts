import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GuardrailRequest {
  taskId: string;
  changeKind: 'start' | 'update' | 'publish' | 'renew' | 'close';
  deltaEstimate?: number;
  coverageEstimatePct?: number;
  substepsRequested?: number;
  actor: string;
  payload: Record<string, any>;
}

interface GuardrailPolicy {
  timebox_hours: number;
  daily_delta_limit?: number;
  coverage_limit_pct?: number;
  concurrent_substeps_limit?: number;
  renewal_limit: number;
  evaluation_required_after_renewals: number;
}

interface Task {
  id: string;
  created_at: string;
  status: string;
}

interface TaskRenewal {
  renewal_no: number;
  requires_evaluation: boolean;
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

    const { taskId, changeKind, deltaEstimate, coverageEstimatePct, substepsRequested, actor, payload }: GuardrailRequest = await req.json();

    console.log('Guardrail enforcement request:', { taskId, changeKind, actor });

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('claims') // Using existing 5C claims table
      .select('id, created_at, status')
      .eq('id', taskId)
      .single();

    if (taskError || !task) {
      console.error('Task not found:', taskError);
      return new Response(
        JSON.stringify({ error: 'Task not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get guardrail policy (using default for now)
    const policy: GuardrailPolicy = {
      timebox_hours: 720, // 30 days default
      daily_delta_limit: 0.02,
      coverage_limit_pct: 0.2,
      concurrent_substeps_limit: 3,
      renewal_limit: 2,
      evaluation_required_after_renewals: 2
    };

    // Get renewal count
    const { data: renewals } = await supabase
      .from('task_renewals')
      .select('renewal_no, requires_evaluation')
      .eq('task_id', taskId)
      .order('renewed_at', { ascending: false })
      .limit(1);

    const currentRenewals = renewals?.[0]?.renewal_no ?? 0;

    // Evaluate guardrails
    const now = new Date();
    const taskStart = new Date(task.created_at);
    const timeboxEndMs = taskStart.getTime() + (policy.timebox_hours * 60 * 60 * 1000);
    const isExpired = now.getTime() > timeboxEndMs;

    const rulesFired: Array<{ rule: string; message: string }> = [];
    let result: 'allow' | 'throttle' | 'block' = 'allow';
    let adjusted: any = {};

    // Rule 1: Time-box expired (hard block unless renew|close)
    if (isExpired && !['renew', 'close'].includes(changeKind)) {
      rulesFired.push({
        rule: 'TIMEBOX_EXPIRED',
        message: `Time limit of ${policy.timebox_hours}h reached. Renewal or task closure required.`
      });
      result = 'block';
    }

    // Rule 2: Renewal limit exceeded without evaluation (hard block)
    if (changeKind === 'renew') {
      if (currentRenewals >= policy.renewal_limit) {
        rulesFired.push({
          rule: 'RENEWAL_LIMIT_EXCEEDED',
          message: `Renewal limit (${policy.renewal_limit}) exceeded. Reflexive evaluation required.`
        });
        result = 'block';
      }
    }

    // Only apply throttling rules if not already blocked
    if (result !== 'block') {
      // Rule 3: Daily delta limit (throttle)
      if (policy.daily_delta_limit && deltaEstimate !== undefined) {
        if (deltaEstimate > policy.daily_delta_limit) {
          const throttledDelta = policy.daily_delta_limit;
          rulesFired.push({
            rule: 'DAILY_DELTA_LIMIT',
            message: `Delta ${(deltaEstimate * 100).toFixed(1)}% exceeds limit ${(policy.daily_delta_limit * 100).toFixed(1)}%. Throttled to ${(throttledDelta * 100).toFixed(1)}%.`
          });
          adjusted.deltaEstimate = throttledDelta;
          result = 'throttle';
        }
      }

      // Rule 4: Coverage limit (throttle)
      if (policy.coverage_limit_pct && coverageEstimatePct !== undefined) {
        if (coverageEstimatePct > policy.coverage_limit_pct) {
          const throttledCoverage = policy.coverage_limit_pct;
          rulesFired.push({
            rule: 'COVERAGE_LIMIT',
            message: `Coverage ${(coverageEstimatePct * 100).toFixed(1)}% exceeds limit ${(policy.coverage_limit_pct * 100).toFixed(1)}%. Throttled to ${(throttledCoverage * 100).toFixed(1)}%.`
          });
          adjusted.coverageEstimatePct = throttledCoverage;
          result = 'throttle';
        }
      }

      // Rule 5: Concurrent substeps limit (throttle)
      if (policy.concurrent_substeps_limit && substepsRequested !== undefined) {
        if (substepsRequested > policy.concurrent_substeps_limit) {
          const throttledSubsteps = policy.concurrent_substeps_limit;
          rulesFired.push({
            rule: 'CONCURRENT_SUBSTEPS_LIMIT',
            message: `Requested ${substepsRequested} substeps exceeds limit ${policy.concurrent_substeps_limit}. Throttled to ${throttledSubsteps}.`
          });
          adjusted.substepsRequested = throttledSubsteps;
          result = 'throttle';
        }
      }
    }

    const allowed = result !== 'block';
    const evaluationMs = Date.now() % 100; // Mock timing

    // Log actuation attempt
    const { error: attemptError } = await supabase
      .from('actuation_attempts')
      .insert({
        task_id: taskId,
        actor,
        change_kind: changeKind,
        delta_estimate: deltaEstimate,
        coverage_estimate_pct: coverageEstimatePct,
        payload,
        allowed,
        reason: rulesFired.map(r => r.message).join('; ') || 'All guardrails passed',
        evaluated_by: 'guardrail-engine-v1',
        evaluated_ms: evaluationMs
      });

    if (attemptError) {
      console.error('Failed to log actuation attempt:', attemptError);
    }

    // Log guardrail enforcement events
    for (const rule of rulesFired) {
      const { error: enforcementError } = await supabase
        .from('guardrail_enforcements')
        .insert({
          task_id: taskId,
          rule: rule.rule,
          result,
          details: { message: rule.message, adjusted },
          actor
        });

      if (enforcementError) {
        console.error('Failed to log enforcement event:', enforcementError);
      }
    }

    // Handle renewal
    if (changeKind === 'renew' && allowed) {
      const newRenewalNo = currentRenewals + 1;
      const requiresEvaluation = newRenewalNo >= policy.evaluation_required_after_renewals;

      const { error: renewalError } = await supabase
        .from('task_renewals')
        .insert({
          task_id: taskId,
          renewal_no: newRenewalNo,
          requires_evaluation: requiresEvaluation
        });

      if (renewalError) {
        console.error('Failed to log renewal:', renewalError);
      }
    }

    const response = {
      result,
      allowed,
      rulesFired,
      adjusted: Object.keys(adjusted).length > 0 ? adjusted : undefined,
      evaluationMs,
      currentRenewals
    };

    console.log('Guardrail enforcement result:', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Guardrail enforcement error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});