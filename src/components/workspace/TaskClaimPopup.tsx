import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Tag, AlertCircle } from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface TaskClaimPopupProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskClaimPopup: React.FC<TaskClaimPopupProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!task) return null;

  const getDueDateColor = (dueDate: Date | undefined) => {
    if (!dueDate) return 'text-gray-400';
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 1) return 'text-red-400';
    if (daysUntilDue <= 3) return 'text-orange-400';
    return 'text-teal-400';
  };

  const formatDueDate = (dueDate: Date | undefined) => {
    if (!dueDate) return 'No due date';
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue > 0) return `Due in ${daysUntilDue} days`;
    return `Overdue by ${Math.abs(daysUntilDue)} days`;
  };

  const getTaskTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'define_tension': 'Define Tension',
      'publish_bundle': 'Publish Bundle',
      'review_tri': 'Review TRI',
      'run_simulation': 'Run Simulation',
      'capture_insight': 'Capture Insight'
    };
    return typeMap[type] || type;
  };

  const getZoneColor = (zone: string) => {
    const zoneColors: Record<string, string> = {
      'think': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'act': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'monitor': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'innovate-learn': 'bg-green-500/20 text-green-300 border-green-400/30'
    };
    return zoneColors[zone] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
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
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="w-[420px] bg-glass/90 backdrop-blur-20 rounded-3xl shadow-2xl border border-white/10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Confirm Task Claim</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Task Details */}
              <div className="space-y-4 mb-6">
                {/* Title */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {task.title}
                  </h3>
                  <p className="text-base text-gray-300 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-2">
                  {/* Zone Badge */}
                  <div className={cn(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border',
                    getZoneColor(task.zone)
                  )}>
                    <Tag className="h-3 w-3" />
                    {task.zone}
                  </div>

                  {/* Type Badge */}
                  <div className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                    {getTaskTypeLabel(task.type)}
                  </div>

                  {/* Loop Badge */}
                  {task.loop_id && (
                    <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-400/30">
                      {task.type.includes('simulation') ? `Scenario ${task.loop_id}` : `Loop ${task.loop_id}`}
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock className={cn('h-4 w-4', getDueDateColor(task.due_at))} />
                  <span className={getDueDateColor(task.due_at)}>
                    {formatDueDate(task.due_at)}
                  </span>
                </div>

                {/* Urgency Warning */}
                {task.due_at && Math.ceil((task.due_at.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-300">
                      This task has high priority - immediate attention recommended
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  className="text-teal-300 hover:text-white hover:bg-teal-500/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-full"
                >
                  {isLoading ? 'Claiming...' : 'Confirm Claim'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskClaimPopup;