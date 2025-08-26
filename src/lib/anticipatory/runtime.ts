// Anticipatory Runtime - Worker & Queue System
import { supabase } from '@/integrations/supabase/client';
import { TriggerEvaluator, type CompiledTrigger, type EvalResult } from './dsl';
import type { Database } from '@/integrations/supabase/types';

export interface TriggerJob {
  triggerId: string;
  priority: 'high' | 'normal' | 'low';
  scheduledFor: Date;
  retryCount: number;
  maxRetries: number;
}

export interface EvaluationContext {
  triggerId: string;
  compiled: CompiledTrigger;
  watchpointId: string;
  channelKey: string;
  loopId?: string;
  region?: string;
  cohort?: string;
}

// Data source implementation for trigger evaluation
export class SupabaseDataSource {
  
  async getIndicatorValue(key: string, at: Date): Promise<number | null> {
    try {
      const { data } = await supabase
        .from('normalized_observations')
        .select('value')
        .eq('indicator_key', key)
        .lte('ts', at.toISOString())
        .order('ts', { ascending: false })
        .limit(1)
        .single();
      
      return data?.value ?? null;
    } catch {
      return null;
    }
  }
  
  async getBandStatus(key: string, at: Date): Promise<'below' | 'in_band' | 'above' | null> {
    try {
      const { data } = await supabase
        .from('normalized_observations')
        .select('status')
        .eq('indicator_key', key)
        .lte('ts', at.toISOString())
        .order('ts', { ascending: false })
        .limit(1)
        .single();
      
      return data?.status as any ?? null;
    } catch {
      return null;
    }
  }
  
  async getSlope(key: string, days: number, at: Date): Promise<number | null> {
    try {
      const fromDate = new Date(at.getTime() - (days * 24 * 60 * 60 * 1000));
      
      const { data } = await supabase
        .from('normalized_observations')
        .select('value, ts')
        .eq('indicator_key', key)
        .gte('ts', fromDate.toISOString())
        .lte('ts', at.toISOString())
        .order('ts', { ascending: true });
      
      if (!data || data.length < 2) return null;
      
      // Simple linear regression slope
      const points = data.map((d, i) => ({ x: i, y: d.value }));
      const n = points.length;
      const sumX = points.reduce((sum, p) => sum + p.x, 0);
      const sumY = points.reduce((sum, p) => sum + p.y, 0);
      const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
      const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      return isFinite(slope) ? slope : null;
    } catch {
      return null;
    }
  }
  
  async getLastFiring(fingerprint: string): Promise<Date | null> {
    try {
      // Cast to any to avoid complex Supabase type inference
      const result: any = await (supabase as any)
        .from('antic_trigger_firings')
        .select('fired_at')
        .eq('matched_payload->fingerprint', fingerprint)
        .order('fired_at', { ascending: false })
        .limit(1)
        .single();
      
      return result.data ? new Date(result.data.fired_at) : null;
    } catch {
      return null;
    }
  }
}

// Runtime Worker for evaluating triggers
export class AnticipatoryWorker {
  private dataSource = new SupabaseDataSource();
  private isRunning = false;
  private intervalId?: NodeJS.Timeout;
  
  start(intervalMinutes: number = 15): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`🚀 Anticipatory Runtime Worker started (${intervalMinutes}m intervals)`);
    
    // Run immediately, then on interval
    this.runEvaluationCycle();
    this.intervalId = setInterval(() => {
      this.runEvaluationCycle();
    }, intervalMinutes * 60 * 1000);
  }
  
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('⏹️ Anticipatory Runtime Worker stopped');
  }
  
  private async runEvaluationCycle(): Promise<void> {
    console.log('🔄 Starting trigger evaluation cycle...');
    
    try {
      // Get all enabled triggers from existing tables
      const { data: triggers, error } = await supabase
        .from('antic_trigger_rules')
        .select(`
          id,
          name,
          expr_raw,
          expr_ast,
          window_hours,
          action_ref,
          authority,
          valid_from,
          expires_at,
          org_id
        `)
        .eq('org_id', await this.getCurrentUserId()) // Using auth.uid() equivalent
        .gte('expires_at', new Date().toISOString())
        .lte('valid_from', new Date().toISOString());
      
      if (error) {
        console.error('Failed to fetch triggers:', error);
        return;
      }
      
      console.log(`📋 Evaluating ${triggers?.length || 0} triggers`);
      
      if (!triggers || triggers.length === 0) return;
      
      // Evaluate each trigger
      for (const trigger of triggers) {
        await this.evaluateTrigger(trigger);
      }
      
      console.log('✅ Trigger evaluation cycle completed');
    } catch (error) {
      console.error('❌ Error in evaluation cycle:', error);
    }
  }
  
  private async evaluateTrigger(trigger: any): Promise<void> {
    try {
      console.log(`🎯 Evaluating trigger: ${trigger.name}`);
      
      // For existing triggers, create a compatible compiled trigger
      const compiled: CompiledTrigger = {
        ast: trigger.expr_ast || { 
          condition: { type: 'expr', expr: { type: 'indicator', indicator: 'default', operator: '>=', value: 1 } },
          persistence: 1,
          action: { type: 'start', templateKey: trigger.action_ref, capacity: 'responsive' },
          options: {}
        },
        resolvedIndicators: {},
        bandBounds: {},
        persistenceHours: trigger.window_hours || 24,
        cooldownSeconds: 86400, // 1 day default
        fingerprintRecipe: `${trigger.id}|${trigger.name}`,
        compiledAt: new Date().toISOString()
      };
      
      const now = new Date();
      const result = await TriggerEvaluator.evaluate(
        compiled,
        now,
        this.dataSource,
        0.1 // hysteresis
      );
      
      console.log(`📊 Trigger ${trigger.name} result:`, {
        shouldFire: result.shouldFire,
        conditionMet: result.summary.conditionMet,
        cooldown: result.summary.cooldownCheck
      });
      
      if (result.shouldFire) {
        await this.fireTrigger(trigger, result);
      }
      
    } catch (error) {
      console.error(`❌ Error evaluating trigger ${trigger.name}:`, error);
    }
  }
  
  private async fireTrigger(trigger: any, result: EvalResult): Promise<void> {
    console.log(`🔥 Firing trigger: ${trigger.name}`);
    
    try {
      // 1. Create trigger firing record
      const { data: firing, error: firingError } = await supabase
        .from('antic_trigger_firings')
        .insert({
          rule_id: trigger.id,
          org_id: trigger.org_id,
          fired_at: new Date().toISOString(),
          matched_payload: {
            fingerprint: result.dedupeFingerprint,
            summary: result.summary,
            action: trigger.action_ref,
            authority: trigger.authority
          }
        })
        .select()
        .single();
      
      if (firingError) {
        console.error('Failed to create firing record:', firingError);
        return;
      }
      
      console.log(`📝 Created firing record: ${firing?.id}`);
      
      // 2. Create activation event for the brain to process
      const { error: activationError } = await supabase
        .from('antic_activation_events')
        .insert({
          org_id: trigger.org_id,
          source: 'trigger_runtime',
          kind: 'trigger_fired',
          indicator: 'multiple',
          loop_code: 'AUTO',
          payload: {
            triggerId: trigger.id,
            triggerName: trigger.name,
            firingId: firing?.id,
            actionRef: trigger.action_ref,
            authority: trigger.authority,
            evidence: result.summary.evidence,
            earlyWarning: true,
            autoGenerated: true
          }
        });
      
      if (activationError) {
        console.error('Failed to create activation event:', activationError);
        return;
      }
      
      console.log(`🧠 Created activation event for brain processing`);
      
      // Note: Prepositions table not yet created, skipping for now
      console.log('📦 Prepositions staging skipped (table pending)');
      
    } catch (error) {
      console.error('❌ Error firing trigger:', error);
    }
  }
  
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'system';
  }
}

// Queue Manager for background jobs
export class TriggerQueueManager {
  private jobs: Map<string, TriggerJob> = new Map();
  
  scheduleEvaluation(triggerId: string, delay: number = 0): void {
    const job: TriggerJob = {
      triggerId,
      priority: 'normal',
      scheduledFor: new Date(Date.now() + delay),
      retryCount: 0,
      maxRetries: 3
    };
    
    this.jobs.set(triggerId, job);
    console.log(`⏰ Scheduled evaluation for trigger ${triggerId} at ${job.scheduledFor}`);
  }
  
  scheduleChannelEvaluation(channelKey: string): void {
    console.log(`📡 Scheduling evaluation for channel: ${channelKey}`);
    // Implementation would batch all triggers for a channel
  }
  
  getQueueStatus(): { pending: number; failed: number; nextRun?: Date } {
    const pending = Array.from(this.jobs.values()).filter(job => 
      job.scheduledFor > new Date() && job.retryCount < job.maxRetries
    ).length;
    
    const failed = Array.from(this.jobs.values()).filter(job => 
      job.retryCount >= job.maxRetries
    ).length;
    
    const nextJob = Array.from(this.jobs.values())
      .filter(job => job.scheduledFor > new Date())
      .sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime())[0];
    
    return {
      pending,
      failed,
      nextRun: nextJob?.scheduledFor
    };
  }
}

// Singleton instances
export const anticipatoryWorker = new AnticipatoryWorker();
export const triggerQueue = new TriggerQueueManager();