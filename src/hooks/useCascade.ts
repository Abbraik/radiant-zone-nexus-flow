import { useState, useCallback } from 'react';
import { Task } from './useTasks';

// Mock cascade data structure
export interface Goal {
  id: string;
  title: string;
  description: string;
  avatar?: string;
  progress: number;
}

export interface OKR {
  id: string;
  goalId: string;
  title: string;
  description: string;
  progress: number;
  dueDate: Date;
}

export interface CascadeNode {
  type: 'goal' | 'okr' | 'task';
  id: string;
  title: string;
  description?: string;
  progress?: number;
  dueDate?: Date;
}

export interface CascadePath {
  goal: Goal;
  okr: OKR;
  task: Task;
}

// Mock data
const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Operational Excellence',
    description: 'Achieve 95% system reliability and reduce response times',
    avatar: '🎯',
    progress: 75
  },
  {
    id: 'goal-2', 
    title: 'Innovation Growth',
    description: 'Launch 3 new features with positive user feedback',
    avatar: '🚀',
    progress: 60
  }
];

const mockOKRs: OKR[] = [
  {
    id: 'okr-1',
    goalId: 'goal-1',
    title: 'System Health Q4',
    description: 'Maintain 99% uptime across all loops',
    progress: 80,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'okr-2',
    goalId: 'goal-1', 
    title: 'Process Optimization',
    description: 'Reduce sprint cycle time by 25%',
    progress: 65,
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'okr-3',
    goalId: 'goal-2',
    title: 'Feature Delivery',
    description: 'Ship experimental features for user testing',
    progress: 55,
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  }
];

export const useCascade = () => {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedOKRId, setSelectedOKRId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Generate cascade paths for tasks
  const getCascadeForTask = useCallback((task: Task): CascadePath | null => {
    // Map tasks to OKRs based on loop_id and type
    let okrId: string | null = null;
    if (task.loop_id === 'A' || task.loop_id === 'B' || task.loop_id === 'C') {
      okrId = 'okr-1'; // System Health
    } else if (task.type === 'run_simulation' || task.type === 'capture_insight') {
      okrId = 'okr-3'; // Feature Delivery
    } else {
      okrId = 'okr-2'; // Process Optimization
    }

    const okr = mockOKRs.find(o => o.id === okrId);
    if (!okr) return null;

    const goal = mockGoals.find(g => g.id === okr.goalId);
    if (!goal) return null;

    return { goal, okr, task };
  }, []);

  const buildCascadeNodes = useCallback((task: Task): CascadeNode[] => {
    const cascade = getCascadeForTask(task);
    if (!cascade) return [];

    return [
      {
        type: 'goal',
        id: cascade.goal.id,
        title: cascade.goal.title,
        description: cascade.goal.description,
        progress: cascade.goal.progress
      },
      {
        type: 'okr',
        id: cascade.okr.id,
        title: cascade.okr.title,
        description: cascade.okr.description,
        progress: cascade.okr.progress,
        dueDate: cascade.okr.dueDate
      },
      {
        type: 'task',
        id: cascade.task.id,
        title: cascade.task.title,
        description: cascade.task.description,
        dueDate: cascade.task.due_at
      }
    ];
  }, [getCascadeForTask]);

  const selectGoal = useCallback((goalId: string) => {
    setSelectedGoalId(goalId);
    setSelectedOKRId(null);
    setSelectedTaskId(null);
  }, []);

  const selectOKR = useCallback((okrId: string) => {
    setSelectedOKRId(okrId);
    setSelectedTaskId(null);
  }, []);

  const selectTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedGoalId(null);
    setSelectedOKRId(null);
    setSelectedTaskId(null);
  }, []);

  return {
    goals: mockGoals,
    okrs: mockOKRs,
    selectedGoalId,
    selectedOKRId,
    selectedTaskId,
    getCascadeForTask,
    buildCascadeNodes,
    selectGoal,
    selectOKR,
    selectTask,
    clearSelection
  };
};