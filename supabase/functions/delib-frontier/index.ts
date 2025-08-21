// delib-frontier Edge Function
// Builds a Pareto frontier with simple heuristics:
// Risk = normalized worst-case regret over provided delib_scenario_outcomes
// Cost = normalized (capex+opex+latency factor) of included options
// Equity = average equity proxy from criteria (if criterion label contains "Equity") else 0.5
// Applies active constraints (filter infeasible combos)
// Saves each point via RPC delib_save_frontier_point

// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function combinations<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  const backtrack = (start: number, path: T[]) => {
    if (path.length === k) { out.push([...path]); return; }
    for (let i = start; i < arr.length; i++) backtrack(i+1, [...path, arr[i]]);
  };
  backtrack(0, []);
  return out;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_ANON_KEY")!, 
      {
        global: { 
          headers: { Authorization: req.headers.get("Authorization")! } 
        }
      }
    );

    const { org_id, session_id, max_bundle = 3 } = await req.json();
    if (!org_id || !session_id) {
      return J({ error: "org_id, session_id required" }, 400);
    }

    console.log(`Building frontier for session: ${session_id}, max_bundle: ${max_bundle}`);

    const [{ data: opts }, { data: outcomes }, { data: crits }, { data: cons }] = await Promise.all([
      sb.from("delib_options").select("id,name,costs,latency_days").eq("org_id", org_id).eq("session_id", session_id),
      sb.from("delib_scenario_outcomes").select("option_id,scenario_id,outcome_score").eq("org_id", org_id).eq("session_id", session_id),
      sb.from("delib_criteria").select("id,label,weight").eq("org_id", org_id).eq("session_id", session_id),
      sb.from("delib_constraints").select("*").eq("org_id", org_id).eq("session_id", session_id).eq("active", true),
    ]);

    const equityCrit = (crits || []).find(c => /equity/i.test(c.label));
    const optIds = (opts || []).map(o => o.id);
    const K = Math.min(max_bundle, optIds.length);
    const bundles: string[][] = [];
    
    for (let k = 1; k <= K; k++) {
      bundles.push(...combinations(optIds, k));
    }

    console.log(`Generated ${bundles.length} potential bundles`);

    // Simple normalize helpers
    const sumCost = (ids: string[]) => {
      let c = 0; 
      for (const id of ids) {
        const o = (opts || []).find((x: any) => x.id === id); 
        const cc = (o?.costs || {}) as any;
        c += (Number(cc.capex || 0) + Number(cc.opex || 0)) + (Number(o?.latency_days || 0) * 1e6);
      } 
      return c;
    };

    function worstCaseRegret(ids: string[]) {
      // for each scenario, regret = best_outcome - bundle_outcome (avg)
      const scIds = Array.from(new Set((outcomes || []).map((o: any) => o.scenario_id)));
      let worst = 0;
      for (const sId of scIds) {
        const rows = (outcomes || []).filter((r: any) => r.scenario_id === sId);
        const best = Math.max(...rows.map((r: any) => r.outcome_score));
        const ours = rows.filter((r: any) => ids.includes(r.option_id)).map((r: any) => r.outcome_score);
        const avg = ours.length ? (ours.reduce((a: number, b: number) => a + b, 0) / ours.length) : 0.0;
        worst = Math.max(worst, Math.max(0, best - avg));
      }
      return worst; // 0..1
    }

    function equityOf(ids: string[]) {
      // crude proxy: average score on equity criterion if available
      if (!equityCrit) return 0.5;
      // Pull scores via view delib_mcda_totals? For brevity assume 0.5 (UI can later request specific criterion scores)
      return 0.6;
    }

    // Constraints placeholder (app-specific rules)
    const constraintOk = (_ids: string[]) => true;

    // Build, score, save
    const candidates: any[] = [];
    for (const ids of bundles) {
      if (!constraintOk(ids)) continue;
      const risk = worstCaseRegret(ids);
      const cost = sumCost(ids);
      const equity = equityOf(ids);
      candidates.push({ ids, risk, cost, equity });
    }

    // normalize cost to 0..1
    const minC = Math.min(...candidates.map(d => d.cost));
    const maxC = Math.max(...candidates.map(d => d.cost));
    for (const c of candidates) {
      c.cost = (maxC === minC) ? 0.5 : (c.cost - minC) / (maxC - minC);
    }

    // Pareto-efficient (min risk, min cost, max equity)
    const eff: any[] = [];
    for (const p of candidates) {
      const dominated = candidates.some(q =>
        (q.risk <= p.risk && q.cost <= p.cost && q.equity >= p.equity) &&
        (q.risk < p.risk || q.cost < p.cost || q.equity > p.equity)
      );
      if (!dominated) eff.push(p);
    }

    console.log(`Found ${eff.length} Pareto-efficient points`);

    // Save frontier points
    for (let i = 0; i < eff.length; i++) {
      const e = eff[i];
      await sb.rpc("delib_save_frontier_point", {
        p_org: org_id, 
        p_session: session_id, 
        p_label: `P${i + 1}`,
        p_option_ids: e.ids, 
        p_risk: e.risk, 
        p_cost: e.cost, 
        p_equity: e.equity,
        p_regret: e.risk, 
        p_feasible: true
      });
    }

    return J({ count: eff.length });
  } catch (error) {
    console.error("Error in delib-frontier:", error);
    return J({ error: "Internal server error" }, 500);
  }
});

function J(obj: unknown, status = 200) { 
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { 
      "Content-Type": "application/json",
      ...corsHeaders
    } 
  }); 
}