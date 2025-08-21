// delib-recompute Edge Function
// Recomputes MCDA totals server-side and returns { totals: [{optionId,total}] }
// Optional: writes events

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

    const { org_id, session_id } = await req.json();
    if (!org_id || !session_id) {
      return J({ error: "org_id, session_id required" }, 400);
    }

    console.log(`Recomputing MCDA totals for session: ${session_id}`);

    // Just read the view (RLS applies)
    const { data, error } = await sb.from("delib_mcda_totals").select("*")
      .eq("org_id", org_id).eq("session_id", session_id);
    
    if (error) {
      console.error("Error reading MCDA totals:", error);
      return J({ error: error.message }, 400);
    }

    // emit event
    await sb.from("delib_events").insert({
      org_id, 
      session_id, 
      kind: "weights_recomputed", 
      payload: { n: data?.length ?? 0 }
    });

    const totals = (data || []).map((d: any) => ({ 
      optionId: d.option_id, 
      total: Number(d.total) 
    }));

    console.log(`Computed ${totals.length} MCDA totals`);

    return J({ totals }, 200);
  } catch (error) {
    console.error("Error in delib-recompute:", error);
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