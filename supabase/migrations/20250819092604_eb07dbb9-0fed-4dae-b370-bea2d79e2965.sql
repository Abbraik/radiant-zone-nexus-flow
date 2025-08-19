-- First make user_id nullable if it isn't already
ALTER TABLE public.loops ALTER COLUMN user_id DROP NOT NULL;

-- Now insert the remaining 24 NCF-PAGS Atlas loops to complete the full set of 32

-- Additional Meta Loops (6 more to make 8 total)
INSERT INTO public.loops (id, name, description, loop_type, scale, status, user_id, source_tag, loop_code, created_at, updated_at) VALUES 
('550e8400-e29b-41d4-a716-446655440009', 'Institutional Governance Framework', 'Meta loop governing institutional coordination and policy coherence', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'META-03', now(), now()),
('550e8400-e29b-41d4-a716-446655440010', 'Resource Allocation Oversight', 'Meta loop for strategic resource distribution and priority setting', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'META-04', now(), now()),
('550e8400-e29b-41d4-a716-446655440011', 'System Resilience Monitoring', 'Meta loop tracking overall system stability and adaptive capacity', 'reactive', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'META-05', now(), now()),
('550e8400-e29b-41d4-a716-446655440012', 'Innovation Ecosystem Governance', 'Meta loop governing innovation diffusion and technological adaptation', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'META-06', now(), now()),
('550e8400-e29b-41d4-a716-446655440013', 'Knowledge Integration Framework', 'Meta loop for cross-domain learning and policy integration', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'META-07', now(), now()),
('550e8400-e29b-41d4-a716-446655440014', 'Stakeholder Coordination Matrix', 'Meta loop managing multi-stakeholder engagement and consensus building', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'META-08', now(), now()),

-- Additional Macro Loops (8 more to make 10 total)
('550e8400-e29b-41d4-a716-446655440015', 'Regional Development Dynamics', 'Macro loop balancing urban-rural development patterns', 'reactive', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-03', now(), now()),
('550e8400-e29b-41d4-a716-446655440016', 'Infrastructure Investment Cycles', 'Macro loop governing infrastructure development and maintenance', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-04', now(), now()),
('550e8400-e29b-41d4-a716-446655440017', 'Trade and Commerce Regulation', 'Macro loop managing trade flows and market regulation', 'reactive', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-05', now(), now()),
('550e8400-e29b-41d4-a716-446655440018', 'Energy System Transitions', 'Macro loop governing energy supply and demand balance', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-06', now(), now()),
('550e8400-e29b-41d4-a716-446655440019', 'Climate Adaptation Responses', 'Macro loop for climate resilience and adaptation strategies', 'reactive', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-07', now(), now()),
('550e8400-e29b-41d4-a716-446655440020', 'Financial System Stability', 'Macro loop monitoring financial markets and monetary policy', 'reactive', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-08', now(), now()),
('550e8400-e29b-41d4-a716-446655440021', 'Technology Innovation Diffusion', 'Macro loop governing technology adoption and digital transformation', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-09', now(), now()),
('550e8400-e29b-41d4-a716-446655440022', 'International Cooperation Networks', 'Macro loop managing international relations and cooperation', 'structural', 'macro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MAC-10', now(), now()),

-- Additional Meso Loops (10 more to make 12 total)
('550e8400-e29b-41d4-a716-446655440023', 'Community Development Programs', 'Meso loop coordinating community-level development initiatives', 'structural', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-03', now(), now()),
('550e8400-e29b-41d4-a716-446655440024', 'Skills Development Pathways', 'Meso loop managing vocational training and skill development', 'structural', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-04', now(), now()),
('550e8400-e29b-41d4-a716-446655440025', 'Public Transport Networks', 'Meso loop optimizing public transportation systems', 'reactive', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-05', now(), now()),
('550e8400-e29b-41d4-a716-446655440026', 'Housing Affordability Management', 'Meso loop balancing housing supply and affordability', 'reactive', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-06', now(), now()),
('550e8400-e29b-41d4-a716-446655440027', 'Small Business Ecosystem Support', 'Meso loop supporting entrepreneurship and small business growth', 'structural', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-07', now(), now()),
('550e8400-e29b-41d4-a716-446655440028', 'Cultural Heritage Preservation', 'Meso loop maintaining cultural assets and community identity', 'structural', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-08', now(), now()),
('550e8400-e29b-41d4-a716-446655440029', 'Emergency Response Coordination', 'Meso loop managing disaster preparedness and response', 'reactive', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-09', now(), now()),
('550e8400-e29b-41d4-a716-446655440030', 'Digital Infrastructure Deployment', 'Meso loop expanding digital connectivity and access', 'structural', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-10', now(), now()),
('550e8400-e29b-41d4-a716-446655440031', 'Environmental Monitoring Systems', 'Meso loop tracking environmental quality indicators', 'reactive', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-11', now(), now()),
('550e8400-e29b-41d4-a716-446655440032', 'Youth Engagement Initiatives', 'Meso loop fostering youth participation in development', 'structural', 'meso', 'published', NULL, 'NCF-PAGS-ATLAS', 'MES-12', now(), now()),

-- Additional Micro Loops (10 more to make 12 total)
('550e8400-e29b-41d4-a716-446655440033', 'Local Health Clinic Operations', 'Micro loop optimizing primary healthcare service delivery', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-03', now(), now()),
('550e8400-e29b-41d4-a716-446655440034', 'School Performance Management', 'Micro loop improving educational outcomes at school level', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-04', now(), now()),
('550e8400-e29b-41d4-a716-446655440035', 'Water Quality Monitoring', 'Micro loop ensuring safe water supply at local level', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-05', now(), now()),
('550e8400-e29b-41d4-a716-446655440036', 'Waste Management Operations', 'Micro loop optimizing local waste collection and processing', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-06', now(), now()),
('550e8400-e29b-41d4-a716-446655440037', 'Traffic Flow Optimization', 'Micro loop managing local traffic patterns and congestion', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-07', now(), now()),
('550e8400-e29b-41d4-a716-446655440038', 'Public Safety Patrol Systems', 'Micro loop coordinating local security and safety measures', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-08', now(), now()),
('550e8400-e29b-41d4-a716-446655440039', 'Community Center Programming', 'Micro loop managing local community facility utilization', 'structural', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-09', now(), now()),
('550e8400-e29b-41d4-a716-446655440040', 'Local Market Regulation', 'Micro loop overseeing neighborhood commercial activities', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-10', now(), now()),
('550e8400-e29b-41d4-a716-446655440041', 'Neighborhood Beautification', 'Micro loop maintaining local environmental aesthetics', 'structural', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-11', now(), now()),
('550e8400-e29b-41d4-a716-446655440042', 'Citizen Feedback Processing', 'Micro loop handling local citizen complaints and suggestions', 'reactive', 'micro', 'published', NULL, 'NCF-PAGS-ATLAS', 'MIC-12', now(), now());