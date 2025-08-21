// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = { org_id: string; horizon?: string };

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
    console.log('Admin backtest seeded function called');
    
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
    
    const { org_id, horizon = "P180D" } = await req.json() as Body;
    console.log('Request body:', { org_id, horizon });
    
    if (!org_id) {
      return J({ error: "org_id required" }, 400);
    }

    // Ensure owner via the same RPC the SQL uses
    // If you prefer real metrics, call your existing backtest-build function per rule_id instead of the SQL seeder.
    console.log('Building demo backtests for seeded rules...');
    const { error } = await sb.rpc("seed_demo_backtests", { 
      p_org: org_id, 
      p_horizon: horizon 
    });
    
    if (error) {
      console.error('Seed demo backtests error:', error);
      return J({ error: error.message }, 400);
    }

    console.log('Demo backtests seeding completed successfully');
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