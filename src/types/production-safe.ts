// Production-safe type definitions with enum alignment
export type LoopType = 'reactive' | 'structural' | 'perceptual' | 'anticipatory';
export type ScaleType = 'micro' | 'meso' | 'macro' | 'supervisory'; 
export type Leverage = 'N' | 'P' | 'S';
export type MandateStatus = 'allowed' | 'review' | 'blocked';
export type ClaimStatus = 'draft' | 'active' | 'paused' | 'done' | 'cancelled';

// Compass anchor normalization helper
export const normalizeAnchor = (anchor: string): string => {
  switch (anchor) {
    case 'domains': return 'domain';
    case 'institutions': return 'institution';
    case 'populations': return 'population';
    default: return anchor;
  }
};

// Task inbox adapter using compatibility view
export const fetchInboxTasks = async (client: any) => {
  try {
    // Try new v_tasks_inbox view first
    const { data, error } = await client
      .from('v_tasks_inbox')
      .select('*')
      .order('priority', { ascending: false })
      .order('due_at', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (err) {
    // Fallback to direct tasks_v2 query if view doesn't exist
    console.warn('v_tasks_inbox not available, falling back to tasks_v2');
    const { data, error } = await client
      .from('tasks_v2')
      .select(`
        task_id as id,
        loop_id,
        capacity,
        template_key,
        status,
        priority,
        title,
        payload,
        open_route,
        created_by as user_id,
        created_at,
        updated_at,
        due_at
      `)
      .order('priority', { ascending: false })
      .order('due_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Loop shared nodes adapter using compatibility view
export const fetchLoopSharedNodes = async (client: any, loopId: string) => {
  try {
    // Try v_loop_shared_nodes view first  
    const { data, error } = await client
      .from('v_loop_shared_nodes')
      .select('*')
      .eq('loop_id', loopId);
    
    if (error) throw error;
    return data;
  } catch (err) {
    // Fallback to manual join if view doesn't exist
    console.warn('v_loop_shared_nodes not available, falling back to join');
    const { data, error } = await client
      .from('loop_shared_nodes')
      .select(`
        id as link_id,
        loop_id,
        snl_id,
        shared_nodes!inner (
          key as snl_key,
          label as snl_label,
          type as snl_type
        ),
        role,
        note,
        created_at
      `)
      .eq('loop_id', loopId);
    
    if (error) throw error;
    return data;
  }
};