-- Add column descriptions for Part 3: Anticipatory and monitoring tables

-- ANTIC_TRIGGER_RULES table columns
COMMENT ON COLUMN antic_trigger_rules.id IS 'Primary key: Unique identifier for the trigger rule';
COMMENT ON COLUMN antic_trigger_rules.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN antic_trigger_rules.name IS 'Human-readable name for the trigger rule';
COMMENT ON COLUMN antic_trigger_rules.expr_raw IS 'Raw expression string defining the trigger condition';
COMMENT ON COLUMN antic_trigger_rules.expr_ast IS 'Abstract Syntax Tree representation of the trigger expression';
COMMENT ON COLUMN antic_trigger_rules.window_hours IS 'Time window in hours for evaluating the trigger condition';
COMMENT ON COLUMN antic_trigger_rules.authority IS 'Authority level or entity responsible for this trigger';
COMMENT ON COLUMN antic_trigger_rules.action_ref IS 'Reference to the action to be taken when trigger fires';
COMMENT ON COLUMN antic_trigger_rules.consent_note IS 'Note regarding consent requirements for this trigger';
COMMENT ON COLUMN antic_trigger_rules.valid_from IS 'Timestamp when this trigger rule becomes valid';
COMMENT ON COLUMN antic_trigger_rules.expires_at IS 'Timestamp when this trigger rule expires';
COMMENT ON COLUMN antic_trigger_rules.created_at IS 'Timestamp when the trigger rule was created';
COMMENT ON COLUMN antic_trigger_rules.updated_at IS 'Timestamp when the trigger rule was last modified';
COMMENT ON COLUMN antic_trigger_rules.created_by IS 'User who created this trigger rule';

-- ANTIC_WATCHPOINTS table columns
COMMENT ON COLUMN antic_watchpoints.id IS 'Primary key: Unique identifier for the watchpoint';
COMMENT ON COLUMN antic_watchpoints.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN antic_watchpoints.risk_channel IS 'Risk channel being monitored by this watchpoint';
COMMENT ON COLUMN antic_watchpoints.loop_codes IS 'Array of loop codes associated with this watchpoint';
COMMENT ON COLUMN antic_watchpoints.ews_prob IS 'Early Warning System probability score (0.0-1.0)';
COMMENT ON COLUMN antic_watchpoints.confidence IS 'Confidence level in the watchpoint assessment (0.0-1.0)';
COMMENT ON COLUMN antic_watchpoints.buffer_adequacy IS 'Assessment of buffer adequacy (0.0-1.0)';
COMMENT ON COLUMN antic_watchpoints.lead_time_days IS 'Lead time in days for response actions';
COMMENT ON COLUMN antic_watchpoints.status IS 'Current status of the watchpoint (armed/disarmed/triggered)';
COMMENT ON COLUMN antic_watchpoints.notes IS 'Additional notes and observations';
COMMENT ON COLUMN antic_watchpoints.review_at IS 'Timestamp for next scheduled review';
COMMENT ON COLUMN antic_watchpoints.created_at IS 'Timestamp when the watchpoint was created';
COMMENT ON COLUMN antic_watchpoints.updated_at IS 'Timestamp when the watchpoint was last modified';
COMMENT ON COLUMN antic_watchpoints.created_by IS 'User who created this watchpoint';

-- ACTUATION_ATTEMPTS table columns
COMMENT ON COLUMN actuation_attempts.attempt_id IS 'Primary key: Unique identifier for the actuation attempt';
COMMENT ON COLUMN actuation_attempts.task_id IS 'Reference to the task being actuated';
COMMENT ON COLUMN actuation_attempts.actor IS 'Actor or entity performing the actuation';
COMMENT ON COLUMN actuation_attempts.change_kind IS 'Type of change being attempted';
COMMENT ON COLUMN actuation_attempts.evaluated_by IS 'Entity or system that evaluated this attempt';
COMMENT ON COLUMN actuation_attempts.evaluated_ms IS 'Time in milliseconds taken to evaluate the attempt';
COMMENT ON COLUMN actuation_attempts.allowed IS 'Whether the actuation attempt was allowed';
COMMENT ON COLUMN actuation_attempts.reason IS 'Reason for allowing or denying the actuation';
COMMENT ON COLUMN actuation_attempts.payload IS 'JSON payload containing actuation parameters';
COMMENT ON COLUMN actuation_attempts.delta_estimate IS 'Estimated delta or change from this actuation';
COMMENT ON COLUMN actuation_attempts.coverage_estimate_pct IS 'Estimated coverage percentage of the actuation';
COMMENT ON COLUMN actuation_attempts.ts IS 'Timestamp when the actuation attempt was made';

-- ACTIVATION_EVENTS table columns
COMMENT ON COLUMN activation_events.event_id IS 'Primary key: Unique identifier for the activation event';
COMMENT ON COLUMN activation_events.loop_id IS 'Reference to the loop being activated';
COMMENT ON COLUMN activation_events.fingerprint IS 'Unique fingerprint identifying the activation condition';
COMMENT ON COLUMN activation_events.time_window IS 'Time window specification for the activation';
COMMENT ON COLUMN activation_events.as_of IS 'Timestamp for when the activation is assessed';
COMMENT ON COLUMN activation_events.decision IS 'JSON object containing the activation decision details';
COMMENT ON COLUMN activation_events.created_at IS 'Timestamp when the activation event was recorded';
COMMENT ON COLUMN activation_events.created_by IS 'User or system that created this activation event';

-- ACTIVATION_OVERRIDES table columns
COMMENT ON COLUMN activation_overrides.override_id IS 'Primary key: Unique identifier for the override';
COMMENT ON COLUMN activation_overrides.event_id IS 'Reference to the activation event being overridden';
COMMENT ON COLUMN activation_overrides.actor IS 'User performing the override action';
COMMENT ON COLUMN activation_overrides.reason IS 'Reason provided for the override';
COMMENT ON COLUMN activation_overrides.before IS 'JSON state before the override';
COMMENT ON COLUMN activation_overrides.after IS 'JSON state after the override';
COMMENT ON COLUMN activation_overrides.created_at IS 'Timestamp when the override was created';
COMMENT ON COLUMN activation_overrides.approved_by IS 'User who approved this override (if applicable)';

-- AUDIT_LOG table columns
COMMENT ON COLUMN audit_log.id IS 'Primary key: Unique identifier for the audit log entry';
COMMENT ON COLUMN audit_log.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN audit_log.resource_type IS 'Type of resource that was modified';
COMMENT ON COLUMN audit_log.resource_id IS 'Identifier of the specific resource that was modified';
COMMENT ON COLUMN audit_log.action IS 'Action that was performed (create/update/delete/etc.)';
COMMENT ON COLUMN audit_log.user_id IS 'User who performed the action';
COMMENT ON COLUMN audit_log.old_values IS 'JSON representation of values before the change';
COMMENT ON COLUMN audit_log.new_values IS 'JSON representation of values after the change';
COMMENT ON COLUMN audit_log.ip_address IS 'IP address from which the action was performed';
COMMENT ON COLUMN audit_log.user_agent IS 'User agent string of the client';
COMMENT ON COLUMN audit_log.created_at IS 'Timestamp when the audit log entry was created';