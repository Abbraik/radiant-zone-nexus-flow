import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockTasks, TaskType } from '../config/taskRegistry';
import { useToast } from './use-toast';

export interface Task extends TaskType {
  status: 'available' | 'claimed' | 'in_progress' | 'completed';
  owner_id?: string;
  loop_id?: string;
  due_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Enhanced mock data with population and development context
const mockTasksWithStatus: Task[] = [
  {
    id: '1',
    title: 'Configure Population Development Meta-Loop',
    description: 'Set up the foundational meta-loop that orchestrates all population and development dynamics',
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
  
  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      // In real implementation, this would be a Supabase query
      await new Promise(resolve => setTimeout(resolve, 500)); // simulate API delay
      console.log('useTasks: Loading tasks...', mockTasksWithStatus);
      console.log('useTasks: Task titles:', mockTasksWithStatus.map(t => t.title));
      return mockTasksWithStatus;
    }
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