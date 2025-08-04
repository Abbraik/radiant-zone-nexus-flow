import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Clock, Tag, MessageSquare } from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { useTeams } from '../../hooks/useTeams';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface EnhancedTaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  isCompleting?: boolean;
  showTeamsButton?: boolean;
}

const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({
  task,
  onComplete,
  isCompleting = false,
  showTeamsButton = true
}) => {
  const { openTeamsChat } = useTeams();

  const getDueDateColor = (dueDate: Date | undefined) => {
    if (!dueDate) return 'text-muted-foreground';
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
    if (daysUntilDue > 0) return `${daysUntilDue} days left`;
    return `${Math.abs(daysUntilDue)} days overdue`;
  };

  const getZoneColor = (zone: string) => {
    const zoneColors: Record<string, string> = {
      'think': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'act': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'monitor': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'innovate-learn': 'bg-green-500/20 text-green-300 border-green-400/30'
    };
    return zoneColors[zone] || 'bg-muted/20 text-muted-foreground border-border-subtle';
  };

  const handleTeamsClick = () => {
    openTeamsChat(task.id, task.title);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass/80 backdrop-blur-20 rounded-2xl p-4 border border-white/10 shadow-lg"
    >
      <div className="flex justify-between items-start">
        {/* Task Information */}
        <div className="flex-1 space-y-3">
          {/* Title and Status */}
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
            <div className="flex items-center gap-1 px-2 py-1 bg-teal-500/20 rounded-full border border-teal-400/30">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-xs text-teal-300 font-medium">Active</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-foreground-subtle text-sm leading-relaxed">
            {task.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Due Date */}
            <div className="flex items-center gap-1 text-sm">
              <Clock className={cn('h-4 w-4', getDueDateColor(task.due_at))} />
              <span className={getDueDateColor(task.due_at)}>
                {formatDueDate(task.due_at)}
              </span>
            </div>

            {/* Zone Badge */}
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
              getZoneColor(task.zone)
            )}>
              <Tag className="h-3 w-3" />
              {task.zone}
            </div>

            {/* Loop/Scenario Badge */}
            {task.loop_id && (
              <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium border border-blue-400/30">
                {task.type.includes('simulation') ? `Scenario ${task.loop_id}` : `Loop ${task.loop_id}`}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/10">
        {/* Teams Collaborate Button */}
        {showTeamsButton && (
          <Button
            onClick={handleTeamsClick}
            variant="outline"
            size="sm"
            className="glass text-foreground border-border-subtle hover:bg-glass-accent hover:border-border-accent flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            <Users className="h-4 w-4" />
            <span>Teams Chat</span>
          </Button>
        )}

        {/* Complete Task Button */}
        <Button
          onClick={() => onComplete(task.id)}
          disabled={isCompleting}
          className={cn(
            'font-medium',
            task.type === 'publish_bundle' 
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
              : 'bg-accent hover:bg-accent/90 text-accent-foreground'
          )}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isCompleting ? 'Completing...' : 
           task.type === 'publish_bundle' ? 'Publish Bundle' : 'Complete Task'}
        </Button>
      </div>
    </motion.div>
  );
};

export default EnhancedTaskCard;