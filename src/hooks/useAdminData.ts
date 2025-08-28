import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

// Specific hooks for admin data (simplified without complex generics)
export const useUserRoles = () => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'user_roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async (data: TablesInsert<'user_roles'>) => {
      const { data: result, error } = await supabase
        .from('user_roles')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'user_roles'] });
      toast({
        title: 'Success',
        description: 'User role created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    data: list.data,
    isLoading: list.isLoading,
    error: list.error,
    create,
    refetch: list.refetch,
  };
};

export const useProfiles = () => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ['admin', 'profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return {
    data: list.data,
    isLoading: list.isLoading,
    error: list.error,
    refetch: list.refetch,
  };
};

export const useAuditLog = () => {
  return useQuery({
    queryKey: ['admin', 'audit_log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });
};

// Specialized hooks for complex queries
export const useOverviewStats = () => {
  return useQuery({
    queryKey: ['admin', 'overview-stats'],
    queryFn: async () => {
      const [
        tasksResult,
        watchpointsResult,
        auditResult,
        slaResult
      ] = await Promise.all([
        supabase
          .from('tasks_v2')
          .select('capacity, status')
          .in('status', ['open', 'claimed', 'active']),
        supabase
          .from('watchpoints')
          .select('id, armed')
          .eq('armed', true),
        supabase
          .from('audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('task_events_v2')
          .select('*')
          .eq('event_type', 'sla_breach')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        tasks: tasksResult.data || [],
        activeWatchpoints: watchpointsResult.data?.length || 0,
        recentAudit: auditResult.data || [],
        slaBreaches: slaResult.data?.length || 0,
      };
    },
  });
};

export const useOrgSettings = (orgId: string) => {
  const queryClient = useQueryClient();

  const settings = useQuery({
    queryKey: ['admin', 'org-settings', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('struct_runtime_artifacts')
        .select('*')
        .eq('kind', 'process_map')
        .eq('org_id', orgId)
        .is('session_id', null)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Record<string, any>) => {
      const { data, error } = await supabase
        .from('struct_runtime_artifacts')
        .upsert({
          kind: 'process_map',
          org_id: orgId,
          session_id: null,
          blob: newSettings,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'org-settings', orgId] });
      toast({
        title: 'Success',
        description: 'Organization settings updated successfully',
      });
    },
  });

  return {
    settings: settings.data,
    isLoading: settings.isLoading,
    updateSettings,
  };
};