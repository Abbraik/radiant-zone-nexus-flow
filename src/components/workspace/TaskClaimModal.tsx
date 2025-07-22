import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Users, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { cascadeTasks } from '../../modules/collab/data/mockData';
import { format } from 'date-fns';

interface TaskClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  onConfirmClaim: (taskId: string) => void;
  isConfirming?: boolean;
}

export const TaskClaimModal: React.FC<TaskClaimModalProps> = ({
  isOpen,
  onClose,
  taskId,
  onConfirmClaim,
  isConfirming = false
}) => {
  const task = taskId ? cascadeTasks.find(t => t.id === taskId) : null;

  if (!task) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'high': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getEstimatedHours = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return '2-4 hours';
      case 'medium': return '4-8 hours';
      case 'high': return '8-16 hours';
      default: return 'TBD';
    }
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-2xl bg-glass/90 backdrop-blur-20 border-white/20">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Target className="h-6 w-6 text-teal-400" />
                    <h2 className="text-xl font-semibold text-white">Claim Task</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Task Details */}
                <div className="space-y-6">
                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">{task.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{task.description}</p>
                  </div>

                  {/* Task Meta */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-teal-500/20 text-teal-300">
                          {task.zone}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/10 text-white">
                          {task.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span>Estimated: {getEstimatedHours(task.difficulty)}</span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Difficulty:</span>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>
                      
                      {task.requiredSkills && (
                        <div>
                          <span className="text-sm text-gray-400 block mb-1">Required Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {task.requiredSkills.map((skill, index) => (
                              <Badge 
                                key={index}
                                variant="secondary" 
                                className="bg-blue-500/20 text-blue-300 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites & Impact */}
                  {(task.prerequisites && task.prerequisites.length > 0) && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">Prerequisites</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {task.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                            {prereq}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.impact && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Expected Impact</span>
                      </div>
                      <p className="text-sm text-gray-300">{task.impact}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={isConfirming}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => onConfirmClaim(task.id)}
                    disabled={isConfirming}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    {isConfirming ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Claim
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};