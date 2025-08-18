-- Create a function to seed demo data for authenticated users
CREATE OR REPLACE FUNCTION public.seed_demo_data_for_user()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID := auth.uid();
    loop1_id UUID := gen_random_uuid();
    loop2_id UUID := gen_random_uuid();
    loop3_id UUID := gen_random_uuid();
    indicator1_id UUID := gen_random_uuid();
    indicator2_id UUID := gen_random_uuid();
    indicator3_id UUID := gen_random_uuid();
    indicator4_id UUID := gen_random_uuid();
    sprint1_id UUID := gen_random_uuid();
    sprint2_id UUID := gen_random_uuid();
BEGIN
    -- Only seed if user is authenticated
    IF current_user_id IS NULL THEN
        RETURN;
    END IF;

    -- Check if user already has data
    IF EXISTS (SELECT 1 FROM public.loops WHERE user_id = current_user_id) THEN
        RETURN;
    END IF;

    -- Insert sample loops
    INSERT INTO public.loops (id, user_id, name, description, type, status) VALUES 
    (loop1_id, current_user_id, 'Supply Chain Optimization', 'Improving supply chain efficiency and reducing waste', 'macro', 'active'),
    (loop2_id, current_user_id, 'Customer Satisfaction', 'Enhancing customer experience and retention', 'meso', 'active'),
    (loop3_id, current_user_id, 'Employee Productivity', 'Boosting team performance and engagement', 'micro', 'planning');

    -- Insert sample indicators
    INSERT INTO public.indicators (id, user_id, name, type, unit, target_value, lower_bound, upper_bound) VALUES 
    (indicator1_id, current_user_id, 'Delivery Time', 'quantity', 'days', 3.0, 2.0, 5.0),
    (indicator2_id, current_user_id, 'Customer Rating', 'score', 'rating', 4.5, 4.0, 5.0),
    (indicator3_id, current_user_id, 'Task Completion Rate', 'percentage', '%', 85.0, 80.0, 100.0),
    (indicator4_id, current_user_id, 'Cost Per Unit', 'currency', 'USD', 50.0, 45.0, 60.0);

    -- Insert sample indicator values (time series data)
    INSERT INTO public.indicator_values (indicator_id, value, timestamp) VALUES 
    -- Delivery Time values
    (indicator1_id, 2.8, now() - interval '7 days'),
    (indicator1_id, 3.2, now() - interval '6 days'),
    (indicator1_id, 2.9, now() - interval '5 days'),
    (indicator1_id, 3.8, now() - interval '4 days'),
    (indicator1_id, 4.1, now() - interval '3 days'),
    (indicator1_id, 3.5, now() - interval '2 days'),
    (indicator1_id, 3.0, now() - interval '1 day'),
    -- Customer Rating values
    (indicator2_id, 4.2, now() - interval '7 days'),
    (indicator2_id, 4.3, now() - interval '6 days'),
    (indicator2_id, 4.1, now() - interval '5 days'),
    (indicator2_id, 4.4, now() - interval '4 days'),
    (indicator2_id, 4.6, now() - interval '3 days'),
    (indicator2_id, 4.5, now() - interval '2 days'),
    (indicator2_id, 4.4, now() - interval '1 day'),
    -- Task Completion Rate values
    (indicator3_id, 82.0, now() - interval '7 days'),
    (indicator3_id, 85.0, now() - interval '6 days'),
    (indicator3_id, 88.0, now() - interval '5 days'),
    (indicator3_id, 83.0, now() - interval '4 days'),
    (indicator3_id, 87.0, now() - interval '3 days'),
    (indicator3_id, 89.0, now() - interval '2 days'),
    (indicator3_id, 86.0, now() - interval '1 day');

    -- Insert sample REL tickets
    INSERT INTO public.rel_tickets (user_id, indicator_id, loop_id, stage, severity_score, magnitude, persistence, cohort, geo, description) VALUES 
    (current_user_id, indicator1_id, loop1_id, 'breach', 85, 1.2, 3, 'logistics', 'US-West', 'Delivery times consistently exceeding target in western regions'),
    (current_user_id, indicator2_id, loop2_id, 'open', 72, 0.8, 2, 'customer-service', 'EU', 'Customer satisfaction dipping in European markets'),
    (current_user_id, indicator3_id, loop3_id, 'analysis', 65, 0.5, 1, 'engineering', 'Global', 'Task completion rates below target in Q4');

    -- Insert sample sprints
    INSERT INTO public.sprints (id, user_id, loop_id, name, description, status, start_date, end_date, goals) VALUES 
    (sprint1_id, current_user_id, loop1_id, 'Q1 Supply Chain Sprint', 'Focus on reducing delivery times and costs', 'active', current_date, current_date + interval '14 days', '[{"goal": "Reduce average delivery time by 15%", "target": 2.5}, {"goal": "Cut logistics costs by 10%", "target": 45.0}]'),
    (sprint2_id, current_user_id, loop2_id, 'Customer Experience Sprint', 'Improve customer satisfaction scores', 'planning', current_date + interval '1 day', current_date + interval '15 days', '[{"goal": "Achieve 4.7+ customer rating", "target": 4.7}, {"goal": "Reduce response time to under 2 hours", "target": 2.0}]');

    -- Insert sample tasks
    INSERT INTO public.tasks (user_id, sprint_id, title, description, status, priority, due_date) VALUES 
    (current_user_id, sprint1_id, 'Optimize warehouse routing', 'Implement new routing algorithm for faster picking', 'in_progress', 'high', current_date + interval '5 days'),
    (current_user_id, sprint1_id, 'Negotiate with carriers', 'Renegotiate contracts with shipping partners', 'todo', 'medium', current_date + interval '10 days'),
    (current_user_id, sprint2_id, 'Customer feedback analysis', 'Analyze recent customer feedback trends', 'completed', 'medium', current_date - interval '2 days'),
    (current_user_id, sprint2_id, 'Support team training', 'Train support team on new protocols', 'todo', 'high', current_date + interval '7 days');

    -- Insert sample gate stacks
    INSERT INTO public.gate_stacks (user_id, name, description, steps, status) VALUES 
    (current_user_id, 'Quality Gate Stack', 'Standard quality assurance process', '[{"name": "Initial Review", "description": "Basic quality check", "criteria": ["Completeness", "Accuracy"]}, {"name": "Peer Review", "description": "Peer validation", "criteria": ["Best practices", "Code quality"]}, {"name": "Final Approval", "description": "Management sign-off", "criteria": ["Business impact", "Risk assessment"]}]', 'active'),
    (current_user_id, 'Process Improvement Gate', 'Gate for process change initiatives', '[{"name": "Impact Assessment", "description": "Assess change impact", "criteria": ["Resource requirements", "Timeline feasibility"]}, {"name": "Stakeholder Approval", "description": "Get stakeholder buy-in", "criteria": ["Business alignment", "Change readiness"]}]', 'draft');

    -- Insert sample participation packs
    INSERT INTO public.participation_packs (user_id, name, description, hash, participants) VALUES 
    (current_user_id, 'Q1 Logistics Team', 'Participation pack for logistics optimization team', 'lgst-q1-2024-001', '[{"name": "Sarah Johnson", "role": "Logistics Manager", "participation_level": 85}, {"name": "Mike Chen", "role": "Operations Analyst", "participation_level": 92}, {"name": "Emma Davis", "role": "Supply Chain Coordinator", "participation_level": 78}]'),
    (current_user_id, 'Customer Success Team', 'Team focused on customer experience improvements', 'cust-exp-2024-001', '[{"name": "Alex Rodriguez", "role": "Customer Success Manager", "participation_level": 88}, {"name": "Lisa Park", "role": "Support Specialist", "participation_level": 91}]');

    -- Insert sample transparency packs
    INSERT INTO public.transparency_packs (user_id, name, description, hash, content) VALUES 
    (current_user_id, 'Delivery Performance Transparency', 'Open data on delivery performance metrics', 'del-perf-trans-001', '{"metrics": ["delivery_time", "success_rate", "cost_efficiency"], "reporting_frequency": "weekly", "stakeholders": ["customers", "partners", "internal_teams"]}'),
    (current_user_id, 'Customer Satisfaction Transparency', 'Transparent reporting on customer satisfaction', 'cust-sat-trans-001', '{"metrics": ["nps_score", "resolution_time", "satisfaction_rating"], "reporting_frequency": "monthly", "stakeholders": ["customers", "management"]}');

    -- Insert sample pilots
    INSERT INTO public.pilots (user_id, name, type, description, status, data_series, summary) VALUES 
    (current_user_id, 'AI Route Optimization Pilot', 'ITS', 'Testing AI-powered route optimization for deliveries', 'running', '[{"date": "2024-01-01", "value": 3.2}, {"date": "2024-01-15", "value": 2.8}, {"date": "2024-02-01", "value": 2.5}, {"date": "2024-02-15", "value": 2.3}]', '{"baseline_avg": 3.5, "pilot_avg": 2.65, "improvement": "24%", "confidence": 0.92}'),
    (current_user_id, 'Customer Service Chatbot Pilot', 'DiD', 'A/B testing chatbot vs human-only customer service', 'completed', '[{"date": "2024-01-01", "control": 4.2, "treatment": 4.1}, {"date": "2024-01-15", "control": 4.2, "treatment": 4.3}, {"date": "2024-02-01", "control": 4.1, "treatment": 4.4}, {"date": "2024-02-15", "control": 4.2, "treatment": 4.5}]', '{"control_avg": 4.18, "treatment_avg": 4.33, "lift": "3.6%", "statistical_significance": 0.95}');

    -- Insert sample applied arcs
    INSERT INTO public.applied_arcs (user_id, item_id, arc_type, level) VALUES 
    (current_user_id, 'supply-chain-opt', 'leverage', 'high'),
    (current_user_id, 'customer-satisfaction', 'feedback', 'medium'),
    (current_user_id, 'employee-productivity', 'structure', 'low');

    -- Insert sample meta rels
    INSERT INTO public.meta_rels (user_id, name, description, precedence_state) VALUES 
    (current_user_id, 'Global Performance Meta-Loop', 'Top-level meta loop governing overall system performance', '{"conflicts": [{"id": "conf-001", "description": "Resource allocation conflict between speed and quality", "status": "reviewing"}], "precedence": {"operational": 1, "strategic": 2, "governance": 3}}');

    -- Insert sample metrics summary
    INSERT INTO public.metrics_summary (user_id, overall_health, trend_direction, total_indicators, in_band_count, out_of_band_count) VALUES 
    (current_user_id, 78.5, 'improving', 4, 3, 1);
END;
$$;

-- Update the user creation trigger to include demo data seeding
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Seed demo data for new users
  PERFORM public.seed_demo_data_for_user();
  
  RETURN NEW;
END;
$$;