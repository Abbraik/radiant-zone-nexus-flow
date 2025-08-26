// Capacity Brain Activation Endpoint
// Accepts ActivationInput, runs decision function, stores event, returns decision

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple decision function (matches the client-side version)
function decideActivation(input: any) {
  const { scores, readiness, hints, now } = input;
  const reasonCodes: string[] = [];
  let capacity: string | null = null;
  let confidence = 0.5;
  let blocked = false;
  let blockReasons: string[] = [];

  // Data safety gate
  if (!readiness.autoOk) {
    reasonCodes.push('DQ_BLOCK');
    blocked = true;
    blockReasons = readiness.reasons;
    capacity = null;
    confidence = 0.9;
  }
  // Safety first → Responsive
  else if (scores.severity >= 1.0 || (scores.severity >= 0.7 && scores.persistence >= 0.4)) {
    reasonCodes.push('SEVERITY_HIGH');
    if (scores.persistence >= 0.4) reasonCodes.push('PERSISTENCE_MID');
    capacity = 'responsive';
    confidence = 0.9;
  }
  // Legitimacy split → Deliberative
  else if (scores.legitimacyDelta <= -0.3 || hints?.fairnessRisk) {
    if (scores.legitimacyDelta <= -0.3) reasonCodes.push('LEGITIMACY_DIVERGENCE');
    if (hints?.fairnessRisk) reasonCodes.push('FAIRNESS_RISK');
    capacity = 'deliberative';
    confidence = 0.8;
  }
  // Recurring or hub bottleneck → Structural
  else if (scores.persistence >= 0.6 || scores.hubLoad >= 0.8 || hints?.recurrenceFlag) {
    if (scores.persistence >= 0.6) reasonCodes.push('PERSISTENT');
    if (scores.hubLoad >= 0.8) reasonCodes.push('HUB_SATURATION');
    if (hints?.recurrenceFlag) reasonCodes.push('PERSISTENT');
    capacity = 'structural';
    confidence = 0.8;
  }
  // Risk warming with lead time → Anticipatory
  else if (hints?.earlyWarning && scores.severity < 0.7) {
    reasonCodes.push('EARLY_WARNING');
    capacity = 'anticipatory';
    confidence = 0.7;
  }
  // After action → Reflexive
  else if (hints?.recentAction?.reviewDue || 
          (hints?.recentAction && hints.recentAction.withinDays <= 45)) {
    if (hints.recentAction.reviewDue) reasonCodes.push('REVIEW_DUE');
    else reasonCodes.push('RECENT_ACTION');
    capacity = 'reflexive';
    confidence = 0.6;
  }
  // Default fallback → Reflexive
  else {
    reasonCodes.push('RECENT_ACTION');
    capacity = 'reflexive';
    confidence = 0.3;
  }

  // Determine route and template
  let openRoute = '/';
  let preselectTemplate = 'default';
  
  if (blocked) {
    openRoute = '/data-triage';
    preselectTemplate = 'dq_review';
  } else if (capacity) {
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
  }

  // Generate fingerprint (simplified)
  const fingerprintData = [
    scores.loopId,
    capacity || 'BLOCKED',
    preselectTemplate,
    reasonCodes.sort().join(','),
    scores.window,
    Math.floor(new Date(now).getTime() / (7 * 24 * 60 * 60 * 1000)) // 7-day bucket
  ].join('|');

  const fingerprint = Array.from(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprintData))
    )
  ).map(b => b.toString(16).padStart(2, '0')).join('');

  // Build rationale
  const reasonMap: Record<string, string> = {
    'DQ_BLOCK': 'Data quality insufficient',
    'SEVERITY_HIGH': 'High severity detected',
    'PERSISTENCE_MID': 'Sustained breach pattern',
    'LEGITIMACY_DIVERGENCE': 'Trust-service gap',
    'FAIRNESS_RISK': 'Equity concerns flagged',
    'PERSISTENT': 'Systemic pattern detected',
    'HUB_SATURATION': 'Hub capacity exceeded',
    'EARLY_WARNING': 'Risk signals emerging',
    'REVIEW_DUE': 'Review cycle due',
    'RECENT_ACTION': 'Follow-up required'
  };

  const reasons = reasonCodes.map(code => reasonMap[code] || code).join(', ');
  const confidenceText = confidence >= 0.8 ? 'High confidence' : 
                        confidence >= 0.6 ? 'Medium confidence' : 'Low confidence';
  
  const humanRationale = blocked 
    ? `Automation blocked: ${reasons}. Manual review required.`
    : `${capacity?.charAt(0).toUpperCase()}${capacity?.slice(1)} capacity activated. ${reasons}. ${confidenceText}.`;

  return {
    loopId: scores.loopId,
    capacity,
    reasonCodes,
    humanRationale,
    confidence,
    openRoute,
    preselectTemplate,
    blocked,
    blockReasons: blocked ? blockReasons : undefined,
    fingerprint,
  };
}

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

    // Get the request body
    const input = await req.json();
    
    // Run the decision function
    const decision = await decideActivation(input);

    // Store the activation event
    const { data: event, error: eventError } = await supabase
      .from('activation_events')
      .insert({
        loop_id: decision.loopId,
        time_window: input.scores.window,
        as_of: input.now,
        decision: decision,
        fingerprint: decision.fingerprint,
        created_by: req.headers.get('authorization')?.split('Bearer ')[1] ? 
          (await supabase.auth.getUser(req.headers.get('authorization')?.split('Bearer ')[1])).data.user?.id :
          null
      })
      .select()
      .single();

    if (eventError) {
      console.error('Error storing activation event:', eventError);
      return new Response(
        JSON.stringify({ error: 'Failed to store activation event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ decision, event }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Activation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});