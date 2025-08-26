import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGoldenScenarioEnrichment } from './useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';
import { getReflexiveScenarioData } from '@/utils/scenarioDataHelpers';

export function useReflexiveData(loopId: string, task?: EnhancedTask5C) {
  const queryClient = useQueryClient();
  const enrichedTask = useGoldenScenarioEnrichment(task || null);
  
  // Generate scenario-based data if available
  const getScenarioData = () => {
    if (!enrichedTask) return null;
    return getReflexiveScenarioData(enrichedTask);
  };
  
  const scenarioData = getScenarioData();

  // Fetch reflex memory (using controller_tunings as proxy)
  const { data: reflexMemory = [], isLoading: isLoadingMemory } = useQuery({
    queryKey: ['reflexMemory', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('controller_tunings')
        .select('*')
        .eq('loop_code', loopId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch controller tunings
  const { data: controllerTunings = [] } = useQuery({
    queryKey: ['controllerTunings', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('controller_tunings')
        .select('*')
        .eq('loop_code', loopId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch band weight changes
  const { data: bandWeightChanges = [] } = useQuery({
    queryKey: ['bandWeightChanges', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('band_weight_changes')
        .select('*')
        .eq('loop_code', loopId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch scorecard data (using compass snapshots as proxy)
  const { data: scorecardData, isLoading: isLoadingScorecard } = useQuery({
    queryKey: ['scorecardData', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compass_snapshots')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!loopId
  });

  // Fetch DE bands for current loop
  const { data: deBands = [] } = useQuery({
    queryKey: ['reflexiveDeBands', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('de_bands_5c')
        .select('*')
        .eq('loop_id', loopId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Create reflex memory entry (using controller_tunings)
  const createReflexMemory = useMutation({
    mutationFn: async (memoryData: any) => {
      const { data, error } = await supabase
        .from('controller_tunings')
        .insert({
          loop_code: loopId,
          indicator: memoryData.indicator || 'primary',
          before: memoryData.before || {},
          after: memoryData.after || {},
          rationale: memoryData.description || 'Memory entry',
          ...memoryData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflexMemory', loopId] });
      toast.success('Memory entry created');
    }
  });

  // Update DE bands
  const updateDeBands = useMutation({
    mutationFn: async (bandData: any) => {
      const { data, error } = await supabase
        .from('de_bands_5c')
        .upsert({
          loop_id: loopId,
          indicator: bandData.indicator || 'primary',
          lower_bound: bandData.lower_bound,
          upper_bound: bandData.upper_bound,
          smoothing_alpha: bandData.smoothing_alpha,
          notes: bandData.notes,
          ...bandData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflexiveDeBands', loopId] });
      toast.success('DE bands updated');
    }
  });

  // Save controller tuning
  const saveControllerTuning = useMutation({
    mutationFn: async (tuningData: any) => {
      const { data, error } = await supabase
        .from('controller_tunings')
        .insert({
          loop_code: loopId,
          indicator: tuningData.indicator,
          before: tuningData.before,
          after: tuningData.after,
          rationale: tuningData.rationale,
          rmse_delta: tuningData.rmse_delta,
          oscillation_delta: tuningData.oscillation_delta,
          ...tuningData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['controllerTunings', loopId] });
      toast.success('Controller tuning saved');
    }
  });

  // Update scorecard (using compass snapshots)
  const updateScorecard = useMutation({
    mutationFn: async (scorecardUpdate: any) => {
      const { data, error } = await supabase
        .from('compass_snapshots')
        .upsert({
          loop_id: loopId,
          as_of: new Date().toISOString().split('T')[0],
          ci: scorecardUpdate.ci || 0.5,
          tri: scorecardUpdate.tri || {},
          drift: scorecardUpdate.drift || {},
          ...scorecardUpdate
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecardData', loopId] });
      toast.success('Scorecard updated');
    }
  });

  // Use scenario data if available
  return {
    reflexMemory: reflexMemory.length > 0 ? reflexMemory : (scenarioData ? [{
      id: 'memory-1',
      rationale: 'System learning from recent patterns',
      after: scenarioData.decision,
      created_at: new Date().toISOString()
    }] : []),
    controllerTunings: controllerTunings.length > 0 ? controllerTunings : (scenarioData ? [{
      id: 'tuning-1',
      indicator: 'primary',
      before: { kp: 0.5, ki: 0.2, kd: 0.1 },
      after: { kp: 0.6, ki: 0.25, kd: 0.12 },
      rationale: 'Improved response to recent oscillations'
    }] : []),
    bandWeightChanges: bandWeightChanges.length > 0 ? bandWeightChanges : (scenarioData ? [{
      id: 'weight-1',
      before: { transparency: 0.4, responsiveness: 0.3, inclusiveness: 0.3 },
      after: { transparency: 0.35, responsiveness: 0.35, inclusiveness: 0.3 },
      rationale: 'Rebalancing based on performance data'
    }] : []),
    scorecardData: scorecardData || (scenarioData ? {
      id: 'scorecard-1',
      ci: scenarioData.decision?.severity || 0.65,
      tri: enrichedTask?.tri || { t_value: 0.6, r_value: 0.7, i_value: 0.65 },
      as_of: new Date().toISOString()
    } : null),
    deBands,
    isLoading: isLoadingMemory || isLoadingScorecard,
    createReflexMemory,
    updateDeBands,
    saveControllerTuning,
    updateScorecard
  };
}