import type { ResponsivePlaybook } from "./types";

export const responsivePlaybooks: ResponsivePlaybook[] = [
  {
    id: "pb-health-surge",
    name: "Health Capacity Surge",
    loops: ["MES-L01"],
    conditions: { severityMin: 0.25 },
    actions: [
      { key: "surge_staffing", label: "Activate overtime & locum pool", params: { hours: 72 } },
      { key: "mobile_units", label: "Deploy mobile units to hotspots" },
      { key: "triage_rules", label: "Enable fast-track triage v2" },
      { key: "status_banner", label: "Publish wait-time status banner" }
    ],
    guardrails: ["timebox_14d","overtime_cap"]
  },
  {
    id: "pb-digital-outage",
    name: "Digital Service Outage",
    loops: ["MES-L09"],
    actions: [
      { key: "rollback", label: "Rollback to canary stable" },
      { key: "autoscale", label: "Raise autoscale floor temporarily" },
      { key: "status_page", label: "Publish incident on status page" },
      { key: "nps_capture", label: "Enable post-incident NPS capture" }
    ],
    guardrails: ["error_rate_cap","timebox_7d"]
  },
  {
    id: "pb-transport-peak",
    name: "Transport Peak Congestion",
    loops: ["MES-L06"],
    actions: [
      { key: "bus_priority", label: "Activate bus priority lanes" },
      { key: "variable_pricing", label: "Enable variable pricing (peak cap)" },
      { key: "turn_restrictions", label: "Apply temporary turn restrictions" },
      { key: "commuter_alert", label: "Push commuter alert with alternatives" }
    ],
    guardrails: ["timebox_7d"]
  }
];