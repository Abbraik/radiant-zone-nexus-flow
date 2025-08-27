-- Add descriptions for remaining tables

-- Deliberative system additions
COMMENT ON TABLE delib_scenario_outcomes IS 'Outcomes and impacts from deliberative scenario analysis';
COMMENT ON TABLE delib_scenarios IS 'Scenario definitions used in deliberative processes';

-- Document and knowledge management
COMMENT ON TABLE dossier_links IS 'Links and relationships between dossiers';
COMMENT ON TABLE dossier_versions IS 'Version history and changes for dossiers';

-- Data quality and events
COMMENT ON TABLE dq_events IS 'Data quality monitoring events and anomalies';

-- Entity and relationship management
COMMENT ON TABLE entity_links IS 'Links and relationships between governance entities';
COMMENT ON TABLE evaluations IS 'Evaluation results and assessments';
COMMENT ON TABLE execution_logs IS 'Detailed logs of system execution and processes';
COMMENT ON TABLE experiments IS 'Experimental interventions and their configurations';

-- Security and access control
COMMENT ON TABLE gate_stacks IS 'Hierarchical gate configurations for access control';
COMMENT ON TABLE guardrail_enforcements IS 'Records of guardrail policy enforcement actions';
COMMENT ON TABLE guardrail_policies IS 'Policy definitions for system guardrails';
COMMENT ON TABLE guardrails IS 'Active guardrail configurations and constraints';

-- Conflict resolution and harmonization
COMMENT ON TABLE harmonization_conflicts IS 'Detected conflicts requiring harmonization';
COMMENT ON TABLE harmonization_decisions IS 'Decisions made to resolve harmonization conflicts';

-- Planning and goal management
COMMENT ON TABLE horizon_goals IS 'Long-term strategic goals and planning horizons';
COMMENT ON TABLE hub_allocations IS 'Resource allocations across governance hubs';

-- Incident and monitoring
COMMENT ON TABLE incident_events IS 'Timeline of events within incident management';
COMMENT ON TABLE indicator_values IS 'Current and historical values of system indicators';
COMMENT ON TABLE indicators IS 'Registry of system performance and health indicators';
COMMENT ON TABLE ingestion_runs IS 'Data ingestion process execution records';

-- Action and intervention management
COMMENT ON TABLE interventions IS 'Planned and executed system interventions';

-- Knowledge and learning systems
COMMENT ON TABLE learning_hubs IS 'Distributed learning and knowledge sharing hubs';

-- Loop management and scoring
COMMENT ON TABLE loop_horizon_links IS 'Connections between loops and planning horizons';
COMMENT ON TABLE loop_scorecards IS 'Performance scorecards for governance loops';
COMMENT ON TABLE loop_scorecards_5c IS '5C framework version of loop scorecards';
COMMENT ON TABLE loop_tags IS 'Categorical tags and labels for governance loops';

-- Mandate and rule management
COMMENT ON TABLE mandate_rules_5c IS '5C framework version of mandate compliance rules';

-- Metadata and relationships
COMMENT ON TABLE meta_rels IS 'Metadata relationships and cross-references';
COMMENT ON TABLE metrics_summary IS 'Aggregated metrics and performance summaries';
COMMENT ON TABLE mode_events IS 'Events related to system mode changes and transitions';

-- Decision options and effects
COMMENT ON TABLE option_effects IS 'Predicted and observed effects of decision options';
COMMENT ON TABLE options IS 'Available decision options and alternatives';
COMMENT ON TABLE override_events IS 'Records of system override actions and justifications';

-- Participation and engagement
COMMENT ON TABLE participation_packs IS 'Structured participation bundles for stakeholder engagement';

-- Privacy and policy management
COMMENT ON TABLE pii_policies IS 'Personally Identifiable Information handling policies';
COMMENT ON TABLE pilots IS 'Pilot programs and experimental implementations';
COMMENT ON TABLE playbooks IS 'Operational playbooks and procedure guides';

-- Resource pre-positioning
COMMENT ON TABLE pre_position_orders IS 'Orders for pre-positioning resources and capabilities';
COMMENT ON TABLE prepositions IS 'Pre-positioned resource deployments and readiness status';

-- User management
COMMENT ON TABLE profiles IS 'Extended user profiles with additional metadata';

-- Reciprocity and exchange
COMMENT ON TABLE reciprocity_ledger IS 'Ledger tracking reciprocal exchanges and obligations';

-- 5C Framework extensions
COMMENT ON TABLE reflex_memory_5c IS '5C framework version of reflex memory patterns';

-- Relationship and ticketing
COMMENT ON TABLE rel_tickets IS 'Relationship management tickets and issues';

-- System tuning and optimization
COMMENT ON TABLE retune_approvals IS 'Approvals for system retuning and parameter changes';
COMMENT ON TABLE retune_suggestions IS 'Automated suggestions for system optimization';

-- Risk management
COMMENT ON TABLE risk_channels IS 'Risk transmission channels and pathways';

-- Scenario analysis
COMMENT ON TABLE scenario_results IS 'Results from scenario modeling and analysis';
COMMENT ON TABLE scenarios IS 'Scenario definitions for planning and testing';

-- Sharing and collaboration
COMMENT ON TABLE shares IS 'Resource sharing arrangements and agreements';
COMMENT ON TABLE signal_events IS 'Signal processing and detection events';

-- Project management
COMMENT ON TABLE sprints IS 'Sprint-based project management cycles';

-- 5C Framework SRT
COMMENT ON TABLE srt_windows_5c IS '5C framework version of System Response Time windows';

-- Standards and compliance
COMMENT ON TABLE standard_versions IS 'Version management for compliance standards';
COMMENT ON TABLE standards IS 'Regulatory and operational standards definitions';
COMMENT ON TABLE stress_tests IS 'System stress testing scenarios and results';

-- Structural governance components
COMMENT ON TABLE struct_auctions IS 'Governance structure auction mechanisms';
COMMENT ON TABLE struct_authority_sources IS 'Sources of authority within governance structures';
COMMENT ON TABLE struct_budget_envelopes IS 'Budget allocation envelopes for structural components';
COMMENT ON TABLE struct_conformance_checks IS 'Conformance validation checks for structures';
COMMENT ON TABLE struct_conformance_runs IS 'Execution of structural conformance validations';
COMMENT ON TABLE struct_deleg_edges IS 'Delegation edges in structural governance networks';
COMMENT ON TABLE struct_deleg_nodes IS 'Delegation nodes in governance hierarchies';
COMMENT ON TABLE struct_dossiers IS 'Structured dossiers for governance documentation';
COMMENT ON TABLE struct_events IS 'Events within structural governance processes';
COMMENT ON TABLE struct_handoffs IS 'Handoff processes between structural components';
COMMENT ON TABLE struct_mandate_checks IS 'Mandate validation within structural governance';
COMMENT ON TABLE struct_mesh_issues IS 'Issues and problems within governance mesh structures';
COMMENT ON TABLE struct_mesh_metrics IS 'Performance metrics for governance mesh operations';
COMMENT ON TABLE struct_permits IS 'Permit management within structural governance';
COMMENT ON TABLE struct_pricing_rules IS 'Pricing rules for structural governance services';
COMMENT ON TABLE struct_process_latency_hist IS 'Historical process latency measurements';
COMMENT ON TABLE struct_process_raci IS 'RACI matrix definitions for structural processes';
COMMENT ON TABLE struct_process_slas IS 'Service Level Agreements for structural processes';
COMMENT ON TABLE struct_process_steps IS 'Detailed steps within structural governance processes';
COMMENT ON TABLE struct_process_variance_series IS 'Process variance tracking over time';
COMMENT ON TABLE struct_runtime_artifacts IS 'Runtime artifacts generated by structural processes';
COMMENT ON TABLE struct_sessions IS 'Session management for structural governance interactions';
COMMENT ON TABLE struct_standards IS 'Standards specific to structural governance';

-- Structural adoptions and artifacts
COMMENT ON TABLE structural_adoptions IS 'Adoption tracking for structural governance changes';
COMMENT ON TABLE structural_artifacts IS 'Artifacts produced by structural governance processes';
COMMENT ON TABLE structural_components IS 'Components within structural governance frameworks';
COMMENT ON TABLE structural_dossiers IS 'Comprehensive structural governance documentation';

-- Template and task management
COMMENT ON TABLE substep_templates IS 'Reusable templates for claim substeps';
COMMENT ON TABLE task_artifacts IS 'Artifacts and outputs generated by tasks';
COMMENT ON TABLE task_assignments IS 'Task assignment tracking and management';
COMMENT ON TABLE task_checklist_items IS 'Checklist items within task workflows';
COMMENT ON TABLE task_events IS 'Event timeline for task lifecycle management';
COMMENT ON TABLE task_events_v2 IS 'Enhanced version of task event tracking';
COMMENT ON TABLE task_fingerprints IS 'Unique fingerprints for task identification';
COMMENT ON TABLE task_guardrails IS 'Guardrail constraints applied to specific tasks';
COMMENT ON TABLE task_links IS 'Links and dependencies between tasks';
COMMENT ON TABLE task_locks IS 'Locking mechanisms for task concurrency control';
COMMENT ON TABLE task_outputs IS 'Outputs and deliverables produced by tasks';
COMMENT ON TABLE task_payloads IS 'Payload data associated with task execution';
COMMENT ON TABLE task_reminders IS 'Reminder scheduling and notification for tasks';
COMMENT ON TABLE task_renewals IS 'Task renewal and extension management';
COMMENT ON TABLE task_sla_policies IS 'Service Level Agreement policies for tasks';
COMMENT ON TABLE task_templates IS 'Reusable templates for task creation';