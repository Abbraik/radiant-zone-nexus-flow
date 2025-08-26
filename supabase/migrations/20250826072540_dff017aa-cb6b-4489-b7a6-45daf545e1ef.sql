-- Fix golden scenario tasks ownership issue
-- Update golden scenario tasks to belong to authenticated users or make them public

-- First, let's check if there's a way to make these tasks visible to all users
-- Since these are demo/golden scenario tasks, they should be available to everyone

-- Option 1: Update the existing golden scenario tasks to have the current user's ID
-- But this won't work if user is not authenticated

-- Option 2: Modify RLS policy to allow reading of demo tasks
-- Add a policy that allows reading tasks with the demo user_id

CREATE POLICY "Allow reading demo golden scenario tasks" ON tasks
FOR SELECT
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Option 3: Also add a policy to allow these demo tasks to have a more generic ownership
-- This will make the golden scenario tasks visible to all authenticated users
CREATE POLICY "Allow claiming demo tasks" ON tasks
FOR UPDATE
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
WITH CHECK (auth.uid() IS NOT NULL);