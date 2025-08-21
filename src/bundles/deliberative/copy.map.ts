import { deliberativeDict, type LangMode, type TermKey } from './types.ui.lang';

function getDict(term: TermKey, mode: LangMode): string {
  const entry = deliberativeDict[term];
  return mode === 'expert' ? entry.label_expert : entry.label_general;
}

// Main headers and component titles
export const getDeliberativeHeaders = (mode: LangMode) => ({
  bundleName: getDict('DELIBERATIVE_CAPACITY', mode),
  strategicPlanning: getDict('STRATEGIC_PLANNING', mode),
  strategicAnalysisMode: getDict('STRATEGIC_ANALYSIS_MODE', mode),
  thoroughAnalysis: getDict('THOROUGH_ANALYSIS', mode),
});

// Form sections and fields
export const getDeliberativeForm = (mode: LangMode) => ({
  analysisTimeframe: getDict('ANALYSIS_TIMEFRAME', mode),
  stakeholderGroups: getDict('STAKEHOLDER_GROUPS', mode),
  strategicObjectives: getDict('STRATEGIC_OBJECTIVES', mode),
  defineObjectives: getDict('DEFINE_OBJECTIVES', mode),
  analysisFramework: getDict('ANALYSIS_FRAMEWORK', mode),
  coreTeam: getDict('CORE_TEAM', mode),
  extendedTeam: getDict('EXTENDED_TEAM', mode),
  crossFunctional: getDict('CROSS_FUNCTIONAL', mode),
  organizationWide: getDict('ORGANIZATION_WIDE', mode),
});

// Analysis frameworks and methods
export const getDeliberativeFrameworks = (mode: LangMode) => ({
  swotAnalysis: getDict('SWOT', mode),
  riskAssessment: getDict('RISK_ASSESSMENT', mode),
  costBenefit: getDict('COST_BENEFIT', mode),
  impactAnalysis: getDict('IMPACT_ANALYSIS', mode),
});

// Action buttons and interactions
export const getDeliberativeActions = (mode: LangMode) => ({
  inviteStakeholders: getDict('INVITE_STAKEHOLDERS', mode),
  beginAnalysis: getDict('BEGIN_ANALYSIS', mode),
});

// Additional terminology for process elements
export const getDeliberativeProcess = (mode: LangMode) => ({
  consensus: getDict('CONSENSUS', mode),
  facilitation: getDict('FACILITATION', mode),
  tradeOffs: getDict('TRADE_OFFS', mode),
  multiCriteria: getDict('MULTI_CRITERIA', mode),
  consultation: getDict('CONSULTATION', mode),
  voting: getDict('VOTING', mode),
  negotiation: getDict('NEGOTIATION', mode),
  compromise: getDict('COMPROMISE', mode),
  alignment: getDict('ALIGNMENT', mode),
});