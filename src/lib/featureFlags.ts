// Feature flags for guardrails and harmonization
export const GUARDRAIL_FLAGS = {
  useGuardrailsV2: true,
  useHarmonization: true,
  allowGuardrailOverride: true,
  useAdvancedRiskScoring: false,
  enableHubConflictDetection: true,
  autoHarmonizationSuggestions: true
} as const;

export type GuardrailFlag = keyof typeof GUARDRAIL_FLAGS;

export const isGuardrailFlagEnabled = (flag: GuardrailFlag): boolean => {
  return GUARDRAIL_FLAGS[flag];
};