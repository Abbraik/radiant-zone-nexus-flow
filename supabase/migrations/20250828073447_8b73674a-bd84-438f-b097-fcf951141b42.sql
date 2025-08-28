-- Phase 1: Database Schema Setup for Profile Backend Integration

-- Create achievement definitions table
CREATE TABLE public.achievement_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  criteria JSONB NOT NULL DEFAULT '{}',
  points INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress NUMERIC DEFAULT 1.0,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Create achievement progress tracking
CREATE TABLE public.achievement_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  current_progress NUMERIC NOT NULL DEFAULT 0,
  target_progress NUMERIC NOT NULL DEFAULT 1,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_id)
);

-- Create user analytics table
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, metric_name, date)
);

-- Create performance metrics table
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'tasks_completed', 'avg_completion_time', 'tri_score', etc.
  value NUMERIC NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user activity log table (enhanced version of audit_log)
CREATE TABLE public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'task_completed', 'claim_created', 'login', etc.
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  related_entity_type TEXT, -- 'task', 'claim', 'loop', etc.
  related_entity_id UUID
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  workspace_layout JSONB DEFAULT '{}',
  dashboard_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create privacy settings table
CREATE TABLE public.privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  profile_visibility TEXT DEFAULT 'public', -- 'public', 'private', 'team'
  show_activity BOOLEAN DEFAULT true,
  show_achievements BOOLEAN DEFAULT true,
  show_performance BOOLEAN DEFAULT true,
  data_sharing_consent BOOLEAN DEFAULT false,
  analytics_tracking BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for achievement_definitions (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievement_definitions FOR SELECT USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for achievement_progress
CREATE POLICY "Users can manage their achievement progress" ON public.achievement_progress FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_analytics
CREATE POLICY "Users can manage their analytics" ON public.user_analytics FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for performance_metrics
CREATE POLICY "Users can manage their performance metrics" ON public.performance_metrics FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for user_activity_log
CREATE POLICY "Users can view their activity log" ON public.user_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their activity log" ON public.user_activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can manage their preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for privacy_settings
CREATE POLICY "Users can manage their privacy settings" ON public.privacy_settings FOR ALL USING (auth.uid() = user_id);

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_achievement_definitions_updated_at BEFORE UPDATE ON public.achievement_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_privacy_settings_updated_at BEFORE UPDATE ON public.privacy_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default achievements
INSERT INTO public.achievement_definitions (name, description, icon, criteria, points, category) VALUES
('First Steps', 'Complete your first task', '🎯', '{"tasks_completed": 1}', 10, 'tasks'),
('Task Master', 'Complete 10 tasks', '⚡', '{"tasks_completed": 10}', 50, 'tasks'),
('Speed Demon', 'Complete a task in under 1 hour', '🏃', '{"completion_time_minutes": {"$lt": 60}}', 25, 'performance'),
('Consistent Performer', 'Complete tasks for 7 days straight', '📈', '{"consecutive_days": 7}', 75, 'consistency'),
('TRI Master', 'Complete 10 TRI reviews', '📊', '{"tri_reviews": 10}', 40, 'quality'),
('Loop Expert', 'Work on 5 different loops', '🔄', '{"unique_loops": 5}', 60, 'collaboration');

-- Insert default user preferences for existing users
INSERT INTO public.user_preferences (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Insert default privacy settings for existing users
INSERT INTO public.privacy_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;