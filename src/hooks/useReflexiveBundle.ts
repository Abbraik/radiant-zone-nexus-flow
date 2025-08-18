import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReflexiveContext {
  loop: any;
  scorecard: any;
  tri_series: Array<{
    at: string;
    t_value: number;
    r_value: number;
    i_value: number;
    tag?: string;
  }>;
  breach_timeline: Array<{
    at: string;
    breach_type: string;
    value: number;
    threshold_value: number;
    severity_score: number;
    duration_minutes: number;
  }>;
  current_band: {
    id: string;
    indicator: string;
    lower_bound: number;
    upper_bound: number;
    asymmetry: number;
    smoothing_alpha: number;
    notes?: string;
    updated_at: string;
  };
  current_srt: {
    id: string;
    window_start: string;
    window_end: string;
    reflex_horizon: string;
    cadence: string;
    updated_at: string;
  };
  suggestions: Array<{
    id: string;
    suggestion_type: string;
    title: string;
    description: string;
    rationale: string;
    risk_score: number;
    confidence: number;
    proposed_changes: any;
    impact_level: string;
    created_at: string;
  }>;
}

export interface BandChanges {
  indicator?: string;
  lower_bound?: number;
  upper_bound?: number;
  asymmetry?: number;
  smoothing_alpha?: number;
  notes?: string;
}

export interface SRTChanges {
  window_start?: string;
  window_end?: string;
  reflex_horizon?: string;
  cadence?: string;
}

export const useReflexiveBundle = (loopId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getReflexiveContext = useQuery({
    queryKey: ['reflexive-context', loopId],
    queryFn: async (): Promise<ReflexiveContext> => {
      const { data, error } = await supabase.rpc('get_reflexive_context', {
        loop_uuid: loopId
      });
      
      if (error) throw error;
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(data.error as string);
      }
      
      return data as unknown as ReflexiveContext;
    },
    enabled: !!loopId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const generateSuggestions = useMutation({
    mutationFn: async (lookbackDays: number = 60) => {
      const { data, error } = await supabase.rpc('suggest_retunes', {
        loop_uuid: loopId,
        lookback_days: lookbackDays
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflexive-context', loopId] });
      toast({
        title: "Suggestions Generated",
        description: "New retune suggestions have been generated based on recent data.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Generate Suggestions",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyRetune = useMutation({
    mutationFn: async ({
      bandChanges,
      srtChanges,
      rationale,
      approverId,
      taskId
    }: {
      bandChanges?: BandChanges;
      srtChanges?: SRTChanges;
      rationale: string;
      approverId?: string;
      taskId?: string;
    }) => {
      const { data, error } = await supabase.rpc('apply_retune', {
        loop_uuid: loopId,
        band_changes: bandChanges ? JSON.stringify(bandChanges) : null,
        srt_changes: srtChanges ? JSON.stringify(srtChanges) : null,
        rationale_text: rationale,
        approver_id: approverId || null,
        task_uuid: taskId || null
      });
      
      if (error) throw error;
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(data.error as string);
      }
      
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['reflexive-context', loopId] });
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      
      if (data && typeof data === 'object' && data.requires_approval) {
        toast({
          title: "Retune Submitted for Approval",
          description: "Your retune requires manager approval due to significant changes.",
        });
      } else {
        toast({
          title: "Retune Applied Successfully",
          description: "Changes will be evaluated at the next heartbeat.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to Apply Retune",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const dismissSuggestion = useMutation({
    mutationFn: async (suggestionId: string) => {
      const { error } = await supabase
        .from('retune_suggestions')
        .update({ status: 'dismissed' })
        .eq('id', suggestionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflexive-context', loopId] });
      toast({
        title: "Suggestion Dismissed",
        description: "The suggestion has been removed from your list.",
      });
    },
  });

  const simulateRetune = useMutation({
    mutationFn: async ({
      bandChanges,
      srtChanges,
      lookbackDays = 60
    }: {
      bandChanges?: BandChanges;
      srtChanges?: SRTChanges;
      lookbackDays?: number;
    }) => {
      // Client-side simulation logic
      const context = getReflexiveContext.data;
      if (!context) throw new Error('No context available for simulation');

      // Simple simulation: calculate projected changes
      const currentBand = context.current_band;
      const triSeries = context.tri_series;
      
      if (!currentBand || !triSeries.length) {
        return {
          before: { in_band_percentage: 0, breach_count: 0 },
          after: { in_band_percentage: 0, breach_count: 0 },
          improvement: { variance_reduction: 0, false_positive_reduction: 0 }
        };
      }

      // Calculate current performance
      const currentLower = currentBand.lower_bound;
      const currentUpper = currentBand.upper_bound;
      const currentInBand = triSeries.filter(tri => {
        const avgValue = (tri.t_value + tri.r_value + tri.i_value) / 3;
        return avgValue >= currentLower && avgValue <= currentUpper;
      }).length;

      // Calculate projected performance with changes
      const newLower = bandChanges?.lower_bound ?? currentLower;
      const newUpper = bandChanges?.upper_bound ?? currentUpper;
      const projectedInBand = triSeries.filter(tri => {
        const avgValue = (tri.t_value + tri.r_value + tri.i_value) / 3;
        return avgValue >= newLower && avgValue <= newUpper;
      }).length;

      return {
        before: {
          in_band_percentage: (currentInBand / triSeries.length) * 100,
          breach_count: triSeries.length - currentInBand,
          avg_variance: triSeries.reduce((sum, tri) => 
            sum + Math.abs(tri.t_value - tri.r_value), 0) / triSeries.length
        },
        after: {
          in_band_percentage: (projectedInBand / triSeries.length) * 100,
          breach_count: triSeries.length - projectedInBand,
          avg_variance: triSeries.reduce((sum, tri) => 
            sum + Math.abs(tri.t_value - tri.r_value), 0) / triSeries.length
        },
        improvement: {
          variance_reduction: Math.max(0, (currentInBand - projectedInBand) * 0.1),
          false_positive_reduction: Math.max(0, (projectedInBand - currentInBand) * 0.15),
          risk_grade: bandChanges?.lower_bound && bandChanges?.upper_bound ? 
            (Math.abs(bandChanges.upper_bound - bandChanges.lower_bound) > 
             Math.abs(currentUpper - currentLower) * 1.2 ? 'low' : 'medium') : 'low'
        }
      };
    },
  });

  return {
    // Queries
    context: getReflexiveContext.data,
    isLoading: getReflexiveContext.isLoading,
    error: getReflexiveContext.error,
    
    // Mutations
    generateSuggestions,
    applyRetune,
    dismissSuggestion,
    simulateRetune,
    
    // Helper functions
    refresh: () => queryClient.invalidateQueries({ queryKey: ['reflexive-context', loopId] }),
  };
};