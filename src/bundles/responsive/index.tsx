import React, { useMemo, useState } from "react";
import type { DecisionResult, SignalReading } from "@/services/capacity-decision/types";
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
  onHandoff?: (to: "reflexive"|"deliberative"|"structural", reason: string) => void;
};

export default function ResponsiveBundle(props: ResponsiveBundleProps) {
  const { loopCode, indicator, decision, reading, lastIncidentId, onHandoff } = props;
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
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Responsive · Checkpoint</div>
          <div className="text-xl font-semibold">{loopCode} · {indicator}</div>
          <div className="text-xs text-gray-500">
            Severity: <span className="font-semibold">{severityPct}%</span> · Time-box: {timeboxDays}d · Cadence: {decision.srt.cadence}
          </div>
        </div>
        <ActivationVectorWidget decision={decision} />
      </div>

      {/* Guardrails */}
      <div className="rounded-2xl border p-3">
        <div className="font-medium mb-1">Guardrails</div>
        <div className="text-sm">
          Caps: {decision.guardrails.caps?.join(", ") || "—"} · Time-box: {timeboxDays}d
          {decision.consent.requireDeliberative && (
            <div className="mt-1 text-amber-600 text-xs">Consent gate active — prepare transparency pack.</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border p-3">
        <div className="font-medium mb-2">Quick Actions</div>
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" disabled={busy} onClick={startContainmentSprint}>
            {busy ? "Starting…" : "Start Containment Sprint"}
          </button>
          {suggestedPB && (
            <span className="text-xs text-gray-600">Suggested playbook: <b>{suggestedPB.name}</b></span>
          )}
        </div>
      </div>

      {/* Harmonization */}
      <div className="rounded-2xl border p-3">
        <div className="font-medium mb-1">Harmonization</div>
        <div className="text-sm text-gray-600">
          Hub saturation: {(reading?.hubSaturation ?? 0).toFixed(2)} · Dispersion: {(reading?.dispersion ?? 0).toFixed(2)}
          <div className="text-xs">Use cross-loop throttle if hub near saturation.</div>
        </div>
      </div>

      {/* Proposed Tasks */}
      <div className="rounded-2xl border p-3">
        <CapacityTaskComposer decision={decision} loopCode={loopCode} onCreate={(tasks)=>openClaimDrawer(tasks)} />
      </div>

      {/* Handoffs */}
      <div className="rounded-2xl border p-3 flex gap-2 flex-wrap">
        <div className="font-medium w-full">Handoffs</div>
        <button className="px-3 py-1 rounded border text-sm disabled:opacity-50"
          disabled={!handoffEligible.reflexive} onClick={()=>handoff("reflexive")}>
          → Reflexive (tuner)
        </button>
        <button className="px-3 py-1 rounded border text-sm disabled:opacity-50"
          disabled={!handoffEligible.deliberative} onClick={()=>handoff("deliberative")}>
          → Deliberative (trade-offs)
        </button>
        <button className="px-3 py-1 rounded border text-sm disabled:opacity-50"
          disabled={!handoffEligible.structural} onClick={()=>handoff("structural")}>
          → Structural (mandate/pathway)
        </button>
      </div>
    </div>
  );
}