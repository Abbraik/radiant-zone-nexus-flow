-- Seed initial achievement definitions with proper UUIDs
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
        'tasks_completed', (SELECT COALESCE(COUNT(*), 0) FROM tasks_5c WHERE user_id = p_user_id AND status = 'completed'),
        'tasks_created', (SELECT COALESCE(COUNT(*), 0) FROM tasks_5c WHERE user_id = p_user_id),
        'loops_created', (SELECT COALESCE(COUNT(*), 0) FROM loops WHERE user_id = p_user_id),
        'password_changes', (SELECT COUNT(*) FROM user_activity_log WHERE user_id = p_user_id AND activity_type = 'security' AND title ILIKE '%password%'),
        'analytics_views', (SELECT COUNT(*) FROM user_activity_log WHERE user_id = p_user_id AND activity_type = 'view' AND title ILIKE '%analytics%')
    ) INTO current_metrics;

    -- Check each achievement and unlock if criteria met
    FOR achievement_def IN 
        SELECT * FROM achievement_definitions
        WHERE id NOT IN (SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id)
    LOOP
        -- Simple achievement checking logic
        IF achievement_def.name = 'Welcome Aboard' AND (current_metrics->>'login_count')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.name = 'Task Finisher' AND (current_metrics->>'tasks_completed')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.name = 'Task Starter' AND (current_metrics->>'tasks_created')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.name = 'Loop Creator' AND (current_metrics->>'loops_created')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.name = 'Security Conscious' AND (current_metrics->>'password_changes')::int >= 1 THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, metadata)
            VALUES (p_user_id, achievement_def.id, 1.0, current_metrics);
        ELSIF achievement_def.name = 'Data Explorer' AND (current_metrics->>'analytics_views')::int >= 1 THEN
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

CREATE TRIGGER achievement_check_trigger
    AFTER INSERT ON user_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION trigger_achievement_check();