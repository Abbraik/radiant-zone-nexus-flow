import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { EnhancedTask5C } from '@/5c/types';

// Database-first data hooks with real-time subscriptions
export const useDatabaseTasks = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['database-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks_5c')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000,
  });

  // Real-time subscription for tasks
  useEffect(() => {
    const channel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks_5c'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['database-tasks'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useDatabaseClaims = (taskId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['database-claims', taskId],
    queryFn: async () => {
      let query = supabase.from('claims_5c').select('*');
      
      if (taskId) {
        query = query.eq('task_id', taskId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!taskId,
    staleTime: 30000,
  });

  // Real-time subscription for claims
  useEffect(() => {
    const channel = supabase
      .channel('claims-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'claims_5c'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['database-claims'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useDatabaseScorecard = (loopId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['database-scorecard', loopId],
    queryFn: async () => {
      if (!loopId) return null;
      
      const { data, error } = await supabase
        .from('loop_scorecards_5c')
        .select('*')
        .eq('loop_id', loopId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!loopId,
    staleTime: 10000,
  });

  // Real-time subscription for scorecards
  useEffect(() => {
    const channel = supabase
      .channel('scorecards-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'loop_scorecards_5c'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['database-scorecard'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useDatabaseLoops = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['database-loops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loops')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 60000,
  });

  // Real-time subscription for loops
  useEffect(() => {
    const channel = supabase
      .channel('loops-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'loops'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['database-loops'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useDatabaseBreachEvents = (loopId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['database-breach-events', loopId],
    queryFn: async () => {
      let query = supabase.from('breach_events').select('*');
      
      if (loopId) {
        query = query.eq('loop_id', loopId);
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000,
  });

  // Real-time subscription for breach events
  useEffect(() => {
    const channel = supabase
      .channel('breach-events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'breach_events'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['database-breach-events'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};

export const useDatabaseDEBands = (loopId?: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['database-de-bands', loopId],
    queryFn: async () => {
      let query = supabase.from('de_bands_5c').select('*');
      
      if (loopId) {
        query = query.eq('loop_id', loopId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 60000,
  });

  // Real-time subscription for DE bands
  useEffect(() => {
    const channel = supabase
      .channel('de-bands-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'de_bands_5c'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['database-de-bands'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};