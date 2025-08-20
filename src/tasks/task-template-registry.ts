import type { DecisionResult, CapacityAction, Leverage } from "@/services/capacity-decision/types";

type Task = {
  id?: string;
  title: string;
  description: string;
  capacity: "responsive"|"reflexive"|"deliberative"|"anticipatory"|"structural";
  leverage: Leverage;
  guardrails?: string[];
  dueAt?: string;
  meta?: Record<string, any>;
};

function mapISOtoDays(iso: string) {
  const m = /^P(\d+)D$/.exec(iso);
  return m ? parseInt(m[1], 10) : 30;
}

export function composeTasksFromDecision(decision: DecisionResult, loopCode: string): Task[] {
  const blocks: CapacityAction[] = decision.templateActions?.length
    ? decision.templateActions
    : decision.order.map((c, i) => ({
        capacity: c,
        order: i+1,
        sprintLevel: c === "structural" ? "S" : c === "responsive" || c === "anticipatory" ? "P" : "N",
        actions: []
      }));

  const horizonDays = mapISOtoDays(decision.srt.horizon);
  const dueAt = new Date(Date.now() + Math.min(horizonDays, 30)*24*3600*1000).toISOString();

  const tasks = blocks.flatMap((b) =>
    (b.actions?.length ? b.actions : ["Action"]).map(a => ({
      title: `[${b.capacity.toUpperCase()}] ${a}`,
      description: a,
      capacity: b.capacity,
      leverage: b.sprintLevel,
      guardrails: decision.guardrails?.caps,
      dueAt,
      meta: { order: b.order, loopCode, srt: decision.srt, consent: decision.consent }
    }))
  );

  // Idempotency key on (decisionHash + title)
  return tasks.map(t => ({
    ...t,
    id: `${decision.decisionId}:${t.title}`
  }));
}