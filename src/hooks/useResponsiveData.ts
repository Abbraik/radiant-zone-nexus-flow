import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useResponsiveData(loopId: string) {
  const queryClient = useQueryClient();

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
    breachEvents,
    activeClaims,
    deBands,
    isLoading: isLoadingBreaches || isLoadingClaims || isLoadingBands,
    createClaim,
    respondToBreach
  };
}