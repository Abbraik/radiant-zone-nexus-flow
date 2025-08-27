-- Add column descriptions for Part 2: More core tables (corrected)

-- OPTIONS table columns (actual columns)
COMMENT ON COLUMN options.id IS 'Primary key: Unique identifier for the option';
COMMENT ON COLUMN options.task_id IS 'Reference to the parent task this option belongs to';
COMMENT ON COLUMN options.loop_id IS 'Reference to the governance loop this option operates within';
COMMENT ON COLUMN options.name IS 'Human-readable name of the option';
COMMENT ON COLUMN options.lever IS 'Type of lever or mechanism this option uses';
COMMENT ON COLUMN options.actor IS 'Actor or entity responsible for implementing this option';
COMMENT ON COLUMN options.effect IS 'Expected effect or outcome of this option';
COMMENT ON COLUMN options.cost IS 'Estimated cost for implementing this option';
COMMENT ON COLUMN options.effort IS 'Effort level required for implementation';
COMMENT ON COLUMN options.time_to_impact IS 'Expected time before this option shows impact';
COMMENT ON COLUMN options.risks IS 'Associated risks with this option';
COMMENT ON COLUMN options.assumptions IS 'Underlying assumptions for this option';
COMMENT ON COLUMN options.dependencies IS 'Dependencies required for this option';
COMMENT ON COLUMN options.evidence IS 'Supporting evidence for this option';
COMMENT ON COLUMN options.status IS 'Current status of the option';
COMMENT ON COLUMN options.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN options.created_at IS 'Timestamp when the option was created';
COMMENT ON COLUMN options.updated_at IS 'Timestamp when the option was last modified';

-- TASKS_5C table columns (actual columns)
COMMENT ON COLUMN tasks_5c.id IS 'Primary key: Unique identifier for the 5C task';
COMMENT ON COLUMN tasks_5c.capacity IS '5C framework capacity level (responsive/structural/reflexive)';
COMMENT ON COLUMN tasks_5c.loop_id IS 'Reference to the governance loop this task operates within';
COMMENT ON COLUMN tasks_5c.type IS 'Type classification of the 5C task';
COMMENT ON COLUMN tasks_5c.scale IS 'Scale level of the task impact and scope';
COMMENT ON COLUMN tasks_5c.leverage IS '5C framework leverage level (N/S/M/H)';
COMMENT ON COLUMN tasks_5c.tri IS 'TRI (Tension-Response-Impact) framework data';
COMMENT ON COLUMN tasks_5c.de_band_id IS 'Reference to Dynamic Equilibrium band configuration';
COMMENT ON COLUMN tasks_5c.srt_id IS 'Reference to System Response Time configuration';
COMMENT ON COLUMN tasks_5c.assigned_to IS 'User assigned to complete the 5C task';
COMMENT ON COLUMN tasks_5c.status IS 'Current status of the 5C task';
COMMENT ON COLUMN tasks_5c.title IS 'Human-readable title of the 5C task';
COMMENT ON COLUMN tasks_5c.description IS 'Detailed description of the 5C task objectives';
COMMENT ON COLUMN tasks_5c.payload IS 'JSON payload with 5C-specific task data and parameters';
COMMENT ON COLUMN tasks_5c.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN tasks_5c.created_at IS 'Timestamp when the 5C task was created';
COMMENT ON COLUMN tasks_5c.updated_at IS 'Timestamp when the 5C task was last modified';

-- TASKS_V2 table columns (actual columns)
COMMENT ON COLUMN tasks_v2.task_id IS 'Primary key: Unique identifier for the v2 task';
COMMENT ON COLUMN tasks_v2.loop_id IS 'Reference to the governance loop this task operates within';
COMMENT ON COLUMN tasks_v2.capacity IS 'Governance capacity level required for this task';
COMMENT ON COLUMN tasks_v2.template_key IS 'Reference key to the template used for this task';
COMMENT ON COLUMN tasks_v2.status IS 'Current status of the v2 task';
COMMENT ON COLUMN tasks_v2.priority IS 'Priority level for scheduling and resource allocation';
COMMENT ON COLUMN tasks_v2.title IS 'Human-readable title of the v2 task';
COMMENT ON COLUMN tasks_v2.payload IS 'JSON payload with v2 task-specific data and configuration';
COMMENT ON COLUMN tasks_v2.open_route IS 'Open route or pathway for task execution';
COMMENT ON COLUMN tasks_v2.created_by IS 'User who created this v2 task';
COMMENT ON COLUMN tasks_v2.created_at IS 'Timestamp when the v2 task was created';
COMMENT ON COLUMN tasks_v2.updated_at IS 'Timestamp when the v2 task was last modified';
COMMENT ON COLUMN tasks_v2.due_at IS 'Target completion deadline for the task';
COMMENT ON COLUMN tasks_v2.review_at IS 'Scheduled review timestamp for the task';
COMMENT ON COLUMN tasks_v2.closed_at IS 'Timestamp when the task was closed or completed';

-- CLAIM_SUBSTEPS table columns (actual columns)
COMMENT ON COLUMN claim_substeps.id IS 'Primary key: Unique identifier for the substep';
COMMENT ON COLUMN claim_substeps.claim_id IS 'Reference to the parent claim this substep belongs to';
COMMENT ON COLUMN claim_substeps.title IS 'Human-readable title of the substep';
COMMENT ON COLUMN claim_substeps.description IS 'Detailed description of what this substep involves';
COMMENT ON COLUMN claim_substeps.owner IS 'User responsible for completing this substep';
COMMENT ON COLUMN claim_substeps.planned_duration IS 'Expected time duration to complete this substep';
COMMENT ON COLUMN claim_substeps.started_at IS 'Timestamp when work on the substep began';
COMMENT ON COLUMN claim_substeps.finished_at IS 'Timestamp when the substep was completed';
COMMENT ON COLUMN claim_substeps.status IS 'Current status of the substep execution';
COMMENT ON COLUMN claim_substeps.ordering IS 'Order sequence number within the parent claim';
COMMENT ON COLUMN claim_substeps.checklist IS 'JSON array of checklist items for this substep';
COMMENT ON COLUMN claim_substeps.attachments IS 'JSON array of file attachments and references';
COMMENT ON COLUMN claim_substeps.alert_id IS 'Reference to any associated alert or notification';
COMMENT ON COLUMN claim_substeps.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN claim_substeps.created_at IS 'Timestamp when the substep was created';
COMMENT ON COLUMN claim_substeps.updated_at IS 'Timestamp when the substep was last modified';