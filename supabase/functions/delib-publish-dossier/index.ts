// delib-publish-dossier Edge Function
// Validates no blocking checks, captures snapshots, calls delib_publish_dossier, 
// and (optionally) emits handoffs.

// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { 
      org_id, 
      session_id, 
      version, 
      title, 
      summary, 
      selected_option_ids, 
      rejected_option_ids, 
      tradeoff_notes, 
      robustness_notes, 
      handoffs = [] 
    } = await req.json();

    if (!org_id || !session_id) {
      return J({ error: "org_id, session_id required" }, 400);
    }

    console.log(`Publishing dossier for session: ${session_id}, version: ${version}`);

    // Validate mandate (no 'fail')
    const { data: mcks } = await sb.from("delib_mandate_checks")
      .select("status")
      .eq("org_id", org_id)
      .eq("session_id", session_id);
    
    if ((mcks || []).some((m: any) => m.status === "fail")) {
      console.error("Mandate check failed - cannot publish");
      return J({ error: "Mandate check failed" }, 400);
    }

    // Publish
    const { data, error } = await sb.rpc("delib_publish_dossier", {
      p_org: org_id, 
      p_session: session_id, 
      p_version: version,
      p_title: title, 
      p_summary: summary, 
      p_selected: selected_option_ids, 
      p_rejected: rejected_option_ids,
      p_trade: tradeoff_notes, 
      p_robust: robustness_notes, 
      p_handoffs: handoffs
    });

    if (error) {
      console.error("Error publishing dossier:", error);
      return J({ error: error.message }, 400);
    }

    console.log(`Dossier published with ID: ${data}`);

    // Optional auto-handoffs
    for (const to of handoffs as string[]) {
      console.log(`Creating handoff to ${to}`);
      await sb.rpc("delib_handoff", {
        p_org: org_id, 
        p_session: session_id, 
        p_to: to,
        p_title: `Deliberative handoff → ${to}`, 
        p_payload: { session_id, dossier_id: data }, 
        p_due: null
      });
    }

    return J({ dossier_id: data });
  } catch (error) {
    console.error("Error in delib-publish-dossier:", error);
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