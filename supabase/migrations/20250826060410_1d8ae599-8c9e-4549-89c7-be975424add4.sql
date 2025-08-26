-- Structural Dossier System Schema
-- Core dossier model

CREATE TABLE structural_dossiers (
  dossier_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'published', 'deprecated')),
  version text NOT NULL,
  summary text,
  horizon_tag text,
  coherence_note text,
  override_council jsonb,
  consent_note text,
  published_at timestamptz,
  published_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public_slug text UNIQUE
);

CREATE TABLE structural_components (
  component_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('mandate', 'mesh', 'process', 'standard', 'market', 'transparency')),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  order_no integer NOT NULL DEFAULT 0
);

CREATE TABLE structural_artifacts (
  artifact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  component_id uuid REFERENCES structural_components(component_id),
  kind text NOT NULL CHECK (kind IN ('attachment', 'diagram', 'schema', 'api_spec', 'pdf')),
  storage_path text NOT NULL,
  hash text,
  created_at timestamptz DEFAULT now()
);

-- Standards & Conformance
CREATE TABLE standards (
  standard_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE standard_versions (
  std_ver_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id uuid NOT NULL REFERENCES standards(standard_id) ON DELETE CASCADE,
  version text NOT NULL,
  spec jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(standard_id, version)
);

CREATE TABLE conformance_targets (
  target_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  std_ver_id uuid NOT NULL REFERENCES standard_versions(std_ver_id) ON DELETE CASCADE,
  target_kind text NOT NULL CHECK (target_kind IN ('api', 'schema', 'process', 'kpi')),
  endpoint text,
  kpi_key text,
  expected jsonb
);

CREATE TABLE conformance_rules (
  rule_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  std_ver_id uuid REFERENCES standard_versions(std_ver_id),
  rule_title text NOT NULL,
  rule_expr jsonb NOT NULL,
  severity text NOT NULL CHECK (severity IN ('must', 'should')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE conformance_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  finished_at timestamptz,
  status text CHECK (status IN ('ok', 'warn', 'fail')),
  summary jsonb
);

CREATE TABLE conformance_findings (
  finding_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES conformance_runs(run_id) ON DELETE CASCADE,
  rule_id uuid NOT NULL REFERENCES conformance_rules(rule_id) ON DELETE CASCADE,
  passed boolean NOT NULL,
  detail jsonb
);

-- Adoption & Rollout
CREATE TABLE adopting_entities (
  entity_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('ministry', 'agency', 'region', 'provider')),
  parent_id uuid REFERENCES adopting_entities(entity_id)
);

CREATE TABLE structural_adoptions (
  adopt_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES adopting_entities(entity_id) ON DELETE CASCADE,
  state text NOT NULL CHECK (state IN ('not_started', 'pilot', 'partial', 'full', 'exception')),
  owner text,
  started_at timestamptz,
  moved_at timestamptz DEFAULT now(),
  notes text,
  UNIQUE(dossier_id, entity_id)
);

CREATE TABLE adoption_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adopt_id uuid NOT NULL REFERENCES structural_adoptions(adopt_id) ON DELETE CASCADE,
  at timestamptz DEFAULT now(),
  type text NOT NULL CHECK (type IN ('state_change', 'exception', 'kpi_attained', 'rollback')),
  detail jsonb
);

-- Links & Audit
CREATE TABLE dossier_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  task_id uuid,
  relation text NOT NULL CHECK (relation IN ('pilot', 'post_adoption_review', 'related'))
);

CREATE TABLE dossier_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id uuid NOT NULL REFERENCES structural_dossiers(dossier_id) ON DELETE CASCADE,
  version text NOT NULL,
  change_log text,
  snapshot jsonb,
  created_at timestamptz DEFAULT now(),
  created_by text
);

-- Indexes
CREATE INDEX idx_structural_dossiers_status ON structural_dossiers(status);
CREATE INDEX idx_structural_dossiers_loop_id ON structural_dossiers(loop_id);
CREATE INDEX idx_structural_components_dossier_id ON structural_components(dossier_id);
CREATE INDEX idx_structural_artifacts_dossier_id ON structural_artifacts(dossier_id);
CREATE INDEX idx_conformance_rules_dossier_id ON conformance_rules(dossier_id);
CREATE INDEX idx_conformance_runs_dossier_id ON conformance_runs(dossier_id);
CREATE INDEX idx_structural_adoptions_dossier_id ON structural_adoptions(dossier_id);
CREATE INDEX idx_structural_adoptions_entity_id ON structural_adoptions(entity_id);

-- Update triggers
CREATE OR REPLACE FUNCTION update_structural_dossiers_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_structural_dossiers_updated_at_trigger
  BEFORE UPDATE ON structural_dossiers
  FOR EACH ROW EXECUTE FUNCTION update_structural_dossiers_updated_at();

-- Enable RLS
ALTER TABLE structural_dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE structural_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE structural_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conformance_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE conformance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE conformance_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conformance_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE adopting_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE structural_adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossier_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossier_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Read for authenticated, write for service/authorized users)
CREATE POLICY "Users can read structural dossiers" ON structural_dossiers 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage structural dossiers" ON structural_dossiers 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read structural components" ON structural_components 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage structural components" ON structural_components 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read structural artifacts" ON structural_artifacts 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage structural artifacts" ON structural_artifacts 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read standards" ON standards 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage standards" ON standards 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read standard versions" ON standard_versions 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage standard versions" ON standard_versions 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read conformance targets" ON conformance_targets 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage conformance targets" ON conformance_targets 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read conformance rules" ON conformance_rules 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage conformance rules" ON conformance_rules 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read conformance runs" ON conformance_runs 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage conformance runs" ON conformance_runs 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read conformance findings" ON conformance_findings 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage conformance findings" ON conformance_findings 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read adopting entities" ON adopting_entities 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage adopting entities" ON adopting_entities 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read structural adoptions" ON structural_adoptions 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage structural adoptions" ON structural_adoptions 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read adoption events" ON adoption_events 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage adoption events" ON adoption_events 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read dossier links" ON dossier_links 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage dossier links" ON dossier_links 
  FOR ALL USING (current_setting('role', true) = 'service_role');

CREATE POLICY "Users can read dossier versions" ON dossier_versions 
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage dossier versions" ON dossier_versions 
  FOR ALL USING (current_setting('role', true) = 'service_role');

-- Public view for redacted dossiers
CREATE VIEW v_public_dossier AS
SELECT 
  d.dossier_id,
  d.public_slug,
  d.title,
  d.summary,
  d.version,
  d.published_at,
  d.horizon_tag,
  d.coherence_note,
  -- Redacted components (no sensitive internal details)
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'kind', c.kind,
        'title', c.title,
        'content', CASE 
          WHEN c.kind = 'transparency' THEN c.content
          WHEN c.kind = 'market' THEN c.content - 'internal_notes'
          ELSE jsonb_build_object('summary', c.content->>'summary')
        END
      ) ORDER BY c.order_no
    )
    FROM structural_components c 
    WHERE c.dossier_id = d.dossier_id
  ) as components,
  -- Public artifacts only
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'kind', a.kind,
        'storage_path', CASE 
          WHEN a.kind IN ('pdf', 'diagram') THEN a.storage_path
          ELSE null
        END
      )
    )
    FROM structural_artifacts a 
    WHERE a.dossier_id = d.dossier_id 
    AND a.kind IN ('pdf', 'diagram')
  ) as public_artifacts
FROM structural_dossiers d
WHERE d.status = 'published' 
AND d.public_slug IS NOT NULL;