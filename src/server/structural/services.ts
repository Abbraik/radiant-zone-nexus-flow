import { supaWithUser } from "./repo";

export async function runConformance(jwt: string, org_id: string, session_id: string) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("struct-conformance-runner", { 
    body: { org_id, session_id } 
  });
  if (error) throw error; 
  return data;
}

export async function compileMarket(jwt: string, org_id: string, session_id: string) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("struct-compile-market", { 
    body: { org_id, session_id } 
  });
  if (error) throw error; 
  return data;
}

export async function publishStructuralDossier(jwt: string, input: {
  org_id: string; 
  session_id: string; 
  version: string; 
  title: string; 
  rationale: string; 
  lever_summary: string; 
  adoption_plan: string; 
  mesh_summary: string; 
  process_summary: string; 
  handoffs?: ("responsive"|"reflexive"|"deliberative"|"anticipatory")[];
}) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("struct-publish-dossier", { 
    body: input 
  });
  if (error) throw error; 
  return data;
}

export async function rolloutPlan(jwt: string, org_id: string, session_id: string, plan: {
  title: string; 
  to: "responsive"|"reflexive"|"deliberative"|"anticipatory"; 
  payload?: any; 
  due_at?: string;
}[]) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("struct-rollout", { 
    body: { org_id, session_id, plan } 
  });
  if (error) throw error; 
  return data;
}