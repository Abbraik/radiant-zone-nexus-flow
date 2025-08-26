import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useDeliberativeData(loopId: string) {
  const queryClient = useQueryClient();

  // Fetch deliberative sessions
  const { data: sessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['delibSessions', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delib_sessions')
        .select('*')
        .eq('loop_code', loopId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!loopId
  });

  // Fetch criteria for active session
  const activeSession = sessions[0];
  const { data: criteria = [] } = useQuery({
    queryKey: ['delibCriteria', activeSession?.id],
    queryFn: async () => {
      if (!activeSession) return [];
      const { data, error } = await supabase
        .from('delib_criteria')
        .select('*')
        .eq('session_id', activeSession.id)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeSession
  });

  // Fetch options for active session
  const { data: options = [] } = useQuery({
    queryKey: ['delibOptions', activeSession?.id],
    queryFn: async () => {
      if (!activeSession) return [];
      const { data, error } = await supabase
        .from('delib_options')
        .select('*')
        .eq('session_id', activeSession.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeSession
  });

  // Fetch scores for active session
  const { data: scores = [] } = useQuery({
    queryKey: ['delibScores', activeSession?.id],
    queryFn: async () => {
      if (!activeSession) return [];
      const { data, error } = await supabase
        .from('delib_scores')
        .select('*')
        .eq('session_id', activeSession.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeSession
  });

  // Fetch frontier points
  const { data: frontierPoints = [] } = useQuery({
    queryKey: ['delibFrontier', activeSession?.id],
    queryFn: async () => {
      if (!activeSession) return [];
      const { data, error } = await supabase
        .from('delib_frontier')
        .select('*')
        .eq('session_id', activeSession.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeSession
  });

  // Fetch dossiers
  const { data: dossiers = [] } = useQuery({
    queryKey: ['delibDossiers', activeSession?.id],
    queryFn: async () => {
      if (!activeSession) return [];
      const { data, error } = await supabase
        .from('delib_dossiers')
        .select('*')
        .eq('session_id', activeSession.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!activeSession
  });

  // Create session
  const createSession = useMutation({
    mutationFn: async (sessionData: any) => {
      const { data, error } = await supabase.rpc('delib_create_session', {
        p_org: sessionData.org_id,
        p_loop: loopId,
        p_mission: sessionData.mission,
        p_activation_vector: sessionData.activation_vector
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delibSessions', loopId] });
      toast.success('Deliberative session created');
    }
  });

  // Add criterion
  const addCriterion = useMutation({
    mutationFn: async (criterionData: any) => {
      if (!activeSession) throw new Error('No active session');
      
      const { data, error } = await supabase.rpc('delib_upsert_criterion', {
        p_org: activeSession.org_id,
        p_session: activeSession.id,
        p_id: null,
        p_label: criterionData.label,
        p_desc: criterionData.description,
        p_weight: criterionData.weight,
        p_direction: criterionData.direction,
        p_scale: criterionData.scale_hint,
        p_order: criteria.length
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delibCriteria', activeSession?.id] });
      toast.success('Criterion added');
    }
  });

  // Add option
  const addOption = useMutation({
    mutationFn: async (optionData: any) => {
      if (!activeSession) throw new Error('No active session');
      
      const { data, error } = await supabase.rpc('delib_upsert_option', {
        p_org: activeSession.org_id,
        p_session: activeSession.id,
        p_id: null,
        p_name: optionData.name,
        p_synopsis: optionData.synopsis,
        p_tags: optionData.tags || [],
        p_costs: optionData.costs || {},
        p_latency: optionData.latency_days || 0,
        p_authority: optionData.authority_flag || 'standard',
        p_equity_note: optionData.equity_note || ''
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delibOptions', activeSession?.id] });
      toast.success('Option added');
    }
  });

  // Set score
  const setScore = useMutation({
    mutationFn: async ({ optionId, criterionId, score, evidence }: any) => {
      if (!activeSession) throw new Error('No active session');
      
      const { error } = await supabase.rpc('delib_set_score', {
        p_org: activeSession.org_id,
        p_session: activeSession.id,
        p_option: optionId,
        p_criterion: criterionId,
        p_score: score,
        p_evidence: evidence || []
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delibScores', activeSession?.id] });
    }
  });

  return {
    sessions,
    activeSession,
    criteria,
    options,
    scores,
    frontierPoints,
    dossiers,
    isLoading: isLoadingSessions,
    createSession,
    addCriterion,
    addOption,
    setScore
  };
}