import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { HydratedLoopPayload } from '@/types/loop-editor';

// Hook for hydrating loop data
export function useLoopHydrate(loopCode: string) {
  return useQuery({
    queryKey: ['loop-hydrate', loopCode],
    queryFn: async (): Promise<HydratedLoopPayload> => {
      if (!loopCode) throw new Error('Loop code is required');
      
      const { data, error } = await supabase.rpc('get_loop_hydrate', {
        p_loop_code: loopCode
      });
      
      if (error) throw error;
      if (!data) throw new Error(`Loop ${loopCode} not found`);
      
      return data as unknown as HydratedLoopPayload;
    },
    enabled: !!loopCode,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Simplified autosave hook
export function useLoopAutosave(loopId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveMetadata = useCallback(async (patch: any) => {
    const { error } = await supabase
      .from('loops')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', loopId);
    
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      queryClient.invalidateQueries({ queryKey: ['loop-hydrate'] });
    }
  }, [loopId, queryClient, toast]);

  return { saveMetadata };
}

// Hook for fetching shared nodes catalog
export function useSharedNodesCatalog() {
  return useQuery({
    queryKey: ['shared-nodes-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_nodes')
        .select('*')
        .order('label');
      
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}