-- Add column descriptions for activation_events table
COMMENT ON COLUMN activation_events.loop_id IS 'ID of the loop that was activated';
COMMENT ON COLUMN activation_events.fingerprint IS 'Unique fingerprint identifying this activation';
COMMENT ON COLUMN activation_events.time_window IS 'Time window used for the activation decision';
COMMENT ON COLUMN activation_events.created_at IS 'Timestamp when the activation event was created';
COMMENT ON COLUMN activation_events.created_by IS 'ID of the user who triggered this activation';
COMMENT ON COLUMN activation_events.decision IS 'Decision data and reasoning stored as JSON';
COMMENT ON COLUMN activation_events.as_of IS 'Timestamp when the activation decision was made';
COMMENT ON COLUMN activation_events.event_id IS 'Unique identifier for this activation event';

-- Add column descriptions for adopting_entities table
COMMENT ON COLUMN adopting_entities.name IS 'Name of the adopting entity';
COMMENT ON COLUMN adopting_entities.entity_id IS 'Unique identifier for the entity';
COMMENT ON COLUMN adopting_entities.parent_id IS 'ID of the parent entity (for hierarchical structures)';
COMMENT ON COLUMN adopting_entities.kind IS 'Type or category of the adopting entity';

-- Add column descriptions for applied_arcs table
COMMENT ON COLUMN applied_arcs.item_id IS 'ID of the item the arc was applied to';
COMMENT ON COLUMN applied_arcs.applied_at IS 'Timestamp when the arc was applied';
COMMENT ON COLUMN applied_arcs.arc_type IS 'Type of arc that was applied';
COMMENT ON COLUMN applied_arcs.user_id IS 'ID of the user who applied this arc';
COMMENT ON COLUMN applied_arcs.id IS 'Unique identifier for this applied arc';
COMMENT ON COLUMN applied_arcs.level IS 'Level or intensity of the arc application';

-- Add column descriptions for audit_log table
COMMENT ON COLUMN audit_log.resource_type IS 'Type of resource that was modified';
COMMENT ON COLUMN audit_log.new_values IS 'New values after the change, stored as JSON';
COMMENT ON COLUMN audit_log.ip_address IS 'IP address of the user who made the change';
COMMENT ON COLUMN audit_log.action IS 'Type of action performed (create, update, delete, etc.)';
COMMENT ON COLUMN audit_log.id IS 'Unique identifier for this audit log entry';
COMMENT ON COLUMN audit_log.org_id IS 'ID of the organization this audit entry belongs to';
COMMENT ON COLUMN audit_log.created_at IS 'Timestamp when this audit entry was created';
COMMENT ON COLUMN audit_log.resource_id IS 'ID of the specific resource that was modified';
COMMENT ON COLUMN audit_log.user_id IS 'ID of the user who performed the action';
COMMENT ON COLUMN audit_log.old_values IS 'Previous values before the change, stored as JSON';
COMMENT ON COLUMN audit_log.user_agent IS 'Browser user agent string of the user who made the change';