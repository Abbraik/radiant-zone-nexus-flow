// Capacity Brain Task Creation Endpoint
// Creates tasks with deduplication via fingerprints

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

    const decision = await req.json();

    // Check if task already exists for this fingerprint
    const { data: existingFingerprint } = await supabase
      .from('task_fingerprints')
      .select('task_id')
      .eq('fp', decision.fingerprint)
      .single();

    if (existingFingerprint) {
      return new Response(
        JSON.stringify({
          task_id: existingFingerprint.task_id,
          fingerprint: decision.fingerprint,
          is_existing: true,
          route: decision.openRoute,
          template: decision.preselectTemplate
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new task
    const taskData = {
      title: `${decision.capacity?.charAt(0).toUpperCase()}${decision.capacity?.slice(1)} Task - ${decision.preselectTemplate}`,
      description: decision.humanRationale,
      capacity: decision.capacity,
      loop_id: decision.loopId,
      type: 'reactive',
      scale: 'meso',
      leverage: decision.capacity === 'structural' ? 'S' : 
               decision.capacity === 'deliberative' ? 'P' : 'N',
      priority: decision.blocked ? 'urgent' : 
               decision.confidence > 0.8 ? 'high' :
               decision.confidence > 0.6 ? 'medium' : 'normal',
      status: 'open',
      payload: {
        template: decision.preselectTemplate,
        reasonCodes: decision.reasonCodes,
        confidence: decision.confidence,
        route: decision.openRoute,
        fingerprint: decision.fingerprint
      },
      user_id: user.id,
      assigned_to: user.id,
      due_date: decision.blocked ? 
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : // 1 day for blocked
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()  // 7 days default
    };

    const { data: newTask, error: taskError } = await supabase
      .from('tasks_5c')
      .insert(taskData)
      .select()
      .single();

    if (taskError) {
      console.error('Error creating task:', taskError);
      return new Response(
        JSON.stringify({ error: 'Failed to create task' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store fingerprint mapping
    const { error: fingerprintError } = await supabase
      .from('task_fingerprints')
      .insert({
        fp: decision.fingerprint,
        task_id: newTask.id,
        loop_id: decision.loopId,
        capacity: decision.capacity || 'blocked'
      });

    if (fingerprintError) {
      console.error('Error storing fingerprint:', fingerprintError);
      // Don't fail the whole operation for this
    }

    return new Response(
      JSON.stringify({
        task_id: newTask.id,
        fingerprint: decision.fingerprint,
        is_existing: false,
        route: decision.openRoute,
        template: decision.preselectTemplate
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Task creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});