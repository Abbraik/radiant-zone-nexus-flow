-- Update existing tasks with rich mock data to populate the ClaimTaskDialog properly

-- Update Childcare Wait Time Surge (responsive)
UPDATE tasks_5c 
SET 
  payload = jsonb_build_object(
    'description', 'Monitor and respond to increasing childcare wait times affecting fertility decisions',
    'urgency', 'medium',
    'scenario', 'golden',
    'estimated_hours', 4,
    'scenario_id', 'fertility',
    'capacity', 'responsive',
    'primary_indicator', 'childcare_wait_days',
    'expected_outputs', ARRAY['situation_report', 'intervention_recommendation'],
    'indicators', jsonb_build_object(
      'childcare_wait_days', 29.94307346395721,
      'fertility_intention_gap', 0.6172483570048783,
      'capacity_utilization', 0.9833356836158554
    ),
    'context', jsonb_build_object(
      'alert_level', 'medium',
      'trending', 'increasing'
    ),
    'template', jsonb_build_object(
      'title', 'Responsive Capacity Template',
      'default_sla_hours', 24,
      'default_payload', jsonb_build_object('capacity', 'responsive', 'estimated_duration', 4)
    ),
    'checklist', jsonb_build_array(
      jsonb_build_object('id', 'check-1', 'label', 'Review current childcare capacity metrics', 'required', true, 'done', false, 'order_index', 1),
      jsonb_build_object('id', 'check-2', 'label', 'Analyze wait time trends and patterns', 'required', true, 'done', false, 'order_index', 2),
      jsonb_build_object('id', 'check-3', 'label', 'Assess impact on fertility intentions', 'required', true, 'done', false, 'order_index', 3),
      jsonb_build_object('id', 'check-4', 'label', 'Prepare intervention recommendations', 'required', false, 'done', false, 'order_index', 4),
      jsonb_build_object('id', 'check-5', 'label', 'Submit situation report', 'required', true, 'done', false, 'order_index', 5)
    ),
    'artifacts', jsonb_build_array(
      jsonb_build_object('id', 'artifact-1', 'title', 'Childcare Capacity Dashboard', 'url', 'https://dashboard.childcare.gov/capacity', 'kind', 'dashboard'),
      jsonb_build_object('id', 'artifact-2', 'title', 'Fertility Trends Report Q4', 'url', null, 'kind', 'report')
    ),
    'guardrails', jsonb_build_object(
      'name', 'Standard Responsive Guardrails',
      'timebox_hours', 8,
      'daily_delta_limit', 0.1,
      'coverage_limit_pct', 75,
      'concurrent_substeps_limit', 3,
      'renewal_limit', 2,
      'evaluation_required_after_renewals', 1
    ),
    'signal', jsonb_build_object(
      'indicator', 'childcare_wait_days',
      'status', 'above',
      'severity', 0.85,
      'value', 29.94307346395721,
      'ts', (now() - interval '2 hours')::text,
      'band', jsonb_build_object('lower', 15, 'upper', 25)
    ),
    'source', jsonb_build_object(
      'label', 'Golden Scenario Generator - Fertility Domain',
      'fired_at', (now() - interval '3 hours')::text
    )
  ),
  tri = jsonb_build_object('T', 0.700569265360428, 'R', 0.9, 'I', 0.7)
WHERE title = 'Childcare Wait Time Surge';

-- Update Teacher Pipeline Bottleneck (reflexive)
UPDATE tasks_5c 
SET 
  payload = jsonb_build_object(
    'description', 'Address structural issues in educator credential processing and deployment',
    'urgency', 'high',
    'scenario', 'golden',
    'estimated_hours', 6,
    'scenario_id', 'education',
    'capacity', 'reflexive',
    'primary_indicator', 'educator_credential_latency',
    'expected_outputs', ARRAY['process_analysis', 'structural_recommendations', 'implementation_plan'],
    'indicators', jsonb_build_object(
      'educator_credential_latency', 47.2,
      'pipeline_throughput', 0.65,
      'quality_score', 0.82
    ),
    'context', jsonb_build_object(
      'alert_level', 'high',
      'trending', 'worsening'
    ),
    'template', jsonb_build_object(
      'title', 'Reflexive Capacity Template',
      'default_sla_hours', 48,
      'default_payload', jsonb_build_object('capacity', 'reflexive', 'estimated_duration', 6)
    ),
    'checklist', jsonb_build_array(
      jsonb_build_object('id', 'check-1', 'label', 'Map current credential processing workflow', 'required', true, 'done', false, 'order_index', 1),
      jsonb_build_object('id', 'check-2', 'label', 'Identify bottlenecks and delays', 'required', true, 'done', false, 'order_index', 2),
      jsonb_build_object('id', 'check-3', 'label', 'Analyze root causes of inefficiencies', 'required', true, 'done', false, 'order_index', 3),
      jsonb_build_object('id', 'check-4', 'label', 'Design process improvements', 'required', true, 'done', false, 'order_index', 4),
      jsonb_build_object('id', 'check-5', 'label', 'Validate with stakeholders', 'required', true, 'done', false, 'order_index', 5),
      jsonb_build_object('id', 'check-6', 'label', 'Prepare implementation roadmap', 'required', false, 'done', false, 'order_index', 6)
    ),
    'artifacts', jsonb_build_array(
      jsonb_build_object('id', 'artifact-1', 'title', 'Educator Certification Portal', 'url', 'https://certs.education.gov', 'kind', 'system'),
      jsonb_build_object('id', 'artifact-2', 'title', 'Process Flow Analysis', 'url', null, 'kind', 'analysis'),
      jsonb_build_object('id', 'artifact-3', 'title', 'Stakeholder Interview Guide', 'url', null, 'kind', 'template')
    ),
    'guardrails', jsonb_build_object(
      'name', 'Reflexive Process Guardrails',
      'timebox_hours', 12,
      'daily_delta_limit', 0.15,
      'coverage_limit_pct', 80,
      'concurrent_substeps_limit', 4,
      'renewal_limit', 3,
      'evaluation_required_after_renewals', 2
    ),
    'signal', jsonb_build_object(
      'indicator', 'educator_credential_latency',
      'status', 'above',
      'severity', 0.92,
      'value', 47.2,
      'ts', (now() - interval '1 hour')::text,
      'band', jsonb_build_object('lower', 21, 'upper', 35)
    ),
    'source', jsonb_build_object(
      'label', 'Education System Monitor',
      'fired_at', (now() - interval '2 hours')::text
    )
  ),
  tri = jsonb_build_object('T', 0.45, 'R', 0.8, 'I', 0.9)
WHERE title = 'Teacher Pipeline Bottleneck';

-- Update Skills-Jobs Mismatch Analysis (deliberative)
UPDATE tasks_5c 
SET 
  payload = jsonb_build_object(
    'description', 'Deliberate on policy interventions for labour market matching inefficiencies',
    'urgency', 'low',
    'scenario', 'golden',
    'estimated_hours', 8,
    'scenario_id', 'labour_market',
    'capacity', 'deliberative',
    'primary_indicator', 'vacancy_unemployment_gap',
    'expected_outputs', ARRAY['policy_options', 'impact_analysis', 'recommendation_dossier'],
    'indicators', jsonb_build_object(
      'vacancy_unemployment_gap', 1.34,
      'skills_mismatch_index', 0.68,
      'placement_efficiency', 0.41
    ),
    'context', jsonb_build_object(
      'alert_level', 'low',
      'trending', 'stable'
    ),
    'template', jsonb_build_object(
      'title', 'Deliberative Policy Template',
      'default_sla_hours', 72,
      'default_payload', jsonb_build_object('capacity', 'deliberative', 'estimated_duration', 8)
    ),
    'checklist', jsonb_build_array(
      jsonb_build_object('id', 'check-1', 'label', 'Analyze current labour market data', 'required', true, 'done', false, 'order_index', 1),
      jsonb_build_object('id', 'check-2', 'label', 'Identify skills gaps and mismatches', 'required', true, 'done', false, 'order_index', 2),
      jsonb_build_object('id', 'check-3', 'label', 'Research policy intervention options', 'required', true, 'done', false, 'order_index', 3),
      jsonb_build_object('id', 'check-4', 'label', 'Model impact of each option', 'required', true, 'done', false, 'order_index', 4),
      jsonb_build_object('id', 'check-5', 'label', 'Assess implementation feasibility', 'required', true, 'done', false, 'order_index', 5),
      jsonb_build_object('id', 'check-6', 'label', 'Prepare decision dossier', 'required', true, 'done', false, 'order_index', 6),
      jsonb_build_object('id', 'check-7', 'label', 'Stakeholder consultation plan', 'required', false, 'done', false, 'order_index', 7)
    ),
    'artifacts', jsonb_build_array(
      jsonb_build_object('id', 'artifact-1', 'title', 'Labour Market Intelligence Dashboard', 'url', 'https://labour.stats.gov', 'kind', 'dashboard'),
      jsonb_build_object('id', 'artifact-2', 'title', 'Skills Taxonomy Database', 'url', 'https://skills.labour.gov', 'kind', 'database'),
      jsonb_build_object('id', 'artifact-3', 'title', 'Policy Impact Modeling Tool', 'url', null, 'kind', 'tool')
    ),
    'guardrails', jsonb_build_object(
      'name', 'Deliberative Analysis Guardrails',
      'timebox_hours', 16,
      'daily_delta_limit', 0.05,
      'coverage_limit_pct', 90,
      'concurrent_substeps_limit', 2,
      'renewal_limit', 1,
      'evaluation_required_after_renewals', 1
    ),
    'signal', jsonb_build_object(
      'indicator', 'vacancy_unemployment_gap',
      'status', 'above',
      'severity', 0.58,
      'value', 1.34,
      'ts', (now() - interval '4 hours')::text,
      'band', jsonb_build_object('lower', 0.8, 'upper', 1.2)
    ),
    'source', jsonb_build_object(
      'label', 'Labour Market Analytics Engine',
      'fired_at', (now() - interval '6 hours')::text
    )
  ),
  tri = jsonb_build_object('T', 0.3, 'R', 0.7, 'I', 0.6)
WHERE title = 'Skills-Jobs Mismatch Analysis';

-- Update Infrastructure Resilience Planning (anticipatory)
UPDATE tasks_5c 
SET 
  payload = jsonb_build_object(
    'description', 'Anticipate and prepare for service outage scenarios affecting community trust',
    'urgency', 'medium',
    'scenario', 'golden',
    'estimated_hours', 5,
    'scenario_id', 'infrastructure',
    'capacity', 'anticipatory',
    'primary_indicator', 'outage_rate',
    'expected_outputs', ARRAY['scenario_analysis', 'contingency_plans', 'resilience_recommendations'],
    'indicators', jsonb_build_object(
      'outage_rate', 0.028,
      'trust_index', 0.62,
      'service_reliability', 0.94
    ),
    'context', jsonb_build_object(
      'alert_level', 'medium',
      'trending', 'concerning'
    ),
    'template', jsonb_build_object(
      'title', 'Anticipatory Planning Template',
      'default_sla_hours', 36,
      'default_payload', jsonb_build_object('capacity', 'anticipatory', 'estimated_duration', 5)
    ),
    'checklist', jsonb_build_array(
      jsonb_build_object('id', 'check-1', 'label', 'Map critical infrastructure dependencies', 'required', true, 'done', false, 'order_index', 1),
      jsonb_build_object('id', 'check-2', 'label', 'Model potential failure scenarios', 'required', true, 'done', false, 'order_index', 2),
      jsonb_build_object('id', 'check-3', 'label', 'Assess community impact risks', 'required', true, 'done', false, 'order_index', 3),
      jsonb_build_object('id', 'check-4', 'label', 'Design contingency protocols', 'required', true, 'done', false, 'order_index', 4),
      jsonb_build_object('id', 'check-5', 'label', 'Validate with operations teams', 'required', false, 'done', false, 'order_index', 5)
    ),
    'artifacts', jsonb_build_array(
      jsonb_build_object('id', 'artifact-1', 'title', 'Infrastructure Monitoring System', 'url', 'https://monitor.infrastructure.gov', 'kind', 'system'),
      jsonb_build_object('id', 'artifact-2', 'title', 'Scenario Modeling Framework', 'url', null, 'kind', 'framework'),
      jsonb_build_object('id', 'artifact-3', 'title', 'Community Trust Survey Data', 'url', null, 'kind', 'data')
    ),
    'guardrails', jsonb_build_object(
      'name', 'Anticipatory Planning Guardrails',
      'timebox_hours', 10,
      'daily_delta_limit', 0.08,
      'coverage_limit_pct', 85,
      'concurrent_substeps_limit', 3,
      'renewal_limit', 2,
      'evaluation_required_after_renewals', 1
    ),
    'signal', jsonb_build_object(
      'indicator', 'outage_rate',
      'status', 'above',
      'severity', 0.71,
      'value', 0.028,
      'ts', (now() - interval '30 minutes')::text,
      'band', jsonb_build_object('lower', 0.01, 'upper', 0.02)
    ),
    'source', jsonb_build_object(
      'label', 'Infrastructure Resilience Monitor',
      'fired_at', (now() - interval '1 hour')::text
    )
  ),
  tri = jsonb_build_object('T', 0.8, 'R', 0.55, 'I', 0.75)
WHERE title = 'Infrastructure Resilience Planning';