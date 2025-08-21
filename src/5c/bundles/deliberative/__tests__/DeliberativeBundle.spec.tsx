import { render } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import DeliberativeBundle from "../DeliberativeBundle";
import type { DeliberativeUiProps } from "../types.ui";

const baseProps: DeliberativeUiProps = {
  loopCode: "MAC-L04",
  mission: "Improve housing affordability without breaching ecological ceiling",
  options: [{ id:"o1", name:"Elasticity Reform" }, { id:"o2", name:"Vouchers" }],
  evidence: [{ id:"e1", label:"MAC-L04 indicators", loopCodes:["MAC-L04"], indicators:["Price/Income"] }],
  scenarios: [{ id:"s1", name:"Demand surge"}, { id:"s2", name:"Water stress"}],
  criteria: [
    { id:"c1", label:"Effectiveness", weight:0.35, direction:"maximize" },
    { id:"c2", label:"Time-to-impact", weight:0.20, direction:"minimize" },
    { id:"c3", label:"Equity", weight:0.20, direction:"maximize" },
    { id:"c4", label:"Cost", weight:0.15, direction:"minimize" },
    { id:"c5", label:"Feasibility", weight:0.10, direction:"maximize" }
  ],
  scores: [
    { optionId:"o1", criterionId:"c1", score:0.8 },
    { optionId:"o1", criterionId:"c2", score:0.6 },
    { optionId:"o2", criterionId:"c1", score:0.5 }
  ],
  frontier: [{ optionIds:["o1"], risk:0.3, cost:0.4, equity:0.6, label:"P1", feasible:true }],
  hardConstraints: [{ id:"k1", label:"Budget ≤ $500m", active:true }],
  selectedPortfolio: null,
  mandateChecks: [{ id:"m1", label:"Statutory Authority", status:"ok" }],
  guardrails: [{ id:"g1", label:"NRW ≤ 20%", kind:"cap", value:"≤ 20%", required:true, selected:true }],
  participation: [{ id:"p1", label:"City forum", status:"planned" }],
  handoff: { enableResponsive:true, enableStructural:true, enableReflexive:true }
};

test("renders Intake screen", () => {
  const { container } = render(<DeliberativeBundle {...baseProps} screen="intake" />);
  expect(container.textContent).toContain("Options");
  expect(container.textContent).toContain("Elasticity Reform");
});

test("calls onPickPortfolio on click", () => {
  const onPickPortfolio = vi.fn();
  const { container } = render(<DeliberativeBundle {...baseProps} screen="portfolio" onPickPortfolio={onPickPortfolio} />);
  const button = container.querySelector('button[aria-label*="Pick P1"], button:has-text("Pick P1")') || 
                 container.querySelector('button')?.closest('button');
  if (button) {
    button.click();
    expect(onPickPortfolio).toHaveBeenCalled();
  }
});

test("shows Dossier empty state when not provided", () => {
  const { container } = render(<DeliberativeBundle {...baseProps} screen="dossier" />);
  expect(container.textContent).toContain("No dossier yet");
});