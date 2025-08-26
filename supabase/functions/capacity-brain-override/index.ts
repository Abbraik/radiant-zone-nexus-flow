// Capacity Brain Override Endpoint
// Accepts override data, stores audit record, returns new decision

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.split('Bearer ')[1]
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { eventId, capacity, reason, approver } = await req.json();

    // Get the original event
    const { data: originalEvent, error: eventError } = await supabase
      .from('activation_events')
      .select('*')
      .eq('event_id', eventId)
      .single();

    if (eventError || !originalEvent) {
      return new Response(
        JSON.stringify({ error: 'Original event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const originalDecision = originalEvent.decision;

    // Create new decision with overridden capacity
    let openRoute = '/';
    let preselectTemplate = 'default';
    
    switch (capacity) {
      case 'responsive':
        openRoute = '/workspace-5c/responsive/checkpoint';
        preselectTemplate = 'containment_pack';
        break;
      case 'reflexive':
        openRoute = '/workspace-5c/reflexive/learning';
        preselectTemplate = 'learning_review';
        break;
      case 'deliberative':
        openRoute = '/workspace-5c/deliberative/portfolio';
        preselectTemplate = 'portfolio_compare';
        break;
      case 'anticipatory':
        openRoute = '/workspace-5c/anticipatory/watchboard';
        preselectTemplate = 'readiness_plan';
        break;
      case 'structural':
        openRoute = '/workspace-5c/structural/dossier';
        preselectTemplate = 'dossier_draft';
        break;
    }

    // Generate new fingerprint for override
    const fingerprintData = [
      originalDecision.loopId,
      capacity,
      preselectTemplate,
      'OVERRIDE',
      originalEvent.time_window,
      Date.now().toString()
    ].join('|');

    const fingerprint = Array.from(
      new Uint8Array(
        await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprintData))
      )
    ).map(b => b.toString(16).padStart(2, '0')).join('');

    const newDecision = {
      ...originalDecision,
      capacity,
      openRoute,
      preselectTemplate,
      fingerprint,
      reasonCodes: [...originalDecision.reasonCodes, 'MANUAL_OVERRIDE'],
      humanRationale: `Manual override: ${reason}. Original: ${originalDecision.humanRationale}`,
      confidence: 0.9, // High confidence in manual decision
      blocked: false
    };

    // Store the override record
    const { error: overrideError } = await supabase
      .from('activation_overrides')
      .insert({
        event_id: eventId,
        actor: user.id,
        before: originalDecision,
        after: newDecision,
        reason,
        approved_by: approver || null
      });

    if (overrideError) {
      console.error('Error storing override:', overrideError);
      return new Response(
        JSON.stringify({ error: 'Failed to store override' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(newDecision),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Override error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});