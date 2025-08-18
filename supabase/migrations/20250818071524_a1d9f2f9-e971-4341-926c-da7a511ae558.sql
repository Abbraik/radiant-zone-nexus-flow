-- Create a function to reset all tasks to available state
CREATE OR REPLACE FUNCTION public.reset_all_tasks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Reset all tasks to available state
    UPDATE tasks 
    SET 
        assigned_to = NULL,
        status = 'todo',
        updated_at = now()
    WHERE assigned_to IS NOT NULL OR status != 'todo';
END;
$$;