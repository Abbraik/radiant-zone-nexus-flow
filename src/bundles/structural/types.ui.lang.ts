export type LangMode = "general" | "expert";

export type TermKey =
  | "STRUCTURAL_CAPACITY" | "GOVERNANCE" | "MANDATE" | "DELEGATION" | "AUTHORITY"
  | "MESH_PLANNING" | "COORDINATION" | "PROCESS_FLOW" | "STANDARDS" | "INTEROPERABILITY"
  | "MARKET_DESIGN" | "AUCTION" | "PRICING_RULE" | "PERMIT_CLASS" | "CONFORMANCE"
  | "BUDGET_ENVELOPE" | "SLA" | "RACI" | "PROCESS_GATE" | "DOSSIER";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string;
}>;

export const structuralDict: TermDict = {
  // Core concepts
  STRUCTURAL_CAPACITY:   { label_general: "System change",                 label_expert: "Structural capacity" },
  GOVERNANCE:            { label_general: "Rules and oversight",           label_expert: "Governance framework" },
  MANDATE:               { label_general: "Official permission",           label_expert: "Mandate authorization" },
  DELEGATION:            { label_general: "Passing authority down",        label_expert: "Delegation structure" },
  AUTHORITY:             { label_general: "Decision-making power",         label_expert: "Authority source" },
  
  // Planning and coordination
  MESH_PLANNING:         { label_general: "Connected planning",            label_expert: "Mesh planning" },
  COORDINATION:          { label_general: "Working together",              label_expert: "Coordination metrics" },
  PROCESS_FLOW:          { label_general: "Step-by-step workflow",         label_expert: "Process flow" },
  STANDARDS:             { label_general: "Common rules",                  label_expert: "Standards specification" },
  INTEROPERABILITY:      { label_general: "Systems work together",        label_expert: "Interoperability" },
  
  // Market mechanisms
  MARKET_DESIGN:         { label_general: "Market setup",                 label_expert: "Market design" },
  AUCTION:               { label_general: "Bidding process",               label_expert: "Auction mechanism" },
  PRICING_RULE:          { label_general: "How prices are set",           label_expert: "Pricing rule" },
  PERMIT_CLASS:          { label_general: "Permission type",               label_expert: "Permit class" },
  CONFORMANCE:           { label_general: "Following the rules",           label_expert: "Conformance check" },
  
  // Implementation tools
  BUDGET_ENVELOPE:       { label_general: "Spending limit",                label_expert: "Budget envelope" },
  SLA:                   { label_general: "Service promise",               label_expert: "Service level agreement" },
  RACI:                  { label_general: "Who does what",                 label_expert: "RACI matrix" },
  PROCESS_GATE:          { label_general: "Approval checkpoint",           label_expert: "Process gate" },
  DOSSIER:               { label_general: "Complete record",               label_expert: "Structural dossier" }
};