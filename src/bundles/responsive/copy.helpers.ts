import type { LangMode } from "./types.ui.lang";

export type Severity = "critical"|"high"|"medium"|"low"|"normal";
export function severityLabel(mode: LangMode, sev: Severity, component?: "alertsWatchpoints"): string {
  if (component === "alertsWatchpoints" && mode === "general") {
    // Per your audit: general labels here are "Critical/Medium/Minor"
    const map: Record<Severity,string> = {
      critical: "Critical",
      high:     "Critical",      // collapse High→Critical for simplicity
      medium:   "Medium",
      low:      "Minor",
      normal:   "Safe"
    };
    return map[sev];
  }
  if (mode === "general") {
    const map: Record<Severity,string> = {
      critical: "Emergency",
      high:     "Above limits",
      medium:   "Moderate",
      low:      "Minor",
      normal:   "Safe"
    };
    return map[sev];
  }
  // Expert
  const map: Record<Severity,string> = {
    critical: "Critical",
    high:     "High severity",
    medium:   "Medium",
    low:      "Low",
    normal:   "Normal"
  };
  return map[sev];
}

export type RunStatus = "active"|"on_hold"|"triggered";
export function statusLabel(mode: LangMode, st: RunStatus): string {
  if (mode === "general") {
    const map: Record<RunStatus,string> = {
      active:    "Running",
      on_hold:   "Paused",
      triggered: "Activated"
    };
    return map[st];
  }
  const map: Record<RunStatus,string> = {
    active:    "Active",
    on_hold:   "On hold",
    triggered: "Triggered"
  };
  return map[st];
}