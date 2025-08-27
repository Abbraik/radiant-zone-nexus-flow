-- Add column descriptions for activation_overrides table
COMMENT ON COLUMN activation_overrides.reason IS 'Reason for overriding the activation decision';
COMMENT ON COLUMN activation_overrides.after IS 'New activation settings after the override';
COMMENT ON COLUMN activation_overrides.created_at IS 'Timestamp when this override was created';
COMMENT ON COLUMN activation_overrides.approved_by IS 'ID of the user who approved this override';
COMMENT ON COLUMN activation_overrides.override_id IS 'Unique identifier for this override';
COMMENT ON COLUMN activation_overrides.event_id IS 'ID of the activation event being overridden';
COMMENT ON COLUMN activation_overrides.actor IS 'ID of the user who requested the override';
COMMENT ON COLUMN activation_overrides.before IS 'Original activation settings before the override';

-- Add column descriptions for actuation_attempts table
COMMENT ON COLUMN actuation_attempts.evaluated_by IS 'System or service that evaluated this actuation';
COMMENT ON COLUMN actuation_attempts.attempt_id IS 'Unique identifier for this actuation attempt';
COMMENT ON COLUMN actuation_attempts.delta_estimate IS 'Estimated change in system state from this actuation';
COMMENT ON COLUMN actuation_attempts.coverage_estimate_pct IS 'Estimated percentage of coverage for this actuation';
COMMENT ON COLUMN actuation_attempts.payload IS 'Data payload for the actuation attempt';
COMMENT ON COLUMN actuation_attempts.allowed IS 'Whether this actuation attempt was allowed to proceed';
COMMENT ON COLUMN actuation_attempts.task_id IS 'ID of the task this actuation is for';
COMMENT ON COLUMN actuation_attempts.evaluated_ms IS 'Time in milliseconds to evaluate this attempt';
COMMENT ON COLUMN actuation_attempts.reason IS 'Reason for allowing or denying this actuation';
COMMENT ON COLUMN actuation_attempts.ts IS 'Timestamp when this attempt was made';
COMMENT ON COLUMN actuation_attempts.actor IS 'Actor or service making the actuation attempt';
COMMENT ON COLUMN actuation_attempts.change_kind IS 'Type of change this actuation would make';

-- Add column descriptions for adopting_entities table
COMMENT ON COLUMN adopting_entities.name IS 'Name of the adopting entity';
COMMENT ON COLUMN adopting_entities.entity_id IS 'Unique identifier for this entity';
COMMENT ON COLUMN adopting_entities.parent_id IS 'ID of the parent entity if this is a sub-entity';
COMMENT ON COLUMN adopting_entities.kind IS 'Type or category of adopting entity';

-- Add column descriptions for adoption_events table
COMMENT ON COLUMN adoption_events.type IS 'Type of adoption event';
COMMENT ON COLUMN adoption_events.adopt_id IS 'ID of the adoption this event relates to';
COMMENT ON COLUMN adoption_events.detail IS 'Additional details about the adoption event';
COMMENT ON COLUMN adoption_events.at IS 'Timestamp when this adoption event occurred';
COMMENT ON COLUMN adoption_events.event_id IS 'Unique identifier for this adoption event';

-- Add column descriptions for antic_activation_events table
COMMENT ON COLUMN antic_activation_events.id IS 'Unique identifier for this anticipatory activation event';
COMMENT ON COLUMN antic_activation_events.indicator IS 'Indicator that triggered this activation';
COMMENT ON COLUMN antic_activation_events.loop_code IS 'Code of the loop where activation occurred';
COMMENT ON COLUMN antic_activation_events.source IS 'Source system or service that created this event';
COMMENT ON COLUMN antic_activation_events.kind IS 'Kind or type of activation event';
COMMENT ON COLUMN antic_activation_events.created_at IS 'Timestamp when this event was created';
COMMENT ON COLUMN antic_activation_events.created_by IS 'ID of the user who created this event';
COMMENT ON COLUMN antic_activation_events.payload IS 'Additional data payload for this event';
COMMENT ON COLUMN antic_activation_events.org_id IS 'ID of the organization this event belongs to';

-- Add column descriptions for antic_backtests table
COMMENT ON COLUMN antic_backtests.points IS 'Historical data points used in the backtest';
COMMENT ON COLUMN antic_backtests.id IS 'Unique identifier for this backtest';
COMMENT ON COLUMN antic_backtests.org_id IS 'ID of the organization this backtest belongs to';
COMMENT ON COLUMN antic_backtests.rule_id IS 'ID of the trigger rule being backtested';
COMMENT ON COLUMN antic_backtests.metrics IS 'Performance metrics from the backtest';
COMMENT ON COLUMN antic_backtests.created_at IS 'Timestamp when this backtest was created';
COMMENT ON COLUMN antic_backtests.horizon IS 'Time horizon for the backtest analysis';
COMMENT ON COLUMN antic_backtests.created_by IS 'ID of the user who created this backtest';

-- Add column descriptions for antic_buffers table
COMMENT ON COLUMN antic_buffers.current IS 'Current buffer level or value';
COMMENT ON COLUMN antic_buffers.id IS 'Unique identifier for this buffer';
COMMENT ON COLUMN antic_buffers.created_at IS 'Timestamp when this buffer was created';
COMMENT ON COLUMN antic_buffers.org_id IS 'ID of the organization this buffer belongs to';
COMMENT ON COLUMN antic_buffers.label IS 'Human-readable label for this buffer';
COMMENT ON COLUMN antic_buffers.target IS 'Target or desired buffer level';
COMMENT ON COLUMN antic_buffers.history IS 'Historical data for this buffer';

-- Add column descriptions for antic_ews_components table
COMMENT ON COLUMN antic_ews_components.org_id IS 'ID of the organization this EWS component belongs to';
COMMENT ON COLUMN antic_ews_components.weight IS 'Weight of this component in the EWS calculation';
COMMENT ON COLUMN antic_ews_components.label IS 'Human-readable label for this EWS component';
COMMENT ON COLUMN antic_ews_components.created_at IS 'Timestamp when this component was created';
COMMENT ON COLUMN antic_ews_components.id IS 'Unique identifier for this EWS component';
COMMENT ON COLUMN antic_ews_components.series IS 'Time series data for this component';
COMMENT ON COLUMN antic_ews_components.loop_code IS 'Code of the loop this component monitors';