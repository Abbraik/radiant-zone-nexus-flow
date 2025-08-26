// Capacity Brain Client - API interface for activation decisions and overrides
import { supabase } from '@/integrations/supabase/client';
import type { 
  ActivationInput, 
  ActivationDecision, 
  ActivationEvent,
  ActivationOverride,
  TaskFingerprint,
  TaskCreationResult,
  OverrideFormData
} from './types';

export class CapacityBrainClient {
  // Get activation input data for a loop
  async getActivationInput(loopId: string, window = '14d'): Promise<ActivationInput> {
    // Get loop signal scores
    const { data: scores, error: scoresError } = await supabase
      .from('loop_signal_scores')
      .select('*')
      .eq('loop_id', loopId)
      .eq('time_window', window)
      .order('as_of', { ascending: false })
      .limit(1)
      .single();

    if (scoresError) throw scoresError;

    // Get action readiness
    const { data: readiness, error: readinessError } = await supabase
      .from('loop_action_readiness')
      .select('*')
      .eq('loop_id', loopId)
      .single();

    if (readinessError) throw readinessError;

    // Get recent actions for hints - using basic task fields
    const { data: recentTasks } = await supabase
      .from('tasks_5c')
      .select('capacity, created_at, status')
      .eq('loop_id', loopId)
      .in('status', ['active', 'done'])
      .order('created_at', { ascending: false })
      .limit(5);

    // Get indicators for the loop
    const { data: indicators } = await supabase
      .from('normalized_observations')
      .select('indicator_key, status, band_pos, value_smoothed')
      .eq('loop_id', loopId)
      .order('ts', { ascending: false })
      .limit(10);

    // Build hints from recent activity
    const now = new Date();
    const recentAction = recentTasks?.[0] ? {
      capacity: (recentTasks[0].capacity || 'responsive') as any,
      withinDays: Math.floor((now.getTime() - new Date(recentTasks[0].created_at).getTime()) / (1000 * 60 * 60 * 24)),
      reviewDue: false // Simplified for now
    } : undefined;

    // Check for recurrence flag (simplified - 2+ breaches in last 3 windows)
    const breachCount = indicators?.filter(i => i.status !== 'in_band').length || 0;
    const recurrenceFlag = breachCount >= 2;

    // Check fairness risk (high dispersion)
    const fairnessRisk = (scores?.dispersion || 0) > 0.7;

    // TODO: Check early warning from watchpoints/triggers
    const earlyWarning = false;

    return {
      now: now.toISOString(),
      scores: {
        loopId,
        window: window as any,
        asOf: scores?.as_of || now.toISOString(),
        severity: scores?.severity || 0,
        persistence: scores?.persistence || 0,
        dispersion: scores?.dispersion || 0,
        hubLoad: scores?.hub_load || 0,
        legitimacyDelta: scores?.legitimacy_delta || 0,
        indicators: indicators?.map(i => ({
          key: i.indicator_key,
          status: i.status as 'below' | 'in_band' | 'above',
          bandPos: i.band_pos,
          smoothed: i.value_smoothed
        })) || []
      },
      readiness: {
        autoOk: readiness?.auto_ok || false,
        reasons: readiness?.reasons || []
      },
      hints: {
        recentAction,
        earlyWarning,
        fairnessRisk,
        recurrenceFlag
      }
    };
  }

  // Create activation decision and store event
  async activate(input: ActivationInput): Promise<{ decision: ActivationDecision; event: ActivationEvent }> {
    const response = await supabase.functions.invoke('capacity-brain-activate', {
      body: input
    });

    if (response.error) {
      throw new Error(`Activation failed: ${response.error.message}`);
    }

    return response.data;
  }

  // Create override decision
  async override(eventId: string, overrideData: OverrideFormData): Promise<ActivationDecision> {
    const response = await supabase.functions.invoke('capacity-brain-override', {
      body: {
        eventId,
        ...overrideData
      }
    });

    if (response.error) {
      throw new Error(`Override failed: ${response.error.message}`);
    }

    return response.data;
  }

  // Create task from decision (with deduplication)
  async createTask(decision: ActivationDecision): Promise<TaskCreationResult> {
    // Check if task already exists for this fingerprint
    const { data: existing } = await supabase
      .from('task_fingerprints')
      .select('task_id')
      .eq('fp', decision.fingerprint)
      .single();

    if (existing) {
      return {
        task_id: existing.task_id,
        fingerprint: decision.fingerprint,
        is_existing: true,
        route: decision.openRoute,
        template: decision.preselectTemplate
      };
    }

    // Create new task
    const response = await supabase.functions.invoke('capacity-brain-create-task', {
      body: decision
    });

    if (response.error) {
      throw new Error(`Task creation failed: ${response.error.message}`);
    }

    return response.data;
  }

  // Get activation events for a loop
  async getActivationHistory(loopId: string, limit = 10): Promise<ActivationEvent[]> {
    const { data, error } = await supabase
      .from('activation_events')
      .select('*')
      .eq('loop_id', loopId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).map(event => ({
      ...event,
      decision: event.decision as unknown as ActivationDecision
    }));
  }

  // Get overrides for an event
  async getOverrides(eventId: string): Promise<ActivationOverride[]> {
    const { data, error } = await supabase
      .from('activation_overrides')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(override => ({
      ...override,
      before: override.before as unknown as ActivationDecision,
      after: override.after as unknown as ActivationDecision
    }));
  }

  // Check if fingerprint exists (for UI feedback)
  async checkFingerprint(fingerprint: string): Promise<TaskFingerprint | null> {
    const { data, error } = await supabase
      .from('task_fingerprints')
      .select('*')
      .eq('fp', fingerprint)
      .single();

    if (error) return null;
    return data;
  }
}

// Singleton instance
export const capacityBrainClient = new CapacityBrainClient();