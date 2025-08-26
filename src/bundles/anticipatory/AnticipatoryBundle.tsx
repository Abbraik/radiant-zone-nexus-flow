import * as React from "react";
import type { AnticipatoryUiProps, WatchboardCard } from "./types.ui";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ProCard, KPIStat, Sparkline, BandedSeries, Waterfall, Tornado, MiniHeatmap } from "./ProPrimitives";
import { subtle, fmtPct01, variantFromProb, variantFromBuffer, fmtNum } from "./ui.utils";
import { Gauge, Clock, Activity, AlertTriangle, Flag } from "lucide-react";
import { RuntimeDashboard } from "@/components/anticipatory/RuntimeDashboard";
import { TriggerBuilder } from "@/components/anticipatory/TriggerBuilder";


export default function AnticipatoryBundle(props: AnticipatoryUiProps) {
  const {
    loopCode, screen="risk-watchboard",
    ewsProb=0, leadTimeDays=0, bufferAdequacy=null, consentRequired,
    watchboard, ewsComposition, buffers, geoGrid,
    scenarios, projectionBands, waterfall, sensitivity,
    prePositionPacks, shelfLifeTimeline, frontierPoints,
    triggerTemplates, backtest,
    busy, errorText,
    onArmWatchpoint, onRunScenario, onStagePrePosition, onSaveTrigger, onBuildTrigger,
    handoff, onEvent
  } = props;

  const [activeScreen, setActiveScreen] = React.useState(screen);
  const emit = (n: string, p?: any) => onEvent?.(n, p);

  // Update active screen when prop changes
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

      {/* Tabs */}
      <Tabs value={activeScreen} onValueChange={(value) => setActiveScreen(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="risk-watchboard">Risk Watchboard</TabsTrigger>
          <TabsTrigger value="scenario-sim">Scenario Simulator</TabsTrigger>
          <TabsTrigger value="pre-positioner">Pre-Positioner</TabsTrigger>
          <TabsTrigger value="trigger-library">Trigger Library</TabsTrigger>
          <TabsTrigger value="runtime">Runtime Dashboard</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error banner */}
      {errorText && (
        <div role="status" className="rounded-2xl border bg-background p-3 text-destructive text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4"/> {errorText}
        </div>
      )}

      {/* === 1) RISK WATCHBOARD === */}
      {activeScreen === "risk-watchboard" && (
        <>
          <div className="grid xl:grid-cols-3 gap-3">
            {/* EWS composition (stack + spark) */}
            <ProCard
              title="EWS Composition"
              subtitle="Weights & component series"
              className="xl:col-span-2"
              right={<Badge variant="secondary">Lead-time {leadTimeDays}d</Badge>}
            >
              <div className="grid md:grid-cols-3 gap-3">
                {ewsComposition.map((c, i)=>(
                  <div key={i} className="rounded-xl border p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{c.label}</div>
                      <Badge variant="secondary">{Math.round(c.weight*100)}%</Badge>
                    </div>
                    <Sparkline data={c.series}/>
                  </div>
                ))}
              </div>
            </ProCard>

            {/* Buffers dashboard */}
            <ProCard title="Buffers Dashboard" subtitle="Adequacy vs targets">
              <div className="grid gap-3">
                {buffers.map((b, i)=>(
                  <div key={i} className="grid grid-cols-2 gap-2 items-center">
                    <div className="text-sm">{b.label}</div>
                    <div className="justify-self-end">
                      <Badge variant={variantFromBuffer(b.current)}>{(b.current).toFixed(2)} / {(b.target).toFixed(2)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ProCard>
          </div>

          <div className="grid xl:grid-cols-3 gap-3">
            {/* Sentinel grid with sparklines & arm CTA */}
            <ProCard title="Sentinel Grid" subtitle="Top channels, linked loops">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {watchboard.map((w: WatchboardCard)=>(
                  <div key={w.riskChannel} className="rounded-xl border p-3 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{w.riskChannel}</div>
                      <Badge variant={variantFromProb(w.ewsProb)}>{fmtPct01(w.ewsProb)}</Badge>
                    </div>
                    {w.series ? <Sparkline data={w.series}/> : <div className={subtle + " text-xs mt-2"}>No series</div>}
                    <div className="mt-1 text-xs">Linked: <span className="text-foreground">{w.linkedLoops.join(", ") || "—"}</span></div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={busy} onClick={()=>{ onArmWatchpoint?.(w.riskChannel); emit("antic_arm_watchpoint",{riskChannel:w.riskChannel}); }}>Arm Watchpoint</Button>
                      {typeof w.bufferAdequacy === "number" && <Badge variant={variantFromBuffer(w.bufferAdequacy)}>Buf {w.bufferAdequacy.toFixed(2)}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </ProCard>

            {/* Geo heatmap + quick insights */}
            <ProCard title="Geo Sentinels" subtitle="Regional early-warning cells">
              {geoGrid && geoGrid.length ? (
                <MiniHeatmap cells={geoGrid.map(g=>({ id:g.id, value:g.value }))}/>
              ) : <div className={subtle}>No geo data.</div>}
              <Separator className="my-3"/>
              <div className="grid grid-cols-3 gap-2">
                <KPIStat label="Hot cells" value={fmtNum(geoGrid?.filter(x=>x.value>=0.75).length || 0)}/>
                <KPIStat label="Cooling cells" value={fmtNum(geoGrid?.filter(x=>x.value<0.35).length || 0)}/>
                <KPIStat label="Median cell" value={fmtPct01(median(geoGrid?.map(x=>x.value)) as any)}/>
              </div>
            </ProCard>
          </div>
        </>
      )}

      {/* === 2) SCENARIO SIM === */}
      {activeScreen === "scenario-sim" && (
        <>
          <ProCard title="Scenario Selector" subtitle="Choose a stress; compare outcomes">
            <div className="flex flex-wrap gap-2">
              {scenarios.map(s=>(
                <Button key={s.id} variant="outline" size="sm" disabled={busy}
                        onClick={()=>{ onRunScenario?.(s.id); emit("antic_run_scenario",{scenarioId:s.id}); }}>
                  Run: {s.name}
                </Button>
              ))}
              {scenarios.length===0 && <div className={subtle}>No scenarios yet.</div>}
            </div>
          </ProCard>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="Projection — Without Mitigation" subtitle="Mean & band (p10–p90)">
              <BandedSeries data={(projectionBands?.find(b=>b.label==="without")?.series || []).map(x=>({ t:x.t, mean:x.mean, p10:x.p10 || x.mean, p90:x.p90 || x.mean }))}/>
            </ProCard>
            <ProCard title="Projection — With Mitigation" subtitle="Mean & band (p10–p90)">
              <BandedSeries data={(projectionBands?.find(b=>b.label==="with")?.series || []).map(x=>({ t:x.t, mean:x.mean, p10:x.p10 || x.mean, p90:x.p90 || x.mean }))}/>
            </ProCard>
          </div>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="Mitigation Delta (Waterfall)" subtitle="Contributions to risk reduction">
              {waterfall?.length ? <Waterfall items={waterfall}/> : <div className={subtle}>No delta yet — run a scenario.</div>}
            </ProCard>
            <ProCard title="Sensitivity (Tornado)" subtitle="Which factors swing outcomes most">
              {sensitivity?.length ? <Tornado items={sensitivity}/> : <div className={subtle}>No sensitivity yet.</div>}
            </ProCard>
          </div>
        </>
      )}

      {/* === 3) PRE-POSITIONER === */}
      {activeScreen === "pre-positioner" && (
        <>
          <ProCard title="Packs" subtitle="Stage quietly: resources, regulatory, comms">
            <div className="grid md:grid-cols-2 gap-3">
              {prePositionPacks.map(p=>(
                <div key={p.id} className="rounded-2xl border p-3 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{p.title}</div>
                    <Badge variant="secondary">{p.status ?? "draft"}</Badge>
                  </div>
                  <ul className="text-xs list-disc list-inside mt-2">{p.items.map((i,idx)=><li key={idx}><span className="text-foreground">{i.label}</span>{i.note?` — ${i.note}`:""}</li>)}</ul>
                  <div className="mt-2 text-xs flex flex-wrap gap-3">
                    {p.costCeiling!=null && <span className={subtle}>Cost cap: {fmtNum(p.costCeiling)}</span>}
                    {typeof p.readinessScore==="number" && <span className={subtle}>Readiness: {fmtPct01(p.readinessScore)}</span>}
                    {p.shelfLifeDays && <span className={subtle}>Shelf-life: {p.shelfLifeDays}d</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" disabled={busy || prePositionPacks.length===0}
                onClick={()=>{ onStagePrePosition?.(prePositionPacks.map(p=>p.id)); emit("antic_stage_preposition",{packs:prePositionPacks.map(p=>p.id)}); }}>
                Stage Pre-Position Pack
              </Button>
              <TooltipProvider><Tooltip>
                <TooltipTrigger asChild><Badge variant="outline" className="cursor-default">Policy</Badge></TooltipTrigger>
                <TooltipContent>META-L08: stage without public activation; guard by trigger validity.</TooltipContent>
              </Tooltip></TooltipProvider>
            </div>
          </ProCard>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="Shelf-Life Timeline" subtitle="Gantt view of armed windows">
              {shelfLifeTimeline?.length ? (
                <div className="space-y-2">
                  {shelfLifeTimeline.map(s=>(
                    <div key={s.id} className="grid grid-cols-12 items-center gap-2 text-xs">
                      <div className="col-span-2">{s.label}</div>
                      <div className="col-span-10">
                        {/* lightweight bar using CSS */}
                        <div className="h-2 rounded bg-muted relative overflow-hidden">
                          <div className="absolute left-0 top-0 h-2 bg-accent rounded" style={{ width: "50%" }}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <div className={subtle}>No timeline yet.</div>}
            </ProCard>

            <ProCard title="Risk–Cost Frontier" subtitle="Pick the efficient pre-position mix">
              {frontierPoints?.length ? (
                <div className="h-40 grid place-items-center text-xs">{/* Placeholder: integrate your charting wrapper here */}Add scatter chart binding to frontierPoints (risk vs cost).</div>
              ) : <div className={subtle}>No frontier yet.</div>}
            </ProCard>
          </div>
        </>
      )}

      {/* === 4) TRIGGER LIBRARY === */}
      {activeScreen === "trigger-library" && (
        <TriggerBuilder />
      )}

      {/* === 5) RUNTIME DASHBOARD === */}
      {activeScreen === "runtime" && (
        <RuntimeDashboard />
      )}

      {/* Handoffs */}
      <ProCard title="Handoffs" subtitle="Move to activation, arbitration, or codification">
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

function median(arr?: number[]) {
  if (!arr || !arr.length) return null;
  const s = [...arr].sort((a,b)=>a-b); const m = Math.floor(s.length/2);
  return s.length%2? s[m] : (s[m-1]+s[m])/2;
}