import { useQuery } from '@tanstack/react-query';
import { useTaskEngine } from './useTaskEngine';
import { isFeatureEnabled } from '@/lib/featureFlags';

export interface GoldenScenario {
  id: string;
  title: string;
  description: string;
  capacity: 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';
  loop_codes: string[];
  task_count: number;
  active_tasks: number;
  overdue_tasks: number;
  next_review?: Date;
  status: 'armed' | 'triggered' | 'active' | 'resolved';
  deeplink: string;
}

const GOLDEN_SCENARIOS: Omit<GoldenScenario, 'task_count' | 'active_tasks' | 'overdue_tasks' | 'status'>[] = [
  {
    id: 'fertility',
    title: 'Fertility & Childcare Access',
    description: 'Monitor childcare wait times and fertility rate correlation',
    capacity: 'responsive',
    loop_codes: ['FER-L01'],
    deeplink: '/workspace-5c/responsive?template=containment_pack'
  },
  {
    id: 'labour',
    title: 'Labour Market Matching', 
    description: 'Track job vacancy filling and skills mismatch patterns',
    capacity: 'anticipatory',
    loop_codes: ['LAB-L01'],
    deeplink: '/workspace-5c/anticipatory?template=readiness_plan'
  },
  {
    id: 'cohesion',
    title: 'Social Cohesion & Trust',
    description: 'Monitor community trust and service satisfaction alignment',
    capacity: 'deliberative',
    loop_codes: ['SOC-L01'],
    deeplink: '/workspace-5c/deliberative?template=portfolio_compare'
  }
];

export const useGoldenScenarios = () => {
  const { tasks, summary } = useTaskEngine();
  const useLiveData = isFeatureEnabled('useTaskEngineV2') && !isFeatureEnabled('useMockHome');

  return useQuery({
    queryKey: ['golden-scenarios', useLiveData],
    queryFn: async (): Promise<GoldenScenario[]> => {
      if (!useLiveData) {
        // Return mock data when feature flags are disabled
        return GOLDEN_SCENARIOS.map(scenario => ({
          ...scenario,
          task_count: Math.floor(Math.random() * 8) + 2,
          active_tasks: Math.floor(Math.random() * 4) + 1,
          overdue_tasks: Math.floor(Math.random() * 2),
          status: ['armed', 'triggered', 'active'][Math.floor(Math.random() * 3)] as GoldenScenario['status']
        }));
      }

      // Get real task counts per scenario
      const scenarioStats = GOLDEN_SCENARIOS.map(scenario => {
        // Filter tasks by loop_codes and capacity
        const scenarioTasks = tasks.filter(task => 
          scenario.loop_codes.some(code => task.context?.loop_code === code) ||
          task.title?.toLowerCase().includes(scenario.id)
        );

        const activeTasks = scenarioTasks.filter(task => 
          ['active', 'claimed', 'in_progress'].includes(task.status)
        );

        const overdueTasks = scenarioTasks.filter(task => 
          task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
        );

        // Determine status based on task activity
        let status: GoldenScenario['status'] = 'armed';
        if (activeTasks.length > 0) {
          status = 'active';
        } else if (scenarioTasks.length > 0) {
          status = 'triggered';
        }

        return {
          ...scenario,
          task_count: scenarioTasks.length,
          active_tasks: activeTasks.length,
          overdue_tasks: overdueTasks.length,
          status,
          next_review: scenarioTasks
            .filter(task => task.due_date)
            .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0]?.due_date
            ? new Date(scenarioTasks[0].due_date!)
            : undefined
        };
      });

      return scenarioStats;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000 // 1 minute
  });
};