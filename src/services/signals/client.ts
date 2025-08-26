// Signals Layer Client Service
// Main interface for signals data operations

import { supabase } from '@/integrations/supabase/client';
import { 
  LoopSignalSummary, 
  IndicatorSeries, 
  DQStatus, 
  IngestionRun,
  SourceRegistry,
  IndicatorRegistry,
  TimeWindow,
  PushPayload 
} from './types';

export class SignalsClient {
  /**
   * Get loop signal summary with scores and indicator statuses
   */
  async getLoopSummary(
    loopId: string, 
    window: TimeWindow = '14d'
  ): Promise<LoopSignalSummary | null> {
    try {
      // Get loop signal scores
      const { data: scores } = await supabase
        .from('loop_signal_scores')
        .select('*')
        .eq('loop_id', loopId)
        .eq('time_window', window)
        .order('as_of', { ascending: false })
        .limit(1)
        .single();

      if (!scores) {
        return null;
      }

      // Get loop info
      const { data: loop } = await supabase
        .from('loops')
        .select('name')
        .eq('id', loopId)
        .single();

      // Get indicator statuses
      const { data: indicators } = await supabase
        .from('indicator_registry')
        .select(`
          indicator_key,
          title,
          unit,
          normalized_observations!inner(
            value,
            ts,
            status,
            band_pos,
            severity
          )
        `)
        .eq('loop_id', loopId);

      // Get action readiness
      const { data: readiness } = await supabase
        .from('loop_action_readiness')
        .select('auto_ok, reasons')
        .eq('loop_id', loopId)
        .single();

      // Process indicators to get latest status and trends
      const indicatorStatuses = indicators?.map(indicator => {
        const obs = indicator.normalized_observations;
        const latest = obs[obs.length - 1];
        
        // Simple trend analysis on last few points
        const recentObs = obs.slice(-5);
        const trend = this.calculateTrend(recentObs.map(o => o.value));

        return {
          indicator_key: indicator.indicator_key,
          title: indicator.title,
          unit: indicator.unit,
          latest_value: latest?.value || 0,
          latest_ts: latest?.ts || '',
          status: (latest?.status as any) || 'in_band',
          band_pos: latest?.band_pos || 0,
          severity: latest?.severity || 0,
          trend,
        };
      }) || [];

      return {
        loop_id: loopId,
        loop_name: loop?.name || 'Unknown Loop',
        window,
        as_of: scores.as_of,
        scores: {
          severity: scores.severity,
          persistence: scores.persistence,
          dispersion: scores.dispersion,
          hub_load: scores.hub_load,
          legitimacy_delta: scores.legitimacy_delta,
        },
        indicators: indicatorStatuses,
        action_readiness: {
          auto_ok: readiness?.auto_ok || true,
          reasons: readiness?.reasons || [],
        },
      };
    } catch (error) {
      console.error('Failed to get loop summary:', error);
      return null;
    }
  }

  /**
   * Get indicator time series data
   */
  async getIndicatorSeries(
    indicatorKey: string,
    from?: string,
    to?: string
  ): Promise<IndicatorSeries | null> {
    try {
      const query = supabase
        .from('normalized_observations')
        .select('ts, value, value_smoothed, band_pos, status')
        .eq('indicator_key', indicatorKey)
        .order('ts', { ascending: true });

      if (from) query.gte('ts', from);
      if (to) query.lte('ts', to);

      const { data: observations } = await query;

      // Get indicator metadata
      const { data: indicator } = await supabase
        .from('indicator_registry')
        .select('title, unit, loop_id')
        .eq('indicator_key', indicatorKey)
        .single();

      // Get band configuration
      const { data: band } = await supabase
        .from('de_bands')
        .select('lower_bound, upper_bound, asymmetry')
        .eq('loop_id', indicator?.loop_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!indicator || !observations) {
        return null;
      }

      return {
        indicator_key: indicatorKey,
        title: indicator.title,
        unit: indicator.unit,
        data_points: observations.map(obs => ({
          ts: obs.ts,
          value: obs.value,
          value_smoothed: obs.value_smoothed,
          band_pos: obs.band_pos,
          status: obs.status as any,
        })),
        band_config: {
          lower_bound: band?.lower_bound,
          upper_bound: band?.upper_bound,
          asymmetry: band?.asymmetry || 0,
        },
      };
    } catch (error) {
      console.error('Failed to get indicator series:', error);
      return null;
    }
  }

  /**
   * Get data quality status
   */
  async getDQStatus(
    sourceId?: string,
    indicatorKey?: string
  ): Promise<DQStatus[]> {
    try {
      let query = supabase
        .from('dq_status')
        .select('*')
        .order('as_of', { ascending: false });

      if (sourceId) query = query.eq('source_id', sourceId);
      if (indicatorKey) query = query.eq('indicator_key', indicatorKey);

      const { data } = await query;
      return (data as DQStatus[]) || [];
    } catch (error) {
      console.error('Failed to get DQ status:', error);
      return [];
    }
  }

  /**
   * Get recent ingestion runs
   */
  async getIngestionRuns(sourceId?: string): Promise<IngestionRun[]> {
    try {
      let query = supabase
        .from('ingestion_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (sourceId) query = query.eq('source_id', sourceId);

      const { data } = await query;
      return (data as IngestionRun[]) || [];
    } catch (error) {
      console.error('Failed to get ingestion runs:', error);
      return [];
    }
  }

  /**
   * Get source registry
   */
  async getSources(): Promise<SourceRegistry[]> {
    try {
      const { data } = await supabase
        .from('source_registry')
        .select('*')
        .order('name');

      return (data as SourceRegistry[]) || [];
    } catch (error) {
      console.error('Failed to get sources:', error);
      return [];
    }
  }

  /**
   * Get indicator registry for a loop
   */
  async getIndicators(loopId?: string): Promise<IndicatorRegistry[]> {
    try {
      let query = supabase
        .from('indicator_registry')
        .select('*')
        .order('title');

      if (loopId) query = query.eq('loop_id', loopId);

      const { data } = await query;
      return (data as IndicatorRegistry[]) || [];
    } catch (error) {
      console.error('Failed to get indicators:', error);
      return [];
    }
  }

  /**
   * Push signal data (for real-time feeds)
   */
  async pushSignalData(payload: PushPayload): Promise<{
    success: boolean;
    processed: number;
    errors: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('signals-push', {
        body: payload,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Failed to push signal data:', error);
      return {
        success: false,
        processed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Seed signals golden paths (call when user is authenticated)
   */
  async seedGoldenPaths(): Promise<{
    success: boolean;
    sources_created?: number;
    indicators_created?: number;
    observations_created?: number;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('seed_signals_golden_paths');

      if (error) throw error;

      return data as {
        success: boolean;
        sources_created?: number;
        indicators_created?: number;
        observations_created?: number;
        error?: string;
      };
    } catch (error) {
      console.error('Failed to seed golden paths:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Process raw observation through normalization pipeline
   */
  async processRawObservation(obsId: string): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('process_raw_observation', {
        p_obs_id: obsId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to process raw observation:', error);
      throw error;
    }
  }

  /**
   * Helper method to calculate simple trend
   */
  private calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const first = values[0];
    const last = values[values.length - 1];
    const change = (last - first) / first;
    
    if (Math.abs(change) < 0.05) return 'stable'; // 5% threshold
    return change > 0 ? 'up' : 'down';
  }
}

// Export singleton instance
export const signalsClient = new SignalsClient();