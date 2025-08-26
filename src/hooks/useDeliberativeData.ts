import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';
import { getDeliberativeScenarioData } from '@/utils/scenarioDataHelpers';

export const useDeliberativeData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  
  return useMemo(() => {
    if (!enrichedTask) {
      return {
        options: [],
        criteria: [],
        scenarios: [],
        evidence: [],
        isGoldenScenario: false
      };
    }

    // Get scenario-specific deliberative data
    const scenarioData = getDeliberativeScenarioData(enrichedTask);
    
    if (scenarioData) {
      return {
        ...scenarioData,
        evidence: [
          { 
            id: 'ev1', 
            label: `${scenarioData.title} Analysis`, 
            loopCodes: [enrichedTask.loop_id], 
            indicators: ['Primary Metric', 'Secondary Metric'] 
          },
          { 
            id: 'ev2', 
            label: 'Impact Assessment', 
            loopCodes: [enrichedTask.loop_id], 
            indicators: ['Cost-Benefit', 'Risk Assessment'] 
          }
        ],
        scenarios: [
          { id: 'sc1', name: 'Best Case', summary: 'Optimal implementation conditions' },
          { id: 'sc2', name: 'Worst Case', summary: 'Challenge implementation scenario' }
        ],
        isGoldenScenario: true,
        scenarioId: enrichedTask.payload?.scenario_id,
        triValues: enrichedTask.tri
      };
    }

    // Fallback to default deliberative data
    return {
      title: 'Decision Analysis',
      options: [
        { id: 'opt1', name: 'Option A', synopsis: 'First approach', costs: { capex: 100000 }, latencyDays: 90, authorityFlag: 'ok' as const },
        { id: 'opt2', name: 'Option B', synopsis: 'Alternative approach', costs: { opex: 50000 }, latencyDays: 60, authorityFlag: 'review' as const }
      ],
      criteria: [
        { id: 'crit1', label: 'Effectiveness', weight: 0.4, direction: 'maximize' as const },
        { id: 'crit2', label: 'Cost', weight: 0.3, direction: 'minimize' as const },
        { id: 'crit3', label: 'Speed', weight: 0.3, direction: 'maximize' as const }
      ],
      evidence: [
        { id: 'ev1', label: 'Analysis Report', loopCodes: [task?.loop_id || ''], indicators: ['Primary'] }
      ],
      scenarios: [
        { id: 'sc1', name: 'Base Case', summary: 'Standard conditions' }
      ],
      isGoldenScenario: false
    };
  }, [enrichedTask]);
};