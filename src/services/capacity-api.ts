// Capacity-Mode API Service Layer

import { supabase } from '@/integrations/supabase/client';
import type { 
  EnhancedTask, 
  Loop, 
  Claim, 
  BandCrossing, 
  LoopScorecard,
  TRIEvent,
  DEBand,
  SRTWindow,
  Intervention,
  MandateRule 
} from '@/types/capacity';

export interface CapacityAPIService {
  // Task operations
  getTaskById(id: string): Promise<EnhancedTask | null>;
  listTasksByCapacity(capacity: string): Promise<EnhancedTask[]>;
  updateTaskPayload(id: string, payload: any): Promise<void>;
  claimTask(id: string, assignee: string): Promise<void>;
  
  // Loop operations
  listLoops(): Promise<Loop[]>;
  getLoop(id: string): Promise<Loop | null>;
  createLoop(loop: Partial<Loop>): Promise<Loop>;
  
  // Claims operations
  listClaimsByActor(actor: string): Promise<Claim[]>;
  createClaim(claim: Partial<Claim>): Promise<Claim>;
  updateClaim(id: string, updates: Partial<Claim>): Promise<void>;
  
  // Band crossings
  listBandCrossings(loopId: string): Promise<BandCrossing[]>;
  
  // Scorecards
  getScorecard(loopId: string): Promise<LoopScorecard | null>;
  updateScorecard(loopId: string, scorecard: Partial<LoopScorecard>): Promise<void>;
  
  // TRI Events
  createTRIEvent(event: Partial<TRIEvent>): Promise<TRIEvent>;
  
  // Mandate evaluation
  evaluateMandate(actor: string, leverage: string): Promise<string>;
}

// Supabase Implementation
export class SupabaseCapacityService implements CapacityAPIService {
  async getTaskById(id: string): Promise<EnhancedTask | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as any as EnhancedTask;
  }

  async listTasksByCapacity(capacity: string): Promise<EnhancedTask[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('capacity', capacity as any)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as any as EnhancedTask[];
  }

  async updateTaskPayload(id: string, payload: any): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ payload })
      .eq('id', id);
    
    if (error) throw error;
  }

  async claimTask(id: string, assignee: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        assigned_to: assignee, 
        status: 'claimed' 
      })
      .eq('id', id);
    
    if (error) throw error;
  }

  async listLoops(): Promise<Loop[]> {
    const { data, error } = await supabase
      .from('loops')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Loop[];
  }

  async getLoop(id: string): Promise<Loop | null> {
    const { data, error } = await supabase
      .from('loops')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Loop;
  }

  async createLoop(loop: Partial<Loop>): Promise<Loop> {
    const { data, error } = await supabase
      .from('loops')
      .insert({
        name: loop.name || 'Untitled Loop',
        description: loop.description,
        loop_type: loop.loop_type || 'reactive',
        scale: loop.scale || 'micro',
        leverage_default: loop.leverage_default || 'N',
        metadata: loop.metadata || {},
        user_id: loop.user_id || ''
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Loop;
  }

  async listClaimsByActor(actor: string): Promise<Claim[]> {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('assignee', actor)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Claim[];
  }

  async createClaim(claim: Partial<Claim>): Promise<Claim> {
    const { data, error } = await supabase
      .from('claims')
      .insert({
        task_id: claim.task_id || '',
        loop_id: claim.loop_id || '',
        assignee: claim.assignee || '',
        raci: claim.raci || {},
        leverage: claim.leverage || 'N',
        mandate_status: claim.mandate_status || 'allowed',
        evidence: claim.evidence || {},
        sprint_id: claim.sprint_id,
        status: claim.status || 'draft',
        user_id: claim.user_id || ''
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as Claim;
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<void> {
    const { error } = await supabase
      .from('claims')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }

  async listBandCrossings(loopId: string): Promise<BandCrossing[]> {
    const { data, error } = await supabase
      .from('band_crossings')
      .select('*')
      .eq('loop_id', loopId)
      .order('at', { ascending: false });
    
    if (error) throw error;
    return data as BandCrossing[];
  }

  async getScorecard(loopId: string): Promise<LoopScorecard | null> {
    const { data, error } = await supabase
      .from('loop_scorecards')
      .select('*')
      .eq('loop_id', loopId)
      .single();
    
    if (error) return null;
    return data as LoopScorecard;
  }

  async updateScorecard(loopId: string, scorecard: Partial<LoopScorecard>): Promise<void> {
    const { error } = await supabase.rpc('upsert_loop_scorecard', {
      loop_uuid: loopId,
      payload: scorecard.last_tri || {}
    });
    
    if (error) throw error;
  }

  async createTRIEvent(event: Partial<TRIEvent>): Promise<TRIEvent> {
    const { data, error } = await supabase
      .from('tri_events')
      .insert({
        loop_id: event.loop_id || '',
        task_id: event.task_id,
        t_value: event.t_value || 0,
        r_value: event.r_value || 0,
        i_value: event.i_value || 0,
        at: event.at || new Date().toISOString(),
        user_id: event.user_id || ''
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as TRIEvent;
  }

  async evaluateMandate(actor: string, leverage: string): Promise<string> {
    const { data, error } = await supabase.rpc('evaluate_mandate', {
      actor_name: actor,
      leverage_level: leverage
    });
    
    if (error) throw error;
    return data || 'restricted';
  }
}

// Mock Implementation for development
export class MockCapacityService implements CapacityAPIService {
  private tasks: EnhancedTask[] = [
    {
      id: '1',
      title: 'Supply Chain Optimization',
      description: 'Optimize supply chain for better efficiency',
      capacity: 'deliberative',
      loop_id: 'loop-1',
      type: 'structural',
      scale: 'macro',
      leverage: 'S',
      status: 'open',
      priority: 'high',
      user_id: 'user-1',
      payload: {}
    },
    {
      id: '2',
      title: 'Customer Response Analysis',
      description: 'Analyze customer feedback patterns',
      capacity: 'responsive',
      loop_id: 'loop-2',
      type: 'reactive',
      scale: 'micro',
      leverage: 'N',
      status: 'open',
      priority: 'medium',
      user_id: 'user-1',
      payload: {}
    }
  ];

  async getTaskById(id: string): Promise<EnhancedTask | null> {
    return this.tasks.find(t => t.id === id) || null;
  }

  async listTasksByCapacity(capacity: string): Promise<EnhancedTask[]> {
    return this.tasks.filter(t => t.capacity === capacity);
  }

  async updateTaskPayload(id: string, payload: any): Promise<void> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.payload = payload;
    }
  }

  async claimTask(id: string, assignee: string): Promise<void> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.assigned_to = assignee;
      task.status = 'claimed';
    }
  }

  async listLoops(): Promise<Loop[]> {
    return [
      {
        id: 'loop-1',
        name: 'Supply Chain Loop',
        loop_type: 'structural',
        scale: 'macro',
        leverage_default: 'S',
        metadata: {},
        user_id: 'user-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  async getLoop(id: string): Promise<Loop | null> {
    const loops = await this.listLoops();
    return loops.find(l => l.id === id) || null;
  }

  async createLoop(loop: Partial<Loop>): Promise<Loop> {
    const newLoop: Loop = {
      id: `loop-${Date.now()}`,
      name: loop.name || '',
      loop_type: loop.loop_type || 'reactive',
      scale: loop.scale || 'micro',
      leverage_default: loop.leverage_default || 'N',
      metadata: loop.metadata || {},
      user_id: loop.user_id || 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newLoop;
  }

  async listClaimsByActor(actor: string): Promise<Claim[]> {
    return [];
  }

  async createClaim(claim: Partial<Claim>): Promise<Claim> {
    return {
      id: `claim-${Date.now()}`,
      task_id: claim.task_id || '',
      loop_id: claim.loop_id || '',
      assignee: claim.assignee || '',
      raci: claim.raci || {},
      leverage: claim.leverage || 'N',
      mandate_status: claim.mandate_status || 'allowed',
      evidence: claim.evidence || {},
      status: claim.status || 'draft',
      user_id: claim.user_id || 'user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<void> {
    // Mock implementation
  }

  async listBandCrossings(loopId: string): Promise<BandCrossing[]> {
    return [];
  }

  async getScorecard(loopId: string): Promise<LoopScorecard | null> {
    return null;
  }

  async updateScorecard(loopId: string, scorecard: Partial<LoopScorecard>): Promise<void> {
    // Mock implementation
  }

  async createTRIEvent(event: Partial<TRIEvent>): Promise<TRIEvent> {
    return {
      id: `tri-${Date.now()}`,
      loop_id: event.loop_id || '',
      t_value: event.t_value || 0,
      r_value: event.r_value || 0,
      i_value: event.i_value || 0,
      at: new Date().toISOString(),
      user_id: event.user_id || 'user-1',
      created_at: new Date().toISOString()
    };
  }

  async evaluateMandate(actor: string, leverage: string): Promise<string> {
    return 'allowed'; // Mock always allows
  }
}

// Service factory
export const createCapacityService = (useSupabase: boolean = false): CapacityAPIService => {
  return useSupabase ? new SupabaseCapacityService() : new MockCapacityService();
};