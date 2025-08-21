import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ResponsiveBundle from "../ResponsiveBundle";
import type { DecisionResult, SignalReading } from "@/services/capacity-decision/types";

const mockDecision: DecisionResult = {
  loopCode: "MAC-L04",
  indicator: "approval-time",
  severity: 0.7,
  scores: {
    responsive: 85,
    reflexive: 20,
    deliberative: 40,
    anticipatory: 15,
    structural: 10
  },
  order: ["responsive", "deliberative", "reflexive", "anticipatory", "structural"],
  primary: "responsive",
  secondary: "deliberative",
  guardrails: {
    timeboxDays: 14,
    caps: ["budget-cap"],
    coolDownMs: 86400000
  },
  srt: {
    cadence: "weekly",
    horizon: "P30D"
  },
  consent: {
    requireDeliberative: false,
    legitimacyGap: 0.1
  },
  templateActions: [],
  decisionId: "test-decision-id"
};

const mockReading: SignalReading = {
  loopCode: "MAC-L04",
  indicator: "approval-time",
  value: 25,
  oscillation: 0.3,
  dispersion: 0.4,
  persistencePk: 30,
  integralError: 0.3,
  hubSaturation: 0.2
};

const baseProps = {
  loopCode: "MAC-L04",
  indicator: "Stabilize approvals under ceiling",
  decision: mockDecision,
  reading: mockReading,
};

describe("ResponsiveBundle Language Features", () => {
  test("renders language toggle and learn button", () => {
    const { container } = render(<ResponsiveBundle {...baseProps} />);
    
    // Check language toggle exists
    expect(container.querySelector('[role="switch"]')).toBeTruthy();
    expect(container.textContent).toContain("Language");
    expect(container.textContent).toContain("General");
    expect(container.textContent).toContain("Expert");
    
    // Check learn button exists
    expect(container.textContent).toContain("Learn");
  });
});