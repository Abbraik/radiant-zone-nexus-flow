// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parse } from "https://deno.land/std@0.224.0/csv/parse.ts";

type CSVMap = { 
  loop_col: string; 
  ind_col: string; 
  time_col: string; 
  value_col: string; 
  lower_col?: string; 
  upper_col?: string; 
  time_format?: string; 
};

type Body = {
  org_id: string;
  mode: "csv" | "json";
  csv?: string;                 // raw CSV text
  csv_map?: CSVMap;             // column mapping
  json?: Array<{ 
    loop_code: string; 
    indicator: string; 
    t: string; 
    value: number; 
    lower?: number; 
    upper?: number; 
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
    console.log('Admin import indicators function called');
    
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
    
    const b = await req.json() as Body;
    console.log('Request mode:', b.mode);
    
    if (!b?.org_id) {
      return j({ error: "org_id required" }, 400);
    }

    let payload: any[] = [];
    
    if (b.mode === "csv") {
      if (!b.csv || !b.csv_map) {
        return j({ error: "csv and csv_map required" }, 400);
      }
      
      console.log('Parsing CSV data...');
      const rows = [...await parse(b.csv, { skipFirstRow: true })] as Record<string,string>[];
      
      payload = rows.map(r => ({
        loop_code: r[b.csv_map!.loop_col],
        indicator: r[b.csv_map!.ind_col],
        t: r[b.csv_map!.time_col],
        value: Number(r[b.csv_map!.value_col]),
        lower: b.csv_map!.lower_col ? Number(r[b.csv_map!.lower_col]) : null,
        upper: b.csv_map!.upper_col ? Number(r[b.csv_map!.upper_col]) : null
      }));
      
      console.log(`Parsed ${payload.length} CSV rows`);
    } else if (b.mode === "json") {
      payload = b.json || [];
      console.log(`Processing ${payload.length} JSON records`);
    } else {
      return j({ error: "mode must be csv or json" }, 400);
    }

    // RLS-safe: call RPC that checks owner
    console.log('Ingesting indicator data...');
    const { data, error } = await supa.rpc("ingest_indicator_json", { 
      p_org: b.org_id, 
      p_payload: payload 
    });
    
    if (error) {
      console.error('Ingest error:', error);
      return j({ error: error.message }, 400);
    }

    console.log('Import completed successfully, inserted:', data);
    return j({ inserted: data });
  } catch (e) {
    console.error('Function error:', e);
    return j({ error: String(e) }, 500);
  }
});

function j(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}