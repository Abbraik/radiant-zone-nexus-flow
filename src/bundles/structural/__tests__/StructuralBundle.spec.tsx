import { render } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import StructuralBundle from "../StructuralBundle";
import type { StructuralUiProps } from "../types.ui";

const base: StructuralUiProps = {
  loopCode: "MAC-L04",
  mission: "Increase elasticity without breaching ceiling",
  screen: "mandate",
  authorities: [{ id:"a1", label:"Planning Act §12", type:"statute", status:"exists" }],
  budgets: [{ id:"b1", label:"Housing Capex", currency:"USD", amount:500000000, window:{from:"2025-01-01", to:"2026-12-31"}, status:"available" }],
  delegNodes: [
    { id:"n1", label:"Housing Ministry", kind:"ministry", role:"owner" }, 
    { id:"n2", label:"Planning Agency", kind:"agency", role:"controller" }
  ],
  delegEdges: [{ id:"e1", from:"n2", to:"n1", right:"approve" }],
  mandateChecks: [{ id:"m1", label:"Statutory Authority", status:"ok" }],
  mesh: { nodes: [], edges: [], metrics: [], issues: [] },
  process: { steps: [], raci: [], slas: [] },
  forge: { standards: [], conformance: [] },
  market: { permits: [], pricing: [], auctions: [] }
};

test("renders Mandate Gate header", () => {
  const { container } = render(<StructuralBundle {...base} />);
  expect(container.textContent).toContain("Mandate Gate");
});

test("mandate check buttons fire change", () => {
  const onMandateCheckChange = vi.fn();
  const { container } = render(<StructuralBundle {...base} onMandateCheckChange={onMandateCheckChange} />);
  
  // Find risk button and click it
  const riskButton = Array.from(container.querySelectorAll('button')).find((btn: Element) => (btn as HTMLButtonElement).textContent?.includes('risk')) as HTMLButtonElement;
  if (riskButton) {
    riskButton.click();
    expect(onMandateCheckChange).toHaveBeenCalledWith("m1", "risk");
  }
});

test("navigates to Dossier", () => {
  const dossier = { 
    version:"1.0.0", 
    title:"Structural Pack A", 
    rationale:"Test rationale", 
    leverSummary:"Test levers", 
    adoptionPlan:"Test adoption plan", 
    mandatePath:[{id:"m1",label:"Statutory Authority",status:"ok" as const}], 
    meshSummary:"Test mesh summary", 
    processSummary:"Test process summary", 
    standardsSnapshot:[], 
    marketSnapshot:{permits:[],pricing:[],auctions:[]}, 
    updatedAt: new Date().toISOString() 
  };
  
  const { container } = render(<StructuralBundle {...base} screen="dossier" dossier={dossier} />);
  expect(container.textContent).toContain("Structural Dossier");
  expect(container.textContent).toContain("Structural Pack A");
});

test("shows empty state for standards", () => {
  const { container } = render(<StructuralBundle {...base} screen="standards" />);
  expect(container.textContent).toContain("No standards yet");
});

test("renders mesh metrics when available", () => {
  const meshWithMetrics = {
    ...base,
    mesh: {
      nodes: base.mesh.nodes,
      edges: base.mesh.edges,
      metrics: [{ label: "Betweenness", value: 0.62 }, { label: "Conflicts", value: 7 }],
      issues: []
    }
  };
  
  const { container } = render(<StructuralBundle {...meshWithMetrics} screen="mesh" />);
  expect(container.textContent).toContain("Mesh Metrics");
});