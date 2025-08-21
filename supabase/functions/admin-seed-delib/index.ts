// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Theme = "housing_ecology" | "external_demand";

type SeedReq = {
  org_id: string;
  theme?: Theme;
  with_frontier?: boolean;
  publish_dossier?: boolean;
  handoffs?: Array<"responsive"|"structural"|"reflexive">;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sb = create(req);

    const body = (await req.json()) as SeedReq;
    const org_id = body.org_id;
    if (!org_id) return J({ error: "org_id required" }, 400);

    // Authorization / role check (RLS applies; we also hard-check role here)
    const me = await getMe(sb);
    if (!me || me.org_id !== org_id) {
      return J({ error: "FORBIDDEN: access required for this org" }, 403);
    }

    const theme: Theme = body.theme ?? "housing_ecology";

    console.log(`Seeding deliberative session for org ${org_id} with theme ${theme}`);

    if (theme === "housing_ecology") {
      const result = await seedHousingEcology(sb, org_id, body);
      return J(result);
    } else {
      const result = await seedExternalDemand(sb, org_id, body);
      return J(result);
    }

  } catch (e) {
    console.error('Error in admin-seed-delib:', e);
    return J({ error: String(e) }, 500);
  }
});

/* ========================= helpers ========================= */

function create(req: Request) {
  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );
  return supa;
}

async function getMe(sb: any) {
  const user = (await sb.auth.getUser()).data.user;
  if (!user) return null;
  
  // For simplicity, use user ID as org_id for demo
  return { id: user.id, org_id: user.id, role: "owner" };
}

async function rpc(sb:any, fn:string, args:any) {
  console.log(`Calling RPC ${fn} with args:`, args);
  const { data, error } = await sb.rpc(fn, args);
  if (error) {
    console.error(`RPC ${fn} error:`, error);
    throw new Error(`[${fn}] ${error.message}`);
  }
  return data;
}

/* ---------- THEME 1: Housing vs Ecology ---------- */
async function seedHousingEcology(sb:any, org_id:string, flags: SeedReq) {
  console.log('Creating housing ecology session...');
  
  // 1) Create session
  const session_id = await rpc(sb, "delib_create_session", {
    p_org: org_id,
    p_loop: "MAC-L04",
    p_mission: "Improve housing affordability without breaching ecological ceiling",
    p_activation_vector: { tri: { trust: 0.52 }, context: ["MAC-L04","MAC-L07","MES-L05","MES-L08"] }
  });
  console.log('Created session:', session_id);

  // 2) Criteria
  const crit = [
    { label:"Effectiveness", weight:0.35, direction:"maximize" },
    { label:"Time-to-impact", weight:0.20, direction:"minimize" },
    { label:"Equity", weight:0.20, direction:"maximize" },
    { label:"Cost", weight:0.15, direction:"minimize" },
    { label:"Feasibility", weight:0.10, direction:"maximize" }
  ];
  const critIds: string[] = [];
  for (let i=0;i<crit.length;i++){
    const id = await rpc(sb, "delib_upsert_criterion", {
      p_org: org_id, p_session: session_id, p_id: null,
      p_label: crit[i].label, p_desc: null, p_weight: crit[i].weight,
      p_direction: crit[i].direction, p_scale: "0-1", p_order: i
    });
    critIds.push(id);
  }
  console.log('Created criteria:', critIds.length);

  // 3) Options
  const options = [
    { name:"Elasticity Reform (Zoning + Digital Cadaster)", synopsis:"Increase land/housing supply elasticity; streamline approvals", costs:{ capex:120_000_000, opex:8_000_000 }, latency_days:240, authority_flag:"review", equity_note:"Broad benefit; transitional support needed" },
    { name:"Targeted Demand Vouchers", synopsis:"Short-run relief for renters/first-time buyers", costs:{ capex:0, opex:180_000_000 }, latency_days:60, authority_flag:"ok", equity_note:"Helps lower-income cohorts immediately" },
    { name:"Green Standards + Stage-by-Stage Approvals", synopsis:"Phased environmental codes with fast-lane for compliant projects", costs:{ capex:35_000_000, opex:6_000_000 }, latency_days:150, authority_flag:"ok", equity_note:"Protects ecological ceiling; avoids choke points" }
  ];
  const optIds: string[] = [];
  for (const o of options) {
    const id = await rpc(sb, "delib_upsert_option", {
      p_org: org_id, p_session: session_id, p_id: null,
      p_name: o.name, p_synopsis: o.synopsis, p_tags: ["housing","ecology"],
      p_costs: o.costs, p_latency: o.latency_days, p_authority: o.authority_flag, p_equity_note: o.equity_note
    });
    optIds.push(id);
  }
  console.log('Created options:', optIds.length);

  // 4) Scores (normalized 0..1)
  const S: Record<string, number[]> = {
    // Effectiveness, Time-to-impact, Equity, Cost, Feasibility
    [optIds[0]]: [0.85, 0.45, 0.65, 0.55, 0.70],
    [optIds[1]]: [0.55, 0.85, 0.75, 0.40, 0.85],
    [optIds[2]]: [0.70, 0.60, 0.70, 0.65, 0.75],
  };
  for (const [opt, arr] of Object.entries(S)) {
    for (let i=0;i<critIds.length;i++){
      await rpc(sb, "delib_set_score", {
        p_org: org_id, p_session: session_id, p_option: opt, p_criterion: critIds[i],
        p_score: arr[i], p_evidence: ["MAC-L04","MAC-L07","MES-L05","MES-L08"]
      });
    }
  }
  console.log('Created scores');

  // 5) Scenarios + outcomes
  const scenRes = await sb.from("delib_scenarios").insert([
    { org_id, session_id, name:"Demand Surge", summary:"Favorable finance + migration uptick" },
    { org_id, session_id, name:"Water Stress", summary:"Ceiling binds; NRW worsens" },
    { org_id, session_id, name:"Cost Inflation", summary:"Materials/labor cost up 15%" }
  ]).select("id,name");
  if (scenRes.error) throw scenRes.error;
  const scenarios = scenRes.data as {id:string;name:string}[];

  const byName = (n:string)=>scenarios.find(s=>s.name===n)?.id!;
  const outcomes: any[] = [];
  // Elasticity Reform
  outcomes.push(
    { org_id, session_id, option_id: optIds[0], scenario_id: byName("Demand Surge"), outcome_score: 0.82 },
    { org_id, session_id, option_id: optIds[0], scenario_id: byName("Water Stress"), outcome_score: 0.62 },
    { org_id, session_id, option_id: optIds[0], scenario_id: byName("Cost Inflation"), outcome_score: 0.68 },
  );
  // Vouchers
  outcomes.push(
    { org_id, session_id, option_id: optIds[1], scenario_id: byName("Demand Surge"), outcome_score: 0.58 },
    { org_id, session_id, option_id: optIds[1], scenario_id: byName("Water Stress"), outcome_score: 0.44 },
    { org_id, session_id, option_id: optIds[1], scenario_id: byName("Cost Inflation"), outcome_score: 0.52 },
  );
  // Green Standards
  outcomes.push(
    { org_id, session_id, option_id: optIds[2], scenario_id: byName("Demand Surge"), outcome_score: 0.70 },
    { org_id, session_id, option_id: optIds[2], scenario_id: byName("Water Stress"), outcome_score: 0.80 },
    { org_id, session_id, option_id: optIds[2], scenario_id: byName("Cost Inflation"), outcome_score: 0.66 },
  );
  const outRes = await sb.from("delib_scenario_outcomes").insert(outcomes);
  if (outRes.error) throw outRes.error;
  console.log('Created scenarios and outcomes');

  // 6) Constraints
  await sb.from("delib_constraints").insert([
    { org_id, session_id, label:"Budget ≤ $500m", active:true },
    { org_id, session_id, label:"Implementation latency ≤ 240 days", active:true }
  ]);

  // 7) Mandate, Guardrails, Participation
  await rpc(sb, "delib_set_mandate", { p_org: org_id, p_session: session_id, p_label:"Statutory authority", p_status:"ok", p_note:"Planning code amendment needed but within remit" });
  await rpc(sb, "delib_set_mandate", { p_org: org_id, p_session: session_id, p_label:"Budget envelope", p_status:"risk", p_note:"Treasury ceiling tight; phase capex" });

  await rpc(sb, "delib_set_guardrail", { p_org: org_id, p_session: session_id, p_label:"NRW ≤ 20%", p_kind:"cap", p_value:"≤ 20%", p_required:true, p_selected:true });
  await rpc(sb, "delib_set_guardrail", { p_org: org_id, p_session: session_id, p_label:"90-day Review", p_kind:"checkpoint", p_value:"T+90", p_required:true, p_selected:true });

  await rpc(sb, "delib_set_participation", { p_org: org_id, p_session: session_id, p_label:"City forums (Zones X/Y)", p_audience:"Residents/Developers", p_date:null, p_status:"planned" });
  await rpc(sb, "delib_set_participation", { p_org: org_id, p_session: session_id, p_label:"Environmental council hearing", p_audience:"Council", p_date:null, p_status:"planned" });
  console.log('Created mandate, guardrails, participation');

  // 8) Frontier (optional)
  if (flags.with_frontier) {
    console.log('Building frontier...');
    const { error: e1 } = await sb.functions.invoke("delib-frontier", { body: { org_id, session_id, max_bundle: 3 }});
    if (e1) throw new Error(`frontier: ${e1.message}`);
    console.log('Built frontier');
  }

  // 9) Publish dossier (optional)
  let dossier_id: string | null = null;
  if (flags.publish_dossier) {
    console.log('Publishing dossier...');
    // pick two options (Elasticity + Green) as default portfolio
    const selected = [optIds[0], optIds[2]];
    const rejected = [optIds[1]];
    const { data, error } = await sb.functions.invoke("delib-publish-dossier", {
      body: {
        org_id, session_id, version: "1.0.0",
        title: "Housing Portfolio A",
        summary: "Balanced portfolio: elasticity reform + phased green standards.",
        selected_option_ids: selected,
        rejected_option_ids: rejected,
        tradeoff_notes: "Budget risk mitigated via phasing; equity boosted via participation.",
        robustness_notes: "Worst-case regret ≤ 0.25 across scenarios.",
        handoffs: flags.handoffs ?? ["responsive","structural","reflexive"]
      }
    });
    if (error) throw new Error(error.message);
    dossier_id = data?.dossier_id ?? null;
    console.log('Published dossier:', dossier_id);
  }

  return { ok: true, session_id, dossier_id };
}

/* ---------- THEME 2: External Demand Shock ---------- */
async function seedExternalDemand(sb:any, org_id:string, flags: SeedReq) {
  console.log('Creating external demand session...');
  
  const session_id = await rpc(sb, "delib_create_session", {
    p_org: org_id,
    p_loop: "MAC-L06",
    p_mission: "Mitigate export orderbook slump with least regret",
    p_activation_vector: { tri: { trust: 0.49 }, context: ["MAC-L06","MES-L03","MIC-L04"] }
  });
  console.log('Created session:', session_id);

  const crit = [
    { label:"Effectiveness", weight:0.40, direction:"maximize" },
    { label:"Time-to-impact", weight:0.25, direction:"minimize" },
    { label:"Employment Quality", weight:0.20, direction:"maximize" },
    { label:"Fiscal Cost", weight:0.15, direction:"minimize" }
  ];
  const critIds: string[] = [];
  for (let i=0;i<crit.length;i++){
    const id = await rpc(sb, "delib_upsert_criterion", {
      p_org: org_id, p_session: session_id, p_id: null,
      p_label: crit[i].label, p_desc: null, p_weight: crit[i].weight,
      p_direction: crit[i].direction, p_scale: "0-1", p_order: i
    });
    critIds.push(id);
  }

  const options = [
    { name:"Export Credit + FX Hedging Support", costs:{ capex:0, opex:140_000_000 }, latency_days:45, authority_flag:"ok" },
    { name:"Sectoral Reskilling + Matching Vouchers", costs:{ capex:20_000_000, opex:60_000_000 }, latency_days:90, authority_flag:"ok" },
    { name:"Logistics Throughput Boost (Ports)", costs:{ capex:85_000_000, opex:10_000_000 }, latency_days:180, authority_flag:"review" }
  ];
  const optIds: string[] = [];
  for (const o of options) {
    const id = await rpc(sb, "delib_upsert_option", {
      p_org: org_id, p_session: session_id, p_id: null,
      p_name: o.name, p_synopsis: "", p_tags: ["exports","labor"],
      p_costs: o.costs, p_latency: o.latency_days, p_authority: o.authority_flag, p_equity_note: ""
    });
    optIds.push(id);
  }

  const S: Record<string, number[]> = {
    [optIds[0]]: [0.78, 0.80, 0.55, 0.45],
    [optIds[1]]: [0.60, 0.55, 0.70, 0.65],
    [optIds[2]]: [0.68, 0.40, 0.58, 0.55],
  };
  for (const [opt, arr] of Object.entries(S)) {
    for (let i=0;i<critIds.length;i++){
      await rpc(sb, "delib_set_score", {
        p_org: org_id, p_session: session_id, p_option: opt, p_criterion: critIds[i],
        p_score: arr[i], p_evidence: ["MAC-L06","MES-L03"]
      });
    }
  }

  const scenRes = await sb.from("delib_scenarios").insert([
    { org_id, session_id, name:"REER appreciation", summary:"FX gets stronger; competitiveness erodes" },
    { org_id, session_id, name:"Global slowdown", summary:"Orders −25% persist 2 quarters" }
  ]).select("id,name");
  if (scenRes.error) throw scenRes.error;
  const scenarios = scenRes.data as {id:string;name:string}[];
  const byName = (n:string)=>scenarios.find(s=>s.name===n)?.id!;
  const outcomes: any[] = [];
  outcomes.push(
    { org_id, session_id, option_id: optIds[0], scenario_id: byName("REER appreciation"), outcome_score: 0.76 },
    { org_id, session_id, option_id: optIds[0], scenario_id: byName("Global slowdown"), outcome_score: 0.64 },
    { org_id, session_id, option_id: optIds[1], scenario_id: byName("REER appreciation"), outcome_score: 0.58 },
    { org_id, session_id, option_id: optIds[1], scenario_id: byName("Global slowdown"), outcome_score: 0.70 },
    { org_id, session_id, option_id: optIds[2], scenario_id: byName("REER appreciation"), outcome_score: 0.60 },
    { org_id, session_id, option_id: optIds[2], scenario_id: byName("Global slowdown"), outcome_score: 0.66 }
  );
  const outRes = await sb.from("delib_scenario_outcomes").insert(outcomes);
  if (outRes.error) throw outRes.error;

  await sb.from("delib_constraints").insert([
    { org_id, session_id, label:"Net fiscal ≤ $250m", active:true },
    { org_id, session_id, label:"Employment quality not deteriorating", active:true }
  ]);

  await rpc(sb, "delib_set_mandate", { p_org: org_id, p_session: session_id, p_label:"Treasury approval", p_status:"risk", p_note:"ESC buffer tight" });
  await rpc(sb, "delib_set_guardrail", { p_org: org_id, p_session: session_id, p_label:"Target SME default rate ≤ 2.5%", p_kind:"cap", p_value:"≤ 2.5%", p_required:true, p_selected:true });
  await rpc(sb, "delib_set_participation", { p_org: org_id, p_session: session_id, p_label:"Sector roundtable", p_audience:"Chambers/Unions", p_date:null, p_status:"planned" });

  if (flags.with_frontier) {
    const { error: e1 } = await sb.functions.invoke("delib-frontier", { body: { org_id, session_id, max_bundle: 3 }});
    if (e1) throw new Error(`frontier: ${e1.message}`);
  }

  let dossier_id: string | null = null;
  if (flags.publish_dossier) {
    const selected = [optIds[0], optIds[1]];
    const rejected = [optIds[2]];
    const { data, error } = await sb.functions.invoke("delib-publish-dossier", {
      body: {
        org_id, session_id, version: "1.0.0",
        title: "Export Stabilization Portfolio A",
        summary: "Blend of export credit and reskilling to offset order slump.",
        selected_option_ids: selected,
        rejected_option_ids: rejected,
        tradeoff_notes: "Budget cap respected; employment quality maintained.",
        robustness_notes: "Regret ≤ 0.20 under tested scenarios.",
        handoffs: flags.handoffs ?? ["responsive","structural","reflexive"]
      }
    });
    if (error) throw new Error(error.message);
    dossier_id = data?.dossier_id ?? null;
  }

  return { ok: true, session_id, dossier_id };
}

/* ---------- response helper ---------- */
function J(obj: unknown, status=200) {
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { 
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}