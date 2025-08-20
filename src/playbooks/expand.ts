import { composeTasksFromDecision } from "@/tasks/task-template-registry";
import type { DecisionResult } from "@/services/capacity-decision/types";
import type { ResponsivePlaybook } from "./types";

export function expandResponsivePlaybook(decision: DecisionResult, playbook: ResponsivePlaybook) {
  const base = composeTasksFromDecision(decision, decision.loopCode);
  const pbTasks = playbook.actions.map(a => ({
    id: `${decision.decisionId}:PB:${a.key}`,
    title: `[RESPONSIVE] ${a.label}`,
    description: a.label,
    capacity: "responsive" as const,
    leverage: "P" as const,
    guardrails: [...(decision.guardrails.caps||[]), ...(playbook.guardrails||[])],
    dueAt: base[0]?.dueAt,
    meta: { playbook: playbook.id, params: a.params || {} }
  }));
  return dedupe([...pbTasks, ...base], "id");
}

function dedupe<T extends {id?: string}>(arr: T[], key: keyof T) {
  const seen = new Set<string>();
  return arr.filter(x => {
    const k = String(x[key] || Math.random());
    if (seen.has(k)) return false; seen.add(k); return true;
  });
}