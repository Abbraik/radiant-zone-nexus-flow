-- Insert some NCF-PAGS Atlas loops for immediate display
INSERT INTO public.loops (id, name, description, loop_type, scale, status, user_id, source_tag, loop_code, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Population Growth Dynamics', 'Meta-level loop governing population growth patterns and demographic transitions', 'reactive', 'macro', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'META-01', now(), now()),
('550e8400-e29b-41d4-a716-446655440002', 'Economic Development Balance', 'Macro loop for economic development and resource allocation balance', 'structural', 'macro', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'MAC-01', now(), now()),
('550e8400-e29b-41d4-a716-446655440003', 'Healthcare System Capacity', 'Meso loop managing healthcare system capacity and population health outcomes', 'reactive', 'meso', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'MES-01', now(), now()),
('550e8400-e29b-41d4-a716-446655440004', 'Urban Planning Feedback', 'Micro loop for urban infrastructure and population density management', 'reactive', 'micro', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'MIC-01', now(), now()),
('550e8400-e29b-41d4-a716-446655440005', 'Educational Resource Distribution', 'Meso loop for educational resource allocation and human capital development', 'structural', 'meso', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'MES-02', now(), now()),
('550e8400-e29b-41d4-a716-446655440006', 'Employment Market Stability', 'Macro loop balancing employment opportunities with population growth', 'reactive', 'macro', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'MAC-02', now(), now()),
('550e8400-e29b-41d4-a716-446655440007', 'Environmental Quality Control', 'Meta loop governing environmental sustainability and population impact', 'structural', 'macro', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'META-02', now(), now()),
('550e8400-e29b-41d4-a716-446655440008', 'Social Services Delivery', 'Micro loop for social services delivery and community support systems', 'reactive', 'micro', 'published', '00000000-0000-0000-0000-000000000000', 'NCF-PAGS-ATLAS', 'MIC-02', now(), now());

-- Add some metadata tags to make loops more discoverable
UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['population', 'demographics', 'governance'],
  'motif', 'B',
  'domain', 'population-development'
) WHERE loop_code = 'META-01';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['economics', 'development', 'resources'],
  'motif', 'R', 
  'domain', 'economic-development'
) WHERE loop_code = 'MAC-01';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['healthcare', 'capacity', 'outcomes'],
  'motif', 'B',
  'domain', 'health-systems'
) WHERE loop_code = 'MES-01';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['urban', 'infrastructure', 'density'],
  'motif', 'B',
  'domain', 'urban-planning'
) WHERE loop_code = 'MIC-01';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['education', 'resources', 'human-capital'],
  'motif', 'S',
  'domain', 'education-systems'
) WHERE loop_code = 'MES-02';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['employment', 'market', 'stability'],
  'motif', 'B',
  'domain', 'labor-markets'
) WHERE loop_code = 'MAC-02';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['environment', 'sustainability', 'impact'],
  'motif', 'S',
  'domain', 'environmental-systems'
) WHERE loop_code = 'META-02';

UPDATE public.loops SET metadata = jsonb_build_object(
  'tags', ARRAY['social-services', 'community', 'support'],
  'motif', 'B',
  'domain', 'social-systems'  
) WHERE loop_code = 'MIC-02';