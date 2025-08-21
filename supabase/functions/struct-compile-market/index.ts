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

    console.log('Compiling market data for session:', session_id);

    const [permits, pricing, auctions] = await Promise.all([
      sel(sb, "struct_permits", org_id, session_id),
      sel(sb, "struct_pricing_rules", org_id, session_id),
      sel(sb, "struct_auctions", org_id, session_id),
    ]);

    const compiled = {
      permits: (permits||[]).map((p:any)=>({ 
        id:p.id, 
        name:p.name, 
        cap_rule:p.cap_rule, 
        price_rule:p.price_rule 
      })),
      pricing: (pricing||[]).map((r:any)=>({ 
        id:r.id, 
        label:r.label, 
        formula:r.formula 
      })),
      auctions: (auctions||[]).map((a:any)=>({ 
        id:a.id, 
        name:a.name, 
        mechanism:a.mechanism, 
        lot_size:a.lot_size, 
        reserve_price:a.reserve_price 
      }))
    };

    const { data, error } = await sb.rpc("struct_save_artifact", {
      p_org: org_id, 
      p_session: session_id, 
      p_kind: "market_compiled", 
      p_blob: compiled
    });

    if (error) {
      console.error('Error saving market artifact:', error);
      return J({ error: error.message }, 400);
    }

    const result = { 
      artifact_id: data, 
      compiled_count: { 
        permits: compiled.permits.length, 
        pricing: compiled.pricing.length, 
        auctions: compiled.auctions.length 
      } 
    };

    console.log('Market compilation completed:', result);
    return J(result);

  } catch (error) {
    console.error('Error in market compiler:', error);
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

async function sel(sb:any, table:string, org_id:string, session_id:string){
  const { data, error } = await sb.from(table).select("*").eq("org_id",org_id).eq("session_id",session_id);
  if (error) throw error; 
  return data;
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