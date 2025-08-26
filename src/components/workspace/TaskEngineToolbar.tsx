// TaskEngine V2 Toolbar for 5C Workspace Integration
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  Settings,
  Plus,
  BarChart3,
  Lock,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import { TaskCreationModal } from '@/components/taskEngine/TaskCreationModal';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import type { EnhancedTask5C } from '@/5c/types';

interface TaskEngineToolbarProps {
  activeTask5C?: EnhancedTask5C | null;
  onTaskAction?: (action: string, taskId?: string) => void;
}

export const TaskEngineToolbar: React.FC<TaskEngineToolbarProps> = ({ 
  activeTask5C,
  onTaskAction 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { 
    acquireLock, 
    pauseTask, 
    resumeTask, 
    completeTask,
    isAcquiringLock,
    isUpdating 
  } = useTaskEngine();

  const handleLockTask = () => {
    if (activeTask5C) {
      acquireLock(activeTask5C.id);
      onTaskAction?.('lock', activeTask5C.id);
    }
  };

  const handlePauseTask = () => {
    if (activeTask5C) {
      pauseTask(activeTask5C.id, 'User requested pause');
      onTaskAction?.('pause', activeTask5C.id);
    }
  };

  const handleResumeTask = () => {
    if (activeTask5C) {
      resumeTask(activeTask5C.id);
      onTaskAction?.('resume', activeTask5C.id);
    }
  };

  const handleCompleteTask = () => {
    if (activeTask5C) {
      completeTask(activeTask5C.id);
      onTaskAction?.('complete', activeTask5C.id);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-glass/20 backdrop-blur-20 rounded-lg border border-white/10">
      {/* Create New Task */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCreateModal(true)}
        className="gap-2 text-white border-white/20 hover:bg-white/10"
      >
        <Plus className="h-4 w-4" />
        New Task
      </Button>

      {activeTask5C && (
        <>
          {/* Task Controls */}
          <div className="h-4 w-px bg-white/20" />
          
          {activeTask5C.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePauseTask}
              disabled={isUpdating}
              className="gap-2 text-yellow-300 border-yellow-400/30 hover:bg-yellow-400/10"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}

          {activeTask5C.status === 'blocked' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResumeTask}
              disabled={isUpdating}
              className="gap-2 text-green-300 border-green-400/30 hover:bg-green-400/10"
            >
              <Play className="h-4 w-4" />
              Resume
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCompleteTask}
            disabled={isUpdating}
            className="gap-2 text-green-300 border-green-400/30 hover:bg-green-400/10"
          >
            <CheckCircle className="h-4 w-4" />
            Complete
          </Button>

          {/* Lock Task */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLockTask}
            disabled={isAcquiringLock}
            className="gap-2 text-purple-300 border-purple-400/30 hover:bg-purple-400/10"
          >
            <Lock className="h-4 w-4" />
            {isAcquiringLock ? 'Locking...' : 'Lock'}
          </Button>

          {/* Task Info */}
          <div className="flex items-center gap-2 ml-2">
            <Badge variant="outline" className="text-xs text-white/80 border-white/20">
              <Clock className="h-3 w-3 mr-1" />
              {activeTask5C.capacity}
            </Badge>
            
            {activeTask5C.tri && (
              <Badge variant="outline" className="text-xs text-teal-300 border-teal-400/30">
                TRI: {activeTask5C.tri.t_value.toFixed(1)}|{activeTask5C.tri.r_value.toFixed(1)}|{activeTask5C.tri.i_value.toFixed(1)}
              </Badge>
            )}
          </div>
        </>
      )}

      {/* Analytics Button */}
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTaskAction?.('analytics')}
          className="gap-2 text-white/60 hover:text-white hover:bg-white/10"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
      </div>

      {/* Create Task Modal */}
      <TaskCreationModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};