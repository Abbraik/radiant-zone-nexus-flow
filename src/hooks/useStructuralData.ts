import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useStructuralData(loopId: string) {
  const queryClient = useQueryClient();

  // Fetch loop data for architecture
  const { data: loopData, isLoading: isLoadingLoop } = useQuery({
    queryKey: ['loopStructure', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loops')
        .select(`
          *,
          loop_nodes(*),
          loop_edges(*),
          cascades(*)
        `)
        .eq('id', loopId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!loopId
  });

  // Fetch conformance runs
  const { data: conformanceRuns = [] } = useQuery({
    queryKey: ['conformanceRuns', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conformance_runs')
        .select(`
          *,
          conformance_findings(*)
        `)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch adoption entities
  const { data: adoptionEntities = [] } = useQuery({
    queryKey: ['adoptionEntities', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adopting_entities')
        .select(`
          *,
          adoption_events(*)
        `)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch dossiers
  const { data: dossiers = [] } = useQuery({
    queryKey: ['structuralDossiers', loopId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delib_dossiers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch standards versions (using conformance_runs as proxy)
  const { data: standardsVersions = [] } = useQuery({
    queryKey: ['standardsVersions'],
    queryFn: async () => {
      // Return mock standards for now
      return [
        { id: '1', version: 'v1.0', name: 'Baseline Standard', created_at: new Date().toISOString() },
        { id: '2', version: 'v2.0', name: 'Enhanced Standard', created_at: new Date().toISOString() }
      ];
    }
  });

  // Create dossier
  const createDossier = useMutation({
    mutationFn: async (dossierData: any) => {
      const { data, error } = await supabase.rpc('delib_publish_dossier', {
        p_org: dossierData.org_id,
        p_session: dossierData.session_id,
        p_version: dossierData.version,
        p_title: dossierData.title,
        p_summary: dossierData.summary,
        p_selected: dossierData.selected_option_ids || [],
        p_rejected: dossierData.rejected_option_ids || [],
        p_trade: dossierData.tradeoff_notes || '',
        p_robust: dossierData.robustness_notes || '',
        p_handoffs: dossierData.handoffs || []
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structuralDossiers', loopId] });
      toast.success('Dossier published successfully');
    }
  });

  // Run conformance check
  const runConformanceCheck = useMutation({
    mutationFn: async (dossierId: string) => {
      // This would trigger a conformance run for the dossier
      const { data, error } = await supabase
        .from('conformance_runs')
        .insert({
          dossier_id: dossierId,
          status: 'running'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conformanceRuns', loopId] });
      toast.success('Conformance check initiated');
    }
  });

  // Update adoption status
  const updateAdoptionStatus = useMutation({
    mutationFn: async ({ entityId, status }: any) => {
      const { data, error } = await supabase
        .from('adoption_events')
        .insert({
          adopt_id: entityId,
          type: 'status_change',
          detail: { status }
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoptionEntities', loopId] });
      toast.success('Adoption status updated');
    }
  });

  return {
    loopData,
    conformanceRuns,
    adoptionEntities,
    dossiers,
    standardsVersions,
    isLoading: isLoadingLoop,
    createDossier,
    runConformanceCheck,
    updateAdoptionStatus
  };
}