import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';
import { getReflexiveScenarioData } from '@/utils/scenarioDataHelpers';

export const useReflexiveData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  
  return useMemo(() => {
    if (!enrichedTask) {
      return {
        memory: [],
        scorecard: {},
        retuning: null,
        isGoldenScenario: false
      };
    }

    // Get scenario-specific reflexive data
    const scenarioData = getReflexiveScenarioData(enrichedTask);
    
    if (scenarioData) {
      const reading = scenarioData.reading;
      
      return {
        memory: [
          {
            id: 'mem1',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            action: 'Band Adjustment',
            description: `Adjusted ${reading.indicator} bounds based on oscillation pattern`,
            impact: reading.oscillation > 0.4 ? 'high' : 'medium'
          },
          {
            id: 'mem2',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            action: 'Slope Correction',
            description: `Applied slope correction: ${reading.slope > 0 ? 'positive' : 'negative'} trend`,
            impact: 'low'
          }
        ],
        scorecard: {
          fatigue: Math.max(0, Math.min(1, reading.persistencePk * 3.33)).toFixed(1),
          deState: reading.oscillation < 0.3 ? 'stable' : reading.oscillation < 0.6 ? 'oscillating' : 'chaotic',
          velocity: Math.abs(reading.slope * 100).toFixed(1),
          breachDays: Math.floor(reading.integralError * 10),
          rmse: (reading.rmseRel * 100).toFixed(1),
          dispersion: (reading.dispersion * 100).toFixed(1)
        },
        retuning: {
          suggested: reading.oscillation > 0.4 || reading.rmseRel > 0.25,
          recommendations: [
            {
              parameter: 'Upper Bound',
              current: reading.upper.toFixed(2),
              suggested: (reading.upper * (1 + reading.oscillation * 0.1)).toFixed(2),
              rationale: 'Reduce oscillation amplitude'
            },
            {
              parameter: 'Lower Bound', 
              current: reading.lower.toFixed(2),
              suggested: (reading.lower * (1 - reading.oscillation * 0.1)).toFixed(2),
              rationale: 'Symmetric adjustment'
            }
          ]
        },
        isGoldenScenario: true,
        scenarioId: enrichedTask.payload?.scenario_id,
        triValues: enrichedTask.tri
      };
    }

    // Fallback to default reflexive data
    return {
      memory: [
        {
          id: 'mem1',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          action: 'Initial Setup',
          description: 'Loop initialized with default parameters',
          impact: 'medium'
        }
      ],
      scorecard: {
        fatigue: '0.5',
        deState: 'stable',
        velocity: '2.1',
        breachDays: 0,
        rmse: '12.5',
        dispersion: '25.0'
      },
      retuning: {
        suggested: false,
        recommendations: []
      },
      isGoldenScenario: false
    };
  }, [enrichedTask]);
};