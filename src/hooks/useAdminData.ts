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

// Updated overview stats to use 5C backend data
export const useOverviewStats = () => {
  return useQuery({
    queryKey: ['admin', '5c-overview-stats'],
    queryFn: async () => {
      const [
        tasksResult,
        claimsResult,
        auditResult,
        rolesResult,
        watchpointsResult
      ] = await Promise.all([
        // Get 5C tasks
        supabase
          .from('tasks_5c')
          .select('id, capacity, status, title, payload')
          .in('status', ['open', 'claimed', 'active', 'done', 'blocked']),
        // Get 5C claims for additional context
        supabase
          .from('claims_5c')
          .select('id, status, task_id')
          .in('status', ['active', 'draft', 'done']),
        // Get recent audit logs
        supabase
          .from('audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
        // Get user roles for admin stats
        supabase
          .from('user_roles')
          .select('role, user_id'),
        // Get watchpoints for system health
        supabase
          .from('antic_watchpoints')
          .select('id, status, risk_channel')
          .eq('status', 'armed')
      ]);

      // Calculate 5C task stats
      const tasks = tasksResult.data || [];
      const claims = claimsResult.data || [];
      const availableTasks = tasks.filter(t => t.status === 'open').length;
      const claimedTasks = tasks.filter(t => ['claimed', 'active'].includes(t.status)).length;
      const completedTasks = tasks.filter(t => t.status === 'done').length;
      const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
      
      // Calculate capacity distribution
      const capacityStats = tasks.reduce((acc, task) => {
        acc[task.capacity] = (acc[task.capacity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Calculate role distribution  
      const roles = rolesResult.data || [];
      const adminCount = roles.filter(r => ['admin', 'owner'].includes(r.role)).length;
      const userCount = new Set(roles.map(r => r.user_id)).size; // Unique users

      return {
        // 5C Task statistics
        tasks: tasks,
        totalTasks: tasks.length,
        availableTasks: availableTasks,
        claimedTasks: claimedTasks,
        completedTasks: completedTasks,
        blockedTasks: blockedTasks,
        capacityStats: capacityStats,
        
        // Claims statistics
        totalClaims: claims.length,
        activeClaims: claims.filter(c => c.status === 'active').length,
        
        // User statistics  
        totalUsers: userCount,
        adminUsers: adminCount,
        
        // System health from real data
        activeWatchpoints: watchpointsResult.data?.length || 0,
        slaBreaches: 0, // Can be enhanced with real SLA tracking
        
        // Recent activity
        recentAudit: auditResult.data || [],
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