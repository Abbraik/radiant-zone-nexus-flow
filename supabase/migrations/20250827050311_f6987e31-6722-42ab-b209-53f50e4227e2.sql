-- Continue with final batch of table descriptions

-- Add column descriptions for claims_5c table
COMMENT ON COLUMN claims_5c.pause_reason IS 'Reason why this 5C claim was paused';
COMMENT ON COLUMN claims_5c.mandate_status IS 'Authorization status for this 5C claim';
COMMENT ON COLUMN claims_5c.task_id IS 'ID of the 5C task this claim is for';
COMMENT ON COLUMN claims_5c.raci IS 'RACI matrix defining roles and responsibilities for 5C';
COMMENT ON COLUMN claims_5c.assignee IS 'ID of the user assigned to this 5C claim';
COMMENT ON COLUMN claims_5c.loop_id IS 'ID of the 5C loop this claim belongs to';
COMMENT ON COLUMN claims_5c.evidence IS 'Supporting evidence and documentation for 5C';
COMMENT ON COLUMN claims_5c.sprint_id IS 'ID of the sprint this 5C claim belongs to';
COMMENT ON COLUMN claims_5c.status IS 'Current status of this 5C claim';
COMMENT ON COLUMN claims_5c.id IS 'Unique identifier for this 5C claim';
COMMENT ON COLUMN claims_5c.started_at IS 'Timestamp when work on this 5C claim began';
COMMENT ON COLUMN claims_5c.finished_at IS 'Timestamp when this 5C claim was completed';
COMMENT ON COLUMN claims_5c.paused_at IS 'Timestamp when this 5C claim was paused';
COMMENT ON COLUMN claims_5c.last_checkpoint_at IS 'Timestamp of the most recent 5C checkpoint';
COMMENT ON COLUMN claims_5c.user_id IS 'ID of the user who owns this 5C claim';
COMMENT ON COLUMN claims_5c.created_at IS 'Timestamp when this 5C claim was created';
COMMENT ON COLUMN claims_5c.updated_at IS 'Timestamp when this 5C claim was last modified';
COMMENT ON COLUMN claims_5c.leverage IS 'Type of 5C leverage applied (N=None, P=Policy, S=Structural)';

-- Add column descriptions for compass_anchor_map table
COMMENT ON COLUMN compass_anchor_map.notes IS 'Additional notes about this compass anchor mapping';
COMMENT ON COLUMN compass_anchor_map.indicator_key IS 'Key identifying the indicator for this anchor';
COMMENT ON COLUMN compass_anchor_map.anchor IS 'Anchor point for this compass mapping';
COMMENT ON COLUMN compass_anchor_map.id IS 'Unique identifier for this anchor mapping';
COMMENT ON COLUMN compass_anchor_map.updated_at IS 'Timestamp when this anchor mapping was last updated';
COMMENT ON COLUMN compass_anchor_map.created_at IS 'Timestamp when this anchor mapping was created';
COMMENT ON COLUMN compass_anchor_map.user_id IS 'ID of the user who owns this anchor mapping';
COMMENT ON COLUMN compass_anchor_map.weight IS 'Weight or importance of this anchor mapping';
COMMENT ON COLUMN compass_anchor_map.loop_id IS 'ID of the loop this anchor mapping belongs to';

-- Add column descriptions for compass_weights table
COMMENT ON COLUMN compass_weights.user_id IS 'ID of the user who owns these compass weights';
COMMENT ON COLUMN compass_weights.updated_at IS 'Timestamp when these weights were last updated';
COMMENT ON COLUMN compass_weights.id IS 'Unique identifier for this compass weights record';
COMMENT ON COLUMN compass_weights.created_at IS 'Timestamp when these weights were created';
COMMENT ON COLUMN compass_weights.loop_id IS 'ID of the loop these weights apply to';
COMMENT ON COLUMN compass_weights.w_population IS 'Weight for population dimension in compass calculation';
COMMENT ON COLUMN compass_weights.w_domains IS 'Weight for domains dimension in compass calculation';
COMMENT ON COLUMN compass_weights.w_institutions IS 'Weight for institutions dimension in compass calculation';
COMMENT ON COLUMN compass_weights.w_legitimacy IS 'Weight for legitimacy dimension in compass calculation';

-- Add column descriptions for conformance_findings table
COMMENT ON COLUMN conformance_findings.run_id IS 'ID of the conformance run this finding belongs to';
COMMENT ON COLUMN conformance_findings.finding_id IS 'Unique identifier for this conformance finding';
COMMENT ON COLUMN conformance_findings.rule_id IS 'ID of the conformance rule that generated this finding';
COMMENT ON COLUMN conformance_findings.passed IS 'Whether this conformance check passed or failed';
COMMENT ON COLUMN conformance_findings.detail IS 'Additional details about this conformance finding';

-- Add column descriptions for conformance_rules table
COMMENT ON COLUMN conformance_rules.severity IS 'Severity level of this conformance rule';
COMMENT ON COLUMN conformance_rules.rule_title IS 'Title or name of this conformance rule';
COMMENT ON COLUMN conformance_rules.dossier_id IS 'ID of the dossier this rule applies to';
COMMENT ON COLUMN conformance_rules.rule_id IS 'Unique identifier for this conformance rule';
COMMENT ON COLUMN conformance_rules.created_at IS 'Timestamp when this rule was created';
COMMENT ON COLUMN conformance_rules.rule_expr IS 'Expression defining the conformance rule logic';
COMMENT ON COLUMN conformance_rules.std_ver_id IS 'ID of the standard version this rule belongs to';

-- Add column descriptions for conformance_runs table
COMMENT ON COLUMN conformance_runs.dossier_id IS 'ID of the dossier this conformance run evaluates';
COMMENT ON COLUMN conformance_runs.finished_at IS 'Timestamp when this conformance run completed';
COMMENT ON COLUMN conformance_runs.summary IS 'Summary results of this conformance run';
COMMENT ON COLUMN conformance_runs.status IS 'Current status of this conformance run';
COMMENT ON COLUMN conformance_runs.run_id IS 'Unique identifier for this conformance run';
COMMENT ON COLUMN conformance_runs.started_at IS 'Timestamp when this conformance run started';

-- Add column descriptions for conformance_targets table
COMMENT ON COLUMN conformance_targets.std_ver_id IS 'ID of the standard version this target belongs to';
COMMENT ON COLUMN conformance_targets.expected IS 'Expected values or outcomes for this conformance target';
COMMENT ON COLUMN conformance_targets.endpoint IS 'API endpoint or system interface for this target';
COMMENT ON COLUMN conformance_targets.target_kind IS 'Type or category of conformance target';
COMMENT ON COLUMN conformance_targets.kpi_key IS 'Key performance indicator associated with this target';
COMMENT ON COLUMN conformance_targets.target_id IS 'Unique identifier for this conformance target';

-- Add column descriptions for consent_cells table
COMMENT ON COLUMN consent_cells.region IS 'Geographic region for this consent cell';
COMMENT ON COLUMN consent_cells.consent_score IS 'Measured consent score for this cell';
COMMENT ON COLUMN consent_cells.sources IS 'JSON object containing data sources for this consent measurement';
COMMENT ON COLUMN consent_cells.as_of IS 'Date this consent measurement represents';
COMMENT ON COLUMN consent_cells.user_id IS 'ID of the user who owns this consent cell';
COMMENT ON COLUMN consent_cells.cell_id IS 'Unique identifier for this consent cell';
COMMENT ON COLUMN consent_cells.domain IS 'Policy or service domain for this consent cell';
COMMENT ON COLUMN consent_cells.created_at IS 'Timestamp when this consent cell was created';

-- Add column descriptions for controller_tunings table
COMMENT ON COLUMN controller_tunings.created_at IS 'Timestamp when this controller tuning was created';
COMMENT ON COLUMN controller_tunings.user_id IS 'ID of the user who owns this tuning';
COMMENT ON COLUMN controller_tunings.effective_from IS 'Timestamp when this tuning becomes effective';
COMMENT ON COLUMN controller_tunings.oscillation_delta IS 'Change in oscillation after this tuning';
COMMENT ON COLUMN controller_tunings.rmse_delta IS 'Change in root mean square error after this tuning';
COMMENT ON COLUMN controller_tunings.after IS 'Controller parameter values after tuning';
COMMENT ON COLUMN controller_tunings.before IS 'Controller parameter values before tuning';
COMMENT ON COLUMN controller_tunings.id IS 'Unique identifier for this controller tuning';
COMMENT ON COLUMN controller_tunings.rationale IS 'Reason for making this controller tuning';
COMMENT ON COLUMN controller_tunings.indicator IS 'Indicator being controlled by this tuning';
COMMENT ON COLUMN controller_tunings.loop_code IS 'Code of the loop this tuning applies to';