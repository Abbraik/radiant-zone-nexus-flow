import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  Target,
  Play,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle
} from 'lucide-react';
import { goals, okrs, cascadeTasks } from '../../modules/collab/data/mockData';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface CascadeSidebarProps {
  onTaskClaim: (taskId: string) => void;
  activeTaskId?: string;
}

export const CascadeSidebar: React.FC<CascadeSidebarProps> = ({ 
  onTaskClaim, 
  activeTaskId 
}) => {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(['goal1']));
  const [expandedOKRs, setExpandedOKRs] = useState<Set<string>>(new Set(['okr1']));

  const toggleGoal = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const toggleOKR = (okrId: string) => {
    const newExpanded = new Set(expandedOKRs);
    if (newExpanded.has(okrId)) {
      newExpanded.delete(okrId);
    } else {
      newExpanded.add(okrId);
    }
    setExpandedOKRs(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'available': return 'text-yellow-400';
      case 'blocked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Play;
      case 'available': return Clock;
      case 'blocked': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="w-80 bg-glass/70 backdrop-blur-20 border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-teal-400" />
          <h2 className="text-lg font-semibold text-white">Cascade View</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">Goals → OKRs → Tasks</p>
      </div>

      {/* Cascade Tree */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {goals.map((goal) => {
          const goalOKRs = okrs.filter(okr => okr.goalId === goal.id);
          const isExpanded = expandedGoals.has(goal.id);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {/* Goal */}
              <div
                onClick={() => toggleGoal(goal.id)}
                className="p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white">{goal.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={goal.progress} className="flex-1 h-1" />
                      <span className="text-xs text-gray-400">{goal.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OKRs */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 space-y-2"
                  >
                    {goalOKRs.map((okr) => {
                      const okrTasks = cascadeTasks.filter(task => task.okrId === okr.id);
                      const isOKRExpanded = expandedOKRs.has(okr.id);

                      return (
                        <div key={okr.id} className="space-y-2">
                          {/* OKR */}
                          <div
                            onClick={() => toggleOKR(okr.id)}
                            className="p-2 bg-white/5 border border-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isOKRExpanded ? (
                                <ChevronDown className="h-3 w-3 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-gray-400" />
                              )}
                              <div className="flex-1">
                                <h4 className="text-xs font-medium text-white">{okr.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Progress value={okr.progress} className="flex-1 h-1" />
                                  <span className="text-xs text-gray-400">{okr.current}/{okr.target}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tasks */}
                          <AnimatePresence>
                            {isOKRExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-4 space-y-1"
                              >
                                {okrTasks.map((task) => {
                                  const StatusIcon = getStatusIcon(task.status);
                                  const isActive = activeTaskId === task.id;

                                  return (
                                    <motion.div
                                      key={task.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className={`p-2 rounded-lg border transition-all ${
                                        isActive
                                          ? 'bg-teal-500/20 border-teal-500/50'
                                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <StatusIcon className={`h-3 w-3 ${getStatusColor(task.status)}`} />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs text-white truncate">{task.title}</p>
                                          <div className="flex items-center gap-1 mt-1">
                                            <Badge 
                                              variant="secondary" 
                                              className="bg-white/10 text-xs px-1 py-0"
                                            >
                                              {task.zone}
                                            </Badge>
                                            {task.assignee && (
                                              <Badge 
                                                variant="secondary" 
                                                className="bg-blue-500/20 text-blue-300 text-xs px-1 py-0"
                                              >
                                                <Users className="h-2 w-2 mr-1" />
                                                {task.assignee}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        {task.status === 'available' && !isActive && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              console.log('🔥 Claim button clicked for task:', task.id);
                                              onTaskClaim(task.id);
                                            }}
                                            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 px-2 text-xs"
                                          >
                                            Claim
                                          </Button>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};