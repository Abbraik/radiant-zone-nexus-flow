-- RPC functions for Deliberative Capacity bundle

-- Run MCDA analysis on options
CREATE OR REPLACE FUNCTION public.run_mcda(
  task_uuid UUID,
  option_ids UUID[],
  weights JSONB DEFAULT '{"impact": 0.3, "cost": 0.2, "effort": 0.2, "time": 0.15, "risk": 0.15}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  option_record RECORD;
  scores JSONB := '[]';
  score_obj JSONB;
  weighted_score NUMERIC;
  max_cost NUMERIC := 1;
  max_effort INTEGER := 1;
  max_time_days NUMERIC := 1;
BEGIN
  -- Get max values for normalization
  SELECT 
    GREATEST(MAX(cost), 1),
    GREATEST(MAX(effort), 1),
    GREATEST(MAX(EXTRACT(EPOCH FROM time_to_impact) / 86400), 1)
  INTO max_cost, max_effort, max_time_days
  FROM public.options 
  WHERE id = ANY(option_ids) AND user_id = auth.uid();

  -- Calculate scores for each option
  FOR option_record IN 
    SELECT * FROM public.options 
    WHERE id = ANY(option_ids) AND user_id = auth.uid()
    ORDER BY name
  LOOP
    -- Calculate weighted score (normalized to 0-1)
    weighted_score := 
      COALESCE((weights->>'impact')::numeric, 0.3) * 
        COALESCE((option_record.effect->>'impact_score')::numeric, 0.5) +
      COALESCE((weights->>'cost')::numeric, 0.2) * 
        (1 - LEAST(option_record.cost / max_cost, 1)) +
      COALESCE((weights->>'effort')::numeric, 0.2) * 
        (1 - LEAST(option_record.effort::numeric / max_effort, 1)) +
      COALESCE((weights->>'time')::numeric, 0.15) * 
        (1 - LEAST((EXTRACT(EPOCH FROM option_record.time_to_impact) / 86400) / max_time_days, 1)) +
      COALESCE((weights->>'risk')::numeric, 0.15) * 
        (1 - COALESCE((option_record.effect->>'risk_score')::numeric, 0.5));

    score_obj := jsonb_build_object(
      'option_id', option_record.id,
      'name', option_record.name,
      'lever', option_record.lever,
      'actor', option_record.actor,
      'weighted_score', ROUND(weighted_score, 4),
      'raw_scores', jsonb_build_object(
        'impact', COALESCE((option_record.effect->>'impact_score')::numeric, 0.5),
        'cost_norm', 1 - LEAST(option_record.cost / max_cost, 1),
        'effort_norm', 1 - LEAST(option_record.effort::numeric / max_effort, 1),
        'time_norm', 1 - LEAST((EXTRACT(EPOCH FROM option_record.time_to_impact) / 86400) / max_time_days, 1),
        'risk_norm', 1 - COALESCE((option_record.effect->>'risk_score')::numeric, 0.5)
      )
    );

    scores := scores || jsonb_build_array(score_obj);
  END LOOP;

  RETURN jsonb_build_object(
    'scores', scores,
    'weights', weights,
    'task_id', task_uuid,
    'analyzed_at', now(),
    'normalization', jsonb_build_object(
      'max_cost', max_cost,
      'max_effort', max_effort,
      'max_time_days', max_time_days
    )
  );
END;
$$;

-- Compute coverage matrix for loops vs options
CREATE OR REPLACE FUNCTION public.compute_coverage(
  loop_uuid UUID,
  option_ids UUID[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  coverage_matrix JSONB := '{}';
  gaps JSONB := '[]';
  conflicts JSONB := '[]';
  related_loops JSONB;
  option_record RECORD;
  loop_record RECORD;
  coverage_state TEXT;
BEGIN
  -- Get related loops through shared nodes
  SELECT jsonb_agg(DISTINCT l.id)
  INTO related_loops
  FROM public.loops l
  JOIN public.loop_shared_nodes lsn ON l.id = lsn.loop_id
  JOIN public.loop_shared_nodes lsn2 ON lsn.node_id = lsn2.node_id
  WHERE lsn2.loop_id = loop_uuid
    AND l.user_id = auth.uid()
    AND l.id != loop_uuid;

  -- Add primary loop to related loops
  related_loops := COALESCE(related_loops, '[]') || jsonb_build_array(loop_uuid);

  -- Build coverage matrix
  FOR loop_record IN 
    SELECT * FROM public.loops 
    WHERE id = ANY(SELECT jsonb_array_elements_text(related_loops)::uuid)
      AND user_id = auth.uid()
  LOOP
    FOR option_record IN 
      SELECT * FROM public.options 
      WHERE id = ANY(option_ids) AND user_id = auth.uid()
    LOOP
      -- Determine coverage state
      IF option_record.loop_id = loop_record.id THEN
        coverage_state := 'direct';
      ELSIF EXISTS (
        SELECT 1 FROM public.option_effects oe
        WHERE oe.option_id = option_record.id 
          AND oe.loop_id = loop_record.id
          AND oe.user_id = auth.uid()
      ) THEN
        coverage_state := 'indirect';
      ELSE
        coverage_state := 'none';
      END IF;

      coverage_matrix := jsonb_set(
        coverage_matrix,
        ARRAY[loop_record.id::text, option_record.id::text],
        to_jsonb(coverage_state)
      );
    END LOOP;
  END LOOP;

  -- Identify gaps (loops with no coverage)
  FOR loop_record IN 
    SELECT * FROM public.loops 
    WHERE id = ANY(SELECT jsonb_array_elements_text(related_loops)::uuid)
      AND user_id = auth.uid()
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.options o
      WHERE o.id = ANY(option_ids) 
        AND o.user_id = auth.uid()
        AND (o.loop_id = loop_record.id OR EXISTS (
          SELECT 1 FROM public.option_effects oe
          WHERE oe.option_id = o.id AND oe.loop_id = loop_record.id
        ))
    ) THEN
      gaps := gaps || jsonb_build_object(
        'loop_id', loop_record.id,
        'loop_name', loop_record.name,
        'gap_type', 'no_coverage'
      );
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'matrix', coverage_matrix,
    'gaps', gaps,
    'conflicts', conflicts,
    'related_loops', related_loops,
    'computed_at', now()
  );
END;
$$;

-- Package approved options for execution
CREATE OR REPLACE FUNCTION public.package_for_execution(
  option_set_uuid UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  option_set_record RECORD;
  option_record RECORD;
  claim_id UUID;
  claims JSONB := '[]';
  mandate_status TEXT;
BEGIN
  -- Get option set
  SELECT * INTO option_set_record
  FROM public.option_sets
  WHERE id = option_set_uuid AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Option set not found or access denied');
  END IF;

  -- Process each option in the set
  FOR option_record IN 
    SELECT * FROM public.options
    WHERE id = ANY(option_set_record.option_ids) AND user_id = auth.uid()
  LOOP
    -- Check mandate status
    SELECT public.evaluate_mandate(option_record.actor, option_record.lever)
    INTO mandate_status;

    -- Create claim
    INSERT INTO public.claims (
      task_id,
      loop_id,
      assignee,
      leverage,
      mandate_status,
      evidence,
      status,
      user_id,
      raci
    ) VALUES (
      option_set_record.task_id,
      option_record.loop_id,
      auth.uid(),
      option_record.lever::leverage_type,
      COALESCE(mandate_status, 'allowed')::mandate_status,
      option_record.evidence,
      'draft',
      auth.uid(),
      jsonb_build_object(
        'responsible', option_record.actor,
        'accountable', auth.uid(),
        'consulted', '[]',
        'informed', '[]'
      )
    ) RETURNING id INTO claim_id;

    claims := claims || jsonb_build_object(
      'claim_id', claim_id,
      'option_id', option_record.id,
      'option_name', option_record.name,
      'actor', option_record.actor,
      'lever', option_record.lever,
      'mandate_status', COALESCE(mandate_status, 'allowed')
    );
  END LOOP;

  -- Update option set as packaged
  UPDATE public.option_sets
  SET approved_by = auth.uid(), approved_at = now()
  WHERE id = option_set_uuid;

  RETURN jsonb_build_object(
    'success', true,
    'claims', claims,
    'option_set_id', option_set_uuid,
    'packaged_at', now()
  );
END;
$$;

-- Save decision record
CREATE OR REPLACE FUNCTION public.save_decision_record(
  task_uuid UUID,
  option_set_uuid UUID,
  rationale_text TEXT,
  mcda_snapshot JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  record_id UUID;
BEGIN
  -- Validate inputs
  IF rationale_text IS NULL OR length(trim(rationale_text)) < 180 THEN
    RETURN jsonb_build_object('error', 'Rationale must be at least 180 characters');
  END IF;

  -- Create decision record
  INSERT INTO public.decision_records (
    task_id,
    option_set_id,
    rationale,
    attachments,
    created_by,
    user_id
  ) VALUES (
    task_uuid,
    option_set_uuid,
    rationale_text,
    jsonb_build_object('mcda_snapshot', mcda_snapshot),
    auth.uid(),
    auth.uid()
  ) RETURNING id INTO record_id;

  RETURN jsonb_build_object(
    'success', true,
    'record_id', record_id,
    'created_at', now()
  );
END;
$$;