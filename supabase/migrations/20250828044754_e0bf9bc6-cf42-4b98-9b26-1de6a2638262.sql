-- Create sprint_tasks table to link tasks with sprints
CREATE TABLE IF NOT EXISTS public.sprint_tasks (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sprint_id uuid NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'pending',
    priority integer DEFAULT 1,
    estimated_hours numeric,
    actual_hours numeric,
    assigned_to uuid,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    meta jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add comments to sprint_tasks table and columns
COMMENT ON TABLE public.sprint_tasks IS 'Individual tasks within a sprint, linking specific work items to sprint containers';
COMMENT ON COLUMN public.sprint_tasks.id IS 'Unique identifier for the sprint task';
COMMENT ON COLUMN public.sprint_tasks.sprint_id IS 'Reference to the parent sprint containing this task';
COMMENT ON COLUMN public.sprint_tasks.user_id IS 'User who created this task';
COMMENT ON COLUMN public.sprint_tasks.title IS 'Brief title describing the task';
COMMENT ON COLUMN public.sprint_tasks.description IS 'Detailed description of the task requirements';
COMMENT ON COLUMN public.sprint_tasks.status IS 'Current status of the task (pending, in_progress, completed, blocked)';
COMMENT ON COLUMN public.sprint_tasks.priority IS 'Priority level of the task (1=highest, 5=lowest)';
COMMENT ON COLUMN public.sprint_tasks.estimated_hours IS 'Estimated time to complete the task in hours';
COMMENT ON COLUMN public.sprint_tasks.actual_hours IS 'Actual time spent on the task in hours';
COMMENT ON COLUMN public.sprint_tasks.assigned_to IS 'User assigned to work on this task';
COMMENT ON COLUMN public.sprint_tasks.due_date IS 'Expected completion date for the task';
COMMENT ON COLUMN public.sprint_tasks.completed_at IS 'Timestamp when the task was marked as completed';
COMMENT ON COLUMN public.sprint_tasks.meta IS 'Additional metadata for the task (flexible JSON structure)';
COMMENT ON COLUMN public.sprint_tasks.created_at IS 'Timestamp when the task was created';
COMMENT ON COLUMN public.sprint_tasks.updated_at IS 'Timestamp when the task was last updated';

-- Create task_progress_logs table for tracking task progress
CREATE TABLE IF NOT EXISTS public.task_progress_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id uuid NOT NULL REFERENCES public.sprint_tasks(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    progress_type text NOT NULL,
    old_status text,
    new_status text,
    hours_logged numeric,
    notes text,
    attachments jsonb DEFAULT '[]'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add comments to task_progress_logs table and columns
COMMENT ON TABLE public.task_progress_logs IS 'Audit trail of progress updates and status changes for sprint tasks';
COMMENT ON COLUMN public.task_progress_logs.id IS 'Unique identifier for the progress log entry';
COMMENT ON COLUMN public.task_progress_logs.task_id IS 'Reference to the sprint task this log entry relates to';
COMMENT ON COLUMN public.task_progress_logs.user_id IS 'User who made the progress update';
COMMENT ON COLUMN public.task_progress_logs.progress_type IS 'Type of progress update (status_change, time_log, checkpoint, comment)';
COMMENT ON COLUMN public.task_progress_logs.old_status IS 'Previous status before this update (for status_change type)';
COMMENT ON COLUMN public.task_progress_logs.new_status IS 'New status after this update (for status_change type)';
COMMENT ON COLUMN public.task_progress_logs.hours_logged IS 'Number of hours logged in this progress update';
COMMENT ON COLUMN public.task_progress_logs.notes IS 'Text notes describing the progress made or issues encountered';
COMMENT ON COLUMN public.task_progress_logs.attachments IS 'Array of file attachments or references related to this progress update';
COMMENT ON COLUMN public.task_progress_logs.metadata IS 'Additional structured data for the progress log entry';
COMMENT ON COLUMN public.task_progress_logs.created_at IS 'Timestamp when this progress log was created';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_sprint_id ON public.sprint_tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_assigned_to ON public.sprint_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_status ON public.sprint_tasks(status);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_due_date ON public.sprint_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_progress_logs_task_id ON public.task_progress_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_task_progress_logs_created_at ON public.task_progress_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.sprint_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_progress_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sprint_tasks
CREATE POLICY "Users can read their own sprint tasks"
    ON public.sprint_tasks FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create their own sprint tasks"
    ON public.sprint_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update sprint tasks they own or are assigned to"
    ON public.sprint_tasks FOR UPDATE
    USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their own sprint tasks"
    ON public.sprint_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for task_progress_logs
CREATE POLICY "Users can read progress logs for tasks they have access to"
    ON public.task_progress_logs FOR SELECT
    USING (auth.uid() IN (
        SELECT DISTINCT COALESCE(st.user_id, st.assigned_to)
        FROM public.sprint_tasks st
        WHERE st.id = task_progress_logs.task_id
    ));

CREATE POLICY "Users can create progress logs for tasks they have access to"
    ON public.task_progress_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id AND auth.uid() IN (
        SELECT DISTINCT COALESCE(st.user_id, st.assigned_to)
        FROM public.sprint_tasks st
        WHERE st.id = task_progress_logs.task_id
    ));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sprint_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sprint_tasks_updated_at_trigger
    BEFORE UPDATE ON public.sprint_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_sprint_tasks_updated_at();

-- Update existing tables to add missing comments
COMMENT ON TABLE public.sprints IS 'Sprint containers for organizing tasks within specific time-bounded iterations';
COMMENT ON COLUMN public.sprints.id IS 'Unique identifier for the sprint';
COMMENT ON COLUMN public.sprints.user_id IS 'User who created and owns this sprint';
COMMENT ON COLUMN public.sprints.loop_id IS 'Optional reference to a specific loop this sprint is addressing';
COMMENT ON COLUMN public.sprints.name IS 'Descriptive name for the sprint';
COMMENT ON COLUMN public.sprints.description IS 'Detailed description of sprint objectives and scope';
COMMENT ON COLUMN public.sprints.status IS 'Current status of the sprint (planning, active, completed, cancelled)';
COMMENT ON COLUMN public.sprints.start_date IS 'Planned or actual start date of the sprint';
COMMENT ON COLUMN public.sprints.end_date IS 'Planned or actual end date of the sprint';
COMMENT ON COLUMN public.sprints.goals IS 'Array of sprint goals and objectives in JSON format';
COMMENT ON COLUMN public.sprints.created_at IS 'Timestamp when the sprint was created';
COMMENT ON COLUMN public.sprints.updated_at IS 'Timestamp when the sprint was last updated';

COMMENT ON TABLE public.task_assignments IS 'Assignment relationships between tasks and users with specific roles';
COMMENT ON COLUMN public.task_assignments.id IS 'Unique identifier for the task assignment';
COMMENT ON COLUMN public.task_assignments.task_id IS 'Reference to the assigned task';
COMMENT ON COLUMN public.task_assignments.user_id IS 'User assigned to the task';
COMMENT ON COLUMN public.task_assignments.role IS 'Role of the user in this task (assignee, reviewer, observer, etc.)';
COMMENT ON COLUMN public.task_assignments.assigned_at IS 'Timestamp when the assignment was made';
COMMENT ON COLUMN public.task_assignments.assigned_by IS 'User who made this assignment';