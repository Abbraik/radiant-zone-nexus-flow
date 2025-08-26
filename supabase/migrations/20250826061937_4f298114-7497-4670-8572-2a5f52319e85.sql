-- Production Security: RLS/ABAC Implementation
-- Phase 1: Create service roles and security functions

-- Create custom roles for access control
DO $$
BEGIN
  -- Service role for bypassing RLS (ingestion, background jobs)
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_executor') THEN
    CREATE ROLE service_executor;
  END IF;
  
  -- Manager role for approvals and publishing
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workspace_manager') THEN
    CREATE ROLE workspace_manager;
  END IF;
  
  -- Editor role for workspace editing
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workspace_editor') THEN
    CREATE ROLE workspace_editor;
  END IF;
  
  -- Viewer role for read-only access
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'workspace_viewer') THEN
    CREATE ROLE workspace_viewer;
  END IF;
END $$;

-- Add org_id to user profiles for multi-tenancy support
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS org_id uuid DEFAULT gen_random_uuid();

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_org()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT org_id FROM profiles WHERE id = auth.uid()),
    '00000000-0000-0000-0000-000000000000'::uuid
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
    'user'
  );
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Add audit fields to existing tables (org_id for multi-tenancy)
DO $$
DECLARE
  table_name text;
  tables_to_update text[] := ARRAY[
    'loops', 'loop_nodes', 'loop_edges', 'de_bands', 'srt_windows', 
    'loop_versions', 'shared_nodes', 'loop_shared_nodes', 'cascades',
    'raw_observations', 'normalized_observations', 'loop_signal_scores',
    'dq_status', 'dq_events', 'activation_events', 'activation_overrides',
    'actuation_attempts', 'band_crossings', 'band_crossings_5c', 
    'band_weight_changes', 'breach_events', 'claim_checkpoints',
    'claim_dependencies', 'claim_substeps', 'claims', 'claims_5c',
    'controller_tunings', 'de_bands_5c', 'decision_records',
    'structural_dossiers', 'structural_components', 'structural_artifacts',
    'conformance_runs', 'conformance_findings', 'structural_adoptions',
    'adoption_events', 'app_tasks_queue', 'applied_arcs'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables_to_update
  LOOP
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS org_id uuid DEFAULT get_current_user_org()', table_name);
    END IF;
  END LOOP;
END $$;

-- Create audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL DEFAULT get_current_user_org(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create PII policy table for redaction rules
CREATE TABLE IF NOT EXISTS pii_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  column_name text NOT NULL,
  pii_class text NOT NULL CHECK (pii_class IN ('none', 'low', 'medium', 'high', 'restricted')),
  redaction_strategy text NOT NULL CHECK (redaction_strategy IN ('none', 'mask', 'hash', 'remove')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(table_name, column_name)
);

-- Insert default PII policies
INSERT INTO pii_policies (table_name, column_name, pii_class, redaction_strategy) VALUES
  ('raw_observations', 'meta', 'medium', 'mask'),
  ('profiles', 'email', 'medium', 'hash'),
  ('audit_log', 'ip_address', 'low', 'hash'),
  ('audit_log', 'user_agent', 'low', 'mask')
ON CONFLICT (table_name, column_name) DO NOTHING;