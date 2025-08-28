-- Fix the foreign key relationship by updating both tables
ALTER TABLE user_achievements DROP CONSTRAINT user_achievements_achievement_id_fkey;
ALTER TABLE achievement_progress DROP CONSTRAINT achievement_progress_achievement_id_fkey;

-- Change achievement_id column types to text
ALTER TABLE user_achievements ALTER COLUMN achievement_id TYPE text;
ALTER TABLE achievement_progress ALTER COLUMN achievement_id TYPE text;

-- Re-add the foreign key constraints
ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_achievement_id_fkey 
    FOREIGN KEY (achievement_id) REFERENCES achievement_definitions(id);
ALTER TABLE achievement_progress ADD CONSTRAINT achievement_progress_achievement_id_fkey 
    FOREIGN KEY (achievement_id) REFERENCES achievement_definitions(id);

-- Now insert the achievement definitions
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

-- Create function to check and unlock achievements automatically
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    achievement_def record;
    current_metrics jsonb;
BEGIN
    -- Get user metrics for achievement checking
    SELECT jsonb_build_object(
        'login_count', (SELECT COUNT(*) FROM user_activity_log WHERE user_id = p_user_id AND activity_type = 'login'),
        'tasks_completed', (SELECT COUNT(*) FROM tasks_5c WHERE user_id = p_user_id AND status = 'completed'),
        'tasks_created', (SELECT COUNT(*) FROM tasks_5c WHERE user_id = p_user_id),
        'loops_created', (SELECT COUNT(*) FROM loops WHERE user_id = p_user_id),
        'password_changes', (SELECT COUNT(*) FROM user_activity_log WHERE user_id = p_user_id AND activity_type = 'security' AND title ILIKE '%password%'),
        'analytics_views', (SELECT COUNT(*) FROM user_activity_log WHERE user_id = p_user_id AND activity_type = 'view' AND title ILIKE '%analytics%')
    ) INTO current_metrics;

    -- Check each achievement
    FOR achievement_def IN 
        SELECT * FROM achievement_definitions
        WHERE id NOT IN (SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id)
    LOOP
        -- Simple achievement checking logic (can be enhanced)
        IF achievement_def.id = 'ach_first_login' AND (current_metrics->>'login_count')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.id = 'ach_task_finisher' AND (current_metrics->>'tasks_completed')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.id = 'ach_task_starter' AND (current_metrics->>'tasks_created')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.id = 'ach_loop_creator' AND (current_metrics->>'loops_created')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        END IF;
    END LOOP;
END;
$$;

-- Create trigger to automatically check achievements when activity is logged
CREATE OR REPLACE FUNCTION trigger_achievement_check()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM check_and_unlock_achievements(NEW.user_id);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS achievement_check_trigger ON user_activity_log;
CREATE TRIGGER achievement_check_trigger
    AFTER INSERT ON user_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION trigger_achievement_check();