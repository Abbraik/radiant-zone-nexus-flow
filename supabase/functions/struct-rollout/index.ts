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
    const { org_id, session_id, plan } = await req.json(); // plan = [{title, payload, to, due_at}]
    
    if (!org_id || !session_id || !Array.isArray(plan)) {
      return J({ error: "org_id, session_id, plan[] required" }, 400);
    }

    console.log('Executing rollout plan for session:', session_id, 'with', plan.length, 'tasks');

    const results: any[] = [];
    for (const p of plan) {
      const { data, error } = await sb.rpc("struct_handoff_task", {
        p_org: org_id, 
        p_session: session_id, 
        p_to: p.to, 
        p_title: p.title, 
        p_payload: p.payload ?? {}, 
        p_due: p.due_at ?? null
      });
      
      if (error) {
        console.error(`Error creating rollout task "${p.title}":`, error);
        return J({ error: error.message }, 400);
      }
      
      results.push({ title: p.title, task_id: data, to: p.to });
    }

    const result = { ok: true, results };
    console.log('Rollout plan executed successfully:', result);
    return J(result);

  } catch (error) {
    console.error('Error in struct-rollout function:', error);
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