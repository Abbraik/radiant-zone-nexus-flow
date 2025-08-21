import React, { useMemo, useState } from "react";
import type { DecisionResult, SignalReading } from "@/services/capacity-decision/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LanguageProvider, useLang } from "@/lib/lang/language.context";
import { baseDictionary } from "@/lib/lang/language.dictionary";
import { fmt } from "@/lib/lang/language.formatters";
import { LearningHub, type LearnContent } from "@/bundles/_shared/LearningHub";
import ActivationVectorWidget from "@/components/widgets/ActivationVectorWidget";
import CapacityTaskComposer from "@/components/composers/CapacityTaskComposer";
import { responsivePlaybooks } from "@/playbooks/responsive.default";
import { expandResponsivePlaybook } from "@/playbooks/expand";

// App-shell functions (wire these in your shell)
declare function upsertIncident(payload: any): Promise<{id:string}>;
declare function appendIncidentEvent(incidentId: string, event: any): Promise<void>;
declare function createSprintWithTasks(payload: any): Promise<{id:string}>;
declare function openClaimDrawer(tasks: Array<any>): void;

export type ResponsiveBundleProps = {
  loopCode: string;
  indicator: string;
  decision: DecisionResult;
  reading?: SignalReading;
  lastIncidentId?: string | null;
  mission?: string;
  screen?: "checkpoints" | "guardrails" | "harmonization" | "learning";
  learnContent?: LearnContent;
  onHandoff?: (to: "reflexive"|"deliberative"|"structural", reason: string) => void;
};

function LangToggle(){
  const { mode, setMode } = useLang();
  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant="outline">Language</Badge>
      <div className="rounded-xl border p-1">
        <Button size="sm" variant={mode==="general"?"default":"ghost"} onClick={()=>setMode("general")}>General</Button>
        <Button size="sm" variant={mode==="expert"?"default":"ghost"} onClick={()=>setMode("expert")}>Expert</Button>
      </div>
    </div>
  );
}

/** Default Learning content if none provided */
const defaultLearn: LearnContent = {
  purpose: {
    id: "purpose",
    title: "Why Responsive?",
    summary: "Restore stability quickly when key indicators move outside their safe range. Apply time-boxed actions and safety limits with clear communication."
  },
  workflows: [
    { id:"wf1", title:"Stabilize a breach", summary:"Pick the indicator outside range, select a playbook, set a time-box, and activate.", bullets:[
      "Review alert → confirm context",
      "Choose playbook (e.g., price relief, surge staffing)",
      "Set safety limit and duration",
      "Activate with comms pack"
    ]},
    { id:"wf2", title:"Harmonize conflicting actions", summary:"Resolve clashes between concurrent actions (e.g., housing approvals vs water cap).", bullets:[
      "Open Harmonize tab",
      "See conflicts and dependency tree",
      "Pause/sequence actions to reduce clashes"
    ]},
  ],
  components: [
    { id:"c1", title:"Checkpoint Console", summary:"Shows which indicators are outside their safe range and the recent trend. One-click to propose an action and time-box it." },
    { id:"c2", title:"Safety Limits", summary:"Configure guardrails (caps, pause rules) to prevent harm or oscillation." },
    { id:"c3", title:"Harmonization", summary:"Surface conflicts and coordinate with other teams to avoid working at cross-purposes." },
    { id:"c4", title:"Quick Actions", summary:"Frequent remedies packaged as ready-to-run playbooks." },
  ],
  handoffs: {
    id:"handoff",
    title:"Handoffs",
    summary:"After stabilizing: 1) notify Reflexive to review what worked, 2) notify Structural if a root rule/process is the real constraint.",
    bullets:["→ Reflexive: post-action review","→ Structural: propose durable fix if repeats"]
  },
  outputs: {
    id:"outputs",
    title:"Expected Outputs",
    summary:"Activation logs, safety limit settings, harmonization decisions, comms summary.",
    bullets:["Activation bundle (who/what/when)","Safety limit snapshot","Harmonization notes","Public comms pack"]
  },
  glossaryKeys: ["concept.safe_range","concept.breach","concept.guardrail","concept.activation"]
};

export default function ResponsiveBundle(props: ResponsiveBundleProps) {
  const { loopCode, indicator, decision, reading, lastIncidentId, mission, screen = "checkpoints", learnContent, onHandoff } = props;
  const [busy, setBusy] = useState(false);
  const [incidentId, setIncidentId] = useState<string | undefined>(lastIncidentId || undefined);

  const severityPct = Math.round(decision.severity * 100);
  const timeboxDays = decision.guardrails.timeboxDays ?? 14;

  const applicablePBs = useMemo(() => {
    return responsivePlaybooks.filter(pb => pb.loops.includes(loopCode));
  }, [loopCode]);

  const suggestedPB = applicablePBs[0];

  const handoffEligible = {
    reflexive: (reading?.oscillation ?? 0) >= 0.4,
    deliberative: (decision.consent.requireDeliberative || (reading?.dispersion ?? 0) >= 0.5),
    structural: ((reading?.persistencePk ?? 0)/100) >= 0.5 || (reading?.integralError ?? 0) >= 0.5,
  };

  async function startContainmentSprint() {
    setBusy(true);
    try {
      const inc = !incidentId ? await upsertIncident({
        loop_code: loopCode,
        indicator,
        severity: decision.severity,
        srt: decision.srt,
        guardrails: decision.guardrails,
        status: "active"
      }) : { id: incidentId };

      setIncidentId(inc.id);

      const tasks = suggestedPB
        ? expandResponsivePlaybook(decision, suggestedPB)
        : [];

      const sprint = await createSprintWithTasks({
        capacity: "responsive",
        leverage: "P",
        due_at: new Date(Date.now() + timeboxDays*24*3600*1000).toISOString(),
        guardrails: decision.guardrails,
        srt: decision.srt,
        tasks
      });

      await appendIncidentEvent(inc.id, {
        kind: "action",
        payload: { type: "start_containment_sprint", sprint_id: sprint.id, playbook: suggestedPB?.id }
      });

      openClaimDrawer(tasks);
    } finally {
      setBusy(false);
    }
  }

  function handoff(to: "reflexive"|"deliberative"|"structural") {
    const reason =
      to === "reflexive" ? "Oscillation/ringing after containment" :
      to === "deliberative" ? "Legitimacy/trade-off surfaced" :
      "Persistence / integral error indicates structural cause";

    onHandoff?.(to, reason);
    if (incidentId) {
      appendIncidentEvent(incidentId, { kind: "handoff", payload: { to, reason } });
    }
  }

  return (
    <LanguageProvider dict={baseDictionary}>
      <div className="grid gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-muted-foreground">Workspace-5C · Responsive</div>
            <h3 className="text-xl font-semibold leading-tight">{loopCode}</h3>
            {mission && <div className="mt-1 text-sm">{mission}</div>}
          </div>
          <LangToggle />
        </div>

        {/* Tabs */}
        <Tabs value={screen} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
            <TabsTrigger value="guardrails">Safety Limits</TabsTrigger>
            <TabsTrigger value="harmonization">Harmonize</TabsTrigger>
            <TabsTrigger value="learning">Learning Hub</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content based on screen */}
        {screen === "learning" ? (
          <LearningHub 
            title="Responsive Capacity" 
            subtitle="Stabilize signals quickly and safely" 
            content={learnContent ?? defaultLearn} 
          />
        ) : (
          <ResponsiveWorkspace 
            loopCode={loopCode}
            indicator={indicator}
            decision={decision}
            reading={reading}
            lastIncidentId={lastIncidentId}
            onHandoff={onHandoff}
            busy={busy}
            startContainmentSprint={startContainmentSprint}
            handoff={handoff}
            severityPct={severityPct}
            timeboxDays={timeboxDays}
            suggestedPB={suggestedPB}
            handoffEligible={handoffEligible}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

function ResponsiveWorkspace({ 
  loopCode, indicator, decision, reading, busy, startContainmentSprint, 
  handoff, severityPct, timeboxDays, suggestedPB, handoffEligible 
}: { 
  loopCode: string; indicator: string; decision: DecisionResult; reading?: SignalReading;
  busy: boolean; startContainmentSprint: () => void; handoff: (to: string) => void;
  severityPct: number; timeboxDays: number; suggestedPB: any; handoffEligible: any;
}) {
  const { t } = useLang();
  
  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Responsive · Checkpoint</div>
          <div className="text-xl font-semibold">{loopCode} · {indicator}</div>
          <div className="text-xs text-muted-foreground">
            Severity: <span className="font-semibold">{severityPct}%</span> · Time-box: {fmt(timeboxDays, { kind: "days" })} · Cadence: {decision.srt.cadence}
          </div>
        </div>
        <ActivationVectorWidget decision={decision} />
      </div>

      {/* Guardrails */}
      <div className="rounded-2xl border bg-card p-3">
        <div className="font-medium mb-1">{t("concept.guardrail")}</div>
        <div className="text-sm text-muted-foreground">
          Caps: {decision.guardrails.caps?.join(", ") || "—"} · Time-box: {fmt(timeboxDays, { kind: "days" })}
          {decision.consent.requireDeliberative && (
            <div className="mt-1 text-amber-600 text-xs">Consent gate active — prepare transparency pack.</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border bg-card p-3">
        <div className="font-medium mb-2">Quick Actions</div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" disabled={busy} onClick={startContainmentSprint}>
            {busy ? "Starting…" : "Start Containment Sprint"}
          </Button>
          {suggestedPB && (
            <span className="text-xs text-muted-foreground">Suggested playbook: <b>{suggestedPB.name}</b></span>
          )}
        </div>
      </div>

      {/* Harmonization */}
      <div className="rounded-2xl border bg-card p-3">
        <div className="font-medium mb-1">Harmonization</div>
        <div className="text-sm text-muted-foreground">
          Hub saturation: {fmt(reading?.hubSaturation ?? 0, { kind: "float", decimals: 2 })} · Dispersion: {fmt(reading?.dispersion ?? 0, { kind: "float", decimals: 2 })}
          <div className="text-xs">Use cross-loop throttle if hub near saturation.</div>
        </div>
      </div>

      {/* Proposed Tasks */}
      <div className="rounded-2xl border bg-card p-3">
        <CapacityTaskComposer decision={decision} loopCode={loopCode} onCreate={(tasks)=>openClaimDrawer(tasks)} />
      </div>

      {/* Handoffs */}
      <div className="rounded-2xl border bg-card p-3 flex gap-2 flex-wrap">
        <div className="font-medium w-full">Handoffs</div>
        <Button variant="outline" size="sm" disabled={!handoffEligible.reflexive} onClick={()=>handoff("reflexive")}>
          → Reflexive (tuner)
        </Button>
        <Button variant="outline" size="sm" disabled={!handoffEligible.deliberative} onClick={()=>handoff("deliberative")}>
          → Deliberative (trade-offs)
        </Button>
        <Button variant="outline" size="sm" disabled={!handoffEligible.structural} onClick={()=>handoff("structural")}>
          → Structural (mandate/pathway)
        </Button>
      </div>
    </div>
  );
}