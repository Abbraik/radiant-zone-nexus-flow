import { composeTasksFromDecision } from "@/tasks/task-template-registry";
import type { DecisionResult } from "@/services/capacity-decision/types";
import type { ReflexiveRecipe, TuningChange, BandWeightChange, EvalDesign } from "./types";

export function expandReflexiveRecipe(decision: DecisionResult, recipe: ReflexiveRecipe) {
  const baseTasks = composeTasksFromDecision(decision, decision.loopCode);

  const tuning: TuningChange | null = (() => {
    const hasCtl = recipe.actions.some(a => a.kind === "switch_family" || a.kind === "scale_gain" || a.kind === "set_param");
    if (!hasCtl) return null;
    const afterParams: Record<string, number> = {};
    for (const a of recipe.actions) {
      if (a.kind === "scale_gain") afterParams[a.param] = Number.isFinite(afterParams[a.param]) ? afterParams[a.param] * a.factor : a.factor;
      if (a.kind === "set_param") afterParams[a.param] = a.value;
    }
    const family = recipe.actions.find(a=>a.kind==="switch_family")?.to ?? "PI";
    return {
      loopCode: decision.loopCode,
      indicator: decision.indicator,
      before: { family: "PID", params: {} },
      after:  { family, params: afterParams },
      rationale: recipe.rationaleHint || recipe.name
    };
  })();

  const bands: BandWeightChange[] = recipe.actions
    .filter(a => a.kind === "reweight_tier" || a.kind === "adjust_band")
    .map((a) => {
      if (a.kind === "reweight_tier") {
        return {
          loopCode: decision.loopCode, tier: a.tier, anchor: "Tier Weight",
          before: { lower: 0, upper: 0, weight: 0 },
          after:  { lower: 0, upper: 0, weight: a.weightDelta },
          rationale: recipe.rationaleHint || recipe.name
        };
      }
      return {
        loopCode: decision.loopCode, tier: "T1", anchor: a.anchor,
        before: { lower: 0, upper: 0 },
        after:  { lower: a.lower ?? 0, upper: a.upper ?? 0 },
        rationale: recipe.rationaleHint || recipe.name
      };
    });

  const evalPlan: EvalDesign | null = recipe.evaluation
    ? {
        loopCode: decision.loopCode,
        method: recipe.evaluation.method,
        indicators: recipe.evaluation.indicators,
        startAt: new Date().toISOString(),
        reviewAt: new Date(Date.now() + recipe.evaluation.reviewInDays*24*3600*1000).toISOString(),
        notes: recipe.name
      }
    : null;

  const rxTasks = (recipe.actions.length ? recipe.actions : [{kind:"noop"} as any]).map((a, i) => ({
    id: `${decision.decisionId}:RX:${recipe.id}:${i}`,
    title: `[REFLEXIVE] ${recipe.name}`,
    description: typeof a === "object" ? JSON.stringify(a) : String(a),
    capacity: "reflexive" as const,
    leverage: "N" as const,
    guardrails: decision.guardrails?.caps,
    dueAt: baseTasks[0]?.dueAt,
    meta: { recipe: recipe.id }
  }));

  // Merge & dedupe
  const tasks = dedupe([...rxTasks, ...baseTasks], "id");
  return { tasks, tuning, bands, evalPlan };
}

function dedupe<T extends {id?: string}>(arr: T[], key: keyof T) {
  const seen = new Set<string>();
  return arr.filter(x => {
    const k = String(x[key] || Math.random());
    if (seen.has(k)) return false; seen.add(k); return true;
  });
}