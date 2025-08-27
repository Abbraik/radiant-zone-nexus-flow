-- Add column descriptions for tables with their actual column structure

-- retune_suggestions table (actual columns)
COMMENT ON COLUMN retune_suggestions.id IS 'Unique identifier for the retune suggestion';
COMMENT ON COLUMN retune_suggestions.loop_id IS 'Foreign key reference to the loop this retune suggestion applies to';
COMMENT ON COLUMN retune_suggestions.user_id IS 'User who created this retune suggestion';
COMMENT ON COLUMN retune_suggestions.suggestion_type IS 'Type of retune suggestion (e.g., parameter, threshold, control)';
COMMENT ON COLUMN retune_suggestions.title IS 'Title or name of the retune suggestion';
COMMENT ON COLUMN retune_suggestions.description IS 'Detailed description of the retune suggestion';
COMMENT ON COLUMN retune_suggestions.rationale IS 'Explanation for why this retune is suggested';
COMMENT ON COLUMN retune_suggestions.risk_score IS 'Risk score for implementing this suggestion (0-1)';
COMMENT ON COLUMN retune_suggestions.confidence IS 'Confidence score for this suggestion (0-1)';
COMMENT ON COLUMN retune_suggestions.expected_improvement IS 'JSON object containing expected improvements from this retune';
COMMENT ON COLUMN retune_suggestions.proposed_changes IS 'JSON object containing the proposed parameter changes';
COMMENT ON COLUMN retune_suggestions.false_positive_risk IS 'Risk of this suggestion being a false positive (0-1)';
COMMENT ON COLUMN retune_suggestions.impact_level IS 'Expected impact level (low, medium, high)';
COMMENT ON COLUMN retune_suggestions.status IS 'Current status of the retune suggestion (pending, approved, rejected, implemented)';
COMMENT ON COLUMN retune_suggestions.reviewed_by IS 'User who reviewed this suggestion';
COMMENT ON COLUMN retune_suggestions.reviewed_at IS 'Timestamp when this suggestion was reviewed';
COMMENT ON COLUMN retune_suggestions.created_at IS 'Timestamp when this suggestion was created';
COMMENT ON COLUMN retune_suggestions.updated_at IS 'Timestamp when this suggestion was last updated';

-- delib_dossiers table (correct columns)
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

-- antic_pre_position_orders table (correct columns)  
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