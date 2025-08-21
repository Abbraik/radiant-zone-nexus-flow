export type LangMode = "general" | "expert";

export type TermKey =
  | "WORKSPACE" | "RESPONSIVE_CAPACITY" | "REFLEXIVE" | "DELIBERATIVE" | "STRUCTURAL" | "ANTICIPATORY"
  | "TENSION" | "SEVERITY" | "BAND_BREACH" | "GUARDRAIL" | "TRI" | "SRT" | "CHECKPOINT"
  | "ACTUATION" | "OSCILLATION" | "DISPERSION" | "PERSISTENCE"
  | "CONTAINMENT" | "PLAYBOOK" | "INCIDENT" | "TIMELINE" | "NRW" | "DEMAND_SURGE";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string; // short tooltip/explainer
}>;

// Default dictionary for Responsive capacity
export const responsiveDict: TermDict = {
  // Workspace & capacities
  WORKSPACE:              { label_general: "Control center",                label_expert: "Workspace-5C" },
  RESPONSIVE_CAPACITY:    { label_general: "Quick response",                label_expert: "Responsive capacity" },
  REFLEXIVE:              { label_general: "Auto-adjust",                   label_expert: "Reflexive" },
  DELIBERATIVE:           { label_general: "Group decision",                label_expert: "Deliberative" },
  STRUCTURAL:             { label_general: "System change",                 label_expert: "Structural" },
  ANTICIPATORY:           { label_general: "Early warning",                 label_expert: "Anticipatory" },

  // Core concepts
  TENSION:                { label_general: "System strain",                 label_expert: "Tension (error/strain)", hint: "How far the signal is from target." },
  SEVERITY:               { label_general: "Problem level",                 label_expert: "Severity" },
  BAND_BREACH:            { label_general: "Outside safe range",            label_expert: "Band breach", hint: "Indicator outside thresholds." },
  GUARDRAIL:              { label_general: "Safety limit",                  label_expert: "Guardrail", hint: "Caps, time-boxes, rate limits." },
  TRI:                    { label_general: "Trust–Reciprocity–Integrity",   label_expert: "TRI", hint: "Legitimacy compass." },
  SRT:                    { label_general: "Short response time",           label_expert: "SRT", hint: "Sense → act → review window." },
  CHECKPOINT:             { label_general: "Scheduled check",               label_expert: "Checkpoint" },
  ACTUATION:              { label_general: "Quick actions",                 label_expert: "Actuation" },
  OSCILLATION:            { label_general: "Back-and-forth swings",         label_expert: "Oscillation" },
  DISPERSION:             { label_general: "Spread pattern",                label_expert: "Dispersion" },
  PERSISTENCE:            { label_general: "Keeps happening",               label_expert: "Persistence" },

  // Tactics
  CONTAINMENT:            { label_general: "Quick response",                label_expert: "Containment sprint" },
  PLAYBOOK:               { label_general: "Action plan",                   label_expert: "Playbook" },
  INCIDENT:               { label_general: "Issue tracking",                label_expert: "Incident" },
  TIMELINE:               { label_general: "What happened",                 label_expert: "Timeline" },

  // Domain examples
  NRW:                    { label_general: "Water loss (NRW)",              label_expert: "Non-Revenue Water (NRW)" },
  DEMAND_SURGE:           { label_general: "Demand spike",                  label_expert: "Demand surge" }
};