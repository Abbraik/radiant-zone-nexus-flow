// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sb = create(req);
    const { org_id, session_id } = await req.json();
    if (!org_id || !session_id) return J({ error: "org_id, session_id required" }, 400);

    console.log('Running conformance checks for session:', session_id);

    // fetch checks
    const { data: checks, error } = await sb.from("struct_conformance_checks")
      .select("id, standard_id, actor_id, status").eq("org_id", org_id).eq("session_id", session_id);
    if (error) {
      console.error('Error fetching conformance checks:', error);
      return J({ error: error.message }, 400);
    }

    // naive rule: keep existing status, but ensure last_run and emit stats
    let pass=0, warn=0, fail=0;
    for (const c of checks || []) {
      if (c.status === "pass") pass++; 
      else if (c.status === "warn") warn++; 
      else fail++;

      const { error: updateError } = await sb.rpc("struct_set_conformance", { 
        p_org: org_id, 
        p_session: session_id, 
        p_check: c.id, 
        p_status: c.status 
      });
      if (updateError) {
        console.error('Error updating conformance check:', updateError);
      }
    }

    const { error: runError } = await sb.from("struct_conformance_runs").insert({
      org_id, 
      session_id, 
      stats: { pass, warn, fail, total: (checks||[]).length }
    });

    if (runError) {
      console.error('Error inserting conformance run:', runError);
      return J({ error: runError.message }, 400);
    }

    console.log('Conformance run completed:', { pass, warn, fail, total: (checks||[]).length });
    return J({ pass, warn, fail, total: (checks||[]).length });

  } catch (error) {
    console.error('Error in conformance runner:', error);
    return J({ error: error.message }, 500);
  }
});

function create(req: Request) {
  return createClient(
    Deno.env.get("SUPABASE_URL")!, 
    Deno.env.get("SUPABASE_ANON_KEY")!, 
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } }
    }
  );
}

function J(obj: unknown, status=200){ 
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { 
      "Content-Type":"application/json",
      ...corsHeaders
    }
  }); 
}
