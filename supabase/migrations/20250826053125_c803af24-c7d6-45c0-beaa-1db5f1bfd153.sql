-- Production Guardrails & Harmonization Schema (Fixed)
-- Create tables for guardrails and harmonization system

-- Guardrail policies table
CREATE TABLE IF NOT EXISTS public.guardrail_policies (
  policy_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  loop_id uuid NULL,
  capacity text NOT NULL,
  name text NOT NULL,
  timebox_hours integer NOT NULL DEFAULT 720,
  daily_delta_limit numeric NULL,
  coverage_limit_pct numeric NULL,
  concurrent_substeps_limit integer NULL DEFAULT 3,
  renewal_limit integer NOT NULL DEFAULT 2,
  evaluation_required_after_renewals integer NOT NULL DEFAULT 2,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Task guardrails (policy snapshots per task)
CREATE TABLE IF NOT EXISTS public.task_guardrails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  policy_id uuid REFERENCES public.guardrail_policies(policy_id),
  effective_from timestamp with time zone NOT NULL DEFAULT now(),
  effective_until timestamp with time zone NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Actuation attempts (every system-moving action)
CREATE TABLE IF NOT EXISTS public.actuation_attempts (
  attempt_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  ts timestamp with time zone NOT NULL DEFAULT now(),
  actor text NOT NULL,
  change_kind text NOT NULL CHECK (change_kind IN ('start', 'update', 'publish', 'renew', 'close')),
  delta_estimate numeric NULL,
  coverage_estimate_pct numeric NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  allowed boolean NOT NULL,
  reason text NOT NULL,
  evaluated_by text NOT NULL,
  evaluated_ms integer NOT NULL DEFAULT 0
);

-- Guardrail enforcement events
CREATE TABLE IF NOT EXISTS public.guardrail_enforcements (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  ts timestamp with time zone NOT NULL DEFAULT now(),
  rule text NOT NULL,
  result text NOT NULL CHECK (result IN ('allow', 'throttle', 'block')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor text NOT NULL
);

-- Task renewals tracking
CREATE TABLE IF NOT EXISTS public.task_renewals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  renewal_no integer NOT NULL,
  renewed_at timestamp with time zone NOT NULL DEFAULT now(),
  requires_evaluation boolean NOT NULL DEFAULT false
);

-- Hub allocations for shared resources (renamed window to time_window)
CREATE TABLE IF NOT EXISTS public.hub_allocations (
  alloc_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snl_id uuid NOT NULL,
  time_window tstzrange NOT NULL,
  alloc_pct numeric NOT NULL CHECK (alloc_pct >= 0 AND alloc_pct <= 1),
  task_id uuid NOT NULL,
  region text NULL,
  notes text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Harmonization conflicts
CREATE TABLE IF NOT EXISTS public.harmonization_conflicts (
  conflict_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snl_id uuid NOT NULL,
  detected_at timestamp with time zone NOT NULL DEFAULT now(),
  risk_score numeric NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),
  reason text NOT NULL,
  tasks uuid[] NOT NULL,
  recommendation text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  resolved_by text NULL,
  resolved_at timestamp with time zone NULL
);

-- Override events for manager overrides
CREATE TABLE IF NOT EXISTS public.override_events (
  override_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  ts timestamp with time zone NOT NULL DEFAULT now(),
  actor text NOT NULL,
  scope text NOT NULL CHECK (scope IN ('guardrail', 'harmonization')),
  before jsonb NOT NULL DEFAULT '{}'::jsonb,
  after jsonb NOT NULL DEFAULT '{}'::jsonb,
  rationale text NOT NULL,
  approved_by text NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guardrail_policies_template ON guardrail_policies(template_key);
CREATE INDEX IF NOT EXISTS idx_guardrail_policies_loop ON guardrail_policies(loop_id);
CREATE INDEX IF NOT EXISTS idx_task_guardrails_task ON task_guardrails(task_id);
CREATE INDEX IF NOT EXISTS idx_actuation_attempts_task ON actuation_attempts(task_id);
CREATE INDEX IF NOT EXISTS idx_actuation_attempts_ts ON actuation_attempts(ts);
CREATE INDEX IF NOT EXISTS idx_guardrail_enforcements_task ON guardrail_enforcements(task_id);
CREATE INDEX IF NOT EXISTS idx_task_renewals_task ON task_renewals(task_id);
CREATE INDEX IF NOT EXISTS idx_hub_allocations_snl ON hub_allocations(snl_id);
CREATE INDEX IF NOT EXISTS idx_hub_allocations_time_window ON hub_allocations USING gist(time_window);
CREATE INDEX IF NOT EXISTS idx_harmonization_conflicts_snl ON harmonization_conflicts(snl_id);
CREATE INDEX IF NOT EXISTS idx_override_events_task ON override_events(task_id);

-- Create views (updated to use time_window)
CREATE OR REPLACE VIEW public.v_hub_load AS
SELECT 
  ha.snl_id,
  ha.time_window,
  ha.region,
  SUM(ha.alloc_pct) as total_allocation_pct,
  COALESCE(lss.hub_load, 0) as current_hub_load,
  (SUM(ha.alloc_pct) + COALESCE(lss.hub_load, 0)) as projected_load,
  array_agg(DISTINCT ha.task_id) as allocated_tasks
FROM hub_allocations ha
LEFT JOIN loop_signal_scores lss ON lss.loop_id = ha.snl_id
WHERE ha.time_window @> now()::timestamp with time zone
GROUP BY ha.snl_id, ha.time_window, ha.region, lss.hub_load;

CREATE OR REPLACE VIEW public.v_timebox_breaches AS
SELECT 
  tg.task_id,
  tg.config,
  gp.timebox_hours,
  gp.renewal_limit,
  gp.evaluation_required_after_renewals,
  COALESCE(tr.renewal_count, 0) as current_renewals,
  tg.effective_from,
  (tg.effective_from + (gp.timebox_hours * interval '1 hour')) as expires_at,
  CASE 
    WHEN now() > (tg.effective_from + (gp.timebox_hours * interval '1 hour')) THEN true
    ELSE false
  END as is_expired,
  CASE 
    WHEN COALESCE(tr.renewal_count, 0) > gp.renewal_limit AND 
         NOT EXISTS (SELECT 1 FROM task_renewals tr2 WHERE tr2.task_id = tg.task_id AND tr2.requires_evaluation = false)
    THEN true
    ELSE false
  END as needs_evaluation
FROM task_guardrails tg
JOIN guardrail_policies gp ON tg.policy_id = gp.policy_id
LEFT JOIN (
  SELECT task_id, COUNT(*) as renewal_count
  FROM task_renewals 
  GROUP BY task_id
) tr ON tr.task_id = tg.task_id
WHERE tg.effective_until IS NULL OR tg.effective_until > now();

-- Enable RLS on all tables
ALTER TABLE public.guardrail_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_guardrails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actuation_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardrail_enforcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harmonization_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.override_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Read for authenticated users
CREATE POLICY "Users can read guardrail policies" ON guardrail_policies FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read task guardrails" ON task_guardrails FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read actuation attempts" ON actuation_attempts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read guardrail enforcements" ON guardrail_enforcements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read task renewals" ON task_renewals FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read hub allocations" ON hub_allocations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read harmonization conflicts" ON harmonization_conflicts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can read override events" ON override_events FOR SELECT USING (auth.uid() IS NOT NULL);

-- Write policies (more restrictive - task owners and service role)
CREATE POLICY "Service can manage guardrail policies" ON guardrail_policies FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Service can manage task guardrails" ON task_guardrails FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Users can create actuation attempts" ON actuation_attempts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage actuation attempts" ON actuation_attempts FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Service can manage guardrail enforcements" ON guardrail_enforcements FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Users can create task renewals" ON task_renewals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage task renewals" ON task_renewals FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Users can create hub allocations" ON hub_allocations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage hub allocations" ON hub_allocations FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Service can manage harmonization conflicts" ON harmonization_conflicts FOR ALL USING (current_setting('role', true) = 'service_role');
CREATE POLICY "Users can create override events" ON override_events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Service can manage override events" ON override_events FOR ALL USING (current_setting('role', true) = 'service_role');

-- Seed default guardrail policies
INSERT INTO guardrail_policies (template_key, capacity, name, timebox_hours, daily_delta_limit, coverage_limit_pct, concurrent_substeps_limit, renewal_limit, evaluation_required_after_renewals)
VALUES 
  ('containment_pack', 'responsive', 'Containment Pack Policy', 720, 0.02, 0.2, 3, 2, 2),
  ('readiness_plan', 'anticipatory', 'Readiness Plan Policy', 336, NULL, 0.1, 2, 2, 2),
  ('dossier_draft', 'structural', 'Dossier Draft Policy', 2160, NULL, NULL, 5, 3, 2),
  ('portfolio_compare', 'deliberative', 'Portfolio Compare Policy', 168, NULL, NULL, NULL, 1, 1),
  ('learning_review', 'reflexive', 'Learning Review Policy', 336, NULL, NULL, NULL, 1, 1)
ON CONFLICT DO NOTHING;