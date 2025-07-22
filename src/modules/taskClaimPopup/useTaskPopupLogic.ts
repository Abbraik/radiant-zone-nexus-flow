import { useState, useEffect, useMemo } from 'react';
import { Task } from '../../hooks/useTasks';
import { useTeams } from '../../hooks/useTeams';
import { useCopilot } from '../ai/hooks/useCopilot';
import { useToast } from '../../hooks/use-toast';

interface TaskPopupLogic {
  goalProgress: number;
  okrProgress: number;
  recentActivity: Array<{
    icon: string;
    text: string;
    time: string;
  }>;
  timeUntilDue: string;
  dueStatus: 'critical' | 'warning' | 'good' | 'none';
  estimatedEffort: string;
  dependencies: Array<{
    title: string;
    status: 'completed' | 'in-progress' | 'pending';
  }>;
  nextSteps: Array<{
    text: string;
    completed: boolean;
  }>;
  handleSnooze: (duration: string) => void;
  handleDelegate: (userId: string) => void;
  handleOpenTeams: (taskId: string, taskTitle: string) => void;
  handleAISuggest: () => void;
}

export const useTaskPopupLogic = (task: Task | null): TaskPopupLogic => {
  const { toast } = useToast();
  const { openTeamsChat } = useTeams();
  const { suggestions } = useCopilot(task);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const timeUntilDue = useMemo(() => {
    if (!task?.due_at) return 'No due date';
    
    const now = currentTime.getTime();
    const due = task.due_at.getTime();
    const diffMs = due - now;
    
    if (diffMs <= 0) return 'Overdue';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `Due in ${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `Due in ${diffHours}h ${diffMinutes}m`;
    } else {
      return `Due in ${diffMinutes}m`;
    }
  }, [task?.due_at, currentTime]);

  const dueStatus = useMemo(() => {
    if (!task?.due_at) return 'none';
    
    const now = currentTime.getTime();
    const due = task.due_at.getTime();
    const diffMs = due - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours <= 0) return 'critical';
    if (diffHours <= 24) return 'critical';
    if (diffHours <= 72) return 'warning';
    return 'good';
  }, [task?.due_at, currentTime]);

  const goalProgress = 50; // Mock data
  const okrProgress = 80; // Mock data

  const recentActivity = [
    {
      icon: '⏰',
      text: 'DE-Band breach detected',
      time: '1h ago'
    },
    {
      icon: '🚀',
      text: 'Sprint started',
      time: '3d ago'
    }
  ];

  const estimatedEffort = task?.type === 'define_tension' ? '15m' : 
                         task?.type === 'run_simulation' ? '45m' : 
                         task?.type === 'review_tri' ? '30m' : '20m';

  const dependencies = [
    {
      title: 'Tension signal analysis',
      status: 'completed' as const
    },
    {
      title: 'Stakeholder alignment',
      status: 'in-progress' as const
    }
  ];

  const nextSteps = [
    {
      text: 'Tension signal selected',
      completed: false
    },
    {
      text: 'SRT set to appropriate timeframe',
      completed: false
    },
    {
      text: 'Initial parameters configured',
      completed: false
    }
  ];

  const handleSnooze = (duration: string) => {
    const durationMap: Record<string, string> = {
      '5m': '5 minutes',
      '15m': '15 minutes', 
      '1h': '1 hour',
      '1d': '1 day'
    };
    
    toast({
      title: "Task Snoozed",
      description: `Task will reappear in ${durationMap[duration]}`,
      duration: 3000
    });
  };

  const handleDelegate = (userId: string) => {
    const userMap: Record<string, string> = {
      'user-1': 'Alex Chen',
      'user-2': 'Sarah Kim'
    };
    
    toast({
      title: "Task Delegated", 
      description: `Task assigned to ${userMap[userId]}`,
      duration: 3000
    });
  };

  const handleOpenTeams = (taskId: string, taskTitle: string) => {
    openTeamsChat(taskId, taskTitle);
  };

  const handleAISuggest = () => {
    toast({
      title: "AI Analysis",
      description: "Based on recent activity, consider reviewing tension signals first",
      duration: 5000
    });
  };

  return {
    goalProgress,
    okrProgress,
    recentActivity,
    timeUntilDue,
    dueStatus,
    estimatedEffort,
    dependencies,
    nextSteps,
    handleSnooze,
    handleDelegate,
    handleOpenTeams,
    handleAISuggest
  };
};