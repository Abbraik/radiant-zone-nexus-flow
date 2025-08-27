-- Continue with more table descriptions

-- Add column descriptions for antic_geo_sentinels table
COMMENT ON COLUMN antic_geo_sentinels.created_at IS 'Timestamp when this geo sentinel was created';
COMMENT ON COLUMN antic_geo_sentinels.value IS 'Current value or measurement for this geo location';
COMMENT ON COLUMN antic_geo_sentinels.org_id IS 'ID of the organization this geo sentinel belongs to';
COMMENT ON COLUMN antic_geo_sentinels.id IS 'Unique identifier for this geo sentinel';
COMMENT ON COLUMN antic_geo_sentinels.cell_id IS 'Geographic cell identifier for this sentinel';
COMMENT ON COLUMN antic_geo_sentinels.label IS 'Optional human-readable label for this location';

-- Add column descriptions for antic_pre_position_orders table
COMMENT ON COLUMN antic_pre_position_orders.shelf_life_days IS 'Number of days this pre-position order remains valid';
COMMENT ON COLUMN antic_pre_position_orders.sla IS 'Service level agreement for this order';
COMMENT ON COLUMN antic_pre_position_orders.kind IS 'Type of pre-position order (resource, regulatory, comms)';
COMMENT ON COLUMN antic_pre_position_orders.title IS 'Title or name of this pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.created_by IS 'ID of the user who created this order';
COMMENT ON COLUMN antic_pre_position_orders.status IS 'Current status of this pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.suppliers IS 'Array of supplier names for this order';
COMMENT ON COLUMN antic_pre_position_orders.id IS 'Unique identifier for this pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.org_id IS 'ID of the organization this order belongs to';
COMMENT ON COLUMN antic_pre_position_orders.created_at IS 'Timestamp when this order was created';
COMMENT ON COLUMN antic_pre_position_orders.items IS 'JSON object containing order items and specifications';
COMMENT ON COLUMN antic_pre_position_orders.readiness_score IS 'Score indicating how ready this order is for deployment';
COMMENT ON COLUMN antic_pre_position_orders.cost_ceiling IS 'Maximum cost limit for this pre-position order';
COMMENT ON COLUMN antic_pre_position_orders.updated_at IS 'Timestamp when this order was last updated';

-- Add column descriptions for antic_scenario_results table
COMMENT ON COLUMN antic_scenario_results.notes IS 'Additional notes about this scenario result';
COMMENT ON COLUMN antic_scenario_results.with_mitigation_breach_prob IS 'Probability of breach with mitigation measures';
COMMENT ON COLUMN antic_scenario_results.affected_loops IS 'Array of loop codes affected by this scenario';
COMMENT ON COLUMN antic_scenario_results.without_mitigation_breach_prob IS 'Probability of breach without mitigation';
COMMENT ON COLUMN antic_scenario_results.mitigation_delta IS 'Effectiveness of mitigation measures';
COMMENT ON COLUMN antic_scenario_results.created_at IS 'Timestamp when this result was created';
COMMENT ON COLUMN antic_scenario_results.created_by IS 'ID of the user who created this result';
COMMENT ON COLUMN antic_scenario_results.scenario_id IS 'ID of the scenario this result relates to';
COMMENT ON COLUMN antic_scenario_results.org_id IS 'ID of the organization this result belongs to';
COMMENT ON COLUMN antic_scenario_results.id IS 'Unique identifier for this scenario result';

-- Add column descriptions for antic_scenarios table
COMMENT ON COLUMN antic_scenarios.target_loops IS 'Array of loop codes this scenario targets';
COMMENT ON COLUMN antic_scenarios.id IS 'Unique identifier for this scenario';
COMMENT ON COLUMN antic_scenarios.name IS 'Human-readable name for this scenario';
COMMENT ON COLUMN antic_scenarios.created_by IS 'ID of the user who created this scenario';
COMMENT ON COLUMN antic_scenarios.assumptions IS 'JSON object containing scenario assumptions';
COMMENT ON COLUMN antic_scenarios.org_id IS 'ID of the organization this scenario belongs to';
COMMENT ON COLUMN antic_scenarios.created_at IS 'Timestamp when this scenario was created';

-- Add column descriptions for antic_trigger_firings table
COMMENT ON COLUMN antic_trigger_firings.org_id IS 'ID of the organization this trigger firing belongs to';
COMMENT ON COLUMN antic_trigger_firings.id IS 'Unique identifier for this trigger firing';
COMMENT ON COLUMN antic_trigger_firings.activation_event_id IS 'ID of related activation event if any';
COMMENT ON COLUMN antic_trigger_firings.created_at IS 'Timestamp when this firing was recorded';
COMMENT ON COLUMN antic_trigger_firings.rule_id IS 'ID of the trigger rule that fired';
COMMENT ON COLUMN antic_trigger_firings.fired_at IS 'Timestamp when the trigger actually fired';
COMMENT ON COLUMN antic_trigger_firings.matched_payload IS 'Data that matched the trigger conditions';

-- Add column descriptions for antic_trigger_rules table
COMMENT ON COLUMN antic_trigger_rules.updated_at IS 'Timestamp when this rule was last updated';
COMMENT ON COLUMN antic_trigger_rules.expr_raw IS 'Raw expression string for the trigger condition';
COMMENT ON COLUMN antic_trigger_rules.action_ref IS 'Reference to the action to take when triggered';
COMMENT ON COLUMN antic_trigger_rules.authority IS 'Authority or role required to execute this rule';
COMMENT ON COLUMN antic_trigger_rules.created_at IS 'Timestamp when this rule was created';
COMMENT ON COLUMN antic_trigger_rules.created_by IS 'ID of the user who created this rule';
COMMENT ON COLUMN antic_trigger_rules.expires_at IS 'Timestamp when this rule expires';
COMMENT ON COLUMN antic_trigger_rules.valid_from IS 'Timestamp when this rule becomes valid';
COMMENT ON COLUMN antic_trigger_rules.window_hours IS 'Time window in hours for evaluating this rule';
COMMENT ON COLUMN antic_trigger_rules.expr_ast IS 'Abstract syntax tree representation of the expression';
COMMENT ON COLUMN antic_trigger_rules.org_id IS 'ID of the organization this rule belongs to';
COMMENT ON COLUMN antic_trigger_rules.id IS 'Unique identifier for this trigger rule';
COMMENT ON COLUMN antic_trigger_rules.name IS 'Human-readable name for this trigger rule';
COMMENT ON COLUMN antic_trigger_rules.consent_note IS 'Note regarding consent requirements for this rule';

-- Add column descriptions for antic_watchpoints table
COMMENT ON COLUMN antic_watchpoints.notes IS 'Additional notes about this watchpoint';
COMMENT ON COLUMN antic_watchpoints.updated_at IS 'Timestamp when this watchpoint was last updated';
COMMENT ON COLUMN antic_watchpoints.created_at IS 'Timestamp when this watchpoint was created';
COMMENT ON COLUMN antic_watchpoints.created_by IS 'ID of the user who created this watchpoint';
COMMENT ON COLUMN antic_watchpoints.review_at IS 'Timestamp when this watchpoint should be reviewed';
COMMENT ON COLUMN antic_watchpoints.buffer_adequacy IS 'Adequacy score for available buffers';
COMMENT ON COLUMN antic_watchpoints.lead_time_days IS 'Lead time in days for this watchpoint';
COMMENT ON COLUMN antic_watchpoints.confidence IS 'Confidence level in this watchpoint prediction';
COMMENT ON COLUMN antic_watchpoints.ews_prob IS 'Early warning system probability score';
COMMENT ON COLUMN antic_watchpoints.org_id IS 'ID of the organization this watchpoint belongs to';
COMMENT ON COLUMN antic_watchpoints.id IS 'Unique identifier for this watchpoint';
COMMENT ON COLUMN antic_watchpoints.status IS 'Current status of this watchpoint (armed/disarmed)';
COMMENT ON COLUMN antic_watchpoints.risk_channel IS 'Risk channel this watchpoint monitors';
COMMENT ON COLUMN antic_watchpoints.loop_codes IS 'Array of loop codes this watchpoint covers';