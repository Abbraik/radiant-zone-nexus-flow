-- Fix the migration by using correct enum values
-- First, let's extend loop_scorecards table with new columns
ALTER TABLE public.loop_scorecards 
ADD COLUMN IF NOT EXISTS breach_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tri_slope NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS heartbeat_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create reflex_memory table for tracking redesign snapshots
CREATE TABLE IF NOT EXISTS public.reflex_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id UUID NOT NULL,
  before JSONB DEFAULT '{}',
  after JSONB DEFAULT '{}',
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS on reflex_memory
ALTER TABLE public.reflex_memory ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for reflex_memory
CREATE POLICY "Users can manage their reflex memory" ON public.reflex_memory
  FOR ALL USING (auth.uid() = user_id);

-- Create materialized view for loop metrics
DROP MATERIALIZED VIEW IF EXISTS public.mv_loop_metrics;
CREATE MATERIALIZED VIEW public.mv_loop_metrics AS
SELECT 
  l.id as loop_id,
  l.name as loop_name,
  l.status as loop_status,
  -- Latest TRI values
  COALESCE(latest_tri.t_value, 0) as latest_t_value,
  COALESCE(latest_tri.r_value, 0) as latest_r_value,
  COALESCE(latest_tri.i_value, 0) as latest_i_value,
  latest_tri.at as latest_tri_at,
  -- Breach information
  COALESCE(breach_info.breach_count, 0) as breach_count,
  breach_info.last_breach_at,
  -- Claim velocity (approved claims per week) - using 'approved' instead of 'completed'
  COALESCE(claim_velocity.velocity, 0) as claim_velocity,
  -- Task fatigue (consecutive active sprints)
  COALESCE(task_fatigue.fatigue_score, 0) as fatigue_score,
  -- DE state from scorecard
  COALESCE(sc.de_state, 'stable') as de_state,
  -- Last heartbeat
  sc.heartbeat_at,
  sc.breach_days,
  sc.tri_slope
FROM public.loops l
LEFT JOIN (
  -- Latest TRI event per loop
  SELECT DISTINCT ON (loop_id) 
    loop_id, t_value, r_value, i_value, at
  FROM public.tri_events
  ORDER BY loop_id, at DESC
) latest_tri ON l.id = latest_tri.loop_id
LEFT JOIN (
  -- Breach count and last breach in past 30 days
  SELECT 
    loop_id,
    COUNT(*) as breach_count,
    MAX(at) as last_breach_at
  FROM public.band_crossings
  WHERE at >= now() - interval '30 days'
  GROUP BY loop_id
) breach_info ON l.id = breach_info.loop_id
LEFT JOIN (
  -- Claim velocity (approved claims per week)
  SELECT 
    loop_id,
    COUNT(*) FILTER (WHERE status = 'approved' AND updated_at >= now() - interval '7 days') as velocity
  FROM public.claims
  GROUP BY loop_id
) claim_velocity ON l.id = claim_velocity.loop_id
LEFT JOIN (
  -- Task fatigue from consecutive sprints
  SELECT 
    t.loop_id,
    COUNT(DISTINCT s.id) as fatigue_score
  FROM public.tasks t
  JOIN public.sprints s ON t.sprint_id = s.id
  WHERE s.status = 'active' 
    AND s.start_date <= now()
    AND (s.end_date IS NULL OR s.end_date >= now())
  GROUP BY t.loop_id
) task_fatigue ON l.id = task_fatigue.loop_id
LEFT JOIN public.loop_scorecards sc ON l.id = sc.loop_id
WHERE l.status = 'published';

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_mv_loop_metrics_loop_id ON public.mv_loop_metrics (loop_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tri_events_loop_id_at_desc ON public.tri_events (loop_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_band_crossings_loop_id_at_desc ON public.band_crossings (loop_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_claims_loop_id_status ON public.claims (loop_id, status);

-- Create RPC function to get scorecard with sparkline
CREATE OR REPLACE FUNCTION public.get_scorecard(loop_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  scorecard_data RECORD;
  sparkline_data JSONB;
BEGIN
  -- Get scorecard data from materialized view
  SELECT * INTO scorecard_data
  FROM public.mv_loop_metrics
  WHERE loop_id = loop_uuid;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found');
  END IF;
  
  -- Get TRI sparkline (last 20 events)
  SELECT jsonb_agg(
    jsonb_build_object(
      'at', at,
      't_value', t_value,
      'r_value', r_value,
      'i_value', i_value
    ) ORDER BY at ASC
  ) INTO sparkline_data
  FROM (
    SELECT at, t_value, r_value, i_value
    FROM public.tri_events
    WHERE loop_id = loop_uuid
    ORDER BY at DESC
    LIMIT 20
  ) recent_events;
  
  RETURN jsonb_build_object(
    'loop_id', scorecard_data.loop_id,
    'loop_name', scorecard_data.loop_name,
    'loop_status', scorecard_data.loop_status,
    'latest_tri', jsonb_build_object(
      't_value', scorecard_data.latest_t_value,
      'r_value', scorecard_data.latest_r_value,
      'i_value', scorecard_data.latest_i_value,
      'at', scorecard_data.latest_tri_at
    ),
    'breach_count', scorecard_data.breach_count,
    'last_breach_at', scorecard_data.last_breach_at,
    'claim_velocity', scorecard_data.claim_velocity,
    'fatigue_score', scorecard_data.fatigue_score,
    'de_state', scorecard_data.de_state,
    'heartbeat_at', scorecard_data.heartbeat_at,
    'breach_days', scorecard_data.breach_days,
    'tri_slope', scorecard_data.tri_slope,
    'sparkline', COALESCE(sparkline_data, '[]')
  );
END;
$$;