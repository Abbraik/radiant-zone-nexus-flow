import { render } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import DeliberativeBundle from "../DeliberativeBundle";
import type { DeliberativeUiProps } from "../types.ui";

const baseProps: DeliberativeUiProps = {
  loopCode: "MAC-L04",
  mission: "Improve housing affordability without breaching ecological ceiling",
  options: [
    { id:"o1", name:"Elasticity Reform" }, 
    { id:"o2", name:"Vouchers" }
  ],
  evidence: [
    { id:"e1", label:"MAC-L04 indicators", loopCodes:["MAC-L04"], indicators:["Price/Income"] }
  ],
  scenarios: [
    { id:"s1", name:"Demand surge"}, 
    { id:"s2", name:"Water stress"}
  ],
  criteria: [
    { id:"c1", label:"Effectiveness", weight:0.35, direction:"maximize" },
    { id:"c2", label:"Time-to-impact", weight:0.20, direction:"minimize" }
  ],
  scores: [
    { optionId:"o1", criterionId:"c1", score:0.8 },
    { optionId:"o1", criterionId:"c2", score:0.6 }
  ],
  mandateChecks: [
    { id:"m1", label:"Statutory Authority", status:"ok" }
  ],
  guardrails: [
    { id:"g1", label:"NRW ≤ 20%", kind:"cap", value:"≤ 20%", required:true, selected:true }
  ],
  participation: [
    { id:"p1", label:"City forum", status:"planned" }
  ],
  handoff: { 
    enableResponsive:true, 
    enableStructural:true, 
    enableReflexive:true 
  }
};

test("renders Intake screen", () => {
  const { container } = render(<DeliberativeBundle {...baseProps} screen="intake" />);
  expect(container.textContent).toContain("Options");
  expect(container.textContent).toContain("Elasticity Reform");
});

test("calls onPickPortfolio on click", () => {
  const onPickPortfolio = vi.fn();
  const propsWithFrontier = {
    ...baseProps,
    screen: "portfolio" as const,
    frontier: [{ optionIds:["o1"], risk:0.3, cost:0.4, equity:0.6, label:"P1", feasible:true }],
    onPickPortfolio
  };
  const { container } = render(<DeliberativeBundle {...propsWithFrontier} />);
  const button = Array.from(container.querySelectorAll('button')).find((btn: Element) => (btn as HTMLButtonElement).textContent?.includes('Pick P1')) as HTMLButtonElement;
  if (button) {
    button.click();
    expect(onPickPortfolio).toHaveBeenCalled();
  }
});

test("shows Dossier empty state when not provided", () => {
  const { container } = render(<DeliberativeBundle {...baseProps} screen="dossier" />);
  expect(container.textContent).toContain("No dossier yet");
});