import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import ResponsiveBundle from "../index";

describe("ResponsiveBundle Language System", () => {
  test("renders without crashing", () => {
    const mockProps = {
      loopCode: "MAC-L03",
      indicator: "test",
      decision: {
        severity: 0.5,
        guardrails: { timeboxDays: 14, caps: [] },
        srt: { cadence: "hourly" as const, horizon: "P14D" },
        consent: { requireDeliberative: false, legitimacyGap: 0.1 },
        order: ["responsive" as const],
        templateActions: [],
        decisionId: "test-decision",
        scores: { responsive: 1.0, reflexive: 0.3, deliberative: 0.2, anticipatory: 0.1, structural: 0.2 },
        primary: "responsive" as const,
        secondary: undefined,
        loopCode: "MAC-L03",
        indicator: "test"
      }
    };
    const { container } = render(<ResponsiveBundle {...mockProps} />);
    expect(container).toBeTruthy();
  });
});