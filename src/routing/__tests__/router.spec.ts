import { describe, it, expect } from "vitest";
import { routeFromDecision } from "../capacity-router";

const baseDecision = {
  loopCode: "META-L08",
  indicator: "Early Warning Score",
  severity: 0.2,
  scores: { responsive:10, reflexive:5, deliberative:15, anticipatory:90, structural:20 },
  order: ["anticipatory","structural","deliberative","responsive","reflexive"],
  primary: "anticipatory",
  srt: { horizon: "P30D", cadence: "weekly" },
  guardrails: { coolDownMs: 600000 },
  consent: { legitimacyGap: 0.2, requireDeliberative: false },
  templateActions: [],
  decisionId: "abc"
} as any;

describe("routeFromDecision", () => {
  it("routes to /workspace-5c with correct screen", () => {
    const r = routeFromDecision("META-L08", baseDecision, { respectCooldownMs: 0 });
    expect(r?.path).toBe("/workspace-5c");
    expect(r?.params.screen).toBe("trigger-library");
  });

  it("respects cooldown when elapsed < respectCooldownMs", () => {
    const r = routeFromDecision("META-L08", baseDecision, {
      respectCooldownMs: 600000, lastAutoRouteAt: Date.now()
    });
    expect(r).toBeNull();
  });
});