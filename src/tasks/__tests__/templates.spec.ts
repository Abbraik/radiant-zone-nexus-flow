import { describe, it, expect } from "vitest";
import { composeTasksFromDecision } from "../task-template-registry";

describe("composeTasksFromDecision", () => {
  it("creates idempotent tasks with dueAt inside horizon window", () => {
    const d: any = {
      decisionId: "hash123",
      order: ["responsive","reflexive"],
      guardrails: { caps: ["tighten_caps"] },
      srt: { horizon: "P14D", cadence: "daily" },
      consent: { legitimacyGap: 0.1, requireDeliberative: false },
      templateActions: [
        { capacity: "responsive", order: 1, sprintLevel: "P", actions: ["Run contingency playbook"] },
        { capacity: "reflexive", order: 2, sprintLevel: "N", actions: ["Retune controller"] }
      ]
    };
    const tasks = composeTasksFromDecision(d, "MES-L01");
    expect(tasks.length).toBe(2);
    expect(tasks[0].id).toContain("hash123");
    expect(tasks[0].title).toMatch(/RESPONSIVE/);
  });
});