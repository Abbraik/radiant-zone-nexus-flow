-- OWNER CHECK (assumes profiles table with role column)
CREATE OR REPLACE FUNCTION assert_owner(p_org uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE 
  v_role text; 
  v_org uuid;
BEGIN
  SELECT 
    CASE 
      WHEN EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN 'owner'
      ELSE 'user'
    END,
    auth.uid()
  INTO v_role, v_org;
  
  IF v_role IS DISTINCT FROM 'owner' OR v_org IS DISTINCT FROM p_org THEN
    RAISE EXCEPTION 'FORBIDDEN: owner role required for org %', p_org USING errcode = '42501';
  END IF;
END;
$$;

-- FAST MOCK SERIES (deterministic noise)
CREATE OR REPLACE FUNCTION gen_indicator_series(
  p_org uuid, 
  p_loop text, 
  p_ind text, 
  p_days int,
  p_base numeric, 
  p_amp numeric, 
  p_period numeric, 
  p_breach_start int DEFAULT NULL, 
  p_breach_days int DEFAULT NULL, 
  p_breach_delta numeric DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE 
  d int; 
  ts timestamptz; 
  val numeric; 
  lo numeric; 
  hi numeric;
BEGIN
  PERFORM assert_owner(p_org);
  
  FOR d IN 0..p_days-1 LOOP
    ts := now() - make_interval(days => (p_days-1 - d));
    val := p_base + p_amp * sin((d::numeric)/nullif(p_period,0));
    
    IF p_breach_start IS NOT NULL AND p_breach_days IS NOT NULL AND 
       d BETWEEN p_breach_start AND p_breach_start + p_breach_days THEN
      val := val + coalesce(p_breach_delta, 0.2);
    END IF;
    
    lo := p_base - 0.15; 
    hi := p_base + 0.15;
    
    INSERT INTO indicator_readings(org_id, loop_code, indicator, t, value, lower, upper)
    VALUES (p_org, p_loop, p_ind, ts, val, lo, hi)
    ON CONFLICT (org_id, loop_code, indicator, t) DO NOTHING;
  END LOOP;
END;
$$;

-- BULK JSON INGEST (safe shape)
CREATE OR REPLACE FUNCTION ingest_indicator_json(p_org uuid, p_payload jsonb)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE 
  rec jsonb; 
  cnt int := 0;
BEGIN
  PERFORM assert_owner(p_org);
  
  -- expected JSON array of objects: [{loop_code, indicator, t, value, lower?, upper?}]
  FOR rec IN SELECT * FROM jsonb_array_elements(p_payload) LOOP
    INSERT INTO indicator_readings(org_id, loop_code, indicator, t, value, lower, upper)
    VALUES (
      p_org,
      (rec->>'loop_code'),
      (rec->>'indicator'),
      (rec->>'t')::timestamptz,
      (rec->>'value')::numeric,
      nullif(rec->>'lower','')::numeric,
      nullif(rec->>'upper','')::numeric
    )
    ON CONFLICT (org_id, loop_code, indicator, t) DO NOTHING;
    cnt := cnt + 1;
  END LOOP;
  
  RETURN cnt;
END;
$$;

-- OWNER-ONLY SEEDERS (EWS, Buffers, Geo, Scenarios, Triggers drafts)
CREATE OR REPLACE FUNCTION seed_anticipatory_minimal(p_org uuid)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
  PERFORM assert_owner(p_org);

  -- Scenarios (align with Anticipatory UI defaults)
  INSERT INTO antic_scenarios(id, org_id, name, assumptions, target_loops, created_by)
  VALUES
  ('sc_fuel_up_25', p_org, 'Fuel price +25%', '{"fuelPricePct":25}'::jsonb, array['MES-L07','MAC-L03','MIC-L07'], auth.uid()),
  ('sc_heatwave_week', p_org, 'Heatwave (7 days)', '{"heatIndex":3,"days":7}'::jsonb, array['MES-L01','MAC-L07'], auth.uid()),
  ('sc_export_down_30', p_org, 'Export orderbook −30%', '{"ordersPct":-30}'::jsonb, array['MAC-L06','MES-L03'], auth.uid())
  ON CONFLICT (id) DO NOTHING;

  -- EWS components (example weights & tiny series)
  INSERT INTO antic_ews_components(org_id, loop_code, label, weight, series)
  VALUES
  (p_org, 'MAC-L06', 'External Orders', 0.4, '[{"t":"2025-07-01","v":0.55},{"t":"2025-07-08","v":0.58},{"t":"2025-07-15","v":0.63}]'::jsonb),
  (p_org, 'MAC-L06', 'REER', 0.35, '[{"t":"2025-07-01","v":0.50},{"t":"2025-07-08","v":0.52},{"t":"2025-07-15","v":0.59}]'::jsonb),
  (p_org, 'MAC-L06', 'Port Congestion', 0.25, '[{"t":"2025-07-01","v":0.47},{"t":"2025-07-08","v":0.49},{"t":"2025-07-15","v":0.53}]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Buffers (display only)
  INSERT INTO antic_buffers(org_id, label, current, target) 
  VALUES
  (p_org, 'Fiscal buffer', 0.32, 0.50),
  (p_org, 'Inventory days', 0.28, 0.40)
  ON CONFLICT DO NOTHING;

  -- Geo cells (8x4 = 32)
  INSERT INTO antic_geo_sentinels(org_id, cell_id, label, value)
  SELECT p_org, concat('C', g)::text, null, (random()*0.7 + 0.15)
  FROM generate_series(1,32) g
  ON CONFLICT DO NOTHING;

  -- Watchpoints
  INSERT INTO antic_watchpoints(org_id, risk_channel, loop_codes, ews_prob, confidence, buffer_adequacy, lead_time_days, status, review_at, created_by)
  VALUES
  (p_org, 'external_demand', array['MAC-L06'], 0.72, 0.85, 0.65, 14, 'armed', now() + interval '30 days', auth.uid()),
  (p_org, 'heat_stress', array['MES-L01'], 0.68, 0.82, 0.58, 7, 'armed', now() + interval '14 days', auth.uid()),
  (p_org, 'supply_chain', array['MIC-L07'], 0.45, 0.75, 0.72, 21, 'disarmed', now() + interval '60 days', auth.uid())
  ON CONFLICT DO NOTHING;

  -- Trigger Rules
  INSERT INTO antic_trigger_rules(org_id, name, expr_raw, expr_ast, window_hours, authority, action_ref, valid_from, expires_at, created_by)
  VALUES
  (p_org, 'High EWS Alert', 'ews_prob > 0.8', '{"op":">","left":"ews_prob","right":0.8}'::jsonb, 24, 'system', 'alert_high_ews', now(), now() + interval '90 days', auth.uid()),
  (p_org, 'Buffer Depletion', 'buffer_adequacy < 0.3', '{"op":"<","left":"buffer_adequacy","right":0.3}'::jsonb, 12, 'system', 'alert_buffer_low', now(), now() + interval '90 days', auth.uid())
  ON CONFLICT DO NOTHING;
END;
$$;

-- QUICK LOOP READINESS: seeds indicator readings for External Demand (MAC-L06) + Heat (MES-L01)
CREATE OR REPLACE FUNCTION seed_mock_indicators(p_org uuid)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
  PERFORM assert_owner(p_org);
  PERFORM gen_indicator_series(p_org, 'MAC-L06', 'Export Orderbook', 180, 0.55, 0.08, 6, 120, 15, -0.25);
  PERFORM gen_indicator_series(p_org, 'MAC-L06', 'REER change', 180, 0.05, 0.03, 12, 120, 15, 0.05);
  PERFORM gen_indicator_series(p_org, 'MES-L01', 'Heat Index', 180, 0.62, 0.12, 8, 60, 7, 0.25);
END;
$$;