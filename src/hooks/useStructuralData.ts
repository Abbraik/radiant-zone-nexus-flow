import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';
import { getStructuralScenarioData } from '@/utils/scenarioDataHelpers';

export const useStructuralData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  
  return useMemo(() => {
    if (!enrichedTask) {
      return {
        architecture: null,
        mandateChecks: [],
        leveragePoints: [],
        isGoldenScenario: false
      };
    }

    // Get scenario-specific structural data
    const scenarioData = getStructuralScenarioData(enrichedTask);
    
    if (scenarioData) {
      return {
        ...scenarioData,
        architecture: {
          domains: ['Economic', 'Social', 'Technical', 'Political'],
          relationships: ['bi-directional', 'causal', 'feedback'],
          complexity: enrichedTask.payload?.context?.complexity || 'medium'
        },
        leveragePoints: [
          { id: 'lp1', name: 'Parameters (N)', impact: 'low' },
          { id: 'lp2', name: 'Structure (S)', impact: 'high' },
          { id: 'lp3', name: 'Paradigms (P)', impact: 'medium' }
        ],
        isGoldenScenario: true,
        scenarioId: enrichedTask.payload?.scenario_id,
        triValues: enrichedTask.tri
      };
    }

    // Fallback to default structural data  
    return {
      mission: enrichedTask.description || 'System Architecture',
      architecture: {
        domains: ['Economic', 'Social', 'Technical', 'Political'],
        relationships: ['feedback', 'causal'],
        complexity: 'medium'
      },
      mandateChecks: [
        { id: 'm1', label: 'Legal Authority', status: 'ok', note: 'Within statutory bounds' },
        { id: 'm2', label: 'Budget Authority', status: 'review', note: 'Requires approval' }
      ],
      leveragePoints: [
        { id: 'lp1', name: 'Parameters (N)', impact: 'low' },
        { id: 'lp2', name: 'Structure (S)', impact: 'high' },
        { id: 'lp3', name: 'Paradigms (P)', impact: 'medium' }
      ],
      isGoldenScenario: false
    };
  }, [enrichedTask]);
};