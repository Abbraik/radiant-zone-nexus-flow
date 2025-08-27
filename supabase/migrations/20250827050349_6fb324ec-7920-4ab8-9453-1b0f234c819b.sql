-- Final batch of table descriptions for remaining tables

-- Add column descriptions for de_bands_5c table
COMMENT ON COLUMN de_bands_5c.smoothing_alpha IS 'Smoothing factor for exponential weighted moving average in 5C';
COMMENT ON COLUMN de_bands_5c.indicator IS 'Name of the 5C indicator this band monitors';
COMMENT ON COLUMN de_bands_5c.updated_at IS 'Timestamp when this 5C band was last modified';
COMMENT ON COLUMN de_bands_5c.updated_by IS 'ID of the user who last updated this 5C band';
COMMENT ON COLUMN de_bands_5c.id IS 'Unique identifier for this 5C DE band';
COMMENT ON COLUMN de_bands_5c.loop_id IS 'ID of the 5C loop this band applies to';
COMMENT ON COLUMN de_bands_5c.lower_bound IS 'Lower threshold for the 5C indicator';
COMMENT ON COLUMN de_bands_5c.upper_bound IS 'Upper threshold for the 5C indicator';
COMMENT ON COLUMN de_bands_5c.asymmetry IS 'Asymmetry factor for the 5C band boundaries';
COMMENT ON COLUMN de_bands_5c.user_id IS 'ID of the user who created this 5C DE band';
COMMENT ON COLUMN de_bands_5c.notes IS 'Additional notes about this 5C DE band configuration';
COMMENT ON COLUMN de_bands_5c.created_at IS 'Timestamp when this 5C DE band was created';

-- Add column descriptions for decision_records table
COMMENT ON COLUMN decision_records.user_id IS 'ID of the user who owns this decision record';
COMMENT ON COLUMN decision_records.created_by IS 'ID of the user who created this decision record';
COMMENT ON COLUMN decision_records.id IS 'Unique identifier for this decision record';
COMMENT ON COLUMN decision_records.attachments IS 'File attachments associated with this decision';
COMMENT ON COLUMN decision_records.rationale IS 'Reasoning and justification for this decision';
COMMENT ON COLUMN decision_records.task_id IS 'ID of the task this decision relates to';
COMMENT ON COLUMN decision_records.option_set_id IS 'ID of the option set evaluated for this decision';
COMMENT ON COLUMN decision_records.created_at IS 'Timestamp when this decision record was created';

-- Add column descriptions for delib_constraints table
COMMENT ON COLUMN delib_constraints.active IS 'Whether this deliberation constraint is currently active';
COMMENT ON COLUMN delib_constraints.session_id IS 'ID of the deliberation session this constraint applies to';
COMMENT ON COLUMN delib_constraints.label IS 'Human-readable label for this constraint';
COMMENT ON COLUMN delib_constraints.id IS 'Unique identifier for this deliberation constraint';
COMMENT ON COLUMN delib_constraints.org_id IS 'ID of the organization this constraint belongs to';

-- Add remaining deliberation table descriptions
COMMENT ON TABLE delib_criteria IS 'Criteria used in deliberation sessions for decision evaluation';
COMMENT ON TABLE delib_options IS 'Options or alternatives considered in deliberation sessions';
COMMENT ON TABLE delib_scores IS 'Scores assigned to options against criteria in deliberation';
COMMENT ON TABLE delib_sessions IS 'Active deliberation sessions for complex decision making';
COMMENT ON TABLE delib_frontier IS 'Pareto frontier analysis results from deliberation';
COMMENT ON TABLE delib_mandate_checks IS 'Authorization and mandate validation in deliberation';
COMMENT ON TABLE delib_guardrails IS 'Safety and compliance guardrails for deliberation outcomes';
COMMENT ON TABLE delib_participation IS 'Stakeholder participation tracking in deliberation';
COMMENT ON TABLE delib_dossiers IS 'Completed deliberation results and decision packages';
COMMENT ON TABLE delib_handoffs IS 'Task handoffs resulting from deliberation decisions';
COMMENT ON TABLE delib_events IS 'Event log for deliberation session activities';

-- Add table-level comments for key system tables
COMMENT ON TABLE band_crossings IS 'Records when indicators cross DE band thresholds';
COMMENT ON TABLE cascades IS 'Defines cascade relationships between control loops';
COMMENT ON TABLE breach_events IS 'Records when indicators breach critical thresholds';
COMMENT ON TABLE claims IS 'Work claims on tasks within control loops';
COMMENT ON TABLE de_bands IS 'Dynamic equilibrium bands for loop indicators';
COMMENT ON TABLE compass_snapshots IS 'Point-in-time measurements of system compass alignment';
COMMENT ON TABLE activation_events IS 'Records of system activation decisions and triggers';

-- Add comments for anticipatory system tables
COMMENT ON TABLE antic_scenarios IS 'Scenario definitions for anticipatory modeling';
COMMENT ON TABLE antic_trigger_rules IS 'Rules that trigger anticipatory actions';
COMMENT ON TABLE antic_watchpoints IS 'Monitoring points for early warning systems';
COMMENT ON TABLE antic_buffers IS 'Resource and capacity buffers for resilience';
COMMENT ON TABLE antic_backtests IS 'Historical validation of anticipatory rules';

-- Add comments for conformance and structural tables
COMMENT ON TABLE conformance_rules IS 'Rules for checking compliance with standards';
COMMENT ON TABLE conformance_runs IS 'Executions of conformance checking processes';
COMMENT ON TABLE conformance_findings IS 'Results from conformance rule evaluations';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail of system changes';

-- Add comments for claims and substeps
COMMENT ON TABLE claim_substeps IS 'Individual work steps within larger claims';
COMMENT ON TABLE claim_dependencies IS 'Dependencies between claim substeps';
COMMENT ON TABLE claim_checkpoints IS 'Progress checkpoints within claim execution';

-- Add comments for compass and navigation
COMMENT ON TABLE compass_weights IS 'Weighting factors for compass dimension calculations';
COMMENT ON TABLE compass_anchor_map IS 'Mapping of indicators to compass anchor points';
COMMENT ON TABLE controller_tunings IS 'Parameter adjustments for system controllers';