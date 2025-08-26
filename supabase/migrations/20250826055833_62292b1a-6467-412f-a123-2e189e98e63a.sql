-- Seed initial data for Anticipatory Runtime

-- Insert demo risk channels
INSERT INTO risk_channels (channel_key, title, description, default_window, enabled) VALUES
('childcare_load', 'Childcare System Load', 'Monitor childcare availability and waiting times', '14d', true),
('heat_wave', 'Heat Wave Events', 'Track extreme heat conditions and health impacts', '7d', true),
('supply_chain', 'Supply Chain Disruption', 'Monitor port congestion and logistics bottlenecks', '21d', true),
('trust_divergence', 'Trust & Social Cohesion', 'Track community trust and satisfaction trends', '60d', true),
('orderbook_visa', 'Economic Indicators', 'Monitor export orders and visa processing delays', '14d', true),
('grievances', 'Grievance Hotspots', 'Track grievance rates and complaint patterns', '14d', true),
('prices', 'Price Volatility', 'Monitor CPI subindex movements and price shocks', '28d', true)
ON CONFLICT (channel_key) DO NOTHING;

-- Insert demo playbooks
INSERT INTO playbooks (playbook_key, capacity, title, content, active) VALUES
('containment_pack_childcare', 'responsive', 'Childcare Surge - Containment Pack', 
 '{"description": "Emergency response for childcare system overload", "items": [{"key": "crew_call", "label": "Emergency staff call-up tree", "ready": true}, {"key": "extended_hours", "label": "Extended hours authorization script", "ready": true}], "checklist": ["Activate emergency staffing protocol", "Extend operating hours"], "resources": {"staff": "24 emergency workers", "budget": "€250k emergency allocation", "timeToActivate": "4 hours"}}'::jsonb, 
 true),
('readiness_plan_heat', 'anticipatory', 'Heat Wave - Readiness Plan',
 '{"description": "Proactive preparation for extreme heat events", "items": [{"key": "cooling_centers", "label": "Cooling center preparation", "ready": true}, {"key": "health_supplies", "label": "Heat stress medical supplies", "ready": true}], "checklist": ["Pre-position cooling center supplies", "Stage medical heat stress kits"], "resources": {"staff": "12 specialists", "budget": "€150k preparedness allocation", "timeToActivate": "24 hours"}}'::jsonb,
 true),
('portfolio_compare_cohesion', 'deliberative', 'Social Cohesion - Portfolio Comparison',
 '{"description": "Systematic review of social cohesion interventions", "items": [{"key": "participation_sprint", "label": "Community participation sprint checklist", "ready": true}], "checklist": ["Launch community participation initiatives"], "resources": {"staff": "8 community liaisons", "budget": "€80k engagement allocation", "timeToActivate": "72 hours"}}'::jsonb,
 true)
ON CONFLICT (playbook_key) DO NOTHING;

-- Insert demo trigger templates
INSERT INTO trigger_templates (template_key, version, channel_key, title, dsl, defaults) VALUES
('childcare_load_v1', 1, 'childcare_load', 'Childcare Load Monitor', 
 'IF childcare_wait_days >= 30 FOR 14d THEN START containment_pack_childcare IN responsive WITH COOLDOWN=14d',
 '{"persistence": 14, "cooldown": 14, "thresholds": {"wait_days": 30}}'::jsonb),
('heat_wave_v1', 1, 'heat_wave', 'Heat Index Threshold',
 'IF heat_index >= 0.75 FOR 7d THEN START readiness_plan_heat IN anticipatory WITH COOLDOWN=7d',
 '{"persistence": 7, "cooldown": 7, "thresholds": {"heat_index": 0.75}}'::jsonb),
('trust_divergence_v1', 1, 'trust_divergence', 'Trust Slope Divergence',
 'IF SLOPE(trust_score, 60d) <= -0.05 THEN START portfolio_compare_cohesion IN deliberative WITH COOLDOWN=30d',
 '{"persistence": 60, "cooldown": 30, "thresholds": {"trust_slope": -0.05}}'::jsonb)
ON CONFLICT (template_key, version) DO NOTHING;