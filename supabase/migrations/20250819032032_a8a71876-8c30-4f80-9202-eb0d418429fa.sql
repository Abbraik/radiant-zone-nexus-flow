-- QA Test Fixtures for Five Capacities Validation

-- Create QA test data for comprehensive E2E testing
DO $$
DECLARE
  qa_user_id UUID := '11111111-1111-1111-1111-111111111111'::UUID; -- Fixed test user ID
  
  -- Loop IDs for test scenarios
  l1_emergency_throughput UUID := '22222222-2222-2222-2222-222222222221'::UUID;
  l2_kpi_oscillation UUID := '22222222-2222-2222-2222-222222222222'::UUID;
  l3_congestion_policy UUID := '22222222-2222-2222-2222-222222222223'::UUID;
  l4_heatwave_demand UUID := '22222222-2222-2222-2222-222222222224'::UUID;
  l5_multiagency_approvals UUID := '22222222-2222-2222-2222-222222222225'::UUID;
  
  -- Task IDs for scenarios
  l1_resp_task UUID := '33333333-3333-3333-3333-333333333331'::UUID;
  l2_refl_task UUID := '33333333-3333-3333-3333-333333333332'::UUID;
  l3_delib_task UUID := '33333333-3333-3333-3333-333333333333'::UUID;
  l4_anti_task UUID := '33333333-3333-3333-3333-333333333334'::UUID;
  l5_struct_task UUID := '33333333-3333-3333-3333-333333333335'::UUID;
  
  day_counter INTEGER;
  tri_base NUMERIC;
BEGIN
  -- Only create QA fixtures if QA_MODE is enabled (check via function parameter or fixed condition)
  
  -- 1. Test Loops
  INSERT INTO loops (id, user_id, name, description, type, scale, loop_type, status, leverage_default) VALUES
  (l1_emergency_throughput, qa_user_id, 'Emergency Throughput', 'Emergency response throughput management', 'operational', 'meso', 'reactive', 'active', 'N'),
  (l2_kpi_oscillation, qa_user_id, 'KPI Oscillation', 'KPI stability optimization', 'operational', 'micro', 'perceptual', 'active', 'N'),
  (l3_congestion_policy, qa_user_id, 'Congestion Policy Design', 'Traffic congestion policy framework', 'strategic', 'macro', 'structural', 'active', 'P'),
  (l4_heatwave_demand, qa_user_id, 'Heatwave Demand', 'Energy demand during heatwaves', 'operational', 'macro', 'reactive', 'active', 'N'),
  (l5_multiagency_approvals, qa_user_id, 'Multi-Agency Approvals', 'Cross-agency approval bottlenecks', 'governance', 'meso', 'structural', 'active', 'S');
  
  -- 2. DE Bands for each loop
  INSERT INTO de_bands (loop_id, user_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, notes) VALUES
  (l1_emergency_throughput, qa_user_id, 'response_time', 2.0, 8.0, 0.3, 0.2, 'Emergency response time bands - frequent breaches expected'),
  (l2_kpi_oscillation, qa_user_id, 'efficiency_score', 75.0, 95.0, 0.5, 0.4, 'Efficiency oscillation bands - tight monitoring'),
  (l3_congestion_policy, qa_user_id, 'congestion_index', 0.3, 0.7, 0.4, 0.3, 'Congestion policy effectiveness bands'),
  (l4_heatwave_demand, qa_user_id, 'demand_ratio', 0.8, 1.2, 0.6, 0.25, 'Energy demand ratio bands - anticipatory monitoring'),
  (l5_multiagency_approvals, qa_user_id, 'approval_time', 3.0, 14.0, 0.7, 0.35, 'Multi-agency approval time bands');
  
  -- 3. SRT Windows
  INSERT INTO srt_windows (loop_id, user_id, window_start, window_end, reflex_horizon, cadence) VALUES
  (l1_emergency_throughput, qa_user_id, now() - interval '30 days', now() + interval '30 days', '30 minutes', '2 hours'),
  (l2_kpi_oscillation, qa_user_id, now() - interval '45 days', now() + interval '45 days', '4 hours', '1 day'),
  (l3_congestion_policy, qa_user_id, now() - interval '60 days', now() + interval '60 days', '1 week', '2 weeks'),
  (l4_heatwave_demand, qa_user_id, now() - interval '90 days', now() + interval '90 days', '2 hours', '6 hours'),
  (l5_multiagency_approvals, qa_user_id, now() - interval '120 days', now() + interval '120 days', '3 days', '1 week');
  
  -- 4. Generate TRI time series for 90 days (realistic patterns per scenario)
  FOR day_counter IN 0..89 LOOP
    -- L1: Emergency Throughput - frequent breaches, declining trend
    tri_base := 0.6 - (day_counter * 0.003) + (random() - 0.5) * 0.2;
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l1_emergency_throughput, qa_user_id, 
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.15)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.1)), 
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.12)),
     now() - interval '89 days' + (day_counter || ' days')::interval,
     CASE WHEN day_counter % 7 = 0 THEN 'weekly_review' ELSE 'daily_update' END);
    
    -- L2: KPI Oscillation - flat slope, oscillating pattern
    tri_base := 0.5 + sin(day_counter * 0.2) * 0.1;
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l2_kpi_oscillation, qa_user_id,
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.05)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.05)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.05)),
     now() - interval '89 days' + (day_counter || ' days')::interval,
     'oscillation_pattern');
    
    -- L3: Congestion Policy - stable with clear improvement opportunity
    tri_base := 0.4 + (day_counter * 0.001);
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l3_congestion_policy, qa_user_id,
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.08)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.06)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.07)),
     now() - interval '89 days' + (day_counter || ' days')::interval,
     'policy_design_phase');
    
    -- L4: Heatwave Demand - with early warning signals
    tri_base := 0.7 + (CASE WHEN day_counter > 60 THEN 0.15 ELSE 0 END);
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l4_heatwave_demand, qa_user_id,
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.1)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.12)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.08)),
     now() - interval '89 days' + (day_counter || ' days')::interval,
     CASE WHEN day_counter > 60 THEN 'early_warning' ELSE 'baseline' END);
    
    -- L5: Multi-Agency - structural bottleneck pattern
    tri_base := 0.3 + (CASE WHEN day_counter % 14 < 7 THEN 0.2 ELSE 0 END);
    INSERT INTO tri_events (loop_id, user_id, t_value, r_value, i_value, at, tag) VALUES
    (l5_multiagency_approvals, qa_user_id,
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.1)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.15)),
     GREATEST(0, LEAST(1, tri_base + (random() - 0.5) * 0.1)),
     now() - interval '89 days' + (day_counter || ' days')::interval,
     'structural_bottleneck');
  END LOOP;
  
  -- 5. Breach events for L1 (frequent breaches)
  INSERT INTO breach_events (loop_id, user_id, indicator_name, breach_type, value, threshold_value, at, severity_score, duration_minutes) VALUES
  (l1_emergency_throughput, qa_user_id, 'response_time', 'upper_breach', 9.2, 8.0, now() - interval '5 days', 85, 120),
  (l1_emergency_throughput, qa_user_id, 'response_time', 'upper_breach', 8.7, 8.0, now() - interval '12 days', 75, 90),
  (l1_emergency_throughput, qa_user_id, 'response_time', 'upper_breach', 10.1, 8.0, now() - interval '18 days', 95, 180);
  
  -- 6. Test Tasks (one per capacity)
  INSERT INTO tasks (id, user_id, title, description, capacity, status, loop_id, created_at, context) VALUES
  (l1_resp_task, qa_user_id, 'Emergency Response Stabilization', 'Stabilize emergency response times', 'responsive', 'open', l1_emergency_throughput, now() - interval '2 hours', '{"test_scenario": "responsive_flow", "fixture_id": "L1-resp"}'),
  (l2_refl_task, qa_user_id, 'KPI Oscillation Retune', 'Retune system to reduce KPI oscillation', 'reflexive', 'open', l2_kpi_oscillation, now() - interval '1 hour', '{"test_scenario": "reflexive_flow", "fixture_id": "L2-refl"}'),
  (l3_delib_task, qa_user_id, 'Congestion Policy Options', 'Analyze congestion policy options', 'deliberative', 'open', l3_congestion_policy, now() - interval '30 minutes', '{"test_scenario": "deliberative_flow", "fixture_id": "L3-delib"}'),
  (l4_anti_task, qa_user_id, 'Heatwave Demand Preparation', 'Prepare for heatwave demand surge', 'anticipatory', 'open', l4_heatwave_demand, now() - interval '45 minutes', '{"test_scenario": "anticipatory_flow", "fixture_id": "L4-anti"}'),
  (l5_struct_task, qa_user_id, 'Multi-Agency Process Redesign', 'Redesign multi-agency approval process', 'structural', 'open', l5_multiagency_approvals, now() - interval '1.5 hours', '{"test_scenario": "structural_flow", "fixture_id": "L5-struct"}');
  
  -- 7. Loop Scorecards
  INSERT INTO loop_scorecards (loop_id, user_id, tri_slope, de_state, breach_days, fatigue, claim_velocity, last_tri, heartbeat_at) VALUES
  (l1_emergency_throughput, qa_user_id, -0.25, 'degrading', 5, 7, 0.8, '{"t_value": 0.45, "r_value": 0.48, "i_value": 0.43}', now() - interval '1 hour'),
  (l2_kpi_oscillation, qa_user_id, 0.02, 'oscillating', 0, 3, 0.4, '{"t_value": 0.52, "r_value": 0.49, "i_value": 0.51}', now() - interval '30 minutes'),
  (l3_congestion_policy, qa_user_id, 0.08, 'stable', 0, 1, 0.2, '{"t_value": 0.41, "r_value": 0.39, "i_value": 0.42}', now() - interval '45 minutes'),
  (l4_heatwave_demand, qa_user_id, 0.15, 'early_warning', 0, 2, 0.6, '{"t_value": 0.78, "r_value": 0.82, "i_value": 0.75}', now() - interval '20 minutes'),
  (l5_multiagency_approvals, qa_user_id, -0.05, 'bottleneck', 8, 9, 0.1, '{"t_value": 0.28, "r_value": 0.32, "i_value": 0.31}', now() - interval '2 hours');
  
  -- 8. Watchpoints for L4 (near-trip scenario)
  INSERT INTO watchpoints (loop_id, user_id, indicator, direction, threshold_value, owner, armed, last_eval, last_result) VALUES
  (l4_heatwave_demand, qa_user_id, 'demand_ratio', 'up', 1.15, qa_user_id, true, now() - interval '10 minutes', '{"value": 1.12, "tripped": false, "last_check": "' || (now() - interval '10 minutes')::text || '"}');
  
  -- 9. Mandate rules for testing (N ok, P warn, S blocked)
  INSERT INTO mandate_rules (user_id, actor, allowed_levers, restrictions) VALUES
  (qa_user_id, 'test_actor', ARRAY['N'], '{"P": "warning_required", "S": "blocked"}'),
  (qa_user_id, 'emergency_manager', ARRAY['N', 'P'], '{"S": "approval_required"}'),
  (qa_user_id, 'policy_director', ARRAY['N', 'P', 'S'], '{}');
  
  -- 10. Test options for deliberative scenario
  INSERT INTO options (user_id, task_id, loop_id, name, actor, lever, cost, effort, time_to_impact, effect, evidence, status) VALUES
  (qa_user_id, l3_delib_task, l3_congestion_policy, 'Congestion Pricing (N-lever)', 'traffic_manager', 'N', 50000, 3, '2 weeks', '{"impact_score": 0.7, "risk_score": 0.3}', '["Traffic modeling study", "Pilot program results"]', 'draft'),
  (qa_user_id, l3_delib_task, l3_congestion_policy, 'Route Optimization (P-lever)', 'policy_director', 'P', 200000, 8, '3 months', '{"impact_score": 0.8, "risk_score": 0.5}', '["Infrastructure assessment", "Public consultation"]', 'draft');
  
  -- 11. Retune suggestions for L2
  INSERT INTO retune_suggestions (loop_id, user_id, suggestion_type, title, description, rationale, risk_score, confidence, impact_level, proposed_changes, expected_improvement, status) VALUES
  (l2_kpi_oscillation, qa_user_id, 'band_adjustment', 'Narrow Upper Bound', 'Reduce upper bound to decrease oscillation', 'KPI oscillating around band edges - tighter bounds may improve stability', 0.25, 0.85, 'medium', '{"upper_bound_delta": "-5%", "asymmetry_delta": "0.05"}', '{"oscillation_reduction": "30%", "stability_improvement": "25%"}', 'pending');
  
END $$;