import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAnticipatoryData(loopId: string) {
  const queryClient = useQueryClient();

  // Fetch watchpoints
  const { data: watchpoints = [], isLoading: isLoadingWatchpoints } = useQuery({
    queryKey: ['watchpoints', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_watchpoints')
        .select('*')
        .contains('loop_codes', [loopId])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch scenarios
  const { data: scenarios = [], isLoading: isLoadingScenarios } = useQuery({
    queryKey: ['scenarios', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_scenarios')
        .select('*')
        .contains('target_loops', [loopId])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch scenario results
  const { data: scenarioResults = [] } = useQuery({
    queryKey: ['scenarioResults', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_scenario_results')
        .select('*')
        .contains('affected_loops', [loopId])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch trigger rules
  const { data: triggerRules = [] } = useQuery({
    queryKey: ['triggerRules', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_trigger_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch buffers
  const { data: buffers = [] } = useQuery({
    queryKey: ['buffers', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_buffers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch pre-position orders
  const { data: prePositionOrders = [] } = useQuery({
    queryKey: ['prePositionOrders', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_pre_position_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create watchpoint
  const createWatchpoint = useMutation({
    mutationFn: async (watchpointData: any) => {
      const { data, error } = await supabase
        .from('antic_watchpoints')
        .insert({
          risk_channel: watchpointData.risk_channel,
          loop_codes: watchpointData.loop_codes || [loopId],
          ews_prob: watchpointData.ews_prob,
          status: watchpointData.status || 'armed',
          review_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          ...watchpointData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchpoints', loopId] });
      toast.success('Watchpoint created successfully');
    }
  });

  // Create scenario
  const createScenario = useMutation({
    mutationFn: async (scenarioData: any) => {
      const { data, error } = await supabase
        .from('antic_scenarios')
        .insert({
          name: scenarioData.name,
          assumptions: scenarioData.assumptions,
          target_loops: scenarioData.target_loops || [loopId],
          ...scenarioData
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', loopId] });
      toast.success('Scenario created successfully');
    }
  });

  // Run scenario
  const runScenario = useMutation({
    mutationFn: async ({ scenarioId, params }: any) => {
      // Get user ID for org_id (assuming user ID is org ID for now)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('antic_scenario_results')
        .insert({
          org_id: user.id,
          scenario_id: scenarioId,
          without_mitigation_breach_prob: params.without_mitigation,
          with_mitigation_breach_prob: params.with_mitigation,
          mitigation_delta: params.without_mitigation - params.with_mitigation,
          affected_loops: params.affected_loops,
          notes: `Scenario run at ${new Date().toISOString()}`
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarioResults', loopId] });
      toast.success('Scenario analysis completed');
    }
  });

  // Arm watchpoint
  const armWatchpoint = useMutation({
    mutationFn: async (watchpointId: string) => {
      const { data, error } = await supabase
        .from('antic_watchpoints')
        .update({ status: 'armed' })
        .eq('id', watchpointId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchpoints', loopId] });
      toast.success('Watchpoint armed');
    }
  });

  return {
    watchpoints,
    scenarios,
    scenarioResults,
    triggerRules,
    buffers,
    prePositionOrders,
    isLoading: isLoadingWatchpoints || isLoadingScenarios,
    createWatchpoint,
    createScenario,
    runScenario,
    armWatchpoint
  };
}