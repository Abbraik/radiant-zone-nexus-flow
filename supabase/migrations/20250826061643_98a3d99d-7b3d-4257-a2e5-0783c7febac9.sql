-- Seed exemplar dossiers for the Structural system
-- This creates three golden-path exemplars as specified in the requirements

-- Seed adopting entities first
INSERT INTO adopting_entities (entity_id, name, kind, parent_id) VALUES
  (gen_random_uuid(), 'Ministry of Education', 'ministry', NULL),
  (gen_random_uuid(), 'Education Board', 'agency', NULL),
  (gen_random_uuid(), 'Labour Department', 'ministry', NULL),
  (gen_random_uuid(), 'Employment Services', 'agency', NULL),
  (gen_random_uuid(), 'Municipality Planning', 'agency', NULL),
  (gen_random_uuid(), 'PMO Digital', 'ministry', NULL),
  (gen_random_uuid(), 'Central Region', 'region', NULL),
  (gen_random_uuid(), 'Northern Region', 'region', NULL),
  (gen_random_uuid(), 'Housing Authority', 'agency', NULL),
  (gen_random_uuid(), 'Utilities Corp', 'provider', NULL)
ON CONFLICT (entity_id) DO NOTHING;

-- Create standards
INSERT INTO standards (standard_id, name, domain, active) VALUES
  (gen_random_uuid(), 'Credential Verification API', 'education', true),
  (gen_random_uuid(), 'Open Status Standard', 'digital_services', true),
  (gen_random_uuid(), 'Planning Permit Schema', 'housing', true)
ON CONFLICT (standard_id) DO NOTHING;

-- Get standard IDs for use in versions
DO $$
DECLARE
  credential_std_id uuid;
  status_std_id uuid;
  permit_std_id uuid;
  credential_ver_id uuid;
  status_ver_id uuid;
  permit_ver_id uuid;
  dossier1_id uuid;
  dossier2_id uuid;
  dossier3_id uuid;
BEGIN
  -- Get standard IDs
  SELECT standard_id INTO credential_std_id FROM standards WHERE name = 'Credential Verification API';
  SELECT standard_id INTO status_std_id FROM standards WHERE name = 'Open Status Standard';
  SELECT standard_id INTO permit_std_id FROM standards WHERE name = 'Planning Permit Schema';

  -- Create standard versions
  INSERT INTO standard_versions (std_ver_id, standard_id, version, spec) VALUES
    (gen_random_uuid(), credential_std_id, 'v1.0', '{"type": "api", "endpoints": ["/api/credentials/verify"], "schema": {"credential_id": "string", "status": "enum"}}'),
    (gen_random_uuid(), status_std_id, 'v1.0', '{"type": "endpoint", "path": "/status.json", "required_fields": ["status", "timestamp", "services"]}'),
    (gen_random_uuid(), permit_std_id, 'v1.0', '{"type": "schema", "properties": {"permit_id": "string", "parcel": "object", "status": "enum", "submitted_at": "datetime"}}')
  ON CONFLICT (std_ver_id) DO NOTHING
  RETURNING std_ver_id INTO credential_ver_id;

  -- Get version IDs (simplified - in real implementation would use proper selection)
  SELECT std_ver_id INTO credential_ver_id FROM standard_versions WHERE standard_id = credential_std_id;
  SELECT std_ver_id INTO status_ver_id FROM standard_versions WHERE standard_id = status_std_id;
  SELECT std_ver_id INTO permit_ver_id FROM standard_versions WHERE standard_id = permit_std_id;

  -- Create exemplar dossiers
  INSERT INTO structural_dossiers (dossier_id, loop_id, title, status, version, summary, horizon_tag, coherence_note, consent_note, published_at, published_by, public_slug) VALUES
    (gen_random_uuid(), gen_random_uuid(), 'Educator Recognition Fast Lane', 'published', 'v1.0', 'Streamlined credential processing for educators to reduce fertility barriers', 'fertility_labour', 'Aligned with workforce development goals', 'Community consultation completed', now() - interval '7 days', 'system', 'educator-fast-lane'),
    (gen_random_uuid(), gen_random_uuid(), 'Open Status Standard', 'published', 'v1.0', 'Transparent service status reporting for digital cohesion', 'cohesion', 'Supports trust and transparency objectives', 'Cross-ministry agreement achieved', now() - interval '5 days', 'system', 'open-status-standard'),
    (gen_random_uuid(), gen_random_uuid(), 'Housing Approvals Fast Lane', 'published', 'v1.0', 'Accelerated planning approvals in designated corridors', 'fertility_housing', 'Part of comprehensive affordability strategy', 'Municipal pilot authority granted', now() - interval '3 days', 'system', 'housing-fast-lane')
  ON CONFLICT (dossier_id) DO NOTHING
  RETURNING dossier_id INTO dossier1_id;

  -- Get dossier IDs
  SELECT dossier_id INTO dossier1_id FROM structural_dossiers WHERE public_slug = 'educator-fast-lane';
  SELECT dossier_id INTO dossier2_id FROM structural_dossiers WHERE public_slug = 'open-status-standard';
  SELECT dossier_id INTO dossier3_id FROM structural_dossiers WHERE public_slug = 'housing-fast-lane';

  -- Create components for Educator Fast Lane
  INSERT INTO structural_components (component_id, dossier_id, kind, title, content, order_no) VALUES
    (gen_random_uuid(), dossier1_id, 'mandate', 'Education Act Authority', '{"approved": true, "authority": "Education Act §42", "delegated_to": "Education Board"}', 1),
    (gen_random_uuid(), dossier1_id, 'mesh', 'Multi-Agency Coordination', '{"parties": ["Education", "Labour", "Municipality"], "joint_kpis": [{"name": "credential_sla", "target": "<=21 days"}, {"name": "placements", "target": ">=80/month"}]}', 2),
    (gen_random_uuid(), dossier1_id, 'process', 'Credential Processing Workflow', '{"sla": "21 days", "steps": ["Application", "Verification", "Review", "Approval", "Notification", "Registration"], "gates": [{"step": 3, "criteria": "Document completeness"}]}', 3),
    (gen_random_uuid(), dossier1_id, 'standard', 'API Integration', '{"standard_version_id": "' || credential_ver_id || '", "spec": {"endpoint": "/api/credentials/verify", "methods": ["GET", "POST"]}}', 4),
    (gen_random_uuid(), dossier1_id, 'market', 'Incentive Structure', '{"fee_schedule": "transparent", "expansion_incentive": "modest"}', 5),
    (gen_random_uuid(), dossier1_id, 'transparency', 'Public Reporting', '{"dashboard": "weekly", "metrics": ["processing_time", "approval_rate", "placement_rate"]}', 6)
  ON CONFLICT (component_id) DO NOTHING;

  -- Create components for Open Status Standard
  INSERT INTO structural_components (component_id, dossier_id, kind, title, content, order_no) VALUES
    (gen_random_uuid(), dossier2_id, 'mandate', 'Digital Service Policy', '{"approved": true, "authority": "Digital Services Policy", "scope": "All public-facing digital services"}', 1),
    (gen_random_uuid(), dossier2_id, 'mesh', 'Cross-Ministry Implementation', '{"parties": ["PMO", "All Ministries"], "joint_kpis": [{"name": "outage_reporting", "target": "<15 min TTD"}]}', 2),
    (gen_random_uuid(), dossier2_id, 'process', 'Incident Communication', '{"sla": "15 minutes", "steps": ["Detection", "Classification", "Communication", "Resolution", "Follow-up"], "gates": [{"step": 2, "criteria": "Impact assessment"}]}', 3),
    (gen_random_uuid(), dossier2_id, 'standard', 'Status Endpoint Specification', '{"standard_version_id": "' || status_ver_id || '", "spec": {"endpoint": "/status.json", "format": "JSON"}}', 4),
    (gen_random_uuid(), dossier2_id, 'market', 'Implementation Incentives', '{"compliance_timeline": "6 months", "support_available": true}', 5),
    (gen_random_uuid(), dossier2_id, 'transparency', 'Public Status Pages', '{"requirement": "Public banners for outages", "aggregation": "Central status dashboard"}', 6)
  ON CONFLICT (component_id) DO NOTHING;

  -- Create components for Housing Fast Lane
  INSERT INTO structural_components (component_id, dossier_id, kind, title, content, order_no) VALUES
    (gen_random_uuid(), dossier3_id, 'mandate', 'Planning Code Pilot', '{"approved": true, "authority": "Planning Code Amendment", "scope": "Designated corridors only"}', 1),
    (gen_random_uuid(), dossier3_id, 'mesh', 'Integrated Approval Process', '{"parties": ["Planning", "Utilities", "Municipality"], "joint_kpis": [{"name": "approval_to_start", "target": "<=60 days"}]}', 2),
    (gen_random_uuid(), dossier3_id, 'process', 'Fast Track Approvals', '{"sla": "60 days", "steps": ["Pre-application", "Submission", "Feasibility", "Review", "Approval"], "gates": [{"step": 3, "criteria": "Feasibility confirmed"}]}', 3),
    (gen_random_uuid(), dossier3_id, 'standard', 'Permit Data Schema', '{"standard_version_id": "' || permit_ver_id || '", "spec": {"api": "/api/permits", "schema": "permit_v1"}}', 4),
    (gen_random_uuid(), dossier3_id, 'market', 'Fee Transparency', '{"fee_schedule": "published", "fast_track_premium": "20%"}', 5),
    (gen_random_uuid(), dossier3_id, 'transparency', 'Progress Tracking', '{"public_dashboard": true, "metrics": ["applications", "approvals", "timing"]}', 6)
  ON CONFLICT (component_id) DO NOTHING;

  -- Create conformance rules
  INSERT INTO conformance_rules (rule_id, dossier_id, std_ver_id, rule_title, rule_expr, severity) VALUES
    (gen_random_uuid(), dossier1_id, credential_ver_id, 'API Endpoint Available', '{"type": "api", "endpoint": "/api/credentials/verify", "expected_status": 200}', 'must'),
    (gen_random_uuid(), dossier1_id, credential_ver_id, 'Response Schema Valid', '{"type": "schema", "endpoint": "/api/credentials/verify", "validate_against": "credential_v1"}', 'must'),
    (gen_random_uuid(), dossier1_id, NULL, 'SLA Compliance', '{"type": "sla", "metric": "credential_processing_time", "threshold": 21, "unit": "days"}', 'must'),
    (gen_random_uuid(), dossier2_id, status_ver_id, 'Status Endpoint Live', '{"type": "api", "endpoint": "/status.json", "expected_status": 200}', 'must'),
    (gen_random_uuid(), dossier2_id, status_ver_id, 'Required Fields Present', '{"type": "jsonpath", "endpoint": "/status.json", "paths": ["$.status", "$.timestamp", "$.services"]}', 'must'),
    (gen_random_uuid(), dossier2_id, NULL, 'Response Time SLA', '{"type": "sla", "metric": "status_response_time", "threshold": 500, "unit": "ms"}', 'should'),
    (gen_random_uuid(), dossier3_id, permit_ver_id, 'Permit API Available', '{"type": "api", "endpoint": "/api/permits", "expected_status": 200}', 'must'),
    (gen_random_uuid(), dossier3_id, permit_ver_id, 'Schema Compliance', '{"type": "schema", "endpoint": "/api/permits", "validate_against": "permit_v1"}', 'must'),
    (gen_random_uuid(), dossier3_id, NULL, 'Approval Timeline', '{"type": "sla", "metric": "approval_to_start_days", "threshold": 60, "unit": "days"}', 'must')
  ON CONFLICT (rule_id) DO NOTHING;

  -- Create some adoption records
  INSERT INTO structural_adoptions (adopt_id, dossier_id, entity_id, state, owner, started_at, moved_at, notes) VALUES
    (gen_random_uuid(), dossier1_id, (SELECT entity_id FROM adopting_entities WHERE name = 'Education Board'), 'full', 'Lead Implementation Manager', now() - interval '5 days', now() - interval '1 day', 'Successfully implemented with 18-day average processing time'),
    (gen_random_uuid(), dossier1_id, (SELECT entity_id FROM adopting_entities WHERE name = 'Labour Department'), 'partial', 'Integration Specialist', now() - interval '3 days', now() - interval '1 day', 'API integration complete, workflow optimization in progress'),
    (gen_random_uuid(), dossier2_id, (SELECT entity_id FROM adopting_entities WHERE name = 'PMO Digital'), 'full', 'Digital Services Director', now() - interval '4 days', now() - interval '2 days', 'Status endpoints deployed across all services'),
    (gen_random_uuid(), dossier3_id, (SELECT entity_id FROM adopting_entities WHERE name = 'Municipality Planning'), 'pilot', 'Planning Director', now() - interval '2 days', now() - interval '1 day', 'Pilot launched in downtown corridor')
  ON CONFLICT (adopt_id) DO NOTHING;

END $$;