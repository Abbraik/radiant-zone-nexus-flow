-- Create sprint_tasks table for task management
CREATE TABLE IF NOT EXISTS public.sprint_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  capacity TEXT NOT NULL DEFAULT 'responsive',
  leverage TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'in_progress', 'completed', 'blocked')),
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  effort_hours INTEGER,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  meta JSONB DEFAULT '{}',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_progress_logs table for tracking progress updates
CREATE TABLE IF NOT EXISTS public.task_progress_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.sprint_tasks(id) ON DELETE CASCADE,
  progress_percent INTEGER NOT NULL CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status TEXT NOT NULL,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user information (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for sprint_tasks
ALTER TABLE public.sprint_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies for sprint_tasks
CREATE POLICY "Users can manage their own sprint tasks" 
ON public.sprint_tasks 
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Users can view sprint tasks in their sprints"
ON public.sprint_tasks
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sprints 
    WHERE sprints.id = sprint_tasks.sprint_id 
    AND sprints.user_id = auth.uid()
  )
);

-- Enable RLS for task_progress_logs
ALTER TABLE public.task_progress_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for task_progress_logs
CREATE POLICY "Users can manage their own task progress logs" 
ON public.task_progress_logs 
FOR ALL
USING (user_id = auth.uid());

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own profile"
ON public.profiles
FOR ALL
USING (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_sprint_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sprint_tasks_updated_at
  BEFORE UPDATE ON public.sprint_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sprint_tasks_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_sprint_id ON public.sprint_tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_assignee_id ON public.sprint_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_status ON public.sprint_tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_progress_logs_task_id ON public.task_progress_logs(task_id);