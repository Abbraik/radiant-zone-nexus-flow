import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
  points: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: number;
  metadata: Record<string, any>;
  achievement_definitions: AchievementDefinition;
}

export interface AchievementProgress {
  id: string;
  user_id: string;
  achievement_id: string;
  current_progress: number;
  target_progress: number;
  last_updated: string;
  metadata: Record<string, any>;
  achievement_definitions: AchievementDefinition;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all available achievements
  const achievements = useQuery({
    queryKey: ['achievement-definitions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievement_definitions')
        .select('*')
        .order('category', { ascending: true })
        .order('points', { ascending: true });

      if (error) throw error;
      return data as AchievementDefinition[];
    },
  });

  // Get user's unlocked achievements
  const userAchievements = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement_definitions (*)
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user?.id,
  });

  // Get user's achievement progress
  const achievementProgress = useQuery({
    queryKey: ['achievement-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('achievement_progress')
        .select(`
          *,
          achievement_definitions (*)
        `)
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false });

      if (error) throw error;
      return data as AchievementProgress[];
    },
    enabled: !!user?.id,
  });

  // Unlock an achievement
  const unlockAchievement = useMutation({
    mutationFn: async ({ achievementId, progress = 1.0, metadata = {} }: {
      achievementId: string;
      progress?: number;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
          progress,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
      const achievement = achievements.data?.find(a => a.id === variables.achievementId);
      
      if (achievement) {
        toast({
          title: 'Achievement Unlocked! 🎉',
          description: `${achievement.icon} ${achievement.name}`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Failed to unlock achievement:', error);
    },
  });

  // Update achievement progress
  const updateProgress = useMutation({
    mutationFn: async ({ achievementId, currentProgress, targetProgress = 1, metadata = {} }: {
      achievementId: string;
      currentProgress: number;
      targetProgress?: number;
      metadata?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('achievement_progress')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          current_progress: currentProgress,
          target_progress: targetProgress,
          metadata,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['achievement-progress', user?.id] });
      
      // Check if achievement should be unlocked
      if (variables.currentProgress >= variables.targetProgress!) {
        unlockAchievement.mutate({ achievementId: variables.achievementId });
      }
    },
    onError: (error: any) => {
      console.error('Failed to update achievement progress:', error);
    },
  });

  return {
    achievements: achievements.data || [],
    userAchievements: userAchievements.data || [],
    achievementProgress: achievementProgress.data || [],
    isLoading: achievements.isLoading || userAchievements.isLoading || achievementProgress.isLoading,
    error: achievements.error || userAchievements.error || achievementProgress.error,
    unlockAchievement,
    updateProgress,
  };
};

// Helper function to check if user has unlocked an achievement
export const useHasAchievement = (achievementId: string) => {
  const { userAchievements } = useAchievements();
  return userAchievements.some(ua => ua.achievement_id === achievementId);
};

// Helper function to get achievement progress
export const useAchievementProgress = (achievementId: string) => {
  const { achievementProgress } = useAchievements();
  return achievementProgress.find(ap => ap.achievement_id === achievementId);
};