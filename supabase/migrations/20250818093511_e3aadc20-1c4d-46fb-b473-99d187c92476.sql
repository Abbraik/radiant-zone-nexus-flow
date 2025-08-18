-- Fix security issues with correct system catalog queries

-- Create a safe view for materialized view access  
-- Remove direct API access to materialized views by creating proper views with RLS

CREATE OR REPLACE VIEW public.safe_loop_metrics AS
SELECT 
  loop_id,
  loop_name,
  loop_status,
  latest_t_value,
  latest_r_value,
  latest_i_value,
  latest_tri_at,
  breach_count,
  last_breach_at,
  claim_velocity,
  fatigue_score,
  de_state,
  heartbeat_at,
  breach_days,
  tri_slope
FROM public.mv_loop_metrics
WHERE loop_id IN (
  SELECT id FROM public.loops WHERE user_id = auth.uid()
);

-- Enable security barrier on the safe view
ALTER VIEW public.safe_loop_metrics SET (security_barrier = true);

-- Update the get_reflexive_context function to use the safe view
CREATE OR REPLACE FUNCTION public.get_reflexive_context(loop_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  loop_data RECORD;
  scorecard_data RECORD;
  tri_series JSONB;
  breach_timeline JSONB;
  current_band JSONB;
  current_srt JSONB;
  suggestions JSONB;
BEGIN
  -- Get loop basic info with proper user validation
  SELECT * INTO loop_data 
  FROM public.loops 
  WHERE id = loop_uuid AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;

  -- Get scorecard from safe view instead of materialized view
  SELECT * INTO scorecard_data 
  FROM public.safe_loop_metrics 
  WHERE loop_id = loop_uuid;

  -- Get TRI series (last 90 days) with user validation
  SELECT jsonb_agg(
    jsonb_build_object(
      'at', at,
      't_value', t_value,
      'r_value', r_value,
      'i_value', i_value,
      'tag', tag
    ) ORDER BY at ASC
  ) INTO tri_series
  FROM (
    SELECT at, t_value, r_value, i_value, tag
    FROM public.tri_events
    WHERE loop_id = loop_uuid 
      AND user_id = auth.uid()
      AND at >= now() - interval '90 days'
    ORDER BY at DESC
    LIMIT 500
  ) recent_events;

  -- Get breach timeline with user validation
  SELECT jsonb_agg(
    jsonb_build_object(
      'at', at,
      'breach_type', breach_type,
      'value', value,
      'threshold_value', threshold_value,
      'severity_score', severity_score,
      'duration_minutes', duration_minutes
    ) ORDER BY at DESC
  ) INTO breach_timeline
  FROM public.breach_events
  WHERE loop_id = loop_uuid
    AND user_id = auth.uid()
    AND at >= now() - interval '90 days'
  ORDER BY at DESC
  LIMIT 100;

  -- Get current DE band with user validation
  SELECT jsonb_build_object(
    'id', id,
    'indicator', indicator,
    'lower_bound', lower_bound,
    'upper_bound', upper_bound,
    'asymmetry', asymmetry,
    'smoothing_alpha', smoothing_alpha,
    'notes', notes,
    'updated_at', updated_at
  ) INTO current_band
  FROM public.de_bands
  WHERE loop_id = loop_uuid
    AND user_id = auth.uid()
  ORDER BY updated_at DESC
  LIMIT 1;

  -- Get current SRT window with user validation
  SELECT jsonb_build_object(
    'id', id,
    'window_start', window_start,
    'window_end', window_end,
    'reflex_horizon', reflex_horizon,
    'cadence', cadence,
    'updated_at', updated_at
  ) INTO current_srt
  FROM public.srt_windows
  WHERE loop_id = loop_uuid
    AND user_id = auth.uid()
  ORDER BY updated_at DESC
  LIMIT 1;

  -- Get active suggestions with user validation
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', id,
      'suggestion_type', suggestion_type,
      'title', title,
      'description', description,
      'rationale', rationale,
      'risk_score', risk_score,
      'confidence', confidence,
      'proposed_changes', proposed_changes,
      'impact_level', impact_level,
      'created_at', created_at
    ) ORDER BY confidence DESC, risk_score ASC
  ) INTO suggestions
  FROM public.retune_suggestions
  WHERE loop_id = loop_uuid 
    AND user_id = auth.uid()
    AND status = 'pending'
    AND created_at >= now() - interval '7 days'
  LIMIT 10;

  RETURN jsonb_build_object(
    'loop', row_to_json(loop_data),
    'scorecard', COALESCE(row_to_json(scorecard_data), '{}'),
    'tri_series', COALESCE(tri_series, '[]'),
    'breach_timeline', COALESCE(breach_timeline, '[]'),
    'current_band', COALESCE(current_band, '{}'),
    'current_srt', COALESCE(current_srt, '{}'),
    'suggestions', COALESCE(suggestions, '[]')
  );
END;
$function$;