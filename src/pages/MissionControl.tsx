import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Clock, BarChart3, Zap, CheckSquare, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Gauge } from '../components/ui/gauge';
import { AlertTicker } from '../components/ui/alert-ticker';
import { DigitalTwinThumbnail } from '../components/ui/digital-twin-thumbnail';
import { ModernTimeline } from '../components/ui/modern-timeline';
import { ResourceHeatmap } from '../components/ui/resource-heatmap';
import { GoalTreeMinimap } from '../components/ui/goal-tree-minimap';
import { useMissionControlData, useMissionControlActions } from './missionControl/useMissionControlData';
import { formatDistanceToNow } from 'date-fns';

// Icon mapping for KPIs
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  AlertTriangle, 
  Clock,
  CheckSquare,
  Zap,
  BarChart3
};

const MissionControl: React.FC = () => {
  const { data, isLoading, error, isFetching } = useMissionControlData();
  const { refreshAll } = useMissionControlActions();

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Mission Control</h2>
          <p className="text-muted-foreground mb-4">Failed to load dashboard data. Please try again.</p>
          <Button onClick={() => refreshAll()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 bg-black/30 backdrop-blur-xl border-b border-white/20 px-6 flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400/30 to-cyan-500/30 flex items-center justify-center border border-teal-400/50 shadow-lg shadow-teal-400/20">
            <Activity className="w-5 h-5 text-teal-300 drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-semibold text-white drop-shadow-sm">Mission Control</h1>
          {isFetching && (
            <RefreshCw className="w-4 h-4 text-teal-300 animate-spin drop-shadow-sm" />
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-200 font-medium">
            Last updated: {data?.systemStatus.lastSync ? 
              formatDistanceToNow(data.systemStatus.lastSync, { addSuffix: true }) : 
              'Loading...'
            }
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refreshAll()}
            disabled={isFetching}
            className="hover:bg-white/10 border border-white/20"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/30 to-emerald-500/30 flex items-center justify-center border border-teal-400/50 shadow-lg shadow-teal-400/20">
            <div className={`w-2 h-2 rounded-full ${
              data?.systemStatus.online ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
            }`} />
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Global Health & KPI Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 p-6 h-full shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white drop-shadow-sm">System Health</h2>
              <BarChart3 className="w-5 h-5 text-teal-300 drop-shadow-sm" />
            </div>
            
            {/* Health Gauge */}
            <div className="flex items-center justify-center mb-6">
              {isLoading ? (
                <Skeleton className="w-48 h-48 rounded-full" />
              ) : (
                <Gauge
                  value={data?.globalHealth.overall ?? 0}
                  size={200}
                  thickness={8}
                  label="Overall Health"
                  showValue={true}
                />
              )}
            </div>

            {/* KPI List */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 rounded-xl" />
                ))
              ) : (
                data?.kpis.map((kpi, index) => {
                  const IconComponent = iconMap[kpi.icon] || Activity;
                  return (
                    <motion.div
                      key={kpi.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-center p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-200 border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <IconComponent className="w-6 h-6 text-teal-300 mx-auto mb-3 drop-shadow-sm" />
                      <div className="text-xl font-bold text-white drop-shadow-sm">{kpi.value}</div>
                      <div className="text-sm text-gray-200 font-medium">{kpi.label}</div>
                      {kpi.changePercent && (
                        <div className={`text-sm mt-2 font-semibold ${
                          kpi.trend === 'up' ? 'text-emerald-300' : 
                          kpi.trend === 'down' ? 'text-red-300' : 'text-gray-300'
                        }`}>
                          {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </Card>
        </motion.div>

        {/* Alerts & Anomalies Feed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 p-6 h-full shadow-2xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-sm">Real-Time Alerts</h3>
            
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : data?.alerts && data.alerts.length > 0 ? (
              <AlertTicker
                alerts={data.alerts}
                autoScroll={true}
                pauseOnHover={true}
                maxVisible={4}
                className="max-h-64 overflow-hidden"
              />
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-200 font-medium">
                No alerts at this time
              </div>
            )}
            
            {/* AI Predictions */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <h4 className="text-lg font-semibold text-white mb-4 drop-shadow-sm">AI Predictions</h4>
              <div className="space-y-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-4" />
                  ))
                ) : (
                  data?.predictions.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-200 flex-1 font-medium">{item.prediction}</span>
                      <Badge variant="outline" className="ml-2">
                        {item.confidence}%
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mission Timeline & Calendar - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 lg:col-span-4"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-2xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-sm">Mission Timeline</h3>
            {isLoading ? (
              <Skeleton className="w-full h-48" />
            ) : data?.timeline && data.timeline.length > 0 ? (
              <ModernTimeline
                events={data.timeline}
                height={192}
                className="w-full"
              />
            ) : (
              <div className="h-48 bg-background/30 rounded-xl flex items-center justify-center">
                <p className="text-gray-200 font-medium">No timeline events available</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Resource & Budget Snapshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 p-6 h-full shadow-2xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-sm">Resources & Budget</h3>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-20" />
              </div>
            ) : data?.resources && data.resources.length > 0 ? (
              <ResourceHeatmap resources={data.resources} />
            ) : (
              <div className="h-32 bg-background/30 rounded-xl flex items-center justify-center">
                <p className="text-gray-200 font-medium">No resource data available</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Digital Twin Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-1"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 p-4 h-full shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-4 drop-shadow-sm">Digital Twins</h3>
            <div className="grid grid-cols-2 gap-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 rounded-lg" />
                ))
              ) : (
                data?.digitalTwins.slice(0, 4).map((twin, index) => (
                  <DigitalTwinThumbnail
                    key={twin.id}
                    twin={twin}
                    onClick={() => console.log('Open twin details:', twin.id)}
                    className="h-20"
                  />
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Cascade 3D Strategic Compass */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="col-span-1"
        >
          <Card className="bg-white/5 backdrop-blur-xl border border-white/20 p-4 h-full shadow-2xl shadow-black/20">
            <h3 className="text-lg font-semibold text-white mb-4 drop-shadow-sm">Strategic Compass</h3>
            {isLoading ? (
              <Skeleton className="w-full h-32" />
            ) : data?.goalTree && data.goalTree.length > 0 ? (
              <div className="flex justify-center">
                <GoalTreeMinimap
                  goalTree={data.goalTree}
                  onNodeClick={(node) => console.log('Open goal details:', node.id)}
                  size={150}
                />
              </div>
            ) : (
              <div className="h-32 bg-background/30 rounded-xl flex items-center justify-center">
                <p className="text-sm text-gray-200 text-center font-medium">No goal data available</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Collaboration & Presence Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="h-12 bg-black/30 backdrop-blur-xl border-t border-white/20 flex items-center justify-between px-6 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-200 font-medium">Online:</span>
          <div className="flex -space-x-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-6 h-6 rounded-full" />
              ))
            ) : (
              data?.presence.onlineUsers.slice(0, 6).map((user, index) => (
                <div 
                  key={user.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/30 to-cyan-500/30 border-2 border-white/30 flex items-center justify-center text-sm font-medium text-white shadow-lg"
                  title={`${user.name} - ${user.currentTask || 'Active'}`}
                >
                  {user.avatar || user.name.charAt(0)}
                </div>
              ))
            )}
            {data && data.presence.onlineUsers.length > 6 && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-white/30 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                +{data.presence.onlineUsers.length - 6}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-200 rounded-full px-6 py-2 text-sm hover:from-teal-500/30 hover:to-cyan-500/30 transition-all duration-200 border border-teal-400/30 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium"
            size="sm"
            disabled={isLoading}
          >
            Start Pair Session
          </Button>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full shadow-lg ${
              data?.systemStatus.online ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 shadow-red-400/50'
            }`} />
            <span className="text-sm text-gray-200 font-medium">
              {data?.systemStatus.online ? 'All systems operational' : 'System offline'}
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default MissionControl;