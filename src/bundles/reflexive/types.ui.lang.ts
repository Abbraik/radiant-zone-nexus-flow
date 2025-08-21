export type LangMode = "general" | "expert";

export type TermKey =
  | "REFLEXIVE_CAPACITY" | "CONTROLLER" | "TUNING" | "FEEDBACK_LOOP" | "SETPOINT"
  | "PID_CONTROL" | "OSCILLATION" | "OVERSHOOT" | "SETTLING_TIME" | "STEADY_STATE"
  | "DISTURBANCE" | "GAIN" | "DERIVATIVE" | "INTEGRAL" | "PROPORTIONAL"
  | "DEADBAND" | "HYSTERESIS" | "ACTUATOR" | "SENSOR" | "PLANT"
  | "CONTROLLER_TUNER" | "BANDS_WEIGHTS" | "PARAMETER" | "RECIPE"
  | "RMSE" | "DISPERSION" | "EVALUATION" | "EXPERIMENT"
  | "ITS_DID" | "REVIEW" | "HANDOFF" | "RESPONSIVE" | "DELIBERATIVE"
  | "STRUCTURAL" | "SEVERITY" | "SLOPE" | "CONSENT_GATE" | "PERSISTENCE"
  | "APPLYING" | "SAVING" | "APPLY_RECIPE" | "SAVE_CHANGE" | "METHOD"
  | "REVIEW_IN_DAYS" | "INDICATORS" | "HANDOFFS" | "ROUTE_OTHER_CAPACITIES"
  | "SIGNAL_CONDITIONS" | "CONTAIN" | "TRADE_OFFS" | "MANDATE_PATHWAY"
  | "ENABLE_WHEN" | "WORKSPACE_5C" | "BANDS_WEIGHTS_STUDIO"
  | "ADJUST_DE_BANDS" | "AUTO_CREATE_PLAN" | "FAMILY_PID_PI";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string;
}>;

export const reflexiveDict: TermDict = {
  // Core concepts
  REFLEXIVE_CAPACITY:    { label_general: "Auto-adjust",                    label_expert: "Reflexive capacity" },
  CONTROLLER:            { label_general: "Auto-control system",            label_expert: "Controller" },
  TUNING:                { label_general: "Adjustment settings",            label_expert: "Tuning parameters" },
  FEEDBACK_LOOP:         { label_general: "Response cycle",                 label_expert: "Feedback loop" },
  SETPOINT:              { label_general: "Target value",                   label_expert: "Setpoint" },
  
  // Control theory
  PID_CONTROL:           { label_general: "Smart adjustment",               label_expert: "PID control" },
  OSCILLATION:           { label_general: "Back-and-forth swings",          label_expert: "Oscillation" },
  OVERSHOOT:             { label_general: "Goes too far",                   label_expert: "Overshoot" },
  SETTLING_TIME:         { label_general: "Time to stabilize",              label_expert: "Settling time" },
  STEADY_STATE:          { label_general: "Stable condition",               label_expert: "Steady state" },
  
  // System components
  DISTURBANCE:           { label_general: "External change",                label_expert: "Disturbance" },
  GAIN:                  { label_general: "Response strength",              label_expert: "Gain" },
  DERIVATIVE:            { label_general: "Rate of change",                 label_expert: "Derivative" },
  INTEGRAL:              { label_general: "Accumulated error",              label_expert: "Integral" },
  PROPORTIONAL:          { label_general: "Direct response",                label_expert: "Proportional" },
  
  // Hardware
  DEADBAND:              { label_general: "No-action zone",                 label_expert: "Deadband" },
  HYSTERESIS:            { label_general: "Memory effect",                  label_expert: "Hysteresis" },
  ACTUATOR:              { label_general: "Action device",                  label_expert: "Actuator" },
  SENSOR:                { label_general: "Measurement device",             label_expert: "Sensor" },
  PLANT:                 { label_general: "System being controlled",        label_expert: "Plant" },
  
  // Additional UI terms
  CONTROLLER_TUNER:      { label_general: "Auto-adjust Settings",           label_expert: "Controller Tuner" },
  BANDS_WEIGHTS:         { label_general: "Ranges & Importance",            label_expert: "Bands & Weights" },
  PARAMETER:             { label_general: "Setting",                        label_expert: "Parameter" },
  RECIPE:                { label_general: "Preset configuration",           label_expert: "Recipe" },
  RMSE:                  { label_general: "Error level",                    label_expert: "RMSE" },
  DISPERSION:            { label_general: "Spread",                         label_expert: "Dispersion" },
  EVALUATION:            { label_general: "Performance check",              label_expert: "Evaluation" },
  EXPERIMENT:            { label_general: "Test",                           label_expert: "Experiment" },
  ITS_DID:               { label_general: "Testing method",                 label_expert: "ITS/DiD" },
  REVIEW:                { label_general: "Check progress",                 label_expert: "Review" },
  HANDOFF:               { label_general: "Switch to other tools",          label_expert: "Handoff" },
  RESPONSIVE:            { label_general: "Quick response",                 label_expert: "Responsive" },
  DELIBERATIVE:          { label_general: "Group decisions",               label_expert: "Deliberative" },
  STRUCTURAL:            { label_general: "System changes",                 label_expert: "Structural" },
  SEVERITY:              { label_general: "Problem level",                  label_expert: "Severity" },
  SLOPE:                 { label_general: "Direction of change",            label_expert: "Slope" },
  CONSENT_GATE:          { label_general: "Permission needed",              label_expert: "Consent gate" },
  PERSISTENCE:           { label_general: "Long-term pattern",              label_expert: "Persistence" },
  APPLYING:              { label_general: "Applying...",                    label_expert: "Executing recipe..." },
  SAVING:                { label_general: "Saving...",                      label_expert: "Persisting changes..." },
  APPLY_RECIPE:          { label_general: "Apply Settings",                 label_expert: "Apply Recipe" },
  SAVE_CHANGE:           { label_general: "Save Change",                    label_expert: "Persist Change" },
  METHOD:                { label_general: "Method",                         label_expert: "Methodology" },
  REVIEW_IN_DAYS:        { label_general: "Check again in X days",          label_expert: "Review cycle (days)" },
  INDICATORS:            { label_general: "Measures to watch",              label_expert: "Performance indicators" },
  HANDOFFS:              { label_general: "Switch to other tools",          label_expert: "Inter-capacity handoffs" },
  ROUTE_OTHER_CAPACITIES:{ label_general: "Move to other tools",            label_expert: "Route to other capacities" },
  SIGNAL_CONDITIONS:     { label_general: "based on current situation",    label_expert: "based on signal conditions" },
  CONTAIN:               { label_general: "contain",                        label_expert: "containment protocol" },
  TRADE_OFFS:            { label_general: "trade-offs",                     label_expert: "multi-criteria trade-offs" },
  MANDATE_PATHWAY:       { label_general: "permission/pathway",             label_expert: "mandate/pathway analysis" },
  ENABLE_WHEN:           { label_general: "Available when",                 label_expert: "Enable condition" },
  WORKSPACE_5C:          { label_general: "Workspace",                      label_expert: "Workspace-5C" },
  BANDS_WEIGHTS_STUDIO:  { label_general: "Ranges & Weights Editor",        label_expert: "Bands & Weights Studio" },
  ADJUST_DE_BANDS:       { label_general: "Adjust ranges and weights",      label_expert: "Adjust DE-bands and Tier weights per META-L01" },
  AUTO_CREATE_PLAN:      { label_general: "Auto-create evaluation plan",    label_expert: "Auto-create ITS/DiD plan from recipe" },
  FAMILY_PID_PI:         { label_general: "Controller type and settings",   label_expert: "Family: PID → PI (recipe), gain scale, and param sets per recipe" }
};