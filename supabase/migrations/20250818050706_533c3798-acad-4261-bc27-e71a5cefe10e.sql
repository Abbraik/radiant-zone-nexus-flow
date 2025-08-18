-- Phase 1: Core Infrastructure & Database Setup
-- Extend tasks table with zone-specific fields
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS zone TEXT CHECK (zone IN ('THINK', 'ACT', 'MONITOR', 'INNOVATE'));
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_type TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS locked_by UUID;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE;

-- Create task_payloads table for complex zone-specific data
CREATE TABLE IF NOT EXISTS task_payloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_locks table for optimistic locking
CREATE TABLE IF NOT EXISTS task_locks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL UNIQUE,
  locked_by UUID NOT NULL,
  locked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 minutes')
);

-- Create task_checklist_items table
CREATE TABLE IF NOT EXISTS task_checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  label TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT false,
  done BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_artifacts table
CREATE TABLE IF NOT EXISTS task_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  kind TEXT NOT NULL,
  ref_id UUID,
  title TEXT NOT NULL,
  url TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_events table for audit trail
CREATE TABLE IF NOT EXISTS task_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  actor UUID NOT NULL,
  details JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on new tables
ALTER TABLE task_payloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for task_payloads
CREATE POLICY "Users can manage payloads for their tasks" ON task_payloads
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM tasks WHERE tasks.id = task_payloads.task_id
    UNION
    SELECT assigned_to FROM tasks WHERE tasks.id = task_payloads.task_id
  )
);

-- RLS policies for task_locks
CREATE POLICY "Users can manage locks for their tasks" ON task_locks
FOR ALL USING (
  auth.uid() = locked_by OR
  auth.uid() IN (
    SELECT user_id FROM tasks WHERE tasks.id = task_locks.task_id
    UNION
    SELECT assigned_to FROM tasks WHERE tasks.id = task_locks.task_id
  )
);

-- RLS policies for task_checklist_items
CREATE POLICY "Users can manage checklist items for their tasks" ON task_checklist_items
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM tasks WHERE tasks.id = task_checklist_items.task_id
    UNION
    SELECT assigned_to FROM tasks WHERE tasks.id = task_checklist_items.task_id
  )
);

-- RLS policies for task_artifacts
CREATE POLICY "Users can manage artifacts for their tasks" ON task_artifacts
FOR ALL USING (
  auth.uid() IN (
    SELECT user_id FROM tasks WHERE tasks.id = task_artifacts.task_id
    UNION
    SELECT assigned_to FROM tasks WHERE tasks.id = task_artifacts.task_id
  )
);

-- RLS policies for task_events
CREATE POLICY "Users can view events for their tasks" ON task_events
FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM tasks WHERE tasks.id = task_events.task_id
    UNION
    SELECT assigned_to FROM tasks WHERE tasks.id = task_events.task_id
  )
);

CREATE POLICY "Users can create events for their tasks" ON task_events
FOR INSERT WITH CHECK (
  auth.uid() = actor AND
  auth.uid() IN (
    SELECT user_id FROM tasks WHERE tasks.id = task_events.task_id
    UNION
    SELECT assigned_to FROM tasks WHERE tasks.id = task_events.task_id
  )
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_payloads_updated_at
  BEFORE UPDATE ON task_payloads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_checklist_items_updated_at
  BEFORE UPDATE ON task_checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_artifacts_updated_at
  BEFORE UPDATE ON task_artifacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update demo tasks with zone information
UPDATE tasks SET 
  zone = CASE 
    WHEN title ILIKE '%loop%' OR title ILIKE '%cld%' OR title ILIKE '%causal%' THEN 'THINK'
    WHEN title ILIKE '%sprint%' OR title ILIKE '%implement%' OR title ILIKE '%deploy%' THEN 'ACT'
    WHEN title ILIKE '%monitor%' OR title ILIKE '%breach%' OR title ILIKE '%alert%' THEN 'MONITOR'
    WHEN title ILIKE '%experiment%' OR title ILIKE '%innovation%' OR title ILIKE '%research%' THEN 'INNOVATE'
    ELSE 'THINK'
  END,
  task_type = CASE
    WHEN title ILIKE '%loop%' THEN 'loop_design'
    WHEN title ILIKE '%sprint%' THEN 'sprint_planning'
    WHEN title ILIKE '%breach%' THEN 'breach_response'
    WHEN title ILIKE '%experiment%' THEN 'experiment_design'
    ELSE 'general'
  END
WHERE zone IS NULL;