-- Seed Shared Nodes (SNL) Backbone and Golden-Path Loops
-- 1. Insert canonical SNL keys used across PAGS
INSERT INTO shared_nodes (snl_id, key, label, type) VALUES 
-- Economy SNL keys
(gen_random_uuid(), 'Economy.LaborDemand', 'Labor Demand Hub', 'hub'),
(gen_random_uuid(), 'Economy.Prices', 'Price Signals Hub', 'hub'),
(gen_random_uuid(), 'Economy.Skills.Stock', 'Skills Stock Hub', 'hub'),

-- Services capacity
(gen_random_uuid(), 'Services.Capacity.Health', 'Health Services Capacity', 'hub'),
(gen_random_uuid(), 'Services.Capacity.Education', 'Education Services Capacity', 'hub'), 
(gen_random_uuid(), 'Services.Capacity.Housing', 'Housing Services Capacity', 'hub'),

-- Land and resources
(gen_random_uuid(), 'Land.Supply', 'Land Supply Hub', 'hub'),

-- Society and trust
(gen_random_uuid(), 'Society.Trust', 'Social Trust Hub', 'hub'),
(gen_random_uuid(), 'Society.Participation', 'Civic Participation Hub', 'hub'),

-- Institutions
(gen_random_uuid(), 'Institutions.DecisionLatency', 'Decision Latency Bottleneck', 'bottleneck'),
(gen_random_uuid(), 'Housing.Approvals', 'Housing Approvals Bridge', 'bridge')
ON CONFLICT (key) DO NOTHING;

-- 2. Seed Golden-Path Loops for three verticals
-- Get user ID for seeding (use first authenticated user or system user)
DO $$
DECLARE
    system_user_id uuid := '00000000-0000-0000-0000-000000000000';
    fertility_loop_id uuid;
    childcare_loop_id uuid;
    labor_mkt_loop_id uuid;
    credentials_loop_id uuid;
    wages_loop_id uuid;
    service_rel_loop_id uuid;
    trust_loop_id uuid;
    participation_loop_id uuid;
    housing_supply_loop_id uuid;
BEGIN
    -- FERTILITY VERTICAL (MAC-L01, MAC-L02)
    
    -- MAC-L01: Total Fertility Rate Loop
    INSERT INTO loops (id, name, loop_type, scale, motif, layer, status, loop_code, source_tag, user_id, metadata)
    VALUES (
        gen_random_uuid(), 
        'Total Fertility Rate Dynamics', 
        'structural', 
        'macro', 
        'B', 
        'macro',
        'published', 
        'MAC-L01',
        'GOLDEN_PATH',
        system_user_id,
        '{"tags": ["fertility", "demographics", "population"], "vertical": "fertility", "priority": "high"}'
    ) RETURNING id INTO fertility_loop_id;

    -- Add nodes for MAC-L01
    INSERT INTO loop_nodes (loop_id, label, kind, domain) VALUES
    (fertility_loop_id, 'Total Fertility Rate', 'stock', 'population'),
    (fertility_loop_id, 'Desired Family Size', 'aux', 'social'),
    (fertility_loop_id, 'Economic Pressure', 'aux', 'resource'),
    (fertility_loop_id, 'Childcare Availability', 'stock', 'institution'),
    (fertility_loop_id, 'Career Opportunity Cost', 'aux', 'resource'),
    (fertility_loop_id, 'Social Support', 'aux', 'social');

    -- Add edges for MAC-L01
    INSERT INTO loop_edges (loop_id, from_node, to_node, polarity, weight) 
    SELECT fertility_loop_id, ln1.id, ln2.id, 1, 0.7
    FROM loop_nodes ln1, loop_nodes ln2 
    WHERE ln1.loop_id = fertility_loop_id AND ln2.loop_id = fertility_loop_id
    AND ln1.label = 'Desired Family Size' AND ln2.label = 'Total Fertility Rate';

    INSERT INTO loop_edges (loop_id, from_node, to_node, polarity, weight)
    SELECT fertility_loop_id, ln1.id, ln2.id, -1, 0.8
    FROM loop_nodes ln1, loop_nodes ln2 
    WHERE ln1.loop_id = fertility_loop_id AND ln2.loop_id = fertility_loop_id
    AND ln1.label = 'Economic Pressure' AND ln2.label = 'Total Fertility Rate';

    INSERT INTO loop_edges (loop_id, from_node, to_node, polarity, weight)
    SELECT fertility_loop_id, ln1.id, ln2.id, 1, 0.6
    FROM loop_nodes ln1, loop_nodes ln2 
    WHERE ln1.loop_id = fertility_loop_id AND ln2.loop_id = fertility_loop_id
    AND ln1.label = 'Childcare Availability' AND ln2.label = 'Total Fertility Rate';

    -- Add DE bands for MAC-L01
    INSERT INTO de_bands (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
    VALUES 
    (fertility_loop_id, 'tfr', 1.8, 2.2, 0.3, 0.3, system_user_id),
    (fertility_loop_id, 'desired_actual_gap', -0.3, 0.3, 0.5, 0.4, system_user_id);

    -- Add SRT window for MAC-L01  
    INSERT INTO srt_windows (loop_id, window_start, window_end, reflex_horizon, cadence, user_id)
    VALUES (fertility_loop_id, now(), now() + interval '1 year', interval '3 months', interval '1 month', system_user_id);

    -- MAC-L02: Childcare Access Loop
    INSERT INTO loops (id, name, loop_type, scale, motif, layer, status, loop_code, source_tag, user_id, metadata)
    VALUES (
        gen_random_uuid(),
        'Childcare Access and Quality',
        'structural',
        'meso', 
        'R',
        'meso',
        'published',
        'MAC-L02', 
        'GOLDEN_PATH',
        system_user_id,
        '{"tags": ["childcare", "services", "family"], "vertical": "fertility", "priority": "high"}'
    ) RETURNING id INTO childcare_loop_id;

    -- Add nodes for MAC-L02
    INSERT INTO loop_nodes (loop_id, label, kind, domain) VALUES
    (childcare_loop_id, 'Childcare Wait Times', 'stock', 'institution'),
    (childcare_loop_id, 'Service Capacity', 'stock', 'institution'),
    (childcare_loop_id, 'Quality Rating', 'aux', 'social'),
    (childcare_loop_id, 'Funding Per Child', 'stock', 'resource'),
    (childcare_loop_id, 'Staff Retention', 'aux', 'institution'),
    (childcare_loop_id, 'Parent Satisfaction', 'aux', 'social');

    -- Add DE bands for MAC-L02
    INSERT INTO de_bands (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
    VALUES 
    (childcare_loop_id, 'childcare_wait_days', 30, 90, 0.4, 0.3, system_user_id),
    (childcare_loop_id, 'quality_score', 3.5, 4.5, 0.3, 0.4, system_user_id);

    -- Add SRT window for MAC-L02
    INSERT INTO srt_windows (loop_id, window_start, window_end, reflex_horizon, cadence, user_id)
    VALUES (childcare_loop_id, now(), now() + interval '6 months', interval '2 months', interval '2 weeks', system_user_id);

    -- LABOUR MARKET VERTICAL (MAC-L04, MES-L01, MIC-L08)
    
    -- MAC-L04: Labour Market Matching
    INSERT INTO loops (id, name, loop_type, scale, motif, layer, status, loop_code, source_tag, user_id, metadata)
    VALUES (
        gen_random_uuid(),
        'Labour Market Matching Efficiency',
        'reactive',
        'macro',
        'B', 
        'macro',
        'published',
        'MAC-L04',
        'GOLDEN_PATH',
        system_user_id,
        '{"tags": ["labour", "employment", "matching"], "vertical": "labour", "priority": "high"}'
    ) RETURNING id INTO labor_mkt_loop_id;

    -- Add nodes for MAC-L04
    INSERT INTO loop_nodes (loop_id, label, kind, domain) VALUES
    (labor_mkt_loop_id, 'Vacancy-Unemployment Gap', 'stock', 'resource'),
    (labor_mkt_loop_id, 'Skills Mismatch', 'aux', 'resource'),
    (labor_mkt_loop_id, 'Time to Fill', 'stock', 'institution'),
    (labor_mkt_loop_id, 'Search Efficiency', 'aux', 'institution'),
    (labor_mkt_loop_id, 'Wage Flexibility', 'aux', 'resource'),
    (labor_mkt_loop_id, 'Geographic Mobility', 'aux', 'social');

    -- Add DE bands for MAC-L04
    INSERT INTO de_bands (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
    VALUES 
    (labor_mkt_loop_id, 'vacancy_unemployment_gap', -0.2, 0.2, 0.5, 0.3, system_user_id),
    (labor_mkt_loop_id, 'time_to_fill', 30, 90, 0.3, 0.4, system_user_id);

    -- Add SRT window for MAC-L04
    INSERT INTO srt_windows (loop_id, window_start, window_end, reflex_horizon, cadence, user_id)
    VALUES (labor_mkt_loop_id, now(), now() + interval '1 year', interval '1 month', interval '2 weeks', system_user_id);

    -- SOCIAL COHESION VERTICAL (MES-L02, MIC-L04)
    
    -- MES-L02: Service Reliability Loop
    INSERT INTO loops (id, name, loop_type, scale, motif, layer, status, loop_code, source_tag, user_id, metadata)
    VALUES (
        gen_random_uuid(),
        'Public Service Reliability',
        'structural',
        'meso',
        'B',
        'meso', 
        'published',
        'MES-L02',
        'GOLDEN_PATH',
        system_user_id,
        '{"tags": ["services", "reliability", "trust"], "vertical": "cohesion", "priority": "high"}'
    ) RETURNING id INTO service_rel_loop_id;

    -- Add nodes for MES-L02
    INSERT INTO loop_nodes (loop_id, label, kind, domain) VALUES
    (service_rel_loop_id, 'Service Outage Rate', 'stock', 'institution'),
    (service_rel_loop_id, 'Maintenance Investment', 'stock', 'resource'),
    (service_rel_loop_id, 'System Resilience', 'aux', 'institution'),
    (service_rel_loop_id, 'User Complaints', 'flow', 'social'),
    (service_rel_loop_id, 'Staff Morale', 'aux', 'social'),
    (service_rel_loop_id, 'Budget Pressure', 'aux', 'resource');

    -- Add DE bands for MES-L02
    INSERT INTO de_bands (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
    VALUES 
    (service_rel_loop_id, 'outage_rate', 0.02, 0.08, 0.3, 0.3, system_user_id),
    (service_rel_loop_id, 'satisfaction_score', 3.0, 4.0, 0.4, 0.3, system_user_id);

    -- Add SRT window for MES-L02
    INSERT INTO srt_windows (loop_id, window_start, window_end, reflex_horizon, cadence, user_id)
    VALUES (service_rel_loop_id, now(), now() + interval '6 months', interval '1 month', interval '1 week', system_user_id);

    -- MIC-L04: Trust and Participation Loop
    INSERT INTO loops (id, name, loop_type, scale, motif, layer, status, loop_code, source_tag, user_id, metadata)
    VALUES (
        gen_random_uuid(),
        'Social Trust and Civic Participation',
        'structural', 
        'micro',
        'R',
        'micro',
        'published',
        'MIC-L04',
        'GOLDEN_PATH',
        system_user_id,
        '{"tags": ["trust", "participation", "social"], "vertical": "cohesion", "priority": "high"}'
    ) RETURNING id INTO trust_loop_id;

    -- Add nodes for MIC-L04
    INSERT INTO loop_nodes (loop_id, label, kind, domain) VALUES
    (trust_loop_id, 'Trust Index', 'stock', 'social'),
    (trust_loop_id, 'Civic Engagement', 'stock', 'social'),
    (trust_loop_id, 'Information Quality', 'aux', 'institution'),
    (trust_loop_id, 'Community Events', 'flow', 'social'),
    (trust_loop_id, 'Social Capital', 'stock', 'social'),
    (trust_loop_id, 'Institutional Performance', 'aux', 'institution');

    -- Add DE bands for MIC-L04
    INSERT INTO de_bands (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, user_id)
    VALUES 
    (trust_loop_id, 'trust_index', 0.4, 0.7, 0.5, 0.3, system_user_id),
    (trust_loop_id, 'participation_rate', 0.15, 0.35, 0.4, 0.3, system_user_id);

    -- Add SRT window for MIC-L04
    INSERT INTO srt_windows (loop_id, window_start, window_end, reflex_horizon, cadence, user_id)
    VALUES (trust_loop_id, now(), now() + interval '1 year', interval '2 months', interval '1 month', system_user_id);

    -- 3. Add cascades to connect the loops
    INSERT INTO cascades (from_loop_id, to_loop_id, relation, note, user_id) VALUES
    (fertility_loop_id, childcare_loop_id, 'reinforces', 'Fertility rates drive childcare demand, quality affects fertility decisions', system_user_id),
    (childcare_loop_id, labor_mkt_loop_id, 'enables', 'Quality childcare enables labour market participation', system_user_id),
    (service_rel_loop_id, trust_loop_id, 'influences', 'Service reliability affects social trust levels', system_user_id),
    (trust_loop_id, service_rel_loop_id, 'supports', 'Higher trust leads to better service cooperation', system_user_id);

    -- 4. Add loop versions for all seeded loops
    INSERT INTO loop_versions (loop_id, version, payload) VALUES
    (fertility_loop_id, 1, '{"name": "Total Fertility Rate Dynamics", "rationale": "Golden path seeding for fertility vertical demo", "changes": ["Initial structure", "Core feedback loops", "DE bands calibrated"]}'),
    (childcare_loop_id, 1, '{"name": "Childcare Access and Quality", "rationale": "Golden path seeding for fertility-childcare link", "changes": ["Service capacity feedback", "Quality metrics", "Wait time dynamics"]}'),
    (labor_mkt_loop_id, 1, '{"name": "Labour Market Matching Efficiency", "rationale": "Golden path seeding for labour vertical", "changes": ["Skills matching dynamics", "Vacancy-unemployment gaps", "Search efficiency loops"]}'),
    (service_rel_loop_id, 1, '{"name": "Public Service Reliability", "rationale": "Golden path seeding for cohesion vertical", "changes": ["Service reliability feedback", "Investment-performance links", "User satisfaction dynamics"]}'),
    (trust_loop_id, 1, '{"name": "Social Trust and Civic Participation", "rationale": "Golden path seeding for social trust dynamics", "changes": ["Trust-participation reinforcement", "Information quality effects", "Institutional performance links"]}');

END $$;