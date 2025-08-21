export type LangMode = "general" | "expert";

export type TermKey =
  | "DELIBERATIVE_CAPACITY" | "TRADE_OFFS" | "STAKEHOLDER" | "CONSENSUS" | "FACILITATION"
  | "MULTI_CRITERIA" | "DECISION_MATRIX" | "WEIGHTED_SCORING" | "OPTION_ANALYSIS" | "SCENARIO_PLANNING"
  | "CONSULTATION" | "VOTING" | "NEGOTIATION" | "COMPROMISE" | "ALIGNMENT"
  | "CONFLICT_RESOLUTION" | "PRIORITY_RANKING" | "COST_BENEFIT" | "RISK_ASSESSMENT" | "SENSITIVITY_ANALYSIS"
  | "STRATEGIC_PLANNING" | "STRATEGIC_ANALYSIS_MODE" | "THOROUGH_ANALYSIS" | "SYSTEMATIC_DECISIONS"
  | "ANALYSIS_TIMEFRAME" | "STAKEHOLDER_GROUPS" | "STRATEGIC_OBJECTIVES"
  | "SUCCESS_CRITERIA" | "CORE_TEAM" | "EXTENDED_TEAM" | "CROSS_FUNCTIONAL"
  | "ORGANIZATION_WIDE" | "INVITE_STAKEHOLDERS" | "BEGIN_ANALYSIS"
  | "DEFINE_OBJECTIVES" | "KEY_STRATEGIC_OBJECTIVES" | "ANALYSIS_FRAMEWORK"
  | "SWOT" | "IMPACT_ANALYSIS";

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
  SENSITIVITY_ANALYSIS:  { label_general: "How changes affect outcome",    label_expert: "Sensitivity analysis" },
  
  // Additional UI terms
  STRATEGIC_PLANNING:    { label_general: "Long-term planning",            label_expert: "Strategic Planning" },
  STRATEGIC_ANALYSIS_MODE:{ label_general: "Deep Analysis Mode",           label_expert: "Strategic Analysis Mode" },
  THOROUGH_ANALYSIS:     { label_general: "Detailed study, input gathering, and careful decision-making", label_expert: "Thorough analysis, stakeholder consultation, and systematic decision-making processes" },
  SYSTEMATIC_DECISIONS:  { label_general: "Organized decision process",    label_expert: "Systematic decision-making processes" },
  ANALYSIS_TIMEFRAME:    { label_general: "How long to study",             label_expert: "Analysis Timeframe" },
  STAKEHOLDER_GROUPS:    { label_general: "Who to include",                label_expert: "Stakeholder Groups" },
  STRATEGIC_OBJECTIVES:  { label_general: "Main goals",                    label_expert: "Strategic Objectives" },
  SUCCESS_CRITERIA:      { label_general: "How to measure success",        label_expert: "Success criteria" },
  CORE_TEAM:             { label_general: "Main team",                     label_expert: "Core Team" },
  EXTENDED_TEAM:         { label_general: "Wider team",                    label_expert: "Extended Team" },
  CROSS_FUNCTIONAL:      { label_general: "Multiple departments",          label_expert: "Cross-functional" },
  ORGANIZATION_WIDE:     { label_general: "Whole organization",            label_expert: "Organization-wide" },
  INVITE_STAKEHOLDERS:   { label_general: "Include Others",                label_expert: "Invite Stakeholders" },
  BEGIN_ANALYSIS:        { label_general: "Start Study",                   label_expert: "Begin Analysis" },
  DEFINE_OBJECTIVES:     { label_general: "Set main goals and success measures", label_expert: "Define the key strategic objectives and success criteria" },
  KEY_STRATEGIC_OBJECTIVES:{ label_general: "Main goals and success measures", label_expert: "Key strategic objectives and success criteria" },
  ANALYSIS_FRAMEWORK:    { label_general: "Study methods",                 label_expert: "Analysis Framework" },
  SWOT:                  { label_general: "Strengths, Weaknesses, Opportunities, Threats", label_expert: "SWOT Analysis" },
  IMPACT_ANALYSIS:       { label_general: "Effect study",                  label_expert: "Impact Analysis" }
};