-- Create cross-bundle navigation and mode recommendation system

-- Table to track task links and context handoffs
CREATE TABLE task_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_task_id UUID NOT NULL,
  to_task_id UUID NOT NULL,
  link_type TEXT NOT NULL, -- 'mode_switch', 'deep_link', 'rollout', etc.
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS
ALTER TABLE task_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own task links"
ON task_links
FOR ALL
USING (auth.uid() = user_id);

-- Table to track cross-entity references
CREATE TABLE entity_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL, -- 'task', 'claim', 'option_set', 'watchpoint', etc.
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  link_context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS
ALTER TABLE entity_links ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own entity links"
ON entity_links
FOR ALL
USING (auth.uid() = user_id);

-- Table for mode recommendations and telemetry
CREATE TABLE mode_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'mode_recommended', 'mode_overridden', 'deep_link_click', etc.
  loop_id UUID,
  task_id UUID,
  capacity TEXT,
  confidence NUMERIC,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable RLS
ALTER TABLE mode_events ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own mode events"
ON mode_events
FOR ALL
USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mode recommendation RPC
CREATE OR REPLACE FUNCTION suggest_capacity(
  loop_id_param UUID,
  context_param JSONB DEFAULT '{}'
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  scorecard RECORD;
  suggestion JSONB;
  confidence NUMERIC := 0.5;
  capacity TEXT := 'responsive';
  reasons TEXT[] := '{}';
BEGIN
  -- Get loop scorecard data
  SELECT * INTO scorecard 
  FROM loop_scorecards 
  WHERE loop_id = loop_id_param 
  AND user_id = auth.uid()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'capacity', 'responsive',
      'confidence', 0.3,
      'reasons', ARRAY['No scorecard data available - defaulting to Responsive']
    );
  END IF;
  
  -- Heuristic rules for capacity suggestion
  IF scorecard.breach_days > 0 AND scorecard.tri_slope < 0 THEN
    capacity := 'responsive';
    confidence := 0.8;
    reasons := ARRAY['Active breaches with declining trend - immediate response needed'];
  ELSIF abs(scorecard.tri_slope) < 0.1 AND scorecard.breach_days > 3 THEN
    capacity := 'reflexive';
    confidence := 0.7;
    reasons := ARRAY['Persistent issues with stable trend - system tuning needed'];
  ELSIF (context_param->>'identifiability')::boolean = false THEN
    capacity := 'deliberative';
    confidence := 0.6;
    reasons := ARRAY['Low identifiability - options analysis needed'];
  ELSIF (context_param->>'early_signals')::boolean = true THEN
    capacity := 'anticipatory';
    confidence := 0.6;
    reasons := ARRAY['Early warning signals detected - proactive planning needed'];
  ELSIF (context_param->>'authority_mismatch')::boolean = true THEN
    capacity := 'structural';
    confidence := 0.7;
    reasons := ARRAY['Authority-capacity mismatch detected - structural changes needed'];
  ELSE
    -- Default logic based on fatigue and velocity
    IF scorecard.fatigue > 5 THEN
      capacity := 'reflexive';
      confidence := 0.5;
      reasons := ARRAY['High fatigue detected - consider system optimization'];
    ELSIF scorecard.claim_velocity < 0.1 THEN
      capacity := 'deliberative';
      confidence := 0.5;
      reasons := ARRAY['Low claim velocity - strategic planning may help'];
    END IF;
  END IF;
  
  suggestion := jsonb_build_object(
    'capacity', capacity,
    'confidence', confidence,
    'reasons', reasons,
    'scorecard_snapshot', row_to_json(scorecard)
  );
  
  -- Log the recommendation
  INSERT INTO mode_events (event_type, loop_id, capacity, confidence, metadata, user_id)
  VALUES ('mode_recommended', loop_id_param, capacity, confidence, suggestion, auth.uid());
  
  RETURN suggestion;
END;
$$ LANGUAGE plpgsql;

-- Create task with link RPC
CREATE OR REPLACE FUNCTION create_task_with_link(
  from_task_param UUID,
  capacity_param TEXT,
  loop_id_param UUID,
  context_param JSONB DEFAULT '{}'
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_task_id UUID;
  task_name TEXT;
BEGIN
  -- Generate task name based on capacity
  task_name := CASE capacity_param
    WHEN 'responsive' THEN 'Responsive Action Required'
    WHEN 'reflexive' THEN 'System Retune Needed'
    WHEN 'deliberative' THEN 'Options Analysis'
    WHEN 'anticipatory' THEN 'Proactive Planning'
    WHEN 'structural' THEN 'Structural Changes'
    ELSE 'Task'
  END;
  
  -- Create new task (assuming tasks table exists with these fields)
  INSERT INTO tasks (name, loop_id, capacity, status, user_id, context, created_at)
  VALUES (task_name, loop_id_param, capacity_param, 'open', auth.uid(), context_param, now())
  RETURNING id INTO new_task_id;
  
  -- Create task link if from_task provided
  IF from_task_param IS NOT NULL THEN
    INSERT INTO task_links (from_task_id, to_task_id, link_type, context, user_id)
    VALUES (from_task_param, new_task_id, 'mode_switch', context_param, auth.uid());
  END IF;
  
  -- Log the mode switch
  INSERT INTO mode_events (event_type, loop_id, task_id, capacity, metadata, user_id)
  VALUES ('mode_switched', loop_id_param, new_task_id, capacity_param, context_param, auth.uid());
  
  RETURN jsonb_build_object(
    'task_id', new_task_id,
    'task_name', task_name,
    'capacity', capacity_param
  );
END;
$$ LANGUAGE plpgsql;

-- Link entities RPC
CREATE OR REPLACE FUNCTION link_entities(
  source_param JSONB,
  target_param JSONB
)
RETURNS UUID
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  link_id UUID;
BEGIN
  INSERT INTO entity_links (
    source_type, source_id, target_type, target_id, 
    link_context, user_id
  )
  VALUES (
    source_param->>'type', 
    (source_param->>'id')::UUID,
    target_param->>'type', 
    (target_param->>'id')::UUID,
    jsonb_build_object('created_via', 'link_entities_rpc'),
    auth.uid()
  )
  RETURNING id INTO link_id;
  
  RETURN link_id;
END;
$$ LANGUAGE plpgsql;

-- Global search RPC for command palette
CREATE OR REPLACE FUNCTION global_search(
  query_param TEXT,
  limit_param INTEGER DEFAULT 20
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  results JSONB := '[]'::JSONB;
  loop_results JSONB;
  task_results JSONB;
  claim_results JSONB;
  watchpoint_results JSONB;
BEGIN
  -- Search loops
  SELECT jsonb_agg(
    jsonb_build_object(
      'type', 'loop',
      'id', id,
      'title', name,
      'subtitle', COALESCE(description, ''),
      'url', '/registry/' || id,
      'metadata', jsonb_build_object('status', status, 'scale', scale)
    )
  ) INTO loop_results
  FROM loops
  WHERE user_id = auth.uid()
  AND (name ILIKE '%' || query_param || '%' OR description ILIKE '%' || query_param || '%')
  LIMIT limit_param / 4;
  
  -- Search tasks
  SELECT jsonb_agg(
    jsonb_build_object(
      'type', 'task',
      'id', id,
      'title', name,
      'subtitle', 'Task • ' || COALESCE(capacity, 'general'),
      'url', '/workspace?task=' || id,
      'metadata', jsonb_build_object('capacity', capacity, 'status', status)
    )
  ) INTO task_results
  FROM tasks
  WHERE user_id = auth.uid()
  AND name ILIKE '%' || query_param || '%'
  LIMIT limit_param / 4;
  
  -- Search claims
  SELECT jsonb_agg(
    jsonb_build_object(
      'type', 'claim',
      'id', id,
      'title', 'Claim #' || id::text,
      'subtitle', 'Claim • ' || status,
      'url', '/claims/' || id,
      'metadata', jsonb_build_object('status', status, 'leverage', leverage)
    )
  ) INTO claim_results
  FROM claims
  WHERE user_id = auth.uid()
  LIMIT limit_param / 4;
  
  -- Search watchpoints
  SELECT jsonb_agg(
    jsonb_build_object(
      'type', 'watchpoint',
      'id', id,
      'title', 'Watchpoint: ' || indicator,
      'subtitle', 'Monitor • ' || direction || ' threshold',
      'url', '/workspace?watchpoint=' || id,
      'metadata', jsonb_build_object('armed', armed, 'direction', direction)
    )
  ) INTO watchpoint_results
  FROM watchpoints
  WHERE user_id = auth.uid()
  AND indicator ILIKE '%' || query_param || '%'
  LIMIT limit_param / 4;
  
  -- Combine results
  results := COALESCE(loop_results, '[]'::JSONB) || 
             COALESCE(task_results, '[]'::JSONB) || 
             COALESCE(claim_results, '[]'::JSONB) || 
             COALESCE(watchpoint_results, '[]'::JSONB);
  
  RETURN results;
END;
$$ LANGUAGE plpgsql;