-- Seed initial achievement definitions using proper UUIDs
INSERT INTO achievement_definitions (name, description, icon, category, criteria, points) VALUES
('Welcome Aboard', 'Complete your first login to the system', '👋', 'general', '{"login_count": 1}', 10),
('Profile Master', 'Complete all sections of your profile', '👤', 'general', '{"profile_sections": ["personal", "security", "preferences"]}', 25),
('Task Starter', 'Create your first task', '🚀', 'performance', '{"tasks_created": 1}', 15),
('Task Finisher', 'Complete your first task', '✅', 'performance', '{"tasks_completed": 1}', 20),
('Productive Week', 'Complete 10 tasks in one week', '⚡', 'performance', '{"tasks_per_week": 10}', 50),
('Daily User', 'Log in for 7 consecutive days', '📅', 'engagement', '{"consecutive_logins": 7}', 30),
('Loop Creator', 'Create your first loop', '🔄', 'general', '{"loops_created": 1}', 25),
('Data Explorer', 'View analytics for the first time', '📊', 'engagement', '{"analytics_views": 1}', 10),
('Security Conscious', 'Change your password', '🔐', 'general', '{"password_changes": 1}', 15),
('Social Butterfly', 'Interact with 5 different features', '🦋', 'engagement', '{"feature_interactions": 5}', 35);