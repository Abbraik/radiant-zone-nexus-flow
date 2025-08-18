-- Insert sample tasks for zone-aware workspace testing using proper UUID
INSERT INTO tasks (
  title,
  description,
  zone,
  task_type,
  status,
  user_id,
  priority,
  payload,
  due_date
) VALUES 
-- Think Zone Tasks
(
  'Design Population Growth Feedback Loop',
  'Create a comprehensive feedback loop model for population growth dynamics in urban areas',
  'think',
  'loop_design',
  'todo',
  gen_random_uuid(),
  'high',
  '{"variables": [], "connections": [], "leverage_points": []}',
  CURRENT_DATE + INTERVAL '3 days'
),
(
  'Analyze Education Access Patterns',
  'Review and analyze education access patterns across different demographic groups',
  'think',
  'loop_design',
  'todo',
  gen_random_uuid(),
  'medium',
  '{"analysis_scope": "education", "demographics": [], "indicators": []}',
  CURRENT_DATE + INTERVAL '5 days'
),

-- Act Zone Tasks
(
  'Plan Infrastructure Development Sprint',
  'Organize a sprint to address infrastructure gaps in growing communities',
  'act',
  'sprint_planning',
  'todo',
  gen_random_uuid(),
  'high',
  '{"sprint_goals": [], "resources": [], "timeline": {}}',
  CURRENT_DATE + INTERVAL '2 days'
),
(
  'Coordinate Community Health Initiative',
  'Plan and coordinate a community health initiative targeting maternal and child health',
  'act',
  'sprint_planning',
  'todo',
  gen_random_uuid(),
  'critical',
  '{"health_targets": [], "stakeholders": [], "budget": 0}',
  CURRENT_DATE + INTERVAL '1 day'
),

-- Monitor Zone Tasks
(
  'Respond to Housing Shortage Alert',
  'Immediate response required for housing shortage indicators exceeding thresholds',
  'monitor',
  'breach_response',
  'todo',
  gen_random_uuid(),
  'critical',
  '{"alert_type": "housing_shortage", "severity": "high", "affected_areas": []}',
  CURRENT_DATE
),
(
  'Review Water Quality Metrics',
  'Assess water quality metrics and trends across monitored regions',
  'monitor',
  'breach_response',
  'todo',
  gen_random_uuid(),
  'medium',
  '{"metrics": [], "regions": [], "time_range": "30_days"}',
  CURRENT_DATE + INTERVAL '2 days'
),

-- Innovate-Learn Zone Tasks
(
  'Design Smart City Pilot Experiment',
  'Create experimental framework for testing smart city solutions in medium-sized urban areas',
  'innovate-learn',
  'experiment_design',
  'todo',
  gen_random_uuid(),
  'high',
  '{"experiment_type": "smart_city", "variables": [], "hypothesis": "", "success_metrics": []}',
  CURRENT_DATE + INTERVAL '7 days'
),
(
  'Test Renewable Energy Integration',
  'Experiment with renewable energy integration models for sustainable development',
  'innovate-learn',
  'experiment_design',
  'todo',
  gen_random_uuid(),
  'medium',
  '{"energy_sources": [], "integration_points": [], "expected_outcomes": []}',
  CURRENT_DATE + INTERVAL '10 days'
);