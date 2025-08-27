-- Add column descriptions for band_crossings table
COMMENT ON COLUMN band_crossings.created_at IS 'Timestamp when this crossing event was recorded';
COMMENT ON COLUMN band_crossings.direction IS 'Direction of the band crossing (above, below, into)';
COMMENT ON COLUMN band_crossings.loop_id IS 'ID of the loop where the band crossing occurred';
COMMENT ON COLUMN band_crossings.id IS 'Unique identifier for this band crossing event';
COMMENT ON COLUMN band_crossings.user_id IS 'ID of the user who owns this band crossing record';
COMMENT ON COLUMN band_crossings.at IS 'Timestamp when the actual band crossing occurred';
COMMENT ON COLUMN band_crossings.value IS 'The indicator value at the time of crossing';

-- Add column descriptions for cascades table
COMMENT ON COLUMN cascades.relation IS 'Type of cascading relationship between loops';
COMMENT ON COLUMN cascades.user_id IS 'ID of the user who defined this cascade relationship';
COMMENT ON COLUMN cascades.to_loop_id IS 'ID of the loop that receives the cascade effect';
COMMENT ON COLUMN cascades.from_loop_id IS 'ID of the loop that originates the cascade';
COMMENT ON COLUMN cascades.id IS 'Unique identifier for this cascade relationship';
COMMENT ON COLUMN cascades.created_at IS 'Timestamp when this cascade was defined';
COMMENT ON COLUMN cascades.note IS 'Additional notes about this cascade relationship';

-- Add column descriptions for breach_events table
COMMENT ON COLUMN breach_events.indicator_name IS 'Name of the indicator that breached';
COMMENT ON COLUMN breach_events.user_id IS 'ID of the user who owns this breach event';
COMMENT ON COLUMN breach_events.value IS 'The indicator value that caused the breach';
COMMENT ON COLUMN breach_events.threshold_value IS 'The threshold value that was breached';
COMMENT ON COLUMN breach_events.severity_score IS 'Numerical severity score for this breach (1-10)';
COMMENT ON COLUMN breach_events.duration_minutes IS 'How long the breach lasted in minutes';
COMMENT ON COLUMN breach_events.resolved_at IS 'Timestamp when the breach was resolved';
COMMENT ON COLUMN breach_events.created_at IS 'Timestamp when this breach event was recorded';
COMMENT ON COLUMN breach_events.at IS 'Timestamp when the actual breach occurred';
COMMENT ON COLUMN breach_events.breach_type IS 'Type of breach (upper_bound, lower_bound, etc.)';
COMMENT ON COLUMN breach_events.id IS 'Unique identifier for this breach event';
COMMENT ON COLUMN breach_events.loop_id IS 'ID of the loop where the breach occurred';