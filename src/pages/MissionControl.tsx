import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Activity, AlertTriangle, Clock, BarChart3, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';

const MissionControl: React.FC = () => {
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
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
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
            
            {/* Placeholder for Gauge Component */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-48 h-48 rounded-full border-8 border-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">94%</div>
                  <div className="text-sm text-muted-foreground">Overall Health</div>
                </div>
              </div>
            </div>

            {/* KPI List */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Activity, label: 'Active Sprints', value: '12' },
                { icon: AlertTriangle, label: 'Critical Issues', value: '3' },
                { icon: Clock, label: 'Avg Response', value: '2.4h' },
                { icon: BarChart3, label: 'Pending Approvals', value: '8' },
                { icon: Zap, label: 'Sim Runs Today', value: '156' }
              ].map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center p-3 rounded-xl bg-background/50"
                >
                  <kpi.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-lg font-semibold text-foreground">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
                </motion.div>
              ))}
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
              {[
                { type: 'warning', message: 'Sprint velocity declining in Team Alpha', time: '2m ago' },
                { type: 'info', message: 'New digital twin simulation completed', time: '5m ago' },
                { type: 'error', message: 'Budget threshold exceeded in Project Beta', time: '12m ago' },
                { type: 'success', message: 'OKR milestone achieved ahead of schedule', time: '15m ago' }
              ].map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-background/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ml-2 mt-2 ${
                      alert.type === 'error' ? 'bg-destructive' :
                      alert.type === 'warning' ? 'bg-warning' :
                      alert.type === 'success' ? 'bg-success' : 'bg-primary'
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* AI Predictions */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <h4 className="text-sm font-medium text-foreground mb-3">AI Predictions</h4>
              <div className="space-y-2">
                {[
                  { prediction: 'Resource bottleneck likely in Q2', confidence: 85 },
                  { prediction: 'Sprint completion rate may improve', confidence: 72 },
                  { prediction: 'Budget variance expected next month', confidence: 91 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.prediction}</span>
                    <span className="text-primary font-medium">{item.confidence}%</span>
                  </div>
                ))}
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
              <p className="text-muted-foreground">Interactive Gantt Chart - Coming in Phase 3</p>
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
              <p className="text-muted-foreground">Resource Heatmap - Coming in Phase 2</p>
            </div>
            <div className="h-20 bg-background/30 rounded-xl flex items-center justify-center">
              <p className="text-muted-foreground">Budget Sparklines - Coming in Phase 2</p>
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
              {[1, 2, 3, 4].map((twin) => (
                <div key={twin} className="h-16 bg-background/30 rounded-lg flex items-center justify-center hover:bg-background/50 transition-colors cursor-pointer">
                  <span className="text-xs text-muted-foreground">Twin {twin}</span>
                </div>
              ))}
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
              <p className="text-xs text-muted-foreground text-center">3D Goal Tree<br />Coming in Phase 2</p>
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
            {[1, 2, 3, 4].map((user) => (
              <div key={user} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                <span className="text-xs text-primary">{user}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-primary/20 text-primary rounded-full px-4 py-1 text-sm hover:bg-primary/30 transition-colors">
            Start Pair Session
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default MissionControl;