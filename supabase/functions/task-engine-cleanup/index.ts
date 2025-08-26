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

    const now = new Date();
    let cleanupResults = {
      expired_locks_released: 0,
      stale_drafts_cleaned: 0,
      old_events_archived: 0,
      reminders_processed: 0
    };

    console.log('Starting task engine cleanup...');

    // 1. Release expired locks
    const { data: expiredLocks, error: lockError } = await supabase
      .from('task_locks')
      .update({ released_at: now.toISOString() })
      .is('released_at', null)
      .lt('expires_at', now.toISOString())
      .select('id, task_id');

    if (lockError) {
      console.error('Failed to release expired locks:', lockError);
    } else {
      cleanupResults.expired_locks_released = expiredLocks?.length || 0;
      
      // Log lock release events
      if (expiredLocks && expiredLocks.length > 0) {
        const lockEvents = expiredLocks.map(lock => ({
          task_id: lock.task_id,
          event_type: 'lock_released',
          details: { reason: 'expired', auto_released: true },
          created_by: 'system'
        }));

        await supabase.from('task_events_v2').insert(lockEvents);
      }
    }

    // 2. Clean up stale draft tasks (older than 30 days)
    const staleDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const { data: staleDrafts, error: draftError } = await supabase
      .from('tasks_v2')
      .delete()
      .eq('status', 'draft')
      .lt('created_at', staleDate.toISOString())
      .select('id');

    if (draftError) {
      console.error('Failed to clean stale drafts:', draftError);
    } else {
      cleanupResults.stale_drafts_cleaned = staleDrafts?.length || 0;
    }

    // 3. Archive old events (keep last 1000 per task, delete older ones)
    const { error: archiveError } = await supabase.rpc('archive_old_task_events', {
      keep_count: 1000
    });

    if (archiveError) {
      console.error('Failed to archive old events:', archiveError);
    } else {
      // This would be returned by the RPC function if it existed
      cleanupResults.old_events_archived = 0;
    }

    // 4. Process due reminders
    const { data: dueReminders, error: reminderError } = await supabase
      .from('task_reminders')
      .select('*, tasks_v2!inner(id, title, status)')
      .lte('reminder_time', now.toISOString())
      .eq('sent', false)
      .neq('tasks_v2.status', 'completed')
      .neq('tasks_v2.status', 'cancelled');

    if (reminderError) {
      console.error('Failed to fetch due reminders:', reminderError);
    } else if (dueReminders && dueReminders.length > 0) {
      // Mark reminders as sent
      const reminderIds = dueReminders.map(r => r.id);
      await supabase
        .from('task_reminders')
        .update({ sent: true, sent_at: now.toISOString() })
        .in('id', reminderIds);

      // Create reminder events
      const reminderEvents = dueReminders.map(reminder => ({
        task_id: reminder.task_id,
        event_type: 'reminder_sent',
        details: { 
          reminder_type: reminder.reminder_type,
          message: reminder.message 
        },
        created_by: 'system'
      }));

      await supabase.from('task_events_v2').insert(reminderEvents);
      
      cleanupResults.reminders_processed = dueReminders.length;

      // Here you would typically send actual notifications
      // For now, we just log them
      console.log(`Processed ${dueReminders.length} due reminders`);
    }

    console.log('Task cleanup completed:', cleanupResults);

    return new Response(
      JSON.stringify({ 
        success: true,
        cleanup_results: cleanupResults,
        timestamp: now.toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Task cleanup failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
