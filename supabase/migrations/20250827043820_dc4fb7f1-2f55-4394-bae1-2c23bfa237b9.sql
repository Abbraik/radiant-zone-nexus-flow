-- Continue adding column descriptions to tables with most missing descriptions

-- retune_suggestions table
COMMENT ON COLUMN retune_suggestions.id IS 'Unique identifier for the retune suggestion';
COMMENT ON COLUMN retune_suggestions.loop_code IS 'Loop code this retune suggestion applies to';
COMMENT ON COLUMN retune_suggestions.indicator IS 'Indicator that triggered this retune suggestion';
COMMENT ON COLUMN retune_suggestions.current_params IS 'JSON object containing current controller parameters';
COMMENT ON COLUMN retune_suggestions.suggested_params IS 'JSON object containing suggested new parameters';
COMMENT ON COLUMN retune_suggestions.rationale IS 'Explanation for why this retune is suggested';
COMMENT ON COLUMN retune_suggestions.confidence IS 'Confidence score for this suggestion (0-1)';
COMMENT ON COLUMN retune_suggestions.impact_estimate IS 'Estimated impact of implementing this retune';
COMMENT ON COLUMN retune_suggestions.performance_gain IS 'Expected performance improvement from this retune';
COMMENT ON COLUMN retune_suggestions.risk_level IS 'Risk level associated with implementing this retune';
COMMENT ON COLUMN retune_suggestions.status IS 'Current status of the retune suggestion';
COMMENT ON COLUMN retune_suggestions.reviewed_by IS 'User who reviewed this suggestion';
COMMENT ON COLUMN retune_suggestions.reviewed_at IS 'Timestamp when this suggestion was reviewed';
COMMENT ON COLUMN retune_suggestions.implemented_by IS 'User who implemented this retune';
COMMENT ON COLUMN retune_suggestions.implemented_at IS 'Timestamp when this retune was implemented';
COMMENT ON COLUMN retune_suggestions.user_id IS 'User who created this retune suggestion';
COMMENT ON COLUMN retune_suggestions.created_at IS 'Timestamp when this suggestion was created';
COMMENT ON COLUMN retune_suggestions.updated_at IS 'Timestamp when this suggestion was last updated';

-- delib_dossiers table
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

-- struct_dossiers table
COMMENT ON COLUMN struct_dossiers.id IS 'Unique identifier for the structural dossier';
COMMENT ON COLUMN struct_dossiers.org_id IS 'Organization ID for multi-tenant data isolation';
COMMENT ON COLUMN struct_dossiers.session_id IS 'Reference to the structural session';
COMMENT ON COLUMN struct_dossiers.version IS 'Version number of this structural dossier';
COMMENT ON COLUMN struct_dossiers.title IS 'Title of the structural dossier';
COMMENT ON COLUMN struct_dossiers.decision_summary IS 'Summary of structural decisions made';
COMMENT ON COLUMN struct_dossiers.selected_option_ids IS 'Array of selected structural option IDs';
COMMENT ON COLUMN struct_dossiers.rejected_option_ids IS 'Array of rejected structural option IDs';
COMMENT ON COLUMN struct_dossiers.tradeoff_notes IS 'Notes about structural tradeoffs considered';
COMMENT ON COLUMN struct_dossiers.robustness_notes IS 'Notes about structural robustness analysis';
COMMENT ON COLUMN struct_dossiers.guardrails IS 'JSON array of structural guardrails applied';
COMMENT ON COLUMN struct_dossiers.mandate_path IS 'JSON array of structural mandate validation';
COMMENT ON COLUMN struct_dossiers.participation_plan IS 'JSON array of structural participation activities';
COMMENT ON COLUMN struct_dossiers.handoffs IS 'Array of structural handoff tasks created';
COMMENT ON COLUMN struct_dossiers.published_by IS 'User who published this structural dossier';
COMMENT ON COLUMN struct_dossiers.published_at IS 'Timestamp when this structural dossier was published';