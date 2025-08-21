import { describe, it, expect } from "vitest";
import { expandAnticipatory } from "../expand";
import { anticPlaybooks, scenarios } from "../catalogs.default";

describe("expandAnticipatory", () => {
  const baseDecision: any = {
    decisionId: "hashA",
    scores: { anticipatory: 80 },
    loopCode: "MAC-L06",
    guardrails: { caps: [] },
    srt: { horizon: "P30D", cadence: "weekly" }
  };

  it("creates tasks + watchpoint + trigger from playbook", () => {
    const out = expandAnticipatory(baseDecision, { playbook: anticPlaybooks[0], scenario: null, ttlDays: 30 });
    expect(out.tasks.length).toBeGreaterThan(0);
    expect(out.watchpoint.status).toBe("armed");
    expect(out.trigger?.name).toBeDefined();
  });

  it("produces scenario result when scenario provided", () => {
    const out = expandAnticipatory(baseDecision, { playbook: null, scenario: scenarios[0], ttlDays: 30 });
    expect(out.scenarioResult?.mitigationDelta).toBeGreaterThan(0);
  });

  it("sets correct watchpoint properties", () => {
    const out = expandAnticipatory(baseDecision, { playbook: anticPlaybooks[0], scenario: null, ttlDays: 30 });
    expect(out.watchpoint.loopCodes).toContain("MAC-L06");
    expect(out.watchpoint.ewsProb).toBeGreaterThanOrEqual(0);
    expect(out.watchpoint.reviewAt).toBeDefined();
  });

  it("handles missing playbook gracefully", () => {
    const out = expandAnticipatory(baseDecision, { playbook: null, scenario: null, ttlDays: 30 });
    expect(out.tasks.length).toBeGreaterThan(0); // should have base tasks
    expect(out.watchpoint).toBeDefined();
    expect(out.trigger).toBeNull();
  });
});