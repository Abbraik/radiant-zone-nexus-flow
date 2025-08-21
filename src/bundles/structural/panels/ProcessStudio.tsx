import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SCard, TrendLine, MetricBars } from "../StructuralPrimitives";
import type { StructuralUiProps } from "../types.ui";

export default function ProcessStudio(props: StructuralUiProps){
  const { process, onProcessEdit, onRaciEdit } = props;

  return (
    <div className="grid gap-3">
      <SCard title="Process Map" subtitle="Stages, targets, variance">
        <div className="grid lg:grid-cols-3 gap-3">
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">Stages</div>
            <ul className="text-sm space-y-1">
              {process.steps.map(s=>(
                <li key={s.id} className="text-foreground">
                  <b>{s.label}</b> 
                  <span className="text-muted-foreground"> ({s.kind})</span> 
                  {s.latencyDaysTarget ? <span className="text-muted-foreground"> · ≤ {s.latencyDaysTarget}d</span> : null}
                </li>
              ))}
              {process.steps.length === 0 && <div className="text-muted-foreground">No stages defined</div>}
            </ul>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">SLAs</div>
            <ul className="text-sm space-y-1">
              {process.slas.map(s=> 
                <li key={s.id} className="text-foreground">
                  <b>{s.kpi}</b> 
                  <span className="text-muted-foreground"> @ {labelOf(process.steps,s.stepId)} → {s.target}</span>
                </li>
              )}
              {process.slas.length === 0 && <div className="text-muted-foreground">No SLAs defined</div>}
            </ul>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">RACI</div>
            <ul className="text-sm space-y-1">
              {process.raci.map(r=> 
                <li key={r.id} className="text-foreground">
                  <Badge variant={r.role === "R" ? "default" : "outline"} className="mr-1">
                    {r.role}
                  </Badge>
                  <span className="text-muted-foreground"> @ {labelOf(process.steps,r.stepId)}</span>
                </li>
              )}
              {process.raci.length === 0 && <div className="text-muted-foreground">No RACI defined</div>}
            </ul>
          </div>
        </div>
      </SCard>

      <div className="grid xl:grid-cols-2 gap-3">
        <SCard title="Latency Distribution" subtitle="Current observed">
          {process.latencyDist && process.latencyDist.length > 0 ? (
            <MetricBars data={process.latencyDist} />
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No latency data available
            </div>
          )}
        </SCard>
        <SCard title="Variance Over Time" subtitle="Target vs actual">
          {process.varianceSeries && process.varianceSeries.length > 0 ? (
            <TrendLine data={process.varianceSeries} color="--chart-3"/>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No variance data available
            </div>
          )}
        </SCard>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={()=>onProcessEdit?.({})}>
          Edit Process
        </Button>
      </div>
    </div>
  );
}

function labelOf(steps: {id:string;label:string}[], id:string){ 
  return steps.find(s=>s.id===id)?.label ?? id; 
}