import { anticipatoryDict, type LangMode, type TermKey } from './types.ui.lang';

function getDict(term: TermKey, mode: LangMode): string {
  const entry = anticipatoryDict[term];
  return mode === 'expert' ? entry.label_expert : entry.label_general;
}

// Main headers and navigation
export const getAnticipatoryHeaders = (mode: LangMode) => ({
  workspace: getDict('ANTICIPATORY_CAPACITY', mode),
  riskWatchboard: getDict('RISK_WATCHBOARD', mode),
  scenarioSim: getDict('SCENARIO_SIM', mode),
  prePositioner: getDict('PRE_POSITIONER', mode),
  triggerLibrary: getDict('TRIGGER_LIBRARY', mode),
  ewsProb: getDict('EWS_PROB', mode),
  leadTime: getDict('LEAD_TIME', mode),
  buffers: getDict('BUFFER_ADEQUACY', mode),
});

// Risk Watchboard
export const getAnticipatoryWatchboard = (mode: LangMode) => ({
  ewsComposition: getDict('EWS_COMPOSITION', mode),
  weightsComponents: getDict('WEIGHTS_COMPONENTS', mode),
  buffersDashboard: getDict('BUFFER_ADEQUACY', mode),
  adequacyTargets: getDict('ADEQUACY_TARGETS', mode),
  sentinelGrid: getDict('SENTINEL', mode),
  topChannels: getDict('TOP_CHANNELS', mode),
  linkedLoops: getDict('LINKED_LOOPS', mode),
  armWatchpoint: getDict('ARM_WATCHPOINT', mode),
  geoSentinels: getDict('REGIONAL_CELLS', mode),
  hotCells: getDict('HOT_CELLS', mode),
  coolingCells: getDict('COOLING_CELLS', mode),
  medianCell: getDict('MEDIAN_CELL', mode),
  noSeries: getDict('NO_SERIES', mode),
  noGeoData: getDict('NO_GEO_DATA', mode),
});

// Scenario Simulator
export const getAnticipatoryScenario = (mode: LangMode) => ({
  scenarioSelector: getDict('SCENARIO_SELECTOR', mode),
  stressOutcomes: getDict('STRESS_OUTCOMES', mode),
  withoutMitigation: getDict('WITHOUT_MITIGATION', mode),
  withMitigation: getDict('WITH_MITIGATION', mode),
  meanBand: getDict('MEAN_BAND', mode),
  mitigationDelta: getDict('RISK_REDUCTION', mode),
  contributions: getDict('CONTRIBUTIONS', mode),
  sensitivity: getDict('TORNADO', mode),
  factorsSwing: getDict('FACTORS_SWING', mode),
  runScenario: getDict('RUN_SCENARIO', mode),
  noScenarios: getDict('NO_SCENARIOS', mode),
  noDelta: getDict('NO_DELTA', mode),
  noSensitivity: getDict('NO_SENSITIVITY', mode),
});

// Pre-Positioner
export const getAnticipatoryPrePosition = (mode: LangMode) => ({
  packs: getDict('PACKS', mode),
  stageQuietly: getDict('STAGE_QUIETLY', mode),
  resourcesRegulatory: getDict('RESOURCES_REGULATORY', mode),
  shelfLifeTimeline: getDict('SHELF_LIFE_TIMELINE', mode),
  ganttArmed: getDict('GANTT_ARMED', mode),
  riskCostFrontier: getDict('RISK_COST_FRONTIER', mode),
  efficientMix: getDict('EFFICIENT_MIX', mode),
  costCap: getDict('COST_CAP', mode),
  readiness: getDict('READINESS', mode),
  shelfLifeDays: getDict('SHELF_LIFE_DAYS', mode),
  stagePrepositionPack: getDict('STAGE_PREPOSITION_PACK', mode),
  noTimeline: getDict('NO_TIMELINE', mode),
  noFrontier: getDict('NO_FRONTIER', mode),
});

// Trigger Library
export const getAnticipatoryTrigger = (mode: LangMode) => ({
  expressionBuilder: getDict('EXPRESSION_BUILDER', mode),
  authorRules: getDict('AUTHOR_RULES', mode),
  humanReadable: getDict('HUMAN_READABLE', mode),
  backtest: getDict('BACKTEST', mode),
  historicalFirings: getDict('HISTORICAL_FIRINGS', mode),
  quality: getDict('QUALITY_METRICS', mode),
  precision: getDict('PRECISION', mode),
  recall: getDict('RECALL', mode),
  rocAuc: getDict('ROC_AUC', mode),
  expectedActivations: getDict('EXPECTED_ACTIVATIONS', mode),
  noBacktest: getDict('NO_BACKTEST', mode),
});

// Handoffs
export const getAnticipatoryHandoff = (mode: LangMode) => ({
  moveActivation: getDict('MOVE_ACTIVATION', mode),
  arbitrationCodification: getDict('ARBITRATION_CODIFICATION', mode),
  activate: getDict('ACTIVATE', mode),
  codify: getDict('CODIFY', mode),
  responsive: getDict('RESPONSIVE', mode),
  deliberative: getDict('DELIBERATIVE', mode),
  structural: getDict('STRUCTURAL', mode),
});