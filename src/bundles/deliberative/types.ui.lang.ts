export type LangMode = "general" | "expert";

export type TermKey =
  | "DELIBERATIVE_CAPACITY" | "TRADE_OFFS" | "STAKEHOLDER" | "CONSENSUS" | "FACILITATION"
  | "MULTI_CRITERIA" | "DECISION_MATRIX" | "WEIGHTED_SCORING" | "OPTION_ANALYSIS" | "SCENARIO_PLANNING"
  | "CONSULTATION" | "VOTING" | "NEGOTIATION" | "COMPROMISE" | "ALIGNMENT"
  | "CONFLICT_RESOLUTION" | "PRIORITY_RANKING" | "COST_BENEFIT" | "RISK_ASSESSMENT" | "SENSITIVITY_ANALYSIS";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string;
}>;

export const deliberativeDict: TermDict = {
  // Core concepts
  DELIBERATIVE_CAPACITY: { label_general: "Group decision",                label_expert: "Deliberative capacity" },
  TRADE_OFFS:            { label_general: "Pros and cons",                 label_expert: "Trade-offs analysis" },
  STAKEHOLDER:           { label_general: "People affected",               label_expert: "Stakeholder" },
  CONSENSUS:             { label_general: "Everyone agrees",               label_expert: "Consensus building" },
  FACILITATION:          { label_general: "Meeting guidance",              label_expert: "Facilitation" },
  
  // Analysis methods
  MULTI_CRITERIA:        { label_general: "Multiple factors",              label_expert: "Multi-criteria analysis" },
  DECISION_MATRIX:       { label_general: "Choice comparison table",       label_expert: "Decision matrix" },
  WEIGHTED_SCORING:      { label_general: "Importance-based scoring",      label_expert: "Weighted scoring" },
  OPTION_ANALYSIS:       { label_general: "Choice evaluation",             label_expert: "Option analysis" },
  SCENARIO_PLANNING:     { label_general: "Future planning",               label_expert: "Scenario planning" },
  
  // Process elements
  CONSULTATION:          { label_general: "Getting input",                 label_expert: "Consultation process" },
  VOTING:                { label_general: "Choosing by vote",              label_expert: "Voting mechanism" },
  NEGOTIATION:           { label_general: "Finding agreement",             label_expert: "Negotiation" },
  COMPROMISE:            { label_general: "Middle ground",                 label_expert: "Compromise solution" },
  ALIGNMENT:             { label_general: "Getting on same page",          label_expert: "Stakeholder alignment" },
  
  // Support tools
  CONFLICT_RESOLUTION:   { label_general: "Solving disagreements",         label_expert: "Conflict resolution" },
  PRIORITY_RANKING:      { label_general: "Most important first",          label_expert: "Priority ranking" },
  COST_BENEFIT:          { label_general: "Worth vs cost",                 label_expert: "Cost-benefit analysis" },
  RISK_ASSESSMENT:       { label_general: "What could go wrong",           label_expert: "Risk assessment" },
  SENSITIVITY_ANALYSIS:  { label_general: "How changes affect outcome",    label_expert: "Sensitivity analysis" }
};