import * as React from "react";
import { Button } from "@/components/ui/button";
import { SCard } from "../StructuralPrimitives";
import type { StructuralUiProps } from "../types.ui";

export default function StructuralDossier(props: StructuralUiProps){
  const { dossier, onExportDossier } = props;

  return (
    <div className="grid gap-3">
      <SCard title="Structural Dossier" subtitle="Versioned, auditable">
        {dossier ? (
          <div className="grid gap-3">
            <div className="rounded-xl border bg-background p-3">
              <div className="text-sm font-medium text-foreground">{dossier.title}</div>
              <div className="text-xs text-muted-foreground">
                v{dossier.version} · {new Date(dossier.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-3">
              <SCard title="Rationale">
                <div className="text-sm text-foreground">{dossier.rationale}</div>
              </SCard>
              <SCard title="Selected Levers">
                <div className="text-sm text-foreground">{dossier.leverSummary}</div>
              </SCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-3">
              <SCard title="Mandate Path">
                <ul className="text-sm list-disc list-inside space-y-1">
                  {dossier.mandatePath.map(m=> 
                    <li key={m.id} className="text-foreground">
                      {m.label} — <span className="text-muted-foreground">{m.status}</span>
                    </li>
                  )}
                </ul>
              </SCard>
              <SCard title="Mesh Summary">
                <div className="text-sm text-foreground">{dossier.meshSummary}</div>
              </SCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-3">
              <SCard title="Process Summary">
                <div className="text-sm text-foreground">{dossier.processSummary}</div>
              </SCard>
              <SCard title="Adoption Plan">
                <div className="text-sm text-foreground">{dossier.adoptionPlan}</div>
              </SCard>
            </div>

            <SCard title="Standards Snapshot">
              <ul className="text-sm list-disc list-inside space-y-1">
                {dossier.standardsSnapshot.map(s=> 
                  <li key={s.id} className="text-foreground">
                    {s.name} v{s.version} — <span className="text-muted-foreground">{s.status}</span>
                  </li>
                )}
                {dossier.standardsSnapshot.length === 0 && (
                  <div className="text-muted-foreground">No standards in snapshot</div>
                )}
              </ul>
            </SCard>

            <SCard title="Market Snapshot">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Permits</div>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {dossier.marketSnapshot.permits.map(p=> 
                      <li key={p.id} className="text-foreground">Permit: {p.name}</li>
                    )}
                    {dossier.marketSnapshot.permits.length === 0 && (
                      <div className="text-muted-foreground">None</div>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Pricing</div>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {dossier.marketSnapshot.pricing.map(p=> 
                      <li key={p.id} className="text-foreground">Pricing: {p.label}</li>
                    )}
                    {dossier.marketSnapshot.pricing.length === 0 && (
                      <div className="text-muted-foreground">None</div>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Auctions</div>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {dossier.marketSnapshot.auctions.map(a=> 
                      <li key={a.id} className="text-foreground">
                        Auction: {a.name} ({a.mechanism})
                      </li>
                    )}
                    {dossier.marketSnapshot.auctions.length === 0 && (
                      <div className="text-muted-foreground">None</div>
                    )}
                  </ul>
                </div>
              </div>
            </SCard>

            {dossier.attachments && dossier.attachments.length > 0 && (
              <SCard title="Attachments">
                <ul className="text-sm space-y-1">
                  {dossier.attachments.map((att, index) => (
                    <li key={index} className="text-foreground">
                      {att.link ? (
                        <a href={att.link} className="text-primary hover:underline">
                          {att.label}
                        </a>
                      ) : (
                        att.label
                      )}
                    </li>
                  ))}
                </ul>
              </SCard>
            )}

            <div className="flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={()=>onExportDossier?.()}>
                Export Dossier
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">
            No dossier yet. Fill out Mandate, Mesh, Process, Standards, and Market, then publish from backend.
          </div>
        )}
      </SCard>
    </div>
  );
}