// React hooks for Capacity Brain functionality
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capacityBrainClient } from '@/services/capacity-brain/client';
import { decideActivation } from '@/services/capacity-brain/decide';
import type { 
  ActivationInput, 
  ActivationDecision, 
  OverrideFormData,
  TaskCreationResult
} from '@/services/capacity-brain/types';
import { useToast } from '@/hooks/use-toast';

// Get activation input for a loop
export function useActivationInput(loopId: string, window = '14d') {
  return useQuery({
    queryKey: ['capacity-brain', 'activation-input', loopId, window],
    queryFn: () => capacityBrainClient.getActivationInput(loopId, window),
    enabled: !!loopId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
}

// Get activation decision (pure function, cached)
export function useActivationDecision(input: ActivationInput | null) {
  return useQuery({
    queryKey: ['capacity-brain', 'decision', input],
    queryFn: () => input ? decideActivation(input) : null,
    enabled: !!input,
    staleTime: Infinity, // Pure function result never goes stale
  });
}

// Create activation (with server-side decision recording)
export function useActivate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: capacityBrainClient.activate.bind(capacityBrainClient),
    onSuccess: (data: any) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ['capacity-brain', 'history', data.decision.loopId] 
      });
      
      toast({
        title: "Capacity Activated",
        description: `${data.decision.capacity} capacity activated for loop`,
      });
    },
    onError: (error) => {
      toast({
        title: "Activation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Create override
export function useOverride() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ eventId, overrideData }: { 
      eventId: string; 
      overrideData: OverrideFormData 
    }) => capacityBrainClient.override(eventId, overrideData),
    onSuccess: (decision, variables) => {
      // Invalidate history and overrides
      queryClient.invalidateQueries({ 
        queryKey: ['capacity-brain', 'overrides', variables.eventId] 
      });
      
      toast({
        title: "Override Created",
        description: `Decision overridden to ${decision.capacity}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Override Failed", 
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Create task from decision
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: capacityBrainClient.createTask.bind(capacityBrainClient),
    onSuccess: (result: TaskCreationResult) => {
      if (result.is_existing) {
        toast({
          title: "Existing Task Found",
          description: `Continuing with existing task`,
        });
      } else {
        toast({
          title: "Task Created",
          description: `New ${result.template} task created`,
        });
      }
      
      // Invalidate task-related queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Task Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Get activation history for a loop
export function useActivationHistory(loopId: string, limit = 10) {
  return useQuery({
    queryKey: ['capacity-brain', 'history', loopId, limit],
    queryFn: () => capacityBrainClient.getActivationHistory(loopId, limit),
    enabled: !!loopId,
    staleTime: 60000, // 1 minute
  });
}

// Get overrides for an event
export function useOverrides(eventId: string) {
  return useQuery({
    queryKey: ['capacity-brain', 'overrides', eventId],
    queryFn: () => capacityBrainClient.getOverrides(eventId),
    enabled: !!eventId,
    staleTime: 30000, // 30 seconds
  });
}

// Check fingerprint existence (for UI feedback)
export function useCheckFingerprint(fingerprint: string) {
  return useQuery({
    queryKey: ['capacity-brain', 'fingerprint', fingerprint],
    queryFn: () => capacityBrainClient.checkFingerprint(fingerprint),
    enabled: !!fingerprint,
    staleTime: 300000, // 5 minutes
  });
}

// Combined hook for activation flow
export function useActivationFlow(loopId: string) {
  const inputQuery = useActivationInput(loopId);
  const decisionQuery = useActivationDecision(inputQuery.data || null);
  const activateMutation = useActivate();
  const createTaskMutation = useCreateTask();
  const overrideMutation = useOverride();

  const isLoading = inputQuery.isLoading || decisionQuery.isLoading;
  const error = inputQuery.error || decisionQuery.error;

  return {
    // Data
    input: inputQuery.data,
    decision: decisionQuery.data,
    
    // State
    isLoading,
    error,
    
    // Actions
    activate: activateMutation.mutateAsync,
    override: overrideMutation.mutateAsync,
    createTask: createTaskMutation.mutateAsync,
    
    // Mutation states
    isActivating: activateMutation.isPending,
    isOverriding: overrideMutation.isPending,
    isCreatingTask: createTaskMutation.isPending,
  };
}