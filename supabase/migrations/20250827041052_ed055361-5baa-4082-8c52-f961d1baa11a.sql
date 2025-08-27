-- Add comprehensive table descriptions for better navigation

-- Core system tables
COMMENT ON TABLE activation_events IS 'Records of loop activation events with decision fingerprints and time windows';
COMMENT ON TABLE activation_overrides IS 'Manual overrides for automatic activation decisions, requiring approval';
COMMENT ON TABLE actuation_attempts IS 'Log of attempts to actuate system changes with success/failure tracking';
COMMENT ON TABLE adopting_entities IS 'Hierarchical entities that can adopt and implement governance changes';
COMMENT ON TABLE adoption_events IS 'Timeline of adoption process events and milestones';

-- Anticipatory governance system
COMMENT ON TABLE antic_activation_events IS 'Anticipatory system activation events triggered by watchpoints';
COMMENT ON TABLE antic_backtests IS 'Historical backtesting results for anticipatory trigger rules';
COMMENT ON TABLE antic_buffers IS 'Buffer capacity tracking for resilience management';
COMMENT ON TABLE antic_ews_components IS 'Early Warning System components with weighted indicators';
COMMENT ON TABLE antic_geo_sentinels IS 'Geographic sentinel monitoring points for spatial risk assessment';
COMMENT ON TABLE antic_pre_position_orders IS 'Pre-positioned resource orders for rapid deployment';
COMMENT ON TABLE antic_scenario_results IS 'Results from scenario modeling and stress testing';
COMMENT ON TABLE antic_scenarios IS 'Defined scenarios for anticipatory planning and testing';
COMMENT ON TABLE antic_trigger_firings IS 'Log of when anticipatory triggers have fired';
COMMENT ON TABLE antic_trigger_rules IS 'Rules that define when anticipatory actions should trigger';
COMMENT ON TABLE antic_watchpoints IS 'Monitoring points for early warning and risk detection';

-- Application and task management
COMMENT ON TABLE app_tasks_queue IS 'Task queue for cross-capacity coordination and handoffs';
COMMENT ON TABLE applied_arcs IS 'Governance arcs applied to specific items at different levels';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all system actions and changes';

-- Monitoring and thresholds
COMMENT ON TABLE band_crossings IS 'Records when indicators cross defined operational bands';
COMMENT ON TABLE band_crossings_5c IS '5C framework version of band crossing events';
COMMENT ON TABLE band_weight_changes IS 'History of changes to band weighting configurations';
COMMENT ON TABLE breach_events IS 'Critical threshold breach events requiring attention';

-- Loop relationships
COMMENT ON TABLE cascades IS 'Cascade relationships between different governance loops';

-- Claims management system
COMMENT ON TABLE claim_checkpoints IS 'Progress checkpoints within claim execution';
COMMENT ON TABLE claim_dependencies IS 'Dependencies between claim substeps for sequencing';
COMMENT ON TABLE claim_substeps IS 'Detailed substeps that make up claim execution plans';
COMMENT ON TABLE claims IS 'Main claims for loop interventions with leverage levels';
COMMENT ON TABLE claims_5c IS '5C framework version of claims management';

-- Navigation and compass system  
COMMENT ON TABLE compass_anchor_map IS 'Mapping between indicators and compass anchor points';
COMMENT ON TABLE compass_snapshots IS 'Point-in-time snapshots of compass readings and drift';
COMMENT ON TABLE compass_weights IS 'Weighting configuration for compass calculation components';

-- Compliance and conformance
COMMENT ON TABLE conformance_findings IS 'Results from conformance rule evaluation';
COMMENT ON TABLE conformance_rules IS 'Rules for checking compliance against standards';
COMMENT ON TABLE conformance_runs IS 'Execution runs of conformance checking processes';
COMMENT ON TABLE conformance_targets IS 'Targets and thresholds for conformance evaluation';

-- Consent and participation
COMMENT ON TABLE consent_cells IS 'Geographic cells tracking consent and participation levels';

-- System tuning and configuration
COMMENT ON TABLE controller_tunings IS 'Historical changes to system controller parameters';

-- Dynamic Equilibrium (DE) system
COMMENT ON TABLE de_bands IS 'Dynamic equilibrium bands defining acceptable operating ranges';
COMMENT ON TABLE de_bands_5c IS '5C framework version of DE bands configuration';

-- Decision tracking
COMMENT ON TABLE decision_records IS 'Formal records of decisions made with rationale';

-- Deliberative governance system
COMMENT ON TABLE delib_constraints IS 'Constraints applied during deliberative processes';

-- Add more comments for remaining delib_ tables that might exist
DO $$
DECLARE
    table_name text;
    table_names text[] := ARRAY[
        'delib_criteria', 'delib_options', 'delib_scores', 'delib_events',
        'delib_frontier', 'delib_mandate_checks', 'delib_guardrails',
        'delib_participation', 'delib_dossiers', 'delib_handoffs', 'delib_sessions'
    ];
    descriptions text[] := ARRAY[
        'Evaluation criteria used in deliberative decision processes',
        'Available options being evaluated in deliberative processes', 
        'Scores assigned to options against specific criteria',
        'Timeline of events during deliberative processes',
        'Pareto frontier analysis results for multi-objective decisions',
        'Mandate compliance checks for deliberative outcomes',
        'Guardrails and constraints for deliberative processes',
        'Stakeholder participation tracking in deliberative processes',
        'Published decision dossiers from deliberative processes',
        'Handoff tasks generated from deliberative outcomes',
        'Deliberative decision-making sessions and their state'
    ];
BEGIN
    FOR i IN 1..array_length(table_names, 1) LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_names[i] AND table_schema = 'public') THEN
            EXECUTE format('COMMENT ON TABLE %I IS %L', table_names[i], descriptions[i]);
        END IF;
    END LOOP;
END $$;