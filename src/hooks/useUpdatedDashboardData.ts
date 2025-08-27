import { useMemo } from 'react';
import { useDatabaseTasks, useDatabaseScorecard, useDatabaseLoops, useDatabaseBreachEvents } from '@/hooks/useDatabaseData';

export const useUpdatedDashboardData = () => {
  const { data: tasks, isLoading: tasksLoading } = useDatabaseTasks();
  const { data: loops } = useDatabaseLoops();
  const { data: breachEvents } = useDatabaseBreachEvents();

  return useMemo(() => {
    if (tasksLoading || !tasks) {
      return {
        userStats: { activeLoops: 0, completedTasks: 0, avgTRI: 0 },
        recentActivity: [],
        achievements: [],
        leaderboard: [],
        systemHealth: { status: 'loading', breachCount: 0 },
        isLoading: true
      };
    }

    // Calculate user statistics from real data
    const activeLoops = new Set(tasks.map(task => task.loop_id)).size;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const avgTRI = tasks.reduce((acc, task) => {
      const tri = task.tri as any;
      if (tri && typeof tri === 'object' && !Array.isArray(tri)) {
        const triScore = (
          (tri.t_value || 0) + 
          (tri.r_value || 0) + 
          (tri.i_value || 0)
        ) / 3;
        return acc + triScore;
      }
      return acc;
    }, 0) / tasks.length || 0;

    // Generate activity from task updates
    const recentActivity = tasks
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 10)
      .map(task => ({
        id: task.id,
        type: 'task_updated' as const,
        description: `Updated ${task.title}`,
        timestamp: task.updated_at,
        capacity: task.capacity
      }));

    // Calculate achievements based on real performance
    const achievements = [
      {
        id: 'loops-master',
        title: 'Loops Master',
        description: `Active in ${activeLoops} loops`,
        unlockedAt: activeLoops >= 3 ? new Date().toISOString() : null,
        progress: Math.min(activeLoops / 3, 1) * 100
      },
      {
        id: 'task-completor',
        title: 'Task Completor',
        description: `Completed ${completedTasks} tasks`,
        unlockedAt: completedTasks >= 5 ? new Date().toISOString() : null,
        progress: Math.min(completedTasks / 5, 1) * 100
      },
      {
        id: 'tri-optimizer',
        title: 'TRI Optimizer',
        description: `Average TRI: ${(avgTRI * 100).toFixed(1)}%`,
        unlockedAt: avgTRI >= 0.8 ? new Date().toISOString() : null,
        progress: avgTRI * 100
      }
    ];

    // Mock leaderboard but with real user activity
    const leaderboard = [
      { rank: 1, name: 'Current User', score: Math.floor(avgTRI * 1000), change: '+5' }
    ];

    // System health from breach events
    const recentBreaches = breachEvents?.filter(breach => {
      const breachTime = new Date(breach.created_at).getTime();
      const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return breachTime > dayAgo;
    }).length || 0;

    const systemHealth = {
      status: recentBreaches === 0 ? 'healthy' as const : 
              recentBreaches < 3 ? 'warning' as const : 
              'critical' as const,
      breachCount: recentBreaches,
      lastCheck: new Date().toISOString()
    };

    return {
      userStats: { activeLoops, completedTasks, avgTRI },
      recentActivity,
      achievements,
      leaderboard, 
      systemHealth,
      isLoading: false
    };
  }, [tasks, loops, breachEvents, tasksLoading]);
};

export const useUpdatedLoopDashboard = (loopId: string) => {
  const { data: scorecard, isLoading } = useDatabaseScorecard(loopId);
  const { data: breachEvents } = useDatabaseBreachEvents(loopId);
  const { data: tasks } = useDatabaseTasks();

  return useMemo(() => {
    if (isLoading) {
      return {
        scorecard: null,
        performance: { tri: { t: 0, r: 0, i: 0 }, breaches: 0, trend: 'stable' },
        isLoading: true
      };
    }

    // Transform database scorecard to expected format
    const transformedScorecard = scorecard ? {
      loop_id: scorecard.loop_id,
      last_tri: scorecard.last_tri,
      de_state: scorecard.de_state,
      claim_velocity: scorecard.claim_velocity,
      fatigue: scorecard.fatigue,
      breach_days: scorecard.breach_days,
      tri_slope: scorecard.tri_slope,
      heartbeat_at: scorecard.heartbeat_at
    } : null;

    // Calculate performance metrics from real data
    const loopTasks = tasks?.filter(task => task.loop_id === loopId) || [];
    const recentBreaches = breachEvents?.filter(breach => {
      const breachTime = new Date(breach.created_at).getTime();
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return breachTime > weekAgo;
    }).length || 0;

    const tri = scorecard?.last_tri as any || { t_value: 0.7, r_value: 0.6, i_value: 0.8 };
    
    const performance = {
      tri: {
        t: tri.t_value || 0,
        r: tri.r_value || 0, 
        i: tri.i_value || 0
      },
      breaches: recentBreaches,
      trend: (scorecard?.tri_slope || 0) > 0 ? 'improving' as const : 
             (scorecard?.tri_slope || 0) < -0.02 ? 'declining' as const : 
             'stable' as const,
      velocity: scorecard?.claim_velocity || 0,
      fatigue: scorecard?.fatigue || 0
    };

    return {
      scorecard: transformedScorecard,
      performance,
      isLoading: false
    };
  }, [scorecard, breachEvents, tasks, loopId, isLoading]);
};