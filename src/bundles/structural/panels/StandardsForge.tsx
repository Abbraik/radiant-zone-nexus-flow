import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SCard } from "../StructuralPrimitives";
import type { StructuralUiProps, StandardSpec } from "../types.ui";

export default function StandardsForge(props: StructuralUiProps){
  const { forge, delegNodes, onStandardEdit, onConformanceToggle } = props;

  const handleAddStandard = () => {
    const newStandard: StandardSpec = {
      id: crypto.randomUUID(),
      name: "New Standard",
      kind: "schema",
      version: "0.1.0",
      status: "draft"
    };
    onStandardEdit?.(newStandard);
  };

  return (
    <div className="grid gap-3">
      <SCard title="Standards Catalogue" subtitle="Schemas, APIs, MRV, procurement specs" right={<Button size="sm" onClick={handleAddStandard}>Add</Button>}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {forge.standards.map(s=>(
            <div key={s.id} className="rounded-xl border bg-background p-3">
              <div className="text-sm font-medium text-foreground">
                {s.name} <span className="text-muted-foreground">v{s.version}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {s.kind} · {s.status}
                {s.ownerNodeId ? ` · Owner: ${labelOf(delegNodes,s.ownerNodeId)}` : ""}
              </div>
              {s.summary && <div className="text-xs mt-1 text-muted-foreground">{s.summary}</div>}
              <div className="mt-2">
                <Badge 
                  variant={
                    s.status==="adopted" ? "default" : 
                    s.status==="proposed" ? "secondary" : 
                    s.status==="deprecated" ? "destructive" : 
                    "outline"
                  }
                >
                  {s.status}
                </Badge>
              </div>
            </div>
          ))}
          {forge.standards.length===0 && <div className="text-muted-foreground">No standards yet.</div>}
        </div>
      </SCard>

      <SCard title="Conformance" subtitle="Actor × Standard status">
        <ul className="text-sm space-y-2">
          {forge.conformance.map(c=>(
            <li key={c.id} className="rounded-xl border bg-background p-2 flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">{labelOfStandard(forge, c.standardId)}</div>
                <div className="text-xs text-muted-foreground">
                  {labelOf(delegNodes, c.actorId)} · {c.lastRun ?? "—"}
                </div>
                {c.note && <div className="text-xs text-muted-foreground mt-1">{c.note}</div>}
              </div>
              <div className="flex gap-2">
                {(["pass","warn","fail"] as const).map(st=>(
                  <Button 
                    key={st} 
                    size="sm" 
                    variant={c.status===st?"default":"outline"} 
                    onClick={()=>onConformanceToggle?.(c.id, st)}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </li>
          ))}
          {forge.conformance.length===0 && <div className="text-muted-foreground">No conformance checks yet.</div>}
        </ul>
      </SCard>
    </div>
  );
}

function labelOf(nodes: {id:string;label:string}[], id:string){ 
  return nodes.find(n=>n.id===id)?.label ?? id; 
}

function labelOfStandard(forge: StructuralUiProps["forge"], id: string){ 
  return forge.standards.find(s=>s.id===id)?.name ?? id; 
}