import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SCard } from "../StructuralPrimitives";
import type { StructuralUiProps, MandateCheckUI } from "../types.ui";

export default function MandateGate(props: StructuralUiProps){
  const { authorities, budgets, delegNodes, delegEdges, mandateChecks, onMandateCheckChange, onAddAuthority, onAddBudget, onDelegationEdit } = props;

  return (
    <div className="grid gap-3">
      <SCard title="Authority Sources" subtitle="Statutes, regulations, orders, budget rules" right={<Button size="sm" onClick={()=>onAddAuthority?.()}>Add source</Button>}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {authorities.map(a=>(
            <div key={a.id} className="rounded-xl border bg-background p-3">
              <div className="text-sm font-medium text-foreground">{a.label}</div>
              <div className="text-xs text-muted-foreground">{a.type} · {a.status}{a.link?` · link`:``}</div>
              {a.note && <div className="text-xs mt-1 text-muted-foreground">{a.note}</div>}
            </div>
          ))}
          {authorities.length===0 && <div className="text-muted-foreground">No authority sources yet.</div>}
        </div>
      </SCard>

      <SCard title="Budget Envelopes" subtitle="Availability by window" right={<Button size="sm" variant="outline" onClick={()=>onAddBudget?.()}>Add envelope</Button>}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {budgets.map(b=>(
            <div key={b.id} className="rounded-xl border bg-background p-3">
              <div className="text-sm font-medium text-foreground">{b.label}</div>
              <div className="text-xs text-muted-foreground">{b.currency} {new Intl.NumberFormat().format(b.amount)} · {b.window.from} → {b.window.to}</div>
              <Badge 
                variant={b.status==="available" ? "default" : b.status==="constrained" ? "secondary" : "destructive"} 
                className="mt-2"
              >
                {b.status}
              </Badge>
              {b.note && <div className="text-xs mt-1 text-muted-foreground">{b.note}</div>}
            </div>
          ))}
          {budgets.length===0 && <div className="text-muted-foreground">No budget envelopes yet.</div>}
        </div>
      </SCard>

      <SCard title="Delegation Lattice" subtitle="Who decides, approves, coordinates, funds">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">Actors</div>
            <ul className="text-sm space-y-1">
              {delegNodes.map(n=>(
                <li key={n.id} className="text-foreground">
                  <span className="font-medium">{n.label}</span> 
                  <span className="text-muted-foreground"> · {n.kind}{n.role?` · ${n.role}`:""}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-background p-3">
            <div className="text-sm font-medium mb-2 text-foreground">Rights</div>
            <ul className="text-sm space-y-1">
              {delegEdges.map(e=>(
                <li key={e.id} className="flex items-center justify-between">
                  <span className="text-foreground">
                    <span className="font-medium">{labelOf(delegNodes,e.from)}</span> → <span className="font-medium">{labelOf(delegNodes,e.to)}</span> 
                    <span className="text-muted-foreground"> ({e.right})</span>
                  </span>
                  <Button variant="outline" size="sm" onClick={()=>onDelegationEdit?.(e)}>Edit</Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SCard>

      <SCard title="Mandate Checks" subtitle="Gate conditions for lawful, viable rollout">
        <div className="grid md:grid-cols-3 gap-3">
          {mandateChecks.map(m=>(
            <div key={m.id} className="rounded-xl border bg-background p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium text-foreground">{m.label}</div>
                <Badge 
                  variant={m.status==="ok" ? "default" : m.status==="risk" ? "secondary" : "destructive"}
                >
                  {m.status}
                </Badge>
              </div>
              {m.note && <div className="mt-1 text-xs text-muted-foreground">{m.note}</div>}
              <div className="mt-2 flex gap-2">
                {(["ok","risk","fail"] as const).map(s=>(
                  <Button 
                    key={s} 
                    size="sm" 
                    variant={m.status===s?"default":"outline"} 
                    onClick={()=>onMandateCheckChange?.(m.id, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

function labelOf(nodes: {id:string;label:string}[], id:string){ 
  return nodes.find(n=>n.id===id)?.label ?? id; 
}