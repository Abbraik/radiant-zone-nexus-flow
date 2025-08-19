// Workspace 5C Mock Service - For SUPABASE_LIVE=false
import type {
  EnhancedTask5C,
  Claim5C,
  TRIEvent5C,
  DEBand5C,
  SRTWindow5C,
  LoopScorecard5C,
  ReflexMemory5C,
  MandateRule5C,
  Capacity5C,
  Leverage5C
} from '../../types';

import { mockTasks5C, mockClaims5C, mockTRIEvents5C } from './fixtures';

// Mock data store - initialized from fixtures
let tasks5C = [...mockTasks5C];
let claims5C = [...mockClaims5C];
let triEvents5C = [...mockTRIEvents5C];

// Simulate async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Task operations
export const getTask5CById = async (id: string): Promise<EnhancedTask5C | null> => {
  await delay(100);
  return tasks5C.find(task => task.id === id) || null;
};

export const getTasks5C = async (filters?: any): Promise<EnhancedTask5C[]> => {
  await delay(150);
  let tasks = [...tasks5C];
  
  if (filters?.capacity) {
    tasks = tasks.filter(task => task.capacity === filters.capacity);
  }
  if (filters?.status) {
    tasks = tasks.filter(task => task.status === filters.status);
  }
  
  return tasks;
};

export const createTask5C = async (task: Partial<EnhancedTask5C>): Promise<EnhancedTask5C> => {
  await delay(200);
  
  const newTask: EnhancedTask5C = {
    id: `task-5c-${Date.now()}`,
    capacity: task.capacity!,
    loop_id: task.loop_id!,
    type: task.type || 'reactive',
    scale: task.scale || 'micro',
    leverage: task.leverage || 'N',
    title: task.title!,
    description: task.description,
    status: 'open',
    payload: task.payload || {},
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  tasks5C.push(newTask);
  return newTask;
};

export const updateTask5C = async (id: string, updates: Partial<EnhancedTask5C>): Promise<EnhancedTask5C> => {
  await delay(150);
  
  const taskIndex = tasks5C.findIndex(task => task.id === id);
  if (taskIndex === -1) throw new Error('Task not found');
  
  tasks5C[taskIndex] = {
    ...tasks5C[taskIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return tasks5C[taskIndex];
};

// Claim operations
export const getClaims5C = async (taskId: string): Promise<Claim5C[]> => {
  await delay(100);
  return claims5C.filter(claim => claim.task_id === taskId);
};

export const createClaim5C = async (claim: Partial<Claim5C>): Promise<Claim5C> => {
  await delay(200);
  
  const newClaim: Claim5C = {
    id: `claim-5c-${Date.now()}`,
    task_id: claim.task_id!,
    loop_id: claim.loop_id!,
    assignee: claim.assignee || 'mock-user',
    raci: claim.raci || {},
    leverage: claim.leverage || 'N',
    mandate_status: claim.mandate_status || 'allowed',
    evidence: claim.evidence || {},
    status: claim.status || 'draft',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  claims5C.push(newClaim);
  return newClaim;
};

export const updateClaim5C = async (id: string, updates: Partial<Claim5C>): Promise<Claim5C> => {
  await delay(150);
  
  const claimIndex = claims5C.findIndex(claim => claim.id === id);
  if (claimIndex === -1) throw new Error('Claim not found');
  
  claims5C[claimIndex] = {
    ...claims5C[claimIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return claims5C[claimIndex];
};

// TRI Events
export const getTRIEvents5C = async (loopId: string, limit = 50): Promise<TRIEvent5C[]> => {
  await delay(100);
  
  // Generate mock TRI events
  const events: TRIEvent5C[] = [];
  for (let i = 0; i < Math.min(limit, 20); i++) {
    events.push({
      id: `tri-5c-${loopId}-${i}`,
      loop_id: loopId,
      t_value: 0.3 + Math.random() * 0.4,
      r_value: 0.3 + Math.random() * 0.4,
      i_value: 0.3 + Math.random() * 0.4,
      tag: i % 5 === 0 ? 'checkpoint' : 'manual',
      user_id: 'mock-user',
      at: new Date(Date.now() - i * 3600000).toISOString(),
      created_at: new Date(Date.now() - i * 3600000).toISOString()
    });
  }
  
  return events;
};

export const createTRIEvent5C = async (event: Partial<TRIEvent5C>): Promise<TRIEvent5C> => {
  await delay(100);
  
  const newEvent: TRIEvent5C = {
    id: `tri-5c-${Date.now()}`,
    loop_id: event.loop_id!,
    task_id: event.task_id,
    t_value: event.t_value || 0.5,
    r_value: event.r_value || 0.5,
    i_value: event.i_value || 0.5,
    tag: event.tag || 'manual',
    user_id: 'mock-user',
    at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  
  triEvents5C.push(newEvent);
  return newEvent;
};

// Scorecard operations
export const getScorecard5C = async (loopId: string): Promise<LoopScorecard5C | null> => {
  await delay(100);
  
  return {
    loop_id: loopId,
    last_tri: { t_value: 0.6, r_value: 0.4, i_value: 0.7 },
    de_state: 'oscillating',
    claim_velocity: 2.3,
    fatigue: 3,
    breach_days: 2,
    tri_slope: -0.05,
    heartbeat_at: new Date().toISOString(),
    user_id: 'mock-user',
    updated_at: new Date().toISOString()
  };
};

export const updateScorecard5C = async (loopId: string, updates: Partial<LoopScorecard5C>): Promise<LoopScorecard5C> => {
  await delay(150);
  
  return {
    loop_id: loopId,
    user_id: 'mock-user',
    updated_at: new Date().toISOString(),
    last_tri: { t_value: 0.6, r_value: 0.4, i_value: 0.7 },
    de_state: 'stable',
    claim_velocity: 2.3,
    fatigue: 3,
    breach_days: 0,
    tri_slope: 0.02,
    heartbeat_at: new Date().toISOString(),
    ...updates
  };
};

// DE Bands
export const getDEBands5C = async (loopId: string): Promise<DEBand5C[]> => {
  await delay(100);
  
  return [{
    id: `band-5c-${loopId}`,
    loop_id: loopId,
    indicator: 'primary',
    lower_bound: 0.2,
    upper_bound: 0.8,
    asymmetry: 0.5,
    smoothing_alpha: 0.3,
    notes: 'Current operational band',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }];
};

export const createDEBand5C = async (band: Partial<DEBand5C>): Promise<DEBand5C> => {
  await delay(150);
  
  return {
    id: `band-5c-${Date.now()}`,
    loop_id: band.loop_id!,
    indicator: band.indicator || 'primary',
    lower_bound: band.lower_bound,
    upper_bound: band.upper_bound,
    asymmetry: band.asymmetry || 0,
    smoothing_alpha: band.smoothing_alpha || 0.3,
    notes: band.notes,
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// SRT Windows
export const getSRTWindows5C = async (loopId: string): Promise<SRTWindow5C[]> => {
  await delay(100);
  
  return [{
    id: `srt-5c-${loopId}`,
    loop_id: loopId,
    window_start: new Date().toISOString(),
    window_end: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    reflex_horizon: '2 hours',
    cadence: '1 day',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }];
};

export const createSRTWindow5C = async (window: Partial<SRTWindow5C>): Promise<SRTWindow5C> => {
  await delay(150);
  
  return {
    id: `srt-5c-${Date.now()}`,
    loop_id: window.loop_id!,
    window_start: window.window_start!,
    window_end: window.window_end!,
    reflex_horizon: window.reflex_horizon || '1 hour',
    cadence: window.cadence || '1 day',
    user_id: 'mock-user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Reflex Memory
export const getReflexMemory5C = async (loopId: string): Promise<ReflexMemory5C[]> => {
  await delay(100);
  
  return [{
    id: `memory-5c-${loopId}`,
    loop_id: loopId,
    actor: 'mock-user',
    kind: 'retune',
    before: { upper_bound: 0.8, asymmetry: 0.5 },
    after: { upper_bound: 0.75, asymmetry: 0.6 },
    rationale: 'Reduced oscillation by tightening upper bound',
    attachments: [],
    user_id: 'mock-user',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }];
};

export const createReflexMemory5C = async (memory: Partial<ReflexMemory5C>): Promise<ReflexMemory5C> => {
  await delay(150);
  
  return {
    id: `memory-5c-${Date.now()}`,
    loop_id: memory.loop_id!,
    actor: memory.actor || 'mock-user',
    kind: memory.kind!,
    before: memory.before || {},
    after: memory.after || {},
    rationale: memory.rationale!,
    attachments: memory.attachments || [],
    user_id: 'mock-user',
    created_at: new Date().toISOString()
  };
};

// Mandate Rules
export const getMandateRules5C = async (): Promise<MandateRule5C[]> => {
  await delay(100);
  
  return [
    {
      id: 'mandate-5c-1',
      actor: 'operations_manager',
      allowed_levers: ['N', 'P'],
      restrictions: {},
      notes: 'Can use N and P levers',
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'mandate-5c-2',
      actor: 'analyst',
      allowed_levers: ['N'],
      restrictions: { requires_approval: ['P', 'S'] },
      notes: 'Limited to N lever only',
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

export const checkMandate5C = async (actor: string, leverage: Leverage5C): Promise<'allowed' | 'warning_required' | 'blocked'> => {
  await delay(50);
  
  // Mock mandate checking logic
  if (leverage === 'N') return 'allowed';
  if (leverage === 'P') return 'warning_required';
  return 'blocked';
};

// Mode switching
export const switchMode5C = async (
  fromTaskId: string,
  toCapacity: Capacity5C,
  rationale: string
): Promise<EnhancedTask5C> => {
  await delay(200);
  
  const fromTask = await getTask5CById(fromTaskId);
  if (!fromTask) throw new Error('Source task not found');
  
  const newTask = await createTask5C({
    capacity: toCapacity,
    loop_id: fromTask.loop_id,
    type: fromTask.type,
    scale: fromTask.scale,
    leverage: fromTask.leverage,
    title: `${toCapacity.charAt(0).toUpperCase() + toCapacity.slice(1)} Action Required`,
    description: `Switched from ${fromTask.capacity} capacity. Rationale: ${rationale}`,
    payload: {
      ...fromTask.payload,
      mode_switch: {
        from_task_id: fromTaskId,
        from_capacity: fromTask.capacity,
        rationale,
        switched_at: new Date().toISOString()
      }
    }
  });
  
  return newTask;
};