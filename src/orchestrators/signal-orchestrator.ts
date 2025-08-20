import { computeCapacityDecision } from "@/services/capacity-decision/index";
import { routeFromDecision } from "@/routing/capacity-router";
import { composeTasksFromDecision } from "@/tasks/task-template-registry";
import type { SignalReading } from "@/services/capacity-decision/types";

// These functions should be provided by your app shell
declare function navigate(path: string, params?: Record<string, any>): void;
declare function openClaimDrawer(tasks: Array<any>): void;
declare function auditDecision(loopCode: string, indicator: string, decision: any, decisionHash: string): void;

export function processSignal(payload: {
  reading: SignalReading;
  ui?: { lastAutoRouteAt?: number; lifeSafety?: boolean; };
}) {
  const { reading, ui } = payload;
  const decision = computeCapacityDecision(reading);

  const route = routeFromDecision(reading.loopCode, decision, {
    respectCooldownMs: decision.guardrails.coolDownMs,
    lastAutoRouteAt: ui?.lastAutoRouteAt,
    lifeSafety: ui?.lifeSafety
  });

  if (route) {
    navigate(route.path, route.params);
    const tasks = composeTasksFromDecision(decision, reading.loopCode);
    openClaimDrawer(tasks);
    auditDecision(reading.loopCode, reading.indicator, decision, route.decisionHash);
  }

  return { decision, routePreview: route };
}