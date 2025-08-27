-- Add column descriptions for multiple high-priority tables

-- watchpoints table
COMMENT ON COLUMN watchpoints.id IS 'Unique identifier for the watchpoint';
COMMENT ON COLUMN watchpoints.loop_id IS 'Foreign key reference to the loop this watchpoint monitors';
COMMENT ON COLUMN watchpoints.indicator IS 'Name of the indicator being watched';
COMMENT ON COLUMN watchpoints.direction IS 'Direction of threshold crossing to watch for (above, below, either)';
COMMENT ON COLUMN watchpoints.threshold_value IS 'Numeric threshold value that triggers the watchpoint';
COMMENT ON COLUMN watchpoints.threshold_band IS 'JSON object defining the threshold band configuration';
COMMENT ON COLUMN watchpoints.owner IS 'User responsible for this watchpoint';
COMMENT ON COLUMN watchpoints.playbook_id IS 'Reference to the playbook to execute when triggered';
COMMENT ON COLUMN watchpoints.armed IS 'Whether the watchpoint is currently armed and active';
COMMENT ON COLUMN watchpoints.last_eval IS 'Timestamp of the last evaluation of this watchpoint';
COMMENT ON COLUMN watchpoints.last_result IS 'JSON object containing the results of the last evaluation';
COMMENT ON COLUMN watchpoints.user_id IS 'User who created this watchpoint';
COMMENT ON COLUMN watchpoints.created_at IS 'Timestamp when this watchpoint was created';
COMMENT ON COLUMN watchpoints.updated_at IS 'Timestamp when this watchpoint was last updated';

-- guardrails table
COMMENT ON COLUMN guardrails.id IS 'Unique identifier for the guardrail';
COMMENT ON COLUMN guardrails.loop_id IS 'Foreign key reference to the loop this guardrail protects';
COMMENT ON COLUMN guardrails.timebox_minutes IS 'Maximum time in minutes for operations';
COMMENT ON COLUMN guardrails.max_delta_per_day IS 'Maximum change allowed per day';
COMMENT ON COLUMN guardrails.max_coverage_pct IS 'Maximum coverage percentage allowed';
COMMENT ON COLUMN guardrails.max_concurrent_substeps IS 'Maximum number of concurrent substeps allowed';
COMMENT ON COLUMN guardrails.override_active IS 'Whether an override is currently active';
COMMENT ON COLUMN guardrails.override_reason IS 'Reason for the current override';
COMMENT ON COLUMN guardrails.override_by IS 'User who activated the override';
COMMENT ON COLUMN guardrails.override_at IS 'Timestamp when the override was activated';
COMMENT ON COLUMN guardrails.user_id IS 'User who created this guardrail';
COMMENT ON COLUMN guardrails.created_at IS 'Timestamp when this guardrail was created';
COMMENT ON COLUMN guardrails.updated_at IS 'Timestamp when this guardrail was last updated';

-- rel_tickets table
COMMENT ON COLUMN rel_tickets.id IS 'Unique identifier for the REL ticket';
COMMENT ON COLUMN rel_tickets.user_id IS 'User who created this REL ticket';
COMMENT ON COLUMN rel_tickets.indicator_id IS 'Foreign key reference to the associated indicator';
COMMENT ON COLUMN rel_tickets.loop_id IS 'Foreign key reference to the loop this REL ticket belongs to';
COMMENT ON COLUMN rel_tickets.stage IS 'Current stage of the REL ticket (created, investigating, resolved, closed)';
COMMENT ON COLUMN rel_tickets.severity_score IS 'Severity score for this REL ticket (1-10)';
COMMENT ON COLUMN rel_tickets.magnitude IS 'Magnitude of the issue represented by this ticket';
COMMENT ON COLUMN rel_tickets.persistence IS 'How long the issue has persisted (in hours)';
COMMENT ON COLUMN rel_tickets.cohort IS 'Cohort or group this REL ticket is part of';
COMMENT ON COLUMN rel_tickets.geo IS 'Geographic identifier for this REL ticket';
COMMENT ON COLUMN rel_tickets.description IS 'Detailed description of the REL ticket';
COMMENT ON COLUMN rel_tickets.created_at IS 'Timestamp when this REL ticket was created';
COMMENT ON COLUMN rel_tickets.updated_at IS 'Timestamp when this REL ticket was last updated';

-- normalized_observations table
COMMENT ON COLUMN normalized_observations.norm_id IS 'Unique identifier for the normalized observation';
COMMENT ON COLUMN normalized_observations.indicator_key IS 'Key identifying the indicator this observation belongs to';
COMMENT ON COLUMN normalized_observations.loop_id IS 'Foreign key reference to the loop this observation belongs to';
COMMENT ON COLUMN normalized_observations.ts IS 'Timestamp when this observation was recorded';
COMMENT ON COLUMN normalized_observations.value IS 'Raw observed value';
COMMENT ON COLUMN normalized_observations.value_smoothed IS 'Smoothed value after applying filters';
COMMENT ON COLUMN normalized_observations.band_pos IS 'Position relative to the DE band (0=center, ±1=edges)';
COMMENT ON COLUMN normalized_observations.status IS 'Status relative to DE band (in_band, above, below)';
COMMENT ON COLUMN normalized_observations.severity IS 'Severity score based on band position';
COMMENT ON COLUMN normalized_observations.notes IS 'Additional notes about this observation';
COMMENT ON COLUMN normalized_observations.created_at IS 'Timestamp when this normalized observation was created';
COMMENT ON COLUMN normalized_observations.user_id IS 'User associated with this observation';