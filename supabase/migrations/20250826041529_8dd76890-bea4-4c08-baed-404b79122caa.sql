-- Capacity Brain: Activation Events, Overrides, and Task Fingerprints
-- Tables for deterministic capacity decisions with audit trail

-- Activation events table - stores every decision made
CREATE TABLE activation_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_id uuid NOT NULL,
  time_window text NOT NULL, -- '7d', '14d', '28d', '90d'
  as_of timestamptz NOT NULL,
  decision jsonb NOT NULL, -- full ActivationDecision object
  fingerprint text UNIQUE NOT NULL,  
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Activation overrides table - stores manual overrides with audit trail
CREATE TABLE activation_overrides (
  override_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES activation_events(event_id),
  actor uuid NOT NULL,
  before jsonb NOT NULL, -- original decision
  after jsonb NOT NULL, -- overridden decision
  reason text NOT NULL,
  approved_by uuid, -- optional approver
  created_at timestamptz DEFAULT now()
);

-- Task fingerprints table - ensures one task per condition/window
CREATE TABLE task_fingerprints (
  fp text PRIMARY KEY,
  task_id uuid NOT NULL,
  loop_id uuid NOT NULL,
  capacity text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_activation_events_loop_window ON activation_events(loop_id, time_window);
CREATE INDEX idx_activation_events_as_of ON activation_events(as_of);
CREATE INDEX idx_activation_events_fingerprint ON activation_events(fingerprint);
CREATE INDEX idx_activation_overrides_event ON activation_overrides(event_id);
CREATE INDEX idx_task_fingerprints_loop ON task_fingerprints(loop_id);

-- RLS Policies
ALTER TABLE activation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_fingerprints ENABLE ROW LEVEL SECURITY;

-- Users can read their own activation events
CREATE POLICY "Users can read their own activation events"
  ON activation_events FOR SELECT
  USING (created_by = auth.uid());

-- Users can create activation events
CREATE POLICY "Users can create activation events"
  ON activation_events FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Users can read their own overrides
CREATE POLICY "Users can read their own overrides"
  ON activation_overrides FOR SELECT
  USING (actor = auth.uid() OR approved_by = auth.uid());

-- Users can create overrides
CREATE POLICY "Users can create overrides"
  ON activation_overrides FOR INSERT
  WITH CHECK (actor = auth.uid());

-- Users can read task fingerprints they created
CREATE POLICY "Users can read task fingerprints"
  ON task_fingerprints FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM loops_5c l WHERE l.id = loop_id AND l.user_id = auth.uid()
  ));

-- Users can create task fingerprints for their loops
CREATE POLICY "Users can create task fingerprints"
  ON task_fingerprints FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM loops_5c l WHERE l.id = loop_id AND l.user_id = auth.uid()
  ));