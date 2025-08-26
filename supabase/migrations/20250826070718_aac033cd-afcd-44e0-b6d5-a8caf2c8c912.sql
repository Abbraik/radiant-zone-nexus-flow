-- Fixed Golden Scenarios Migration - Archive Mock Tasks and Setup Live Triggers
-- Migration for replacing mock workspace tasks with real backend flow

-- 1) Archive existing mock tasks (safe approach - fixed column references)
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
  OR payload->>'_mock' = 'true'
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