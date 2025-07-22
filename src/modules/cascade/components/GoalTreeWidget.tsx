import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { mockGoals, Goal, OKR } from '../../collab/data/mockData';

interface GoalTreeWidgetProps {
  onTaskClaim?: (taskId: string) => void;
  onOKRSelect?: (okr: OKR) => void;
}

export const GoalTreeWidget: React.FC<GoalTreeWidgetProps> = ({ 
  onTaskClaim, 
  onOKRSelect 
}) => {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(['G1']));
  const [selectedOKR, setSelectedOKR] = useState<string | null>(null);

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
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'at-risk':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'off-track':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-500';
      case 'at-risk':
        return 'bg-yellow-500';
      case 'off-track':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <Card className="p-6 bg-glass/70 backdrop-blur-20 border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Goals & OKRs</h3>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          Cascade View
        </Badge>
      </div>

      <div className="space-y-4">
        {mockGoals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-white/10 rounded-lg overflow-hidden"
          >
            {/* Goal Header */}
            <div
              onClick={() => toggleGoal(goal.id)}
              className="p-4 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedGoals.has(goal.id) ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  {getStatusIcon(goal.status)}
                  <div>
                    <h4 className="text-sm font-medium text-white">{goal.title}</h4>
                    <p className="text-xs text-gray-400">{goal.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{goal.progress}%</span>
                  <div className="w-16">
                    <Progress value={goal.progress} className="h-2" />
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
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {goal.okrs.map((okr) => (
                      <div
                        key={okr.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedOKR === okr.id
                            ? 'border-blue-500/50 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(okr.status)}
                            <h5 className="text-sm font-medium text-white">{okr.title}</h5>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedOKR(okr.id);
                              onOKRSelect?.(okr);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View Details
                          </Button>
                        </div>

                        <p className="text-xs text-gray-400 mb-3">{okr.description}</p>

                        {/* Progress */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{okr.current} / {okr.target} {okr.unit}</span>
                              <span>{Math.round((okr.current / okr.target) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(okr.current / okr.target) * 100} 
                              className={`h-2 ${getStatusColor(okr.status)}`}
                            />
                          </div>
                        </div>

                        {/* Tasks */}
                        <div className="space-y-2">
                          <h6 className="text-xs font-medium text-gray-300">Linked Tasks</h6>
                          {okr.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(
                                  task.status === 'completed' ? 'on-track' :
                                  task.status === 'in-progress' ? 'at-risk' : 'off-track'
                                )}`} />
                                <span className="text-xs text-white">{task.title}</span>
                                {task.assignee && (
                                  <Badge variant="outline" className="text-xs">
                                    <User className="h-2 w-2 mr-1" />
                                    {task.assignee}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </Badge>
                                {task.status === 'available' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onTaskClaim?.(task.id)}
                                    className="text-xs text-green-400 hover:text-green-300 hover:bg-green-500/20"
                                  >
                                    Claim
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h6 className="text-sm font-medium text-white mb-3">Portfolio Summary</h6>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">72%</div>
            <div className="text-xs text-gray-400">Avg Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">3</div>
            <div className="text-xs text-gray-400">At Risk</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">8</div>
            <div className="text-xs text-gray-400">Available Tasks</div>
          </div>
        </div>
      </div>
    </Card>
  );
};