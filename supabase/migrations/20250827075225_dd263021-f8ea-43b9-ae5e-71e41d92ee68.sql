-- Connect tasks to actual loops from the atlas registry using loop codes

-- Update Childcare Wait Time Surge to connect to Fertility & Childcare loop (MIC-L08)
UPDATE tasks_5c 
SET loop_id = (
  SELECT id FROM loops 
  WHERE metadata->>'loop_code' = 'MIC-L08' 
  LIMIT 1
)
WHERE title = 'Childcare Wait Time Surge'
  AND EXISTS (SELECT 1 FROM loops WHERE metadata->>'loop_code' = 'MIC-L08');

-- Update Teacher Pipeline Bottleneck to connect to Teacher Pipeline loop (MES-L02)  
UPDATE tasks_5c 
SET loop_id = (
  SELECT id FROM loops 
  WHERE metadata->>'loop_code' = 'MES-L02' 
  LIMIT 1
)
WHERE title = 'Teacher Pipeline Bottleneck'
  AND EXISTS (SELECT 1 FROM loops WHERE metadata->>'loop_code' = 'MES-L02');

-- Update Skills-Jobs Mismatch Analysis to connect to Skills-Jobs Matching loop (MES-L03)
UPDATE tasks_5c 
SET loop_id = (
  SELECT id FROM loops 
  WHERE metadata->>'loop_code' = 'MES-L03' 
  LIMIT 1
)
WHERE title = 'Skills-Jobs Mismatch Analysis'
  AND EXISTS (SELECT 1 FROM loops WHERE metadata->>'loop_code' = 'MES-L03');

-- Update Infrastructure Resilience Planning to connect to Macro Resilience loop (MAC-L09)
UPDATE tasks_5c 
SET loop_id = (
  SELECT id FROM loops 
  WHERE metadata->>'loop_code' = 'MAC-L09' 
  LIMIT 1
)
WHERE title = 'Infrastructure Resilience Planning'
  AND EXISTS (SELECT 1 FROM loops WHERE metadata->>'loop_code' = 'MAC-L09');

-- Update task payloads to include the proper loop codes for consistency
UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"MIC-L08"')
WHERE title = 'Childcare Wait Time Surge';

UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"MES-L02"')  
WHERE title = 'Teacher Pipeline Bottleneck';

UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"MES-L03"')
WHERE title = 'Skills-Jobs Mismatch Analysis';

UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"MAC-L09"')
WHERE title = 'Infrastructure Resilience Planning';