-- Connect tasks to proper loops from the registry and update their loop_id references

-- Update Childcare Wait Time Surge to connect to Childcare Access and Quality loop
UPDATE tasks_5c 
SET loop_id = 'dc80453c-e3b6-4ef6-ae7d-f38e7ac25357'
WHERE title = 'Childcare Wait Time Surge';

-- Update Teacher Pipeline Bottleneck to connect to Labour Market Matching Efficiency loop  
UPDATE tasks_5c 
SET loop_id = '16625fbf-8a68-49fe-ab47-2eb7444711f3'
WHERE title = 'Teacher Pipeline Bottleneck';

-- Update Skills-Jobs Mismatch Analysis to connect to Labour Market Matching Efficiency loop
UPDATE tasks_5c 
SET loop_id = '16625fbf-8a68-49fe-ab47-2eb7444711f3'
WHERE title = 'Skills-Jobs Mismatch Analysis';

-- Update Infrastructure Resilience Planning to connect to Public Service Reliability loop
UPDATE tasks_5c 
SET loop_id = '5b3adedd-6d34-40d5-b36a-a5fd1def3d6d'
WHERE title = 'Infrastructure Resilience Planning';

-- Add loop_code to the metadata of relevant loops for easier identification
UPDATE loops 
SET metadata = jsonb_set(metadata, '{loop_code}', '"CHI-L01"')
WHERE id = 'dc80453c-e3b6-4ef6-ae7d-f38e7ac25357';

UPDATE loops 
SET metadata = jsonb_set(metadata, '{loop_code}', '"LAB-L01"')
WHERE id = '16625fbf-8a68-49fe-ab47-2eb7444711f3';

UPDATE loops 
SET metadata = jsonb_set(metadata, '{loop_code}', '"SER-L01"')
WHERE id = '5b3adedd-6d34-40d5-b36a-a5fd1def3d6d';

-- Update task payloads to include proper loop codes for consistency
UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"CHI-L01"')
WHERE title = 'Childcare Wait Time Surge';

UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"LAB-L01"')  
WHERE title = 'Teacher Pipeline Bottleneck';

UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"LAB-L01"')
WHERE title = 'Skills-Jobs Mismatch Analysis';

UPDATE tasks_5c 
SET payload = jsonb_set(payload, '{loop_code}', '"SER-L01"')
WHERE title = 'Infrastructure Resilience Planning';