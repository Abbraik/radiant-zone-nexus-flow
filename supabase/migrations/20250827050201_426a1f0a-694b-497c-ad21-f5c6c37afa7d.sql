-- Continue adding descriptions for remaining tables

-- Add column descriptions for app_tasks_queue table
COMMENT ON COLUMN app_tasks_queue.created_by IS 'ID of the user who created this task';
COMMENT ON COLUMN app_tasks_queue.capacity IS 'Capacity level required for this task';
COMMENT ON COLUMN app_tasks_queue.due_at IS 'Timestamp when this task is due';
COMMENT ON COLUMN app_tasks_queue.payload IS 'JSON data payload for this task';
COMMENT ON COLUMN app_tasks_queue.org_id IS 'ID of the organization this task belongs to';
COMMENT ON COLUMN app_tasks_queue.id IS 'Unique identifier for this task';
COMMENT ON COLUMN app_tasks_queue.title IS 'Title or name of this task';
COMMENT ON COLUMN app_tasks_queue.status IS 'Current status of this task';
COMMENT ON COLUMN app_tasks_queue.created_at IS 'Timestamp when this task was created';

-- Add column descriptions for applied_arcs table
COMMENT ON COLUMN applied_arcs.item_id IS 'Identifier of the item this arc is applied to';
COMMENT ON COLUMN applied_arcs.applied_at IS 'Timestamp when this arc was applied';
COMMENT ON COLUMN applied_arcs.arc_type IS 'Type of arc being applied';
COMMENT ON COLUMN applied_arcs.user_id IS 'ID of the user who applied this arc';
COMMENT ON COLUMN applied_arcs.id IS 'Unique identifier for this applied arc';
COMMENT ON COLUMN applied_arcs.level IS 'Level or intensity of the applied arc';

-- Add column descriptions for audit_log table
COMMENT ON COLUMN audit_log.resource_type IS 'Type of resource that was audited';
COMMENT ON COLUMN audit_log.new_values IS 'New values after the change';
COMMENT ON COLUMN audit_log.ip_address IS 'IP address from which the action was performed';
COMMENT ON COLUMN audit_log.action IS 'Type of action performed (CREATE, UPDATE, DELETE)';
COMMENT ON COLUMN audit_log.id IS 'Unique identifier for this audit log entry';
COMMENT ON COLUMN audit_log.org_id IS 'ID of the organization this audit log belongs to';
COMMENT ON COLUMN audit_log.created_at IS 'Timestamp when this audit log was created';
COMMENT ON COLUMN audit_log.resource_id IS 'ID of the resource that was changed';
COMMENT ON COLUMN audit_log.user_id IS 'ID of the user who performed the action';
COMMENT ON COLUMN audit_log.old_values IS 'Previous values before the change';
COMMENT ON COLUMN audit_log.user_agent IS 'User agent string from the browser/client';

-- Add column descriptions for band_crossings_5c table
COMMENT ON COLUMN band_crossings_5c.user_id IS 'ID of the user who owns this 5C band crossing';
COMMENT ON COLUMN band_crossings_5c.direction IS 'Direction of the band crossing (above, below, into)';
COMMENT ON COLUMN band_crossings_5c.created_at IS 'Timestamp when this crossing was recorded';
COMMENT ON COLUMN band_crossings_5c.at IS 'Timestamp when the actual crossing occurred';
COMMENT ON COLUMN band_crossings_5c.value IS 'The indicator value at the time of crossing';
COMMENT ON COLUMN band_crossings_5c.loop_id IS 'ID of the 5C loop where the crossing occurred';
COMMENT ON COLUMN band_crossings_5c.id IS 'Unique identifier for this 5C band crossing';

-- Add column descriptions for band_weight_changes table
COMMENT ON COLUMN band_weight_changes.anchor IS 'Anchor point for the weight change';
COMMENT ON COLUMN band_weight_changes.created_at IS 'Timestamp when this weight change was made';
COMMENT ON COLUMN band_weight_changes.user_id IS 'ID of the user who made this weight change';
COMMENT ON COLUMN band_weight_changes.rationale IS 'Reason for making this weight change';
COMMENT ON COLUMN band_weight_changes.loop_code IS 'Code of the loop affected by this weight change';
COMMENT ON COLUMN band_weight_changes.tier IS 'Tier level for this weight change';
COMMENT ON COLUMN band_weight_changes.after IS 'Weight values after the change';
COMMENT ON COLUMN band_weight_changes.before IS 'Weight values before the change';
COMMENT ON COLUMN band_weight_changes.id IS 'Unique identifier for this weight change';

-- Add column descriptions for claim_checkpoints table
COMMENT ON COLUMN claim_checkpoints.created_by IS 'ID of the user who created this checkpoint';
COMMENT ON COLUMN claim_checkpoints.tri_values IS 'TRI (Trust, Responsiveness, Inclusiveness) values at checkpoint';
COMMENT ON COLUMN claim_checkpoints.attachments IS 'File attachments associated with this checkpoint';
COMMENT ON COLUMN claim_checkpoints.claim_id IS 'ID of the claim this checkpoint belongs to';
COMMENT ON COLUMN claim_checkpoints.id IS 'Unique identifier for this checkpoint';
COMMENT ON COLUMN claim_checkpoints.user_id IS 'ID of the user who owns this checkpoint';
COMMENT ON COLUMN claim_checkpoints.created_at IS 'Timestamp when this checkpoint was created';
COMMENT ON COLUMN claim_checkpoints.summary IS 'Summary text describing this checkpoint';
COMMENT ON COLUMN claim_checkpoints.tag IS 'Tag categorizing this checkpoint';

-- Add column descriptions for claim_dependencies table
COMMENT ON COLUMN claim_dependencies.created_at IS 'Timestamp when this dependency was created';
COMMENT ON COLUMN claim_dependencies.child_substep_id IS 'ID of the substep that depends on the parent';
COMMENT ON COLUMN claim_dependencies.parent_substep_id IS 'ID of the substep that must be completed first';
COMMENT ON COLUMN claim_dependencies.id IS 'Unique identifier for this dependency';

-- Add column descriptions for claim_substeps table
COMMENT ON COLUMN claim_substeps.planned_duration IS 'Expected duration for completing this substep';
COMMENT ON COLUMN claim_substeps.owner IS 'ID of the user responsible for this substep';
COMMENT ON COLUMN claim_substeps.claim_id IS 'ID of the claim this substep belongs to';
COMMENT ON COLUMN claim_substeps.id IS 'Unique identifier for this substep';
COMMENT ON COLUMN claim_substeps.attachments IS 'File attachments associated with this substep';
COMMENT ON COLUMN claim_substeps.updated_at IS 'Timestamp when this substep was last updated';
COMMENT ON COLUMN claim_substeps.created_at IS 'Timestamp when this substep was created';
COMMENT ON COLUMN claim_substeps.user_id IS 'ID of the user who owns this substep';
COMMENT ON COLUMN claim_substeps.alert_id IS 'ID of any alert associated with this substep';
COMMENT ON COLUMN claim_substeps.checklist IS 'JSON array of checklist items for this substep';
COMMENT ON COLUMN claim_substeps.ordering IS 'Order position of this substep within the claim';
COMMENT ON COLUMN claim_substeps.finished_at IS 'Timestamp when this substep was completed';
COMMENT ON COLUMN claim_substeps.started_at IS 'Timestamp when work on this substep began';
COMMENT ON COLUMN claim_substeps.status IS 'Current status of this substep';
COMMENT ON COLUMN claim_substeps.title IS 'Title or name of this substep';
COMMENT ON COLUMN claim_substeps.description IS 'Detailed description of this substep';