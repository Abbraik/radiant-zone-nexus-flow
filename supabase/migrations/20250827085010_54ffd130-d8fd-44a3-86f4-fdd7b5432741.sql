-- Fix task_assignments table schema
ALTER TABLE public.task_assignments 
RENAME COLUMN added_at TO assigned_at;

ALTER TABLE public.task_assignments 
ADD COLUMN IF NOT EXISTS assigned_by UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

-- Fix task_events_v2 table schema  
ALTER TABLE public.task_events_v2 
RENAME COLUMN event_id TO id;