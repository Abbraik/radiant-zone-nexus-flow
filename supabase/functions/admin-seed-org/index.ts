// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = { org_id: string; with_mock?: boolean };

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
    console.log('Admin seed org function called');
    
    const supa = createClient(
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
    
    const body = (await req.json()) as Body;
    console.log('Request body:', body);
    
    if (!body?.org_id) {
      return json({ error: "org_id required" }, 400);
    }

    // Verify current user is OWNER for org (RLS-safe check through RPC)
    console.log('Seeding anticipatory minimal data...');
    const { error: seedErr } = await supa.rpc("seed_anticipatory_minimal", { 
      p_org: body.org_id 
    });
    
    if (seedErr) {
      console.error('Seed error:', seedErr);
      return json({ error: seedErr.message }, 403);
    }

    if (body.with_mock) {
      console.log('Seeding mock indicators...');
      const { error: mockErr } = await supa.rpc("seed_mock_indicators", { 
        p_org: body.org_id 
      });
      
      if (mockErr) {
        console.error('Mock indicators error:', mockErr);
        return json({ error: mockErr.message }, 400);
      }
    }

    console.log('Seed completed successfully');
    return json({ ok: true });
  } catch (e) {
    console.error('Function error:', e);
    return json({ error: String(e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}