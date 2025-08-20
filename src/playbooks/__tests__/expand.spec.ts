import { describe, it, expect } from "vitest";
import { expandResponsivePlaybook } from "../expand";
import { responsivePlaybooks } from "../responsive.default";

describe("expandResponsivePlaybook", () => {
  it("expands actions and keeps idempotency", () => {
    const pb = responsivePlaybooks[0];
    const decision: any = {
      decisionId: "hash",
      loopCode: pb.loops[0],
      guardrails: { caps: ["timebox_14d"] },
      srt: { horizon: "P14D", cadence: "daily" }
    };
    const tasks = expandResponsivePlaybook(decision, pb);
    expect(tasks.length).toBeGreaterThan(0);
    expect(new Set(tasks.map(t=>t.id)).size).toBe(tasks.length);
  });
});