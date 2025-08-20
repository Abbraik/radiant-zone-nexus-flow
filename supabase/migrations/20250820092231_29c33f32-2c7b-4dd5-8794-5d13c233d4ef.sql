-- Create RPC function to insert sprint tasks
CREATE OR REPLACE FUNCTION insert_sprint_tasks(task_data JSONB)
RETURNS VOID AS $$
DECLARE
    task_record JSONB;
BEGIN
    FOR task_record IN SELECT * FROM jsonb_array_elements(task_data)
    LOOP
        INSERT INTO public.sprint_tasks (
            sprint_id,
            user_id,
            title,
            description,
            meta
        ) VALUES (
            (task_record->>'sprint_id')::UUID,
            (task_record->>'user_id')::UUID,
            task_record->>'title',
            task_record->>'description',
            (task_record->'meta')::JSONB
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;