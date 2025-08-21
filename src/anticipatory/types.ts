export type RiskChannel =
  | "Heat" | "ExternalDemand" | "SupplyChain" | "Cyber" | "Epidemic"
  | "FXCommodity" | "Drought" | "EnergyReliability" | "WaterStress" | "LocalPrices";

export type Watchpoint = {
  id?: string;
  riskChannel: RiskChannel;
  loopCodes: string[];         // linked loops
  ewsProb: number;             // 0..1
  confidence?: number;         // 0..1
  leadTimeDays?: number;
  bufferAdequacy?: number|null;// 0..1 or null
  ownerId?: string;
  status: "armed" | "on_hold" | "expired";
  reviewAt: string;            // ISO
  createdAt?: string;
  notes?: string;
};

export type Scenario = {
  id: string;
  name: string;
  assumptions: Record<string, any>; // e.g., { fuelPricePct:+25, heatIndex:+3 }
  targetLoops: string[];            // loop codes affected
};

export type ScenarioResult = {
  id?: string;
  scenarioId: string;
  withMitigationBreachProb: number;   // 0..1
  withoutMitigationBreachProb: number;// 0..1
  mitigationDelta: number;            // reduction
  affectedLoops: string[];
  notes?: string;
  createdAt?: string;
};

export type PrePositionOrder = {
  id?: string;
  type: "resource" | "regulatory" | "comms";
  items: Array<{ key: string; label: string; qty?: number; unit?: string }>;
  suppliers?: string[];
  sla?: string;
  costCeiling?: number;
  shelfLifeDays?: number;
  cancelBy?: string; // ISO
  status?: "draft" | "armed" | "canceled" | "expired";
};

export type TriggerRule = {
  id?: string;
  name: string;
  condition: string;     // human readable formula
  threshold: number;     // normalized 0..1 or a domain unit
  windowHours: number;   // observation window
  actionRef: string;     // references a pre-position pack
  authority: string;     // who can flip
  consentNote?: string;
  validFrom: string;
  expiresAt: string;
};

export type AnticPlaybook = {
  id: string;
  name: string;
  appliesTo: RiskChannel[];
  prePosition: {
    resource?: PrePositionOrder;
    regulatory?: PrePositionOrder;
    comms?: PrePositionOrder;
  };
  defaultTrigger?: Omit<TriggerRule, "validFrom"|"expiresAt"|"id"> & { ttlDays: number };
  notes?: string;
};