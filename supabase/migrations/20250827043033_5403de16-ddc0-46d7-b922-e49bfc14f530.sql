-- Add column descriptions for Part 4: More system tables

-- BREACH_EVENTS table columns
COMMENT ON COLUMN breach_events.id IS 'Primary key: Unique identifier for the breach event';
COMMENT ON COLUMN breach_events.loop_id IS 'Reference to the governance loop where the breach occurred';
COMMENT ON COLUMN breach_events.indicator_name IS 'Name of the indicator that breached its threshold';
COMMENT ON COLUMN breach_events.breach_type IS 'Type of breach (upper/lower/deviation)';
COMMENT ON COLUMN breach_events.value IS 'Actual value that caused the breach';
COMMENT ON COLUMN breach_events.threshold_value IS 'Threshold value that was breached';
COMMENT ON COLUMN breach_events.severity_score IS 'Severity score of the breach (1-10 scale)';
COMMENT ON COLUMN breach_events.at IS 'Timestamp when the breach occurred';
COMMENT ON COLUMN breach_events.duration_minutes IS 'Duration of the breach in minutes';
COMMENT ON COLUMN breach_events.resolved_at IS 'Timestamp when the breach was resolved';
COMMENT ON COLUMN breach_events.created_at IS 'Timestamp when the breach event was recorded';
COMMENT ON COLUMN breach_events.user_id IS 'User ID for row-level security and ownership tracking';

-- BAND_CROSSINGS table columns
COMMENT ON COLUMN band_crossings.id IS 'Primary key: Unique identifier for the band crossing';
COMMENT ON COLUMN band_crossings.loop_id IS 'Reference to the loop where the band crossing occurred';
COMMENT ON COLUMN band_crossings.direction IS 'Direction of crossing (upward/downward/inward/outward)';
COMMENT ON COLUMN band_crossings.value IS 'Value at the time of crossing';
COMMENT ON COLUMN band_crossings.at IS 'Timestamp when the band crossing occurred';
COMMENT ON COLUMN band_crossings.created_at IS 'Timestamp when the crossing was recorded';
COMMENT ON COLUMN band_crossings.user_id IS 'User ID for row-level security and ownership tracking';

-- BAND_CROSSINGS_5C table columns
COMMENT ON COLUMN band_crossings_5c.id IS 'Primary key: Unique identifier for the 5C band crossing';
COMMENT ON COLUMN band_crossings_5c.loop_id IS 'Reference to the loop where the 5C band crossing occurred';
COMMENT ON COLUMN band_crossings_5c.direction IS 'Direction of crossing in 5C framework';
COMMENT ON COLUMN band_crossings_5c.value IS 'Value at the time of 5C band crossing';
COMMENT ON COLUMN band_crossings_5c.at IS 'Timestamp when the 5C band crossing occurred';
COMMENT ON COLUMN band_crossings_5c.created_at IS 'Timestamp when the 5C crossing was recorded';
COMMENT ON COLUMN band_crossings_5c.user_id IS 'User ID for row-level security and ownership tracking';

-- DE_BANDS table columns
COMMENT ON COLUMN de_bands.id IS 'Primary key: Unique identifier for the DE band';
COMMENT ON COLUMN de_bands.loop_id IS 'Reference to the loop this DE band applies to';
COMMENT ON COLUMN de_bands.indicator IS 'Name or identifier of the indicator being monitored';
COMMENT ON COLUMN de_bands.lower_bound IS 'Lower boundary of the dynamic equilibrium band';
COMMENT ON COLUMN de_bands.upper_bound IS 'Upper boundary of the dynamic equilibrium band';
COMMENT ON COLUMN de_bands.asymmetry IS 'Asymmetry factor for the band (0 = symmetric)';
COMMENT ON COLUMN de_bands.smoothing_alpha IS 'Smoothing factor for band calculations (0.0-1.0)';
COMMENT ON COLUMN de_bands.notes IS 'Additional notes about this DE band configuration';
COMMENT ON COLUMN de_bands.created_at IS 'Timestamp when the DE band was created';
COMMENT ON COLUMN de_bands.updated_at IS 'Timestamp when the DE band was last modified';
COMMENT ON COLUMN de_bands.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN de_bands.updated_by IS 'User who last updated this DE band';

-- DE_BANDS_5C table columns
COMMENT ON COLUMN de_bands_5c.id IS 'Primary key: Unique identifier for the 5C DE band';
COMMENT ON COLUMN de_bands_5c.loop_id IS 'Reference to the loop this 5C DE band applies to';
COMMENT ON COLUMN de_bands_5c.indicator IS 'Indicator name for 5C framework DE band';
COMMENT ON COLUMN de_bands_5c.lower_bound IS 'Lower boundary of the 5C dynamic equilibrium band';
COMMENT ON COLUMN de_bands_5c.upper_bound IS 'Upper boundary of the 5C dynamic equilibrium band';
COMMENT ON COLUMN de_bands_5c.asymmetry IS 'Asymmetry factor for the 5C band';
COMMENT ON COLUMN de_bands_5c.smoothing_alpha IS 'Smoothing factor for 5C band calculations';
COMMENT ON COLUMN de_bands_5c.notes IS 'Additional notes about this 5C DE band';
COMMENT ON COLUMN de_bands_5c.created_at IS 'Timestamp when the 5C DE band was created';
COMMENT ON COLUMN de_bands_5c.updated_at IS 'Timestamp when the 5C DE band was last modified';
COMMENT ON COLUMN de_bands_5c.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN de_bands_5c.updated_by IS 'User who last updated this 5C DE band';

-- CASCADES table columns
COMMENT ON COLUMN cascades.id IS 'Primary key: Unique identifier for the cascade relationship';
COMMENT ON COLUMN cascades.from_loop_id IS 'Source loop ID in the cascade relationship';
COMMENT ON COLUMN cascades.to_loop_id IS 'Target loop ID in the cascade relationship';
COMMENT ON COLUMN cascades.relation IS 'Type of cascade relationship (amplifies/dampens/triggers)';
COMMENT ON COLUMN cascades.note IS 'Additional notes describing the cascade relationship';
COMMENT ON COLUMN cascades.created_at IS 'Timestamp when the cascade was defined';
COMMENT ON COLUMN cascades.user_id IS 'User ID for row-level security and ownership tracking';