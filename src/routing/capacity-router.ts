import type { DecisionResult } from "@/services/capacity-decision/types";

export type Screen =
  | "checkpoint"            // Responsive
  | "controller-tuner"      // Reflexive
  | "tradeoff-workbench"    // Deliberative
  | "risk-watchboard"       // Anticipatory
  | "mandate-gate"          // Structural
  | "pathway-builder"
  | "bands-weights"
  | "trigger-library";

const DEFAULT_SCREEN: Record<string, Screen> = {
  responsive:   "checkpoint",
  reflexive:    "controller-tuner",
  deliberative: "tradeoff-workbench",
  anticipatory: "risk-watchboard",
  structural:   "mandate-gate",
};

const SPECIAL_SCREENS: Array<{
  match: RegExp; capacity: keyof typeof DEFAULT_SCREEN; screen: Screen;
}> = [
  { match: /^META-L01$/, capacity: "reflexive",    screen: "bands-weights" },
  { match: /^META-L08$/, capacity: "anticipatory", screen: "trigger-library" },
  { match: /^MES-L11$/,  capacity: "deliberative", screen: "tradeoff-workbench" },
  { match: /^(MES-L05|MAC-L04)$/, capacity: "structural", screen: "pathway-builder" },
];

function pickScreen(loopCode: string, cap: keyof typeof DEFAULT_SCREEN): Screen {
  const spec = SPECIAL_SCREENS.find(s => s.capacity === cap && s.match.test(loopCode));
  return spec ? spec.screen : DEFAULT_SCREEN[cap];
}

export function routeFromDecision(
  loopCode: string,
  decision: DecisionResult,
  opts?: { overridePrimary?: keyof typeof DEFAULT_SCREEN; respectCooldownMs?: number; lastAutoRouteAt?: number; lifeSafety?: boolean; }
) {
  const primary = (opts?.overridePrimary ?? decision.order[0]) as keyof typeof DEFAULT_SCREEN;

  // Consent side-drawer policy (handled by UI consumer via decision.consent)
  // Cool-down: suppress auto-reroute unless life-safety
  if (!opts?.lifeSafety && opts?.respectCooldownMs && opts.lastAutoRouteAt) {
    const elapsed = Date.now() - opts.lastAutoRouteAt;
    if (elapsed < opts.respectCooldownMs) {
      return null;
    }
  }

  const screen = pickScreen(loopCode, primary);
  return {
    path: "/workspace-5c",
    params: { capacity: primary, screen, loop: loopCode },
    ui: {
      showSecondaryChip: decision.order[1] ? decision.order[1] : undefined,
      consent: decision.consent,
      srt: decision.srt,
      guardrails: decision.guardrails,
      nearTieDelta: decision.nearTieDelta
    },
    decisionHash: decision.decisionId,
  };
}