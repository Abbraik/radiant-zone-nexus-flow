// Mock 5C Services with TaskEngine V2 integration
import type { 
  EnhancedTask5C, 
  Claim5C, 
  TRIEvent5C, 
  LoopScorecard5C,
  DEBand5C,
  SRTWindow5C,
  ReflexMemory5C,
  MandateRule5C,
  Capacity5C,
  ClaimStatus5C,
  MandateStatus5C
} from '@/5c/types';
import { taskEngine } from '@/services/taskEngine';
import type { TaskV2, TaskStatus } from '@/types/taskEngine';

// Helper to convert TaskV2 to EnhancedTask5C
const convertTaskV2To5C = (taskV2: TaskV2): EnhancedTask5C => {
  const capacity = (taskV2.context?.capacity || 'responsive') as Capacity5C;
  
  return {
    id: taskV2.id,
    capacity,
    loop_id: taskV2.context?.loop_id || 'default-loop-001',
    type: taskV2.context?.loop_type || 'reactive',
    scale: taskV2.context?.scale || 'meso',
    leverage: taskV2.context?.leverage || 'P',
    tri: taskV2.context?.tri || { t_value: 0.5, r_value: 0.5, i_value: 0.5 },
    de_band_id: taskV2.context?.de_band_id,
    srt_id: taskV2.context?.srt_id,
    assigned_to: taskV2.context?.assigned_to,
    status: mapTaskStatusTo5C(taskV2.status),
    title: taskV2.title,
    description: taskV2.description,
    payload: taskV2.context || {},
    user_id: taskV2.created_by,
    created_at: taskV2.created_at,
    updated_at: taskV2.updated_at
  };
};

// Helper to convert 5C status to TaskV2 status
const map5CStatusToTask = (status: EnhancedTask5C['status']): TaskStatus => {
  switch (status) {
    case 'open': return 'draft';
    case 'claimed': return 'active';
    case 'active': return 'active';
    case 'done': return 'completed';
    case 'blocked': return 'paused';
    default: return 'draft';
  }
};

// Helper to convert TaskV2 status to 5C status
const mapTaskStatusTo5C = (status: TaskStatus): EnhancedTask5C['status'] => {
  switch (status) {
    case 'draft': return 'open';
    case 'active': return 'claimed';
    case 'completed': return 'done';
    case 'paused': return 'blocked';
    case 'cancelled': return 'blocked';
    case 'failed': return 'blocked';
    default: return 'open';
  }
};

// Create 5C task with TaskEngine V2 backend
const create5CTaskInEngine = async (task5c: Partial<EnhancedTask5C>): Promise<TaskV2> => {
  return taskEngine.createTask({
    title: task5c.title || 'Untitled 5C Task',
    description: task5c.description,
    priority: 'medium',
    context: {
      capacity: task5c.capacity,
      loop_id: task5c.loop_id,
      loop_type: task5c.type,
      scale: task5c.scale,
      leverage: task5c.leverage,
      tri: task5c.tri,
      de_band_id: task5c.de_band_id,
      srt_id: task5c.srt_id,
      assigned_to: task5c.assigned_to,
      is_5c_task: true
    }
  });
};

// Mock 5C Tasks Service
export const getTasks5C = async (filters?: { capacity?: Capacity5C }): Promise<EnhancedTask5C[]> => {
  try {
    // Get all TaskV2 tasks that are 5C tasks
    const allTasks = await taskEngine.getTasks();
    const c5Tasks = allTasks
      .filter(task => task.context?.is_5c_task)
      .map(convertTaskV2To5C);

    // Apply filters
    if (filters?.capacity) {
      return c5Tasks.filter(task => task.capacity === filters.capacity);
    }

    return c5Tasks;
  } catch (error) {
    console.error('Failed to get 5C tasks:', error);
    
    // Fallback to default mock tasks
    return [
      {
        id: '5c-task-1',
        capacity: 'responsive',
        loop_id: 'loop-001',
        type: 'reactive',
        scale: 'meso',
        leverage: 'P',
        tri: { t_value: 0.7, r_value: 0.5, i_value: 0.3 },
        status: 'open',
        title: 'Responsive: Market Signal Analysis',
        description: 'Analyze incoming market signals and prepare response options',
        payload: { signal_type: 'market_shift', urgency: 'medium' },
        user_id: 'user-1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5c-task-2',
        capacity: 'deliberative',
        loop_id: 'loop-002',
        type: 'perceptual',
        scale: 'macro',
        leverage: 'S',
        tri: { t_value: 0.4, r_value: 0.8, i_value: 0.6 },
        status: 'claimed',
        title: 'Deliberative: Strategic Options Assessment',
        description: 'Evaluate strategic options for long-term market positioning',
        payload: { decision_horizon: '12_months', stakeholders: ['board', 'management'] },
        user_id: 'user-1',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
  }
};

export const getTask5CById = async (taskId: string): Promise<EnhancedTask5C | null> => {
  try {
    const taskV2 = await taskEngine.getTask(taskId);
    if (!taskV2 || !taskV2.context?.is_5c_task) {
      return null;
    }
    return convertTaskV2To5C(taskV2);
  } catch (error) {
    console.error('Failed to get 5C task by ID:', error);
    return null;
  }
};

export const createTask5C = async (taskData: Partial<EnhancedTask5C>): Promise<EnhancedTask5C> => {
  try {
    const taskV2 = await create5CTaskInEngine(taskData);
    return convertTaskV2To5C(taskV2);
  } catch (error) {
    console.error('Failed to create 5C task:', error);
    throw error;
  }
};

export const updateTask5C = async (taskId: string, updates: Partial<EnhancedTask5C>): Promise<EnhancedTask5C> => {
  try {
    const newStatus = updates.status ? map5CStatusToTask(updates.status) : undefined;
    if (newStatus) {
      await taskEngine.updateTaskStatus(taskId, newStatus);
    }
    
    const updatedTask = await taskEngine.getTask(taskId);
    if (!updatedTask) throw new Error('Task not found after update');
    
    return convertTaskV2To5C(updatedTask);
  } catch (error) {
    console.error('Failed to update 5C task:', error);
    throw error;
  }
};

// Mock Claims Service
export const getClaims5C = async (taskId?: string): Promise<Claim5C[]> => {
  // Return mock claims for now
  return [
    {
      id: 'claim-1',
      task_id: taskId || '5c-task-1',
      loop_id: 'loop-001',
      assignee: 'user-1',
      raci: { responsible: ['user-1'], accountable: ['manager-1'] },
      leverage: 'P',
      mandate_status: 'allowed',
      evidence: { completion_rate: 0.8 },
      status: 'active',
      user_id: 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

export const createClaim5C = async (claimData: Partial<Claim5C>): Promise<Claim5C> => {
  return {
    id: `claim-${Date.now()}`,
    task_id: claimData.task_id!,
    loop_id: claimData.loop_id || 'default-loop',
    assignee: claimData.assignee!,
    raci: claimData.raci || {},
    leverage: claimData.leverage || 'P',
    mandate_status: claimData.mandate_status || 'allowed',
    evidence: claimData.evidence || {},
    status: claimData.status || 'active',
    user_id: claimData.user_id || 'current-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...claimData
  };
};

export const updateClaim5C = async (claimId: string, updates: Partial<Claim5C>): Promise<Claim5C> => {
  // Mock implementation
  const claim = await getClaims5C();
  const existingClaim = claim.find(c => c.id === claimId);
  if (!existingClaim) throw new Error('Claim not found');
  
  return {
    ...existingClaim,
    ...updates,
    updated_at: new Date().toISOString()
  };
};

// Mock TRI Events Service
export const getTRIEvents5C = async (loopId: string): Promise<TRIEvent5C[]> => {
  return [
    {
      id: 'tri-1',
      loop_id: loopId,
      t_value: 0.7,
      r_value: 0.5,
      i_value: 0.3,
      tag: 'market_analysis',
      user_id: 'user-1',
      at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ];
};

export const createTRIEvent5C = async (eventData: Partial<TRIEvent5C>): Promise<TRIEvent5C> => {
  return {
    id: `tri-${Date.now()}`,
    loop_id: eventData.loop_id!,
    t_value: eventData.t_value || 0.5,
    r_value: eventData.r_value || 0.5,
    i_value: eventData.i_value || 0.5,
    tag: eventData.tag || 'default',
    user_id: eventData.user_id || 'current-user',
    at: eventData.at || new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...eventData
  };
};

// Mock additional services
export const getScorecard5C = async (loopId: string): Promise<LoopScorecard5C | null> => {
  return {
    loop_id: loopId,
    last_tri: { t_value: 0.7, r_value: 0.5, i_value: 0.3 },
    de_state: 'in_band',
    claim_velocity: 2.3,
    fatigue: 0.2,
    breach_days: 0,
    tri_slope: 0.1,
    heartbeat_at: new Date().toISOString(),
    user_id: 'user-1',
    updated_at: new Date().toISOString()
  };
};

export const updateScorecard5C = async (loopId: string, updates: Partial<LoopScorecard5C>): Promise<LoopScorecard5C> => {
  const existing = await getScorecard5C(loopId);
  if (!existing) throw new Error('Scorecard not found');
  
  return {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString()
  };
};

export const getDEBands5C = async (loopId: string): Promise<DEBand5C[]> => {
  return [];
};

export const createDEBand5C = async (bandData: Partial<DEBand5C>): Promise<DEBand5C> => {
  return {
    id: `band-${Date.now()}`,
    loop_id: bandData.loop_id!,
    indicator: bandData.indicator || 'default',
    asymmetry: bandData.asymmetry || 0,
    smoothing_alpha: bandData.smoothing_alpha || 0.3,
    user_id: bandData.user_id || 'current-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...bandData
  };
};

export const getSRTWindows5C = async (loopId: string): Promise<SRTWindow5C[]> => {
  return [];
};

export const createSRTWindow5C = async (windowData: Partial<SRTWindow5C>): Promise<SRTWindow5C> => {
  return {
    id: `srt-${Date.now()}`,
    loop_id: windowData.loop_id!,
    window_start: windowData.window_start || new Date().toISOString(),
    window_end: windowData.window_end || new Date(Date.now() + 24*60*60*1000).toISOString(),
    reflex_horizon: windowData.reflex_horizon || '1 hour',
    cadence: windowData.cadence || '15 minutes',
    user_id: windowData.user_id || 'current-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...windowData
  };
};

export const getReflexMemory5C = async (loopId: string): Promise<ReflexMemory5C[]> => {
  return [];
};

export const createReflexMemory5C = async (memoryData: Partial<ReflexMemory5C>): Promise<ReflexMemory5C> => {
  return {
    id: `memory-${Date.now()}`,
    loop_id: memoryData.loop_id!,
    actor: memoryData.actor || 'system',
    kind: memoryData.kind || 'decision',
    before: memoryData.before || {},
    after: memoryData.after || {},
    rationale: memoryData.rationale || '',
    attachments: memoryData.attachments || [],
    user_id: memoryData.user_id || 'current-user',
    created_at: new Date().toISOString(),
    ...memoryData
  };
};

export const getMandateRules5C = async (): Promise<MandateRule5C[]> => {
  return [];
};

export const checkMandate5C = async (actor: string, leverage: string): Promise<MandateStatus5C> => {
  return 'allowed';
};

export const switchMode5C = async (mode: 'supabase' | 'mock'): Promise<void> => {
  console.log(`5C service mode switched to: ${mode}`);
};