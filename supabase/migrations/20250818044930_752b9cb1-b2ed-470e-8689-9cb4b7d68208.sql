-- Insert comprehensive mock data for all tables

-- First, we need to create a demo user (this will be handled by auth signup)
-- But we'll create demo data that can work with any user

-- Insert sample loops
INSERT INTO public.loops (id, user_id, name, description, type, status) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Supply Chain Optimization', 'Improving supply chain efficiency and reducing waste', 'macro', 'active'),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Customer Satisfaction', 'Enhancing customer experience and retention', 'meso', 'active'),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'Employee Productivity', 'Boosting team performance and engagement', 'micro', 'planning');

-- Insert sample indicators
INSERT INTO public.indicators (id, user_id, name, type, unit, target_value, lower_bound, upper_bound) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Delivery Time', 'quantity', 'days', 3.0, 2.0, 5.0),
('660e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Customer Rating', 'score', 'rating', 4.5, 4.0, 5.0),
('660e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'Task Completion Rate', 'percentage', '%', 85.0, 80.0, 100.0),
('660e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000000', 'Cost Per Unit', 'currency', 'USD', 50.0, 45.0, 60.0);

-- Insert sample indicator values (time series data)
INSERT INTO public.indicator_values (indicator_id, value, timestamp) VALUES 
-- Delivery Time values
('660e8400-e29b-41d4-a716-446655440001', 2.8, now() - interval '7 days'),
('660e8400-e29b-41d4-a716-446655440001', 3.2, now() - interval '6 days'),
('660e8400-e29b-41d4-a716-446655440001', 2.9, now() - interval '5 days'),
('660e8400-e29b-41d4-a716-446655440001', 3.8, now() - interval '4 days'),
('660e8400-e29b-41d4-a716-446655440001', 4.1, now() - interval '3 days'),
('660e8400-e29b-41d4-a716-446655440001', 3.5, now() - interval '2 days'),
('660e8400-e29b-41d4-a716-446655440001', 3.0, now() - interval '1 day'),
-- Customer Rating values
('660e8400-e29b-41d4-a716-446655440002', 4.2, now() - interval '7 days'),
('660e8400-e29b-41d4-a716-446655440002', 4.3, now() - interval '6 days'),
('660e8400-e29b-41d4-a716-446655440002', 4.1, now() - interval '5 days'),
('660e8400-e29b-41d4-a716-446655440002', 4.4, now() - interval '4 days'),
('660e8400-e29b-41d4-a716-446655440002', 4.6, now() - interval '3 days'),
('660e8400-e29b-41d4-a716-446655440002', 4.5, now() - interval '2 days'),
('660e8400-e29b-41d4-a716-446655440002', 4.4, now() - interval '1 day'),
-- Task Completion Rate values
('660e8400-e29b-41d4-a716-446655440003', 82.0, now() - interval '7 days'),
('660e8400-e29b-41d4-a716-446655440003', 85.0, now() - interval '6 days'),
('660e8400-e29b-41d4-a716-446655440003', 88.0, now() - interval '5 days'),
('660e8400-e29b-41d4-a716-446655440003', 83.0, now() - interval '4 days'),
('660e8400-e29b-41d4-a716-446655440003', 87.0, now() - interval '3 days'),
('660e8400-e29b-41d4-a716-446655440003', 89.0, now() - interval '2 days'),
('660e8400-e29b-41d4-a716-446655440003', 86.0, now() - interval '1 day');

-- Insert sample REL tickets
INSERT INTO public.rel_tickets (id, user_id, indicator_id, loop_id, stage, severity_score, magnitude, persistence, cohort, geo, description) VALUES 
('770e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'breach', 85, 1.2, 3, 'logistics', 'US-West', 'Delivery times consistently exceeding target in western regions'),
('770e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'open', 72, 0.8, 2, 'customer-service', 'EU', 'Customer satisfaction dipping in European markets'),
('770e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'analysis', 65, 0.5, 1, 'engineering', 'Global', 'Task completion rates below target in Q4');

-- Insert sample sprints
INSERT INTO public.sprints (id, user_id, loop_id, name, description, status, start_date, end_date, goals) VALUES 
('880e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440001', 'Q1 Supply Chain Sprint', 'Focus on reducing delivery times and costs', 'active', current_date, current_date + interval '14 days', '[{"goal": "Reduce average delivery time by 15%", "target": 2.5}, {"goal": "Cut logistics costs by 10%", "target": 45.0}]'),
('880e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', '550e8400-e29b-41d4-a716-446655440002', 'Customer Experience Sprint', 'Improve customer satisfaction scores', 'planning', current_date + interval '1 day', current_date + interval '15 days', '[{"goal": "Achieve 4.7+ customer rating", "target": 4.7}, {"goal": "Reduce response time to under 2 hours", "target": 2.0}]');

-- Insert sample tasks
INSERT INTO public.tasks (id, user_id, sprint_id, title, description, status, priority, due_date) VALUES 
('990e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', '880e8400-e29b-41d4-a716-446655440001', 'Optimize warehouse routing', 'Implement new routing algorithm for faster picking', 'in_progress', 'high', current_date + interval '5 days'),
('990e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', '880e8400-e29b-41d4-a716-446655440001', 'Negotiate with carriers', 'Renegotiate contracts with shipping partners', 'todo', 'medium', current_date + interval '10 days'),
('990e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', '880e8400-e29b-41d4-a716-446655440002', 'Customer feedback analysis', 'Analyze recent customer feedback trends', 'completed', 'medium', current_date - interval '2 days'),
('990e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000000', '880e8400-e29b-41d4-a716-446655440002', 'Support team training', 'Train support team on new protocols', 'todo', 'high', current_date + interval '7 days');

-- Insert sample gate stacks
INSERT INTO public.gate_stacks (id, user_id, name, description, steps, status) VALUES 
('aa0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Quality Gate Stack', 'Standard quality assurance process', '[{"name": "Initial Review", "description": "Basic quality check", "criteria": ["Completeness", "Accuracy"]}, {"name": "Peer Review", "description": "Peer validation", "criteria": ["Best practices", "Code quality"]}, {"name": "Final Approval", "description": "Management sign-off", "criteria": ["Business impact", "Risk assessment"]}]', 'active'),
('aa0e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Process Improvement Gate', 'Gate for process change initiatives', '[{"name": "Impact Assessment", "description": "Assess change impact", "criteria": ["Resource requirements", "Timeline feasibility"]}, {"name": "Stakeholder Approval", "description": "Get stakeholder buy-in", "criteria": ["Business alignment", "Change readiness"]}]', 'draft');

-- Insert sample participation packs
INSERT INTO public.participation_packs (id, user_id, name, description, hash, participants) VALUES 
('bb0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Q1 Logistics Team', 'Participation pack for logistics optimization team', 'lgst-q1-2024-001', '[{"name": "Sarah Johnson", "role": "Logistics Manager", "participation_level": 85}, {"name": "Mike Chen", "role": "Operations Analyst", "participation_level": 92}, {"name": "Emma Davis", "role": "Supply Chain Coordinator", "participation_level": 78}]'),
('bb0e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Customer Success Team', 'Team focused on customer experience improvements', 'cust-exp-2024-001', '[{"name": "Alex Rodriguez", "role": "Customer Success Manager", "participation_level": 88}, {"name": "Lisa Park", "role": "Support Specialist", "participation_level": 91}]');

-- Insert sample transparency packs
INSERT INTO public.transparency_packs (id, user_id, name, description, hash, content) VALUES 
('cc0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Delivery Performance Transparency', 'Open data on delivery performance metrics', 'del-perf-trans-001', '{"metrics": ["delivery_time", "success_rate", "cost_efficiency"], "reporting_frequency": "weekly", "stakeholders": ["customers", "partners", "internal_teams"]}'),
('cc0e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Customer Satisfaction Transparency', 'Transparent reporting on customer satisfaction', 'cust-sat-trans-001', '{"metrics": ["nps_score", "resolution_time", "satisfaction_rating"], "reporting_frequency": "monthly", "stakeholders": ["customers", "management"]}');

-- Insert sample pilots
INSERT INTO public.pilots (id, user_id, name, type, description, status, data_series, summary) VALUES 
('dd0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'AI Route Optimization Pilot', 'ITS', 'Testing AI-powered route optimization for deliveries', 'running', '[{"date": "2024-01-01", "value": 3.2}, {"date": "2024-01-15", "value": 2.8}, {"date": "2024-02-01", "value": 2.5}, {"date": "2024-02-15", "value": 2.3}]', '{"baseline_avg": 3.5, "pilot_avg": 2.65, "improvement": "24%", "confidence": 0.92}'),
('dd0e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'Customer Service Chatbot Pilot', 'DiD', 'A/B testing chatbot vs human-only customer service', 'completed', '[{"date": "2024-01-01", "control": 4.2, "treatment": 4.1}, {"date": "2024-01-15", "control": 4.2, "treatment": 4.3}, {"date": "2024-02-01", "control": 4.1, "treatment": 4.4}, {"date": "2024-02-15", "control": 4.2, "treatment": 4.5}]', '{"control_avg": 4.18, "treatment_avg": 4.33, "lift": "3.6%", "statistical_significance": 0.95}');

-- Insert sample applied arcs
INSERT INTO public.applied_arcs (id, user_id, item_id, arc_type, level) VALUES 
('ee0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'supply-chain-opt', 'leverage', 'high'),
('ee0e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'customer-satisfaction', 'feedback', 'medium'),
('ee0e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'employee-productivity', 'structure', 'low');

-- Insert sample meta rels
INSERT INTO public.meta_rels (id, user_id, name, description, precedence_state) VALUES 
('ff0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'Global Performance Meta-Loop', 'Top-level meta loop governing overall system performance', '{"conflicts": [{"id": "conf-001", "description": "Resource allocation conflict between speed and quality", "status": "reviewing"}], "precedence": {"operational": 1, "strategic": 2, "governance": 3}}');

-- Insert sample metrics summary
INSERT INTO public.metrics_summary (id, user_id, overall_health, trend_direction, total_indicators, in_band_count, out_of_band_count) VALUES 
('ab0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 78.5, 'improving', 4, 3, 1);

-- Update RLS policies to allow reading demo data
CREATE POLICY "Allow reading demo data" ON public.loops FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo indicators" ON public.indicators FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo indicator values" ON public.indicator_values FOR SELECT USING (
  (SELECT user_id FROM public.indicators WHERE id = indicator_id) = '00000000-0000-0000-0000-000000000000'
);
CREATE POLICY "Allow reading demo rel tickets" ON public.rel_tickets FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo sprints" ON public.sprints FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo tasks" ON public.tasks FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo gate stacks" ON public.gate_stacks FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo participation packs" ON public.participation_packs FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo transparency packs" ON public.transparency_packs FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo pilots" ON public.pilots FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo applied arcs" ON public.applied_arcs FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo meta rels" ON public.meta_rels FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');
CREATE POLICY "Allow reading demo metrics" ON public.metrics_summary FOR SELECT USING (user_id = '00000000-0000-0000-0000-000000000000');