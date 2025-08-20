import { describe, it, expect } from "vitest";
import { computeCapacityDecision } from "..";
import type { SignalReading } from "../types";

describe("computeCapacityDecision", () => {
  it("prioritizes Responsive on severe breach with thin buffers", () => {
    const r: SignalReading = {
      loopCode: "MES-L01",
      indicator: "Median Wait",
      value: 90, lower: 7, upper: 30,
      slope: 5, bufferAdequacy: 10, guardrailViolation: true
    };
    const d = computeCapacityDecision(r);
    expect(d.primary).toBe("responsive");
    expect(d.srt.horizon).toBe("P7D");
  });

  it("prioritizes Anticipatory when EWS high and pre-breach", () => {
    const r: SignalReading = {
      loopCode: "MAC-L06",
      indicator: "Export Orderbook",
      value: 60, lower: 45, upper: 70,
      ewsProb: 0.85, bufferAdequacy: 25
    };
    const d = computeCapacityDecision(r);
    expect(d.primary).toBe("anticipatory");
  });

  it("prioritizes Reflexive when oscillation and RMSE are high", () => {
    const r: SignalReading = {
      loopCode: "META-L02",
      indicator: "Variance of Error",
      value: 0.9, lower: 0.2, upper: 0.8,
      oscillation: 0.9, rmseRel: 0.8
    };
    const d = computeCapacityDecision(r);
    expect(d.primary).toBe("reflexive");
  });

  it("prioritizes Deliberative when legitimacy gap & dispersion high", () => {
    const r: SignalReading = {
      loopCode: "MAC-L08",
      indicator: "Trust Index",
      value: 0.5, lower: 0.55, upper: 0.8,
      legitimacyGap: 0.7, dispersion: 0.6
    };
    const d = computeCapacityDecision(r);
    expect(d.primary).toBe("deliberative");
    expect(d.consent.requireDeliberative).toBe(true);
  });

  it("prioritizes Structural when persistence & integral error high", () => {
    const r: SignalReading = {
      loopCode: "MAC-L04",
      indicator: "Price-to-Income",
      value: 8, lower: 3, upper: 6,
      persistencePk: 70, integralError: 0.8, dataPenalty: 0.3
    };
    const d = computeCapacityDecision(r);
    expect(d.primary).toBe("structural");
    expect(d.srt.horizon).toBe("P90D");
  });
});