-- Clean up duplicate tasks and create one task per zone
DELETE FROM tasks;

-- Create one task per zone using the existing ACT zone format
INSERT INTO tasks (
  title,
  description,
  zone,
  task_type,
  status,
  priority,
  payload,
  user_id
) VALUES 
-- Act Zone Task  
(
  'Sprint Planning Workshop',
  'Plan and configure your first sprint using the ACT zone workspace tools',
  'ACT',
  'sprint-planning',
  'todo',
  'high',
  '{"type": "sprint-planning", "requiresWizard": true}',
  gen_random_uuid()
);