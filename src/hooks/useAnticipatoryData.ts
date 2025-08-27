import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import { useDatabaseBreachEvents, useDatabaseDEBands } from '@/hooks/useDatabaseData';
import type { EnhancedTask5C } from '@/5c/types';
import { getAnticipatoryScenarioData } from '@/utils/scenarioDataHelpers';

export const useAnticipatoryData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  const { data: breachEvents } = useDatabaseBreachEvents(task?.loop_id);
  const { data: deBands } = useDatabaseDEBands(task?.loop_id);
  
  return useMemo(() => {
    if (!enrichedTask && !breachEvents) {
      return {
        scenarios: [],
        watchpoints: [],
        triggers: [],
        buffers: [],
        isGoldenScenario: false
      };
    }

    // PRIORITY 1: Use database data if available
    if (breachEvents && breachEvents.length > 0) {
      // Generate anticipatory data from database breach patterns
      const scenarios = [
        {
          id: 'breach-pattern-1',
          name: 'Recent Breach Pattern',
          description: `Pattern detected from ${breachEvents.length} recent breach events`,
          probability: 0.75,
          impact: 'medium' as const,
          timeframe: '7 days'
        }
      ];

      const watchpoints = breachEvents.slice(0, 3).map((breach, index) => ({
        id: `wp-${breach.id}`,
        name: `${breach.indicator_name} Monitor`,
        threshold: breach.threshold_value,
        current: breach.value,
        trend: breach.value > breach.threshold_value ? 'rising' as const : 'falling' as const,
        confidence: 0.85 - (index * 0.1)
      }));

      const triggers = deBands?.map(band => ({
        id: `trigger-${band.id}`,
        name: `DE Band Trigger - ${band.indicator}`,
        condition: `${band.indicator} outside [${band.lower_bound}, ${band.upper_bound}]`,
        enabled: true,
        lastFired: null as string | null
      })) || [];

      const buffers = [
        {
          id: 'capacity-buffer',
          name: 'System Capacity Buffer',
          current: 0.65,
          target: 0.80,
          unit: 'ratio'
        }
      ];

      return {
        scenarios,
        watchpoints,
        triggers,
        buffers,
        isGoldenScenario: false,
        isDatabaseDriven: true
      };
    }

    // PRIORITY 2: Fall back to enriched golden scenario data
    if (!enrichedTask) {
      return {
        scenarios: [],
        watchpoints: [],
        triggers: [],
        buffers: [],
        isGoldenScenario: false
      };
    }

    // Get scenario-specific anticipatory data
    const scenarioData = getAnticipatoryScenarioData(enrichedTask);
    
    if (scenarioData) {
      return {
        ...scenarioData,
        isGoldenScenario: true,
        scenarioId: enrichedTask.payload?.scenario_id,
        triValues: enrichedTask.tri
      };
    }

    // Fallback to default anticipatory data
    return {
      title: 'Anticipatory Analysis',
      scenarios: [
        { 
          id: 'sc1', 
          name: 'Base Case', 
          description: 'Current trajectory continues',
          probability: 0.6,
          impact: 'medium' as const,
          timeframe: '30 days'
        },
        { 
          id: 'sc2', 
          name: 'Stress Case', 
          description: 'External pressures increase',
          probability: 0.3,
          impact: 'high' as const,
          timeframe: '14 days'
        }
      ],
      watchpoints: [
        { 
          id: 'wp1', 
          name: 'Primary Indicator', 
          threshold: 0.75, 
          current: 0.65, 
          trend: 'stable' as const,
          confidence: 0.8 
        }
      ],
      triggers: [
        { 
          id: 'trig1', 
          name: 'Threshold Breach', 
          condition: 'value > 0.8', 
          enabled: true, 
          lastFired: null 
        }
      ],
      buffers: [
        { 
          id: 'buf1', 
          name: 'Response Buffer', 
          current: 0.7, 
          target: 0.85, 
          unit: 'capacity' 
        }
      ],
      isGoldenScenario: false
    };
  }, [enrichedTask, breachEvents, deBands]);
};