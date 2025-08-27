import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import { useDatabaseClaims, useDatabaseDEBands } from '@/hooks/useDatabaseData';
import type { EnhancedTask5C } from '@/5c/types';
import { getDeliberativeScenarioData } from '@/utils/scenarioDataHelpers';

export const useDeliberativeData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  const { data: claims } = useDatabaseClaims(task?.id);
  const { data: deBands } = useDatabaseDEBands(task?.loop_id);
  
  return useMemo(() => {
    if (!enrichedTask && !claims) {
      return {
        options: [],
        criteria: [],
        scenarios: [],
        evidence: [],
        isGoldenScenario: false
      };
    }

    // PRIORITY 1: Use database data if available
    if (claims && claims.length > 0) {
      // Generate deliberative options from active claims
      const options = claims.map((claim, index) => ({
        id: `opt-${claim.id}`,
        name: `Claim ${index + 1} - ${claim.leverage} Leverage`,
        synopsis: `Database claim with ${claim.leverage} leverage level`,
        costs: { capex: 50000 * (index + 1) },
        latencyDays: 30 + (index * 15),
        authorityFlag: claim.mandate_status === 'allowed' ? 'ok' as const : 'review' as const
      }));

      const criteria = [
        { id: 'crit1', label: 'Leverage Effectiveness', weight: 0.4, direction: 'maximize' as const },
        { id: 'crit2', label: 'Implementation Cost', weight: 0.3, direction: 'minimize' as const },
        { id: 'crit3', label: 'Mandate Compliance', weight: 0.3, direction: 'maximize' as const }
      ];

      return {
        title: 'Database-Driven Decision Analysis',
        options,
        criteria,
        evidence: [
          { 
            id: 'db-ev1', 
            label: 'Claims Analysis', 
            loopCodes: [task?.loop_id || ''], 
            indicators: ['Leverage Distribution', 'Status Tracking'] 
          }
        ],
        scenarios: [
          { id: 'db-sc1', name: 'Current Claims', summary: 'Based on active database claims' }
        ],
        isGoldenScenario: false,
        isDatabaseDriven: true
      };
    }

    // PRIORITY 2: Fall back to enriched golden scenario data
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
  }, [enrichedTask, claims, deBands]);
};