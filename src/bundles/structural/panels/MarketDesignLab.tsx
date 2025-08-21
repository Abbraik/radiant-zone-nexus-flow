import * as React from "react";
import { Button } from "@/components/ui/button";
import { SCard, MetricBars, TrendLine } from "../StructuralPrimitives";
import type { StructuralUiProps } from "../types.ui";

export default function MarketDesignLab(props: StructuralUiProps){
  const { market, onMarketEdit } = props;

  return (
    <div className="grid gap-3">
      <SCard title="Permits" subtitle="Caps, rules, MRV bindings" right={<Button size="sm" onClick={()=>onMarketEdit?.({})}>Add permit</Button>}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {market.permits.map(p=>(
            <div key={p.id} className="rounded-xl border bg-background p-3">
              <div className="text-sm font-medium text-foreground">{p.name}</div>
              <div className="text-xs text-muted-foreground">
                {p.capRule ?? "—"}
                {p.priceRule ? ` · ${p.priceRule}` : ""}
              </div>
              {p.mrvStandardId && (
                <div className="text-xs text-muted-foreground mt-1">
                  MRV Standard: {p.mrvStandardId}
                </div>
              )}
            </div>
          ))}
          {market.permits.length===0 && <div className="text-muted-foreground">No permits defined.</div>}
        </div>
      </SCard>

      <div className="grid xl:grid-cols-2 gap-3">
        <SCard title="Pricing Rules" subtitle="Indexation / congestion / scarcity">
          <ul className="text-sm space-y-2">
            {market.pricing.map(r=> 
              <li key={r.id} className="rounded-xl border bg-background p-2">
                <b className="text-foreground">{r.label}</b> 
                <span className="text-muted-foreground"> · {r.formula}</span>
              </li>
            )}
            {market.pricing.length===0 && <div className="text-muted-foreground">No pricing rules.</div>}
          </ul>
        </SCard>
        <SCard title="Auctions" subtitle="Mechanisms & parameters">
          <ul className="text-sm space-y-2">
            {market.auctions.map(a=> 
              <li key={a.id} className="rounded-xl border bg-background p-2">
                <b className="text-foreground">{a.name}</b> 
                <span className="text-muted-foreground"> · {a.mechanism}</span>
                {a.lotSize && <span className="text-muted-foreground"> · lot {a.lotSize}</span>}
                {a.reservePrice && <span className="text-muted-foreground"> · reserve {a.reservePrice}</span>}
              </li>
            )}
            {market.auctions.length===0 && <div className="text-muted-foreground">No auctions configured.</div>}
          </ul>
        </SCard>
      </div>

      <div className="grid xl:grid-cols-2 gap-3">
        <SCard title="Fairness / Incidence" subtitle="Distributional impacts">
          {market.fairnessChart && market.fairnessChart.length > 0 ? (
            <MetricBars data={market.fairnessChart}/>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No fairness data available
            </div>
          )}
        </SCard>
        <SCard title="Elasticity / Throughput" subtitle="Response to structural change">
          {market.elasticityChart && market.elasticityChart.length > 0 ? (
            <TrendLine data={market.elasticityChart} color="--chart-4"/>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No elasticity data available
            </div>
          )}
        </SCard>
      </div>
    </div>
  );
}