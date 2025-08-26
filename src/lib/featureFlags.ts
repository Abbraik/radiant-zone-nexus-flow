// Production feature flags for PAGS system
export const PRODUCTION_FLAGS = {
  // Core system toggles
  useCapacityBrain: true,
  useGuardrailsV2: true,
  useHarmonization: true,
  useAnticipatoryRuntime: true,
  useNCFCompassOverlays: true,
  
  // Publishing gates
  conformanceChecksEnabled: true,
  publicDossierEnabled: true,
  enforceConsentGate: true,
  enforceCoherenceCheck: true,
  
  // Performance & safety
  activationDedupeEnabled: true,
  shadowMode: false,
  readonlyMode: false,
  pauseTriggers: false,
  blockAutoOnDQ: true,
  
  // Legacy toggles
  allowGuardrailOverride: true,
  useAdvancedRiskScoring: false,
  enableHubConflictDetection: true,
  autoHarmonizationSuggestions: true
} as const;

export type ProductionFlag = keyof typeof PRODUCTION_FLAGS;

export const isFeatureEnabled = (flag: ProductionFlag): boolean => {
  // Check environment overrides first
  const envKey = `VITE_${flag.toUpperCase()}`;
  const envValue = import.meta.env[envKey];
  if (envValue !== undefined) {
    return envValue === 'true';
  }
  
  return PRODUCTION_FLAGS[flag];
};

// Legacy compatibility
export const GUARDRAIL_FLAGS = PRODUCTION_FLAGS;
export type GuardrailFlag = ProductionFlag;
export const isGuardrailFlagEnabled = isFeatureEnabled;