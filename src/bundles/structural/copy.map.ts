import { structuralDict, type LangMode, type TermKey } from './types.ui.lang';

function getDict(term: TermKey, mode: LangMode): string {
  const entry = structuralDict[term];
  return mode === 'expert' ? entry.label_expert : entry.label_general;
}

// Main headers and navigation
export const getStructuralHeaders = (mode: LangMode) => ({
  workspace: getDict('WORKSPACE_5C_STRUCTURAL', mode),
  bundleName: getDict('STRUCTURAL_CAPACITY', mode),
  sLevers: getDict('S_LEVERS', mode),
  mandateGate: getDict('MANDATE_GATE', mode),
  meshPlanner: getDict('MESH_PLANNER', mode),
  processStudio: getDict('PROCESS_STUDIO', mode),
  standardsForge: getDict('STANDARDS_FORGE', mode),
  marketLab: getDict('MARKET_LAB', mode),
  dossier: getDict('DOSSIER', mode),
});

// Core structural concepts
export const getStructuralConcepts = (mode: LangMode) => ({
  governance: getDict('GOVERNANCE', mode),
  mandate: getDict('MANDATE', mode),
  delegation: getDict('DELEGATION', mode),
  authority: getDict('AUTHORITY', mode),
  meshPlanning: getDict('MESH_PLANNING', mode),
  coordination: getDict('COORDINATION', mode),
  processFlow: getDict('PROCESS_FLOW', mode),
  standards: getDict('STANDARDS', mode),
  interoperability: getDict('INTEROPERABILITY', mode),
});

// Market mechanisms
export const getStructuralMarket = (mode: LangMode) => ({
  marketDesign: getDict('MARKET_DESIGN', mode),
  auction: getDict('AUCTION', mode),
  pricingRule: getDict('PRICING_RULE', mode),
  permitClass: getDict('PERMIT_CLASS', mode),
  conformance: getDict('CONFORMANCE', mode),
});

// Implementation tools
export const getStructuralImplementation = (mode: LangMode) => ({
  budgetEnvelope: getDict('BUDGET_ENVELOPE', mode),
  sla: getDict('SLA', mode),
  raci: getDict('RACI', mode),
  processGate: getDict('PROCESS_GATE', mode),
});