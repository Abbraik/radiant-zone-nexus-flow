-- Signals Layer Database Schema
-- Phase 1: Core tables for signal ingestion, normalization, and quality monitoring

-- Source registry for different data feeds
CREATE TABLE IF NOT EXISTS public.source_registry (
    source_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('pull', 'push', 'file')),
    provider text NOT NULL,
    schedule_cron text,
    schema_version integer NOT NULL DEFAULT 1,
    enabled boolean NOT NULL DEFAULT true,
    config jsonb NOT NULL DEFAULT '{}',
    pii_class text NOT NULL DEFAULT 'none',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Indicator registry linking to loops
CREATE TABLE IF NOT EXISTS public.indicator_registry (
    indicator_key text PRIMARY KEY,
    loop_id uuid REFERENCES public.loops(id) ON DELETE CASCADE,
    title text NOT NULL,
    unit text NOT NULL,
    transform text,
    triad_tag text CHECK (triad_tag IN ('population', 'domain', 'institution')),
    snl_key text,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Raw observations from all sources
CREATE TABLE IF NOT EXISTS public.raw_observations (
    obs_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES public.source_registry(source_id) ON DELETE CASCADE,
    indicator_key text NOT NULL REFERENCES public.indicator_registry(indicator_key) ON DELETE CASCADE,
    ts timestamp with time zone NOT NULL,
    value numeric NOT NULL,
    unit text NOT NULL,
    meta jsonb NOT NULL DEFAULT '{}',
    hash text UNIQUE NOT NULL, -- sha256(source_id|indicator|ts|value) for idempotency
    ingested_at timestamp with time zone NOT NULL DEFAULT now(),
    schema_version integer NOT NULL DEFAULT 1,
    user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Normalized observations with band-aware scoring
CREATE TABLE IF NOT EXISTS public.normalized_observations (
    norm_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_key text NOT NULL REFERENCES public.indicator_registry(indicator_key) ON DELETE CASCADE,
    loop_id uuid NOT NULL REFERENCES public.loops(id) ON DELETE CASCADE,
    ts timestamp with time zone NOT NULL,
    value numeric NOT NULL,
    value_smoothed numeric NOT NULL,
    band_pos numeric NOT NULL, -- continuous position: 0=center, ±1=edges, >1=outside
    status text NOT NULL CHECK (status IN ('below', 'in_band', 'above')),
    severity numeric NOT NULL DEFAULT 0,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Loop-level signal aggregates for Capacity Brain
CREATE TABLE IF NOT EXISTS public.loop_signal_scores (
    loop_id uuid NOT NULL REFERENCES public.loops(id) ON DELETE CASCADE,
    window text NOT NULL, -- '14d', '28d', etc.
    as_of timestamp with time zone NOT NULL,
    severity numeric NOT NULL DEFAULT 0, -- mean |band_pos| clipped to [0,2]
    persistence numeric NOT NULL DEFAULT 0, -- share of days outside band
    dispersion numeric NOT NULL DEFAULT 0, -- proportion of indicators outside band
    hub_load numeric NOT NULL DEFAULT 0, -- weighted avg of hub indicators
    legitimacy_delta numeric NOT NULL DEFAULT 0, -- trust vs service divergence
    details jsonb NOT NULL DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    PRIMARY KEY (loop_id, window, as_of)
);

-- Data quality status per source/indicator
CREATE TABLE IF NOT EXISTS public.dq_status (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES public.source_registry(source_id) ON DELETE CASCADE,
    indicator_key text NOT NULL REFERENCES public.indicator_registry(indicator_key) ON DELETE CASCADE,
    as_of timestamp with time zone NOT NULL,
    missingness numeric NOT NULL DEFAULT 0,
    staleness_seconds integer NOT NULL DEFAULT 0,
    schema_drift boolean NOT NULL DEFAULT false,
    outlier_rate numeric NOT NULL DEFAULT 0,
    quality text NOT NULL CHECK (quality IN ('good', 'warn', 'bad')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    UNIQUE(source_id, indicator_key, as_of)
);

-- Data quality events for tracking issues
CREATE TABLE IF NOT EXISTS public.dq_events (
    event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES public.source_registry(source_id) ON DELETE CASCADE,
    indicator_key text REFERENCES public.indicator_registry(indicator_key) ON DELETE CASCADE,
    ts timestamp with time zone NOT NULL,
    kind text NOT NULL CHECK (kind IN ('missing', 'stale', 'drift', 'outlier', 'unit_mismatch')),
    detail jsonb NOT NULL DEFAULT '{}',
    severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Ingestion run tracking
CREATE TABLE IF NOT EXISTS public.ingestion_runs (
    run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id uuid NOT NULL REFERENCES public.source_registry(source_id) ON DELETE CASCADE,
    started_at timestamp with time zone NOT NULL DEFAULT now(),
    finished_at timestamp with time zone,
    rows_in integer NOT NULL DEFAULT 0,
    rows_kept integer NOT NULL DEFAULT 0,
    lag_seconds integer NOT NULL DEFAULT 0,
    status text NOT NULL CHECK (status IN ('running', 'ok', 'warn', 'fail')),
    message text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT auth.uid()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_raw_obs_indicator_ts ON public.raw_observations(indicator_key, ts);
CREATE INDEX IF NOT EXISTS idx_raw_obs_hash ON public.raw_observations(hash);
CREATE INDEX IF NOT EXISTS idx_norm_obs_loop_indicator_ts ON public.normalized_observations(loop_id, indicator_key, ts);
CREATE INDEX IF NOT EXISTS idx_signal_scores_loop_window ON public.loop_signal_scores(loop_id, window);
CREATE INDEX IF NOT EXISTS idx_dq_status_source_indicator ON public.dq_status(source_id, indicator_key);
CREATE INDEX IF NOT EXISTS idx_dq_events_ts ON public.dq_events(ts);
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_source ON public.ingestion_runs(source_id, started_at);

-- Enable RLS
ALTER TABLE public.source_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicator_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.normalized_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loop_signal_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dq_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Select for authenticated users, insert/update for service role or owner
CREATE POLICY "Users can read their signals data" ON public.source_registry FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their signals data" ON public.source_registry FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their indicators" ON public.indicator_registry FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their indicators" ON public.indicator_registry FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their observations" ON public.raw_observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their observations" ON public.raw_observations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their normalized data" ON public.normalized_observations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their normalized data" ON public.normalized_observations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their signal scores" ON public.loop_signal_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their signal scores" ON public.loop_signal_scores FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their dq status" ON public.dq_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their dq status" ON public.dq_status FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their dq events" ON public.dq_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their dq events" ON public.dq_events FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can read their ingestion runs" ON public.ingestion_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their ingestion runs" ON public.ingestion_runs FOR ALL USING (auth.uid() = user_id);

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_source_registry_updated_at BEFORE UPDATE ON public.source_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indicator_registry_updated_at BEFORE UPDATE ON public.indicator_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();