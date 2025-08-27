-- Continue adding column descriptions for more tables

-- Add column descriptions for claims table
COMMENT ON COLUMN claims.user_id IS 'ID of the user who owns this claim';
COMMENT ON COLUMN claims.paused_at IS 'Timestamp when this claim was paused';
COMMENT ON COLUMN claims.finished_at IS 'Timestamp when this claim was completed';
COMMENT ON COLUMN claims.last_checkpoint_at IS 'Timestamp of the most recent checkpoint';
COMMENT ON COLUMN claims.pause_reason IS 'Reason why the claim was paused';
COMMENT ON COLUMN claims.id IS 'Unique identifier for this claim';
COMMENT ON COLUMN claims.task_id IS 'ID of the task this claim is for';
COMMENT ON COLUMN claims.loop_id IS 'ID of the loop this claim belongs to';
COMMENT ON COLUMN claims.assignee IS 'ID of the user assigned to this claim';
COMMENT ON COLUMN claims.raci IS 'RACI matrix defining roles and responsibilities';
COMMENT ON COLUMN claims.leverage IS 'Type of leverage applied (N=None, P=Policy, S=Structural)';
COMMENT ON COLUMN claims.mandate_status IS 'Authorization status for this claim';
COMMENT ON COLUMN claims.evidence IS 'Supporting evidence and documentation';
COMMENT ON COLUMN claims.sprint_id IS 'ID of the sprint this claim belongs to';
COMMENT ON COLUMN claims.status IS 'Current status of the claim';
COMMENT ON COLUMN claims.started_at IS 'Timestamp when work on this claim began';
COMMENT ON COLUMN claims.created_at IS 'Timestamp when this claim was created';
COMMENT ON COLUMN claims.updated_at IS 'Timestamp when this claim was last modified';

-- Add column descriptions for de_bands table
COMMENT ON COLUMN de_bands.created_at IS 'Timestamp when this DE band was created';
COMMENT ON COLUMN de_bands.user_id IS 'ID of the user who created this DE band';
COMMENT ON COLUMN de_bands.asymmetry IS 'Asymmetry factor for the band boundaries';
COMMENT ON COLUMN de_bands.upper_bound IS 'Upper threshold for the indicator';
COMMENT ON COLUMN de_bands.lower_bound IS 'Lower threshold for the indicator';
COMMENT ON COLUMN de_bands.loop_id IS 'ID of the loop this band applies to';
COMMENT ON COLUMN de_bands.id IS 'Unique identifier for this DE band';
COMMENT ON COLUMN de_bands.indicator IS 'Name of the indicator this band monitors';
COMMENT ON COLUMN de_bands.notes IS 'Additional notes about this DE band configuration';
COMMENT ON COLUMN de_bands.smoothing_alpha IS 'Smoothing factor for exponential weighted moving average';
COMMENT ON COLUMN de_bands.updated_by IS 'ID of the user who last updated this band';
COMMENT ON COLUMN de_bands.updated_at IS 'Timestamp when this band was last modified';

-- Add column descriptions for loops table (assuming it exists based on foreign keys)
-- Note: Adding comments for common loop table structure

-- Add column descriptions for compass_snapshots table  
COMMENT ON COLUMN compass_snapshots.consent_avg IS 'Average consent score across relevant populations';
COMMENT ON COLUMN compass_snapshots.user_id IS 'ID of the user who owns this snapshot';
COMMENT ON COLUMN compass_snapshots.created_at IS 'Timestamp when this snapshot was created';
COMMENT ON COLUMN compass_snapshots.tri IS 'TRI (Trust, Responsiveness, Inclusiveness) values';
COMMENT ON COLUMN compass_snapshots.drift IS 'Drift measurements for various indicators';
COMMENT ON COLUMN compass_snapshots.ci IS 'Compass Index - overall system health score';
COMMENT ON COLUMN compass_snapshots.as_of IS 'Date this snapshot represents';
COMMENT ON COLUMN compass_snapshots.loop_id IS 'ID of the loop this snapshot belongs to';
COMMENT ON COLUMN compass_snapshots.snap_id IS 'Unique identifier for this snapshot';

-- Add column descriptions for activation_events table
COMMENT ON COLUMN activation_events.loop_id IS 'ID of the loop where activation occurred';
COMMENT ON COLUMN activation_events.fingerprint IS 'Unique fingerprint identifying the activation pattern';
COMMENT ON COLUMN activation_events.time_window IS 'Time window for this activation event';
COMMENT ON COLUMN activation_events.created_at IS 'Timestamp when this event was recorded';
COMMENT ON COLUMN activation_events.created_by IS 'ID of the user who created this event';
COMMENT ON COLUMN activation_events.decision IS 'Decision data and context for the activation';
COMMENT ON COLUMN activation_events.as_of IS 'Timestamp the activation decision was made';
COMMENT ON COLUMN activation_events.event_id IS 'Unique identifier for this activation event';