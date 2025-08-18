-- Create RPC functions for anticipatory capacity bundle
CREATE OR REPLACE FUNCTION public.run_scenario(loop_uuid uuid, params jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  scenario_result jsonb;
  base_indicators jsonb;
  projection_charts jsonb;
  impact_multiplier numeric;
BEGIN
  -- Validate user access to loop
  IF NOT EXISTS (SELECT 1 FROM public.loops WHERE id = loop_uuid AND user_id = auth.uid()) THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;

  -- Extract parameters with defaults
  impact_multiplier := COALESCE((params->>'impact_multiplier')::numeric, 1.0);
  
  -- Mock scenario simulation (replace with actual modeling later)
  base_indicators := jsonb_build_object(
    'delivery_time', 3.0,
    'cost_efficiency', 0.85,
    'quality_score', 4.2,
    'resource_utilization', 0.78
  );
  
  -- Generate projection charts based on parameters
  projection_charts := jsonb_build_object(
    'timeline', jsonb_build_array(
      jsonb_build_object('time', 0, 'delivery_time', 3.0 * impact_multiplier, 'confidence_band', jsonb_build_array(2.8, 3.2)),
      jsonb_build_object('time', 30, 'delivery_time', 3.2 * impact_multiplier, 'confidence_band', jsonb_build_array(2.9, 3.5)),
      jsonb_build_object('time', 60, 'delivery_time', 3.1 * impact_multiplier, 'confidence_band', jsonb_build_array(2.7, 3.6)),
      jsonb_build_object('time', 90, 'delivery_time', 2.9 * impact_multiplier, 'confidence_band', jsonb_build_array(2.5, 3.4))
    ),
    'exceedance_probability', CASE 
      WHEN impact_multiplier > 1.2 THEN 0.75
      WHEN impact_multiplier > 1.0 THEN 0.45
      ELSE 0.15
    END
  );
  
  scenario_result := jsonb_build_object(
    'parameters', params,
    'base_indicators', base_indicators,
    'projected_indicators', jsonb_build_object(
      'delivery_time', (base_indicators->>'delivery_time')::numeric * impact_multiplier,
      'cost_efficiency', (base_indicators->>'cost_efficiency')::numeric / GREATEST(impact_multiplier, 0.5),
      'quality_score', (base_indicators->>'quality_score')::numeric * (2.0 - impact_multiplier * 0.5),
      'resource_utilization', LEAST((base_indicators->>'resource_utilization')::numeric * impact_multiplier, 1.0)
    ),
    'charts', projection_charts,
    'computed_at', now()
  );
  
  RETURN scenario_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.enqueue_stress_test(loop_uuid uuid, scenario_uuid uuid, test_severity integer DEFAULT 3)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_test_id uuid;
  scenario_name text;
BEGIN
  -- Validate access and get scenario name
  SELECT name INTO scenario_name
  FROM public.scenarios
  WHERE id = scenario_uuid AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Scenario not found or access denied');
  END IF;
  
  -- Create stress test
  INSERT INTO public.stress_tests (
    loop_id, scenario_id, name, severity, status, user_id
  ) VALUES (
    loop_uuid, scenario_uuid, 
    format('Stress Test: %s (Level %s)', scenario_name, test_severity),
    test_severity, 'pending', auth.uid()
  ) RETURNING id INTO new_test_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'test_id', new_test_id,
    'status', 'queued'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.create_watchpoint(loop_uuid uuid, payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_watchpoint_id uuid;
BEGIN
  -- Validate user access to loop
  IF NOT EXISTS (SELECT 1 FROM public.loops WHERE id = loop_uuid AND user_id = auth.uid()) THEN
    RETURN jsonb_build_object('error', 'Loop not found or access denied');
  END IF;
  
  -- Create watchpoint
  INSERT INTO public.watchpoints (
    loop_id, indicator, direction, threshold_value, threshold_band,
    owner, user_id
  ) VALUES (
    loop_uuid,
    payload->>'indicator',
    payload->>'direction',
    (payload->>'threshold_value')::numeric,
    payload->'threshold_band',
    COALESCE((payload->>'owner')::uuid, auth.uid()),
    auth.uid()
  ) RETURNING id INTO new_watchpoint_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'watchpoint_id', new_watchpoint_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.evaluate_watchpoints()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  watchpoint_record RECORD;
  current_value numeric;
  is_tripped boolean := false;
  trip_count integer := 0;
  ok_count integer := 0;
  results jsonb := '[]';
BEGIN
  -- Evaluate all armed watchpoints
  FOR watchpoint_record IN 
    SELECT * FROM public.watchpoints 
    WHERE armed = true
  LOOP
    -- Get latest indicator value (mock for now)
    current_value := 3.5 + (random() - 0.5) * 2; -- Mock value between 2.5-4.5
    
    -- Check if watchpoint trips
    is_tripped := CASE
      WHEN watchpoint_record.direction = 'up' AND current_value > watchpoint_record.threshold_value THEN true
      WHEN watchpoint_record.direction = 'down' AND current_value < watchpoint_record.threshold_value THEN true
      WHEN watchpoint_record.direction = 'band' AND watchpoint_record.threshold_band IS NOT NULL THEN
        current_value < (watchpoint_record.threshold_band->>'lower')::numeric OR 
        current_value > (watchpoint_record.threshold_band->>'upper')::numeric
      ELSE false
    END;
    
    -- Update watchpoint evaluation
    UPDATE public.watchpoints
    SET 
      last_eval = now(),
      last_result = jsonb_build_object(
        'value', current_value,
        'tripped', is_tripped,
        'evaluated_at', now()
      )
    WHERE id = watchpoint_record.id;
    
    -- Log signal event if tripped
    IF is_tripped THEN
      INSERT INTO public.signal_events (
        watchpoint_id, loop_id, event_type, indicator_value, 
        threshold_crossed, user_id
      ) VALUES (
        watchpoint_record.id, watchpoint_record.loop_id, 'trip',
        current_value, watchpoint_record.threshold_value, watchpoint_record.user_id
      );
      trip_count := trip_count + 1;
    ELSE
      ok_count := ok_count + 1;
    END IF;
    
    results := results || jsonb_build_object(
      'watchpoint_id', watchpoint_record.id,
      'indicator', watchpoint_record.indicator,
      'current_value', current_value,
      'tripped', is_tripped
    );
  END LOOP;
  
  RETURN jsonb_build_object(
    'evaluated_at', now(),
    'total_watchpoints', trip_count + ok_count,
    'tripped_count', trip_count,
    'ok_count', ok_count,
    'results', results
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_playbook(watchpoint_uuid uuid, playbook_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate ownership
  IF NOT EXISTS (
    SELECT 1 FROM public.watchpoints w
    JOIN public.playbooks p ON p.id = playbook_uuid
    WHERE w.id = watchpoint_uuid 
      AND w.user_id = auth.uid() 
      AND p.user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('error', 'Watchpoint or playbook not found or access denied');
  END IF;
  
  -- Attach playbook
  UPDATE public.watchpoints
  SET playbook_id = playbook_uuid, updated_at = now()
  WHERE id = watchpoint_uuid;
  
  RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.dry_run_trip(watchpoint_uuid uuid, scenario_snapshot jsonb DEFAULT '{}')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  watchpoint_record RECORD;
  playbook_record RECORD;
  proposed_task jsonb;
BEGIN
  -- Get watchpoint and attached playbook
  SELECT w.*, p.title as playbook_title, p.steps, p.lever_order, p.auto_action
  INTO watchpoint_record
  FROM public.watchpoints w
  LEFT JOIN public.playbooks p ON w.playbook_id = p.id
  WHERE w.id = watchpoint_uuid AND w.user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Watchpoint not found or access denied');
  END IF;
  
  -- Build proposed task
  proposed_task := jsonb_build_object(
    'title', format('Watchpoint Trip: %s', watchpoint_record.indicator),
    'description', format('Automated response to %s threshold breach', watchpoint_record.indicator),
    'zone', CASE 
      WHEN watchpoint_record.playbook_title IS NOT NULL THEN 'act'
      ELSE 'monitor'
    END,
    'capacity', 'responsive',
    'priority', CASE
      WHEN (scenario_snapshot->>'severity')::text = 'high' THEN 'high'
      ELSE 'medium'
    END,
    'playbook_steps', COALESCE(watchpoint_record.steps, '[]'),
    'lever_order', COALESCE(watchpoint_record.lever_order, ARRAY['N', 'P', 'S']),
    'auto_action', COALESCE(watchpoint_record.auto_action, false),
    'scenario_context', scenario_snapshot
  );
  
  RETURN jsonb_build_object(
    'watchpoint', row_to_json(watchpoint_record),
    'proposed_task', proposed_task,
    'dry_run_at', now()
  );
END;
$$;