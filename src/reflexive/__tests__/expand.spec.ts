import { describe, it, expect } from "vitest";
import { expandReflexiveRecipe } from "../expand";
import { reflexiveRecipes } from "../recipes.default";

describe("expandReflexiveRecipe", () => {
  it("produces tuning/band/eval artifacts and idempotent task ids", () => {
    const recipe = reflexiveRecipes[0];
    const decision: any = {
      decisionId: "hash-1",
      loopCode: "META-L02",
      indicator: "Variance of Error",
      guardrails: { caps: [] },
      srt: { horizon: "P14D", cadence: "daily" }
    };
    
    const result = expandReflexiveRecipe(decision, recipe);
    
    expect(result.tasks.length).toBeGreaterThan(0);
    expect(new Set(result.tasks.map(t => t.id)).size).toBe(result.tasks.length);
    expect(result.tuning).toBeTruthy();
    expect(result.evalPlan?.method).toBeDefined();
  });

  it("handles band weight changes correctly", () => {
    const recipe = reflexiveRecipes[2]; // bands-tighten recipe
    const decision: any = {
      decisionId: "hash-2",
      loopCode: "META-L01",
      indicator: "Dispersion Index",
      guardrails: { caps: [] },
      srt: { horizon: "P28D", cadence: "weekly" }
    };
    
    const result = expandReflexiveRecipe(decision, recipe);
    
    expect(result.bands.length).toBeGreaterThan(0);
    expect(result.bands[0].tier).toBe("T2");
    expect(result.evalPlan?.method).toBe("DiD");
  });

  it("creates unique task IDs for the same decision", () => {
    const recipe = reflexiveRecipes[1];
    const decision: any = {
      decisionId: "hash-3",
      loopCode: "TEST-LOOP",
      indicator: "Test Indicator",
      guardrails: { caps: [] },
      srt: { horizon: "P21D", cadence: "daily" }
    };
    
    const result1 = expandReflexiveRecipe(decision, recipe);
    const result2 = expandReflexiveRecipe(decision, recipe);
    
    expect(result1.tasks[0].id).toBe(result2.tasks[0].id);
    expect(result1.tuning?.rationale).toBe(result2.tuning?.rationale);
  });
});