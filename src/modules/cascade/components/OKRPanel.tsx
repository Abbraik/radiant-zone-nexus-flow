import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Target, 
  TrendingUp, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { Card } from '../../../components/ui/card';
import { OKR } from '../../collab/data/mockData';
import { format } from 'date-fns';

interface OKRPanelProps {
  isOpen: boolean;
  onClose: () => void;
  okr: OKR | null;
  onTaskClaim?: (taskId: string) => void;
}

export const OKRPanel: React.FC<OKRPanelProps> = ({ 
  isOpen, 
  onClose, 
  okr,
  onTaskClaim 
}) => {
  if (!okr) return null;

  const progressPercentage = (okr.current / okr.target) * 100;
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'at-risk':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'off-track':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'claimed':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'available':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
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

  const availableTasks = okr.tasks.filter(task => task.status === 'available');
  const nextTask = availableTasks.find(task => task.priority === 'critical') || availableTasks[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
            className="fixed inset-4 lg:inset-x-1/4 lg:inset-y-16 bg-glass/90 backdrop-blur-20 border border-white/20 rounded-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-white">{okr.title}</h2>
                    <p className="text-sm text-gray-400">Key Result Details</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Status & Progress */}
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Progress */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Progress</h3>
                        {getStatusIcon(okr.status)}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Current Progress</span>
                            <span>{okr.current} / {okr.target} {okr.unit}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                          <div className="text-right text-sm text-gray-400 mt-1">
                            {Math.round(progressPercentage)}% Complete
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{okr.current}</div>
                            <div className="text-xs text-gray-400">Current</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{okr.target}</div>
                            <div className="text-xs text-gray-400">Target</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">{okr.target - okr.current}</div>
                            <div className="text-xs text-gray-400">Remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">Details</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400">Description</label>
                          <p className="text-white">{okr.description}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Due Date</label>
                          <p className="text-white">{format(okr.dueDate, 'PPP')}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm text-gray-400">Status</label>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(okr.status)}
                            <Badge 
                              variant="outline" 
                              className={`${getStatusColor(okr.status).replace('bg-', 'border-').replace('-500', '-500/50')} text-white`}
                            >
                              {okr.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Task Pipeline */}
                <Card className="p-6 bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Task Pipeline</h3>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      {okr.tasks.length} tasks
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {okr.tasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(
                            task.status === 'completed' ? 'on-track' :
                            task.status === 'in-progress' ? 'at-risk' : 'off-track'
                          )}`} />
                          
                          <div>
                            <h4 className="text-sm font-medium text-white">{task.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getTaskStatusColor(task.status)}`}
                              >
                                {task.status}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </Badge>
                              {task.assignee && (
                                <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                                  {task.assignee}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {task.status === 'available' && (
                            <Button
                              size="sm"
                              onClick={() => onTaskClaim?.(task.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Claim Task
                            </Button>
                          )}
                          {task.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                {nextTask && (
                  <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Next Recommended Task</h3>
                        <p className="text-blue-300">{nextTask.title}</p>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 ${getPriorityColor(nextTask.priority)}`}
                        >
                          {nextTask.priority} priority
                        </Badge>
                      </div>
                      <Button
                        onClick={() => onTaskClaim?.(nextTask.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Claim Next Task
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};