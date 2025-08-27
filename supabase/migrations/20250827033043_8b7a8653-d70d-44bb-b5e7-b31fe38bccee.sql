-- Populate database with comprehensive test data for all capacity testing (CORRECT SCHEMA)

-- First, let's populate claims_5c with test data using existing task data
INSERT INTO claims_5c (task_id, loop_id, assignee, leverage, status, mandate_status, evidence, raci, user_id) 
SELECT 
  t.id,
  t.loop_id, 
  t.user_id,
  t.leverage::leverage_5c,
  'active'::claim_status_5c,
  'allowed'::mandate_status_5c,
  jsonb_build_object(
    'sources', jsonb_build_array('database_evidence', 'user_input'),
    'confidence', 0.85,
    'last_updated', now()
  ),
  jsonb_build_object(
    'responsible', t.user_id::text,
    'accountable', t.user_id::text, 
    'consulted', jsonb_build_array(),
    'informed', jsonb_build_array()
  ),
  t.user_id
FROM tasks_5c t
WHERE NOT EXISTS (SELECT 1 FROM claims_5c WHERE task_id = t.id);

-- Populate loop_scorecards_5c with realistic test data (using actual schema)
INSERT INTO loop_scorecards_5c (loop_id, last_tri, de_state, claim_velocity, fatigue, breach_days, tri_slope, heartbeat_at, user_id)
SELECT 
  l.id,
  jsonb_build_object(
    't_value', 0.7 + (random() * 0.2),
    'r_value', 0.6 + (random() * 0.3), 
    'i_value', 0.8 + (random() * 0.15)
  ),
  CASE 
    WHEN random() > 0.8 THEN 'critical'
    WHEN random() > 0.6 THEN 'warning'
    ELSE 'normal'
  END,
  0.5 + (random() * 1.5), -- claim velocity 0.5-2.0
  floor(random() * 5)::integer, -- fatigue 0-4
  floor(random() * 3)::integer, -- breach days 0-2  
  -0.05 + (random() * 0.1), -- tri slope -0.05 to 0.05
  now() - (random() * interval '2 hours'),
  l.user_id
FROM loops l
WHERE l.user_id IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM loop_scorecards_5c WHERE loop_id = l.id);

-- Populate de_bands_5c with control boundaries
INSERT INTO de_bands_5c (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
SELECT 
  l.id,
  'primary',
  0.3 + (random() * 0.2), -- lower bound 0.3-0.5
  0.7 + (random() * 0.2), -- upper bound 0.7-0.9
  -0.1 + (random() * 0.2), -- asymmetry -0.1 to 0.1
  0.3,
  l.user_id
FROM loops l 
WHERE l.user_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM de_bands_5c WHERE loop_id = l.id AND indicator = 'primary');

-- Populate srt_windows_5c with time window data
INSERT INTO srt_windows_5c (loop_id, window_start, window_end, target_response_minutes, actual_response_minutes, breach_threshold, user_id)
SELECT 
  l.id,
  now() - interval '7 days',
  now() + interval '7 days', 
  60 + (random() * 120)::integer, -- target 60-180 minutes
  45 + (random() * 150)::integer, -- actual 45-195 minutes
  0.15 + (random() * 0.1), -- breach threshold 0.15-0.25
  l.user_id
FROM loops l
WHERE l.user_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM srt_windows_5c WHERE loop_id = l.id);

-- Add some breach events for testing
INSERT INTO breach_events (loop_id, indicator_name, breach_type, value, threshold_value, severity_score, at, user_id)
SELECT 
  l.id,
  'primary_metric',
  CASE WHEN random() > 0.5 THEN 'upper' ELSE 'lower' END,
  0.5 + (random() * 0.4), -- value 0.5-0.9
  CASE WHEN random() > 0.5 THEN 0.8 ELSE 0.3 END, -- threshold
  (1 + random() * 2)::integer, -- severity 1-3
  now() - (random() * interval '24 hours'),
  l.user_id
FROM loops l
WHERE l.user_id IS NOT NULL 
AND random() > 0.7 -- Only 30% of loops have recent breaches
LIMIT 10;