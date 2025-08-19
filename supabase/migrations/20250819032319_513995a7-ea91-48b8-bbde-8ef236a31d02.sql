-- QA Test Fixtures Function - Create deterministic test data for E2E validation

-- Function to create QA test fixtures for a user
CREATE OR REPLACE FUNCTION create_qa_fixtures()
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  
  -- Loop IDs for test scenarios (deterministic but unique per user)
  l1_emergency_throughput UUID;
  l2_kpi_oscillation UUID;
  l3_congestion_policy UUID;
  l4_heatwave_demand UUID;
  l5_multiagency_approvals UUID;
  
  -- Task IDs for scenarios
  l1_resp_task UUID;
  l2_refl_task UUID;
  l3_delib_task UUID;
  l4_anti_task UUID;
  l5_struct_task UUID;
  
  day_counter INTEGER;
  tri_base NUMERIC;
  fixtures_summary JSONB;
BEGIN
  -- Generate deterministic UUIDs based on user ID
  l1_emergency_throughput := md5(current_user_id::text || 'l1')::uuid;
  l2_kpi_oscillation := md5(current_user_id::text || 'l2')::uuid;
  l3_congestion_policy := md5(current_user_id::text || 'l3')::uuid;
  l4_heatwave_demand := md5(current_user_id::text || 'l4')::uuid;
  l5_multiagency_approvals := md5(current_user_id::text || 'l5')::uuid;
  
  l1_resp_task := md5(current_user_id::text || 't1')::uuid;
  l2_refl_task := md5(current_user_id::text || 't2')::uuid;
  l3_delib_task := md5(current_user_id::text || 't3')::uuid;
  l4_anti_task := md5(current_user_id::text || 't4')::uuid;
  l5_struct_task := md5(current_user_id::text || 't5')::uuid;
  
  -- Clean up existing QA fixtures for this user first
  DELETE FROM retune_suggestions WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM options WHERE user_id = current_user_id AND task_id IN (l1_resp_task, l2_refl_task, l3_delib_task, l4_anti_task, l5_struct_task);
  DELETE FROM mandate_rules WHERE user_id = current_user_id AND actor IN ('test_actor', 'emergency_manager', 'policy_director');
  DELETE FROM watchpoints WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM loop_scorecards WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM tasks WHERE user_id = current_user_id AND id IN (l1_resp_task, l2_refl_task, l3_delib_task, l4_anti_task, l5_struct_task);
  DELETE FROM breach_events WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM tri_events WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM srt_windows WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM de_bands WHERE user_id = current_user_id AND loop_id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  DELETE FROM loops WHERE user_id = current_user_id AND id IN (l1_emergency_throughput, l2_kpi_oscillation, l3_congestion_policy, l4_heatwave_demand, l5_multiagency_approvals);
  
  -- 1. Create Test Loops
  INSERT INTO loops (id, user_id, name, description, type, scale, loop_type, status, leverage_default) VALUES
  (l1_emergency_throughput, current_user_id, 'QA: Emergency Throughput', 'Emergency response throughput management', 'operational', 'meso', 'reactive', 'active', 'N'),
  (l2_kpi_oscillation, current_user_id, 'QA: KPI Oscillation', 'KPI stability optimization', 'operational', 'micro', 'perceptual', 'active', 'N'),
  (l3_congestion_policy, current_user_id, 'QA: Congestion Policy Design', 'Traffic congestion policy framework', 'strategic', 'macro', 'structural', 'active', 'P'),
  (l4_heatwave_demand, current_user_id, 'QA: Heatwave Demand', 'Energy demand during heatwaves', 'operational', 'macro', 'reactive', 'active', 'N'),
  (l5_multiagency_approvals, current_user_id, 'QA: Multi-Agency Approvals', 'Cross-agency approval bottlenecks', 'governance', 'meso', 'structural', 'active', 'S');
  
  -- 2. Create DE Bands
  INSERT INTO de_bands (loop_id, user_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, notes) VALUES
  (l1_emergency_throughput, current_user_id, 'response_time', 2.0, 8.0, 0.3, 0.2, 'Emergency response time bands - frequent breaches expected'),
  (l2_kpi_oscillation, current_user_id, 'efficiency_score', 75.0, 95.0, 0.5, 0.4, 'Efficiency oscillation bands - tight monitoring'),
  (l3_congestion_policy, current_user_id, 'congestion_index', 0.3, 0.7, 0.4, 0.3, 'Congestion policy effectiveness bands'),
  (l4_heatwave_demand, current_user_id, 'demand_ratio', 0.8, 1.2, 0.6, 0.25, 'Energy demand ratio bands - anticipatory monitoring'),
  (l5_multiagency_approvals, current_user_id, 'approval_time', 3.0, 14.0, 0.7, 0.35, 'Multi-agency approval time bands');
  
  -- 3. Create SRT Windows
  INSERT INTO srt_windows (loop_id, user_id, window_start, window_end, reflex_horizon, cadence) VALUES
  (l1_emergency_throughput, current_user_id, now() - interval '30 days', now() + interval '30 days', '30 minutes', '2 hours'),
  (l2_kpi_oscillation, current_user_id, now() - interval '45 days', now() + interval '45 days', '4 hours', '1 day'),
  (l3_congestion_policy, current_user_id, now() - interval '60 days', now() + interval '60 days', '1 week', '2 weeks'),
  (l4_heatwave_demand, current_user_id, now() - interval '90 days', now() + interval '90 days', '2 hours', '6 hours'),
  (l5_multiagency_approvals, current_user_id, now() - interval '120 days', now() + interval '120 days', '3 days', '1 week');
  
  -- 4. Generate sample TRI events (just recent ones for performance)
  FOR day_counter IN 0..29 LOOP
    -- L1: Emergency Throughput - declining trend
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l1_emergency_throughput, current_user_id, 
     0.6 - (day_counter * 0.01),
     0.65 - (day_counter * 0.008), 
     0.58 - (day_counter * 0.012),
     now() - interval '29 days' + (day_counter || ' days')::interval,
     'qa_fixture');
    
    -- L2: KPI Oscillation - oscillating pattern
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l2_kpi_oscillation, current_user_id,
     0.5 + sin(day_counter * 0.5) * 0.1,
     0.5 + sin(day_counter * 0.5) * 0.08,
     0.5 + sin(day_counter * 0.5) * 0.09,
     now() - interval '29 days' + (day_counter || ' days')::interval,
     'qa_fixture');
    
    -- L3: Stable improvement opportunity
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l3_congestion_policy, current_user_id, 0.41, 0.39, 0.42,
     now() - interval '29 days' + (day_counter || ' days')::interval, 'qa_fixture');
    
    -- L4: Early warning signals
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l4_heatwave_demand, current_user_id, 
     0.7 + (CASE WHEN day_counter > 20 THEN 0.1 ELSE 0 END),
     0.72 + (CASE WHEN day_counter > 20 THEN 0.08 ELSE 0 END),
     0.68 + (CASE WHEN day_counter > 20 THEN 0.12 ELSE 0 END),
     now() - interval '29 days' + (day_counter || ' days')::interval,
     CASE WHEN day_counter > 20 THEN 'early_warning' ELSE 'qa_fixture' END);
    
    -- L5: Structural bottleneck
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l5_multiagency_approvals, current_user_id, 0.28, 0.32, 0.31,
     now() - interval '29 days' + (day_counter || ' days')::interval, 'qa_fixture');
  END LOOP;
  
  -- 5. Create breach events for L1
  INSERT INTO breach_events (loop_id, user_id, indicator_name, breach_type, value, threshold_value, at, severity_score, duration_minutes) VALUES
  (l1_emergency_throughput, current_user_id, 'response_time', 'upper_breach', 9.2, 8.0, now() - interval '5 days', 85, 120),
  (l1_emergency_throughput, current_user_id, 'response_time', 'upper_breach', 8.7, 8.0, now() - interval '12 days', 75, 90);
  
  -- 6. Create Test Tasks
  INSERT INTO tasks (id, user_id, title, description, capacity, status, loop_id, created_at, context) VALUES
  (l1_resp_task, current_user_id, 'QA: Emergency Response Stabilization', 'Stabilize emergency response times', 'responsive', 'open', l1_emergency_throughput, now() - interval '2 hours', '{"test_scenario": "responsive_flow", "fixture_id": "L1-resp"}'),
  (l2_refl_task, current_user_id, 'QA: KPI Oscillation Retune', 'Retune system to reduce KPI oscillation', 'reflexive', 'open', l2_kpi_oscillation, now() - interval '1 hour', '{"test_scenario": "reflexive_flow", "fixture_id": "L2-refl"}'),
  (l3_delib_task, current_user_id, 'QA: Congestion Policy Options', 'Analyze congestion policy options', 'deliberative', 'open', l3_congestion_policy, now() - interval '30 minutes', '{"test_scenario": "deliberative_flow", "fixture_id": "L3-delib"}'),
  (l4_anti_task, current_user_id, 'QA: Heatwave Demand Preparation', 'Prepare for heatwave demand surge', 'anticipatory', 'open', l4_heatwave_demand, now() - interval '45 minutes', '{"test_scenario": "anticipatory_flow", "fixture_id": "L4-anti"}'),
  (l5_struct_task, current_user_id, 'QA: Multi-Agency Process Redesign', 'Redesign multi-agency approval process', 'structural', 'open', l5_multiagency_approvals, now() - interval '1.5 hours', '{"test_scenario": "structural_flow", "fixture_id": "L5-struct"}');
  
  -- 7. Create Loop Scorecards
  INSERT INTO loop_scorecards (loop_id, user_id, tri_slope, de_state, breach_days, fatigue, claim_velocity, last_tri, heartbeat_at) VALUES
  (l1_emergency_throughput, current_user_id, -0.25, 'degrading', 5, 7, 0.8, '{"t_value": 0.45, "r_value": 0.48, "i_value": 0.43}', now() - interval '1 hour'),
  (l2_kpi_oscillation, current_user_id, 0.02, 'oscillating', 0, 3, 0.4, '{"t_value": 0.52, "r_value": 0.49, "i_value": 0.51}', now() - interval '30 minutes'),
  (l3_congestion_policy, current_user_id, 0.08, 'stable', 0, 1, 0.2, '{"t_value": 0.41, "r_value": 0.39, "i_value": 0.42}', now() - interval '45 minutes'),
  (l4_heatwave_demand, current_user_id, 0.15, 'early_warning', 0, 2, 0.6, '{"t_value": 0.78, "r_value": 0.82, "i_value": 0.75}', now() - interval '20 minutes'),
  (l5_multiagency_approvals, current_user_id, -0.05, 'bottleneck', 8, 9, 0.1, '{"t_value": 0.28, "r_value": 0.32, "i_value": 0.31}', now() - interval '2 hours');
  
  -- 8. Create Watchpoint (near-trip scenario)
  INSERT INTO watchpoints (loop_id, user_id, indicator, direction, threshold_value, owner, armed, last_eval, last_result) VALUES
  (l4_heatwave_demand, current_user_id, 'demand_ratio', 'up', 1.15, current_user_id, true, now() - interval '10 minutes', '{"value": 1.12, "tripped": false}');
  
  -- 9. Create Mandate rules for testing
  INSERT INTO mandate_rules (user_id, actor, allowed_levers, restrictions) VALUES
  (current_user_id, 'test_actor', ARRAY['N'], '{"P": "warning_required", "S": "blocked"}'),
  (current_user_id, 'emergency_manager', ARRAY['N', 'P'], '{"S": "approval_required"}'),
  (current_user_id, 'policy_director', ARRAY['N', 'P', 'S'], '{}');
  
  -- 10. Create test options
  INSERT INTO options (user_id, task_id, loop_id, name, actor, lever, cost, effort, time_to_impact, effect, evidence, status) VALUES
  (current_user_id, l3_delib_task, l3_congestion_policy, 'Congestion Pricing (N-lever)', 'traffic_manager', 'N', 50000, 3, '2 weeks', '{"impact_score": 0.7, "risk_score": 0.3}', '["Traffic modeling study"]', 'draft'),
  (current_user_id, l3_delib_task, l3_congestion_policy, 'Route Optimization (P-lever)', 'policy_director', 'P', 200000, 8, '3 months', '{"impact_score": 0.8, "risk_score": 0.5}', '["Infrastructure assessment"]', 'draft');
  
  -- 11. Create retune suggestion
  INSERT INTO retune_suggestions (loop_id, user_id, suggestion_type, title, description, rationale, risk_score, confidence, impact_level, proposed_changes, expected_improvement, status) VALUES
  (l2_kpi_oscillation, current_user_id, 'band_adjustment', 'Narrow Upper Bound', 'Reduce upper bound to decrease oscillation', 'KPI oscillating around band edges', 0.25, 0.85, 'medium', '{"upper_bound_delta": "-5%"}', '{"oscillation_reduction": "30%"}', 'pending');
  
  -- Build summary
  fixtures_summary := jsonb_build_object(
    'loops', jsonb_build_object(
      'l1_emergency_throughput', l1_emergency_throughput,
      'l2_kpi_oscillation', l2_kpi_oscillation,
      'l3_congestion_policy', l3_congestion_policy,
      'l4_heatwave_demand', l4_heatwave_demand,
      'l5_multiagency_approvals', l5_multiagency_approvals
    ),
    'tasks', jsonb_build_object(
      'l1_resp_task', l1_resp_task,
      'l2_refl_task', l2_refl_task,
      'l3_delib_task', l3_delib_task,
      'l4_anti_task', l4_anti_task,
      'l5_struct_task', l5_struct_task
    ),
    'created_at', now(),
    'user_id', current_user_id,
    'status', 'success'
  );
  
  RETURN fixtures_summary;
END;
$$ LANGUAGE plpgsql;

-- QA Dashboard helper functions
CREATE OR REPLACE FUNCTION reset_qa_scenario(scenario_name TEXT)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Reset specific scenario state
  CASE scenario_name
    WHEN 'responsive_flow' THEN
      -- Reset any active claims for responsive test
      UPDATE claims SET status = 'draft', started_at = NULL, paused_at = NULL 
      WHERE user_id = auth.uid() AND task_id IN (
        SELECT id FROM tasks WHERE user_id = auth.uid() AND context->>'test_scenario' = 'responsive_flow'
      );
      
    WHEN 'reflexive_flow' THEN
      -- Reset retune suggestions to pending
      UPDATE retune_suggestions SET status = 'pending', applied_at = NULL
      WHERE user_id = auth.uid() AND loop_id IN (
        SELECT loop_id FROM tasks WHERE user_id = auth.uid() AND context->>'test_scenario' = 'reflexive_flow'
      );
      
    WHEN 'anticipatory_flow' THEN
      -- Reset watchpoint state
      UPDATE watchpoints SET last_result = '{"value": 1.12, "tripped": false}', last_eval = now() - interval '10 minutes'
      WHERE user_id = auth.uid() AND indicator = 'demand_ratio';
      
    ELSE
      -- Generic reset
      NULL;
  END CASE;
  
  result := jsonb_build_object(
    'scenario', scenario_name,
    'reset_at', now(),
    'status', 'success'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;