import { supabase } from "@/integrations/supabase/client";

export async function upsertIncident(payload: {
  loop_code: string;
  indicator: string;
  severity: number;
  srt: any;
  guardrails: any;
  status: string;
}) {
  const { data, error } = await supabase
    .from('incidents')
    .insert([{
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ...payload
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function appendIncidentEvent(incidentId: string, event: { kind: string; payload: any }) {
  const { data, error } = await supabase
    .from('incident_events')
    .insert([{
      incident_id: incidentId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      ...event
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function createSprintWithTasks(payload: {
  capacity: string;
  leverage: string;
  due_at: string;
  guardrails: any;
  srt: any;
  tasks: any[];
}) {
  const user = await supabase.auth.getUser();
  
  // Create sprint
  const { data: sprint, error: sprintError } = await supabase
    .from('sprints')
    .insert({
      user_id: user.data.user?.id!,
      name: `${payload.capacity} Sprint`,
      capacity: payload.capacity,
      leverage: payload.leverage,
      due_at: payload.due_at,
      guardrails: payload.guardrails,
      srt: payload.srt
    })
    .select()
    .single();
    
  if (sprintError) throw sprintError;
  
  // Create tasks
  if (payload.tasks.length > 0) {
    const taskInserts = payload.tasks.map(task => ({
      sprint_id: sprint.id,
      user_id: user.data.user?.id!,
      title: task.title,
      description: task.description,
      meta: task.meta
    }));
    
    const { error: tasksError } = await supabase
      .rpc('insert_sprint_tasks', { task_data: taskInserts });
      
    if (tasksError) throw tasksError;
  }
  
  return sprint;
}