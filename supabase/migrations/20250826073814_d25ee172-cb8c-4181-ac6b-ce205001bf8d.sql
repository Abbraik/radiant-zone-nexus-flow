-- Allow unauthenticated users to read demo golden scenario tasks
-- This will make the golden scenario tasks visible even without authentication

CREATE POLICY "Allow unauthenticated access to demo tasks" ON tasks
FOR SELECT
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid);

-- Also allow unauthenticated users to claim demo tasks (change ownership)
CREATE POLICY "Allow unauthenticated claiming of demo tasks" ON tasks
FOR UPDATE  
USING (user_id = '00000000-0000-0000-0000-000000000000'::uuid);