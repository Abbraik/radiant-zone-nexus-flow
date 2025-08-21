import type { LangMode } from "./types.ui.lang";
import { label } from "@/lib/i18n-lite";
import { responsiveDict as D } from "./types.ui.lang";

/** 1) Main Headers & Navigation */
export function mainHeaderCopy(mode: LangMode){
  return {
    workspace: label(D, "WORKSPACE", mode),               // "Control center" | "Workspace-5C"
    capacity:  label(D, "RESPONSIVE_CAPACITY", mode),     // "Quick response" | "Responsive capacity"
    severity:  label(D, "TENSION", mode),                 // per your mapping
    timebox:   label(D, "GUARDRAIL", mode),
    cadence:   label(D, "SRT", mode),
    guardrailViolation: label(D, "BAND_BREACH", mode),
    consentGate: label(D, "TRI", mode)
  };
}

/** 2) CheckpointConsole.tsx */
export function checkpointCopy(mode: LangMode){
  return {
    title:             label(D, "CHECKPOINT", mode),  // "Scheduled check" | "Checkpoint"
    level_critical:    mode==="general" ? "Emergency level" : "Critical breach",
    level_high:        mode==="general" ? "Above safe range" : "High severity",
    level_low:         mode==="general" ? "Below target" : "Low signal",
    level_normal:      mode==="general" ? "Safe range" : "In-band",
    bandLabel:         mode==="general" ? "Safe range" : "Control band",
    incidentTimeline:  mode==="general" ? "Action history" : "Event timeline",
    suggestedPlaybook: mode==="general" ? "Recommended actions" : "Playbook template",
    cta_apply_start:   mode==="general" ? "Start quick response" : "Apply containment sprint",
    empty_msg:         mode==="general"
                        ? "System stable. Start response if issues arise."
                        : "No active incident. Initiate containment if tension increases."
  };
}

/** 3) GuardrailsPanel.tsx */
export function guardrailsCopy(mode: LangMode){
  return {
    title:                       label(D, "GUARDRAIL", mode),
    concurrentSubsteps:          mode==="general" ? "Parallel actions limit" : "Concurrent substeps",
    maxParallelStreams:          mode==="general" ? "How many things at once" : "Max parallel work streams",
    coveragePct:                 mode==="general" ? "System change limit" : "Coverage percentage",
    maxCoverageChange:           mode==="general" ? "How much system can change" : "Maximum system coverage change",
    timeboxDuration:             mode==="general" ? "Time limit" : "Time-box duration",
    maxContainmentWindow:        mode==="general" ? "How long to try fixes" : "Maximum containment window",
    dailyDelta:                  mode==="general" ? "Daily change limit" : "Daily delta limit",
    managerOverride:             mode==="general" ? "Emergency bypass" : "Manager override",
    overrideExplainer:           mode==="general" ? "This skips all safety limits" : "Override bypasses capacity controls",
    criticalBreach:              mode==="general" ? "Safety limit exceeded" : "Critical guardrail breach",
    renewedTwice:                mode==="general" ? "Extended fixes need review" : "Time-box renewed twice without evaluation",
    capacityControls:            mode==="general" ? "Safety settings" : "Capacity controls",
    emergencyActions:            mode==="general" ? "Emergency options" : "Emergency actions",
    emergencyBypass:             mode==="general" ? "Skip all limits" : "Emergency bypass"
  };
}

/** 4) HandoffsCard.tsx */
export function handoffsCopy(mode: LangMode){
  return {
    title:                   mode==="general" ? "Switch to different approach" : "Capacity handoffs",
    reflexive:               label(D, "REFLEXIVE", mode),
    reflexive_desc:          mode==="general" ? "Adjust automatic responses" : "Retune controllers",
    deliberative:            label(D, "DELIBERATIVE", mode),
    deliberative_desc:       mode==="general" ? "Weigh different options" : "Trade-offs analysis",
    structural:              label(D, "STRUCTURAL", mode),
    structural_desc:         mode==="general" ? "Change how system works" : "System redesign",
    oscillationDetected:     mode==="general" ? "Back-and-forth pattern found" : `${label(D,"OSCILLATION",mode)} detected`,
    highDispersion:          mode==="general" ? "Spread across multiple areas" : "High dispersion",
    consentGateRequired:     mode==="general" ? "Approval needed" : "Consent gate required",
    persistentIssues:        mode==="general" ? "Ongoing problems" : "Persistent issues",
    integralError:           mode==="general" ? "Errors building up" : "Integral error accumulation"
  };
}

/** 5) QuickActionsBar.tsx */
export function quickActionsCopy(mode: LangMode){
  return {
    title:                label(D, "ACTUATION", mode), // "Quick actions" | "Actuation"
    startContainment:     mode==="general" ? "Start quick response" : "Start containment sprint",
    publishStatus:        mode==="general" ? "Send status update" : "Publish status banner",
    acknowledgeAlert:     mode==="general" ? "Mark alert as seen" : "Acknowledge alert",
    createNote:           mode==="general" ? "Add comment" : "Create note",
    addTimelineEvent:     mode==="general" ? "Log what happened" : "Add timeline event"
  };
}

/** 6) Other components */
export function otherCopy(mode: LangMode){
  return {
    activationVector_tooltip_R:  mode==="general" ? "Quick response" : "Responsive",
    activationVector_tooltip_Rx: mode==="general" ? "Auto-adjust" : "Reflexive",
    activationVector_tooltip_D:  mode==="general" ? "Group decision" : "Deliberative",
    activationVector_tooltip_A:  mode==="general" ? "Early warning" : "Anticipatory",
    activationVector_tooltip_S:  mode==="general" ? "System change" : "Structural",
    harmonization_hubSaturation: mode==="general" ? "System overload" : "Hub saturation",
    srt_label:                   label(D, "SRT", mode)
  };
}

/** 7) KPI Footer */
export function kpiFooterCopy(mode: LangMode){
  return {
    mttd:        mode==="general" ? "Time to spot issue" : "MTTD",
    mtta:        mode==="general" ? "Time to respond"    : "MTTA",
    mttr:        mode==="general" ? "Time to fix"        : "MTTR",
    containment: mode==="general" ? "Success rate"       : "Containment effectiveness"
  };
}