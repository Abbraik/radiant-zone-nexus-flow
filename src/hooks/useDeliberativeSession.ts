import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DeliberativeSessionData {
  session: any;
  criteria: any[];
  options: any[];
  scores: any[];
  scenarios: any[];
  frontier: any[];
  mandateChecks: any[];
  guardrails: any[];
  participation: any[];
  constraints: any[];
  events: any[];
}

export const useDeliberativeSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const currentUserId = supabase.auth.getUser().then(u => u.data.user?.id);

  // Fetch complete session data
  const {
    data: sessionData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['deliberative-session', sessionId],
    queryFn: async (): Promise<DeliberativeSessionData> => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const [
        { data: session },
        { data: criteria },
        { data: options },
        { data: scores },
        { data: scenarios },
        { data: frontier },
        { data: mandateChecks },
        { data: guardrails },
        { data: participation },
        { data: constraints },
        { data: events }
      ] = await Promise.all([
        supabase.from('delib_sessions').select('*').eq('id', sessionId).single(),
        supabase.from('delib_criteria').select('*').eq('session_id', sessionId).order('order_index'),
        supabase.from('delib_options').select('*').eq('session_id', sessionId).order('created_at'),
        supabase.from('delib_scores').select('*').eq('session_id', sessionId),
        supabase.from('delib_scenarios').select('*').eq('session_id', sessionId).order('created_at'),
        supabase.from('delib_frontier').select('*').eq('session_id', sessionId).order('created_at', { ascending: false }),
        supabase.from('delib_mandate_checks').select('*').eq('session_id', sessionId),
        supabase.from('delib_guardrails').select('*').eq('session_id', sessionId),
        supabase.from('delib_participation').select('*').eq('session_id', sessionId),
        supabase.from('delib_constraints').select('*').eq('session_id', sessionId),
        supabase.from('delib_events').select('*').eq('session_id', sessionId).order('created_at', { ascending: false }).limit(50)
      ]);

      return {
        session: session || {},
        criteria: criteria || [],
        options: options || [],
        scores: scores || [],
        scenarios: scenarios || [],
        frontier: frontier || [],
        mandateChecks: mandateChecks || [],
        guardrails: guardrails || [],
        participation: participation || [],
        constraints: constraints || [],
        events: events || []
      };
    },
    enabled: !!sessionId
  });

  // Mutation for updating criteria
  const updateCriterion = useMutation({
    mutationFn: async (criterion: {
      id?: string;
      label: string;
      description?: string;
      weight: number;
      direction: 'maximize' | 'minimize';
      scale_hint?: string;
      order_index?: number;
    }) => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('delib_upsert_criterion', {
        p_org: user,
        p_session: sessionId,
        p_id: criterion.id || null,
        p_label: criterion.label,
        p_desc: criterion.description || null,
        p_weight: criterion.weight,
        p_direction: criterion.direction,
        p_scale: criterion.scale_hint || null,
        p_order: criterion.order_index || 0
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success('Criterion updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating criterion: ${error.message}`);
    }
  });

  // Mutation for updating options
  const updateOption = useMutation({
    mutationFn: async (option: {
      id?: string;
      name: string;
      synopsis?: string;
      tags?: string[];
      costs?: any;
      latency_days?: number;
      authority_flag?: 'ok' | 'review' | 'blocked';
      equity_note?: string;
    }) => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('delib_upsert_option', {
        p_org: user,
        p_session: sessionId,
        p_id: option.id || null,
        p_name: option.name,
        p_synopsis: option.synopsis || null,
        p_tags: option.tags || [],
        p_costs: option.costs || {},
        p_latency: option.latency_days || null,
        p_authority: option.authority_flag || null,
        p_equity_note: option.equity_note || null
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success('Option updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating option: ${error.message}`);
    }
  });

  // Mutation for setting scores
  const setScore = useMutation({
    mutationFn: async (scoreData: {
      option_id: string;
      criterion_id: string;
      score: number;
      evidence_refs?: string[];
    }) => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('delib_set_score', {
        p_org: user,
        p_session: sessionId,
        p_option: scoreData.option_id,
        p_criterion: scoreData.criterion_id,
        p_score: scoreData.score,
        p_evidence: scoreData.evidence_refs || []
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success('Score updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating score: ${error.message}`);
    }
  });

  // Mutation for recomputing MCDA totals
  const recomputeMCDA = useMutation({
    mutationFn: async () => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('delib-recompute', {
        body: { org_id: user, session_id: sessionId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success(`Recomputed ${data.totals?.length || 0} MCDA totals`);
    },
    onError: (error) => {
      toast.error(`Error recomputing MCDA: ${error.message}`);
    }
  });

  // Mutation for building frontier
  const buildFrontier = useMutation({
    mutationFn: async (maxBundle?: number) => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('delib-frontier', {
        body: { org_id: user, session_id: sessionId, max_bundle: maxBundle || 3 }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success(`Built frontier with ${data.count} efficient points`);
    },
    onError: (error) => {
      toast.error(`Error building frontier: ${error.message}`);
    }
  });

  // Mutation for publishing dossier
  const publishDossier = useMutation({
    mutationFn: async (dossierData: {
      version: string;
      title: string;
      summary: string;
      selected_option_ids: string[];
      rejected_option_ids: string[];
      tradeoff_notes?: string;
      robustness_notes?: string;
      handoffs?: string[];
    }): Promise<any> => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('delib-publish-dossier', {
        body: {
          org_id: user,
          session_id: sessionId,
          ...dossierData
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success(`Dossier published with ID: ${data.dossier_id}`);
    },
    onError: (error) => {
      toast.error(`Error publishing dossier: ${error.message}`);
    }
  });

  // Mutation for toggling constraints
  const toggleConstraint = useMutation({
    mutationFn: async (constraintData: { label: string; active: boolean }) => {
      const user = await currentUserId;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.rpc('delib_toggle_constraint', {
        p_org: user,
        p_session: sessionId,
        p_label: constraintData.label,
        p_active: constraintData.active
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliberative-session', sessionId] });
      toast.success('Constraint updated successfully');
    },
    onError: (error) => {
      toast.error(`Error updating constraint: ${error.message}`);
    }
  });

  return {
    sessionData,
    isLoading,
    error,
    updateCriterion,
    updateOption,
    setScore,
    recomputeMCDA,
    buildFrontier,
    publishDossier,
    toggleConstraint
  };
};