import { createClient } from "@supabase/supabase-js";

export function supaAdmin() {
  const url = "https://eyyovobwgaqeizfxmkox.supabase.co";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export function supaWithUser(jwt: string) {
  const url = "https://eyyovobwgaqeizfxmkox.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eW92b2J3Z2FxZWl6Znhta294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTExODUsImV4cCI6MjA3MTA2NzE4NX0.ieo7c11vEhdWxWKTf4C61PgOdFO7_NT2v9eCAqZMECs";
  return createClient(url, key, { 
    global: { headers: { Authorization: `Bearer ${jwt}` } }
  });
}

export async function createStructSession(jwt: string, args: {
  org_id: string; 
  loop_code: string; 
  mission?: string;
}) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.rpc("struct_create_session", { 
    p_org: args.org_id, 
    p_loop: args.loop_code, 
    p_mission: args.mission ?? null 
  });
  if (error) throw error; 
  return data as string;
}

export async function setMandate(jwt: string, args: {
  org_id: string; 
  session_id: string; 
  label: string; 
  status: "ok" | "risk" | "fail"; 
  note?: string;
}) {
  const sb = supaWithUser(jwt);
  const { error } = await sb.rpc("struct_set_mandate_check", { 
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_label: args.label, 
    p_status: args.status, 
    p_note: args.note ?? null 
  });
  if (error) throw error;
}

export async function getStructuralSession(jwt: string, session_id: string) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb
    .from('struct_sessions')
    .select('*')
    .eq('id', session_id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSessionData(jwt: string, session_id: string) {
  const sb = supaWithUser(jwt);
  
  // Get all related data for the session
  const [
    { data: authorities },
    { data: budgets },
    { data: delegNodes },
    { data: delegEdges },
    { data: mandateChecks },
    { data: meshMetrics },
    { data: meshIssues },
    { data: processSteps },
    { data: processSlas },
    { data: processRaci },
    { data: standards },
    { data: conformanceChecks },
    { data: permits },
    { data: pricingRules },
    { data: auctions }
  ] = await Promise.all([
    sb.from('struct_authority_sources').select('*').eq('session_id', session_id),
    sb.from('struct_budget_envelopes').select('*').eq('session_id', session_id),
    sb.from('struct_deleg_nodes').select('*').eq('session_id', session_id),
    sb.from('struct_deleg_edges').select('*').eq('session_id', session_id),
    sb.from('struct_mandate_checks').select('*').eq('session_id', session_id),
    sb.from('struct_mesh_metrics').select('*').eq('session_id', session_id),
    sb.from('struct_mesh_issues').select('*').eq('session_id', session_id),
    sb.from('struct_process_steps').select('*').eq('session_id', session_id),
    sb.from('struct_process_slas').select('*').eq('session_id', session_id),
    sb.from('struct_process_raci').select('*').eq('session_id', session_id),
    sb.from('struct_standards').select('*').eq('session_id', session_id),
    sb.from('struct_conformance_checks').select('*').eq('session_id', session_id),
    sb.from('struct_permits').select('*').eq('session_id', session_id),
    sb.from('struct_pricing_rules').select('*').eq('session_id', session_id),
    sb.from('struct_auctions').select('*').eq('session_id', session_id)
  ]);

  return {
    authorities: authorities || [],
    budgets: budgets || [],
    delegNodes: delegNodes || [],
    delegEdges: delegEdges || [],
    mandateChecks: mandateChecks || [],
    mesh: {
      nodes: delegNodes || [],
      edges: delegEdges || [],
      metrics: meshMetrics || [],
      issues: meshIssues || []
    },
    process: {
      steps: processSteps || [],
      raci: processRaci || [],
      slas: processSlas || []
    },
    forge: {
      standards: standards || [],
      conformance: conformanceChecks || []
    },
    market: {
      permits: permits || [],
      pricing: pricingRules || [],
      auctions: auctions || []
    }
  };
}