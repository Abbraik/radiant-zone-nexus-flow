-- Add tasks for other zones using similar pattern to existing ACT task
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
  'THINK',
  'loop-design',
  'todo',
  'high',
  '{"type": "loop_design", "requiresBuilder": true}',
  gen_random_uuid()
),
-- Monitor Zone Task
(
  'Breach Response Analysis',
  'Monitor system performance and respond to threshold breaches',
  'MONITOR',
  'breach-response',
  'todo',
  'medium',
  '{"type": "breach_response", "requiresDashboard": true}',
  gen_random_uuid()
),
-- Innovate-Learn Zone Task
(
  'Experiment Design Lab',
  'Design and run controlled experiments for system optimization',
  'INNOVATE',
  'experiment-design',
  'todo',
  'medium',
  '{"type": "experiment_design", "requiresLab": true}',
  gen_random_uuid()
);