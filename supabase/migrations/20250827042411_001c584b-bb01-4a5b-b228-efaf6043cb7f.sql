-- Add column descriptions for core tables (Part 1: tasks, loops, claims)

-- TASKS table columns
COMMENT ON COLUMN tasks.id IS 'Primary key: Unique identifier for the task';
COMMENT ON COLUMN tasks.title IS 'Human-readable task title or name';
COMMENT ON COLUMN tasks.description IS 'Detailed description of the task objectives and context';
COMMENT ON COLUMN tasks.status IS 'Current status of the task (draft, active, completed, cancelled)';
COMMENT ON COLUMN tasks.created_at IS 'Timestamp when the task was created';
COMMENT ON COLUMN tasks.updated_at IS 'Timestamp when the task was last modified';
COMMENT ON COLUMN tasks.created_by IS 'User ID of the task creator';
COMMENT ON COLUMN tasks.assignee IS 'User ID of the person assigned to complete the task';
COMMENT ON COLUMN tasks.due_at IS 'Target completion deadline for the task';
COMMENT ON COLUMN tasks.started_at IS 'Timestamp when work on the task actually began';
COMMENT ON COLUMN tasks.completed_at IS 'Timestamp when the task was completed';
COMMENT ON COLUMN tasks.loop_id IS 'Reference to the governance loop this task belongs to';
COMMENT ON COLUMN tasks.capacity IS 'The governance capacity level required (responsive/structural/reflexive)';
COMMENT ON COLUMN tasks.leverage IS 'Level of leverage or intervention power (N/S/M/H)';
COMMENT ON COLUMN tasks.mandate_status IS 'Status of mandate compliance (allowed/warning_required/blocked)';
COMMENT ON COLUMN tasks.priority IS 'Task priority level for scheduling and resource allocation';
COMMENT ON COLUMN tasks.complexity_score IS 'Estimated complexity rating from 1-10';
COMMENT ON COLUMN tasks.risk_level IS 'Associated risk level (low/medium/high)';
COMMENT ON COLUMN tasks.stakeholder_count IS 'Number of stakeholders involved in this task';
COMMENT ON COLUMN tasks.payload IS 'JSON payload containing additional task metadata and parameters';
COMMENT ON COLUMN tasks.tags IS 'Array of categorical tags for organization and filtering';
COMMENT ON COLUMN tasks.dependencies IS 'Array of task IDs that must be completed before this task';
COMMENT ON COLUMN tasks.outcomes IS 'JSON object documenting task outcomes and results';
COMMENT ON COLUMN tasks.user_id IS 'User ID for row-level security and ownership tracking';

-- LOOPS table columns
COMMENT ON COLUMN loops.id IS 'Primary key: Unique identifier for the governance loop';
COMMENT ON COLUMN loops.name IS 'Human-readable name for the governance loop';
COMMENT ON COLUMN loops.description IS 'Detailed description of the loop purpose and scope';
COMMENT ON COLUMN loops.status IS 'Current operational status of the loop';
COMMENT ON COLUMN loops.created_at IS 'Timestamp when the loop was created';
COMMENT ON COLUMN loops.updated_at IS 'Timestamp when the loop was last modified';
COMMENT ON COLUMN loops.created_by IS 'User ID of the loop creator';
COMMENT ON COLUMN loops.loop_code IS 'Short code identifier for the loop (e.g., FER-L01)';
COMMENT ON COLUMN loops.domain IS 'Domain category this loop operates within';
COMMENT ON COLUMN loops.criticality IS 'Criticality level of this governance loop';
COMMENT ON COLUMN loops.complexity IS 'Complexity rating for the governance processes';
COMMENT ON COLUMN loops.stakeholder_count IS 'Number of stakeholders participating in this loop';
COMMENT ON COLUMN loops.cycle_time_days IS 'Average cycle time in days for loop operations';
COMMENT ON COLUMN loops.last_activity_at IS 'Timestamp of most recent activity in this loop';
COMMENT ON COLUMN loops.health_score IS 'Overall health score of the loop (0.0-1.0)';
COMMENT ON COLUMN loops.metadata IS 'JSON metadata containing additional loop configuration';
COMMENT ON COLUMN loops.tags IS 'Array of tags for categorization and filtering';
COMMENT ON COLUMN loops.coordinates IS 'Geographic or conceptual coordinates for positioning';
COMMENT ON COLUMN loops.boundaries IS 'JSON defining the operational boundaries of the loop';
COMMENT ON COLUMN loops.relationships IS 'JSON defining relationships with other loops';
COMMENT ON COLUMN loops.user_id IS 'User ID for row-level security and ownership tracking';

-- CLAIMS table columns
COMMENT ON COLUMN claims.id IS 'Primary key: Unique identifier for the claim';
COMMENT ON COLUMN claims.task_id IS 'Reference to the parent task this claim addresses';
COMMENT ON COLUMN claims.loop_id IS 'Reference to the governance loop this claim operates within';
COMMENT ON COLUMN claims.assignee IS 'User ID of the person assigned to execute this claim';
COMMENT ON COLUMN claims.leverage IS 'Level of leverage or intervention power for this claim';
COMMENT ON COLUMN claims.mandate_status IS 'Status of mandate compliance for this claim';
COMMENT ON COLUMN claims.status IS 'Current status of the claim (draft/active/completed/paused)';
COMMENT ON COLUMN claims.created_at IS 'Timestamp when the claim was created';
COMMENT ON COLUMN claims.updated_at IS 'Timestamp when the claim was last modified';
COMMENT ON COLUMN claims.started_at IS 'Timestamp when execution of the claim began';
COMMENT ON COLUMN claims.finished_at IS 'Timestamp when the claim was completed';
COMMENT ON COLUMN claims.paused_at IS 'Timestamp when the claim was paused (if applicable)';
COMMENT ON COLUMN claims.pause_reason IS 'Reason for pausing the claim execution';
COMMENT ON COLUMN claims.last_checkpoint_at IS 'Timestamp of the most recent checkpoint';
COMMENT ON COLUMN claims.raci IS 'RACI matrix defining roles and responsibilities';
COMMENT ON COLUMN claims.evidence IS 'JSON object containing evidence and documentation';
COMMENT ON COLUMN claims.sprint_id IS 'Reference to sprint if claim is part of sprint planning';
COMMENT ON COLUMN claims.user_id IS 'User ID for row-level security and ownership tracking';

-- CLAIMS_5C table columns
COMMENT ON COLUMN claims_5c.id IS 'Primary key: Unique identifier for the 5C framework claim';
COMMENT ON COLUMN claims_5c.task_id IS 'Reference to the parent task this claim addresses';
COMMENT ON COLUMN claims_5c.loop_id IS 'Reference to the governance loop this claim operates within';
COMMENT ON COLUMN claims_5c.assignee IS 'User ID of the person assigned to execute this claim';
COMMENT ON COLUMN claims_5c.leverage IS '5C framework leverage level (N/S/M/H)';
COMMENT ON COLUMN claims_5c.mandate_status IS '5C framework mandate compliance status';
COMMENT ON COLUMN claims_5c.status IS 'Current status of the 5C claim';
COMMENT ON COLUMN claims_5c.created_at IS 'Timestamp when the 5C claim was created';
COMMENT ON COLUMN claims_5c.updated_at IS 'Timestamp when the 5C claim was last modified';
COMMENT ON COLUMN claims_5c.started_at IS 'Timestamp when execution began';
COMMENT ON COLUMN claims_5c.finished_at IS 'Timestamp when the claim was completed';
COMMENT ON COLUMN claims_5c.paused_at IS 'Timestamp when the claim was paused';
COMMENT ON COLUMN claims_5c.pause_reason IS 'Reason for pausing the claim execution';
COMMENT ON COLUMN claims_5c.last_checkpoint_at IS 'Timestamp of the most recent checkpoint';
COMMENT ON COLUMN claims_5c.raci IS '5C RACI matrix for roles and responsibilities';
COMMENT ON COLUMN claims_5c.evidence IS 'Evidence documentation in 5C framework format';
COMMENT ON COLUMN claims_5c.sprint_id IS 'Reference to sprint for 5C planning';
COMMENT ON COLUMN claims_5c.user_id IS 'User ID for row-level security and ownership tracking';