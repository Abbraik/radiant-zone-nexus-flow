import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization');
    }

    const { task_id, duration = 30 } = await req.json(); // Default 30 minutes

    if (!task_id) {
      return new Response(
        JSON.stringify({ error: 'Task ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (duration * 60 * 1000)); // Convert minutes to milliseconds

    // Check for existing active locks
    const { data: existingLocks, error: lockCheckError } = await supabase
      .from('task_locks')
      .select('*')
      .eq('task_id', task_id)
      .is('released_at', null)
      .gt('expires_at', now.toISOString());

    if (lockCheckError) {
      throw new Error(`Failed to check existing locks: ${lockCheckError.message}`);
    }

    // If there's an active lock by someone else, deny the request
    if (existingLocks && existingLocks.length > 0) {
      const activeLock = existingLocks[0];
      if (activeLock.user_id !== user.id) {
        return new Response(
          JSON.stringify({ 
            error: 'Task is already locked by another user',
            locked_by: activeLock.user_id,
            expires_at: activeLock.expires_at
          }),
          { 
            status: 409, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // If it's the same user, extend the existing lock
      const { data: updatedLock, error: updateError } = await supabase
        .from('task_locks')
        .update({ expires_at: expiresAt.toISOString() })
        .eq('id', activeLock.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to extend lock: ${updateError.message}`);
      }

      console.log(`Lock extended for task ${task_id} by user ${user.id}`);

      return new Response(
        JSON.stringify({ 
          lock: updatedLock,
          extended: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create new lock
    const { data: newLock, error: createError } = await supabase
      .from('task_locks')
      .insert({
        task_id,
        user_id: user.id,
        acquired_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Lock creation error:', createError);
      throw new Error(`Failed to acquire lock: ${createError.message}`);
    }

    // Create lock acquisition event
    const { error: eventError } = await supabase
      .from('task_events_v2')
      .insert({
        task_id,
        event_type: 'lock_acquired',
        details: {
          lock_duration_minutes: duration,
          expires_at: expiresAt.toISOString()
        },
        created_by: user.id
      });

    if (eventError) {
      console.error('Lock event error:', eventError);
      // Don't fail the lock acquisition for event logging errors
    }

    console.log(`Lock acquired for task ${task_id} by user ${user.id} for ${duration} minutes`);

    return new Response(
      JSON.stringify({ 
        lock: newLock,
        acquired: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Lock acquisition failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});