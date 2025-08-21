export type LangMode = "general" | "expert";

export type TermKey =
  | "ANTICIPATORY_CAPACITY" | "EARLY_WARNING" | "RISK_CHANNEL" | "WATCHBOARD" | "BUFFER"
  | "LEAD_TIME" | "PROBABILITY" | "SCENARIO" | "PROJECTION" | "WATERFALL"
  | "SENSITIVITY" | "PRE_POSITION" | "TRIGGER" | "BACKTEST" | "THRESHOLD"
  | "EWS_COMPOSITION" | "GEO_GRID" | "TIMELINE_SPAN" | "READINESS_SCORE" | "SHELF_LIFE"
  | "EWS_PROB" | "BUFFER_ADEQUACY" | "WATCHPOINT" | "SENTINEL"
  | "RISK_WATCHBOARD" | "SCENARIO_SIM" | "PRE_POSITIONER" | "TRIGGER_LIBRARY"
  | "COMPOSITION" | "TORNADO" | "MITIGATION"
  | "STAGE" | "EXPRESSION_BUILDER" | "PRECISION" | "RECALL" | "ROC_AUC"
  | "WEIGHTS_COMPONENTS" | "ADEQUACY_TARGETS" | "TOP_CHANNELS" | "LINKED_LOOPS"
  | "ARM_WATCHPOINT" | "REGIONAL_CELLS" | "HOT_CELLS" | "COOLING_CELLS"
  | "MEDIAN_CELL" | "SCENARIO_SELECTOR" | "STRESS_OUTCOMES" | "WITHOUT_MITIGATION"
  | "WITH_MITIGATION" | "MEAN_BAND" | "RISK_REDUCTION" | "CONTRIBUTIONS"
  | "FACTORS_SWING" | "PACKS" | "STAGE_QUIETLY" | "RESOURCES_REGULATORY"
  | "SHELF_LIFE_TIMELINE" | "GANTT_ARMED" | "RISK_COST_FRONTIER" | "EFFICIENT_MIX"
  | "AUTHOR_RULES" | "HUMAN_READABLE" | "HISTORICAL_FIRINGS" | "QUALITY_METRICS"
  | "EXPECTED_ACTIVATIONS" | "MOVE_ACTIVATION" | "ARBITRATION_CODIFICATION"
  | "ACTIVATE" | "CODIFY" | "NO_SERIES" | "NO_GEO_DATA" | "NO_SCENARIOS"
  | "NO_DELTA" | "RUN_SCENARIO" | "NO_SENSITIVITY" | "NO_TIMELINE" | "NO_FRONTIER"
  | "NO_BACKTEST" | "COST_CAP" | "READINESS" | "SHELF_LIFE_DAYS" | "STAGE_PREPOSITION_PACK"
  | "RESPONSIVE" | "DELIBERATIVE" | "STRUCTURAL";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string;
}>;

export const anticipatoryDict: TermDict = {
  // Core concepts
  ANTICIPATORY_CAPACITY: { label_general: "Early warning",                 label_expert: "Anticipatory capacity" },
  EARLY_WARNING:         { label_general: "Advance notice",                label_expert: "Early warning system" },
  RISK_CHANNEL:          { label_general: "Problem area",                  label_expert: "Risk channel" },
  WATCHBOARD:            { label_general: "Monitoring dashboard",          label_expert: "Risk watchboard" },
  BUFFER:                { label_general: "Safety reserve",                label_expert: "Buffer adequacy" },
  
  // Timing and probability
  LEAD_TIME:             { label_general: "Warning time",                  label_expert: "Lead time" },
  PROBABILITY:           { label_general: "Chance of happening",           label_expert: "EWS probability" },
  SCENARIO:              { label_general: "What-if situation",             label_expert: "Scenario simulation" },
  PROJECTION:            { label_general: "Future forecast",               label_expert: "Projection bands" },
  WATERFALL:             { label_general: "Contributing factors",          label_expert: "Waterfall analysis" },
  
  // Analysis tools
  SENSITIVITY:           { label_general: "Impact of changes",             label_expert: "Sensitivity analysis" },
  PRE_POSITION:          { label_general: "Getting ready in advance",      label_expert: "Pre-positioning" },
  TRIGGER:               { label_general: "Activation condition",          label_expert: "Trigger template" },
  BACKTEST:              { label_general: "Historical testing",            label_expert: "Backtest analysis" },
  THRESHOLD:             { label_general: "Warning level",                 label_expert: "Threshold breach" },
  
  // System components
  EWS_COMPOSITION:       { label_general: "Warning system parts",          label_expert: "EWS composition" },
  GEO_GRID:              { label_general: "Location map",                  label_expert: "Geographic grid" },
  TIMELINE_SPAN:         { label_general: "Time periods",                  label_expert: "Timeline spans" },
  READINESS_SCORE:       { label_general: "Preparation level",             label_expert: "Readiness score" },
  SHELF_LIFE:            { label_general: "How long preparations last",    label_expert: "Shelf life" },
  
  // Additional UI terms
  EWS_PROB:              { label_general: "Warning level",                 label_expert: "EWS prob" },
  BUFFER_ADEQUACY:       { label_general: "Reserve level",                 label_expert: "Buffer adequacy" },
  WATCHPOINT:            { label_general: "Alert point",                   label_expert: "Watchpoint" },
  SENTINEL:              { label_general: "Early detector",                label_expert: "Sentinel system" },
  RISK_WATCHBOARD:       { label_general: "Risk Monitor",                  label_expert: "Risk Watchboard" },
  SCENARIO_SIM:          { label_general: "What-if Simulator",             label_expert: "Scenario Simulator" },
  PRE_POSITIONER:        { label_general: "Advance Preparation",           label_expert: "Pre-Positioner" },
  TRIGGER_LIBRARY:       { label_general: "Alert Rules",                   label_expert: "Trigger Library" },
  COMPOSITION:           { label_general: "Parts breakdown",               label_expert: "Composition" },
  TORNADO:               { label_general: "Impact ranking",                label_expert: "Tornado chart" },
  MITIGATION:            { label_general: "Prevention action",             label_expert: "Mitigation" },
  STAGE:                 { label_general: "Prepare",                       label_expert: "Stage" },
  EXPRESSION_BUILDER:    { label_general: "Rule maker",                    label_expert: "Expression Builder" },
  PRECISION:             { label_general: "Accuracy rate",                 label_expert: "Precision" },
  RECALL:                { label_general: "Detection rate",                label_expert: "Recall" },
  ROC_AUC:               { label_general: "Overall performance",           label_expert: "ROC AUC" },
  WEIGHTS_COMPONENTS:    { label_general: "Importance & data series",      label_expert: "Weights & component series" },
  ADEQUACY_TARGETS:      { label_general: "Current vs goals",              label_expert: "Adequacy vs targets" },
  TOP_CHANNELS:          { label_general: "Main risk areas, connected loops", label_expert: "Top channels, linked loops" },
  LINKED_LOOPS:          { label_general: "Connected",                     label_expert: "Linked" },
  ARM_WATCHPOINT:        { label_general: "Set Alert",                     label_expert: "Arm Watchpoint" },
  REGIONAL_CELLS:        { label_general: "Area monitoring",               label_expert: "Regional early-warning cells" },
  HOT_CELLS:             { label_general: "High-risk areas",               label_expert: "Hot cells" },
  COOLING_CELLS:         { label_general: "Low-risk areas",                label_expert: "Cooling cells" },
  MEDIAN_CELL:           { label_general: "Typical area",                  label_expert: "Median cell" },
  SCENARIO_SELECTOR:     { label_general: "Pick Scenario",                 label_expert: "Scenario Selector" },
  STRESS_OUTCOMES:       { label_general: "Test situation; see results",   label_expert: "Choose a stress; compare outcomes" },
  WITHOUT_MITIGATION:    { label_general: "No Action Taken",               label_expert: "Without Mitigation" },
  WITH_MITIGATION:       { label_general: "Action Taken",                  label_expert: "With Mitigation" },
  MEAN_BAND:             { label_general: "Average & range (10–90%)",      label_expert: "Mean & band (p10–p90)" },
  RISK_REDUCTION:        { label_general: "How risk was reduced",          label_expert: "Contributions to risk reduction" },
  CONTRIBUTIONS:         { label_general: "What helped",                   label_expert: "Contributions" },
  FACTORS_SWING:         { label_general: "What matters most",             label_expert: "Which factors swing outcomes most" },
  PACKS:                 { label_general: "Preparation Packages",          label_expert: "Packs" },
  STAGE_QUIETLY:         { label_general: "Prepare in advance",            label_expert: "Stage quietly: resources, regulatory, comms" },
  RESOURCES_REGULATORY:  { label_general: "Resources, rules, communications", label_expert: "Resources, regulatory, comms" },
  SHELF_LIFE_TIMELINE:   { label_general: "Preparation Schedule",          label_expert: "Shelf-Life Timeline" },
  GANTT_ARMED:           { label_general: "Timeline of ready actions",     label_expert: "Gantt view of armed windows" },
  RISK_COST_FRONTIER:    { label_general: "Cost vs Risk Balance",          label_expert: "Risk–Cost Frontier" },
  EFFICIENT_MIX:         { label_general: "Best preparation combination",  label_expert: "Pick the efficient pre-position mix" },
  AUTHOR_RULES:          { label_general: "Write Alert Rules",             label_expert: "Author IF–THEN rules" },
  HUMAN_READABLE:        { label_general: "Easy to understand",            label_expert: "Human readable" },
  HISTORICAL_FIRINGS:    { label_general: "Past alerts vs real events",    label_expert: "Historical firings vs breaches" },
  QUALITY_METRICS:       { label_general: "Alert performance stats",       label_expert: "ROC · Precision/Recall · Activations" },
  EXPECTED_ACTIVATIONS:  { label_general: "Expected alerts per month",     label_expert: "Expected activations per 30d" },
  MOVE_ACTIVATION:       { label_general: "Go to next steps",              label_expert: "Move to activation, arbitration, or codification" },
  ARBITRATION_CODIFICATION: { label_general: "Decision or rule making",    label_expert: "Arbitration, or codification" },
  ACTIVATE:              { label_general: "activate",                      label_expert: "activate" },
  CODIFY:                { label_general: "make into rules",               label_expert: "codify" },
  NO_SERIES:             { label_general: "No data available",             label_expert: "No series" },
  NO_GEO_DATA:           { label_general: "No location data available",    label_expert: "No geo data." },
  NO_SCENARIOS:          { label_general: "No test scenarios yet",         label_expert: "No scenarios yet." },
  NO_DELTA:              { label_general: "No changes yet — run test",     label_expert: "No delta yet — run a scenario." },
  RUN_SCENARIO:          { label_general: "Test",                          label_expert: "Run:" },
  NO_SENSITIVITY:        { label_general: "No impact analysis yet",        label_expert: "No sensitivity yet." },
  NO_TIMELINE:           { label_general: "No schedule created yet",       label_expert: "No timeline yet." },
  NO_FRONTIER:           { label_general: "No cost analysis yet",          label_expert: "No frontier yet." },
  NO_BACKTEST:           { label_general: "No historical test data yet",   label_expert: "No backtest data yet." },
  COST_CAP:              { label_general: "Budget limit",                  label_expert: "Cost cap" },
  READINESS:             { label_general: "How ready",                     label_expert: "Readiness" },
  SHELF_LIFE_DAYS:       { label_general: "Valid for (days)",             label_expert: "Shelf-life" },
  STAGE_PREPOSITION_PACK:{ label_general: "Prepare Package",               label_expert: "Stage Pre-Position Pack" },
  RESPONSIVE:            { label_general: "Quick response",                label_expert: "Responsive" },
  DELIBERATIVE:          { label_general: "Group decisions",              label_expert: "Deliberative" },
  STRUCTURAL:            { label_general: "System changes",               label_expert: "Structural" }
};