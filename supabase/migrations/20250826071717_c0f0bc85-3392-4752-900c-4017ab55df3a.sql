-- Create sample tasks for golden scenarios demonstration with user_id
-- Using a default user_id (we'll need to replace this with actual authenticated user later)
INSERT INTO tasks (id, title, description, status, capacity, loop_id, user_id, created_at, updated_at) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440101',
    'Monitor Childcare Capacity Surge',
    'Responsive monitoring of childcare wait times exceeding 30-day threshold in urban areas',
    'available',
    'responsive',
    '550e8400-e29b-41d4-a716-446655440001',
    '00000000-0000-0000-0000-000000000000', -- Default user for demo
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
    '00000000-0000-0000-0000-000000000000',
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
    '00000000-0000-0000-0000-000000000000',
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
    '00000000-0000-0000-0000-000000000000',
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