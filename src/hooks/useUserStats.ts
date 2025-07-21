import { useQuery } from '@tanstack/react-query';

export interface UserStats {
  completed: number;
  pending: number;
  avgTime: number; // in hours
}

export interface ActivityEvent {
  id: string;
  type: 'completed' | 'claimed' | 'started';
  taskTitle: string;
  timestamp: Date;
}

export interface PerformanceData {
  date: string;
  tasksCompleted: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  criteria: string;
}

// Mock data
const mockStats: UserStats = {
  completed: 24,
  pending: 3,
  avgTime: 2.3
};

const mockActivityLog: ActivityEvent[] = [
  {
    id: '1',
    type: 'completed',
    taskTitle: 'Define tension for Loop A',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    type: 'claimed',
    taskTitle: 'Publish bundle B',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: '3',
    type: 'completed',
    taskTitle: 'Review TRI for Loop C',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    id: '4',
    type: 'started',
    taskTitle: 'Run simulation for Scenario X',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    id: '5',
    type: 'completed',
    taskTitle: 'Capture insight from Loop C test',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
  }
];

const mockPerformanceData: PerformanceData[] = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  tasksCompleted: Math.floor(Math.random() * 5) + 1
}));

const mockBadges: { unlocked: Badge[], locked: Badge[] } = {
  unlocked: [
    {
      id: '1',
      name: 'First Task Completed',
      description: 'Completed your first task',
      icon: '🎯',
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      criteria: 'Complete 1 task'
    },
    {
      id: '2',
      name: '5 Tasks in a Week',
      description: 'Completed 5 tasks in one week',
      icon: '⚡',
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      criteria: 'Complete 5 tasks in 7 days'
    },
    {
      id: '3',
      name: 'TRI Master',
      description: 'Completed 10 TRI reviews',
      icon: '📊',
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      criteria: 'Complete 10 TRI reviews'
    }
  ],
  locked: [
    {
      id: '4',
      name: 'Simulation Expert',
      description: 'Complete 10 simulations',
      icon: '🔬',
      criteria: 'Complete 10 simulations to unlock'
    },
    {
      id: '5',
      name: 'Bundle Master',
      description: 'Publish 20 bundles',
      icon: '📦',
      criteria: 'Publish 20 bundles to unlock'
    },
    {
      id: '6',
      name: 'Speed Demon',
      description: 'Complete a task in under 1 hour',
      icon: '🏃',
      criteria: 'Complete a task in under 1 hour'
    }
  ]
};

export const useUserStats = (userId?: string) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async (): Promise<UserStats> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStats;
    }
  });
};

export const useActivityLog = (userId?: string, limit = 10) => {
  return useQuery({
    queryKey: ['activityLog', userId, limit],
    queryFn: async (): Promise<ActivityEvent[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockActivityLog.slice(0, limit);
    }
  });
};

export const usePerformanceData = (userId?: string, days = 14) => {
  return useQuery({
    queryKey: ['performanceData', userId, days],
    queryFn: async (): Promise<PerformanceData[]> => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockPerformanceData;
    }
  });
};

export const useBadges = (userId?: string) => {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: async (): Promise<{ unlocked: Badge[], locked: Badge[] }> => {
      await new Promise(resolve => setTimeout(resolve, 250));
      return mockBadges;
    }
  });
};