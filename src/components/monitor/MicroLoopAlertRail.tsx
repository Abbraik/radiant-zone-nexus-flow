import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  Wrench, 
  CheckCircle2,
  X,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MicroLoopAlert, TaskMetrics } from '../../types/analytics';

interface MicroLoopAlertRailProps {
  workspaceType: 'think' | 'act' | 'monitor' | 'innovate-learn';
  onAlertClick?: (alert: MicroLoopAlert) => void;
  onQuickFix?: (alertId: string) => void;
  onCreateTask?: (alert: MicroLoopAlert) => void;
  maxVisible?: number;
}

// Mock data for micro-loop alerts
const mockMicroLoopAlerts: MicroLoopAlert[] = [
  {
    id: 'micro-alert-1',
    loopId: 'micro-2',
    taskId: 'task-eia-1',
    type: 'delay',
    severity: 'critical',
    title: 'EIA Review Backlog',
    description: 'Environmental Impact Assessment reviews accumulating. Average completion time 12.8 hours vs target 8 hours.',
    suggestedAction: 'Reassign 2 senior reviewers or extend deadline by 3 days',
    autoResolvable: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    metadata: {
      taskType: 'approval',
      backlogCount: 8,
      averageDelay: 4.8,
      recommendedAction: 'resource_reallocation'
    }
  },
  {
    id: 'micro-alert-2',
    loopId: 'micro-1',
    taskId: 'task-grant-1',
    type: 'quality',
    severity: 'warning',
    title: 'Grant Application Quality',
    description: 'Document quality scores below threshold. 15% rework rate detected.',
    suggestedAction: 'Activate quality checklist automation',
    autoResolvable: true,
    timestamp: new Date(Date.now() - 28 * 60 * 1000), // 28 minutes ago
    metadata: {
      qualityScore: 72,
      threshold: 85,
      reworkRate: 15,
      automationAvailable: true
    }
  },
  {
    id: 'micro-alert-3',
    loopId: 'micro-3',
    taskId: 'task-budget-1',
    type: 'bottleneck',
    severity: 'warning',
    title: 'Budget Review Bottleneck',
    description: 'Finance team at 95% capacity. 3 budget reviews queued.',
    suggestedAction: 'Enable parallel review process or defer non-critical items',
    autoResolvable: false,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    metadata: {
      teamCapacity: 95,
      queueLength: 3,
      parallelProcessAvailable: true
    }
  },
  {
    id: 'micro-alert-4',
    loopId: 'micro-4',
    taskId: 'task-compliance-1',
    type: 'resource',
    severity: 'info',
    title: 'Resource Optimization',
    description: 'Compliance check automation achieved 25% efficiency gain.',
    suggestedAction: 'Apply same automation to related processes',
    autoResolvable: true,
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    metadata: {
      efficiencyGain: 25,
      applicableProcesses: ['document_review', 'stakeholder_notification'],
      automationType: 'rules_engine'
    }
  }
];

const AlertTypeIcon = ({ type, severity }: { type: string; severity: string }) => {
  const iconClass = `w-4 h-4 ${
    severity === 'critical' ? 'text-red-400' :
    severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
  }`;

  switch (type) {
    case 'delay':
      return <Clock className={iconClass} />;
    case 'quality':
      return <TrendingDown className={iconClass} />;
    case 'bottleneck':
      return <AlertTriangle className={iconClass} />;
    case 'resource':
      return <Wrench className={iconClass} />;
    case 'rework':
      return <ArrowRight className={iconClass} />;
    default:
      return <AlertTriangle className={iconClass} />;
  }
};

const MicroAlertCard: React.FC<{
  alert: MicroLoopAlert;
  compact?: boolean;
  onResolve: () => void;
  onQuickFix: () => void;
  onCreateTask: () => void;
  onView: () => void;
}> = ({ alert, compact = false, onResolve, onQuickFix, onCreateTask, onView }) => {
  const severityColors = {
    critical: 'bg-red-500/20 border-red-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    info: 'bg-blue-500/20 border-blue-500/30',
  };

  const timeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border ${severityColors[alert.severity]} backdrop-blur-sm`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <AlertTypeIcon type={alert.type} severity={alert.severity} />
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium text-sm truncate">{alert.title}</h4>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                alert.severity === 'critical' ? 'text-red-400 border-red-400/30' :
                alert.severity === 'warning' ? 'text-yellow-400 border-yellow-400/30' :
                'text-blue-400 border-blue-400/30'
              }`}
            >
              {alert.type}
            </Badge>
          </div>
          
          {!compact && (
            <p className="text-gray-300 text-xs leading-relaxed">
              {alert.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{timeAgo(alert.timestamp)}</span>
            
            <div className="flex items-center gap-2">
              {alert.autoResolvable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onQuickFix}
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs h-6 px-2"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Quick Fix
                </Button>
              )}
              
              {!alert.autoResolvable && alert.severity !== 'info' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCreateTask}
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-xs h-6 px-2"
                >
                  Create Task
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={onView}
                className="border-white/30 text-white hover:bg-white/10 text-xs h-6 px-2"
              >
                View
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={onResolve}
                className="text-gray-400 hover:text-white hover:bg-white/10 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const MicroLoopAlertRail: React.FC<MicroLoopAlertRailProps> = ({
  workspaceType,
  onAlertClick,
  onQuickFix,
  onCreateTask,
  maxVisible = 3,
}) => {
  const [alerts, setAlerts] = useState<MicroLoopAlert[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter alerts relevant to current workspace
  useEffect(() => {
    const workspaceAlerts = mockMicroLoopAlerts.filter(alert => {
      // In a real implementation, filter by workspace context
      if (workspaceType === 'act') return alert.severity === 'critical' || alert.type === 'delay';
      if (workspaceType === 'monitor') return true;
      if (workspaceType === 'think') return alert.type === 'bottleneck' || alert.type === 'resource';
      return alert.severity === 'critical';
    });

    setAlerts(workspaceAlerts.slice(0, maxVisible));
  }, [workspaceType, maxVisible]);

  const handleQuickFix = (alertId: string) => {
    onQuickFix?.(alertId);
    // Simulate quick fix resolution
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleCreateTask = (alert: MicroLoopAlert) => {
    onCreateTask?.(alert);
    // Mark as resolved after task creation
    setAlerts(prev => prev.filter(a => a.id !== alert.id));
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  if (alerts.length === 0) {
    return (
      <motion.div
        className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <CheckCircle2 className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-sm font-medium">
          All micro-loops operating normally
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Alert Summary Header */}
      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-white font-medium text-sm">Micro-Loop Alerts</span>
          </div>
          
          {criticalCount > 0 && (
            <Badge variant="outline" className="text-red-400 border-red-400/30 text-xs">
              {criticalCount} critical
            </Badge>
          )}
          
          {warningCount > 0 && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
              {warningCount} warning
            </Badge>
          )}
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white p-1"
        >
          {isCollapsed ? '▼' : '▲'}
        </Button>
      </div>

      {/* Alert List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="space-y-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {alerts.map((alert) => (
              <MicroAlertCard
                key={alert.id}
                alert={alert}
                compact={workspaceType !== 'monitor'}
                onResolve={() => handleResolve(alert.id)}
                onQuickFix={() => handleQuickFix(alert.id)}
                onCreateTask={() => handleCreateTask(alert)}
                onView={() => onAlertClick?.(alert)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};