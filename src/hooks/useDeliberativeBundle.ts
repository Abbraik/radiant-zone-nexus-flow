import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

// Types for Deliberative bundle
export interface Option {
  id: string;
  task_id: string;
  loop_id: string;
  name: string;
  lever: 'N' | 'P' | 'S';
  actor: string;
  effect: {
    impact_score?: number;
    risk_score?: number;
    description?: string;
  };
  cost: number;
  effort: number;
  time_to_impact: string;
  risks: Array<{
    description: string;
    likelihood: number;
    severity: number;
    mitigation?: string;
  }>;
  assumptions: Array<{
    description: string;
    confidence: number;
    source?: string;
  }>;
  dependencies: string[];
  evidence: any[];
  status: 'draft' | 'reviewed' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface OptionSet {
  id: string;
  task_id: string;
  name: string;
  option_ids: string[];
  mcda_snapshot: any;
  rationale?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MCDAWeights {
  impact: number;
  cost: number;
  effort: number;
  time: number;
  risk: number;
}

export interface MCDAResult {
  scores: Array<{
    option_id: string;
    name: string;
    lever: string;
    actor: string;
    weighted_score: number;
    raw_scores: {
      impact: number;
      cost_norm: number;
      effort_norm: number;
      time_norm: number;
      risk_norm: number;
    };
  }>;
  weights: MCDAWeights;
  task_id: string;
  analyzed_at: string;
}

export interface CoverageResult {
  matrix: Record<string, Record<string, 'direct' | 'indirect' | 'none'>>;
  gaps: Array<{
    loop_id: string;
    loop_name: string;
    gap_type: string;
  }>;
  conflicts: any[];
  related_loops: string[];
  computed_at: string;
}

export const useDeliberativeBundle = (taskId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for current option set and MCDA weights
  const [currentOptionSetId, setCurrentOptionSetId] = useState<string | null>(null);
  const [mcdaWeights, setMcdaWeights] = useState<MCDAWeights>({
    impact: 0.3,
    cost: 0.2,
    effort: 0.2,
    time: 0.15,
    risk: 0.15
  });

  // Query to get all options for this task
  const {
    data: options = [],
    isLoading: isLoadingOptions,
    error: optionsError
  } = useQuery({
    queryKey: ['options', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('options')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(item => ({
        ...item,
        risks: (item.risks as any) || [],
        assumptions: (item.assumptions as any) || [],
        dependencies: (item.dependencies as any) || [],
        evidence: (item.evidence as any) || []
      })) as Option[];
    },
    enabled: !!taskId
  });

  // Query to get option sets for this task
  const {
    data: optionSets = [],
    isLoading: isLoadingOptionSets
  } = useQuery({
    queryKey: ['option_sets', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('option_sets')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OptionSet[];
    },
    enabled: !!taskId
  });

  // Mutation to create option
  const createOption = useMutation({
    mutationFn: async (optionData: Partial<Option>) => {
      const { data, error } = await supabase
        .from('options')
        .insert({
          task_id: taskId,
          loop_id: optionData.loop_id || '',
          name: optionData.name || '',
          lever: optionData.lever || 'N',
          actor: optionData.actor || '',
          effect: optionData.effect || {},
          cost: optionData.cost || 0,
          effort: optionData.effort || 1,
          time_to_impact: optionData.time_to_impact || '30 days',
          risks: optionData.risks || [],
          assumptions: optionData.assumptions || [],
          dependencies: optionData.dependencies || [],
          evidence: optionData.evidence || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options', taskId] });
      toast({
        title: "Option created",
        description: "New option has been added successfully."
      });
    },
    onError: () => {
      toast({
        title: "Failed to create option",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mutation to update option
  const updateOption = useMutation({
    mutationFn: async ({ optionId, updates }: { optionId: string; updates: Partial<Option> }) => {
      const { data, error } = await supabase
        .from('options')
        .update(updates)
        .eq('id', optionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['options', taskId] });
      toast({
        title: "Option updated",
        description: "Option has been updated successfully."
      });
    }
  });

  // Mutation to run MCDA analysis
  const runMCDA = useMutation({
    mutationFn: async (optionIds: string[]) => {
      const { data, error } = await supabase.rpc('run_mcda', {
        task_uuid: taskId,
        option_ids: optionIds,
        weights: mcdaWeights as any
      });

      if (error) throw error;
      return data as unknown as MCDAResult;
    },
    onError: () => {
      toast({
        title: "MCDA analysis failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mutation to compute coverage
  const computeCoverage = useMutation({
    mutationFn: async ({ loopId, optionIds }: { loopId: string; optionIds: string[] }) => {
      const { data, error } = await supabase.rpc('compute_coverage', {
        loop_uuid: loopId,
        option_ids: optionIds
      });

      if (error) throw error;
      return data as unknown as CoverageResult;
    },
    onError: () => {
      toast({
        title: "Coverage analysis failed",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mutation to create option set
  const createOptionSet = useMutation({
    mutationFn: async ({ name, optionIds }: { name: string; optionIds: string[] }) => {
      const { data, error } = await supabase
        .from('option_sets')
        .insert({
          task_id: taskId,
          name,
          option_ids: optionIds,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['option_sets', taskId] });
      setCurrentOptionSetId(data.id);
      toast({
        title: "Option set created",
        description: "New option set has been created successfully."
      });
    }
  });

  // Mutation to package for execution
  const packageForExecution = useMutation({
    mutationFn: async (optionSetId: string) => {
      const { data, error } = await supabase.rpc('package_for_execution', {
        option_set_uuid: optionSetId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['option_sets', taskId] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({
        title: "Options packaged for execution",
        description: "Claims have been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Packaging failed",
        description: error?.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mutation to save decision record
  const saveDecisionRecord = useMutation({
    mutationFn: async ({ 
      optionSetId, 
      rationale, 
      mcdaSnapshot 
    }: { 
      optionSetId: string; 
      rationale: string; 
      mcdaSnapshot?: any 
    }) => {
      const { data, error } = await supabase.rpc('save_decision_record', {
        task_uuid: taskId,
        option_set_uuid: optionSetId,
        rationale_text: rationale,
        mcda_snapshot: mcdaSnapshot || {}
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Decision record saved",
        description: "Decision has been documented successfully."
      });
    }
  });

  // Helper function to get current option set
  const getCurrentOptionSet = () => {
    return optionSets.find(set => set.id === currentOptionSetId);
  };

  // Helper function to get options in current set
  const getOptionsInCurrentSet = () => {
    const currentSet = getCurrentOptionSet();
    if (!currentSet) return [];
    
    return options.filter(option => 
      currentSet.option_ids.includes(option.id)
    );
  };

  return {
    // Data
    options,
    optionSets,
    currentOptionSetId,
    mcdaWeights,
    
    // Loading states
    isLoadingOptions,
    isLoadingOptionSets,
    
    // Mutations
    createOption,
    updateOption,
    runMCDA,
    computeCoverage,
    createOptionSet,
    packageForExecution,
    saveDecisionRecord,
    
    // Actions
    setCurrentOptionSetId,
    setMcdaWeights,
    
    // Helpers
    getCurrentOptionSet,
    getOptionsInCurrentSet,
    
    // Computed states
    isRunningMCDA: runMCDA.isPending,
    isComputingCoverage: computeCoverage.isPending,
    isPackaging: packageForExecution.isPending,
    
    // Results
    mcdaResult: runMCDA.data,
    coverageResult: computeCoverage.data
  };
};