import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Data sources hook - creates a simple monitoring system
export const useDataSources = () => {
  const sources = useQuery({
    queryKey: ['admin', 'data-sources'],
    queryFn: async () => {
      // For now, we'll create a mock data source monitoring system
      // In the future, this could connect to real data source health monitoring
      const mockSources = [
        {
          id: '1',
          name: '5C Tasks Database',
          type: 'database',
          status: 'online',
          last_sync: new Date().toISOString(),
          quality_score: 98,
        },
        {
          id: '2', 
          name: '5C Claims Engine',
          type: 'service',
          status: 'online',
          last_sync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          quality_score: 95,
        },
        {
          id: '3',
          name: 'Watchpoints Monitor',
          type: 'monitoring',
          status: 'warning',
          last_sync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          quality_score: 87,
        },
        {
          id: '4',
          name: 'DE Bands Processor',
          type: 'processor',
          status: 'online',
          last_sync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          quality_score: 92,
        },
        {
          id: '5',
          name: 'Audit Logger',
          type: 'logger',
          status: 'online',
          last_sync: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
          quality_score: 99,
        }
      ];

      // Verify actual data availability by checking key tables
      const [tasksCheck, claimsCheck, watchpointsCheck] = await Promise.all([
        supabase.from('tasks_5c').select('id').limit(1),
        supabase.from('claims_5c').select('id').limit(1),
        supabase.from('antic_watchpoints').select('id').limit(1),
      ]);

      // Update mock data based on real data availability
      if (tasksCheck.error) {
        mockSources[0].status = 'offline';
        mockSources[0].quality_score = 0;
      }

      if (claimsCheck.error) {
        mockSources[1].status = 'offline';
        mockSources[1].quality_score = 0;
      }

      if (watchpointsCheck.error) {
        mockSources[2].status = 'offline';
        mockSources[2].quality_score = 0;
      }

      return mockSources;
    },
  });

  // Calculate health stats from sources data
  const sourcesData = sources.data || [];
  const healthStats = {
    active: sourcesData.filter(s => s.status === 'online').length,
    warning: sourcesData.filter(s => s.status === 'warning').length,
    offline: sourcesData.filter(s => s.status === 'offline').length,
    total: sourcesData.length,
  };

  return {
    sources: sourcesData,
    healthStats,
    isLoading: sources.isLoading,
    refetch: sources.refetch,
  };
};