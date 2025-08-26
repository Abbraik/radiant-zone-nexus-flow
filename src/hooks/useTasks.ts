import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTaskEngine } from './useTaskEngine';
import { isFeatureEnabled } from '@/lib/featureFlags';
import { useToast } from './use-toast';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'available' | 'claimed' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  capacity?: 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';
  owner_id?: string;
  loop_id?: string;
  due_at?: Date;
  created_at: Date;
  updated_at: Date;
  zone?: string;
  type?: string;
  components?: string[];
}

// Enhanced mock data with population and development context
const mockTasksWithStatus: Task[] = [
  {
    id: '1',
    title: 'Configure Population Development Meta-Loop',
    description: 'Set up the foundational meta-loop that orchestrates all population and development dynamics',
    priority: 'high',
    zone: 'think',
    type: 'loop_design',
    components: ['TensionSelector', 'SRTRangeSlider'],
    status: 'available',
    loop_id: 'loop-meta',
    due_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    title: 'Analyze Fertility Rate Dynamics',
    description: 'Review natural population growth patterns and fertility rate determinants',
    priority: 'medium',
    zone: 'think',
    type: 'define_tension',
    components: ['TensionSelector', 'SRTRangeSlider'],
    status: 'available',
    loop_id: 'loop-1',
    due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '3',
    title: 'Optimize Resource Market Interventions',
    description: 'Design intervention bundle for population-resource market balance',
    priority: 'high',
    zone: 'act',
    type: 'sprint_planning',
    components: ['InterventionPicker', 'BundlePreview', 'SmartRolesPanel'],
    status: 'available',
    loop_id: 'loop-2',
    due_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '4',
    title: 'Monitor Economic Stability Metrics',
    description: 'Track economic stability indicators and population growth correlation',
    priority: 'critical',
    zone: 'monitor',
    type: 'breach_response',
    components: ['LoopTable', 'TRIDetailDrawer'],
    status: 'available',
    loop_id: 'loop-6',
    due_at: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000), // critical - 12 hours
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '5',
    title: 'Simulate Migration Pattern Scenarios',
    description: 'Test various migration and economic opportunity scenarios for system resilience',
    priority: 'low',
    zone: 'innovate-learn',
    type: 'experiment_design',
    components: ['SimulationParams', 'SimulationPreview'],
    status: 'available',
    loop_id: 'loop-9',
    due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '6',
    title: 'Capture Environmental Quality Insights',
    description: 'Document learnings from environmental quality and economic balance testing',
    priority: 'medium',
    zone: 'innovate-learn',
    type: 'capture_insight',
    components: ['InsightFeed', 'ExperimentStudio'],
    status: 'available',
    loop_id: 'loop-4',
    due_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '7',
    title: 'View Population Development 3D Cascade',
    description: 'Interactive 3D visualization of population and development goal dependencies',
    priority: 'low',
    zone: 'think',
    type: 'view_cascade_3d',
    components: ['Cascade3DViewer'],
    status: 'available',
    loop_id: 'loop-meta',
    due_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '8',
    title: 'Monitor Social Structure Digital Twin',
    description: 'Real-time digital twin analysis of social structure evolution and outcomes',
    priority: 'high',
    zone: 'monitor',
    type: 'monitor_digital_twin',
    components: ['DigitalTwinPreview', 'TrendSparklines'],
    status: 'available',
    loop_id: 'loop-10',
    due_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    created_at: new Date(),
    updated_at: new Date()
  }
];

export const useTasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [claimingTask, setClaimingTask] = useState<Task | null>(null);
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  
  // Use real Task Engine V2 if enabled
  const { tasks: engineTasks, tasksLoading: engineLoading } = useTaskEngine();
  const useRealTasks = isFeatureEnabled('useTaskEngineV2') && !isFeatureEnabled('useMockHome');

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ['tasks', useRealTasks],
    queryFn: async (): Promise<Task[]> => {
      if (useRealTasks) {
        // Convert Task Engine V2 tasks to legacy format
        return engineTasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status as Task['status'],
          priority: task.priority,
          capacity: task.context?.capacity as Task['capacity'],
          owner_id: task.created_by,
          loop_id: task.context?.loop_id,
          due_at: task.due_date ? new Date(task.due_date) : undefined,
          created_at: new Date(task.created_at),
          updated_at: new Date(task.updated_at),
          zone: task.context?.capacity || 'think',
          type: 'capacity_task',
          components: []
        }));
      }
      
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTasksWithStatus;
    },
    enabled: !useRealTasks || !engineLoading
  });

  const myTasks = allTasks.filter(task => 
    task.status === 'claimed' && task.owner_id === 'current-user'
  );
  
  const availableTasks = allTasks.filter(task => task.status === 'available');
  console.log('useTasks: Available tasks:', availableTasks.map(t => ({ id: t.id, title: t.title })));
  
  const activeTask = myTasks[0] || null;

  const claimTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return taskId;
    },
    onSuccess: (taskId) => {
      // Get the claimed task to check its zone
      const claimedTask = allTasks.find(task => task.id === taskId);
      
      // Update local state
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => 
        oldTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'claimed' as const, owner_id: 'current-user' }
            : task
        )
      );
      
      toast({
        title: "Task Claimed",
        description: "Task has been added to your workspace",
        duration: 3000
      });

      // Navigate to appropriate zone if it's a monitor task (defer to avoid React internal errors)
      if (claimedTask?.zone === 'monitor') {
        setTimeout(() => {
          navigate('/monitor');
        }, 100);
      }
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return taskId;
    },
    onSuccess: (taskId) => {
      const task = allTasks.find(t => t.id === taskId);
      
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => 
        oldTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' as const }
            : task
        )
      );
      
      // Custom completion messages based on task type
      let title = "Task Completed";
      let description = "Great work! Task marked as complete";
      
      if (task?.type === 'run_simulation') {
        title = "Simulation Complete";
        description = "Δ=+5% — Capture as Insight";
      } else if (task?.type === 'publish_bundle') {
        title = "Bundle Published";
        description = "Intervention bundle successfully deployed";
      } else if (task?.type === 'review_tri') {
        title = "TRI Review Complete";
        description = "System health assessment completed";
      }
      
      toast({
        title,
        description,
        duration: 3000
      });
    }
  });

  const openClaimPopup = useCallback((taskId: string) => {
    console.log('useTasks: openClaimPopup called with taskId:', taskId);
    console.log('useTasks: allTasks:', allTasks);
    console.log('useTasks: allTasks IDs:', allTasks.map(t => t.id));
    const task = allTasks.find(t => t.id === taskId);
    console.log('useTasks: Found task:', task);
    if (task) {
      console.log('useTasks: Setting claimingTask and showing popup');
      setClaimingTask(task);
      setShowClaimPopup(true);
    } else {
      console.log('useTasks: No task found with id:', taskId);
    }
  }, [allTasks]);

  const confirmClaimTask = useCallback(() => {
    if (claimingTask) {
      claimTaskMutation.mutate(claimingTask.id);
      setShowClaimPopup(false);
      setClaimingTask(null);
    }
  }, [claimingTask, claimTaskMutation]);

  const cancelClaimTask = useCallback(() => {
    setShowClaimPopup(false);
    setClaimingTask(null);
  }, []);

  const claimTask = useCallback((taskId: string) => {
    claimTaskMutation.mutate(taskId);
  }, [claimTaskMutation]);

  const completeTask = useCallback((taskId: string) => {
    completeTaskMutation.mutate(taskId);
  }, [completeTaskMutation]);

  return {
    allTasks,
    myTasks,
    availableTasks,
    activeTask,
    isLoading,
    claimTask,
    completeTask,
    openClaimPopup,
    confirmClaimTask,
    cancelClaimTask,
    claimingTask,
    showClaimPopup,
    isClaimingTask: claimTaskMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending
  };
};