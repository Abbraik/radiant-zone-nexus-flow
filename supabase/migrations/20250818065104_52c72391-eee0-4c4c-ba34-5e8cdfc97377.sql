-- Remove the foreign key constraint and add public access policy
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

-- Allow public read access to tasks for demo purposes
DROP POLICY IF EXISTS "Allow public read access to tasks" ON tasks;
CREATE POLICY "Allow public read access to tasks" ON tasks FOR SELECT USING (true);

-- Insert a demo ACT zone task
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
    gen_random_uuid()
);