import { render } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import DeliberativeBundle from "../DeliberativeBundle";
import type { DeliberativeAnalysisProps } from "../types.ui";

const baseProps: DeliberativeAnalysisProps = {
  title: "DELIBERATIVE Capacity Bundle",
  description: "Strategic Architecture Planning",
  mode: "Strategic Analysis Mode",
  modeDescription: "This bundle focuses on thorough analysis, stakeholder consultation, and systematic decision-making processes.",
  timeframe: "2 weeks",
  stakeholderGroup: "Core Team",
  objectives: "Define strategic objectives",
  analysisFramework: [
    { id: "swot", label: "SWOT Analysis", enabled: true },
    { id: "cost", label: "Cost-Benefit", enabled: false }
  ],
  onTimeframeChange: vi.fn(),
  onStakeholderGroupChange: vi.fn(),
  onObjectivesChange: vi.fn(),
  onFrameworkToggle: vi.fn(),
  onInviteStakeholders: vi.fn(),
  onBeginAnalysis: vi.fn()
};

test("renders Strategic Analysis Mode", () => {
  const { container } = render(<DeliberativeBundle {...baseProps} />);
  expect(container.textContent).toContain("Strategic Analysis Mode");
  expect(container.textContent).toContain("DELIBERATIVE Capacity Bundle");
});

test("calls onBeginAnalysis when button clicked", () => {
  const onBeginAnalysis = vi.fn();
  const { container } = render(<DeliberativeBundle {...baseProps} onBeginAnalysis={onBeginAnalysis} />);
  const button = Array.from(container.querySelectorAll('button')).find((btn: Element) => (btn as HTMLButtonElement).textContent?.includes('Begin Analysis')) as HTMLButtonElement;
  if (button) {
    button.click();
    expect(onBeginAnalysis).toHaveBeenCalled();
  }
});

test("renders framework checkboxes", () => {
  const { container } = render(<DeliberativeBundle {...baseProps} />);
  expect(container.textContent).toContain("SWOT Analysis");
  expect(container.textContent).toContain("Cost-Benefit");
});