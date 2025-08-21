import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SCard, MetricBars } from "../StructuralPrimitives";
import type { StructuralUiProps } from "../types.ui";

export default function MeshPlanner(props: StructuralUiProps){
  const { mesh, onMeshEdit } = props;
  
  return (
    <div className="grid gap-3">
      <SCard title="Coordination Mesh" subtitle="Actors and rights">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">Nodes</div>
            <ul className="text-sm list-disc list-inside space-y-1">
              {mesh.nodes.map(n=> 
                <li key={n.id} className="text-foreground">
                  {n.label} <span className="text-muted-foreground">· {n.kind}{n.role?` · ${n.role}`:""}</span>
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">Edges</div>
            <ul className="text-sm space-y-1">
              {mesh.edges.map(e=> 
                <li key={e.id} className="text-foreground">
                  <b>{labelOf(mesh.nodes,e.from)}</b> → <b>{labelOf(mesh.nodes,e.to)}</b> 
                  <span className="text-muted-foreground"> ({e.right})</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </SCard>

      <div className="grid xl:grid-cols-2 gap-3">
        <SCard title="Mesh Metrics" subtitle="SNA-like indicators">
          {mesh.metrics.length > 0 ? (
            <MetricBars data={mesh.metrics.map(m=>({ label: m.label, value: m.value }))}/>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No metrics available
            </div>
          )}
        </SCard>
        <SCard title="Open Issues" subtitle="Spillovers, conflicts, unresolved deps">
          <ul className="text-sm space-y-2">
            {mesh.issues.map(i=>(
              <li key={i.id} className="rounded-xl border bg-background p-2">
                <div className="font-medium text-foreground">{i.label}</div>
                <div className="text-xs text-muted-foreground">
                  Severity: 
                  <Badge 
                    variant={i.severity === "high" ? "destructive" : i.severity === "med" ? "secondary" : "outline"}
                    className="ml-1 mr-1"
                  >
                    {i.severity}
                  </Badge>
                  {i.loopRefs?.length ? ` · Loops: ${i.loopRefs.join(", ")}` : ""}
                </div>
                {i.note && <div className="text-xs text-muted-foreground mt-1">{i.note}</div>}
              </li>
            ))}
            {mesh.issues.length===0 && <div className="text-muted-foreground">No issues.</div>}
          </ul>
        </SCard>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={()=>onMeshEdit?.({})}>
          Propose Coordination Rights
        </Button>
      </div>
    </div>
  );
}

function labelOf(nodes: {id:string;label:string}[], id:string){ 
  return nodes.find(n=>n.id===id)?.label ?? id; 
}