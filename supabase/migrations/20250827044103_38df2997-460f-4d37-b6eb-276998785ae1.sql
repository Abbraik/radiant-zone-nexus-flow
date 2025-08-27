-- Continue with delib_dossiers and antic_pre_position_orders tables

-- delib_dossiers table (verified columns)
COMMENT ON COLUMN delib_dossiers.id IS 'Unique identifier for the deliberation dossier';
COMMENT ON COLUMN delib_dossiers.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN delib_dossiers.session_id IS 'Reference to the deliberation session';
COMMENT ON COLUMN delib_dossiers.version IS 'Version number of this dossier';
COMMENT ON COLUMN delib_dossiers.title IS 'Title of the deliberation dossier';
COMMENT ON COLUMN delib_dossiers.decision_summary IS 'Summary of the decision made';
COMMENT ON COLUMN delib_dossiers.selected_option_ids IS 'Array of selected option IDs';
COMMENT ON COLUMN delib_dossiers.rejected_option_ids IS 'Array of rejected option IDs';
COMMENT ON COLUMN delib_dossiers.tradeoff_notes IS 'Notes about tradeoffs considered';
COMMENT ON COLUMN delib_dossiers.robustness_notes IS 'Notes about robustness analysis';
COMMENT ON COLUMN delib_dossiers.guardrails IS 'JSON array of guardrails applied';
COMMENT ON COLUMN delib_dossiers.mandate_path IS 'JSON array of mandate validation steps';
COMMENT ON COLUMN delib_dossiers.participation_plan IS 'JSON array of participation activities';
COMMENT ON COLUMN delib_dossiers.handoffs IS 'Array of handoff tasks created';
COMMENT ON COLUMN delib_dossiers.published_by IS 'User who published this dossier';
COMMENT ON COLUMN delib_dossiers.published_at IS 'Timestamp when this dossier was published';

-- antic_pre_position_orders table (verified columns)  
COMMENT ON COLUMN antic_pre_position_orders.id IS 'Unique identifier for the pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN antic_pre_position_orders.kind IS 'Kind of pre-position order (resource, regulatory, comms)';
COMMENT ON COLUMN antic_pre_position_orders.title IS 'Title of the pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.items IS 'JSON array of items included in this order';
COMMENT ON COLUMN antic_pre_position_orders.suppliers IS 'Array of supplier names for this order';
COMMENT ON COLUMN antic_pre_position_orders.sla IS 'Service level agreement for delivery';
COMMENT ON COLUMN antic_pre_position_orders.cost_ceiling IS 'Maximum cost limit for this order';
COMMENT ON COLUMN antic_pre_position_orders.readiness_score IS 'Readiness score for deployment (0-1)';
COMMENT ON COLUMN antic_pre_position_orders.shelf_life_days IS 'Number of days this order remains valid';
COMMENT ON COLUMN antic_pre_position_orders.status IS 'Current status of the pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.created_by IS 'User who created this pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.created_at IS 'Timestamp when this order was created';
COMMENT ON COLUMN antic_pre_position_orders.updated_at IS 'Timestamp when this order was last updated';