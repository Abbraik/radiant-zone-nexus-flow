import type { Scenario, AnticPlaybook } from "./types";

export const scenarios: Scenario[] = [
  { id: "sc_fuel_up_25", name: "Fuel price +25%", assumptions: { fuelPricePct: +25 }, targetLoops: ["MES-L07","MAC-L03","MIC-L07"] },
  { id: "sc_heatwave_week", name: "Heatwave (7 days)", assumptions: { heatIndex:+3, days:7 }, targetLoops: ["MES-L01","MAC-L07"] },
  { id: "sc_export_down_30", name: "Export orderbook −30%", assumptions: { ordersPct:-30 }, targetLoops: ["MAC-L06","MES-L03"] },
  { id: "sc_reservoir_minus_15", name: "Reservoir −15%", assumptions: { storagePct:-15 }, targetLoops: ["MES-L08","MES-L05"] },
];

export const anticPlaybooks: AnticPlaybook[] = [
  {
    id: "ap_external_demand",
    name: "External Demand Shock (MAC-L06)",
    appliesTo: ["ExternalDemand"],
    prePosition: {
      resource: {
        type: "resource",
        items: [
          { key: "export_fx_window", label: "Export FX window standby" },
          { key: "port_slots", label: "Priority logistics slots" }
        ],
        suppliers: ["CentralBank","PortsAuthority"],
        sla: "48h activation",
        shelfLifeDays: 30,
        status: "draft"
      },
      regulatory: {
        type: "regulatory",
        items: [{ key: "standby_rebates", label: "Standby export rebates" }],
        sla: "Legal review done",
        shelfLifeDays: 30,
        status: "draft"
      },
      comms: {
        type: "comms",
        items: [{ key: "briefing_pack", label: "Exporter guidance pack" }],
        status: "draft"
      }
    },
    defaultTrigger: {
      name: "REER shock + Orderbook drop",
      condition: "REER_change ≥ 8% AND orderbook_7d ≤ −20%",
      threshold: 0.8,
      windowHours: 168,
      actionRef: "ap_external_demand",
      authority: "Treasury+Trade",
      consentNote: "Notify exporters and unions",
      ttlDays: 30
    }
  },
  {
    id: "ap_heat_health",
    name: "Heat & Health (MES-L01 + EWS)",
    appliesTo: ["Heat"],
    prePosition: {
      resource: {
        type: "resource",
        items: [
          { key: "cooling_centers", label: "Cooling centers on standby", qty: 20, unit: "sites" },
          { key: "mobile_clinics", label: "Mobile clinics", qty: 6, unit: "units" }
        ],
        suppliers: ["HealthMinistry","Municipalities"],
        sla: "24h activation", 
        shelfLifeDays: 21, 
        status: "draft"
      },
      comms: {
        type: "comms",
        items: [{ key: "sms_templates", label: "Heat SMS templates" }],
        status: "draft"
      }
    },
    defaultTrigger: {
      name: "3-day Heat Index",
      condition: "HeatIndex ≥ threshold for 3 consecutive days",
      threshold: 1.0,
      windowHours: 72,
      actionRef: "ap_heat_health",
      authority: "Health+CivilDefense",
      consentNote: "Inform public in advance",
      ttlDays: 21
    }
  }
];