-- Add column descriptions for loops table
COMMENT ON COLUMN loops.id IS 'Unique identifier for the loop';
COMMENT ON COLUMN loops.user_id IS 'ID of the user who owns this loop';
COMMENT ON COLUMN loops.created_at IS 'Timestamp when the loop was created';
COMMENT ON COLUMN loops.updated_at IS 'Timestamp when the loop was last updated';
COMMENT ON COLUMN loops.loop_code IS 'Human-readable code identifier for the loop (e.g. MAC-L01)';
COMMENT ON COLUMN loops.title IS 'Display title/name of the loop';
COMMENT ON COLUMN loops.description IS 'Detailed description of what this loop manages';
COMMENT ON COLUMN loops.metadata IS 'Additional metadata stored as JSON';
COMMENT ON COLUMN loops.status IS 'Current operational status of the loop';

-- Add column descriptions for tasks_5c table
COMMENT ON COLUMN tasks_5c.id IS 'Unique identifier for the 5C task';
COMMENT ON COLUMN tasks_5c.capacity IS 'The 5C capacity this task belongs to (responsive, reflexive, deliberative, anticipatory, structural)';
COMMENT ON COLUMN tasks_5c.loop_id IS 'ID of the loop this task is associated with';
COMMENT ON COLUMN tasks_5c.type IS 'Type of loop this task operates on (reactive, structural, perceptual)';
COMMENT ON COLUMN tasks_5c.scale IS 'Scale of operation (micro, meso, macro)';
COMMENT ON COLUMN tasks_5c.leverage IS 'Leverage type (N=natural, P=procedural, S=structural)';
COMMENT ON COLUMN tasks_5c.tri IS 'TRI values (transparency, responsiveness, integrity) stored as JSON';
COMMENT ON COLUMN tasks_5c.de_band_id IS 'Reference to the DE band configuration';
COMMENT ON COLUMN tasks_5c.srt_id IS 'Reference to the SRT window configuration';
COMMENT ON COLUMN tasks_5c.assigned_to IS 'User ID of who this task is assigned to';
COMMENT ON COLUMN tasks_5c.status IS 'Current status of the task (open, claimed, active, done, blocked)';
COMMENT ON COLUMN tasks_5c.title IS 'Display title of the task';
COMMENT ON COLUMN tasks_5c.description IS 'Detailed description of the task';
COMMENT ON COLUMN tasks_5c.payload IS 'Task-specific data and configuration stored as JSON';
COMMENT ON COLUMN tasks_5c.user_id IS 'ID of the user who created this task';
COMMENT ON COLUMN tasks_5c.created_at IS 'Timestamp when the task was created';
COMMENT ON COLUMN tasks_5c.updated_at IS 'Timestamp when the task was last updated';

-- Add column descriptions for indicator_readings table
COMMENT ON COLUMN indicator_readings.id IS 'Unique identifier for the indicator reading';
COMMENT ON COLUMN indicator_readings.org_id IS 'Organization ID that owns this reading';
COMMENT ON COLUMN indicator_readings.loop_code IS 'Code of the loop this indicator belongs to';
COMMENT ON COLUMN indicator_readings.indicator IS 'Name/identifier of the indicator being measured';
COMMENT ON COLUMN indicator_readings.t IS 'Timestamp when this reading was taken';
COMMENT ON COLUMN indicator_readings.value IS 'The measured value of the indicator';
COMMENT ON COLUMN indicator_readings.lower IS 'Lower bound threshold for this indicator';
COMMENT ON COLUMN indicator_readings.upper IS 'Upper bound threshold for this indicator';
COMMENT ON COLUMN indicator_readings.created_at IS 'Timestamp when this record was created';

-- Add column descriptions for source_registry table
COMMENT ON COLUMN source_registry.source_id IS 'Unique identifier for the data source';
COMMENT ON COLUMN source_registry.name IS 'Human-readable name of the data source';
COMMENT ON COLUMN source_registry.type IS 'Type of data source (pull, push, file, etc.)';
COMMENT ON COLUMN source_registry.provider IS 'Name of the organization/system providing the data';
COMMENT ON COLUMN source_registry.schedule_cron IS 'Cron expression for scheduled data collection';
COMMENT ON COLUMN source_registry.enabled IS 'Whether this data source is currently active';
COMMENT ON COLUMN source_registry.config IS 'Source-specific configuration stored as JSON';
COMMENT ON COLUMN source_registry.pii_class IS 'Classification of personally identifiable information level';
COMMENT ON COLUMN source_registry.created_at IS 'Timestamp when the source was registered';
COMMENT ON COLUMN source_registry.updated_at IS 'Timestamp when the source was last updated';
COMMENT ON COLUMN source_registry.user_id IS 'ID of the user who registered this source';