import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ClaimTaskResponse {
  status: 'claimed';
  task_id: string;
  locked_by: string;
  locked_at: string;
  expires_at: string;
}

export const useClaimTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string): Promise<ClaimTaskResponse> => {
      // Call the claim task edge function
      const response = await supabase.functions.invoke('claim-task', {
        body: {
          task_id: taskId,
          user_agent: navigator.userAgent,
          ip_address: 'client' // Will be populated server-side
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to claim task');
      }

      // Check if the response contains an error (success: false)
      if (response.data?.success === false || response.data?.error) {
        throw new Error(response.data.error || 'Failed to claim task');
      }

      return response.data;
    },
    onSuccess: (data, taskId) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['claim-task-data', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks-v2'] });
      queryClient.invalidateQueries({ queryKey: ['5c', 'tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-assignments', taskId] });
      queryClient.invalidateQueries({ queryKey: ['task-locks', taskId] });
    },
    onError: (error: any) => {
      console.error('Failed to claim task:', error);
    }
  });
};