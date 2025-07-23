import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Bell, Settings, Wrench, Clock, AlertTriangle } from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { useFeatureFlags, FeatureFlagGuard } from '../layout/FeatureFlagProvider';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import CascadeBar from './CascadeBar';

interface CascadeSidebarProps {
  myTasks: Task[];
  availableTasks: Task[];
  activeTask: Task | null;
  onTaskClaim?: (taskId: string) => void;
}

const CascadeSidebar: React.FC<CascadeSidebarProps> = ({
  myTasks,
  availableTasks,
  activeTask,
  onTaskClaim
}) => {
  const { flags } = useFeatureFlags();
  const [alertsExpanded, setAlertsExpanded] = useState(true);
  const [toolsExpanded, setToolsExpanded] = useState(false);

  // Mock alerts data
  const alerts = [
    {
      id: '1',
      type: 'critical',
      title: 'TRI Score Low',
      message: 'Loop C performance below threshold',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '2', 
      type: 'warning',
      title: 'Bundle Pending',
      message: 'Review bundle B before publication',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'info',
      title: 'Simulation Complete',
      message: 'Scenario X results ready for review',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ];

  // Mock tools
  const tools = [
    { id: '1', name: 'TRI Calculator', description: 'Quick system health check' },
    { id: '2', name: 'Bundle Generator', description: 'Create intervention packages' },
    { id: '3', name: 'Tension Analyzer', description: 'Evaluate system tensions' },
    { id: '4', name: 'Metric Dashboard', description: 'View performance metrics' }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <Clock className="h-4 w-4 text-orange-400" />;
      default: return <Bell className="h-4 w-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-400/30 bg-red-500/10';
      case 'warning': return 'border-orange-400/30 bg-orange-500/10';
      default: return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleTaskClaim = (taskId: string) => {
    console.log('CascadeSidebar: handleTaskClaim called with taskId:', taskId);
    console.log('CascadeSidebar: onTaskClaim function:', onTaskClaim);
    onTaskClaim?.(taskId);
  };

  return (
    <div className="w-80 h-full bg-glass/70 backdrop-blur-20 border-r border-white/10 flex flex-col">
      {/* Cascade Bar */}
      <div className="p-4 border-b border-white/10">
        <FeatureFlagGuard flag="useCascadeBar" fallback={
          <div className="text-center py-4 text-gray-400 text-sm">
            Cascade view disabled
          </div>
        }>
          <CascadeBar 
            activeTask={activeTask}
            onNodeClick={(type, id) => console.log('Cascade node clicked:', type, id)}
          />
        </FeatureFlagGuard>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 p-4">
        
        {/* Available Tasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Available Tasks</h3>
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
              {availableTasks.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {availableTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-glass/50 backdrop-blur-20 rounded-lg border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-white group-hover:text-teal-300 transition-colors">
                      {task.title}
                    </h4>
                    <span className="text-xs text-gray-400 bg-white/10 px-1.5 py-0.5 rounded">
                      {task.zone}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {task.loop_id && (task.type.includes('simulation') ? `Scenario ${task.loop_id}` : `Loop ${task.loop_id}`)}
                    </span>
                    
                    <FeatureFlagGuard flag="useTaskClaimPopup" fallback={
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskClaim(task.id)}
                        className="text-xs bg-teal-500/20 text-teal-300 border-teal-400/30 hover:bg-teal-500/30"
                      >
                        Claim
                      </Button>
                    }>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskClaim(task.id)}
                        className="text-xs bg-teal-500/20 text-teal-300 border-teal-400/30 hover:bg-teal-500/30"
                      >
                        Claim
                      </Button>
                    </FeatureFlagGuard>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="space-y-3">
          <button
            onClick={() => setAlertsExpanded(!alertsExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
                {alerts.filter(a => a.type === 'critical').length}
              </span>
              {alertsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </button>

          <AnimatePresence>
            {alertsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'p-3 rounded-lg border',
                      getAlertColor(alert.type)
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-gray-300 mt-1">
                          {alert.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {formatTime(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tools Panel */}
        <div className="space-y-3">
          <button
            onClick={() => setToolsExpanded(!toolsExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span>Tools</span>
            </div>
            {toolsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {toolsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full p-3 bg-glass/50 backdrop-blur-20 rounded-lg border border-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <h4 className="text-sm font-medium text-white group-hover:text-teal-300 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-300 mt-1">
                      {tool.description}
                    </p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CascadeSidebar;