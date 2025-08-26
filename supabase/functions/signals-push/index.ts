// Signals Push Endpoint
// Handles real-time signal ingestion from trusted sources

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  source_id: string;
  signature?: string;
  timestamp: string;
  observations: Array<{
    indicator_key: string;
    ts: string;
    value: number;
    unit: string;
    meta?: Record<string, any>;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: PushPayload = await req.json();
    
    // Basic validation
    if (!payload.source_id || !payload.observations?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate hash for each observation for idempotency
    const processedObs = await Promise.all(
      payload.observations.map(async (obs) => {
        const hashInput = `${payload.source_id}|${obs.indicator_key}|${obs.ts}|${obs.value}`;
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashInput));
        const hash = Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0')).join('');

        return {
          source_id: payload.source_id,
          indicator_key: obs.indicator_key,
          ts: obs.ts,
          value: obs.value,
          unit: obs.unit,
          meta: obs.meta || {},
          hash,
          user_id: null, // Service role insert
        };
      })
    );

    // Insert raw observations
    const { data: insertedObs, error: insertError } = await supabase
      .from('raw_observations')
      .insert(processedObs)
      .select('obs_id');

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert observations', details: insertError.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Process each observation through normalization
    const processedCount = insertedObs?.length || 0;
    
    // Update ingestion run tracking
    await supabase.from('ingestion_runs').insert({
      source_id: payload.source_id,
      rows_in: payload.observations.length,
      rows_kept: processedCount,
      status: 'ok',
      message: `Processed ${processedCount} observations`,
      finished_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        skipped: payload.observations.length - processedCount,
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Signals push error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});