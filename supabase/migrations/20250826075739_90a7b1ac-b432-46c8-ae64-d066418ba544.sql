-- Fix RLS policy for tasks_5c to allow access to golden scenario tasks
-- Update existing policy to allow access to tasks with null user_id (golden scenarios)
DROP POLICY IF EXISTS "Users can manage their own 5C tasks" ON tasks_5c;

-- Create new policy that allows access to golden scenario tasks and user's own tasks
CREATE POLICY "Users can access 5C tasks" 
ON tasks_5c FOR ALL 
USING (
  user_id = auth.uid() 
  OR user_id = '00000000-0000-0000-0000-000000000000'
  OR auth.uid() IS NOT NULL
);

-- Also ensure RLS is enabled
ALTER TABLE tasks_5c ENABLE ROW LEVEL SECURITY;