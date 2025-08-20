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
  // Provide defaults for missing properties to prevent runtime errors
  const safeDecision = {
    order: ["responsive" as const],
    templateActions: [] as CapacityAction[],
    decisionId: `decision-${Date.now()}`,
    srt: { horizon: "P30D", cadence: "1 hour" },
    guardrails: { caps: [] as string[] },
    consent: { requireDeliberative: false },
    scores: { responsive: 1.0 },
    primary: "responsive" as const,
    secondary: undefined,
    ...decision,
    // Ensure loopCode and indicator are set
    loopCode: decision.loopCode || loopCode,
    indicator: decision.indicator || "primary"
  };

  const blocks: CapacityAction[] = safeDecision.templateActions?.length
    ? safeDecision.templateActions
    : (safeDecision.order || ["responsive"]).map((c, i) => ({
        capacity: c,
        order: i+1,
        sprintLevel: c === "structural" ? "S" as Leverage : c === "responsive" || c === "anticipatory" ? "P" as Leverage : "N" as Leverage,
        actions: []
      }));

  const horizonDays = mapISOtoDays(safeDecision.srt.horizon);
  const dueAt = new Date(Date.now() + Math.min(horizonDays, 30)*24*3600*1000).toISOString();

  const tasks = blocks.flatMap((b) =>
    (b.actions?.length ? b.actions : ["Action"]).map(a => ({
      title: `[${b.capacity.toUpperCase()}] ${a}`,
      description: a,
      capacity: b.capacity,
      leverage: b.sprintLevel,
      guardrails: safeDecision.guardrails?.caps,
      dueAt,
      meta: { order: b.order, loopCode, srt: safeDecision.srt, consent: safeDecision.consent }
    }))
  );

  // Idempotency key on (decisionHash + title)
  return tasks.map(t => ({
    ...t,
    id: `${safeDecision.decisionId}:${t.title}`
  }));
}