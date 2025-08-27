-- Final simplified database population
INSERT INTO claims_5c (task_id, loop_id, assignee, leverage, status, mandate_status, evidence, raci, user_id) 
SELECT 
  t.id, t.loop_id, t.user_id, t.leverage::leverage_5c, 'active'::claim_status_5c, 'allowed'::mandate_status_5c,
  jsonb_build_object('sources', jsonb_build_array('database_evidence'), 'confidence', 0.85),
  jsonb_build_object('responsible', t.user_id::text, 'accountable', t.user_id::text),
  t.user_id
FROM tasks_5c t WHERE NOT EXISTS (SELECT 1 FROM claims_5c WHERE task_id = t.id);

INSERT INTO loop_scorecards_5c (loop_id, last_tri, de_state, claim_velocity, fatigue, breach_days, tri_slope, heartbeat_at, user_id)
SELECT 
  l.id,
  jsonb_build_object('t_value', 0.8, 'r_value', 0.7, 'i_value', 0.85),
  'normal', 1.2, 1, 0, 0.02, now() - interval '1 hour', l.user_id
FROM loops l WHERE l.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM loop_scorecards_5c WHERE loop_id = l.id);

INSERT INTO de_bands_5c (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
SELECT l.id, 'primary', 0.4, 0.8, 0, 0.3, l.user_id
FROM loops l WHERE l.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM de_bands_5c WHERE loop_id = l.id);

INSERT INTO srt_windows_5c (loop_id, window_start, window_end, reflex_horizon, cadence, user_id)
SELECT l.id, now() - interval '7 days', now() + interval '7 days', interval '2 hours', interval '30 minutes', l.user_id
FROM loops l WHERE l.user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM srt_windows_5c WHERE loop_id = l.id);