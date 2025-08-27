-- Create task_locks table for task locking mechanism (if not exists)
CREATE TABLE IF NOT EXISTS public.task_locks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    locked_by UUID NOT NULL,
    locked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    released_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_assignments table for task ownership (if not exists)
CREATE TABLE IF NOT EXISTS public.task_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner',
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    assigned_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(task_id, user_id, role)
);

-- Create task_events_v2 table for task event logging (if not exists)
CREATE TABLE IF NOT EXISTS public.task_events_v2 (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    detail JSONB,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_task_locks_task_id ON public.task_locks(task_id);
CREATE INDEX IF NOT EXISTS idx_task_locks_expires_at ON public.task_locks(expires_at);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON public.task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_user_id ON public.task_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_events_v2_task_id ON public.task_events_v2(task_id);

-- Enable RLS on all tables (if not already enabled)
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE public.task_locks ENABLE ROW LEVEL SECURITY;
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.task_events_v2 ENABLE ROW LEVEL SECURITY;
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;
END $$;

-- Create RLS policies (only if they don't exist)
DO $$ 
BEGIN
    -- Task locks policies
    BEGIN
        CREATE POLICY "Users can view task locks" ON public.task_locks FOR SELECT USING (true);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can create task locks" ON public.task_locks FOR INSERT WITH CHECK (true);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can update their own task locks" ON public.task_locks FOR UPDATE USING (locked_by = auth.uid() OR auth.uid() IS NULL);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    -- Task assignments policies
    BEGIN
        CREATE POLICY "Users can view task assignments" ON public.task_assignments FOR SELECT USING (true);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can create task assignments" ON public.task_assignments FOR INSERT WITH CHECK (true);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can update their own task assignments" ON public.task_assignments FOR UPDATE USING (user_id = auth.uid() OR auth.uid() IS NULL);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can delete their own task assignments" ON public.task_assignments FOR DELETE USING (user_id = auth.uid() OR auth.uid() IS NULL);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    -- Task events policies
    BEGIN
        CREATE POLICY "Users can view task events" ON public.task_events_v2 FOR SELECT USING (true);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can create task events" ON public.task_events_v2 FOR INSERT WITH CHECK (true);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;
END $$;