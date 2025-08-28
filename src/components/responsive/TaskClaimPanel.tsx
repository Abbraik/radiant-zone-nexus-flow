import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  User,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Task } from '@/hooks/useTaskManagement';

interface TaskClaimPanelProps {
  task: Task;
  onClaim: (taskId: string) => Promise<boolean>;
  onUpdateProgress: (taskId: string, progress: number, status?: string, notes?: string) => Promise<void>;
  onRelease: (taskId: string) => Promise<void>;
  currentUserId?: string;
  claiming?: boolean;
}

export const TaskClaimPanel: React.FC<TaskClaimPanelProps> = ({
  task,
  onClaim,
  onUpdateProgress,
  onRelease,
  currentUserId,
  claiming = false
}) => {
  const [progressInput, setProgressInput] = useState(task.progress_percent || 0);
  const [statusInput, setStatusInput] = useState(task.status);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const isMyTask = task.assignee_id === currentUserId;
  const canClaim = task.status === 'pending' && !task.assignee_id;
  const canUpdate = isMyTask && (task.status === 'claimed' || task.status === 'in_progress');
  
  const handleClaim = async () => {
    await onClaim(task.id);
  };

  const handleStart = async () => {
    setUpdating(true);
    await onUpdateProgress(task.id, progressInput, 'in_progress', 'Task started');
    setUpdating(false);
  };

  const handleUpdateProgress = async () => {
    if (!notes.trim()) return;
    
    setUpdating(true);
    await onUpdateProgress(task.id, progressInput, statusInput, notes);
    setNotes('');
    setUpdating(false);
  };

  const handleComplete = async () => {
    setUpdating(true);
    await onUpdateProgress(task.id, 100, 'completed', 'Task completed');
    setUpdating(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { variant: 'outline' as const, label: 'Available', icon: Clock };
      case 'claimed':
        return { variant: 'secondary' as const, label: 'Claimed', icon: User };
      case 'in_progress':
        return { variant: 'default' as const, label: 'In Progress', icon: Play };
      case 'completed':
        return { variant: 'success' as const, label: 'Completed', icon: CheckCircle };
      case 'blocked':
        return { variant: 'destructive' as const, label: 'Blocked', icon: AlertCircle };
      default:
        return { variant: 'outline' as const, label: status, icon: Clock };
    }
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity.toLowerCase()) {
      case 'responsive': return 'bg-red-500/10 border-red-500/20';
      case 'reflexive': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'deliberative': return 'bg-blue-500/10 border-blue-500/20';
      case 'anticipatory': return 'bg-green-500/10 border-green-500/20';
      case 'structural': return 'bg-purple-500/10 border-purple-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const status = getStatusBadge(task.status);
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <Card className={`${getCapacityColor(task.capacity)} border`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={status.variant === 'success' ? 'default' : status.variant} className={`text-xs flex items-center gap-1 ${status.variant === 'success' ? 'bg-green-600 text-white' : ''}`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.capacity}
              </Badge>
              {task.leverage && (
                <Badge variant="secondary" className="text-xs">
                  {task.leverage === 'S' ? 'Strategic' : task.leverage === 'P' ? 'Policy' : 'Operational'}
                </Badge>
              )}
            </div>
            {task.due_date && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
              </div>
            )}
          </div>
          
          <CardTitle className="text-base leading-tight">
            {task.title}
          </CardTitle>
          
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>
          
          {task.assignee_name && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              Assigned to {isMyTask ? 'you' : task.assignee_name}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Progress Bar */}
          <AnimatePresence>
            {(task.progress_percent || 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{task.progress_percent || 0}%</span>
                </div>
                <Progress value={task.progress_percent || 0} className="h-2" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {canClaim && (
              <Button
                onClick={handleClaim}
                disabled={claiming}
                size="sm"
                className="flex-1"
              >
                {claiming ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <User className="h-4 w-4 mr-2" />
                )}
                Claim Task
              </Button>
            )}

            {isMyTask && task.status === 'claimed' && (
              <Button
                onClick={handleStart}
                disabled={updating}
                size="sm"
                variant="default"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Work
              </Button>
            )}

            {canUpdate && task.status !== 'completed' && (
              <Button
                onClick={handleComplete}
                disabled={updating}
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            )}

            {isMyTask && task.status !== 'completed' && (
              <Button
                onClick={() => onRelease(task.id)}
                disabled={updating}
                size="sm"
                variant="outline"
              >
                Release
              </Button>
            )}
          </div>

          {/* Progress Update Section */}
          <AnimatePresence>
            {canUpdate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-3 border-t border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-medium">Progress %</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressInput}
                      onChange={(e) => setProgressInput(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-center mt-1">{progressInput}%</div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Status</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as Task['status'])}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="blocked">Blocked</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium">Progress Notes</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add progress notes..."
                    className="text-xs mt-1"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={handleUpdateProgress}
                  disabled={updating || !notes.trim()}
                  size="sm"
                  className="w-full"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Update Progress
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};