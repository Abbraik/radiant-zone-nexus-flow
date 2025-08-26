-- Signals Layer Database Functions (Fixed FILTER syntax)
-- Phase 2: Band-aware normalization and scoring functions

-- Function to compute band status and position
CREATE OR REPLACE FUNCTION public.compute_band_status(
    p_value numeric,
    p_lower_bound numeric,
    p_upper_bound numeric
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_center numeric;
    v_half_width numeric;
    v_status text;
    v_band_pos numeric;
BEGIN
    -- Handle null bounds
    IF p_lower_bound IS NULL AND p_upper_bound IS NULL THEN
        RETURN jsonb_build_object('status', 'in_band', 'band_pos', 0);
    END IF;
    
    -- Calculate band center and half-width
    v_center := (COALESCE(p_lower_bound, p_value) + COALESCE(p_upper_bound, p_value)) / 2.0;
    v_half_width := (COALESCE(p_upper_bound, p_value) - COALESCE(p_lower_bound, p_value)) / 2.0;
    
    -- Avoid division by zero
    IF v_half_width = 0 THEN
        v_band_pos := 0;
        v_status := 'in_band';
    ELSE
        -- Calculate normalized position: 0=center, ±1=edges, >1=outside
        v_band_pos := (p_value - v_center) / v_half_width;
        
        -- Determine status
        IF p_lower_bound IS NOT NULL AND p_value < p_lower_bound THEN
            v_status := 'below';
        ELSIF p_upper_bound IS NOT NULL AND p_value > p_upper_bound THEN
            v_status := 'above';
        ELSE
            v_status := 'in_band';
        END IF;
    END IF;
    
    RETURN jsonb_build_object(
        'status', v_status,
        'band_pos', v_band_pos
    );
END;
$$;

-- Function to apply EWMA smoothing
CREATE OR REPLACE FUNCTION public.apply_smoothing(
    p_indicator_key text,
    p_value numeric,
    p_alpha numeric DEFAULT 0.3
) RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_last_smoothed numeric;
    v_result numeric;
BEGIN
    -- Get the most recent smoothed value
    SELECT value_smoothed INTO v_last_smoothed
    FROM normalized_observations
    WHERE indicator_key = p_indicator_key
    ORDER BY ts DESC
    LIMIT 1;
    
    -- If no previous value, return current value
    IF v_last_smoothed IS NULL THEN
        RETURN p_value;
    END IF;
    
    -- Apply EWMA: new_smoothed = alpha * current + (1-alpha) * last_smoothed
    v_result := p_alpha * p_value + (1 - p_alpha) * v_last_smoothed;
    
    RETURN v_result;
END;
$$;

-- Function to compute loop signal scores for a given window
CREATE OR REPLACE FUNCTION public.compute_loop_signal_scores(
    p_loop_id uuid,
    p_time_window text DEFAULT '14d',
    p_as_of timestamp with time zone DEFAULT now()
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_window_start timestamp with time zone;
    v_severity numeric := 0;
    v_persistence numeric := 0;
    v_dispersion numeric := 0;
    v_hub_load numeric := 0;
    v_legitimacy_delta numeric := 0;
    v_total_indicators integer := 0;
    v_outside_indicators integer := 0;
    v_outside_days integer;
    v_total_days integer;
BEGIN
    -- Parse time window (simple implementation for common cases)
    CASE p_time_window
        WHEN '7d' THEN v_window_start := p_as_of - interval '7 days';
        WHEN '14d' THEN v_window_start := p_as_of - interval '14 days';
        WHEN '28d' THEN v_window_start := p_as_of - interval '28 days';
        WHEN '30d' THEN v_window_start := p_as_of - interval '30 days';
        ELSE v_window_start := p_as_of - interval '14 days'; -- default
    END CASE;
    
    -- Calculate severity: mean |band_pos| clipped to [0, 2]
    SELECT 
        COALESCE(LEAST(AVG(ABS(band_pos)), 2.0), 0) INTO v_severity
    FROM normalized_observations
    WHERE loop_id = p_loop_id
      AND ts BETWEEN v_window_start AND p_as_of;
    
    -- Calculate persistence: share of days with any indicator outside band
    SELECT 
        COUNT(DISTINCT DATE(ts)) INTO v_total_days
    FROM normalized_observations
    WHERE loop_id = p_loop_id
      AND ts BETWEEN v_window_start AND p_as_of;
    
    SELECT 
        COUNT(DISTINCT DATE(ts)) INTO v_outside_days
    FROM normalized_observations
    WHERE loop_id = p_loop_id
      AND ts BETWEEN v_window_start AND p_as_of
      AND status != 'in_band';
    
    IF v_total_days > 0 THEN
        v_persistence := v_outside_days::numeric / v_total_days::numeric;
    END IF;
    
    -- Calculate dispersion: proportion of indicators simultaneously outside band
    WITH latest_per_indicator AS (
        SELECT DISTINCT ON (indicator_key) 
            indicator_key, status
        FROM normalized_observations
        WHERE loop_id = p_loop_id
          AND ts BETWEEN v_window_start AND p_as_of
        ORDER BY indicator_key, ts DESC
    )
    SELECT 
        COUNT(*), 
        SUM(CASE WHEN status != 'in_band' THEN 1 ELSE 0 END)
    INTO v_total_indicators, v_outside_indicators
    FROM latest_per_indicator;
    
    IF v_total_indicators > 0 THEN
        v_dispersion := v_outside_indicators::numeric / v_total_indicators::numeric;
    END IF;
    
    -- Hub load calculation (simplified - assumes SNL hubs have higher weight)
    SELECT 
        COALESCE(AVG(ABS(no.band_pos)), 0) INTO v_hub_load
    FROM normalized_observations no
    JOIN indicator_registry ir ON ir.indicator_key = no.indicator_key
    WHERE no.loop_id = p_loop_id
      AND no.ts BETWEEN v_window_start AND p_as_of
      AND ir.snl_key IS NOT NULL; -- Hub indicators
    
    -- Legitimacy delta (placeholder - needs trust/participation indicators)
    v_legitimacy_delta := 0;
    
    -- Return structured result
    RETURN jsonb_build_object(
        'severity', v_severity,
        'persistence', v_persistence,
        'dispersion', v_dispersion,
        'hub_load', v_hub_load,
        'legitimacy_delta', v_legitimacy_delta,
        'window_start', v_window_start,
        'as_of', p_as_of,
        'total_indicators', v_total_indicators,
        'outside_indicators', v_outside_indicators,
        'total_days', v_total_days,
        'outside_days', v_outside_days
    );
END;
$$;

-- Function to normalize raw observation and update scores
CREATE OR REPLACE FUNCTION public.process_raw_observation(
    p_obs_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_obs record;
    v_indicator record;
    v_band record;
    v_band_result jsonb;
    v_smoothed_value numeric;
    v_norm_id uuid;
    v_score_result jsonb;
BEGIN
    -- Get the raw observation
    SELECT * INTO v_obs
    FROM raw_observations
    WHERE obs_id = p_obs_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Raw observation not found: %', p_obs_id;
    END IF;
    
    -- Get indicator metadata
    SELECT * INTO v_indicator
    FROM indicator_registry
    WHERE indicator_key = v_obs.indicator_key;
    
    -- Get DE band configuration for the loop
    SELECT * INTO v_band
    FROM de_bands
    WHERE loop_id = v_indicator.loop_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    -- Compute band status
    v_band_result := compute_band_status(
        v_obs.value,
        v_band.lower_bound,
        v_band.upper_bound
    );
    
    -- Apply smoothing
    v_smoothed_value := apply_smoothing(
        v_obs.indicator_key,
        v_obs.value,
        COALESCE(v_band.smoothing_alpha, 0.3)
    );
    
    -- Insert normalized observation
    INSERT INTO normalized_observations (
        indicator_key,
        loop_id,
        ts,
        value,
        value_smoothed,
        band_pos,
        status,
        severity,
        user_id
    ) VALUES (
        v_obs.indicator_key,
        v_indicator.loop_id,
        v_obs.ts,
        v_obs.value,
        v_smoothed_value,
        (v_band_result->>'band_pos')::numeric,
        v_band_result->>'status',
        ABS((v_band_result->>'band_pos')::numeric),
        v_obs.user_id
    ) RETURNING norm_id INTO v_norm_id;
    
    -- Recompute loop signal scores
    v_score_result := compute_loop_signal_scores(v_indicator.loop_id);
    
    -- Upsert loop signal scores
    INSERT INTO loop_signal_scores (
        loop_id,
        time_window,
        as_of,
        severity,
        persistence,
        dispersion,
        hub_load,
        legitimacy_delta,
        details,
        user_id
    ) VALUES (
        v_indicator.loop_id,
        '14d',
        now(),
        (v_score_result->>'severity')::numeric,
        (v_score_result->>'persistence')::numeric,
        (v_score_result->>'dispersion')::numeric,
        (v_score_result->>'hub_load')::numeric,
        (v_score_result->>'legitimacy_delta')::numeric,
        v_score_result,
        v_obs.user_id
    ) ON CONFLICT (loop_id, time_window, as_of) DO UPDATE SET
        severity = EXCLUDED.severity,
        persistence = EXCLUDED.persistence,
        dispersion = EXCLUDED.dispersion,
        hub_load = EXCLUDED.hub_load,
        legitimacy_delta = EXCLUDED.legitimacy_delta,
        details = EXCLUDED.details;
    
    RETURN jsonb_build_object(
        'norm_id', v_norm_id,
        'band_result', v_band_result,
        'smoothed_value', v_smoothed_value,
        'score_result', v_score_result
    );
END;
$$;

-- Function to check loop action readiness (data quality guards)
CREATE OR REPLACE FUNCTION public.get_loop_action_readiness(
    p_loop_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_auto_ok boolean := true;
    v_reasons text[] := ARRAY[]::text[];
    v_bad_sources integer := 0;
    v_stale_indicators integer := 0;
    v_drift_indicators integer := 0;
BEGIN
    -- Check for bad quality sources affecting this loop
    SELECT COUNT(*) INTO v_bad_sources
    FROM dq_status ds
    JOIN indicator_registry ir ON ir.indicator_key = ds.indicator_key
    WHERE ir.loop_id = p_loop_id
      AND ds.quality = 'bad';
    
    -- Check for stale indicators (>24h old data)
    SELECT COUNT(*) INTO v_stale_indicators
    FROM dq_status ds
    JOIN indicator_registry ir ON ir.indicator_key = ds.indicator_key
    WHERE ir.loop_id = p_loop_id
      AND ds.staleness_seconds > 86400; -- 24 hours
    
    -- Check for schema drift
    SELECT COUNT(*) INTO v_drift_indicators
    FROM dq_status ds
    JOIN indicator_registry ir ON ir.indicator_key = ds.indicator_key
    WHERE ir.loop_id = p_loop_id
      AND ds.schema_drift = true;
    
    -- Build readiness assessment
    IF v_bad_sources > 0 THEN
        v_auto_ok := false;
        v_reasons := array_append(v_reasons, format('%s source(s) in bad quality state', v_bad_sources));
    END IF;
    
    IF v_stale_indicators > 0 THEN
        v_auto_ok := false;
        v_reasons := array_append(v_reasons, format('%s indicator(s) have stale data >24h', v_stale_indicators));
    END IF;
    
    IF v_drift_indicators > 0 THEN
        v_auto_ok := false;
        v_reasons := array_append(v_reasons, format('%s indicator(s) experiencing schema drift', v_drift_indicators));
    END IF;
    
    RETURN jsonb_build_object(
        'auto_ok', v_auto_ok,
        'reasons', v_reasons,
        'bad_sources', v_bad_sources,
        'stale_indicators', v_stale_indicators,
        'drift_indicators', v_drift_indicators,
        'checked_at', now()
    );
END;
$$;