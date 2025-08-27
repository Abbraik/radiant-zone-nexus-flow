-- Add column descriptions for dq_status table
COMMENT ON COLUMN dq_status.source_id IS 'ID of the data source being monitored';
COMMENT ON COLUMN dq_status.indicator_key IS 'Unique key identifying the indicator';
COMMENT ON COLUMN dq_status.as_of IS 'Timestamp when this quality assessment was made';
COMMENT ON COLUMN dq_status.missingness IS 'Proportion of missing data points (0.0 to 1.0)';
COMMENT ON COLUMN dq_status.staleness_seconds IS 'Age of the most recent data point in seconds';
COMMENT ON COLUMN dq_status.schema_drift IS 'Whether the data schema has changed unexpectedly';
COMMENT ON COLUMN dq_status.outlier_rate IS 'Proportion of data points identified as outliers';
COMMENT ON COLUMN dq_status.quality IS 'Overall quality assessment (good, degraded, bad)';
COMMENT ON COLUMN dq_status.user_id IS 'ID of the user who owns this quality status';

-- Add column descriptions for loop_signal_scores table
COMMENT ON COLUMN loop_signal_scores.loop_id IS 'ID of the loop being scored';
COMMENT ON COLUMN loop_signal_scores.time_window IS 'Time window used for the calculation (e.g. 14d, 30d)';
COMMENT ON COLUMN loop_signal_scores.as_of IS 'Timestamp when these scores were calculated';
COMMENT ON COLUMN loop_signal_scores.severity IS 'Mean absolute band position, clipped to [0, 2]';
COMMENT ON COLUMN loop_signal_scores.persistence IS 'Share of days with any indicator outside band';
COMMENT ON COLUMN loop_signal_scores.dispersion IS 'Proportion of indicators simultaneously outside band';
COMMENT ON COLUMN loop_signal_scores.hub_load IS 'Load on hub indicators (SNL-connected)';
COMMENT ON COLUMN loop_signal_scores.legitimacy_delta IS 'Change in trust/participation indicators';
COMMENT ON COLUMN loop_signal_scores.details IS 'Additional scoring details stored as JSON';
COMMENT ON COLUMN loop_signal_scores.user_id IS 'ID of the user who owns this score';

-- Add column descriptions for raw_observations table
COMMENT ON COLUMN raw_observations.obs_id IS 'Unique identifier for this observation';
COMMENT ON COLUMN raw_observations.source_id IS 'ID of the data source that provided this observation';
COMMENT ON COLUMN raw_observations.indicator_key IS 'Key identifying which indicator this observes';
COMMENT ON COLUMN raw_observations.ts IS 'Timestamp when this observation was made';
COMMENT ON COLUMN raw_observations.value IS 'The raw observed value';
COMMENT ON COLUMN raw_observations.unit IS 'Unit of measurement for the value';
COMMENT ON COLUMN raw_observations.hash IS 'Hash for deduplication and integrity checking';
COMMENT ON COLUMN raw_observations.created_at IS 'Timestamp when this record was created';
COMMENT ON COLUMN raw_observations.user_id IS 'ID of the user who owns this observation';

-- Add column descriptions for indicator_registry table
COMMENT ON COLUMN indicator_registry.indicator_key IS 'Unique key identifying this indicator';
COMMENT ON COLUMN indicator_registry.loop_id IS 'ID of the loop this indicator belongs to';
COMMENT ON COLUMN indicator_registry.title IS 'Human-readable title of the indicator';
COMMENT ON COLUMN indicator_registry.unit IS 'Unit of measurement for this indicator';
COMMENT ON COLUMN indicator_registry.triad_tag IS 'Classification tag (population, domain, institution)';
COMMENT ON COLUMN indicator_registry.snl_key IS 'Shared Node Library key for hub indicators';
COMMENT ON COLUMN indicator_registry.notes IS 'Additional notes about this indicator';
COMMENT ON COLUMN indicator_registry.created_at IS 'Timestamp when this indicator was registered';
COMMENT ON COLUMN indicator_registry.updated_at IS 'Timestamp when this indicator was last updated';
COMMENT ON COLUMN indicator_registry.user_id IS 'ID of the user who registered this indicator';