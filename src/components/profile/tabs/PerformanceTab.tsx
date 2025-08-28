import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { PerformanceCharts } from '@/components/dashboard/PerformanceCharts';
import { CapacityBrainWidget } from '@/components/dashboard/CapacityBrainWidget';
import { useUpdatedDashboardData } from '@/hooks/useUpdatedDashboardData';
import { Badge } from '@/components/ui/badge';

interface PerformanceTabProps {
  user: any;
}

export const PerformanceTab: React.FC<PerformanceTabProps> = ({ user }) => {
  const { userStats, systemHealth, isLoading } = useUpdatedDashboardData();

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Activity" className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-foreground-muted">Active Loops</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : userStats.activeLoops}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            Current workspace
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Target" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground-muted">Completed Tasks</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : userStats.completedTasks}
          </div>
          <Badge variant="outline" className="text-xs mt-2">
            All time
          </Badge>
        </Card>

        <Card className="glass p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground-muted">Avg TRI Score</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {isLoading ? '...' : `${Math.round(userStats.avgTRI * 100)}%`}
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs mt-2 ${
              userStats.avgTRI >= 0.8 ? 'text-success border-success/30' : 
              userStats.avgTRI >= 0.6 ? 'text-warning border-warning/30' : 
              'text-destructive border-destructive/30'
            }`}
          >
            {userStats.avgTRI >= 0.8 ? 'Excellent' : 
             userStats.avgTRI >= 0.6 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </Card>
      </motion.div>

      {/* Performance Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="glass p-6">
          <PerformanceCharts />
        </Card>

        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Brain" className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Capacity Brain</h3>
          </div>
          <CapacityBrainWidget />
        </Card>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${
              systemHealth.status === 'healthy' ? 'bg-success' :
              systemHealth.status === 'warning' ? 'bg-warning' :
              'bg-destructive'
            }`} />
            <span className="text-foreground-muted">
              Status: {systemHealth.status === 'healthy' ? 'All systems operational' :
                      systemHealth.status === 'warning' ? `${systemHealth.breachCount} recent issues` :
                      `${systemHealth.breachCount} critical issues`}
            </span>
          </div>
          <div className="mt-4 text-xs text-foreground-subtle">
            Last checked: {new Date().toLocaleTimeString()}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};