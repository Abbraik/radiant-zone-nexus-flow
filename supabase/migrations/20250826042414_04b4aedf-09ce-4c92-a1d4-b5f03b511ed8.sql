-- Task Engine V2: Production-ready task management with SLAs, presence, and handoffs

-- Task templates table - defines scaffolding for each capacity
CREATE TABLE task_templates (
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
CREATE TABLE tasks_v2 (
  task_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid NOT NULL,
  capacity text NOT NULL CHECK (capacity IN ('responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural')),
  template_key text NOT NULL REFERENCES task_templates(template_key),
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
CREATE TABLE task_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'collab', 'viewer', 'approver')),
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Task checklist items - dynamic checklist from templates
CREATE TABLE task_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  label text NOT NULL,
  required boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_by uuid,
  completed_at timestamptz
);

-- Task events - immutable audit trail
CREATE TABLE task_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('created', 'claimed', 'note', 'status_change', 'handoff', 'attachment', 'publish', 'override', 'reminder_sent', 'sla_breach', 'review_scheduled', 'review_done')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  detail jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Task links - handoffs and relationships between tasks
CREATE TABLE task_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  to_task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  relation text NOT NULL CHECK (relation IN ('handoff', 'blocks', 'duplicates', 'follows', 'review_of')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE(from_task_id, to_task_id, relation)
);

-- SLA policies - configurable deadlines and reminders per template
CREATE TABLE task_sla_policies (
  policy_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL REFERENCES task_templates(template_key),
  target_hours integer NOT NULL,
  reminder_schedule jsonb NOT NULL DEFAULT '[{"at":"-24h"},{"at":"-2h"},{"at":"+0h"},{"at":"+24h"}]'::jsonb,
  escalation_after_hours integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(template_key)
);

-- Task reminders - scheduled notifications
CREATE TABLE task_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('due', 'review', 'stale')),
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Task locks - presence and collaboration locks
CREATE TABLE task_locks (
  lock_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '3 minutes'),
  lock_kind text NOT NULL CHECK (lock_kind IN ('edit', 'comment')),
  UNIQUE(task_id, user_id, lock_kind)
);

-- Task outputs - published artifacts and deliverables
CREATE TABLE task_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks_v2(task_id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('note', 'status_banner', 'public_message', 'decision_note', 'dossier_pdf', 'conformance_report')),
  content jsonb NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  published_by uuid NOT NULL
);

-- Performance indexes
CREATE INDEX idx_tasks_v2_loop_id_status ON tasks_v2(loop_id, status);
CREATE INDEX idx_tasks_v2_due_at ON tasks_v2(due_at) WHERE due_at IS NOT NULL;
CREATE INDEX idx_tasks_v2_review_at ON tasks_v2(review_at) WHERE review_at IS NOT NULL;
CREATE INDEX idx_tasks_v2_capacity_status ON tasks_v2(capacity, status);
CREATE INDEX idx_task_events_task_id_at ON task_events(task_id, created_at);
CREATE INDEX idx_task_reminders_scheduled_for ON task_reminders(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX idx_task_locks_task_id ON task_locks(task_id);
CREATE INDEX idx_task_locks_expires_at ON task_locks(expires_at);

-- RLS Policies
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_outputs ENABLE ROW LEVEL SECURITY;

-- Templates are readable by all authenticated users
CREATE POLICY "Templates are readable by authenticated users"
  ON task_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Tasks readable by authenticated users
CREATE POLICY "Tasks readable by authenticated users"
  ON tasks_v2 FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Tasks writable by creator and assignees
CREATE POLICY "Tasks writable by creator and assignees"
  ON tasks_v2 FOR UPDATE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_assignments ta 
      WHERE ta.task_id = tasks_v2.task_id 
        AND ta.user_id = auth.uid() 
        AND ta.role IN ('owner', 'collab')
    )
  );

-- Task creation allowed for authenticated users
CREATE POLICY "Task creation allowed for authenticated users"
  ON tasks_v2 FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Task assignments readable/writable by task participants
CREATE POLICY "Task assignments readable by participants"
  ON task_assignments FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_assignments ta2
      WHERE ta2.task_id = task_assignments.task_id
        AND ta2.user_id = auth.uid()
    )
  );

CREATE POLICY "Task assignments writable by task owners"
  ON task_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = task_assignments.task_id
        AND ta.user_id = auth.uid()
        AND ta.role = 'owner'
    )
  );

-- Checklist items manageable by task participants
CREATE POLICY "Checklist items readable by task participants"
  ON task_checklist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = task_checklist_items.task_id
        AND ta.user_id = auth.uid()
    )
  );

CREATE POLICY "Checklist items writable by collaborators"
  ON task_checklist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = task_checklist_items.task_id
        AND ta.user_id = auth.uid()
        AND ta.role IN ('owner', 'collab')
    )
  );

-- Task events are insert-only audit trail
CREATE POLICY "Task events readable by task participants"
  ON task_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = task_events.task_id
        AND ta.user_id = auth.uid()
    )
  );

CREATE POLICY "Task events insertable by authenticated users"
  ON task_events FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Task locks manageable by task participants
CREATE POLICY "Task locks readable by task participants"
  ON task_locks FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = task_locks.task_id
        AND ta.user_id = auth.uid()
    )
  );

CREATE POLICY "Task locks manageable by lock owner"
  ON task_locks FOR ALL
  USING (user_id = auth.uid());

-- Other policies for remaining tables follow similar patterns
CREATE POLICY "Task links readable by task participants"
  ON task_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE (ta.task_id = task_links.from_task_id OR ta.task_id = task_links.to_task_id)
        AND ta.user_id = auth.uid()
    )
  );

CREATE POLICY "SLA policies readable by authenticated users"
  ON task_sla_policies FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Task reminders readable by system"
  ON task_reminders FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Task outputs readable by task participants"
  ON task_outputs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM task_assignments ta
      WHERE ta.task_id = task_outputs.task_id
        AND ta.user_id = auth.uid()
    )
  );

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_templates_updated_at
  BEFORE UPDATE ON task_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_v2_updated_at
  BEFORE UPDATE ON tasks_v2
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();