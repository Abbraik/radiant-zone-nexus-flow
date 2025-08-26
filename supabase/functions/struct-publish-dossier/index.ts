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

    // Generate public slug and publish
    const publicSlug = `dossier-${dossier_id.split('-')[0]}-v1`

    const { error } = await supabase
      .from('structural_dossiers')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        public_slug: publicSlug
      })
      .eq('dossier_id', dossier_id)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, public_slug: publicSlug }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})