import * as React from "react";
import type { AnticipatoryUiProps, WatchboardCard } from "./types.ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ProCard, ProSection } from "./ProCard";
import { variantFromProb, variantFromBuffer, fmtPct01, subtle } from "./ui.utils";
import { Gauge, Clock, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { useAnticHotkeys } from "./useAnticHotkeys";

function TrendChip({ trend }: { trend?: "up"|"down"|"flat" }) {
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const label = trend ?? "flat";
  return <Badge variant="secondary" className="gap-1"><Icon className="h-3.5 w-3.5" /> {label}</Badge>;
}

export default function AnticipatoryBundle(props: AnticipatoryUiProps) {
  const {
    loopCode, screen="risk-watchboard",
    ewsProb=0, leadTimeDays=0, bufferAdequacy=null, consentRequired,
    watchboard, scenarios, prePositionPacks, triggerTemplates,
    busy, errorText,
    onArmWatchpoint, onRunScenario, onStagePrePosition, onSaveTrigger,
    handoff, onEvent
  } = props;

  const [activeScreen, setActiveScreen] = React.useState(screen);

  function emit(name: string, payload?: Record<string, any>) { onEvent?.(name, payload); }

  // Keyboard shortcuts
  useAnticHotkeys({
    armWatchpoint: () => {
      if (activeScreen === "risk-watchboard" && watchboard.length > 0) {
        onArmWatchpoint?.(watchboard[0].riskChannel);
        emit("antic_arm_watchpoint", { riskChannel: watchboard[0].riskChannel });
      }
    },
    runScenario: () => {
      if (activeScreen === "scenario-sim" && scenarios.length > 0) {
        onRunScenario?.(scenarios[0].id);
        emit("antic_run_scenario", { scenarioId: scenarios[0].id });
      }
    },
    stagePrePosition: () => {
      if (activeScreen === "pre-positioner" && prePositionPacks.length > 0) {
        onStagePrePosition?.(prePositionPacks.map(p=>p.id));
        emit("antic_stage_preposition", { packs: prePositionPacks.map(p=>p.id) });
      }
    },
    saveTrigger: () => {
      if (activeScreen === "trigger-library" && triggerTemplates.length > 0) {
        onSaveTrigger?.(triggerTemplates[0].id);
        emit("antic_save_trigger", { templateId: triggerTemplates[0].id });
      }
    },
    openHandoffs: () => {
      document.querySelector('[data-handoffs]')?.scrollIntoView();
    }
  });

  React.useEffect(() => {
    setActiveScreen(screen);
  }, [screen]);

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className={subtle}>Workspace-5C · Anticipatory</div>
          <h3 className="text-xl font-semibold leading-tight">{loopCode}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3"/>{fmtPct01(ewsProb)} EWS</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3"/>~{leadTimeDays}d lead-time</span>
            <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3"/>Buffers {bufferAdequacy==null?"—":bufferAdequacy.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {consentRequired && <Badge variant="outline" className="text-warning border-warning">Consent gate</Badge>}
        </div>
      </div>

      {/* Screen Tabs (top-aligned, consistent with other capacities) */}
      <Tabs value={activeScreen} onValueChange={(value) => setActiveScreen(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="risk-watchboard">Risk Watchboard</TabsTrigger>
          <TabsTrigger value="scenario-sim">Scenario Simulator</TabsTrigger>
          <TabsTrigger value="pre-positioner">Pre-Positioner</TabsTrigger>
          <TabsTrigger value="trigger-library">Trigger Library</TabsTrigger>
        </TabsList>

        {errorText && (
          <ProCard title="Notice" subtitle="There was a display problem">
            <div className="rounded-lg border border-destructive/30 bg-background p-3 text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4"/> {errorText}
            </div>
          </ProCard>
        )}

        {/* RISK WATCHBOARD */}
        <TabsContent value="risk-watchboard" className="mt-4">
          <ProCard title="Risk Watchboard" subtitle="Early-warning across channels with linked loops">
            {busy ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({length:6}).map((_,i)=>(
                  <div key={i} className="rounded-2xl border p-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-40 mt-2" />
                    <Skeleton className="h-8 w-full mt-3" />
                  </div>
                ))}
              </div>
            ) : watchboard.length === 0 ? (
              <div className={`${subtle} text-center py-8`}>No risk channels configured yet.</div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {watchboard.map((w: WatchboardCard) => (
                  <ProSection
                    key={w.riskChannel}
                    title={w.riskChannel}
                    right={<TrendChip trend={w.trend} />}
                  >
                    <div className={`text-xs ${subtle}`}>
                      <span className="mr-3">EWS <Badge variant={variantFromProb(w.ewsProb)}>{fmtPct01(w.ewsProb)}</Badge></span>
                      <span className="mr-3">Lead-time {w.leadTimeDays ?? "—"}d</span>
                      <span>Buffers <Badge variant={variantFromBuffer(w.bufferAdequacy)}>{w.bufferAdequacy==null?"—":w.bufferAdequacy.toFixed(2)}</Badge></span>
                    </div>
                    <div className="mt-2 text-xs">
                      Linked loops: <span className="text-foreground">{w.linkedLoops.join(", ") || "—"}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" disabled={busy}
                        onClick={()=>{ onArmWatchpoint?.(w.riskChannel); emit("antic_arm_watchpoint",{riskChannel:w.riskChannel}); }}>
                        Arm Watchpoint
                      </Button>
                      <TooltipProvider><Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-default">Best practice</Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          Arm now; stage packs in Pre-Positioner; add trigger in Trigger Library.
                        </TooltipContent>
                      </Tooltip></TooltipProvider>
                    </div>
                  </ProSection>
                ))}
              </div>
            )}
          </ProCard>
        </TabsContent>

        {/* SCENARIO SIMULATOR */}
        <TabsContent value="scenario-sim" className="mt-4">
          <ProCard title="Scenario & Stress Simulator" subtitle="Compare outcomes with vs without mitigation">
            <div className="flex flex-wrap gap-2">
              {scenarios.length === 0 ? (
                <div className={subtle}>No scenarios defined yet.</div>
              ) : (
                scenarios.map(s=>(
                  <Button key={s.id} variant="outline" size="sm" disabled={busy}
                    onClick={()=>{ onRunScenario?.(s.id); emit("antic_run_scenario",{scenarioId:s.id}); }}
                    title={s.summary}>
                    Run: {s.name}
                  </Button>
                ))
              )}
            </div>
            <Separator className="my-3"/>
            <div className={`${subtle} text-xs`}>After running, the shell may open a claim drawer with planning tasks.</div>
          </ProCard>
        </TabsContent>

        {/* PRE-POSITIONER */}
        <TabsContent value="pre-positioner" className="mt-4">
          <ProCard title="Pre-Positioner" subtitle="Stage resources, regulatory, and comms packs (quiet; not public)">
            <div className="grid md:grid-cols-2 gap-3">
              {prePositionPacks.length === 0 ? (
                <div className={`${subtle} col-span-full text-center py-8`}>No packs configured yet.</div>
              ) : (
                prePositionPacks.map(p=>(
                  <ProSection
                    key={p.id}
                    title={p.title}
                    right={<Badge variant="secondary">{p.status ?? "draft"}</Badge>}
                  >
                    <ul className="text-xs list-disc list-inside">
                      {p.items.map((i,idx)=><li key={idx}><span className="text-foreground">{i.label}</span>{i.note?` — ${i.note}`:""}</li>)}
                    </ul>
                  </ProSection>
                ))
              )}
            </div>
            <div className="mt-3">
              <Button size="sm" disabled={busy || prePositionPacks.length===0}
                onClick={()=>{ onStagePrePosition?.(prePositionPacks.map(p=>p.id)); emit("antic_stage_preposition",{packs:prePositionPacks.map(p=>p.id)}); }}>
                Stage Pre-Position Pack
              </Button>
            </div>
          </ProCard>
        </TabsContent>

        {/* TRIGGER LIBRARY */}
        <TabsContent value="trigger-library" className="mt-4">
          <ProCard title="Trigger Library" subtitle="Guardable IF-THEN rules to auto-activate staged packs">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {triggerTemplates.length === 0 ? (
                <div className={`${subtle} col-span-full text-center py-8`}>No trigger templates configured yet.</div>
              ) : (
                triggerTemplates.map(t=>(
                  <ProSection key={t.id} title={t.name}>
                    <div className="text-xs">
                      <div className={subtle}>{t.condition}</div>
                      {t.thresholdLabel && <div className={subtle}>{t.thresholdLabel}</div>}
                      {t.windowLabel && <div className={subtle}>{t.windowLabel}</div>}
                      {t.authorityHint && <div className={subtle}>Authority: {t.authorityHint}</div>}
                      {t.ttlHint && <div className={subtle}>TTL: {t.ttlHint}</div>}
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" disabled={busy}
                        onClick={()=>{ onSaveTrigger?.(t.id); emit("antic_save_trigger",{templateId:t.id}); }}>
                        Save Trigger
                      </Button>
                    </div>
                  </ProSection>
                ))
              )}
            </div>
          </ProCard>
        </TabsContent>
      </Tabs>

      {/* HANDOFF BAR (sticky look-alike) */}
      <ProCard title="Handoffs" subtitle="Move to activation, arbitration, or codification" className="mt-4" data-handoffs>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" size="sm" disabled={!handoff.enableResponsive}
            onClick={()=>{ handoff.onHandoff?.("responsive"); emit("antic_handoff",{to:"responsive"}); }}>
            → Responsive (activate)
          </Button>
          <Button variant="outline" size="sm" disabled={!handoff.enableDeliberative}
            onClick={()=>{ handoff.onHandoff?.("deliberative"); emit("antic_handoff",{to:"deliberative"}); }}>
            → Deliberative (trade-offs)
          </Button>
          <Button variant="outline" size="sm" disabled={!handoff.enableStructural}
            onClick={()=>{ handoff.onHandoff?.("structural"); emit("antic_handoff",{to:"structural"}); }}>
            → Structural (codify)
          </Button>
        </div>
      </ProCard>
    </div>
  );
}