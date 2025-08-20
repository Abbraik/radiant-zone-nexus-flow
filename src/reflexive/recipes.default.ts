import type { ReflexiveRecipe } from "./types";

export const reflexiveRecipes: ReflexiveRecipe[] = [
  {
    id: "rx-meta02-oscillations",
    name: "Dampen Oscillations (META-L02)",
    appliesTo: ["META-L02", ".*"], // general fallback
    actions: [
      { kind: "scale_gain", param: "Kp", factor: 0.8 },
      { kind: "set_param", param: "Kd", value: 0.0 }
    ],
    evaluation: { method: "ITS", reviewInDays: 14, indicators: ["Oscillation Score","RMSE"] },
    rationaleHint: "High oscillation and RMSE suggest over-aggressive proportional/derivative gains."
  },
  {
    id: "rx-switch-to-pi",
    name: "Switch to PI Controller",
    appliesTo: [".*"],
    actions: [
      { kind: "switch_family", to: "PI" },
      { kind: "set_param", param: "Kp", value: 0.7 },
      { kind: "set_param", param: "Ki", value: 0.15 }
    ],
    evaluation: { method: "ITS", reviewInDays: 21, indicators: ["Variance of Error","Integral Error"] },
    rationaleHint: "Integral action can remove steady-state bias; monitor for windup."
  },
  {
    id: "rx-bands-tighten",
    name: "Tighten T2 Bands / Reweight",
    appliesTo: ["META-L01",".*"],
    actions: [
      { kind: "reweight_tier", tier: "T2", weightDelta: +0.1 },
      { kind: "adjust_band", anchor: "Composite Error (Tier-1)", lower: 0.4, upper: 1.0 }
    ],
    evaluation: { method: "DiD", reviewInDays: 28, indicators: ["Dispersion Index (T2/T3)","Band-Hit Frequency"] },
    rationaleHint: "Elevated dispersion implies T2 under-weighted; tighten and reweight."
  }
];