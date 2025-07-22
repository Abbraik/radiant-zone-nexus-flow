import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Bell, 
  Settings, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  Target,
  CheckCircle,
  TrendingUp,
  User
} from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { useFeatureFlags, FeatureFlagGuard } from '../layout/FeatureFlagProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';
import CascadeBar from './CascadeBar';
import { mockGoals, Goal, OKR } from '../../modules/collab/data/mockData';

interface CascadeSidebarProps {
  myTasks: Task[];
  availableTasks: Task[];
  activeTask: Task | null;
  onTaskClaim?: (taskId: string) => void;
  onOKRSelect?: (okr: OKR) => void;
}

const CascadeSidebar: React.FC<CascadeSidebarProps> = ({
  myTasks,
  availableTasks,
  activeTask,
  onTaskClaim,
  onOKRSelect
}) => {
  const { flags } = useFeatureFlags();
  const [alertsExpanded, setAlertsExpanded] = useState(true);
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const [goalsExpanded, setGoalsExpanded] = useState(true);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(['G1']));
  const [selectedOKR, setSelectedOKR] = useState<string | null>(null);

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

  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'at-risk':
        return <AlertTriangle className="h-3 w-3 text-yellow-400" />;
      case 'off-track':
        return <AlertTriangle className="h-3 w-3 text-red-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'at-risk': return 'bg-yellow-500';
      case 'off-track': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
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

        {/* Portfolio Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-medium text-white">Portfolio Status</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3 bg-glass/50 backdrop-blur-20 rounded-lg border border-white/10">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">72%</div>
              <div className="text-xs text-gray-400">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">3</div>
              <div className="text-xs text-gray-400">At Risk</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">8</div>
              <div className="text-xs text-gray-400">Tasks</div>
            </div>
          </div>
        </div>

        {/* Goals & OKRs Section */}
        <div className="space-y-3">
          <button
            onClick={() => setGoalsExpanded(!goalsExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-white hover:text-teal-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Goals & OKRs</span>
            </div>
            {goalsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          <AnimatePresence>
            {goalsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {mockGoals.slice(0, 2).map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-white/10 rounded-lg overflow-hidden bg-glass/30"
                  >
                    {/* Goal Header */}
                    <div
                      onClick={() => toggleGoal(goal.id)}
                      className="p-2 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {expandedGoals.has(goal.id) ? (
                            <ChevronDown className="h-3 w-3 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                          )}
                          {getStatusIcon(goal.status)}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-medium text-white truncate">{goal.title}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">{goal.progress}%</span>
                          <div className="w-8">
                            <Progress value={goal.progress} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* OKRs */}
                    <AnimatePresence>
                      {expandedGoals.has(goal.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 space-y-2">
                            {goal.okrs.slice(0, 2).map((okr) => (
                              <div
                                key={okr.id}
                                className="p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(okr.status)}
                                    <h5 className="text-xs font-medium text-white truncate">{okr.title}</h5>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOKR(okr.id);
                                      onOKRSelect?.(okr);
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 h-auto p-1"
                                  >
                                    View
                                  </Button>
                                </div>

                                {/* Progress */}
                                <div className="mb-2">
                                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>{okr.current}/{okr.target}</span>
                                    <span>{Math.round((okr.current / okr.target) * 100)}%</span>
                                  </div>
                                  <Progress 
                                    value={(okr.current / okr.target) * 100} 
                                    className="h-1"
                                  />
                                </div>

                                {/* Sample Tasks */}
                                {okr.tasks.slice(0, 2).map((task) => (
                                  <div
                                    key={task.id}
                                    className="flex items-center justify-between p-1 bg-white/5 rounded text-xs"
                                  >
                                    <div className="flex items-center gap-1">
                                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(
                                        task.status === 'completed' ? 'on-track' :
                                        task.status === 'in-progress' ? 'at-risk' : 'off-track'
                                      )}`} />
                                      <span className="text-white truncate">{task.title}</span>
                                    </div>
                                    {task.status === 'available' && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleTaskClaim(task.id)}
                                        className="text-xs text-green-400 hover:text-green-300 h-auto p-1"
                                      >
                                        Claim
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Available Tasks Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Available Tasks</h3>
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
              {availableTasks.length}
            </span>
          </div>
          
          <div className="space-y-2">
            {availableTasks.slice(0, 3).map((task) => (
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
            
            {availableTasks.length > 3 && (
              <div className="text-center py-2">
                <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                  View {availableTasks.length - 3} more tasks
                </Button>
              </div>
            )}
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