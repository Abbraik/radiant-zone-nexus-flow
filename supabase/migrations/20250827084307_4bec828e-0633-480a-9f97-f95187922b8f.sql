-- Create task_locks table for task locking mechanism
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

-- Create task_assignments table for task ownership
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

-- Create task_events_v2 table for task event logging
CREATE TABLE IF NOT EXISTS public.task_events_v2 (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    detail JSONB,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_task_locks_task_id ON public.task_locks(task_id);
CREATE INDEX IF NOT EXISTS idx_task_locks_expires_at ON public.task_locks(expires_at);
CREATE INDEX IF NOT EXISTS idx_task_assignments_task_id ON public.task_assignments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignments_user_id ON public.task_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_events_v2_task_id ON public.task_events_v2(task_id);

-- Add updated_at triggers
CREATE TRIGGER update_task_locks_updated_at
    BEFORE UPDATE ON public.task_locks
    FOR EACH ROW
    EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER update_task_assignments_updated_at
    BEFORE UPDATE ON public.task_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.touch_updated_at();

-- Enable RLS on all tables
ALTER TABLE public.task_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_events_v2 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_locks
CREATE POLICY "Users can view task locks" 
ON public.task_locks 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create task locks" 
ON public.task_locks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own task locks" 
ON public.task_locks 
FOR UPDATE 
USING (locked_by = auth.uid() OR auth.uid() IS NULL);

-- Create RLS policies for task_assignments
CREATE POLICY "Users can view task assignments" 
ON public.task_assignments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create task assignments" 
ON public.task_assignments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own task assignments" 
ON public.task_assignments 
FOR UPDATE 
USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can delete their own task assignments" 
ON public.task_assignments 
FOR DELETE 
USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- Create RLS policies for task_events_v2
CREATE POLICY "Users can view task events" 
ON public.task_events_v2 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create task events" 
ON public.task_events_v2 
FOR INSERT 
WITH CHECK (true);