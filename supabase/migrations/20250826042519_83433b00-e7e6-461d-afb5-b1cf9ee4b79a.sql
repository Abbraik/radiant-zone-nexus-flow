-- Task Engine V2: Production-ready task management (incremental migration)
-- Only create tables that don't exist and add new functionality

-- Task templates table - defines scaffolding for each capacity
CREATE TABLE IF NOT EXISTS task_templates (
  template_key text PRIMARY KEY,
  capacity text NOT NULL CHECK (capacity IN ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural')),
  title text NOT NULL,
  default_sla_hours integer NOT NULL DEFAULT 72,
  default_checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  default_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  open_route text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enhanced tasks table with proper status machine and SLAs
CREATE TABLE IF NOT EXISTS tasks_v2 (
  task_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid NOT NULL,
  capacity text NOT NULL CHECK (capacity IN ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural')),
  template_key text REFERENCES task_templates(template_key),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'in_progress', 'review_due', 'completed', 'cancelled')),
  priority integer NOT NULL DEFAULT 3, -- 1=urgent, 2=high, 3=normal, 4=low
  title text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  open_route text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz,
  review_at timestamptz,
  closed_at timestamptz
);

-- Task assignments - who can work on what with what role
CREATE TABLE IF NOT EXISTS task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'collab', 'viewer', 'approver')),
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Task events - immutable audit trail
CREATE TABLE IF NOT EXISTS task_events_v2 (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('created', 'claimed', 'note', 'status_change', 'handoff', 'attachment', 'publish', 'override', 'reminder_sent', 'sla_breach', 'review_scheduled', 'review_done')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  detail jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Task links - handoffs and relationships between tasks
CREATE TABLE IF NOT EXISTS task_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_task_id uuid NOT NULL,
  to_task_id uuid NOT NULL,
  relation text NOT NULL CHECK (relation IN ('handoff', 'blocks', 'duplicates', 'follows', 'review_of')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE(from_task_id, to_task_id, relation)
);

-- SLA policies - configurable deadlines and reminders per template
CREATE TABLE IF NOT EXISTS task_sla_policies (
  policy_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  target_hours integer NOT NULL,
  reminder_schedule jsonb NOT NULL DEFAULT '[{"at":"-24h"},{"at":"-2h"},{"at":"+0h"},{"at":"+24h"}]'::jsonb,
  escalation_after_hours integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(template_key)
);

-- Task reminders - scheduled notifications
CREATE TABLE IF NOT EXISTS task_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('due', 'review', 'stale')),
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Task locks - presence and collaboration locks
CREATE TABLE IF NOT EXISTS task_locks (
  lock_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  user_id uuid NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '3 minutes'),
  lock_kind text NOT NULL CHECK (lock_kind IN ('edit', 'comment')),
  UNIQUE(task_id, user_id, lock_kind)
);

-- Task outputs - published artifacts and deliverables
CREATE TABLE IF NOT EXISTS task_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('note', 'status_banner', 'public_message', 'decision_note', 'dossier_pdf', 'conformance_report')),
  content jsonb NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  published_by uuid NOT NULL
);

-- Performance indexes (only create if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_v2_loop_id_status') THEN
    CREATE INDEX idx_tasks_v2_loop_id_status ON tasks_v2(loop_id, status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_v2_due_at') THEN
    CREATE INDEX idx_tasks_v2_due_at ON tasks_v2(due_at) WHERE due_at IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_v2_review_at') THEN
    CREATE INDEX idx_tasks_v2_review_at ON tasks_v2(review_at) WHERE review_at IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tasks_v2_capacity_status') THEN
    CREATE INDEX idx_tasks_v2_capacity_status ON tasks_v2(capacity, status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_events_v2_task_id_at') THEN
    CREATE INDEX idx_task_events_v2_task_id_at ON task_events_v2(task_id, created_at);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_reminders_scheduled_for') THEN
    CREATE INDEX idx_task_reminders_scheduled_for ON task_reminders(scheduled_for) WHERE sent_at IS NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_locks_task_id') THEN
    CREATE INDEX idx_task_locks_task_id ON task_locks(task_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_task_locks_expires_at') THEN
    CREATE INDEX idx_task_locks_expires_at ON task_locks(expires_at);
  END IF;
END $$;

-- Seed task templates for 5C capacities
INSERT INTO task_templates (template_key, capacity, title, default_sla_hours, default_checklist, open_route) VALUES
  ('containment_pack', 'responsive', 'Containment Response', 72, '[
    {"label": "Set guardrails (time-box, daily delta, coverage)", "required": true, "order": 1},
    {"label": "Draft status banner", "required": true, "order": 2},
    {"label": "Schedule review", "required": true, "order": 3}
  ]', '/workspace-5c/responsive/checkpoint'),
  
  ('learning_review', 'reflexive', 'Learning Review', 48, '[
    {"label": "Take before/after snapshot", "required": true, "order": 1},
    {"label": "Record verdict (keep/adjust/stop)", "required": true, "order": 2},
    {"label": "Document rationale", "required": true, "order": 3},
    {"label": "Set next review date", "required": false, "order": 4}
  ]', '/workspace-5c/reflexive/learning'),
  
  ('portfolio_compare', 'deliberative', 'Portfolio Analysis', 120, '[
    {"label": "Fill option details", "required": true, "order": 1},
    {"label": "Complete fairness lens analysis", "required": true, "order": 2},
    {"label": "Obtain consent/approval", "required": true, "order": 3},
    {"label": "Publish decision note", "required": true, "order": 4}
  ]', '/workspace-5c/deliberative/portfolio'),
  
  ('readiness_plan', 'anticipatory', 'Readiness Planning', 96, '[
    {"label": "Select scenarios", "required": true, "order": 1},
    {"label": "Define pre-position steps", "required": true, "order": 2},
    {"label": "Arm triggers", "required": true, "order": 3},
    {"label": "Set owner and review window", "required": true, "order": 4}
  ]', '/workspace-5c/anticipatory/watchboard'),
  
  ('dossier_draft', 'structural', 'Structural Dossier', 240, '[
    {"label": "Complete mandate check", "required": true, "order": 1},
    {"label": "Draft mesh compact", "required": true, "order": 2},
    {"label": "Define process specification", "required": true, "order": 3},
    {"label": "Set standards/interoperability", "required": true, "order": 4},
    {"label": "Create market rulebook", "required": true, "order": 5},
    {"label": "Publish dossier + schedule 90d review", "required": true, "order": 6}
  ]', '/workspace-5c/structural/dossier')
ON CONFLICT (template_key) DO NOTHING;

-- Seed SLA policies for templates
INSERT INTO task_sla_policies (template_key, target_hours, escalation_after_hours) VALUES
  ('containment_pack', 72, 96),
  ('learning_review', 48, 72),
  ('portfolio_compare', 120, 168),
  ('readiness_plan', 96, 144),
  ('dossier_draft', 240, 336)
ON CONFLICT (template_key) DO NOTHING;