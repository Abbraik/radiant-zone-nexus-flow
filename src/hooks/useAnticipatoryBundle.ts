import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Types for Anticipatory bundle
export interface Scenario {
  id: string;
  task_id: string;
  loop_id: string;
  name: string;
  params: any;
  pinned: boolean;
  charts: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface StressTest {
  id: string;
  loop_id: string;
  scenario_id?: string;
  name: string;
  severity: number;
  expected_impact: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Watchpoint {
  id: string;
  loop_id: string;
  indicator: string;
  direction: 'up' | 'down' | 'band';
  threshold_value?: number;
  threshold_band?: any;
  owner: string;
  playbook_id?: string;
  armed: boolean;
  last_eval?: string;
  last_result: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Playbook {
  id: string;
  loop_id: string;
  title: string;
  lever_order: string[];
  steps: any[];
  guards: any;
  success_criteria: any;
  auto_action: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SignalEvent {
  id: string;
  watchpoint_id: string;
  loop_id: string;
  event_type: 'trip' | 'clear' | 'test';
  indicator_value: number;
  threshold_crossed?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  auto_action_taken: boolean;
  playbook_executed: any;
  user_id: string;
  created_at: string;
}

export const useAnticipatoryBundle = (taskId: string, loopId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [dryRunOpen, setDryRunOpen] = useState(false);

  // Query to get scenarios for this task
  const {
    data: scenarios = [],
    isLoading: isLoadingScenarios
  } = useQuery({
    queryKey: ['scenarios', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Scenario[];
    },
    enabled: !!taskId
  });

  // Query to get stress tests for this loop
  const {
    data: stressTests = [],
    isLoading: isLoadingStressTests
  } = useQuery({
    queryKey: ['stress_tests', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stress_tests')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StressTest[];
    },
    enabled: !!loopId
  });

  // Query to get watchpoints for this loop
  const {
    data: watchpoints = [],
    isLoading: isLoadingWatchpoints
  } = useQuery({
    queryKey: ['watchpoints', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchpoints')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Watchpoint[];
    },
    enabled: !!loopId
  });

  // Query to get playbooks for this loop
  const {
    data: playbooks = [],
    isLoading: isLoadingPlaybooks
  } = useQuery({
    queryKey: ['playbooks', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playbooks')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Playbook[];
    },
    enabled: !!loopId
  });

  // Query to get recent signal events for this loop
  const {
    data: signalEvents = [],
    isLoading: isLoadingEvents
  } = useQuery({
    queryKey: ['signal_events', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signal_events')
        .select('*')
        .eq('loop_id', loopId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as SignalEvent[];
    },
    enabled: !!loopId
  });

  // Mutation to create scenario
  const createScenario = useMutation({
    mutationFn: async (scenarioData: Partial<Scenario>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('scenarios')
        .insert({
          task_id: taskId,
          loop_id: loopId,
          name: scenarioData.name || 'New Scenario',
          params: scenarioData.params || {},
          pinned: scenarioData.pinned || false,
          charts: scenarioData.charts || {},
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios', taskId] });
      toast({
        title: "Scenario created",
        description: "New scenario has been created successfully."
      });
    }
  });

  // Mutation to run scenario
  const runScenario = useMutation({
    mutationFn: async ({ scenarioId, params }: { scenarioId: string; params: any }) => {
      const { data, error } = await supabase.rpc('run_scenario', {
        loop_uuid: loopId,
        params: params
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Update scenario with results
      supabase
        .from('scenarios')
        .update({ charts: (data as any).charts })
        .eq('id', variables.scenarioId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['scenarios', taskId] });
        });

      toast({
        title: "Scenario completed",
        description: "Scenario simulation has finished successfully."
      });
    }
  });

  // Mutation to create stress test
  const createStressTest = useMutation({
    mutationFn: async ({ scenarioId, severity }: { scenarioId: string; severity: number }) => {
      const { data, error } = await supabase.rpc('enqueue_stress_test', {
        loop_uuid: loopId,
        scenario_uuid: scenarioId,
        test_severity: severity
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stress_tests', loopId] });
      toast({
        title: "Stress test queued",
        description: "Stress test has been added to the queue."
      });
    }
  });

  // Mutation to create watchpoint
  const createWatchpoint = useMutation({
    mutationFn: async (watchpointData: Partial<Watchpoint>) => {
      const { data, error } = await supabase.rpc('create_watchpoint', {
        loop_uuid: loopId,
        payload: {
          indicator: watchpointData.indicator,
          direction: watchpointData.direction,
          threshold_value: watchpointData.threshold_value,
          threshold_band: watchpointData.threshold_band,
          owner: watchpointData.owner
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchpoints', loopId] });
      toast({
        title: "Watchpoint created",
        description: "New watchpoint has been created successfully."
      });
    }
  });

  // Mutation to create playbook
  const createPlaybook = useMutation({
    mutationFn: async (playbookData: Partial<Playbook>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('playbooks')
        .insert({
          loop_id: loopId,
          title: playbookData.title || 'New Playbook',
          lever_order: playbookData.lever_order || ['N', 'P', 'S'],
          steps: playbookData.steps || [],
          guards: playbookData.guards || {},
          success_criteria: playbookData.success_criteria || {},
          auto_action: playbookData.auto_action || false,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks', loopId] });
      toast({
        title: "Playbook created",
        description: "New playbook has been created successfully."
      });
    }
  });

  // Mutation to evaluate watchpoints
  const evaluateWatchpoints = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('evaluate_watchpoints');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchpoints', loopId] });
      queryClient.invalidateQueries({ queryKey: ['signal_events', loopId] });
      toast({
        title: "Watchpoints evaluated",
        description: "All watchpoints have been evaluated successfully."
      });
    }
  });

  // Mutation to arm/disarm watchpoint
  const toggleWatchpoint = useMutation({
    mutationFn: async ({ watchpointId, armed }: { watchpointId: string; armed: boolean }) => {
      const { data, error } = await supabase
        .from('watchpoints')
        .update({ armed })
        .eq('id', watchpointId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchpoints', loopId] });
      toast({
        title: "Watchpoint updated",
        description: "Watchpoint status has been updated."
      });
    }
  });

  // Mutation to dry run trip
  const dryRunTrip = useMutation({
    mutationFn: async ({ watchpointId, scenarioSnapshot }: { watchpointId: string; scenarioSnapshot?: any }) => {
      const { data, error } = await supabase.rpc('dry_run_trip', {
        watchpoint_uuid: watchpointId,
        scenario_snapshot: scenarioSnapshot || {}
      });

      if (error) throw error;
      return data;
    }
  });

  return {
    // Data
    scenarios,
    stressTests,
    watchpoints,
    playbooks,
    signalEvents,
    selectedScenario,
    dryRunOpen,
    
    // Loading states
    isLoadingScenarios,
    isLoadingStressTests,
    isLoadingWatchpoints,
    isLoadingPlaybooks,
    isLoadingEvents,
    
    // Mutations
    createScenario,
    runScenario,
    createStressTest,
    createWatchpoint,
    createPlaybook,
    evaluateWatchpoints,
    toggleWatchpoint,
    dryRunTrip,
    
    // Actions
    setSelectedScenario,
    setDryRunOpen,
    
    // Computed states
    isRunningScenario: runScenario.isPending,
    isCreatingStressTest: createStressTest.isPending,
    isEvaluating: evaluateWatchpoints.isPending,
    isDryRunning: dryRunTrip.isPending,
    
    // Results
    scenarioResult: runScenario.data,
    dryRunResult: dryRunTrip.data
  };
};