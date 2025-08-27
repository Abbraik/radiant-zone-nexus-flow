-- Add column descriptions for Part 2: More core tables

-- OPTIONS table columns
COMMENT ON COLUMN options.id IS 'Primary key: Unique identifier for the option';
COMMENT ON COLUMN options.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN options.option_set_id IS 'Reference to the option set this option belongs to';
COMMENT ON COLUMN options.title IS 'Human-readable title of the option';
COMMENT ON COLUMN options.description IS 'Detailed description of what this option entails';
COMMENT ON COLUMN options.cost_estimate IS 'Estimated cost for implementing this option';
COMMENT ON COLUMN options.risk_level IS 'Associated risk level (low/medium/high)';
COMMENT ON COLUMN options.time_horizon IS 'Expected time frame for option implementation';
COMMENT ON COLUMN options.stakeholder_impact IS 'Assessment of impact on stakeholders';
COMMENT ON COLUMN options.feasibility_score IS 'Feasibility rating from 0.0 to 1.0';
COMMENT ON COLUMN options.metadata IS 'JSON metadata with additional option details';
COMMENT ON COLUMN options.created_at IS 'Timestamp when the option was created';
COMMENT ON COLUMN options.updated_at IS 'Timestamp when the option was last modified';
COMMENT ON COLUMN options.tags IS 'Array of tags for categorization';
COMMENT ON COLUMN options.prerequisites IS 'Array of prerequisites for this option';
COMMENT ON COLUMN options.outcomes IS 'Expected outcomes from implementing this option';
COMMENT ON COLUMN options.trade_offs IS 'Known trade-offs and compromises';
COMMENT ON COLUMN options.evidence_base IS 'Supporting evidence for the option';

-- TASKS_5C table columns
COMMENT ON COLUMN tasks_5c.id IS 'Primary key: Unique identifier for the 5C task';
COMMENT ON COLUMN tasks_5c.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN tasks_5c.title IS 'Human-readable title of the 5C task';
COMMENT ON COLUMN tasks_5c.description IS 'Detailed description of the 5C task';
COMMENT ON COLUMN tasks_5c.status IS 'Current status of the 5C task';
COMMENT ON COLUMN tasks_5c.capacity IS '5C framework capacity level';
COMMENT ON COLUMN tasks_5c.priority IS 'Priority level for the 5C task';
COMMENT ON COLUMN tasks_5c.created_at IS 'Timestamp when the 5C task was created';
COMMENT ON COLUMN tasks_5c.updated_at IS 'Timestamp when the 5C task was last modified';
COMMENT ON COLUMN tasks_5c.due_at IS 'Target completion deadline for the 5C task';
COMMENT ON COLUMN tasks_5c.started_at IS 'Timestamp when work on the task began';
COMMENT ON COLUMN tasks_5c.completed_at IS 'Timestamp when the task was completed';
COMMENT ON COLUMN tasks_5c.assignee IS 'User assigned to complete the task';
COMMENT ON COLUMN tasks_5c.loop_id IS 'Reference to the loop this task operates within';
COMMENT ON COLUMN tasks_5c.leverage IS '5C framework leverage level';
COMMENT ON COLUMN tasks_5c.payload IS 'JSON payload with 5C-specific task data';
COMMENT ON COLUMN tasks_5c.metadata IS 'Additional metadata for the 5C task';

-- TASKS_V2 table columns
COMMENT ON COLUMN tasks_v2.id IS 'Primary key: Unique identifier for the v2 task';
COMMENT ON COLUMN tasks_v2.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN tasks_v2.title IS 'Human-readable title of the v2 task';
COMMENT ON COLUMN tasks_v2.description IS 'Detailed description of the v2 task';
COMMENT ON COLUMN tasks_v2.status IS 'Current status of the v2 task';
COMMENT ON COLUMN tasks_v2.priority IS 'Priority level for scheduling';
COMMENT ON COLUMN tasks_v2.created_at IS 'Timestamp when the v2 task was created';
COMMENT ON COLUMN tasks_v2.updated_at IS 'Timestamp when the v2 task was last modified';
COMMENT ON COLUMN tasks_v2.due_at IS 'Target completion deadline';
COMMENT ON COLUMN tasks_v2.assignee IS 'User assigned to complete this task';
COMMENT ON COLUMN tasks_v2.payload IS 'JSON payload with v2 task-specific data';
COMMENT ON COLUMN tasks_v2.tags IS 'Array of tags for organization';
COMMENT ON COLUMN tasks_v2.complexity_score IS 'Complexity rating for the task';
COMMENT ON COLUMN tasks_v2.estimated_hours IS 'Estimated time required in hours';
COMMENT ON COLUMN tasks_v2.dependencies IS 'Array of task dependencies';

-- CLAIM_SUBSTEPS table columns
COMMENT ON COLUMN claim_substeps.id IS 'Primary key: Unique identifier for the substep';
COMMENT ON COLUMN claim_substeps.claim_id IS 'Reference to the parent claim';
COMMENT ON COLUMN claim_substeps.user_id IS 'User ID for row-level security and ownership tracking';
COMMENT ON COLUMN claim_substeps.title IS 'Human-readable title of the substep';
COMMENT ON COLUMN claim_substeps.description IS 'Detailed description of what this substep involves';
COMMENT ON COLUMN claim_substeps.status IS 'Current status of the substep';
COMMENT ON COLUMN claim_substeps.ordering IS 'Order sequence number within the claim';
COMMENT ON COLUMN claim_substeps.created_at IS 'Timestamp when the substep was created';
COMMENT ON COLUMN claim_substeps.updated_at IS 'Timestamp when the substep was last modified';
COMMENT ON COLUMN claim_substeps.started_at IS 'Timestamp when work on the substep began';
COMMENT ON COLUMN claim_substeps.finished_at IS 'Timestamp when the substep was completed';
COMMENT ON COLUMN claim_substeps.owner IS 'User responsible for completing this substep';
COMMENT ON COLUMN claim_substeps.planned_duration IS 'Expected time to complete this substep';
COMMENT ON COLUMN claim_substeps.checklist IS 'JSON array of checklist items for this substep';
COMMENT ON COLUMN claim_substeps.attachments IS 'JSON array of file attachments and references';
COMMENT ON COLUMN claim_substeps.alert_id IS 'Reference to any associated alert or notification';

-- ANTIC_PRE_POSITION_ORDERS table columns
COMMENT ON COLUMN antic_pre_position_orders.id IS 'Primary key: Unique identifier for the pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN antic_pre_position_orders.kind IS 'Type of pre-positioned resource (resource/regulatory/comms)';
COMMENT ON COLUMN antic_pre_position_orders.title IS 'Human-readable title of the order';
COMMENT ON COLUMN antic_pre_position_orders.items IS 'JSON array of items included in this order';
COMMENT ON COLUMN antic_pre_position_orders.suppliers IS 'Array of supplier names or identifiers';
COMMENT ON COLUMN antic_pre_position_orders.sla IS 'Service Level Agreement terms and conditions';
COMMENT ON COLUMN antic_pre_position_orders.cost_ceiling IS 'Maximum allowed cost for this order';
COMMENT ON COLUMN antic_pre_position_orders.readiness_score IS 'Readiness assessment score (0.0-1.0)';
COMMENT ON COLUMN antic_pre_position_orders.shelf_life_days IS 'Number of days this order remains valid';
COMMENT ON COLUMN antic_pre_position_orders.status IS 'Current status of the pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.created_at IS 'Timestamp when the order was created';
COMMENT ON COLUMN antic_pre_position_orders.updated_at IS 'Timestamp when the order was last modified';
COMMENT ON COLUMN antic_pre_position_orders.created_by IS 'User who created this order';