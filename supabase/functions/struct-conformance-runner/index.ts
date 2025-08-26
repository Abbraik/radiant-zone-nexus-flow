import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { dossier_id } = await req.json()

    // Create a mock conformance run
    const { data: run, error } = await supabase
      .from('conformance_runs')
      .insert({
        dossier_id,
        status: 'ok',
        summary: { total_rules: 3, passed_rules: 3, pass_rate: 1.0 }
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, run_id: run.run_id, status: 'ok' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})