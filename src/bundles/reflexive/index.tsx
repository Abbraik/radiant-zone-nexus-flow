import React, { useMemo, useState } from "react";
import type { DecisionResult, SignalReading } from "@/services/capacity-decision/types";
import { reflexiveRecipes } from "@/reflexive/recipes.default";
import { expandReflexiveRecipe } from "@/reflexive/expand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Settings, TrendingUp, Zap } from "lucide-react";

// Shell adapters - these would be provided by the app shell
const saveTuning = async (change: any): Promise<{id:string}> => {
  console.log('Save tuning:', change);
  return { id: 'tuning-' + Date.now() };
};

const saveBandWeight = async (change: any): Promise<{id:string}> => {
  console.log('Save band weight:', change);
  return { id: 'band-' + Date.now() };
};

const saveEvaluation = async (plan: any): Promise<{id:string}> => {
  console.log('Save evaluation:', plan);
  return { id: 'eval-' + Date.now() };
};

const createTasks = async (tasks: any[]): Promise<void> => {
  console.log('Create tasks:', tasks);
};

const openClaimDrawer = (tasks: any[]): void => {
  console.log('Open claim drawer:', tasks);
};

type Props = {
  loopCode: string;
  indicator: string;
  decision: DecisionResult;
  reading?: SignalReading;
  screen?: "controller-tuner" | "bands-weights";
  onHandoff?: (to: "responsive"|"deliberative"|"structural", reason: string) => void;
};

export const ReflexiveBundle: React.FC<Props> = ({ 
  loopCode, 
  indicator, 
  decision, 
  reading, 
  screen = "controller-tuner", 
  onHandoff 
}) => {
  const [busy, setBusy] = useState(false);
  
  const recipes = useMemo(() => {
    return reflexiveRecipes.filter(r =>
      r.appliesTo.some(tok => new RegExp(tok).test(loopCode))
    );
  }, [loopCode]);

  const chosen = recipes[0];

  async function applyRecipe() {
    if (!chosen) return;
    setBusy(true);
    try {
      const { tasks, tuning, bands, evalPlan } = expandReflexiveRecipe(decision, chosen);
      if (tuning) await saveTuning(tuning);
      if (bands) for (const b of bands) await saveBandWeight(b);
      if (evalPlan) await saveEvaluation(evalPlan);
      if (tasks.length) {
        await createTasks(tasks);
        openClaimDrawer(tasks);
      }
    } finally {
      setBusy(false);
    }
  }

  // Handoff logic
  const toResponsive = (reading?.severity ?? decision.severity) >= 0.5 && (reading?.slope ?? 0) > 0;
  const toDeliberative = (reading?.dispersion ?? 0) >= 0.5 || decision.consent.requireDeliberative;
  const toStructural = ((reading?.persistencePk ?? 0)/100) >= 0.5 || (reading?.integralError ?? 0) >= 0.5;

  function handoff(to: "responsive"|"deliberative"|"structural") {
    const reason =
      to === "responsive" ? "Retune risk requires short-term containment" :
      to === "deliberative" ? "Trade-offs/consent threshold reached" :
      "Chronic drift indicates structural cause";
    onHandoff?.(to, reason);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            Reflexive · {screen === "bands-weights" ? "Bands & Weights" : "Controller Tuner"}
          </div>
          <h1 className="text-2xl font-semibold">{loopCode} · {indicator}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span>Oscillation {(reading?.oscillation ?? 0).toFixed(2)}</span>
            <span>RMSE {(reading?.rmseRel ?? 0).toFixed(2)}</span>
            <span>Dispersion {(reading?.dispersion ?? 0).toFixed(2)}</span>
          </div>
        </div>
        {decision.consent.requireDeliberative && (
          <Badge variant="outline" className="border-warning text-warning">
            Consent gate active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controller/Bands */}
        <div className="space-y-6">
          {screen === "controller-tuner" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Controller Tuner
                </CardTitle>
                <CardDescription>
                  Family: PID → PI (recipe), gain scale, and param sets per recipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chosen && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="font-medium">{chosen.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {chosen.rationaleHint}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {chosen.actions.map((action, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {action.kind}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button 
                    onClick={applyRecipe} 
                    disabled={busy || !chosen}
                    className="w-full"
                  >
                    {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {busy ? "Applying…" : `Apply Recipe: ${chosen?.name || "—"}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Bands & Weights Studio
                </CardTitle>
                <CardDescription>
                  Adjust DE-bands and Tier weights per META-L01
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={applyRecipe} 
                  disabled={busy || !chosen}
                  className="w-full"
                >
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {busy ? "Saving…" : `Save Band/Weight Change via ${chosen?.name || "Recipe"}`}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Experiments & Evaluation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Evaluation
              </CardTitle>
              <CardDescription>
                Auto-create ITS/DiD plan from recipe; review date set from recipe horizon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chosen?.evaluation && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium">Method: {chosen.evaluation.method}</div>
                  <div className="text-sm text-muted-foreground">
                    Review in {chosen.evaluation.reviewInDays} days
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Indicators: {chosen.evaluation.indicators.join(", ")}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Handoffs */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Handoffs</CardTitle>
              <CardDescription>
                Route to other capacities based on signal conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  disabled={!toResponsive}
                  onClick={() => handoff("responsive")}
                  className="w-full justify-start"
                >
                  → Responsive (contain)
                </Button>
                {!toResponsive && (
                  <p className="text-xs text-muted-foreground">
                    Enable when severity ≥ 0.5 and slope > 0
                  </p>
                )}

                <Button
                  variant="outline"
                  disabled={!toDeliberative}
                  onClick={() => handoff("deliberative")}
                  className="w-full justify-start"
                >
                  → Deliberative (trade-offs)
                </Button>
                {!toDeliberative && (
                  <p className="text-xs text-muted-foreground">
                    Enable when dispersion ≥ 0.5 or consent required
                  </p>
                )}

                <Button
                  variant="outline"
                  disabled={!toStructural}
                  onClick={() => handoff("structural")}
                  className="w-full justify-start"
                >
                  → Structural (mandate/pathway)
                </Button>
                {!toStructural && (
                  <p className="text-xs text-muted-foreground">
                    Enable when persistence ≥ 0.5 or integral error ≥ 0.5
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReflexiveBundle;