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
    const { 
      org_id, 
      session_id, 
      version, 
      title, 
      rationale, 
      lever_summary, 
      adoption_plan, 
      mesh_summary, 
      process_summary, 
      handoffs = [] 
    } = await req.json();
    
    if (!org_id || !session_id) {
      return J({ error: "org_id, session_id required" }, 400);
    }

    console.log('Publishing structural dossier for session:', session_id);

    const { data, error } = await sb.rpc("struct_publish_dossier", {
      p_org: org_id, 
      p_session: session_id, 
      p_version: version, 
      p_title: title, 
      p_rationale: rationale,
      p_lever_summary: lever_summary, 
      p_adoption_plan: adoption_plan, 
      p_mesh_summary: mesh_summary, 
      p_process_summary: process_summary, 
      p_handoffs: handoffs
    });

    if (error) {
      console.error('Error publishing dossier:', error);
      return J({ error: error.message }, 400);
    }

    // Create actual tasks for each handoff
    const handoffResults = [];
    for (const to of handoffs as string[]) {
      const { data: taskId, error: handoffError } = await sb.rpc("struct_handoff_task", {
        p_org: org_id, 
        p_session: session_id, 
        p_to: to,
        p_title: `Structural → ${to} rollout`, 
        p_payload: { dossier_id: data }, 
        p_due: null
      });

      if (handoffError) {
        console.error(`Error creating handoff task for ${to}:`, handoffError);
      } else {
        handoffResults.push({ to, task_id: taskId });
      }
    }

    const result = { 
      dossier_id: data, 
      handoffs: handoffResults 
    };

    console.log('Dossier published successfully:', result);
    return J(result);

  } catch (error) {
    console.error('Error in struct-publish-dossier function:', error);
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

function J(obj: unknown, status=200){ 
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: { 
      "Content-Type":"application/json",
      ...corsHeaders
    }
  }); 
}