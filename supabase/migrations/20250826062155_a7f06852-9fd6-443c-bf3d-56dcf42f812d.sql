-- Phase 2: Enable RLS and Create Comprehensive Policies
-- Fix security linter issues and implement RLS across all tables

-- Enable RLS on new tables
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pii_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can view their org audit logs" ON audit_log
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Service can insert audit logs" ON audit_log
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Admins can manage PII policies" ON pii_policies
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Enable RLS on critical existing tables that are missing it
DO $$
DECLARE
  table_name text;
  tables_to_secure text[] := ARRAY[
    'loops', 'loop_nodes', 'loop_edges', 'de_bands', 'srt_windows',
    'loop_versions', 'shared_nodes', 'loop_shared_nodes', 'cascades',
    'raw_observations', 'normalized_observations', 'loop_signal_scores',
    'dq_status', 'dq_events', 'activation_events', 'activation_overrides',
    'actuation_attempts', 'band_crossings', 'band_crossings_5c',
    'band_weight_changes', 'breach_events', 'claim_checkpoints',
    'claim_dependencies', 'claim_substeps', 'claims', 'claims_5c',
    'controller_tunings', 'de_bands_5c', 'decision_records'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables_to_secure
  LOOP
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    END IF;
  END LOOP;
END $$;

-- Create comprehensive RLS policies for core tables
-- Loops table policies
CREATE POLICY "Users can read loops in their org" ON loops
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can create loops in their org" ON loops
  FOR INSERT TO authenticated
  WITH CHECK (org_id = get_current_user_org());

CREATE POLICY "Users can update their own loops" ON loops
  FOR UPDATE TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid());

-- Loop nodes policies
CREATE POLICY "Users can read loop nodes in their org" ON loop_nodes
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can manage loop nodes they own" ON loop_nodes
  FOR ALL TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid())
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());

-- Loop edges policies
CREATE POLICY "Users can read loop edges in their org" ON loop_edges
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can manage loop edges they own" ON loop_edges
  FOR ALL TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid())
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());

-- DE bands policies
CREATE POLICY "Users can read de_bands in their org" ON de_bands
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can manage their own de_bands" ON de_bands
  FOR ALL TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid())
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());

-- DE bands 5C policies
CREATE POLICY "Users can read de_bands_5c in their org" ON de_bands_5c
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can manage their own de_bands_5c" ON de_bands_5c
  FOR ALL TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid())
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());

-- Raw observations policies
CREATE POLICY "Users can read raw_observations in their org" ON raw_observations
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Service can insert raw_observations" ON raw_observations
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can insert their own raw_observations" ON raw_observations
  FOR INSERT TO authenticated
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());

-- Activation events (audit table - insert only)
CREATE POLICY "Users can read activation_events in their org" ON activation_events
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Service can insert activation_events" ON activation_events
  FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can insert their own activation_events" ON activation_events
  FOR INSERT TO authenticated
  WITH CHECK (org_id = get_current_user_org() AND created_by = auth.uid());

-- Disable updates on audit tables
ALTER TABLE activation_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE activation_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No updates allowed on activation_events" ON activation_events
  FOR UPDATE TO NONE;

CREATE POLICY "No deletes allowed on activation_events" ON activation_events
  FOR DELETE TO NONE;

-- Claims policies
CREATE POLICY "Users can read claims in their org" ON claims
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can manage their own claims" ON claims
  FOR ALL TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid())
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());

-- Claims 5C policies
CREATE POLICY "Users can read claims_5c in their org" ON claims_5c
  FOR SELECT TO authenticated
  USING (org_id = get_current_user_org());

CREATE POLICY "Users can manage their own claims_5c" ON claims_5c
  FOR ALL TO authenticated
  USING (org_id = get_current_user_org() AND user_id = auth.uid())
  WITH CHECK (org_id = get_current_user_org() AND user_id = auth.uid());