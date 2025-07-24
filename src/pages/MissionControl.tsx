import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Activity, AlertTriangle, Clock, BarChart3, Zap, CheckSquare, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 bg-glass/80 backdrop-blur-20 px-6 flex items-center justify-between border-b border-border/50"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Mission Control</h1>
          {isFetching && (
            <RefreshCw className="w-4 h-4 text-primary animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
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
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full ${
              data?.systemStatus.online ? 'bg-emerald-500' : 'bg-destructive'
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
          <Card className="bg-glass/70 backdrop-blur-20 border-border/50 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-foreground">System Health</h2>
              <Gauge className="w-5 h-5 text-primary" />
            </div>
            
            {/* Health Gauge */}
            <div className="flex items-center justify-center mb-6">
              {isLoading ? (
                <Skeleton className="w-48 h-48 rounded-full" />
              ) : (
                <div className="w-48 h-48 rounded-full border-8 border-muted/20 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">
                      {data?.globalHealth.overall ?? 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Health</div>
                  </div>
                  {/* Simple progress ring */}
                  <svg className="absolute inset-0 w-48 h-48 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-primary/30"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - (data?.globalHealth.overall ?? 0) / 100)}`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                </div>
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
                      className="text-center p-3 rounded-xl bg-background/50 hover:bg-background/70 transition-colors"
                    >
                      <IconComponent className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-lg font-semibold text-foreground">{kpi.value}</div>
                      <div className="text-xs text-muted-foreground">{kpi.label}</div>
                      {kpi.changePercent && (
                        <div className={`text-xs mt-1 ${
                          kpi.trend === 'up' ? 'text-emerald-500' : 
                          kpi.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
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
          <Card className="bg-glass/50 backdrop-blur-20 border-border/50 p-4 h-full">
            <h3 className="text-xl font-medium text-foreground mb-4">Real-Time Alerts</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))
              ) : (
                data?.alerts.slice(0, 6).map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-background/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={
                            alert.type === 'error' ? 'destructive' :
                            alert.type === 'warning' ? 'secondary' :
                            alert.type === 'success' ? 'default' : 'outline'
                          } className="text-xs">
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.source}</span>
                        </div>
                        <p className="text-sm text-foreground font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ml-2 mt-2 ${
                        alert.type === 'error' ? 'bg-destructive' :
                        alert.type === 'warning' ? 'bg-warning' :
                        alert.type === 'success' ? 'bg-emerald-500' : 'bg-primary'
                      }`} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* AI Predictions */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <h4 className="text-sm font-medium text-foreground mb-3">AI Predictions</h4>
              <div className="space-y-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-4" />
                  ))
                ) : (
                  data?.predictions.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex-1">{item.prediction}</span>
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
          <Card className="bg-glass/70 backdrop-blur-20 border-border/50 p-6">
            <h3 className="text-xl font-medium text-foreground mb-4">Mission Timeline</h3>
            <div className="h-48 bg-background/30 rounded-xl flex items-center justify-center">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Interactive Gantt Chart - Coming in Phase 3</p>
                  <p className="text-xs text-muted-foreground">
                    {data?.timeline.length} events planned
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Resource & Budget Snapshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="bg-glass/70 backdrop-blur-20 border-border/50 p-6 h-full">
            <h3 className="text-xl font-medium text-foreground mb-4">Resources & Budget</h3>
            <div className="h-32 bg-background/30 rounded-xl flex items-center justify-center mb-4">
              <p className="text-muted-foreground">Resource Heatmap - Coming in Phase 3</p>
            </div>
            <div className="h-20 bg-background/30 rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Budget Sparklines - Coming in Phase 3</p>
            </div>
          </Card>
        </motion.div>

        {/* Digital Twin Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-1"
        >
          <Card className="bg-glass/70 backdrop-blur-20 border-border/50 p-4 h-full">
            <h3 className="text-lg font-medium text-foreground mb-4">Digital Twins</h3>
            <div className="grid grid-cols-2 gap-2">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 rounded-lg" />
                ))
              ) : (
                data?.digitalTwins.slice(0, 4).map((twin, index) => (
                  <motion.div 
                    key={twin.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="h-16 bg-background/30 rounded-lg flex flex-col items-center justify-center hover:bg-background/50 transition-colors cursor-pointer p-2"
                  >
                    <span className="text-xs text-foreground font-medium">{twin.name}</span>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        twin.status === 'running' ? 'bg-emerald-500' :
                        twin.status === 'completed' ? 'bg-blue-500' :
                        twin.status === 'paused' ? 'bg-yellow-500' : 'bg-destructive'
                      }`} />
                      <span className="text-xs text-muted-foreground">{twin.status}</span>
                    </div>
                  </motion.div>
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
          <Card className="bg-glass/70 backdrop-blur-20 border-border/50 p-4 h-full">
            <h3 className="text-lg font-medium text-foreground mb-4">Strategic Compass</h3>
            <div className="h-32 bg-background/30 rounded-xl flex items-center justify-center cursor-pointer hover:bg-background/50 transition-colors">
              <p className="text-xs text-muted-foreground text-center">3D Goal Tree<br />Coming in Phase 3</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Collaboration & Presence Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="h-12 bg-glass/80 backdrop-blur-20 flex items-center justify-between px-6 border-t border-border/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Online:</span>
          <div className="flex -space-x-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-6 h-6 rounded-full" />
              ))
            ) : (
              data?.presence.onlineUsers.slice(0, 6).map((user, index) => (
                <div 
                  key={user.id}
                  className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs"
                  title={`${user.name} - ${user.currentTask || 'Active'}`}
                >
                  {user.avatar || user.name.charAt(0)}
                </div>
              ))
            )}
            {data && data.presence.onlineUsers.length > 6 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                +{data.presence.onlineUsers.length - 6}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            className="bg-primary/20 text-primary rounded-full px-4 py-1 text-sm hover:bg-primary/30 transition-colors"
            size="sm"
            disabled={isLoading}
          >
            Start Pair Session
          </Button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              data?.systemStatus.online ? 'bg-emerald-500' : 'bg-destructive'
            }`} />
            <span className="text-xs text-muted-foreground">
              {data?.systemStatus.online ? 'All systems operational' : 'System offline'}
            </span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default MissionControl;