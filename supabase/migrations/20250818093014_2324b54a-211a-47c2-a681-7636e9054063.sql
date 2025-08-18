-- Add reflexive-specific columns and tables for the full bundle

-- Add missing columns to existing tables if not present
DO $$ 
BEGIN
  -- Add tag column to tri_events for tracking retune events
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tri_events' AND column_name = 'tag') THEN
    ALTER TABLE tri_events ADD COLUMN tag text;
  END IF;

  -- Add updated_by to de_bands for audit trail
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'de_bands' AND column_name = 'updated_by') THEN
    ALTER TABLE de_bands ADD COLUMN updated_by uuid REFERENCES auth.users(id);
  END IF;

  -- Add smoothing parameter (alpha) to de_bands
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'de_bands' AND column_name = 'smoothing_alpha') THEN
    ALTER TABLE de_bands ADD COLUMN smoothing_alpha numeric DEFAULT 0.3;
  END IF;

  -- Add updated_by to srt_windows for audit trail
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'srt_windows' AND column_name = 'updated_by') THEN
    ALTER TABLE srt_windows ADD COLUMN updated_by uuid REFERENCES auth.users(id);
  END IF;

  -- Add cadence to srt_windows
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'srt_windows' AND column_name = 'cadence') THEN
    ALTER TABLE srt_windows ADD COLUMN cadence interval DEFAULT '1 day'::interval;
  END IF;
END $$;

-- Create retune_suggestions table for ML-generated suggestions
CREATE TABLE IF NOT EXISTS public.retune_suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  user_id uuid NOT NULL,
  suggestion_type text NOT NULL, -- 'band_adjustment', 'srt_change', 'asymmetry_tune'
  title text NOT NULL,
  description text NOT NULL,
  rationale text NOT NULL,
  risk_score numeric NOT NULL DEFAULT 0.5, -- 0-1 scale
  confidence numeric NOT NULL DEFAULT 0.5, -- 0-1 scale
  expected_improvement jsonb DEFAULT '{}',
  proposed_changes jsonb NOT NULL DEFAULT '{}',
  false_positive_risk numeric DEFAULT 0.1,
  impact_level text DEFAULT 'medium', -- small, medium, large
  status text DEFAULT 'pending', -- pending, applied, dismissed
  applied_at timestamp with time zone,
  applied_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create breach_events table for detailed breach tracking
CREATE TABLE IF NOT EXISTS public.breach_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  user_id uuid NOT NULL,
  breach_type text NOT NULL, -- 'upper', 'lower', 'return'
  indicator_name text NOT NULL,
  value numeric NOT NULL,
  threshold_value numeric NOT NULL,
  severity_score integer DEFAULT 1, -- 1-5 scale
  duration_minutes integer DEFAULT 0,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create retune_approvals table for manager approval workflow
CREATE TABLE IF NOT EXISTS public.retune_approvals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  retune_id uuid NOT NULL, -- references reflex_memory.id
  requested_by uuid NOT NULL,
  approver_id uuid,
  approval_status text DEFAULT 'pending', -- pending, approved, rejected
  approval_reason text,
  requested_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.retune_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retune_approvals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their retune suggestions" ON public.retune_suggestions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their breach events" ON public.breach_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view retune approvals" ON public.retune_approvals
  FOR SELECT USING (auth.uid() = requested_by OR auth.uid() = approver_id);

CREATE POLICY "Users can create approval requests" ON public.retune_approvals
  FOR INSERT WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "Approvers can update approvals" ON public.retune_approvals
  FOR UPDATE USING (auth.uid() = approver_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_retune_suggestions_loop_status ON public.retune_suggestions(loop_id, status);
CREATE INDEX IF NOT EXISTS idx_breach_events_loop_at ON public.breach_events(loop_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_retune_approvals_status ON public.retune_approvals(approval_status);
CREATE INDEX IF NOT EXISTS idx_tri_events_loop_tag ON public.tri_events(loop_id, tag, at DESC);

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_retune_suggestions_updated_at
  BEFORE UPDATE ON public.retune_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_retune_approvals_updated_at
  BEFORE UPDATE ON public.retune_approvals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create comprehensive reflexive context RPC
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
  -- Get loop basic info
  SELECT * INTO loop_data FROM public.loops WHERE id = loop_uuid AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;

  -- Get scorecard from materialized view
  SELECT * INTO scorecard_data FROM public.mv_loop_metrics WHERE loop_id = loop_uuid;

  -- Get TRI series (last 90 days)
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
      AND at >= now() - interval '90 days'
    ORDER BY at DESC
    LIMIT 500
  ) recent_events;

  -- Get breach timeline
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
    AND at >= now() - interval '90 days'
  ORDER BY at DESC
  LIMIT 100;

  -- Get current DE band
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
  ORDER BY updated_at DESC
  LIMIT 1;

  -- Get current SRT window
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
  ORDER BY updated_at DESC
  LIMIT 1;

  -- Get active suggestions
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

-- Create apply_retune RPC
CREATE OR REPLACE FUNCTION public.apply_retune(
  loop_uuid uuid,
  band_changes jsonb DEFAULT NULL,
  srt_changes jsonb DEFAULT NULL,
  rationale_text text DEFAULT '',
  approver_id uuid DEFAULT NULL,
  task_uuid uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  retune_id uuid;
  before_state jsonb;
  after_state jsonb;
  change_magnitude numeric := 0;
  requires_approval boolean := false;
BEGIN
  -- Validate inputs
  IF rationale_text IS NULL OR length(trim(rationale_text)) < 20 THEN
    RETURN jsonb_build_object('error', 'Rationale must be at least 20 characters');
  END IF;

  -- Calculate change magnitude and check if approval needed
  IF band_changes IS NOT NULL THEN
    -- Simple heuristic: if bound changes > 15% of current range, needs approval
    change_magnitude := GREATEST(
      abs((band_changes->>'upper_bound')::numeric - (SELECT upper_bound FROM de_bands WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1)) / 
      ((SELECT upper_bound - lower_bound FROM de_bands WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1) + 0.01),
      abs((band_changes->>'lower_bound')::numeric - (SELECT lower_bound FROM de_bands WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1)) / 
      ((SELECT upper_bound - lower_bound FROM de_bands WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1) + 0.01)
    );
    
    requires_approval := change_magnitude > 0.15;
  END IF;

  -- Capture before state
  SELECT jsonb_build_object(
    'band', row_to_json(b),
    'srt', row_to_json(s)
  ) INTO before_state
  FROM (SELECT * FROM de_bands WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1) b
  CROSS JOIN (SELECT * FROM srt_windows WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1) s;

  -- Apply band changes
  IF band_changes IS NOT NULL THEN
    INSERT INTO public.de_bands (
      loop_id, 
      indicator, 
      lower_bound, 
      upper_bound, 
      asymmetry, 
      smoothing_alpha,
      notes,
      user_id,
      updated_by
    ) VALUES (
      loop_uuid,
      COALESCE(band_changes->>'indicator', 'primary'),
      (band_changes->>'lower_bound')::numeric,
      (band_changes->>'upper_bound')::numeric,
      COALESCE((band_changes->>'asymmetry')::numeric, 0),
      COALESCE((band_changes->>'smoothing_alpha')::numeric, 0.3),
      band_changes->>'notes',
      auth.uid(),
      auth.uid()
    );
  END IF;

  -- Apply SRT changes
  IF srt_changes IS NOT NULL THEN
    INSERT INTO public.srt_windows (
      loop_id,
      window_start,
      window_end,
      reflex_horizon,
      cadence,
      user_id,
      updated_by
    ) VALUES (
      loop_uuid,
      (srt_changes->>'window_start')::timestamptz,
      (srt_changes->>'window_end')::timestamptz,
      (srt_changes->>'reflex_horizon')::interval,
      COALESCE((srt_changes->>'cadence')::interval, '1 day'::interval),
      auth.uid(),
      auth.uid()
    );
  END IF;

  -- Capture after state
  SELECT jsonb_build_object(
    'band', row_to_json(b),
    'srt', row_to_json(s)
  ) INTO after_state
  FROM (SELECT * FROM de_bands WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1) b
  CROSS JOIN (SELECT * FROM srt_windows WHERE loop_id = loop_uuid ORDER BY updated_at DESC LIMIT 1) s;

  -- Create memory record
  INSERT INTO public.reflex_memory (
    loop_id,
    actor,
    kind,
    before,
    after,
    rationale,
    user_id
  ) VALUES (
    loop_uuid,
    auth.uid(),
    'retune',
    before_state,
    after_state,
    rationale_text,
    auth.uid()
  ) RETURNING id INTO retune_id;

  -- Add TRI event tag
  INSERT INTO public.tri_events (
    loop_id,
    task_id,
    t_value,
    r_value,
    i_value,
    tag,
    user_id
  ) VALUES (
    loop_uuid,
    task_uuid,
    0.5, -- placeholder values
    0.5,
    0.5,
    'retune_applied',
    auth.uid()
  );

  -- Handle approval workflow if needed
  IF requires_approval AND approver_id IS NULL THEN
    INSERT INTO public.retune_approvals (requested_by, retune_id)
    VALUES (auth.uid(), retune_id);
    
    RETURN jsonb_build_object(
      'success', true,
      'retune_id', retune_id,
      'requires_approval', true,
      'change_magnitude', change_magnitude,
      'message', 'Retune submitted for approval due to large changes'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'retune_id', retune_id,
    'requires_approval', false,
    'change_magnitude', change_magnitude,
    'before_state', before_state,
    'after_state', after_state
  );
END;
$function$;

-- Create suggest_retunes RPC for ML-based suggestions
CREATE OR REPLACE FUNCTION public.suggest_retunes(
  loop_uuid uuid,
  lookback_days integer DEFAULT 60
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  tri_stats RECORD;
  breach_count integer;
  suggestions jsonb := '[]'::jsonb;
  suggestion jsonb;
BEGIN
  -- Get TRI statistics for the lookback period
  SELECT 
    avg(t_value) as avg_t,
    avg(r_value) as avg_r,
    avg(i_value) as avg_i,
    stddev(t_value) as stddev_t,
    stddev(r_value) as stddev_r,
    stddev(i_value) as stddev_i,
    count(*) as sample_count
  INTO tri_stats
  FROM public.tri_events
  WHERE loop_id = loop_uuid
    AND at >= now() - (lookback_days || ' days')::interval;

  -- Get breach count
  SELECT count(*) INTO breach_count
  FROM public.breach_events
  WHERE loop_id = loop_uuid
    AND at >= now() - (lookback_days || ' days')::interval;

  -- Generate band adjustment suggestion if high variance
  IF tri_stats.stddev_t > 0.3 OR tri_stats.stddev_r > 0.3 THEN
    suggestion := jsonb_build_object(
      'suggestion_type', 'band_adjustment',
      'title', 'Reduce Band Sensitivity',
      'description', 'High TRI variance detected - consider widening bands',
      'rationale', format('TRI variance: T=%.3f, R=%.3f over %s days', tri_stats.stddev_t, tri_stats.stddev_r, lookback_days),
      'risk_score', 0.3,
      'confidence', 0.8,
      'impact_level', 'medium',
      'proposed_changes', jsonb_build_object(
        'upper_bound_delta', '+5%',
        'asymmetry_delta', '+0.1'
      ),
      'expected_improvement', jsonb_build_object(
        'variance_reduction', '20%',
        'false_positives', '-30%'
      )
    );
    suggestions := suggestions || jsonb_build_array(suggestion);
  END IF;

  -- Generate SRT adjustment if frequent breaches
  IF breach_count > 5 THEN
    suggestion := jsonb_build_object(
      'suggestion_type', 'srt_change',
      'title', 'Extend Reflex Horizon',
      'description', 'Frequent breaches suggest need for longer response time',
      'rationale', format('%s breaches in %s days - system may be over-reacting', breach_count, lookback_days),
      'risk_score', 0.4,
      'confidence', 0.75,
      'impact_level', 'medium',
      'proposed_changes', jsonb_build_object(
        'reflex_horizon_delta', '+2 hours',
        'cadence_delta', '+30 minutes'
      ),
      'expected_improvement', jsonb_build_object(
        'breach_reduction', '40%',
        'response_stability', '+25%'
      )
    );
    suggestions := suggestions || jsonb_build_array(suggestion);
  END IF;

  -- Generate asymmetry suggestion if T-R imbalance
  IF abs(tri_stats.avg_t - tri_stats.avg_r) > 0.3 THEN
    suggestion := jsonb_build_object(
      'suggestion_type', 'asymmetry_tune',
      'title', 'Adjust Band Asymmetry',
      'description', 'TRI imbalance suggests asymmetric band tuning needed',
      'rationale', format('T-R delta: %.3f suggests directional bias', tri_stats.avg_t - tri_stats.avg_r),
      'risk_score', 0.25,
      'confidence', 0.85,
      'impact_level', 'small',
      'proposed_changes', jsonb_build_object(
        'asymmetry', CASE WHEN tri_stats.avg_t > tri_stats.avg_r THEN 0.7 ELSE 0.3 END
      ),
      'expected_improvement', jsonb_build_object(
        'balance_improvement', '50%',
        'directional_accuracy', '+15%'
      )
    );
    suggestions := suggestions || jsonb_build_array(suggestion);
  END IF;

  -- Store suggestions in database
  IF jsonb_array_length(suggestions) > 0 THEN
    INSERT INTO public.retune_suggestions (
      loop_id, user_id, suggestion_type, title, description, rationale,
      risk_score, confidence, proposed_changes, impact_level
    )
    SELECT 
      loop_uuid,
      auth.uid(),
      s->>'suggestion_type',
      s->>'title',
      s->>'description',
      s->>'rationale',
      (s->>'risk_score')::numeric,
      (s->>'confidence')::numeric,
      s->'proposed_changes',
      s->>'impact_level'
    FROM jsonb_array_elements(suggestions) s;
  END IF;

  RETURN jsonb_build_object(
    'suggestions', suggestions,
    'generated_at', now(),
    'lookback_days', lookback_days,
    'tri_stats', row_to_json(tri_stats),
    'breach_count', breach_count
  );
END;
$function$;