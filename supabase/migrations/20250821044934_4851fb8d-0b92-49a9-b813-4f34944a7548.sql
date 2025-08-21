-- Seed default playbooks (resource/regulatory/comms) and trigger templates per risk channel.
-- Also a demo backtest builder that fabricates initial backtests for each seeded rule.

CREATE OR REPLACE FUNCTION seed_playbooks_and_triggers(p_org uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_user uuid := auth.uid();
  -- packs
  v_pack_resource uuid;
  v_pack_regulatory uuid;
  v_pack_comms uuid;
BEGIN
  PERFORM assert_owner(p_org);

  -- ===== Risk Channels & Seeds =====
  -- 1) External Demand
  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'resource', 'ExternalDemand – Resource Pack (Tier-2)',
   '[{"key":"stockpile","label":"Stage inventory at hubs"},{"key":"logistics","label":"Secure logistics windows"}]'::jsonb,
   array['Primary Vendor','Alt Vendor'], '72h to deploy', 250000, 0.65, 30, 'draft', v_user)
  RETURNING id INTO v_pack_resource;

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'regulatory', 'ExternalDemand – Regulatory Pack (Tier-2)',
   '[{"key":"permit","label":"Emergency permits fast-track"},{"key":"caps","label":"Temporary caps/waivers"}]'::jsonb,
   array['RegAuth'], '48h gazette', 0, 0.55, 15, 'draft', v_user);

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'comms', 'ExternalDemand – Comms Pack (Tier-2)',
   '[{"key":"script","label":"Operator comms scripts"},{"key":"public","label":"Citizen advisory template"}]'::jsonb,
   array['GovComms'], 'Same-day', 0, 0.75, 10, 'draft', v_user);

  INSERT INTO antic_trigger_rules(org_id, name, expr_raw, expr_ast, window_hours, action_ref, authority, consent_note, valid_from, expires_at, created_by)
  VALUES (p_org, 'External demand slump', 'orderbook_7d <= -0.20 AND REER_change >= 0.08',
    '{"type":"and","clauses":[{"measure":"orderbook_7d","op":"<=","value":-0.20},{"measure":"REER_change","op":">=","value":0.08}]}'::jsonb,
    168, 'prepos:'||v_pack_resource::text, 'Treasury + Trade', null, now(), now() + interval '30 days', v_user);

  -- 2) Heat
  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'resource', 'Heat – Resource Pack (Tier-2)',
   '[{"key":"cooling","label":"Emergency cooling centers"},{"key":"medical","label":"Heat stress supplies"}]'::jsonb,
   array['Emergency Vendor','Health Supply'], '48h to deploy', 150000, 0.70, 14, 'draft', v_user)
  RETURNING id INTO v_pack_resource;

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'regulatory', 'Heat – Regulatory Pack (Tier-2)',
   '[{"key":"emergency","label":"Emergency declarations"},{"key":"standards","label":"Workplace heat standards waiver"}]'::jsonb,
   array['Health Authority'], '24h emergency', 0, 0.60, 7, 'draft', v_user);

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'comms', 'Heat – Comms Pack (Tier-2)',
   '[{"key":"warnings","label":"Heat warning alerts"},{"key":"guidance","label":"Public safety guidance"}]'::jsonb,
   array['Emergency Broadcast'], 'Immediate', 0, 0.85, 5, 'draft', v_user);

  INSERT INTO antic_trigger_rules(org_id, name, expr_raw, expr_ast, window_hours, action_ref, authority, consent_note, valid_from, expires_at, created_by)
  VALUES (p_org, 'Heatwave alert', 'avg_7d.HeatIndex >= 0.75',
    '{"type":"and","clauses":[{"measure":"avg_7d.HeatIndex","op":">=","value":0.75}]}'::jsonb,
    168, 'prepos:'||v_pack_resource::text, 'Health + Emergency', null, now(), now() + interval '30 days', v_user);

  -- 3) WaterStress
  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'resource', 'WaterStress – Resource Pack (Tier-2)',
   '[{"key":"tanks","label":"Emergency water tanks"},{"key":"purification","label":"Water purification units"}]'::jsonb,
   array['Water Infrastructure','Emergency Supply'], '96h to deploy', 300000, 0.60, 60, 'draft', v_user)
  RETURNING id INTO v_pack_resource;

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'regulatory', 'WaterStress – Regulatory Pack (Tier-2)',
   '[{"key":"rationing","label":"Water rationing authority"},{"key":"restrictions","label":"Usage restriction orders"}]'::jsonb,
   array['Water Authority'], '72h process', 0, 0.50, 21, 'draft', v_user);

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'comms', 'WaterStress – Comms Pack (Tier-2)',
   '[{"key":"conservation","label":"Conservation messaging"},{"key":"restrictions","label":"Restriction announcements"}]'::jsonb,
   array['Public Affairs'], '12h turnaround', 0, 0.80, 7, 'draft', v_user);

  INSERT INTO antic_trigger_rules(org_id, name, expr_raw, expr_ast, window_hours, action_ref, authority, consent_note, valid_from, expires_at, created_by)
  VALUES (p_org, 'Water stress rising', 'NRW_change_30d >= 0.15 OR StressIndex >= 0.70',
    '{"type":"or","clauses":[{"measure":"NRW_change_30d","op":">=","value":0.15},{"measure":"StressIndex","op":">=","value":0.70}]}'::jsonb,
    720, 'prepos:'||v_pack_resource::text, 'Water Authority', null, now(), now() + interval '45 days', v_user);

  -- 4) SupplyChain
  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'resource', 'SupplyChain – Resource Pack (Tier-2)',
   '[{"key":"alternate_routes","label":"Alternate transport routes"},{"key":"warehouse","label":"Buffer warehouse space"}]'::jsonb,
   array['Logistics Provider','Warehouse Corp'], '48h activation', 180000, 0.75, 90, 'draft', v_user)
  RETURNING id INTO v_pack_resource;

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'regulatory', 'SupplyChain – Regulatory Pack (Tier-2)',
   '[{"key":"hours","label":"Extended operating hours"},{"key":"priority","label":"Priority lane access"}]'::jsonb,
   array['Transport Authority'], '24h approval', 0, 0.65, 30, 'draft', v_user);

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'comms', 'SupplyChain – Comms Pack (Tier-2)',
   '[{"key":"shipper_alerts","label":"Shipper coordination alerts"},{"key":"consumer","label":"Consumer impact messaging"}]'::jsonb,
   array['Industry Liaison'], '6h notification', 0, 0.90, 3, 'draft', v_user);

  INSERT INTO antic_trigger_rules(org_id, name, expr_raw, expr_ast, window_hours, action_ref, authority, consent_note, valid_from, expires_at, created_by)
  VALUES (p_org, 'Port congestion spike', 'port_wait_p95 >= 0.80 AND supplier_risk >= 0.60',
    '{"type":"and","clauses":[{"measure":"port_wait_p95","op":">=","value":0.80},{"measure":"supplier_risk","op":">=","value":0.60}]}'::jsonb,
    72, 'prepos:'||v_pack_resource::text, 'Transport + Economy', null, now(), now() + interval '21 days', v_user);

  -- 5) EnergyReliability
  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'resource', 'EnergyReliability – Resource Pack (Tier-2)',
   '[{"key":"generators","label":"Mobile generator units"},{"key":"fuel","label":"Emergency fuel reserves"}]'::jsonb,
   array['Generator Rental','Fuel Supply'], '24h deployment', 400000, 0.80, 45, 'draft', v_user)
  RETURNING id INTO v_pack_resource;

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'regulatory', 'EnergyReliability – Regulatory Pack (Tier-2)',
   '[{"key":"emergency_power","label":"Emergency power protocols"},{"key":"load_shed","label":"Load shedding authority"}]'::jsonb,
   array['Energy Regulator'], '12h emergency', 0, 0.70, 14, 'draft', v_user);

  INSERT INTO antic_pre_position_orders(org_id, kind, title, items, suppliers, sla, cost_ceiling, readiness_score, shelf_life_days, status, created_by)
  VALUES
  (p_org, 'comms', 'EnergyReliability – Comms Pack (Tier-2)',
   '[{"key":"outage_alerts","label":"Outage notification system"},{"key":"conservation","label":"Energy conservation appeals"}]'::jsonb,
   array['Utility Comms'], '30min alert', 0, 0.95, 1, 'draft', v_user);

  INSERT INTO antic_trigger_rules(org_id, name, expr_raw, expr_ast, window_hours, action_ref, authority, consent_note, valid_from, expires_at, created_by)
  VALUES (p_org, 'Reserve margin breach', 'reserve_margin <= 0.12',
    '{"type":"and","clauses":[{"measure":"reserve_margin","op":"<=","value":0.12}]}'::jsonb,
    24, 'prepos:'||v_pack_resource::text, 'Energy Regulator + SO', null, now(), now() + interval '14 days', v_user);
END;
$$;

-- Build basic demo backtests for all rules (fabricated metrics/points)
CREATE OR REPLACE FUNCTION seed_demo_backtests(p_org uuid, p_horizon text DEFAULT 'P180D')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE 
  r record;
  pts jsonb;
  auc numeric := 0.80;
  prec numeric := 0.72;
  rec numeric := 0.66;
  f1 numeric := (2*prec*rec)/(prec+rec);
  d int;
  t timestamptz;
  fired int;
  breach int;
BEGIN
  PERFORM assert_owner(p_org);

  FOR r IN
    SELECT id FROM antic_trigger_rules
    WHERE org_id = p_org
  LOOP
    pts := '[]'::jsonb;
    FOR d IN 0..59 LOOP
      t := now() - make_interval(days => (59 - d));
      fired := (CASE WHEN random() > 0.7 THEN 1 ELSE 0 END);
      breach := (CASE WHEN random() > 0.75 THEN 1 ELSE 0 END);
      pts := pts || jsonb_build_object(
        't', to_char(t,'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'fired', fired, 
        'breach', breach, 
        'score', round((random())::numeric,3)
      );
    END LOOP;

    INSERT INTO antic_backtests(org_id, rule_id, horizon, metrics, points, created_by)
    VALUES (p_org, r.id, p_horizon, 
      jsonb_build_object('auc',auc,'precision',prec,'recall',rec,'f1',f1), 
      pts, auth.uid());
  END LOOP;
END;
$$;