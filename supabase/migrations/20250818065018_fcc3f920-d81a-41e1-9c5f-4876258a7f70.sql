-- Create a function to add ACT zone demo task
CREATE OR REPLACE FUNCTION public.create_act_demo_task()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    demo_user_id UUID;
    task_id UUID;
BEGIN
    -- Check if we have any users, if not create a demo user entry in profiles
    SELECT user_id INTO demo_user_id FROM profiles LIMIT 1;
    
    IF demo_user_id IS NULL THEN
        -- Create a demo user profile
        demo_user_id := gen_random_uuid();
        INSERT INTO profiles (id, user_id, display_name) 
        VALUES (demo_user_id, demo_user_id, 'Demo User');
    END IF;
    
    -- Create the ACT zone task
    INSERT INTO tasks (
        title,
        description,
        zone,
        task_type,
        status,
        priority,
        payload,
        user_id
    ) VALUES (
        'Sprint Planning Workshop',
        'Plan and configure your first sprint using the ACT zone workspace tools',
        'ACT',
        'sprint-planning',
        'todo',
        'high',
        '{"type": "sprint-planning", "requiresWizard": true}',
        demo_user_id
    ) RETURNING id INTO task_id;
    
    RETURN task_id;
END;
$$;

-- Execute the function to create the demo task
SELECT public.create_act_demo_task();