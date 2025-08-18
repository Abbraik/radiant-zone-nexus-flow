-- Create remaining RPC functions
CREATE OR REPLACE FUNCTION public.create_redesign_task(
  loop_uuid UUID,
  reason_text TEXT,
  task_capacity TEXT DEFAULT 'reflexive'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_task_id UUID;
  loop_name TEXT;
BEGIN
  -- Get loop name
  SELECT name INTO loop_name FROM public.loops WHERE id = loop_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Loop not found';
  END IF;
  
  -- Create redesign task
  INSERT INTO public.tasks (
    title,
    description,
    zone,
    task_type,
    capacity,
    loop_id,
    status,
    priority,
    user_id,
    payload
  ) VALUES (
    'Redesign: ' || loop_name,
    'Automated redesign task triggered by: ' || reason_text,
    CASE 
      WHEN task_capacity = 'reflexive' THEN 'think'
      WHEN task_capacity = 'deliberative' THEN 'think'
      ELSE 'think'
    END,
    'loop_design',
    task_capacity::capacity_type,
    loop_uuid,
    'todo',
    'high',
    auth.uid(),
    jsonb_build_object(
      'trigger_reason', reason_text,
      'auto_generated', true,
      'loop_id', loop_uuid
    )
  ) RETURNING id INTO new_task_id;
  
  RETURN new_task_id;
END;
$$;

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION public.refresh_loop_metrics()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_loop_metrics;
END;
$$;