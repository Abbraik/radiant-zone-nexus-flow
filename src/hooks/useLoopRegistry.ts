import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoopData, LoopSearchFilters, HydratedLoop } from '@/types/loop-registry';
import { useToast } from '@/hooks/use-toast';

export const useLoopRegistry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchLoops = useQuery({
    queryKey: ['loops', 'search'],
    queryFn: async (): Promise<LoopData[]> => {
      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(loop => ({
        ...loop,
        controller: loop.controller as Record<string, any>,
        thresholds: loop.thresholds as Record<string, any>,
        tags: [],
        node_count: 0
      })) as LoopData[];
    },
  });

  const getLoop = (id: string) => useQuery({
    queryKey: ['loops', id],
    queryFn: async (): Promise<LoopData | null> => {
      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        controller: data.controller as Record<string, any>,
        thresholds: data.thresholds as Record<string, any>
      } as LoopData;
    },
    enabled: !!id,
  });

  const publishLoop = useMutation({
    mutationFn: async (loopId: string) => {
      const { data, error } = await supabase.rpc('publish_loop', {
        loop_uuid: loopId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loops'] });
      toast({
        title: "Loop Published",
        description: "Loop has been successfully published to the registry.",
      });
    },
    onError: (error) => {
      toast({
        title: "Publication Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createLoop = useMutation({
    mutationFn: async (loop: Partial<LoopData>) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('loops')
        .insert({
          name: loop.name || 'New Loop',
          loop_type: loop.loop_type || 'reactive',
          scale: loop.scale || 'micro',
          leverage_default: loop.leverage_default,
          controller: loop.controller || {},
          thresholds: loop.thresholds || {},
          notes: loop.notes,
          status: 'draft',
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        controller: data.controller as Record<string, any>,
        thresholds: data.thresholds as Record<string, any>
      } as LoopData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loops'] });
      toast({
        title: "Loop Created",
        description: "New loop has been created successfully.",
      });
    },
  });

  const updateLoop = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LoopData> }) => {
      const { data, error } = await supabase
        .from('loops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loops'] });
      toast({
        title: "Loop Updated",
        description: "Loop has been updated successfully.",
      });
    },
  });

  return {
    searchLoops,
    getLoop,
    publishLoop,
    createLoop,
    updateLoop,
  };
};

export const useLoopHydration = (loopId?: string) => {
  return useQuery({
    queryKey: ['loops', 'hydrate', loopId],
    queryFn: async (): Promise<HydratedLoop | null> => {
      if (!loopId) return null;
      
      const { data, error } = await supabase.rpc('get_loop_hydrate', {
        loop_uuid: loopId
      });
      
      if (error) throw error;
      return data as unknown as HydratedLoop;
    },
    enabled: !!loopId,
  });
};