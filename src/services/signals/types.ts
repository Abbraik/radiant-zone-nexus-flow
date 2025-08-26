// Signals Layer TypeScript Types
// Shared types for the signals processing system

export interface SourceRegistry {
  source_id: string;
  name: string;
  type: 'pull' | 'push' | 'file';
  provider: string;
  schedule_cron?: string;
  schema_version: number;
  enabled: boolean;
  config: Record<string, any>;
  pii_class: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface IndicatorRegistry {
  indicator_key: string;
  loop_id: string;
  title: string;
  unit: string;
  transform?: string;
  triad_tag?: 'population' | 'domain' | 'institution';
  snl_key?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface RawObservation {
  obs_id: string;
  source_id: string;
  indicator_key: string;
  ts: string;
  value: number;
  unit: string;
  meta: Record<string, any>;
  hash: string;
  ingested_at: string;
  schema_version: number;
  user_id: string;
}

export interface NormalizedObservation {
  norm_id: string;
  indicator_key: string;
  loop_id: string;
  ts: string;
  value: number;
  value_smoothed: number;
  band_pos: number; // 0=center, ±1=edges, >1=outside
  status: 'below' | 'in_band' | 'above';
  severity: number;
  notes?: string;
  created_at: string;
  user_id: string;
}

export interface LoopSignalScores {
  loop_id: string;
  time_window: string;
  as_of: string;
  severity: number; // mean |band_pos| clipped to [0,2]
  persistence: number; // share of days outside band
  dispersion: number; // proportion of indicators outside band
  hub_load: number; // weighted avg of hub indicators
  legitimacy_delta: number; // trust vs service divergence
  details: Record<string, any>;
  created_at: string;
  user_id: string;
}

export interface DQStatus {
  id: string;
  source_id: string;
  indicator_key: string;
  as_of: string;
  missingness: number;
  staleness_seconds: number;
  schema_drift: boolean;
  outlier_rate: number;
  quality: 'good' | 'warn' | 'bad';
  created_at: string;
  user_id: string;
}

export interface DQEvent {
  event_id: string;
  source_id: string;
  indicator_key?: string;
  ts: string;
  kind: 'missing' | 'stale' | 'drift' | 'outlier' | 'unit_mismatch';
  detail: Record<string, any>;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  user_id: string;
}

export interface IngestionRun {
  run_id: string;
  source_id: string;
  started_at: string;
  finished_at?: string;
  rows_in: number;
  rows_kept: number;
  lag_seconds: number;
  status: 'running' | 'ok' | 'warn' | 'fail';
  message?: string;
  created_at: string;
  user_id: string;
}

// API Response Types
export interface LoopSignalSummary {
  loop_id: string;
  loop_name: string;
  window: string;
  as_of: string;
  scores: {
    severity: number;
    persistence: number;
    dispersion: number;
    hub_load: number;
    legitimacy_delta: number;
  };
  indicators: IndicatorStatus[];
  action_readiness: {
    auto_ok: boolean;
    reasons: string[];
  };
}

export interface IndicatorStatus {
  indicator_key: string;
  title: string;
  unit: string;
  latest_value: number;
  latest_ts: string;
  status: 'below' | 'in_band' | 'above';
  band_pos: number;
  severity: number;
  trend: 'up' | 'down' | 'stable';
}

export interface IndicatorSeries {
  indicator_key: string;
  title: string;
  unit: string;
  data_points: Array<{
    ts: string;
    value: number;
    value_smoothed: number;
    band_pos: number;
    status: 'below' | 'in_band' | 'above';
  }>;
  band_config: {
    lower_bound?: number;
    upper_bound?: number;
    asymmetry: number;
  };
}

// Normalization Processing Types
export interface BandResult {
  status: 'below' | 'in_band' | 'above';
  band_pos: number;
}

export interface SignalProcessingOptions {
  alpha?: number; // EWMA smoothing factor
  window_days?: number; // Rolling window for score computation
  force_reprocess?: boolean;
}

// Source Adapter Interface
export interface SourceAdapter {
  source_id: string;
  fetchSince(since: Date): Promise<RawRow[]>;
  map(row: RawRow): {
    indicator_key: string;
    ts: string;
    value: number;
    unit: string;
    meta: Record<string, any>;
  };
}

export interface RawRow {
  [key: string]: any;
}

// Push endpoint payload
export interface PushPayload {
  source_id: string;
  signature?: string;
  timestamp: string;
  observations: Array<{
    indicator_key: string;
    ts: string;
    value: number;
    unit: string;
    meta?: Record<string, any>;
  }>;
}

// Data Quality Configuration
export interface DQThresholds {
  staleness_warning_hours: number;
  staleness_error_hours: number;
  missingness_warning: number;
  missingness_error: number;
  outlier_threshold_sigma: number;
}

export const DEFAULT_DQ_THRESHOLDS: DQThresholds = {
  staleness_warning_hours: 6,
  staleness_error_hours: 24,
  missingness_warning: 0.1,
  missingness_error: 0.3,
  outlier_threshold_sigma: 3,
};

// Utility types
export type TimeWindow = '7d' | '14d' | '28d' | '30d';
export type SignalSeverity = 'low' | 'medium' | 'high';
export type QualityLevel = 'good' | 'warn' | 'bad';