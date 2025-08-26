-- Fix RLS policies for Task Engine V2 tables

-- Enable RLS on all new tables
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_events_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_outputs ENABLE ROW LEVEL SECURITY;

-- Templates are readable by all authenticated users
CREATE POLICY "Templates readable by authenticated users"
  ON task_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Tasks readable by authenticated users (basic read access)
CREATE POLICY "Tasks readable by authenticated users"
  ON tasks_v2 FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Tasks writable by creator
CREATE POLICY "Tasks writable by creator"
  ON tasks_v2 FOR UPDATE
  USING (created_by = auth.uid());

-- Task creation allowed for authenticated users
CREATE POLICY "Tasks insertable by authenticated users"
  ON tasks_v2 FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Task assignments readable by authenticated users
CREATE POLICY "Task assignments readable by authenticated users"
  ON task_assignments FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Task assignments writable by task owner or assignee
CREATE POLICY "Task assignments writable by participants"
  ON task_assignments FOR ALL
  USING (user_id = auth.uid());

-- Task events readable by authenticated users (audit trail)
CREATE POLICY "Task events readable by authenticated users"
  ON task_events_v2 FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Task events insertable by authenticated users (audit trail)
CREATE POLICY "Task events insertable by authenticated users"
  ON task_events_v2 FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Task links readable by authenticated users
CREATE POLICY "Task links readable by authenticated users"
  ON task_links FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Task links writable by authenticated users
CREATE POLICY "Task links writable by authenticated users"
  ON task_links FOR ALL
  USING (created_by = auth.uid());

-- SLA policies readable by authenticated users
CREATE POLICY "SLA policies readable by authenticated users"
  ON task_sla_policies FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Task reminders readable by authenticated users
CREATE POLICY "Task reminders readable by authenticated users"
  ON task_reminders FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Task reminders writable by system (for scheduler)
CREATE POLICY "Task reminders writable by system"
  ON task_reminders FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Task locks manageable by lock owner
CREATE POLICY "Task locks readable by authenticated users"
  ON task_locks FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Task locks writable by authenticated users"
  ON task_locks FOR ALL
  USING (user_id = auth.uid());

-- Task outputs readable by authenticated users
CREATE POLICY "Task outputs readable by authenticated users"
  ON task_outputs FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Task outputs writable by publisher
CREATE POLICY "Task outputs writable by publisher"
  ON task_outputs FOR ALL
  USING (published_by = auth.uid());