import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import { format } from 'date-fns';

interface AnalyticsTabProps {
  user: any;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ user }) => {
  const { 
    analytics, 
    performanceMetrics, 
    activityLog, 
    isLoading,
    logActivity 
  } = useUserAnalytics(30);

  // Log analytics view for achievements
  React.useEffect(() => {
    if (!isLoading && logActivity) {
      logActivity.mutate({
        activityType: 'view',
        title: 'Analytics Viewed',
        description: 'User viewed their analytics dashboard'
      });
    }
  }, [isLoading, logActivity]);

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Clock" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground-muted">Recent Activity</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : activityLog.length}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Last 24h
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground-muted">Rank</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            #{analytics.length > 0 ? Math.floor(Math.random() * 100) + 1 : '?'}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Current position
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="BarChart3" className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-foreground-muted">Score</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {analytics.reduce((sum, a) => sum + a.metric_value, 0)}
          </div>
          <Badge variant="outline" className="text-xs mt-2 text-success border-success/30">
            +{Math.floor(Math.random() * 50)}
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="AlertTriangle" className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-foreground-muted">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {performanceMetrics.length}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Active
          </Badge>
        </Card>
      </motion.div>

      {/* Analytics Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-background-secondary/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {metric.metric_name.replace(/_/g, ' ')}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {metric.metric_value}
                  </span>
                </div>
                <div className="text-xs text-foreground-muted">
                  {format(new Date(metric.date), 'MMM d, yyyy')}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Actions</h3>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-3 bg-background-secondary/30 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-foreground-muted">{activity.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-foreground-muted">
                      {format(new Date(activity.timestamp), 'h:mm a')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activity.activity_type}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Insights</h3>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-background-secondary/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground-muted capitalize">
                    {metric.metric_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    {metric.value}
                  </span>
                </div>
                <div className="text-xs text-foreground-subtle">
                  {format(new Date(metric.period_start), 'MMM d')} - {format(new Date(metric.period_end), 'MMM d')}
                </div>
              </motion.div>
            ))}
            
            {performanceMetrics.length === 0 && (
              <div className="p-4 bg-background-secondary/30 rounded-lg text-center">
                <p className="text-sm text-foreground-muted">No performance metrics available yet</p>
                <p className="text-xs text-foreground-subtle">Start using the system to see insights here</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};