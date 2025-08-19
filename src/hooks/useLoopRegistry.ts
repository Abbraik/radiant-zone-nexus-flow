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
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Registry user state:', user ? 'authenticated' : 'anonymous');
        
        let query = supabase
          .from('loops')
          .select('*')
          .neq('status', 'deprecated');
        
        // If not authenticated, only show published loops
        if (!user) {
          query = query.eq('status', 'published');
          console.log('Filtering for published loops only');
        } else {
          console.log('Showing all user loops + published loops');
        }
        
        const { data, error } = await query
          .order('source_tag', { ascending: false }) // Atlas loops first
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching loops:', error);
          throw error;
        }

        console.log('Fetched loops count:', data?.length || 0);
        console.log('Sample loop data:', data?.[0]);

        return (data || []).map(loop => ({
          ...loop,
          controller: loop.controller as Record<string, any>,
          thresholds: loop.thresholds as Record<string, any>,
          tags: (loop.metadata as any)?.tags || [],
          node_count: 0 // Will be populated by hydration if needed
        })) as LoopData[];
      } catch (error) {
        console.error('Registry query failed:', error);
        throw error;
      }
    },
  });

  const getLoop = (id: string) => useQuery({
    queryKey: ['loops', id],
    queryFn: async (): Promise<LoopData | null> => {
      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        controller: data.controller as Record<string, any>,
        thresholds: data.thresholds as Record<string, any>,
        tags: (data.metadata as any)?.tags || [],
        node_count: 0
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
          loop_type: (loop.loop_type === 'anticipatory' ? 'structural' : loop.loop_type) || 'reactive',
          scale: loop.scale || 'micro',
          leverage_default: loop.leverage_default,
          controller: loop.controller || {},
          thresholds: loop.thresholds || {},
          notes: loop.notes,
          status: 'draft',
          user_id: user.id,
          source_tag: 'USER_CREATED'
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
      // Filter out fields that don't exist in database schema
      const dbUpdates = {
        name: updates.name,
        loop_type: updates.loop_type === 'anticipatory' ? 'structural' : updates.loop_type,
        scale: updates.scale,
        leverage_default: updates.leverage_default,
        controller: updates.controller,
        thresholds: updates.thresholds,
        notes: updates.notes,
        status: updates.status,
        metadata: updates.metadata
      };
      
      const { data, error } = await supabase
        .from('loops')
        .update(dbUpdates)
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
      
      if (error) {
        console.error('Error hydrating loop:', error);
        throw error;
      }
      
      return data as unknown as HydratedLoop;
    },
    enabled: !!loopId,
  });
};