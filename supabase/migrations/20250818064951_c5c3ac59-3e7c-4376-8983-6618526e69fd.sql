-- Create a new ACT zone task for sprint planning  
INSERT INTO tasks (
  title,
  description,
  zone,
  task_type,
  status,
  priority,
  payload,
  user_id
) VALUES (
  'Sprint Planning Workshop',
  'Plan and configure your first sprint using the ACT zone workspace tools',
  'ACT',
  'sprint-planning',
  'todo',
  'high',
  '{"type": "sprint-planning", "requiresWizard": true}',
  auth.uid()
);