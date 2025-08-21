import React from "react";
import type { AnticipatoryUiProps, WatchboardCard } from "./types.ui";
import { AlertTriangle, ChevronRight, Gauge, Clock, Activity, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
  const Cls = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const tone = trend === "up" ? "text-warning" : trend === "down" ? "text-success" : "text-muted-foreground";
  return <Cls className={`h-4 w-4 ${tone}`} aria-label={trend || "flat"} />;
}

function Card({ children }: React.PropsWithChildren<{}>) {
  return <div className="rounded-2xl border bg-card p-3">{children}</div>;
}

export default function AnticipatoryBundle(props: AnticipatoryUiProps) {
  const {
    loopCode, ewsProb = 0, leadTimeDays = 0, bufferAdequacy = null,
    consentRequired, screen = "risk-watchboard",
    watchboard, scenarios, prePositionPacks, triggerTemplates,
    onArmWatchpoint, onRunScenario, onStagePrePosition, onSaveTrigger,
    handoff, onEvent, busy, errorText
  } = props;

  function emit(name: string, payload?: Record<string, any>) { props.onEvent?.(name, payload); }

  return (
    <div className="grid gap-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Anticipatory · {screen.replace("-", " ")}</div>
          <div className="text-xl font-semibold">{loopCode}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" /> EWS {(ewsProb).toFixed(2)}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Lead-time ~{leadTimeDays}d</span>
            <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> Buffers {bufferAdequacy == null ? "—" : bufferAdequacy.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consentRequired && (
            <span className="text-xs px-2 py-1 rounded-full border text-warning">Consent gate</span>
          )}
        </div>
      </header>

      {/* Screen Navigation */}
      <nav className="flex gap-2 flex-wrap">
        {[
          { id: "risk-watchboard", label: "Risk Watchboard" },
          { id: "scenario-sim", label: "Scenario Simulator" },
          { id: "pre-positioner", label: "Pre-Positioner" },
          { id: "trigger-library", label: "Trigger Library" }
        ].map(screenOption => {
          const isActive = screen === screenOption.id;
          const url = new URL(window.location.href);
          url.searchParams.set('screen', screenOption.id);
          
          return (
            <button
              key={screenOption.id}
              className={`px-3 py-1 rounded text-sm border transition-colors ${
                isActive 
                  ? "bg-accent text-accent-foreground border-accent" 
                  : "bg-background hover:bg-muted border-border"
              }`}
              onClick={() => window.location.href = url.toString()}
            >
              {screenOption.label}
            </button>
          );
        })}
      </nav>

      {/* Error banner (UI-only) */}
      {errorText ? (
        <div role="status" className="rounded-2xl border bg-background p-3 text-destructive text-sm">
          {errorText}
        </div>
      ) : null}

      {/* Screens */}
      {screen === "risk-watchboard" && (
        <section className="grid gap-3">
          <Card>
            <div className="font-medium">Risk Watchboard</div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">
              {watchboard.length === 0 ? (
                <div className="col-span-full text-sm text-muted-foreground text-center py-8">No risk channels yet</div>
              ) : (
                watchboard.map((w: WatchboardCard) => (
                  <div key={w.riskChannel} className="rounded-xl border p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{w.riskChannel}</div>
                      <TrendIcon trend={w.trend} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      EWS {(w.ewsProb).toFixed(2)} · Lead-time {w.leadTimeDays ?? "—"}d
                    </div>
                    <div className="mt-2 text-xs">Linked: {w.linkedLoops.join(", ") || "—"}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="px-2 py-1 rounded border text-xs disabled:opacity-50 focus:ring-2 focus:ring-ring"
                        onClick={() => { onArmWatchpoint?.(w.riskChannel); emit("antic_arm_watchpoint", { riskChannel: w.riskChannel }); }}
                        disabled={busy}
                      >
                        Arm Watchpoint
                      </button>
                      {w.bufferAdequacy != null && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${w.bufferAdequacy < 0.3 ? "text-warning" : "text-muted-foreground"}`}>
                          Buffers {w.bufferAdequacy.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      )}

      {screen === "scenario-sim" && (
        <section className="grid gap-3">
          <Card>
            <div className="font-medium">Scenario & Stress Simulator</div>
            <div className="text-sm text-muted-foreground">Run a scenario, compare with/without mitigation, then plan tasks.</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {scenarios.length === 0 ? (
                <div className="w-full text-sm text-muted-foreground text-center py-4">No scenarios available</div>
              ) : (
                scenarios.map(s => (
                  <button key={s.id}
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50 focus:ring-2 focus:ring-ring"
                    onClick={() => { onRunScenario?.(s.id); emit("antic_run_scenario", { scenarioId: s.id }); }}
                    disabled={busy}
                    title={s.summary}
                  >
                    Run: {s.name}
                  </button>
                ))
              )}
            </div>
          </Card>
        </section>
      )}

      {screen === "pre-positioner" && (
        <section className="grid gap-3">
          <Card>
            <div className="font-medium">Pre-Positioner</div>
            <div className="text-sm text-muted-foreground">Stage resources, regulatory, and comms packs (quiet, no public activation).</div>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
              {prePositionPacks.length === 0 ? (
                <div className="col-span-full text-sm text-muted-foreground text-center py-8">No pre-position packs available</div>
              ) : (
                prePositionPacks.map(p => (
                  <div key={p.id} className="rounded-xl border p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{p.title}</div>
                      <span className="text-xs text-muted-foreground">{p.status ?? "draft"}</span>
                    </div>
                    <ul className="mt-2 text-xs list-disc list-inside text-muted-foreground">
                      {p.items.map((i, idx) => <li key={idx}><span className="text-foreground">{i.label}</span>{i.note ? ` — ${i.note}` : ""}</li>)}
                    </ul>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3">
              <button
                className="px-3 py-1 rounded bg-accent text-accent-foreground text-sm disabled:opacity-50 focus:ring-2 focus:ring-ring"
                onClick={() => { onStagePrePosition?.(prePositionPacks.map(p=>p.id)); emit("antic_stage_preposition", { packs: prePositionPacks.map(p=>p.id) }); }}
                disabled={busy || prePositionPacks.length === 0}
              >
                Stage Pre-Position Pack
              </button>
            </div>
          </Card>
        </section>
      )}

      {screen === "trigger-library" && (
        <section className="grid gap-3">
          <Card>
            <div className="font-medium">Trigger Library</div>
            <div className="text-sm text-muted-foreground">Guardable IF-THEN rules to auto-activate pre-positioned bundles.</div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">
              {triggerTemplates.length === 0 ? (
                <div className="col-span-full text-sm text-muted-foreground text-center py-8">No trigger templates available</div>
              ) : (
                triggerTemplates.map(t => (
                  <div key={t.id} className="rounded-xl border p-3 bg-background">
                    <div className="text-sm font-medium mb-1">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.condition}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {t.thresholdLabel ? <div>{t.thresholdLabel}</div> : null}
                      {t.windowLabel ? <div>{t.windowLabel}</div> : null}
                      {t.authorityHint ? <div>Authority: {t.authorityHint}</div> : null}
                      {t.ttlHint ? <div>TTL: {t.ttlHint}</div> : null}
                    </div>
                    <div className="mt-2">
                      <button
                        className="px-2 py-1 rounded border text-xs disabled:opacity-50 focus:ring-2 focus:ring-ring"
                        onClick={() => { onSaveTrigger?.(t.id); emit("antic_save_trigger", { templateId: t.id }); }}
                        disabled={busy}
                      >
                        Save Trigger
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      )}

      {/* Handoffs */}
      <section className="rounded-2xl border p-3 flex flex-wrap items-center gap-2">
        <div className="font-medium">Handoffs</div>
        <div className="ml-auto flex gap-2">
          <button 
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 focus:ring-2 focus:ring-ring"
            onClick={() => { handoff.onHandoff?.("responsive"); emit("antic_handoff", { to: "responsive" }); }}
            disabled={!handoff.enableResponsive}
          >
            → Responsive (activate)
          </button>
          <button 
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 focus:ring-2 focus:ring-ring"
            onClick={() => { handoff.onHandoff?.("deliberative"); emit("antic_handoff", { to: "deliberative" }); }}
            disabled={!handoff.enableDeliberative}
          >
            → Deliberative (trade-offs)
          </button>
          <button 
            className="px-3 py-1 rounded border text-sm disabled:opacity-50 focus:ring-2 focus:ring-ring"
            onClick={() => { handoff.onHandoff?.("structural"); emit("antic_handoff", { to: "structural" }); }}
            disabled={!handoff.enableStructural}
          >
            → Structural (codify)
          </button>
        </div>
      </section>
    </div>
  );
}