// Workspace 5C Supabase Service - Isolated from legacy
import { supabase } from '@/integrations/supabase/client';
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

// Task operations
export const getTask5CById = async (id: string): Promise<EnhancedTask5C | null> => {
  // Fetch from 5C tasks table
  const { data, error } = await supabase
    .from('tasks_5c')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  
  // Data is already in 5C format from tasks_5c table
  return data ? {
    ...data,
    tri: data.tri || undefined
  } as EnhancedTask5C : null;
};

export const getTasks5C = async (filters?: { capacity?: Capacity5C }): Promise<EnhancedTask5C[]> => {
  // Fetch from 5C tasks table  
  let query = supabase
    .from('tasks_5c')
    .select('*')
    .order('created_at', { ascending: false });
    
  // Apply capacity filter if provided
  if (filters?.capacity) {
    query = query.eq('capacity', filters.capacity);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Tasks are already in 5C format from tasks_5c table
  const transformedTasks = (data || []).map(item => ({
    ...item,
    // Ensure all required fields are present
    tri: item.tri || undefined,
  } as EnhancedTask5C));
  
  return transformedTasks;
};

export const createTask5C = async (task: Partial<EnhancedTask5C>): Promise<EnhancedTask5C> => {
  // Create in 5C tasks table
  const taskData = {
    capacity: task.capacity,
    type: task.type || 'reactive',
    scale: task.scale || 'meso', 
    leverage: task.leverage || 'P',
    loop_id: task.loop_id || `loop-${task.capacity}-001`,
    title: task.title,
    description: task.description,
    status: task.status || 'open',
    payload: task.payload || {},
    user_id: task.user_id || '00000000-0000-0000-0000-000000000000'
  };

  const { data, error } = await supabase
    .from('tasks_5c')
    .insert(taskData)
    .select()
    .single();
  
  if (error) throw error;
  
  // Data is already in 5C format
  return {
    ...data,
    tri: data.tri || undefined
  } as EnhancedTask5C;
};

export const updateTask5C = async (id: string, updates: Partial<EnhancedTask5C>): Promise<EnhancedTask5C> => {
  // Update in 5C tasks table
  const { data, error } = await supabase
    .from('tasks_5c')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Data is already in 5C format
  return {
    ...data,
    tri: data.tri || undefined
  } as EnhancedTask5C;
};

// Claim operations
export const getClaims5C = async (taskId: string): Promise<Claim5C[]> => {
  const { data, error } = await supabase
    .from('claims_5c')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    raci: item.raci as any || {},
    evidence: item.evidence as any || {}
  }));
};

export const createClaim5C = async (claim: Partial<Claim5C>): Promise<Claim5C> => {
  const { data, error } = await supabase
    .from('claims_5c')
    .insert({
      task_id: claim.task_id,
      loop_id: claim.loop_id,
      assignee: claim.assignee || 'current-user',
      raci: claim.raci || {},
      leverage: claim.leverage || 'N',
      mandate_status: claim.mandate_status || 'allowed',
      evidence: claim.evidence || {},
      status: claim.status || 'draft',
      user_id: 'current-user'
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    raci: data.raci as any || {},
    evidence: data.evidence as any || {}
  };
};

export const updateClaim5C = async (id: string, updates: Partial<Claim5C>): Promise<Claim5C> => {
  const { data, error } = await supabase
    .from('claims_5c')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    raci: data.raci as any || {},
    evidence: data.evidence as any || {}
  };
};

// TRI Events
export const getTRIEvents5C = async (loopId: string, limit = 50): Promise<TRIEvent5C[]> => {
  const { data, error } = await supabase
    .from('tri_events_5c')
    .select('*')
    .eq('loop_id', loopId)
    .order('at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
};

export const createTRIEvent5C = async (event: Partial<TRIEvent5C>): Promise<TRIEvent5C> => {
  const { data, error } = await supabase
    .from('tri_events_5c')
    .insert({
      loop_id: event.loop_id,
      task_id: event.task_id,
      t_value: event.t_value || 0.5,
      r_value: event.r_value || 0.5,
      i_value: event.i_value || 0.5,
      tag: event.tag || 'manual',
      user_id: 'current-user'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Scorecard operations
export const getScorecard5C = async (loopId: string): Promise<LoopScorecard5C | null> => {
  const { data, error } = await supabase
    .from('loop_scorecards_5c')
    .select('*')
    .eq('loop_id', loopId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  
  return data ? {
    ...data,
    last_tri: data.last_tri as any || {}
  } : null;
};

export const updateScorecard5C = async (loopId: string, updates: Partial<LoopScorecard5C>): Promise<LoopScorecard5C> => {
  const { data, error } = await supabase
    .from('loop_scorecards_5c')
    .upsert({
      loop_id: loopId,
      user_id: 'current-user',
      ...updates
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    last_tri: data.last_tri as any || {}
  };
};

// DE Bands
export const getDEBands5C = async (loopId: string): Promise<DEBand5C[]> => {
  const { data, error } = await supabase
    .from('de_bands_5c')
    .select('*')
    .eq('loop_id', loopId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const createDEBand5C = async (band: Partial<DEBand5C>): Promise<DEBand5C> => {
  const { data, error } = await supabase
    .from('de_bands_5c')
    .insert({
      loop_id: band.loop_id,
      indicator: band.indicator || 'primary',
      lower_bound: band.lower_bound,
      upper_bound: band.upper_bound,
      asymmetry: band.asymmetry || 0,
      smoothing_alpha: band.smoothing_alpha || 0.3,
      notes: band.notes,
      user_id: 'current-user'
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// SRT Windows
export const getSRTWindows5C = async (loopId: string): Promise<SRTWindow5C[]> => {
  const { data, error } = await supabase
    .from('srt_windows_5c')
    .select('*')
    .eq('loop_id', loopId)
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    reflex_horizon: String(item.reflex_horizon),
    cadence: String(item.cadence)
  }));
};

export const createSRTWindow5C = async (window: Partial<SRTWindow5C>): Promise<SRTWindow5C> => {
  const { data, error } = await supabase
    .from('srt_windows_5c')
    .insert({
      loop_id: window.loop_id,
      window_start: window.window_start,
      window_end: window.window_end,
      reflex_horizon: window.reflex_horizon || '1 hour',
      cadence: window.cadence || '1 day',
      user_id: 'current-user'
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    reflex_horizon: String(data.reflex_horizon),
    cadence: String(data.cadence)
  };
};

// Reflex Memory
export const getReflexMemory5C = async (loopId: string): Promise<ReflexMemory5C[]> => {
  const { data, error } = await supabase
    .from('reflex_memory_5c')
    .select('*')
    .eq('loop_id', loopId)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    before: item.before as any || {},
    after: item.after as any || {},
    attachments: item.attachments as any || []
  }));
};

export const createReflexMemory5C = async (memory: Partial<ReflexMemory5C>): Promise<ReflexMemory5C> => {
  const { data, error } = await supabase
    .from('reflex_memory_5c')
    .insert({
      loop_id: memory.loop_id,
      actor: memory.actor || 'current-user',
      kind: memory.kind,
      before: memory.before || {},
      after: memory.after || {},
      rationale: memory.rationale,
      attachments: memory.attachments || [],
      user_id: 'current-user'
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    before: data.before as any || {},
    after: data.after as any || {},
    attachments: data.attachments as any || []
  };
};

// Mandate Rules
export const getMandateRules5C = async (): Promise<MandateRule5C[]> => {
  const { data, error } = await supabase
    .from('mandate_rules_5c')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    restrictions: item.restrictions as any || {}
  }));
};

export const checkMandate5C = async (actor: string, leverage: Leverage5C): Promise<'allowed' | 'warning_required' | 'blocked'> => {
  const { data, error } = await supabase
    .from('mandate_rules_5c')
    .select('allowed_levers')
    .eq('actor', actor)
    .single();
  
  if (error || !data) return 'allowed';
  
  if (data.allowed_levers.includes(leverage)) {
    return 'allowed';
  }
  
  // Simple heuristic: P lever requires warning, S is blocked
  return leverage === 'P' ? 'warning_required' : 'blocked';
};

// Mode switching - creates new task with different capacity
export const switchMode5C = async (
  fromTaskId: string,
  toCapacity: Capacity5C,
  rationale: string
): Promise<EnhancedTask5C> => {
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