-- Create Responsive capacity bundle tables and extend existing ones

-- Extend claims table if needed (some columns may already exist)
DO $$ 
BEGIN
  -- Add missing columns to claims table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'raci') THEN
    ALTER TABLE claims ADD COLUMN raci jsonb DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'evidence') THEN
    ALTER TABLE claims ADD COLUMN evidence jsonb DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'started_at') THEN
    ALTER TABLE claims ADD COLUMN started_at timestamp with time zone;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'paused_at') THEN
    ALTER TABLE claims ADD COLUMN paused_at timestamp with time zone;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'finished_at') THEN
    ALTER TABLE claims ADD COLUMN finished_at timestamp with time zone;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'pause_reason') THEN
    ALTER TABLE claims ADD COLUMN pause_reason text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'last_checkpoint_at') THEN
    ALTER TABLE claims ADD COLUMN last_checkpoint_at timestamp with time zone;
  END IF;
END $$;

-- Create claim_substeps table for execution steps
CREATE TABLE IF NOT EXISTS public.claim_substeps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  owner uuid,
  planned_duration interval DEFAULT '2 hours',
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  status text DEFAULT 'pending', -- pending, active, blocked, done, skipped
  ordering integer NOT NULL DEFAULT 0,
  checklist jsonb DEFAULT '[]',
  attachments jsonb DEFAULT '[]',
  alert_id uuid, -- Reference to alert that created this step
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create claim_dependencies table for step dependencies
CREATE TABLE IF NOT EXISTS public.claim_dependencies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_substep_id uuid NOT NULL,
  child_substep_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(parent_substep_id, child_substep_id)
);

-- Create claim_checkpoints table for execution checkpoints
CREATE TABLE IF NOT EXISTS public.claim_checkpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id uuid NOT NULL,
  summary text NOT NULL,
  tri_values jsonb DEFAULT '{}', -- {t_value, r_value, i_value}
  tag text DEFAULT 'checkpoint', -- start, mid, final, checkpoint
  attachments jsonb DEFAULT '[]',
  created_by uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create execution_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.execution_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id uuid NOT NULL,
  kind text NOT NULL, -- start, pause, resume, finish, substep_start, substep_complete, checkpoint, escalation
  payload jsonb DEFAULT '{}',
  actor uuid NOT NULL,
  user_id uuid NOT NULL,
  at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create guardrails table for anti-windup controls
CREATE TABLE IF NOT EXISTS public.guardrails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  loop_id uuid NOT NULL,
  timebox_minutes integer DEFAULT 480, -- 8 hours default
  max_delta_per_day numeric DEFAULT 0.1, -- 10% max change per day
  max_coverage_pct numeric DEFAULT 25.0, -- 25% max population coverage
  max_concurrent_substeps integer DEFAULT 3,
  override_active boolean DEFAULT false,
  override_reason text,
  override_by uuid,
  override_at timestamp with time zone,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create harmonization_decisions table for conflict resolution
CREATE TABLE IF NOT EXISTS public.harmonization_decisions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor text NOT NULL, -- person/role with conflicts
  decision text NOT NULL, -- merge, sequence, delegate, keep
  rationale text NOT NULL,
  conflicting_claims jsonb NOT NULL, -- array of claim IDs and details
  resolution_actions jsonb DEFAULT '{}',
  created_by uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create substep_templates table for quick start templates
CREATE TABLE IF NOT EXISTS public.substep_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  loop_type text, -- reactive, structural, perceptual
  scale text, -- micro, meso, macro
  template_steps jsonb NOT NULL, -- array of step templates
  description text,
  tags text[] DEFAULT '{}',
  usage_count integer DEFAULT 0,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.claim_substeps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardrails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harmonization_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.substep_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their claim substeps" ON public.claim_substeps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their claim dependencies" ON public.claim_dependencies
  FOR ALL USING (auth.uid() IN (
    SELECT cs.user_id FROM claim_substeps cs 
    WHERE cs.id = parent_substep_id OR cs.id = child_substep_id
  ));

CREATE POLICY "Users can manage their claim checkpoints" ON public.claim_checkpoints
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their execution logs" ON public.execution_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their guardrails" ON public.guardrails
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage harmonization decisions" ON public.harmonization_decisions
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can manage substep templates" ON public.substep_templates
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_claim_substeps_claim_ordering ON public.claim_substeps(claim_id, ordering);
CREATE INDEX IF NOT EXISTS idx_claim_substeps_status ON public.claim_substeps(status, started_at);
CREATE INDEX IF NOT EXISTS idx_claim_checkpoints_claim_created ON public.claim_checkpoints(claim_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_execution_logs_claim_at ON public.execution_logs(claim_id, at DESC);
CREATE INDEX IF NOT EXISTS idx_guardrails_loop ON public.guardrails(loop_id);
CREATE INDEX IF NOT EXISTS idx_substep_templates_type_scale ON public.substep_templates(loop_type, scale);

-- Add triggers for updated_at
CREATE TRIGGER update_claim_substeps_updated_at
  BEFORE UPDATE ON public.claim_substeps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guardrails_updated_at
  BEFORE UPDATE ON public.guardrails
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_substep_templates_updated_at
  BEFORE UPDATE ON public.substep_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default guardrails templates
INSERT INTO public.substep_templates (name, loop_type, scale, template_steps, description, user_id)
VALUES 
  ('Reactive Micro Response', 'reactive', 'micro', '[
    {"title": "Immediate Assessment", "planned_duration": "30 minutes", "checklist": ["Assess scope", "Identify stakeholders", "Confirm urgency"]},
    {"title": "Quick Fix Implementation", "planned_duration": "2 hours", "checklist": ["Apply fix", "Test changes", "Monitor impact"]},
    {"title": "Communication & Documentation", "planned_duration": "1 hour", "checklist": ["Notify stakeholders", "Document changes", "Update procedures"]}
  ]', 'Quick response template for micro-level reactive issues', '00000000-0000-0000-0000-000000000000'),
  
  ('Structural Meso Planning', 'structural', 'meso', '[
    {"title": "Stakeholder Alignment", "planned_duration": "4 hours", "checklist": ["Gather requirements", "Align on objectives", "Define success metrics"]},
    {"title": "Design & Planning", "planned_duration": "1 day", "checklist": ["Create design", "Plan implementation", "Risk assessment"]},
    {"title": "Implementation Phase", "planned_duration": "3 days", "checklist": ["Execute changes", "Monitor progress", "Adjust as needed"]},
    {"title": "Validation & Handoff", "planned_duration": "2 hours", "checklist": ["Validate outcomes", "Document learnings", "Plan next steps"]}
  ]', 'Structured planning template for meso-level changes', '00000000-0000-0000-0000-000000000000')
ON CONFLICT DO NOTHING;