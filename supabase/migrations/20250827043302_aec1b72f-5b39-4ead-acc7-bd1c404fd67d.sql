-- Continue adding column descriptions to remaining tables

-- claim_substeps table
COMMENT ON COLUMN claim_substeps.id IS 'Unique identifier for the claim substep';
COMMENT ON COLUMN claim_substeps.claim_id IS 'Foreign key reference to the parent claim';
COMMENT ON COLUMN claim_substeps.title IS 'Title or name of the substep';
COMMENT ON COLUMN claim_substeps.description IS 'Detailed description of what this substep involves';
COMMENT ON COLUMN claim_substeps.status IS 'Current status of the substep (pending, in_progress, completed, etc.)';
COMMENT ON COLUMN claim_substeps.ordering IS 'Order position of this substep within the claim';
COMMENT ON COLUMN claim_substeps.owner IS 'User ID of the person responsible for this substep';
COMMENT ON COLUMN claim_substeps.planned_duration IS 'Expected time duration to complete this substep';
COMMENT ON COLUMN claim_substeps.started_at IS 'Timestamp when work on this substep began';
COMMENT ON COLUMN claim_substeps.finished_at IS 'Timestamp when this substep was completed';
COMMENT ON COLUMN claim_substeps.checklist IS 'JSON array of checklist items for this substep';
COMMENT ON COLUMN claim_substeps.attachments IS 'JSON array of file attachments related to this substep';
COMMENT ON COLUMN claim_substeps.alert_id IS 'Optional reference to any alert associated with this substep';
COMMENT ON COLUMN claim_substeps.user_id IS 'User who created this substep';
COMMENT ON COLUMN claim_substeps.created_at IS 'Timestamp when this substep was created';
COMMENT ON COLUMN claim_substeps.updated_at IS 'Timestamp when this substep was last updated';

-- claims table
COMMENT ON COLUMN claims.id IS 'Unique identifier for the claim';
COMMENT ON COLUMN claims.task_id IS 'Foreign key reference to the associated task';
COMMENT ON COLUMN claims.loop_id IS 'Foreign key reference to the loop this claim belongs to';
COMMENT ON COLUMN claims.assignee IS 'User ID of the person assigned to this claim';
COMMENT ON COLUMN claims.raci IS 'JSON object defining RACI (Responsible, Accountable, Consulted, Informed) roles';
COMMENT ON COLUMN claims.leverage IS 'Type of leverage being applied (N, P, S)';
COMMENT ON COLUMN claims.mandate_status IS 'Status of mandate approval (allowed, warning_required, blocked)';
COMMENT ON COLUMN claims.evidence IS 'JSON object containing evidence and supporting documentation';
COMMENT ON COLUMN claims.sprint_id IS 'Optional reference to associated sprint';
COMMENT ON COLUMN claims.status IS 'Current status of the claim (draft, active, paused, done, blocked)';
COMMENT ON COLUMN claims.started_at IS 'Timestamp when work on this claim began';
COMMENT ON COLUMN claims.finished_at IS 'Timestamp when this claim was completed';
COMMENT ON COLUMN claims.paused_at IS 'Timestamp when this claim was paused';
COMMENT ON COLUMN claims.pause_reason IS 'Reason why the claim was paused';
COMMENT ON COLUMN claims.last_checkpoint_at IS 'Timestamp of the last checkpoint for this claim';
COMMENT ON COLUMN claims.user_id IS 'User who created this claim';
COMMENT ON COLUMN claims.created_at IS 'Timestamp when this claim was created';
COMMENT ON COLUMN claims.updated_at IS 'Timestamp when this claim was last updated';

-- claims_5c table
COMMENT ON COLUMN claims_5c.id IS 'Unique identifier for the 5C claim';
COMMENT ON COLUMN claims_5c.task_id IS 'Foreign key reference to the associated 5C task';
COMMENT ON COLUMN claims_5c.loop_id IS 'Foreign key reference to the 5C loop this claim belongs to';
COMMENT ON COLUMN claims_5c.assignee IS 'User ID of the person assigned to this 5C claim';
COMMENT ON COLUMN claims_5c.raci IS 'JSON object defining RACI roles for 5C framework';
COMMENT ON COLUMN claims_5c.leverage IS 'Type of leverage being applied in 5C context (N, P, S)';
COMMENT ON COLUMN claims_5c.mandate_status IS 'Status of mandate approval in 5C framework';
COMMENT ON COLUMN claims_5c.evidence IS 'JSON object containing 5C-specific evidence and documentation';
COMMENT ON COLUMN claims_5c.sprint_id IS 'Optional reference to associated 5C sprint';
COMMENT ON COLUMN claims_5c.status IS 'Current status of the 5C claim';
COMMENT ON COLUMN claims_5c.started_at IS 'Timestamp when work on this 5C claim began';
COMMENT ON COLUMN claims_5c.finished_at IS 'Timestamp when this 5C claim was completed';
COMMENT ON COLUMN claims_5c.paused_at IS 'Timestamp when this 5C claim was paused';
COMMENT ON COLUMN claims_5c.pause_reason IS 'Reason why the 5C claim was paused';
COMMENT ON COLUMN claims_5c.last_checkpoint_at IS 'Timestamp of the last checkpoint for this 5C claim';
COMMENT ON COLUMN claims_5c.user_id IS 'User who created this 5C claim';
COMMENT ON COLUMN claims_5c.created_at IS 'Timestamp when this 5C claim was created';
COMMENT ON COLUMN claims_5c.updated_at IS 'Timestamp when this 5C claim was last updated';

-- compass_anchor_map table
COMMENT ON COLUMN compass_anchor_map.id IS 'Unique identifier for the compass anchor mapping';
COMMENT ON COLUMN compass_anchor_map.loop_id IS 'Foreign key reference to the associated loop';
COMMENT ON COLUMN compass_anchor_map.indicator_key IS 'Key identifying the specific indicator';
COMMENT ON COLUMN compass_anchor_map.anchor IS 'The compass anchor point this indicator maps to';
COMMENT ON COLUMN compass_anchor_map.weight IS 'Weighting factor for this indicator in compass calculations';
COMMENT ON COLUMN compass_anchor_map.notes IS 'Additional notes about this anchor mapping';
COMMENT ON COLUMN compass_anchor_map.user_id IS 'User who created this anchor mapping';
COMMENT ON COLUMN compass_anchor_map.created_at IS 'Timestamp when this mapping was created';
COMMENT ON COLUMN compass_anchor_map.updated_at IS 'Timestamp when this mapping was last updated';

-- compass_snapshots table
COMMENT ON COLUMN compass_snapshots.snap_id IS 'Unique identifier for the compass snapshot';
COMMENT ON COLUMN compass_snapshots.loop_id IS 'Foreign key reference to the loop this snapshot belongs to';
COMMENT ON COLUMN compass_snapshots.as_of IS 'Date this snapshot represents';
COMMENT ON COLUMN compass_snapshots.ci IS 'Compass Index value for this snapshot';
COMMENT ON COLUMN compass_snapshots.tri IS 'JSON object containing TRI (Trust, Reliability, Integrity) values';
COMMENT ON COLUMN compass_snapshots.drift IS 'JSON object containing drift measurements';
COMMENT ON COLUMN compass_snapshots.consent_avg IS 'Average consent score for this snapshot';
COMMENT ON COLUMN compass_snapshots.user_id IS 'User who created this snapshot';
COMMENT ON COLUMN compass_snapshots.created_at IS 'Timestamp when this snapshot was created';