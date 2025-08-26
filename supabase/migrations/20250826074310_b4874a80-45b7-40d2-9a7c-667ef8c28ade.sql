-- Create golden scenario tasks for the 5C workspace with correct enum values
INSERT INTO tasks_5c (
  id,
  loop_id, 
  capacity,
  type,
  scale,
  leverage,
  title,
  description,
  status,
  payload,
  user_id,
  created_at,
  updated_at
) VALUES
-- Fertility & Childcare Access (Responsive)
(gen_random_uuid(), gen_random_uuid(), 'responsive', 'reactive', 'meso', 'P', 
 'Childcare Wait Time Surge', 
 'Monitor and respond to increasing childcare wait times affecting fertility decisions',
 'open', 
 '{"scenario": "golden", "urgency": "medium", "estimated_hours": 4}'::jsonb,
 '00000000-0000-0000-0000-000000000000',
 now() - interval '2 hours',
 now() - interval '2 hours'),

-- Education Quality Pipeline (Reflexive)  
(gen_random_uuid(), gen_random_uuid(), 'reflexive', 'structural', 'meso', 'P',
 'Teacher Pipeline Bottleneck',
 'Address structural issues in educator credential processing and deployment',
 'open',
 '{"scenario": "golden", "urgency": "high", "estimated_hours": 6}'::jsonb,
 '00000000-0000-0000-0000-000000000000',
 now() - interval '1 hour',
 now() - interval '1 hour'),

-- Labour Market Efficiency (Deliberative)
(gen_random_uuid(), gen_random_uuid(), 'deliberative', 'perceptual', 'macro', 'S',
 'Skills-Jobs Mismatch Analysis', 
 'Deliberate on policy interventions for labour market matching inefficiencies',
 'open',
 '{"scenario": "golden", "urgency": "low", "estimated_hours": 8}'::jsonb,
 '00000000-0000-0000-0000-000000000000',
 now() - interval '30 minutes',
 now() - interval '30 minutes'),

-- Service Reliability (Anticipatory)
(gen_random_uuid(), gen_random_uuid(), 'anticipatory', 'perceptual', 'meso', 'N',
 'Infrastructure Resilience Planning',
 'Anticipate and prepare for service outage scenarios affecting community trust',
 'open', 
 '{"scenario": "golden", "urgency": "medium", "estimated_hours": 5}'::jsonb,
 '00000000-0000-0000-0000-000000000000',
 now() - interval '15 minutes',
 now() - interval '15 minutes');