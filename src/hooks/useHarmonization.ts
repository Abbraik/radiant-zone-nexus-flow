// React hook for harmonization functionality
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HarmonizationService, type HarmonizationContext, type HarmonizationResult, type ConflictSuggestion } from '@/lib/harmonization/service';
import { toast } from 'sonner';

interface HubAllocation {
  alloc_id: string;
  snl_id: string;
  time_window: string; // tstzrange as string
  alloc_pct: number;
  task_id: string;
  region?: string;
  notes?: string;
}

interface HarmonizationConflict {
  conflict_id: string;
  snl_id: string;
  detected_at: string;
  risk_score: number;
  reason: string;
  tasks: string[];
  recommendation: string;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
}

export const useHarmonization = (taskId?: string) => {
  const queryClient = useQueryClient();
  const [isExpertMode, setIsExpertMode] = useState(false);

  // Fetch hub allocations for a task or all active allocations
  const { data: hubAllocations = [], isLoading: isAllocationsLoading } = useQuery({
    queryKey: ['hub-allocations', taskId],
    queryFn: async () => {
      const query = supabase
        .from('hub_allocations')
        .select('*');
      
      if (taskId) {
        query.eq('task_id', taskId);
      } else {
        // Get all current/future allocations
        query.gte('time_window', new Date().toISOString());
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HubAllocation[];
    }
  });

  // Fetch active conflicts
  const { data: conflicts = [], isLoading: isConflictsLoading } = useQuery({
    queryKey: ['harmonization-conflicts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('harmonization_conflicts')
        .select('*')
        .eq('resolved', false)
        .order('detected_at', { ascending: false });
      
      if (error) throw error;
      return data as HarmonizationConflict[];
    }
  });

  // Fetch hub load data
  const { data: hubLoads = [] } = useQuery({
    queryKey: ['hub-loads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_hub_load')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Evaluate harmonization for a proposed task
  const evaluateHarmonizationMutation = useMutation({
    mutationFn: async (context: HarmonizationContext) => {
      // Get existing allocations that might conflict
      const existingAllocations: any[] = [];
      
      for (const hubAlloc of context.task.hubAllocations) {
        const { data, error } = await supabase
          .from('hub_allocations')
          .select('*')
          .eq('snl_id', hubAlloc.snlId)
          .neq('task_id', context.task.taskId);
        
        if (error) throw error;
        if (data) existingAllocations.push(...data);
      }

      // Transform existing allocations to expected format
      const formattedExisting = existingAllocations.map(alloc => ({
        taskId: alloc.task_id,
        snlId: alloc.snl_id,
        allocPct: alloc.alloc_pct,
        region: alloc.region,
        timeWindow: {
          // Parse PostgreSQL tstzrange format
          start: new Date().toISOString(), // TODO: Parse actual range
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }));

      // Get hub load data
      const hubLoadMap: Record<string, number> = {};
      for (const load of hubLoads) {
        hubLoadMap[load.snl_id] = load.current_hub_load || 0;
      }

      // Build complete context
      const fullContext: HarmonizationContext = {
        ...context,
        existingAllocations: formattedExisting,
        hubLoad: hubLoadMap,
        localDispersion: 0.1 // TODO: Get from loop_signal_scores
      };

      // Evaluate harmonization
      const result = HarmonizationService.computeRisk(fullContext);

      // If there's a conflict, log it
      if (result.level !== 'CLEAR') {
        for (const hubAlloc of context.task.hubAllocations) {
          const { error } = await supabase
            .from('harmonization_conflicts')
            .insert({
              snl_id: hubAlloc.snlId,
              risk_score: result.riskScore,
              reason: result.reason,
              tasks: [context.task.taskId, ...result.conflictingTasks],
              recommendation: result.suggestions[0]?.description || 'Manual review required'
            });

          if (error) console.error('Failed to log conflict:', error);
        }
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['harmonization-conflicts'] });
      
      const message = HarmonizationService.formatResult(result, isExpertMode);
      
      if (result.level === 'CONFLICT') {
        toast.error('Harmonization Conflict', { description: message });
      } else if (result.level === 'TENSION') {
        toast.warning('Harmonization Tension', { description: message });
      } else {
        toast.success('Harmonization Clear', { description: message });
      }
    },
    onError: (error) => {
      toast.error('Harmonization Evaluation Failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Apply a suggestion
  const applySuggestionMutation = useMutation({
    mutationFn: async ({
      context,
      suggestion
    }: {
      context: HarmonizationContext;
      suggestion: ConflictSuggestion;
    }) => {
      const adjustedContext = HarmonizationService.applySuggestion(context, suggestion);
      
      // Re-evaluate with adjusted context
      const newResult = await evaluateHarmonizationMutation.mutateAsync(adjustedContext);
      
      return { adjustedContext, newResult };
    },
    onSuccess: ({ newResult }) => {
      toast.success('Suggestion Applied', {
        description: `Risk reduced to ${(newResult.riskScore * 100).toFixed(0)}%`
      });
    }
  });

  // Resolve a conflict
  const resolveConflictMutation = useMutation({
    mutationFn: async ({
      conflictId,
      resolution
    }: {
      conflictId: string;
      resolution: string;
    }) => {
      const { data, error } = await supabase
        .from('harmonization_conflicts')
        .update({
          resolved: true,
          resolved_by: 'user', // TODO: get actual user
          resolved_at: new Date().toISOString()
        })
        .eq('conflict_id', conflictId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harmonization-conflicts'] });
      toast.success('Conflict Resolved', {
        description: 'Harmonization conflict has been marked as resolved'
      });
    }
  });

  // Create hub allocation
  const createHubAllocationMutation = useMutation({
    mutationFn: async ({
      snlId,
      timeWindow,
      allocPct,
      taskId,
      region,
      notes
    }: {
      snlId: string;
      timeWindow: { start: string; end: string };
      allocPct: number;
      taskId: string;
      region?: string;
      notes?: string;
    }) => {
      // Convert to PostgreSQL tstzrange format
      const timeWindowRange = `[${timeWindow.start},${timeWindow.end})`;
      
      const { data, error } = await supabase
        .from('hub_allocations')
        .insert({
          snl_id: snlId,
          time_window: timeWindowRange,
          alloc_pct: allocPct,
          task_id: taskId,
          region,
          notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hub-allocations'] });
      toast.success('Hub Allocation Created');
    }
  });

  // Get conflicts for a specific task
  const getTaskConflicts = useCallback((taskId: string) => {
    return conflicts.filter(conflict => 
      conflict.tasks.includes(taskId)
    );
  }, [conflicts]);

  // Get hub allocation summary
  const allocationSummary = useMemo(() => {
    const summary: Record<string, { totalAlloc: number; taskCount: number }> = {};
    
    for (const alloc of hubAllocations) {
      if (!summary[alloc.snl_id]) {
        summary[alloc.snl_id] = { totalAlloc: 0, taskCount: 0 };
      }
      summary[alloc.snl_id].totalAlloc += alloc.alloc_pct;
      summary[alloc.snl_id].taskCount += 1;
    }
    
    return summary;
  }, [hubAllocations]);

  return {
    // Data
    hubAllocations,
    conflicts,
    hubLoads,
    allocationSummary,
    
    // State  
    isExpertMode,
    setIsExpertMode,
    
    // Loading states
    isLoading: isAllocationsLoading || isConflictsLoading,
    
    // Mutations
    evaluateHarmonization: evaluateHarmonizationMutation.mutate,
    applySuggestion: applySuggestionMutation.mutate,
    resolveConflict: resolveConflictMutation.mutate,
    createHubAllocation: createHubAllocationMutation.mutate,
    
    // Mutation states
    isEvaluating: evaluateHarmonizationMutation.isPending,
    isApplying: applySuggestionMutation.isPending,
    isResolving: resolveConflictMutation.isPending,
    isCreating: createHubAllocationMutation.isPending,
    
    // Helpers
    getTaskConflicts,
    formatResult: (result: HarmonizationResult) => 
      HarmonizationService.formatResult(result, isExpertMode),
    getRiskColor: HarmonizationService.getRiskColor
  };
};