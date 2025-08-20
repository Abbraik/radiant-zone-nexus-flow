import { useState, useCallback } from 'react';
import type { EnhancedTask, Capacity } from '@/types/capacity';

export function useCapacityWorkspace() {
  const [activeTask, setActiveTask] = useState<EnhancedTask | null>(null);
  const [taskPayload, setTaskPayload] = useState<any>({});
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleTaskSelect = useCallback((task: EnhancedTask) => {
    setActiveTask(task);
    setTaskPayload(task.payload || {});
    setIsValid(false);
    setValidationErrors([]);
  }, []);

  const handlePayloadUpdate = useCallback((newPayload: any) => {
    setTaskPayload(newPayload);
    // Update the active task's payload
    if (activeTask) {
      setActiveTask({
        ...activeTask,
        payload: newPayload
      });
    }
  }, [activeTask]);

  const handleValidationChange = useCallback((valid: boolean, errors?: string[]) => {
    setIsValid(valid);
    setValidationErrors(errors || []);
  }, []);

  const clearActiveTask = useCallback(() => {
    setActiveTask(null);
    setTaskPayload({});
    setIsValid(false);
    setValidationErrors([]);
  }, []);

  const updateTaskStatus = useCallback((taskId: string, newStatus: string) => {
    if (activeTask && activeTask.id === taskId) {
      setActiveTask({
        ...activeTask,
        status: newStatus as any
      });
    }
  }, [activeTask]);

  return {
    activeTask,
    taskPayload,
    isValid,
    validationErrors,
    handleTaskSelect,
    handlePayloadUpdate,
    handleValidationChange,
    clearActiveTask,
    updateTaskStatus
  };
}