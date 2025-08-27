import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GuardrailCheckResult {
  result: 'allow' | 'throttle' | 'block';
  reason?: string;
  details?: {
    concurrent_substeps_exceeded?: boolean;
    timebox_exceeded?: boolean;
    daily_delta_limit_exceeded?: boolean;
    coverage_limit_exceeded?: boolean;
  };
}

export const useGuardrailCheck = (taskId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['guardrail-check', taskId],
    queryFn: async (): Promise<GuardrailCheckResult> => {
      // Call the guardrail check edge function
      const response = await supabase.functions.invoke('check-guardrails', {
        body: {
          task_id: taskId,
          actor: 'current-user' // Would be auth.uid() in production
        }
      });

      if (response.error) {
        console.error('Guardrail check failed:', response.error);
        // Return allow on error to not block users
        return {
          result: 'allow',
          reason: 'Guardrail check unavailable'
        };
      }

      return response.data as GuardrailCheckResult;
    },
    enabled: enabled && !!taskId,
    staleTime: 1000 * 30, // 30 seconds - guardrails should be checked frequently
    retry: 1, // Don't retry much as this could block UI
  });
};