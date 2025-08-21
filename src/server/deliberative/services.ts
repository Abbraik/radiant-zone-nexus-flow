import { createClient } from "@supabase/supabase-js";

function supaWithUser(jwt: string) {
  return createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_ANON_KEY!, 
    { 
      global: { 
        headers: { Authorization: `Bearer ${jwt}` } 
      } 
    }
  );
}

export async function recomputeTotals(jwt: string, org_id: string, session_id: string) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("delib-recompute", { 
    body: { org_id, session_id } 
  });
  if (error) throw error; 
  return data;
}

export async function buildFrontier(jwt: string, org_id: string, session_id: string, max_bundle = 3) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("delib-frontier", { 
    body: { org_id, session_id, max_bundle } 
  });
  if (error) throw error; 
  return data;
}

export async function publishDossier(jwt: string, input: {
  org_id: string; 
  session_id: string; 
  version: string; 
  title: string; 
  summary: string; 
  selected_option_ids: string[]; 
  rejected_option_ids: string[]; 
  tradeoff_notes?: string; 
  robustness_notes?: string; 
  handoffs?: ("responsive" | "structural" | "reflexive")[];
}) {
  const sb = supaWithUser(jwt);
  const { data, error } = await sb.functions.invoke("delib-publish-dossier", { 
    body: input 
  });
  if (error) throw error; 
  return data;
}