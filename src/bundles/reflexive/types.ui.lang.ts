export type LangMode = "general" | "expert";

export type TermKey =
  | "REFLEXIVE_CAPACITY" | "CONTROLLER" | "TUNING" | "FEEDBACK_LOOP" | "SETPOINT"
  | "PID_CONTROL" | "OSCILLATION" | "OVERSHOOT" | "SETTLING_TIME" | "STEADY_STATE"
  | "DISTURBANCE" | "GAIN" | "DERIVATIVE" | "INTEGRAL" | "PROPORTIONAL"
  | "DEADBAND" | "HYSTERESIS" | "ACTUATOR" | "SENSOR" | "PLANT";

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
  PLANT:                 { label_general: "System being controlled",        label_expert: "Plant" }
};