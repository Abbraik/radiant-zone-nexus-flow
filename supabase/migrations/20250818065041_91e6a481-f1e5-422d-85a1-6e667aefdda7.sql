-- Create a temporary task that doesn't require authentication by updating RLS policy
-- First, temporarily allow public access to tasks for demo purposes
CREATE POLICY "Allow public read access to tasks" ON tasks FOR SELECT USING (true);

-- Insert a demo task with a dummy user_id that we'll use for demo purposes
INSERT INTO tasks (
    id,
    title,
    description,
    zone,
    task_type,
    status,
    priority,
    payload,
    user_id
) VALUES (
    gen_random_uuid(),
    'Sprint Planning Workshop',
    'Plan and configure your first sprint using the ACT zone workspace tools',
    'ACT',
    'sprint-planning',
    'todo',
    'high',
    '{"type": "sprint-planning", "requiresWizard": true}',
    gen_random_uuid()
);