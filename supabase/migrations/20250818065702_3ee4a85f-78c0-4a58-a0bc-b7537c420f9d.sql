-- Clean up duplicate tasks and create one task per zone
DELETE FROM tasks;

-- Create one task per zone
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
-- Think Zone Task
(
  'Loop Design Workshop',
  'Design and configure causal loop diagrams for system analysis',
  'think',
  'loop_design',
  'todo',
  'high',
  '{"type": "loop_design", "requiresBuilder": true}',
  gen_random_uuid()
),
-- Act Zone Task  
(
  'Sprint Planning Workshop',
  'Plan and configure your first sprint using the ACT zone workspace tools',
  'act',
  'sprint_planning',
  'todo',
  'high',
  '{"type": "sprint_planning", "requiresWizard": true}',
  gen_random_uuid()
),
-- Monitor Zone Task
(
  'Breach Response Analysis',
  'Monitor system performance and respond to threshold breaches',
  'monitor',
  'breach_response',
  'todo',
  'medium',
  '{"type": "breach_response", "requiresDashboard": true}',
  gen_random_uuid()
),
-- Innovate-Learn Zone Task
(
  'Experiment Design Lab',
  'Design and run controlled experiments for system optimization',
  'innovate-learn',
  'experiment_design',
  'todo',
  'medium',
  '{"type": "experiment_design", "requiresLab": true}',
  gen_random_uuid()
);