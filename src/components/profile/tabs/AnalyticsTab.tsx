import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Users, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { useUpdatedDashboardData } from '@/hooks/useUpdatedDashboardData';
import { Badge } from '@/components/ui/badge';

interface AnalyticsTabProps {
  user: any;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ user }) => {
  const { recentActivity, leaderboard, systemHealth, isLoading } = useUpdatedDashboardData();

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
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground-muted">Recent Activity</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : recentActivity.length}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Last 24h
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground-muted">Rank</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            #{leaderboard[0]?.rank || '?'}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Current position
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-foreground-muted">Score</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {leaderboard[0]?.score || '0'}
          </div>
          <Badge variant="outline" className="text-xs mt-2 text-success border-success/30">
            {leaderboard[0]?.change || '+0'}
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-foreground-muted">Alerts</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {systemHealth.breachCount}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Active
          </Badge>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Activity Timeline</h3>
          <ActivityTimeline />
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
            {recentActivity.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-3 bg-background-secondary/30 rounded-lg"
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-foreground-muted">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                    {activity.capacity && (
                      <Badge variant="outline" className="text-xs">
                        {activity.capacity}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Workspace Analytics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-background-secondary/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-muted">Active Sessions</span>
                <span className="text-lg font-semibold text-foreground">1</span>
              </div>
              <div className="text-xs text-foreground-subtle">Current session duration: 2h 34m</div>
            </div>

            <div className="p-4 bg-background-secondary/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-muted">Data Quality</span>
                <Badge variant="outline" className="text-success border-success/30">Good</Badge>
              </div>
              <div className="text-xs text-foreground-subtle">All indicators within normal range</div>
            </div>

            <div className="p-4 bg-background-secondary/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground-muted">System Load</span>
                <span className="text-lg font-semibold text-foreground">23%</span>
              </div>
              <div className="text-xs text-foreground-subtle">Optimal performance range</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};