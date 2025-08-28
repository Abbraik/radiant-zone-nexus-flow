import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserAnalytic {
  id: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  period_start: string;
  period_end: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, any>;
  timestamp: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
}

export const useUserAnalytics = (days: number = 30) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user analytics for the specified period
  const analytics = useQuery({
    queryKey: ['user-analytics', user?.id, days],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      return data as UserAnalytic[];
    },
    enabled: !!user?.id,
  });

  // Get performance metrics
  const performanceMetrics = useQuery({
    queryKey: ['performance-metrics', user?.id, days],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('period_start', startDate.toISOString())
        .order('period_start', { ascending: false });

      if (error) throw error;
      return data as PerformanceMetric[];
    },
    enabled: !!user?.id,
  });

  // Get recent activity log
  const activityLog = useQuery({
    queryKey: ['user-activity-log', user?.id, days],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ActivityLogEntry[];
    },
    enabled: !!user?.id,
  });

  // Record a new analytics entry
  const recordAnalytic = useMutation({
    mutationFn: async ({ metricName, metricValue, metadata = {} }: {
      metricName: string;
      metricValue: number;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_analytics')
        .upsert({
          user_id: user.id,
          metric_name: metricName,
          metric_value: metricValue,
          date: new Date().toISOString().split('T')[0],
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-analytics', user?.id] });
    },
  });

  // Record a performance metric
  const recordPerformanceMetric = useMutation({
    mutationFn: async ({ metricType, value, periodStart, periodEnd, metadata = {} }: {
      metricType: string;
      value: number;
      periodStart: string;
      periodEnd: string;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('performance_metrics')
        .insert({
          user_id: user.id,
          metric_type: metricType,
          value,
          period_start: periodStart,
          period_end: periodEnd,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-metrics', user?.id] });
    },
  });

  // Log an activity
  const logActivity = useMutation({
    mutationFn: async ({ activityType, title, description, metadata = {}, relatedEntityType, relatedEntityId }: {
      activityType: string;
      title: string;
      description?: string;
      metadata?: Record<string, any>;
      relatedEntityType?: string;
      relatedEntityId?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_activity_log')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          title,
          description,
          metadata,
          related_entity_type: relatedEntityType,
          related_entity_id: relatedEntityId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activity-log', user?.id] });
    },
  });

  return {
    analytics: analytics.data || [],
    performanceMetrics: performanceMetrics.data || [],
    activityLog: activityLog.data || [],
    isLoading: analytics.isLoading || performanceMetrics.isLoading || activityLog.isLoading,
    error: analytics.error || performanceMetrics.error || activityLog.error,
    recordAnalytic,
    recordPerformanceMetric,
    logActivity,
  };
};

// Helper hooks for specific analytics
export const useUserStats = () => {
  const { analytics, performanceMetrics } = useUserAnalytics(30);
  
  // Calculate derived stats
  const tasksCompleted = analytics
    .filter(a => a.metric_name === 'tasks_completed')
    .reduce((sum, a) => sum + a.metric_value, 0);
  
  const avgCompletionTime = performanceMetrics
    .filter(pm => pm.metric_type === 'avg_completion_time')
    .reduce((sum, pm, _, arr) => sum + pm.value / arr.length, 0);

  return {
    completed: tasksCompleted,
    pending: analytics
      .filter(a => a.metric_name === 'tasks_pending')
      .reduce((sum, a) => sum + a.metric_value, 0),
    avgTime: avgCompletionTime,
  };
};