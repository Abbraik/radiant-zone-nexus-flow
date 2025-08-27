-- Add comprehensive table descriptions for better navigation (fixed)

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

-- Check if other delib tables exist and add descriptions
DO $$
DECLARE
    tbl_name text;
    tbl_names text[] := ARRAY[
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
    FOR i IN 1..array_length(tbl_names, 1) LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tbl_names[i]) THEN
            EXECUTE format('COMMENT ON TABLE %I IS %L', tbl_names[i], descriptions[i]);
        END IF;
    END LOOP;
END $$;

-- Add descriptions for any remaining tables that might exist
DO $$
DECLARE
    remaining_tables text[] := ARRAY[
        'dq_status', 'indicator_readings', 'indicator_registry', 'incidents',
        'loop_edges', 'loop_nodes', 'loop_shared_nodes', 'loop_signal_scores',
        'loop_versions', 'loops', 'mandate_rules', 'normalized_observations',
        'option_sets', 'raw_observations', 'reflex_memory', 'shared_nodes',
        'source_registry', 'sprint_tasks', 'srt_windows', 'tasks', 'tasks_5c',
        'tasks_v2', 'tri_events', 'tri_events_5c', 'user_roles'
    ];
    remaining_descriptions text[] := ARRAY[
        'Data quality status tracking for indicators and sources',
        'Historical indicator readings with timestamps and values',
        'Registry of all indicators with metadata and loop mappings',
        'Incident tracking and management records',
        'Edges/connections between nodes in governance loops',
        'Nodes representing components within governance loops',
        'Shared nodes that participate in multiple loops',
        'Signal scores computed for loops over time windows',
        'Version history of loop configurations and changes',
        'Main governance loops with metadata and configuration',
        'Rules defining mandate requirements and compliance',
        'Normalized observations after processing raw data',
        'Sets of decision options for evaluation processes',
        'Raw observation data before processing and normalization',
        'Reflex memory for rapid response patterns',
        'Shared node library for reuse across loops',
        'Registry of data sources with connection details',
        'Sprint-based task management and tracking',
        'SRT (System Response Time) monitoring windows',
        'Main task management table for governance activities',
        '5C framework version of task management',
        'Version 2 of task management with enhanced features',
        'TRI (Tension-Response-Impact) event logging',
        '5C framework version of TRI event management',
        'User roles and permissions management'
    ];
BEGIN
    FOR i IN 1..array_length(remaining_tables, 1) LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = remaining_tables[i]) THEN
            EXECUTE format('COMMENT ON TABLE %I IS %L', remaining_tables[i], remaining_descriptions[i]);
        END IF;
    END LOOP;
END $$;