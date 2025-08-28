import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useResetTasks = () => {
  const [isResetting, setIsResetting] = useState(false);

  const resetClaimedTasks = async () => {
    setIsResetting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to reset tasks');
      }

      console.log('🔄 Calling reset-claimed-tasks function...');
      
      const { data, error } = await supabase.functions.invoke('reset-claimed-tasks', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      console.log('✅ Reset response:', data);

      if (data.success) {
        toast({
          title: 'Tasks Reset Successfully',
          description: data.message,
        });
        return { success: true, resetCount: data.resetCount };
      } else {
        throw new Error(data.error || 'Failed to reset tasks');
      }
      
    } catch (error: any) {
      console.error('❌ Reset failed:', error);
      
      toast({
        title: 'Reset Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      return { success: false, error: error.message };
    } finally {
      setIsResetting(false);
    }
  };

  return {
    resetClaimedTasks,
    isResetting,
  };
};