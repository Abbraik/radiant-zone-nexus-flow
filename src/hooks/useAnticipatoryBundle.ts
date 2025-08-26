import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';
import { getAnticipatoryScenarioData } from '@/utils/scenarioDataHelpers';

// Types for Anticipatory bundle
export interface AnticScenario {
  id: string;
  name: string;
  assumptions: any;
  target_loops: string[];
  created_by: string;
  org_id: string;
  created_at: string;
}

export interface AnticScenarioResult {
  id: string;
  scenario_id: string;
  without_mitigation_breach_prob: number;
  with_mitigation_breach_prob: number;
  mitigation_delta: number;
  affected_loops: string[];
  notes?: string;
  created_by?: string;
  org_id: string;
  created_at: string;
}

export interface AnticWatchpoint {
  id: string;
  risk_channel: string;
  loop_codes: string[];
  ews_prob: number;
  confidence?: number;
  buffer_adequacy?: number;
  lead_time_days?: number;
  status: string;
  notes?: string;
  review_at: string;
  created_by: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface AnticTriggerRule {
  id: string;
  name: string;
  expr_raw: string;
  expr_ast: any;
  window_hours: number;
  authority: string;
  action_ref: string;
  valid_from: string;
  expires_at: string;
  consent_note?: string;
  created_by: string;
  org_id: string;
  created_at: string;
  updated_at: string;
}

export interface AnticActivationEvent {
  id: string;
  loop_code?: string;
  indicator?: string;
  kind: string;
  source: string;
  payload?: any;
  created_by?: string;
  org_id: string;
  created_at: string;
}

export const useAnticipatoryBundle = (task: EnhancedTask5C | null) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const enrichedTask = useGoldenScenarioEnrichment(task);

  // State
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [dryRunOpen, setDryRunOpen] = useState(false);

  // Query to get scenarios
  const {
    data: scenarios = [],
    isLoading: isLoadingScenarios
  } = useQuery({
    queryKey: ['antic_scenarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_scenarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AnticScenario[];
    }
  });

  // Query to get scenario results
  const {
    data: scenarioResults = [],
    isLoading: isLoadingScenarioResults
  } = useQuery({
    queryKey: ['antic_scenario_results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_scenario_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AnticScenarioResult[];
    }
  });

  // Query to get watchpoints
  const {
    data: watchpoints = [],
    isLoading: isLoadingWatchpoints
  } = useQuery({
    queryKey: ['antic_watchpoints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_watchpoints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AnticWatchpoint[];
    }
  });

  // Query to get trigger rules
  const {
    data: triggerRules = [],
    isLoading: isLoadingTriggerRules
  } = useQuery({
    queryKey: ['antic_trigger_rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_trigger_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AnticTriggerRule[];
    }
  });

  // Query to get recent activation events
  const {
    data: activationEvents = [],
    isLoading: isLoadingEvents
  } = useQuery({
    queryKey: ['antic_activation_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('antic_activation_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as AnticActivationEvent[];
    }
  });

  // Mutation to create scenario
  const createScenario = useMutation({
    mutationFn: async (scenarioData: Partial<AnticScenario>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('antic_scenarios')
        .insert({
          id: scenarioData.id || crypto.randomUUID(),
          name: scenarioData.name || 'New Scenario',
          assumptions: scenarioData.assumptions || {},
          target_loops: scenarioData.target_loops || [],
          created_by: user.id,
          org_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antic_scenarios'] });
      toast({
        title: "Scenario created",
        description: "New scenario has been created successfully."
      });
    }
  });

  // Mutation to run scenario
  const runScenario = useMutation({
    mutationFn: async ({ scenarioId, params }: { scenarioId: string; params: any }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create a scenario result
      const { data, error } = await supabase
        .from('antic_scenario_results')
        .insert({
          scenario_id: scenarioId,
          without_mitigation_breach_prob: params.without_mitigation || 0.5,
          with_mitigation_breach_prob: params.with_mitigation || 0.3,
          mitigation_delta: params.without_mitigation - params.with_mitigation || 0.2,
          affected_loops: params.affected_loops || [],
          notes: params.notes || '',
          created_by: user.id,
          org_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antic_scenario_results'] });
      toast({
        title: "Scenario completed",
        description: "Scenario simulation has finished successfully."
      });
    }
  });

  // Mutation to create watchpoint
  const createWatchpoint = useMutation({
    mutationFn: async (watchpointData: Partial<AnticWatchpoint>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('antic_watchpoints')
        .insert({
          risk_channel: watchpointData.risk_channel || 'system',
          loop_codes: watchpointData.loop_codes || [],
          ews_prob: watchpointData.ews_prob || 0.5,
          confidence: watchpointData.confidence || 0.8,
          buffer_adequacy: watchpointData.buffer_adequacy || 0.7,
          lead_time_days: watchpointData.lead_time_days || 7,
          status: watchpointData.status || 'armed',
          notes: watchpointData.notes || '',
          review_at: watchpointData.review_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: user.id,
          org_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antic_watchpoints'] });
      toast({
        title: "Watchpoint created",
        description: "New watchpoint has been created successfully."
      });
    }
  });

  // Mutation to create trigger rule
  const createTriggerRule = useMutation({
    mutationFn: async (triggerData: Partial<AnticTriggerRule>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('antic_trigger_rules')
        .insert({
          name: triggerData.name || 'New Trigger Rule',
          expr_raw: triggerData.expr_raw || '',
          expr_ast: triggerData.expr_ast || {},
          window_hours: triggerData.window_hours || 24,
          authority: triggerData.authority || 'system',
          action_ref: triggerData.action_ref || '',
          valid_from: triggerData.valid_from || new Date().toISOString(),
          expires_at: triggerData.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          consent_note: triggerData.consent_note || '',
          created_by: user.id,
          org_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antic_trigger_rules'] });
      toast({
        title: "Trigger rule created",
        description: "New trigger rule has been created successfully."
      });
    }
  });

  // Mutation to evaluate watchpoints
  const evaluateWatchpoints = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('evaluate-watchpoints');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antic_watchpoints'] });
      queryClient.invalidateQueries({ queryKey: ['antic_activation_events'] });
      toast({
        title: "Watchpoints evaluated",
        description: "All watchpoints have been evaluated successfully."
      });
    }
  });

  // Mutation to toggle watchpoint
  const toggleWatchpoint = useMutation({
    mutationFn: async ({ watchpointId, status }: { watchpointId: string; status: string }) => {
      const { data, error } = await supabase
        .from('antic_watchpoints')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', watchpointId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['antic_watchpoints'] });
      toast({
        title: "Watchpoint updated",
        description: "Watchpoint status has been updated."
      });
    }
  });



  // Get golden scenario data if available
  const goldenScenarioData = getAnticipatoryScenarioData(enrichedTask);
  
  // Use golden scenario data when available, otherwise fall back to database queries
  const enhancedScenarios = goldenScenarioData?.scenarios || scenarios;
  const enhancedWatchpoints = goldenScenarioData?.watchboard || watchpoints;

  return {
    // Data - enhanced with golden scenario data
    scenarios: enhancedScenarios,
    scenarioResults,
    watchpoints: enhancedWatchpoints,
    triggerRules,
    activationEvents,
    selectedScenario,
    dryRunOpen,
    
    // Golden scenario specific data
    isGoldenScenario: !!goldenScenarioData,
    ewsProb: goldenScenarioData?.ewsProb,
    leadTimeDays: goldenScenarioData?.leadTimeDays,
    bufferAdequacy: goldenScenarioData?.bufferAdequacy,
    
    // Loading states
    isLoadingScenarios,
    isLoadingScenarioResults,
    isLoadingWatchpoints,
    isLoadingTriggerRules,
    isLoadingEvents,
    
    // Mutations
    createScenario,
    runScenario,
    createWatchpoint,
    createTriggerRule,
    evaluateWatchpoints,
    toggleWatchpoint,
    
    // Actions
    setSelectedScenario,
    setDryRunOpen,
    
    // Computed states
    isRunningScenario: runScenario.isPending,
    isCreatingWatchpoint: createWatchpoint.isPending,
    isEvaluating: evaluateWatchpoints.isPending,
    
    // Results
    scenarioResult: runScenario.data
  };
};