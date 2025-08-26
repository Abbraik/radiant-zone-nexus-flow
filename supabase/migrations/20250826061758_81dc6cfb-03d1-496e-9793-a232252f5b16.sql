-- Simplified seed data for Structural Dossier exemplars
-- This creates three golden-path exemplars as specified in the requirements

-- Seed adopting entities first
INSERT INTO adopting_entities (entity_id, name, kind, parent_id) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Ministry of Education', 'ministry', NULL),
  ('a2222222-2222-2222-2222-222222222222', 'Education Board', 'agency', NULL),
  ('a3333333-3333-3333-3333-333333333333', 'Labour Department', 'ministry', NULL),
  ('a4444444-4444-4444-4444-444444444444', 'Employment Services', 'agency', NULL),
  ('a5555555-5555-5555-5555-555555555555', 'Municipality Planning', 'agency', NULL),
  ('a6666666-6666-6666-6666-666666666666', 'PMO Digital', 'ministry', NULL),
  ('a7777777-7777-7777-7777-777777777777', 'Central Region', 'region', NULL),
  ('a8888888-8888-8888-8888-888888888888', 'Northern Region', 'region', NULL),
  ('a9999999-9999-9999-9999-999999999999', 'Housing Authority', 'agency', NULL),
  ('a0000000-0000-0000-0000-000000000000', 'Utilities Corp', 'provider', NULL)
ON CONFLICT (entity_id) DO NOTHING;

-- Create standards with fixed IDs
INSERT INTO standards (standard_id, name, domain, active) VALUES
  ('s1111111-1111-1111-1111-111111111111', 'Credential Verification API', 'education', true),
  ('s2222222-2222-2222-2222-222222222222', 'Open Status Standard', 'digital_services', true),
  ('s3333333-3333-3333-3333-333333333333', 'Planning Permit Schema', 'housing', true)
ON CONFLICT (standard_id) DO NOTHING;

-- Create standard versions with fixed IDs
INSERT INTO standard_versions (std_ver_id, standard_id, version, spec) VALUES
  ('v1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'v1.0', '{"type": "api", "endpoints": ["/api/credentials/verify"], "schema": {"credential_id": "string", "status": "enum"}}'),
  ('v2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'v1.0', '{"type": "endpoint", "path": "/status.json", "required_fields": ["status", "timestamp", "services"]}'),
  ('v3333333-3333-3333-3333-333333333333', 's3333333-3333-3333-3333-333333333333', 'v1.0', '{"type": "schema", "properties": {"permit_id": "string", "parcel": "object", "status": "enum", "submitted_at": "datetime"}}')
ON CONFLICT (std_ver_id) DO NOTHING;

-- Create exemplar dossiers with fixed IDs
INSERT INTO structural_dossiers (dossier_id, loop_id, title, status, version, summary, horizon_tag, coherence_note, consent_note, published_at, published_by, public_slug) VALUES
  ('d1111111-1111-1111-1111-111111111111', gen_random_uuid(), 'Educator Recognition Fast Lane', 'published', 'v1.0', 'Streamlined credential processing for educators to reduce fertility barriers', 'fertility_labour', 'Aligned with workforce development goals', 'Community consultation completed', now() - interval '7 days', 'system', 'educator-fast-lane'),
  ('d2222222-2222-2222-2222-222222222222', gen_random_uuid(), 'Open Status Standard', 'published', 'v1.0', 'Transparent service status reporting for digital cohesion', 'cohesion', 'Supports trust and transparency objectives', 'Cross-ministry agreement achieved', now() - interval '5 days', 'system', 'open-status-standard'),
  ('d3333333-3333-3333-3333-333333333333', gen_random_uuid(), 'Housing Approvals Fast Lane', 'published', 'v1.0', 'Accelerated planning approvals in designated corridors', 'fertility_housing', 'Part of comprehensive affordability strategy', 'Municipal pilot authority granted', now() - interval '3 days', 'system', 'housing-fast-lane')
ON CONFLICT (dossier_id) DO NOTHING;

-- Create components for Educator Fast Lane
INSERT INTO structural_components (component_id, dossier_id, kind, title, content, order_no) VALUES
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'mandate', 'Education Act Authority', '{"approved": true, "authority": "Education Act §42", "delegated_to": "Education Board"}', 1),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'mesh', 'Multi-Agency Coordination', '{"parties": ["Education", "Labour", "Municipality"], "joint_kpis": [{"name": "credential_sla", "target": "<=21 days"}, {"name": "placements", "target": ">=80/month"}]}', 2),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'process', 'Credential Processing Workflow', '{"sla": "21 days", "steps": ["Application", "Verification", "Review", "Approval", "Notification", "Registration"], "gates": [{"step": 3, "criteria": "Document completeness"}]}', 3),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'standard', 'API Integration', '{"standard_version_id": "v1111111-1111-1111-1111-111111111111", "spec": {"endpoint": "/api/credentials/verify", "methods": ["GET", "POST"]}}', 4),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'market', 'Incentive Structure', '{"fee_schedule": "transparent", "expansion_incentive": "modest"}', 5),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'transparency', 'Public Reporting', '{"dashboard": "weekly", "metrics": ["processing_time", "approval_rate", "placement_rate"]}', 6)
ON CONFLICT (component_id) DO NOTHING;

-- Create components for Open Status Standard
INSERT INTO structural_components (component_id, dossier_id, kind, title, content, order_no) VALUES
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'mandate', 'Digital Service Policy', '{"approved": true, "authority": "Digital Services Policy", "scope": "All public-facing digital services"}', 1),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'mesh', 'Cross-Ministry Implementation', '{"parties": ["PMO", "All Ministries"], "joint_kpis": [{"name": "outage_reporting", "target": "<15 min TTD"}]}', 2),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'process', 'Incident Communication', '{"sla": "15 minutes", "steps": ["Detection", "Classification", "Communication", "Resolution", "Follow-up"], "gates": [{"step": 2, "criteria": "Impact assessment"}]}', 3),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'standard', 'Status Endpoint Specification', '{"standard_version_id": "v2222222-2222-2222-2222-222222222222", "spec": {"endpoint": "/status.json", "format": "JSON"}}', 4),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'market', 'Implementation Incentives', '{"compliance_timeline": "6 months", "support_available": true}', 5),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'transparency', 'Public Status Pages', '{"requirement": "Public banners for outages", "aggregation": "Central status dashboard"}', 6)
ON CONFLICT (component_id) DO NOTHING;

-- Create components for Housing Fast Lane
INSERT INTO structural_components (component_id, dossier_id, kind, title, content, order_no) VALUES
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'mandate', 'Planning Code Pilot', '{"approved": true, "authority": "Planning Code Amendment", "scope": "Designated corridors only"}', 1),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'mesh', 'Integrated Approval Process', '{"parties": ["Planning", "Utilities", "Municipality"], "joint_kpis": [{"name": "approval_to_start", "target": "<=60 days"}]}', 2),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'process', 'Fast Track Approvals', '{"sla": "60 days", "steps": ["Pre-application", "Submission", "Feasibility", "Review", "Approval"], "gates": [{"step": 3, "criteria": "Feasibility confirmed"}]}', 3),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'standard', 'Permit Data Schema', '{"standard_version_id": "v3333333-3333-3333-3333-333333333333", "spec": {"api": "/api/permits", "schema": "permit_v1"}}', 4),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'market', 'Fee Transparency', '{"fee_schedule": "published", "fast_track_premium": "20%"}', 5),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'transparency', 'Progress Tracking', '{"public_dashboard": true, "metrics": ["applications", "approvals", "timing"]}', 6)
ON CONFLICT (component_id) DO NOTHING;

-- Create conformance rules
INSERT INTO conformance_rules (rule_id, dossier_id, std_ver_id, rule_title, rule_expr, severity) VALUES
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111', 'API Endpoint Available', '{"type": "api", "endpoint": "/api/credentials/verify", "expected_status": 200}', 'must'),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111', 'Response Schema Valid', '{"type": "schema", "endpoint": "/api/credentials/verify", "validate_against": "credential_v1"}', 'must'),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', NULL, 'SLA Compliance', '{"type": "sla", "metric": "credential_processing_time", "threshold": 21, "unit": "days"}', 'must'),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'v2222222-2222-2222-2222-222222222222', 'Status Endpoint Live', '{"type": "api", "endpoint": "/status.json", "expected_status": 200}', 'must'),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'v2222222-2222-2222-2222-222222222222', 'Required Fields Present', '{"type": "jsonpath", "endpoint": "/status.json", "paths": ["$.status", "$.timestamp", "$.services"]}', 'must'),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', NULL, 'Response Time SLA', '{"type": "sla", "metric": "status_response_time", "threshold": 500, "unit": "ms"}', 'should'),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'v3333333-3333-3333-3333-333333333333', 'Permit API Available', '{"type": "api", "endpoint": "/api/permits", "expected_status": 200}', 'must'),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'v3333333-3333-3333-3333-333333333333', 'Schema Compliance', '{"type": "schema", "endpoint": "/api/permits", "validate_against": "permit_v1"}', 'must'),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', NULL, 'Approval Timeline', '{"type": "sla", "metric": "approval_to_start_days", "threshold": 60, "unit": "days"}', 'must')
ON CONFLICT (rule_id) DO NOTHING;

-- Create some adoption records  
INSERT INTO structural_adoptions (adopt_id, dossier_id, entity_id, state, owner, started_at, moved_at, notes) VALUES
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'full', 'Lead Implementation Manager', now() - interval '5 days', now() - interval '1 day', 'Successfully implemented with 18-day average processing time'),
  (gen_random_uuid(), 'd1111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'partial', 'Integration Specialist', now() - interval '3 days', now() - interval '1 day', 'API integration complete, workflow optimization in progress'),
  (gen_random_uuid(), 'd2222222-2222-2222-2222-222222222222', 'a6666666-6666-6666-6666-666666666666', 'full', 'Digital Services Director', now() - interval '4 days', now() - interval '2 days', 'Status endpoints deployed across all services'),
  (gen_random_uuid(), 'd3333333-3333-3333-3333-333333333333', 'a5555555-5555-5555-5555-555555555555', 'pilot', 'Planning Director', now() - interval '2 days', now() - interval '1 day', 'Pilot launched in downtown corridor')
ON CONFLICT (adopt_id) DO NOTHING;