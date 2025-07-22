import React from 'react';
import { X, Clock, Calendar, Target, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { cascadeTasks } from '../../modules/collab/data/mockData';

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
  console.log('TaskClaimModal render:', { isOpen, taskId, isConfirming });

  // Early return if not open
  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  // Find the task
  const task = taskId ? cascadeTasks.find(t => t.id === taskId) : null;
  console.log('Found task:', task);

  // Early return if no task found
  if (!task) {
    console.log('No task found for taskId:', taskId);
    return null;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getEstimatedTime = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return '2-4 hours';
      case 'medium': return '4-8 hours';
      case 'high': return '8-16 hours';
      default: return 'TBD';
    }
  };

  const handleConfirm = () => {
    console.log('Confirm button clicked for task:', task.id);
    onConfirmClaim(task.id);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={handleBackdropClick}
    >
      <Card 
        className="w-full max-w-2xl bg-gray-900/95 border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-teal-400" />
              <h2 className="text-xl font-semibold text-white">Claim Task</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
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

            {/* Task Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Zone and Type */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                    {task.zone}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {task.type}
                  </Badge>
                </div>
                
                {/* Time Estimate */}
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span>Estimated: {getEstimatedTime(task.difficulty)}</span>
                </div>
                
                {/* Due Date */}
                {task.dueDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Difficulty */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Difficulty:</span>
                  <Badge className={getDifficultyColor(task.difficulty)}>
                    {task.difficulty}
                  </Badge>
                </div>
                
                {/* Required Skills */}
                {task.requiredSkills && task.requiredSkills.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Required Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {task.requiredSkills.map((skill, index) => (
                        <Badge 
                          key={index}
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            {task.prerequisites && task.prerequisites.length > 0 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Prerequisites</span>
                </div>
                <ul className="space-y-1">
                  {task.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expected Impact */}
            {task.impact && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Expected Impact</span>
                </div>
                <p className="text-sm text-gray-300">{task.impact}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-teal-500 hover:bg-teal-600 text-white min-w-[120px]"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Claiming...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm Claim</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};