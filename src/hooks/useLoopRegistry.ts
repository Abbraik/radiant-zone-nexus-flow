import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoopData, LoopSearchFilters, HydratedLoop } from '@/types/loop-registry';
import { useToast } from '@/hooks/use-toast';

// Default mock loops for demo purposes
const mockLoops: LoopData[] = [
  {
    id: 'loop-1',
    name: 'Affordable Housing Availability',
    synopsis: 'Balancing loop managing housing supply and demand dynamics',
    loop_type: 'reactive',
    motif: 'B',
    layer: 'macro',
    scale: 'macro',
    leverage_default: 'N',
    controller: { mode: 'auto', sensitivity: 0.7 },
    thresholds: { upper: 0.8, lower: 0.2 },
    notes: 'Key macro-level housing policy loop',
    status: 'published',
    version: 1,
    user_id: 'mock-user',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z',
    tags: ['housing', 'policy', 'macro'],
    node_count: 8,
  },
  {
    id: 'loop-2',
    name: 'ER Wait Time Stabilization',
    synopsis: 'Emergency department patient flow balancing mechanism',
    loop_type: 'reactive',
    motif: 'B',
    layer: 'micro',
    scale: 'micro',
    leverage_default: 'P',
    controller: { mode: 'manual', threshold: 45 },
    thresholds: { upper: 60, lower: 15 },
    notes: 'Critical healthcare operations loop',
    status: 'published',
    version: 2,
    user_id: 'mock-user',
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-25T16:20:00Z',
    tags: ['healthcare', 'operations', 'emergency'],
    node_count: 6,
  },
  {
    id: 'loop-3',
    name: 'Digital Service Latency',
    synopsis: 'Service performance and user satisfaction feedback loop',
    loop_type: 'reactive',
    motif: 'B',
    layer: 'meso',
    scale: 'meso',
    leverage_default: 'P',
    controller: { mode: 'auto', target_latency: 2.0 },
    thresholds: { upper: 5.0, lower: 1.0 },
    notes: 'Digital services performance optimization',
    status: 'published',
    version: 1,
    user_id: 'mock-user',
    created_at: '2024-01-05T12:00:00Z',
    updated_at: '2024-01-22T11:30:00Z',
    tags: ['digital', 'performance', 'automation'],
    node_count: 5,
  },
  {
    id: 'loop-4',
    name: 'Food Price Inflation',
    synopsis: 'Reinforcing price spiral and market dynamics',
    loop_type: 'reactive',
    motif: 'R',
    layer: 'macro',
    scale: 'macro',
    leverage_default: 'P',
    controller: { mode: 'manual', intervention_threshold: 8.0 },
    thresholds: { upper: 10.0, lower: 2.0 },
    notes: 'Economic stability monitoring loop',
    status: 'published',
    version: 3,
    user_id: 'mock-user',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-28T13:15:00Z',
    tags: ['economics', 'inflation', 'policy'],
    node_count: 7,
  },
  {
    id: 'loop-5',
    name: 'Meta-Loop Supervisory Control',
    synopsis: 'Top-level coordination and mode selection mechanism',
    loop_type: 'reactive',
    motif: 'B',
    layer: 'meta',
    scale: 'macro',
    leverage_default: 'N',
    controller: { mode: 'supervisory', escalation_rules: ['breach', 'trend'] },
    thresholds: { breach_severity: 1.5, trend_threshold: 0.2 },
    notes: 'Master control loop governing subsystem coordination',
    status: 'published',
    version: 1,
    user_id: 'mock-user',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-30T18:00:00Z',
    tags: ['meta', 'control', 'supervision'],
    node_count: 9,
  },
  {
    id: 'loop-6',
    name: 'Public Transport Reliability',
    synopsis: 'Bus system performance and ridership feedback',
    loop_type: 'reactive',
    motif: 'B',
    layer: 'meso',
    scale: 'meso',
    leverage_default: 'P',
    controller: { mode: 'hybrid', performance_target: 95 },
    thresholds: { upper: 98, lower: 85 },
    notes: 'Transit system optimization loop',
    status: 'draft',
    version: 1,
    user_id: 'mock-user',
    created_at: '2024-01-18T15:45:00Z',
    updated_at: '2024-01-29T10:20:00Z',
    tags: ['transport', 'public-service', 'optimization'],
    node_count: 4,
  }
];

export const useLoopRegistry = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchLoops = useQuery({
    queryKey: ['loops', 'search'],
    queryFn: async (): Promise<LoopData[]> => {
      return mockLoops;
    },
  });

  const getLoop = (id: string) => useQuery({
    queryKey: ['loops', id],
    queryFn: async (): Promise<LoopData | null> => {
      // Check if this is a mock loop ID (starts with 'loop-')
      if (id && id.startsWith('loop-')) {
        const mockLoop = mockLoops.find(loop => loop.id === id);
        return mockLoop || null;
      }
      
      // Otherwise, query the database for real loops
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
      
      // Check if this is a mock loop ID
      if (loopId.startsWith('loop-')) {
        const mockLoop = mockLoops.find(loop => loop.id === loopId);
        if (mockLoop) {
          // Return a hydrated version with empty nodes/edges for mock data
          return {
            ...mockLoop,
            nodes: [],
            edges: []
          } as HydratedLoop;
        }
        return null;
      }
      
      // Otherwise, query the database for real loops
      const { data, error } = await supabase.rpc('get_loop_hydrate', {
        loop_uuid: loopId
      });
      
      if (error) throw error;
      return data as unknown as HydratedLoop;
    },
    enabled: !!loopId,
  });
};