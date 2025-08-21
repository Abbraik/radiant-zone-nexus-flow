import type { DecisionResult } from "@/services/capacity-decision/types";
import type { AnticPlaybook, Scenario, ScenarioResult, Watchpoint, TriggerRule } from "./types";

// Mock task composition for now - would integrate with real task registry
function composeTasksFromDecision(decision: DecisionResult, loopCode: string) {
  return [
    {
      id: `${decision.decisionId}:BASE:1`,
      title: `[ANTIC] Monitor ${loopCode}`,
      description: `Monitor loop ${loopCode} for anticipatory signals`,
      capacity: "anticipatory" as const,
      leverage: "N" as const,
      dueAt: new Date(Date.now() + 7*24*3600*1000).toISOString(),
    }
  ];
}

export function expandAnticipatory(
  decision: DecisionResult,
  opts: {
    playbook?: AnticPlaybook | null;
    scenario?: Scenario | null;
    ttlDays?: number;
  }
){
  const baseTasks = composeTasksFromDecision(decision, decision.loopCode);

  const tasksFromPB = (opts.playbook
    ? [
        `[ANTIC] Stage resources: ${opts.playbook.name}`,
        `[ANTIC] Prepare regulatory pack: ${opts.playbook.name}`,
        `[ANTIC] Prepare comms pack: ${opts.playbook.name}`
      ]
    : []
  ).map((label, i) => ({
    id: `${decision.decisionId}:AP:${opts.playbook?.id || "none"}:${i}`,
    title: label,
    description: label,
    capacity: "anticipatory" as const,
    leverage: "P" as const,
    guardrails: decision.guardrails?.caps,
    dueAt: baseTasks[0]?.dueAt,
    meta: { playbookId: opts.playbook?.id }
  }));

  const tasks = dedupe([...tasksFromPB, ...baseTasks], "id");

  const watchpoint: Watchpoint = {
    riskChannel: (opts.playbook?.appliesTo[0] || "ExternalDemand") as any,
    loopCodes: [decision.loopCode],
    ewsProb: Math.max( decision.scores.anticipatory / 100, 0 ),
    confidence: 0.7,
    leadTimeDays: 7,
    bufferAdequacy: null,
    status: "armed",
    reviewAt: new Date(Date.now() + (opts.ttlDays ?? 30)*24*3600*1000).toISOString(),
    notes: opts.playbook?.name
  };

  const trigger: TriggerRule | null = opts.playbook?.defaultTrigger
    ? {
        ...opts.playbook.defaultTrigger,
        validFrom: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (opts.playbook.defaultTrigger.ttlDays)*24*3600*1000).toISOString()
      }
    : null;

  const scenarioResult: ScenarioResult | null = opts.scenario
    ? {
        scenarioId: opts.scenario.id,
        withMitigationBreachProb: 0.25,
        withoutMitigationBreachProb: 0.6,
        mitigationDelta: 0.35,
        affectedLoops: opts.scenario.targetLoops
      }
    : null;

  return { tasks, watchpoint, trigger, scenarioResult };
}

function dedupe<T extends {id?: string}>(arr: T[], key: keyof T) {
  const seen = new Set<string>();
  return arr.filter(x => {
    const k = String(x[key] || Math.random());
    if (seen.has(k)) return false; seen.add(k); return true;
  });
}