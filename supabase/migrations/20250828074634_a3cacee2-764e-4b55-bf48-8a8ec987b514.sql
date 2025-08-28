-- First, let's check the current structure and modify if needed
ALTER TABLE achievement_definitions ALTER COLUMN id TYPE text;

-- Seed initial achievement definitions with proper text IDs
INSERT INTO achievement_definitions (id, name, description, icon, category, criteria, points) VALUES
('ach_first_login', 'Welcome Aboard', 'Complete your first login to the system', '👋', 'general', '{"login_count": 1}', 10),
('ach_profile_complete', 'Profile Master', 'Complete all sections of your profile', '👤', 'general', '{"profile_sections": ["personal", "security", "preferences"]}', 25),
('ach_task_starter', 'Task Starter', 'Create your first task', '🚀', 'performance', '{"tasks_created": 1}', 15),
('ach_task_finisher', 'Task Finisher', 'Complete your first task', '✅', 'performance', '{"tasks_completed": 1}', 20),
('ach_productive_week', 'Productive Week', 'Complete 10 tasks in one week', '⚡', 'performance', '{"tasks_per_week": 10}', 50),
('ach_daily_user', 'Daily User', 'Log in for 7 consecutive days', '📅', 'engagement', '{"consecutive_logins": 7}', 30),
('ach_loop_creator', 'Loop Creator', 'Create your first loop', '🔄', 'general', '{"loops_created": 1}', 25),
('ach_data_explorer', 'Data Explorer', 'View analytics for the first time', '📊', 'engagement', '{"analytics_views": 1}', 10),
('ach_security_conscious', 'Security Conscious', 'Change your password', '🔐', 'general', '{"password_changes": 1}', 15),
('ach_social_butterfly', 'Social Butterfly', 'Interact with 5 different features', '🦋', 'engagement', '{"feature_interactions": 5}', 35)
ON CONFLICT (id) DO NOTHING;