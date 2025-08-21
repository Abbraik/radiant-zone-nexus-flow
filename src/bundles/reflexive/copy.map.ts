import { reflexiveDict, type LangMode, type TermKey } from './types.ui.lang';

function getDict(term: TermKey, mode: LangMode): string {
  const entry = reflexiveDict[term];
  return mode === 'expert' ? entry.label_expert : entry.label_general;
}

// Main headers and navigation
export const getReflexiveHeaders = (mode: LangMode) => ({
  workspace: getDict('WORKSPACE_5C', mode),
  bundleName: getDict('REFLEXIVE_CAPACITY', mode),
  controllerTuner: getDict('CONTROLLER_TUNER', mode),
  bandsWeights: getDict('BANDS_WEIGHTS', mode),
  bandsWeightsStudio: getDict('BANDS_WEIGHTS_STUDIO', mode),
  evaluation: getDict('EVALUATION', mode),
  handoffs: getDict('HANDOFFS', mode),
});

// Controller and tuning
export const getReflexiveController = (mode: LangMode) => ({
  familyDescription: getDict('FAMILY_PID_PI', mode),
  adjustDescription: getDict('ADJUST_DE_BANDS', mode),
  autoCreatePlan: getDict('AUTO_CREATE_PLAN', mode),
  applyRecipe: getDict('APPLY_RECIPE', mode),
  saveChange: getDict('SAVE_CHANGE', mode),
  method: getDict('METHOD', mode),
  reviewInDays: getDict('REVIEW_IN_DAYS', mode),
  indicators: getDict('INDICATORS', mode),
});

// Status and measurements
export const getReflexiveStatus = (mode: LangMode) => ({
  oscillation: getDict('OSCILLATION', mode),
  rmse: getDict('RMSE', mode),
  dispersion: getDict('DISPERSION', mode),
  consentGate: getDict('CONSENT_GATE', mode),
  applying: getDict('APPLYING', mode),
  saving: getDict('SAVING', mode),
});

// Handoff section
export const getReflexiveHandoff = (mode: LangMode) => ({
  routeDescription: getDict('ROUTE_OTHER_CAPACITIES', mode),
  signalConditions: getDict('SIGNAL_CONDITIONS', mode),
  responsive: getDict('RESPONSIVE', mode),
  deliberative: getDict('DELIBERATIVE', mode),
  structural: getDict('STRUCTURAL', mode),
  contain: getDict('CONTAIN', mode),
  tradeOffs: getDict('TRADE_OFFS', mode),
  mandatePathway: getDict('MANDATE_PATHWAY', mode),
  enableWhen: getDict('ENABLE_WHEN', mode),
  severity: getDict('SEVERITY', mode),
  slope: getDict('SLOPE', mode),
  persistence: getDict('PERSISTENCE', mode),
});