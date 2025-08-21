// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = {
  org_id: string;
  episodes: Array<{
    loop_code: string;
    indicator: string;
    days: number;
    base: number;
    amp: number;
    period: number;
    breach_start?: number;
    breach_days?: number;
    breach_delta?: number;
  }>;
};

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
    console.log('Admin generate mock function called');
    
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
    
    const body = await req.json() as Body;
    console.log('Request body:', body);
    
    if (!body?.org_id) {
      return J({ error: "org_id required" }, 400);
    }
    
    console.log(`Processing ${body.episodes.length} mock episodes...`);
    
    for (const e of body.episodes) {
      console.log(`Generating series for ${e.loop_code}/${e.indicator}`);
      
      const { error } = await supa.rpc("gen_indicator_series", {
        p_org: body.org_id, 
        p_loop: e.loop_code, 
        p_ind: e.indicator,
        p_days: e.days, 
        p_base: e.base, 
        p_amp: e.amp, 
        p_period: e.period,
        p_breach_start: e.breach_start ?? null, 
        p_breach_days: e.breach_days ?? null, 
        p_breach_delta: e.breach_delta ?? null
      });
      
      if (error) {
        console.error('Generate series error:', error, 'for episode:', e);
        return J({ error: error.message, episode: e }, 400);
      }
    }
    
    console.log('Mock generation completed successfully');
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