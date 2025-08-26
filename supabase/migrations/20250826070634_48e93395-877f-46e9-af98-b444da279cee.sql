-- Golden Scenarios: Archive Mock Tasks and Setup Live Triggers
-- Migration for replacing mock workspace tasks with real backend flow

-- 1) Archive existing mock tasks (safe approach)
UPDATE tasks 
SET status = 'cancelled', 
    payload = jsonb_set(
      COALESCE(payload, '{}'::jsonb), 
      '{archived_reason}', 
      '"mock_cleanup"'
    ),
    updated_at = now()
WHERE (
  payload->>'seed' = 'mock' 
  OR title ILIKE '%mock%' 
  OR template_key ILIKE 'mock_%'
  OR payload->>'_mock' = 'true'
);

-- Mark mock triggers as disabled
UPDATE triggers 
SET enabled = false, 
    updated_at = now()
WHERE (
  dsl ILIKE '%MOCK%' 
  OR template_key ILIKE 'mock_%'
  OR payload->>'seed' = 'mock'
);

-- 2) Create Golden Scenario Loops (if not exist)
INSERT INTO loops (id, loop_code, title, description, user_id, metadata) VALUES
  (gen_random_uuid(), 'FER-L01', 'Fertility & Childcare Access', 'Childcare wait times and fertility rate correlation loop', auth.uid(), '{"scenario": "fertility", "golden": true}'::jsonb),
  (gen_random_uuid(), 'LAB-L01', 'Labour Market Matching', 'Job vacancy filling and skills mismatch loop', auth.uid(), '{"scenario": "labour", "golden": true}'::jsonb),
  (gen_random_uuid(), 'SOC-L01', 'Social Cohesion & Trust', 'Community trust and service satisfaction loop', auth.uid(), '{"scenario": "cohesion", "golden": true}'::jsonb)
ON CONFLICT (loop_code) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- 3) Create Golden Scenario Indicators
WITH golden_loops AS (
  SELECT id, loop_code FROM loops WHERE loop_code IN ('FER-L01', 'LAB-L01', 'SOC-L01')
)
INSERT INTO indicator_registry (indicator_key, loop_id, title, unit, triad_tag, snl_key, notes, user_id) 
SELECT 
  indicators.indicator_key,
  gl.id,
  indicators.title,
  indicators.unit,
  indicators.triad_tag,
  indicators.snl_key,
  indicators.notes,
  auth.uid()
FROM golden_loops gl
CROSS JOIN (
  VALUES 
    ('childcare_wait_days', 'Childcare Wait Time', 'days', 'institution', 'INST.SERVICE.CHILDCARE', 'Average wait time for childcare placement'),
    ('fertility_intention_gap', 'Fertility Intention Gap', 'ratio', 'population', 'POP.INTENTION.FERTILITY', 'Gap between desired and actual fertility rates'),
    ('job_vacancy_fill_time', 'Job Vacancy Fill Time', 'days', 'institution', 'INST.LABOUR.MATCHING', 'Average time to fill job vacancies'),
    ('skills_mismatch_ratio', 'Skills Mismatch Ratio', 'ratio', 'domain', 'DOM.SKILLS.MISMATCH', 'Ratio indicating skills mismatch in labour market'),
    ('trust_index', 'Community Trust Index', 'index', 'population', 'POP.TRUST.GOVERNMENT', 'Weekly pulse measurement of community trust levels'),
    ('service_satisfaction', 'Service Satisfaction Rate', 'rate', 'institution', 'INST.SERVICE.SATISFACTION', 'Rate of service satisfaction and outage recovery')
) AS indicators(indicator_key, title, unit, triad_tag, snl_key, notes)
WHERE (
  (gl.loop_code = 'FER-L01' AND indicators.indicator_key IN ('childcare_wait_days', 'fertility_intention_gap')) OR
  (gl.loop_code = 'LAB-L01' AND indicators.indicator_key IN ('job_vacancy_fill_time', 'skills_mismatch_ratio')) OR
  (gl.loop_code = 'SOC-L01' AND indicators.indicator_key IN ('trust_index', 'service_satisfaction'))
)
ON CONFLICT (indicator_key) DO UPDATE SET
  title = EXCLUDED.title,
  unit = EXCLUDED.unit,
  triad_tag = EXCLUDED.triad_tag,
  snl_key = EXCLUDED.snl_key,
  notes = EXCLUDED.notes;

-- 4) Create Golden Scenario Watchpoints
WITH golden_loops AS (
  SELECT id, loop_code FROM loops WHERE loop_code IN ('FER-L01', 'LAB-L01', 'SOC-L01')
)
INSERT INTO antic_watchpoints (org_id, risk_channel, loop_codes, ews_prob, confidence, buffer_adequacy, lead_time_days, status, review_at, created_by, notes) 
VALUES
  (auth.uid(), 'childcare_surge', ARRAY['FER-L01'], 0.65, 0.80, 0.70, 14, 'armed', now() + interval '30 days', auth.uid(), 'Childcare capacity vs demand monitoring'),
  (auth.uid(), 'labour_mismatch', ARRAY['LAB-L01'], 0.70, 0.85, 0.60, 21, 'armed', now() + interval '30 days', auth.uid(), 'Skills-jobs matching efficiency'),
  (auth.uid(), 'trust_divergence', ARRAY['SOC-L01'], 0.55, 0.75, 0.80, 60, 'armed', now() + interval '60 days', auth.uid(), 'Community trust vs service performance gap')
ON CONFLICT (risk_channel) DO UPDATE SET
  ews_prob = EXCLUDED.ews_prob,
  confidence = EXCLUDED.confidence,
  buffer_adequacy = EXCLUDED.buffer_adequacy,
  status = 'armed',
  updated_at = now();

-- 5) Create Golden Scenario Triggers
INSERT INTO antic_trigger_rules (org_id, name, expr_raw, expr_ast, window_hours, action_ref, authority, valid_from, expires_at, created_by) 
VALUES
  (auth.uid(), 'Childcare Surge Response', 
   'childcare_wait_days >= 30 AND trend(childcare_wait_days, 14d) > 0.1', 
   '{"type":"and","clauses":[{"measure":"childcare_wait_days","op":">=","value":30},{"measure":"trend(childcare_wait_days,14d)","op":">","value":0.1}]}'::jsonb,
   168, 'containment_pack', 'Municipal + Health', now(), now() + interval '90 days', auth.uid()),
  
  (auth.uid(), 'Labour Mismatch Alert',
   'job_vacancy_fill_time >= 35 AND skills_mismatch_ratio >= 1.3',
   '{"type":"and","clauses":[{"measure":"job_vacancy_fill_time","op":">=","value":35},{"measure":"skills_mismatch_ratio","op":">=","value":1.3}]}'::jsonb,
   336, 'readiness_plan', 'Employment + Education', now(), now() + interval '90 days', auth.uid()),
   
  (auth.uid(), 'Trust Divergence Monitor',
   'slope(trust_index, 28d) < -0.05 AND service_satisfaction >= 0.7',
   '{"type":"and","clauses":[{"measure":"slope(trust_index,28d)","op":"<","value":-0.05},{"measure":"service_satisfaction","op":">=","value":0.7}]}'::jsonb,
   720, 'portfolio_compare', 'Community Engagement + Operations', now() + interval '7 days', now() + interval '120 days', auth.uid())
ON CONFLICT (name) DO UPDATE SET
  expr_raw = EXCLUDED.expr_raw,
  expr_ast = EXCLUDED.expr_ast,
  action_ref = EXCLUDED.action_ref,
  authority = EXCLUDED.authority,
  expires_at = EXCLUDED.expires_at,
  updated_at = now();

-- 6) Create Task Templates for Golden Scenarios
INSERT INTO task_templates (id, name, description, default_priority, estimated_duration, template_config, created_by) VALUES
  ('tpl-containment-pack', 'Childcare Containment Pack', 'Responsive tasks for childcare surge mitigation', 'high', 480, '{"capacity":"responsive","checklist":["assess_capacity","emergency_providers","parent_communication"],"sla_hours":24}'::jsonb, auth.uid()),
  ('tpl-readiness-plan', 'Labour Readiness Plan', 'Anticipatory preparation for skills-jobs matching', 'medium', 1440, '{"capacity":"anticipatory","checklist":["skills_audit","employer_outreach","training_pipeline"],"sla_hours":72}'::jsonb, auth.uid()),
  ('tpl-portfolio-compare', 'Trust Portfolio Analysis', 'Deliberative comparison of community engagement options', 'medium', 2160, '{"capacity":"deliberative","checklist":["stakeholder_analysis","option_generation","impact_assessment"],"sla_hours":120}'::jsonb, auth.uid())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  template_config = EXCLUDED.template_config,
  updated_at = now();

-- 7) Seed some demo observations to enable trigger evaluation
WITH demo_data AS (
  SELECT 
    ir.indicator_key,
    generate_series(
      (now() - interval '30 days')::date,
      now()::date,
      interval '1 day'
    )::timestamp with time zone as ts,
    CASE 
      WHEN ir.indicator_key = 'childcare_wait_days' THEN 
        GREATEST(15, 28 + 8 * sin(extract(epoch from generate_series) / 86400.0 / 7.0) + (random() - 0.5) * 6)
      WHEN ir.indicator_key = 'fertility_intention_gap' THEN 
        GREATEST(0.6, 0.9 + 0.15 * sin(extract(epoch from generate_series) / 86400.0 / 30.0) + (random() - 0.5) * 0.1)
      WHEN ir.indicator_key = 'job_vacancy_fill_time' THEN 
        GREATEST(25, 32 + 10 * sin(extract(epoch from generate_series) / 86400.0 / 21.0) + (random() - 0.5) * 8)
      WHEN ir.indicator_key = 'skills_mismatch_ratio' THEN 
        GREATEST(0.9, 1.1 + 0.25 * sin(extract(epoch from generate_series) / 86400.0 / 28.0) + (random() - 0.5) * 0.15)
      WHEN ir.indicator_key = 'trust_index' THEN 
        GREATEST(0.4, 0.75 + 0.15 * sin(extract(epoch from generate_series) / 86400.0 / 14.0) + (random() - 0.5) * 0.1)
      WHEN ir.indicator_key = 'service_satisfaction' THEN 
        GREATEST(0.5, 0.78 + 0.12 * sin(extract(epoch from generate_series) / 86400.0 / 10.0) + (random() - 0.5) * 0.08)
      ELSE 1.0
    END as value
  FROM indicator_registry ir
  WHERE ir.indicator_key IN ('childcare_wait_days', 'fertility_intention_gap', 'job_vacancy_fill_time', 'skills_mismatch_ratio', 'trust_index', 'service_satisfaction')
    AND ir.user_id = auth.uid()
)
INSERT INTO raw_observations (source_id, indicator_key, ts, value, unit, hash, user_id)
SELECT 
  (SELECT source_id FROM source_registry WHERE user_id = auth.uid() LIMIT 1),
  dd.indicator_key,
  dd.ts,
  dd.value,
  CASE 
    WHEN dd.indicator_key LIKE '%_days' THEN 'days'
    WHEN dd.indicator_key LIKE '%_ratio' OR dd.indicator_key LIKE '%_gap' THEN 'ratio'
    WHEN dd.indicator_key LIKE '%_index' THEN 'index'
    WHEN dd.indicator_key LIKE '%_satisfaction' THEN 'rate'
    ELSE 'units'
  END,
  encode(sha256((dd.indicator_key || dd.ts::text || dd.value::text)::bytea), 'hex'),
  auth.uid()
FROM demo_data dd
WHERE random() > 0.1 -- Add some realistic gaps
ON CONFLICT (hash) DO NOTHING;