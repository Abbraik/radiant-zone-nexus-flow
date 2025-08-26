// React hook for guardrails functionality
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GuardrailEngine, type GuardrailContext, type GuardrailDecision } from '@/lib/guardrails/engine';
import { toast } from 'sonner';

interface GuardrailPolicy {
  policy_id: string;
  template_key: string;
  capacity: string;
  name: string;
  timebox_hours: number;
  daily_delta_limit?: number;
  coverage_limit_pct?: number;
  concurrent_substeps_limit?: number;
  renewal_limit: number;
  evaluation_required_after_renewals: number;
}

interface TaskGuardrail {
  id: string;
  task_id: string;
  policy_id: string;
  effective_from: string;
  config: Record<string, any>;
}

interface ActuationAttempt {
  task_id: string;
  change_kind: 'start' | 'update' | 'publish' | 'renew' | 'close';
  delta_estimate?: number;
  coverage_estimate_pct?: number;
  payload?: Record<string, any>;
}

export const useGuardrails = (taskId?: string) => {
  const queryClient = useQueryClient();
  const [isExpertMode, setIsExpertMode] = useState(false);

  // Fetch guardrail policies
  const { data: policies = [], isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['guardrail-policies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guardrail_policies')
        .select('*')
        .order('capacity', { ascending: true });
      
      if (error) throw error;
      return data as GuardrailPolicy[];
    }
  });

  // Fetch task guardrail (if taskId provided)
  const { data: taskGuardrail, isLoading: isTaskGuardrailLoading } = useQuery({
    queryKey: ['task-guardrail', taskId],
    queryFn: async () => {
      if (!taskId) return null;
      
      const { data, error } = await supabase
        .from('task_guardrails')
        .select(`
          *,
          guardrail_policies (*)
        `)
        .eq('task_id', taskId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!taskId
  });

  // Fetch task renewals
  const { data: renewals = [], isLoading: isRenewalsLoading } = useQuery({
    queryKey: ['task-renewals', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      
      const { data, error } = await supabase
        .from('task_renewals')
        .select('*')
        .eq('task_id', taskId)
        .order('renewed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!taskId
  });

  // Evaluate actuation attempt
  const evaluateAttemptMutation = useMutation({
    mutationFn: async ({ 
      taskId, 
      attempt, 
      taskCreatedAt 
    }: { 
      taskId: string; 
      attempt: ActuationAttempt; 
      taskCreatedAt: string;
    }) => {
      // Get task guardrail and policy
      const { data: taskGuardrail } = await supabase
        .from('task_guardrails')
        .select(`
          *,
          guardrail_policies (*)
        `)
        .eq('task_id', taskId)
        .single();

      if (!taskGuardrail) {
        throw new Error('No guardrail policy found for task');
      }

      const policy = taskGuardrail.guardrail_policies;
      const renewalCount = renewals.length;

      // Build context
      const context: GuardrailContext = {
        policy: {
          timeboxHours: policy.timebox_hours,
          dailyDeltaLimit: policy.daily_delta_limit || undefined,
          coverageLimitPct: policy.coverage_limit_pct || undefined,
          concurrentSubstepsLimit: policy.concurrent_substeps_limit || undefined,
          renewalLimit: policy.renewal_limit,
          evaluationRequiredAfterRenewals: policy.evaluation_required_after_renewals
        },
        task: {
          taskId,
          createdAt: taskCreatedAt,
          renewals: renewalCount
        },
        now: new Date().toISOString(),
        attempt: {
          changeKind: attempt.change_kind,
          deltaEstimate: attempt.delta_estimate,
          coverageEstimatePct: attempt.coverage_estimate_pct
        }
      };

      // Evaluate guardrails
      const decision = GuardrailEngine.evaluateGuardrails(context);

      // Log attempt
      const { error: attemptError } = await supabase
        .from('actuation_attempts')
        .insert({
          task_id: taskId,
          actor: 'user', // TODO: get actual user
          change_kind: attempt.change_kind,
          delta_estimate: attempt.delta_estimate,
          coverage_estimate_pct: attempt.coverage_estimate_pct,
          payload: attempt.payload || {},
          allowed: decision.result === 'allow',
          reason: GuardrailEngine.formatDecision(decision, true),
          evaluated_by: 'guardrail-engine',
          evaluated_ms: decision.evaluationMs
        });

      if (attemptError) console.error('Failed to log actuation attempt:', attemptError);

      // Log enforcement events
      for (const rule of decision.rulesFired) {
        const { error: enforcementError } = await supabase
          .from('guardrail_enforcements')
          .insert({
            task_id: taskId,
            rule: rule.rule,
            result: decision.result,
            details: { 
              message: rule.message,
              adjusted: decision.adjusted
            },
            actor: 'user'
          });

        if (enforcementError) console.error('Failed to log enforcement:', enforcementError);
      }

      return decision;
    },
    onSuccess: (decision) => {
      const message = GuardrailEngine.formatDecision(decision, isExpertMode);
      
      if (decision.result === 'block') {
        toast.error('Action Blocked', { description: message });
      } else if (decision.result === 'throttle') {
        toast.warning('Limits Applied', { description: message });
      } else {
        toast.success('Action Allowed', { description: message });
      }
    },
    onError: (error) => {
      toast.error('Guardrail Evaluation Failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create task renewal
  const renewTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const renewalCount = renewals.length + 1;
      const requiresEval = taskGuardrail && 
        renewalCount >= taskGuardrail.guardrail_policies?.evaluation_required_after_renewals;

      const { data, error } = await supabase
        .from('task_renewals')
        .insert({
          task_id: taskId,
          renewal_no: renewalCount,
          requires_evaluation: requiresEval
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (renewal) => {
      queryClient.invalidateQueries({ queryKey: ['task-renewals', taskId] });
      
      if (renewal.requires_evaluation) {
        toast.warning('Evaluation Required', {
          description: 'This renewal requires Reflexive evaluation before proceeding'
        });
      } else {
        toast.success('Task Renewed', {
          description: `Renewal #${renewal.renewal_no} approved`
        });
      }
    }
  });

  // Create override event
  const createOverrideMutation = useMutation({
    mutationFn: async ({
      taskId,
      scope,
      before,
      after,
      rationale
    }: {
      taskId: string;
      scope: 'guardrail' | 'harmonization';
      before: Record<string, any>;
      after: Record<string, any>;
      rationale: string;
    }) => {
      const { data, error } = await supabase
        .from('override_events')
        .insert({
          task_id: taskId,
          actor: 'user', // TODO: get actual user
          scope,
          before,
          after,
          rationale
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Override Applied', {
        description: 'Manager override has been logged and applied'
      });
    }
  });

  // Get policy for template/capacity
  const getPolicyForTemplate = useCallback((templateKey: string, capacity: string) => {
    return policies.find(p => 
      p.template_key === templateKey && p.capacity === capacity
    );
  }, [policies]);

  // Get timebox status
  const timeboxStatus = useMemo(() => {
    if (!taskGuardrail?.guardrail_policies || !taskId) return null;
    
    return GuardrailEngine.getTimeboxStatus(
      taskGuardrail.effective_from,
      taskGuardrail.guardrail_policies.timebox_hours
    );
  }, [taskGuardrail, taskId]);

  // Check if renewal is needed
  const needsRenewal = useMemo(() => {
    return timeboxStatus?.isExpired || false;
  }, [timeboxStatus]);

  // Check if evaluation is required
  const needsEvaluation = useMemo(() => {
    if (!taskGuardrail?.guardrail_policies) return false;
    
    const policy = taskGuardrail.guardrail_policies;
    return renewals.length >= policy.evaluation_required_after_renewals;
  }, [taskGuardrail, renewals.length]);

  return {
    // Data
    policies,
    taskGuardrail,
    renewals,
    timeboxStatus,
    
    // State
    needsRenewal,
    needsEvaluation,
    isExpertMode,
    setIsExpertMode,
    
    // Loading states
    isLoading: isPoliciesLoading || isTaskGuardrailLoading || isRenewalsLoading,
    
    // Mutations
    evaluateAttempt: evaluateAttemptMutation.mutate,
    renewTask: renewTaskMutation.mutate,
    createOverride: createOverrideMutation.mutate,
    
    // Mutation states
    isEvaluating: evaluateAttemptMutation.isPending,
    isRenewing: renewTaskMutation.isPending,
    isOverriding: createOverrideMutation.isPending,
    
    // Helpers
    getPolicyForTemplate,
    formatDecision: (decision: GuardrailDecision) => 
      GuardrailEngine.formatDecision(decision, isExpertMode)
  };
};