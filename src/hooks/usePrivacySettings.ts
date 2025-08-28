import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface PrivacySettings {
  id: string;
  user_id: string;
  profile_visibility: 'public' | 'private' | 'team';
  show_activity: boolean;
  show_achievements: boolean;
  show_performance: boolean;
  data_sharing_consent: boolean;
  analytics_tracking: boolean;
  created_at: string;
  updated_at: string;
}

export const usePrivacySettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const privacySettings = useQuery({
    queryKey: ['privacy-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as PrivacySettings | null;
    },
    enabled: !!user?.id,
  });

  const updatePrivacySettings = useMutation({
    mutationFn: async (updates: Partial<Omit<PrivacySettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-settings', user?.id] });
      toast({
        title: 'Success',
        description: 'Privacy settings updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update privacy settings',
        variant: 'destructive',
      });
    },
  });

  return {
    privacySettings: privacySettings.data,
    isLoading: privacySettings.isLoading,
    error: privacySettings.error,
    updatePrivacySettings,
  };
};