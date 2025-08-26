import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGoldenScenarioEnrichment } from './useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';

export function useResponsiveData(loopId: string, task?: EnhancedTask5C) {
  const queryClient = useQueryClient();
  const enrichedTask = useGoldenScenarioEnrichment(task || null);

  // Generate scenario-based data if available
  const getScenarioData = () => {
    if (!enrichedTask?.payload) return { breachEvents: [], activeClaims: [], deBands: [] };
    
    const payload = enrichedTask.payload as any;
    
    if (payload.scenario_id === 'fertility') {
      return {
        breachEvents: [{
          id: 'breach-1',
          indicator_name: 'Childcare Wait Time',
          breach_type: 'upper_threshold',
          value: payload.childcare?.wait_time_days || 28,
          threshold_value: 21,
          severity_score: 3,
          at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolved_at: null
        }],
        activeClaims: [{
          id: 'claim-1',
          assignee: task?.user_id || 'system',
          leverage: 'M',
          status: 'active'
        }],
        deBands: [{
          id: 'band-1',
          indicator: 'childcare_wait_time',
          lower_bound: 15,
          upper_bound: 21,
          current_value: payload.childcare?.wait_time_days || 28
        }]
      };
    }

    if (payload.scenario_id === 'social-cohesion') {
      return {
        breachEvents: [{
          id: 'breach-2',
          indicator_name: 'Service Outage Rate',
          breach_type: 'upper_threshold',
          value: payload.service_reliability?.outage_rate || 0.05,
          threshold_value: 0.02,
          severity_score: 2,
          at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          resolved_at: null
        }],
        activeClaims: [],
        deBands: [{
          id: 'band-2',
          indicator: 'outage_rate',
          lower_bound: 0,
          upper_bound: 0.02,
          current_value: payload.service_reliability?.outage_rate || 0.05
        }]
      };
    }

    return { breachEvents: [], activeClaims: [], deBands: [] };  
  };

  const scenarioData = getScenarioData();

  // Fetch breach events for responsive capacity
  const { data: breachEvents = [], isLoading: isLoadingBreaches } = useQuery({
    queryKey: ['breachEvents', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breach_events')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch active claims
  const { data: activeClaims = [], isLoading: isLoadingClaims } = useQuery({
    queryKey: ['activeClaims', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims_5c')
        .select('*, claim_substeps(*)')
        .eq('loop_id', loopId)
        .in('status', ['active', 'draft'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch DE bands for guardrails
  const { data: deBands = [], isLoading: isLoadingBands } = useQuery({
    queryKey: ['deBands', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('de_bands_5c')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Create new claim mutation
  const createClaim = useMutation({
    mutationFn: async (claimData: any) => {
      const { data, error } = await supabase
        .from('claims_5c')
        .insert({
          loop_id: loopId,
          task_id: claimData.taskId,
          assignee: claimData.assignee,
          status: 'draft',
          leverage: claimData.leverage || 'N',
          ...claimData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeClaims', loopId] });
      toast.success('Claim created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create claim: ${error.message}`);
    }
  });

  // Respond to breach mutation
  const respondToBreach = useMutation({
    mutationFn: async (breachId: string) => {
      const { data, error } = await supabase
        .from('breach_events')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', breachId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breachEvents', loopId] });
      toast.success('Breach response recorded');
    },
    onError: (error) => {
      toast.error(`Failed to respond to breach: ${error.message}`);
    }
  });

  return {
    breachEvents: scenarioData.breachEvents.length > 0 ? scenarioData.breachEvents : breachEvents,
    activeClaims: scenarioData.activeClaims.length > 0 ? scenarioData.activeClaims : activeClaims,
    deBands: scenarioData.deBands.length > 0 ? scenarioData.deBands : deBands,
    isLoading: isLoadingBreaches || isLoadingClaims || isLoadingBands,
    createClaim,
    respondToBreach
  };
}