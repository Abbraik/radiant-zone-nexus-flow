// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = { org_id: string; also_backtests?: boolean; };

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
    console.log('Admin seed playbooks and triggers function called');
    
    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_ANON_KEY")!, 
      {
        global: { 
          headers: { 
            Authorization: req.headers.get("Authorization")! 
          } 
        }
      }
    );
    
    const { org_id, also_backtests } = (await req.json()) as Body;
    console.log('Request body:', { org_id, also_backtests });
    
    if (!org_id) {
      return J({ error: "org_id required" }, 400);
    }

    // Owner-gated via RPC assert_owner inside function
    console.log('Seeding playbooks and triggers...');
    let { error } = await sb.rpc("seed_playbooks_and_triggers", { p_org: org_id });
    if (error) {
      console.error('Seed playbooks and triggers error:', error);
      return J({ error: error.message }, 403);
    }

    if (also_backtests) {
      console.log('Seeding demo backtests...');
      const { error: err2 } = await sb.rpc("seed_demo_backtests", { 
        p_org: org_id, 
        p_horizon: "P180D" 
      });
      if (err2) {
        console.error('Seed backtests error:', err2);
        return J({ error: err2.message }, 400);
      }
    }

    console.log('Playbooks and triggers seeding completed successfully');
    return J({ ok: true });
  } catch (e) {
    console.error('Function error:', e);
    return J({ error: String(e) }, 500);
  }
});

function J(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}