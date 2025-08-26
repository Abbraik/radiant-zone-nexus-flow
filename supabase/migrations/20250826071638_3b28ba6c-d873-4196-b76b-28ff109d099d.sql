-- Create sample tasks for golden scenarios demonstration
INSERT INTO tasks (id, title, description, status, capacity, loop_id, created_at, updated_at) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440101',
    'Monitor Childcare Capacity Surge',
    'Responsive monitoring of childcare wait times exceeding 30-day threshold in urban areas',
    'available',
    'responsive',
    '550e8400-e29b-41d4-a716-446655440001',
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440102',
    'Assess Demographics Impact',
    'Reflexive analysis of fertility rate changes on long-term population projections',
    'available',
    'reflexive',
    '550e8400-e29b-41d4-a716-446655440001',
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440103',
    'Economic Readiness Planning',
    'Anticipatory preparation for labour market fluctuations based on orderbook trends',
    'available',
    'anticipatory',
    '550e8400-e29b-41d4-a716-446655440002',
    NOW(),
    NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440104',
    'Trust Index Portfolio Review',
    'Deliberative analysis of social cohesion indicators and policy intervention options',
    'available',
    'deliberative',
    '550e8400-e29b-41d4-a716-446655440002',
    NOW(),
    NOW()
  );

-- Add scenario-specific payload data to identify golden scenarios
UPDATE tasks SET 
  payload = jsonb_set(
    COALESCE(payload, '{}'::jsonb), 
    '{scenario}', 
    '"fertility"'::jsonb
  )
WHERE id IN ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440102');

UPDATE tasks SET 
  payload = jsonb_set(
    COALESCE(payload, '{}'::jsonb), 
    '{scenario}', 
    '"labour"'::jsonb
  )
WHERE id = '550e8400-e29b-41d4-a716-446655440103';

UPDATE tasks SET 
  payload = jsonb_set(
    COALESCE(payload, '{}'::jsonb), 
    '{scenario}', 
    '"cohesion"'::jsonb
  )
WHERE id = '550e8400-e29b-41d4-a716-446655440104';

-- Add some basic indicators for the scenarios
INSERT INTO indicators (id, name, description, unit, loop_id, created_at, updated_at) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'childcare_wait_days',
    'Average waiting time for childcare placement in days',
    'days',
    '550e8400-e29b-41d4-a716-446655440001',
    NOW(),
    NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'orderbook_index',
    'Economic orderbook demand index (1.0 = baseline)',
    'index',
    '550e8400-e29b-41d4-a716-446655440002',
    NOW(),
    NOW()
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'trust_index',
    'Social trust and cohesion measurement index',
    'index',
    '550e8400-e29b-41d4-a716-446655440002',
    NOW(),
    NOW()
  );