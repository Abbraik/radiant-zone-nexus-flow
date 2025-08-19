import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ModeRecommendation {
  capacity: string;
  confidence: number;
  reasons: string[];
  scorecard_snapshot?: any;
}

interface TaskLink {
  id: string;
  from_task_id: string;
  to_task_id: string;
  link_type: string;
  context: any;
}

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  url: string;
  metadata: any;
}

export function useGlue() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Mode recommendation
  const suggestCapacity = useMutation({
    mutationFn: async ({ loopId, context }: { loopId: string; context?: any }) => {
      const { data, error } = await supabase.rpc('suggest_capacity', {
        loop_id_param: loopId,
        context_param: context || {}
      });
      
      if (error) throw error;
      return data as unknown as ModeRecommendation;
    },
    onError: (error) => {
      toast({
        title: "Failed to get recommendation",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Create task with link
  const createTaskWithLink = useMutation({
    mutationFn: async ({ 
      fromTaskId, 
      capacity, 
      loopId, 
      context 
    }: { 
      fromTaskId?: string; 
      capacity: string; 
      loopId: string; 
      context?: any;
    }) => {
      const { data, error } = await supabase.rpc('create_task_with_link', {
        from_task_param: fromTaskId || null,
        capacity_param: capacity,
        loop_id_param: loopId,
        context_param: context || {}
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Task created",
        description: `${(data as any).task_name} has been created.`
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Link entities
  const linkEntities = useMutation({
    mutationFn: async ({ 
      source, 
      target 
    }: { 
      source: { type: string; id: string }; 
      target: { type: string; id: string };
    }) => {
      const { data, error } = await supabase.rpc('link_entities', {
        source_param: source,
        target_param: target
      });
      
      if (error) throw error;
      return data;
    }
  });

  // Global search for command palette
  const globalSearch = useQuery({
    queryKey: ['global-search'],
    queryFn: async () => [],
    enabled: false // Only run when explicitly called
  });

  const search = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    const { data, error } = await supabase.rpc('global_search', {
      query_param: query,
      limit_param: 20
    });
    
    if (error) throw error;
    return (data as unknown as SearchResult[]) || [];
  }, []);

  // Event logging
  const logEvent = useMutation({
    mutationFn: async ({ 
      eventType, 
      loopId, 
      taskId, 
      capacity, 
      metadata 
    }: { 
      eventType: string; 
      loopId?: string; 
      taskId?: string; 
      capacity?: string; 
      metadata?: any;
    }) => {
      const { error } = await supabase
        .from('mode_events')
        .insert({
          event_type: eventType,
          loop_id: loopId,
          task_id: taskId,
          capacity,
          metadata: metadata || {},
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
    }
  });

  // Command palette handlers
  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
    logEvent.mutate({ eventType: 'command_palette_open' });
  }, [logEvent]);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  const navigateToResult = useCallback((result: SearchResult) => {
    navigate(result.url);
    closeCommandPalette();
    logEvent.mutate({ 
      eventType: 'command_palette_nav',
      metadata: { 
        result_type: result.type,
        result_id: result.id 
      }
    });
  }, [navigate, closeCommandPalette, logEvent]);

  return {
    // Mode recommendation
    suggestCapacity,
    createTaskWithLink,
    linkEntities,
    
    // Search
    search,
    
    // Command palette
    isCommandPaletteOpen,
    openCommandPalette,
    closeCommandPalette,
    navigateToResult,
    
    // Event logging
    logEvent
  };
}