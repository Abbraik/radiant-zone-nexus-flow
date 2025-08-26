import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import type { EnhancedTask5C } from '@/5c/types';
import { getReflexiveScenarioData } from '@/utils/scenarioDataHelpers';

export const useResponsiveData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  
  return useMemo(() => {
    if (!enrichedTask) {
      return {
        alerts: [],
        claims: [],
        guardrails: {
          concurrentSubsteps: 0,
          maxSubsteps: 3,
          timeRemaining: 480,
          allWithinLimits: true
        },
        isGoldenScenario: false
      };
    }

    // Check for golden scenario data
    const scenarioData = enrichedTask.payload;
    const reflexiveData = getReflexiveScenarioData(enrichedTask);
    
    if (scenarioData?.scenario_id) {
      // Transform golden scenario data into responsive format
      const alerts = [];
      
      // Add scenario-specific alerts based on the payload
      if (scenarioData.scenario_id === 'fertility' && scenarioData.childcare) {
        const waitTime = scenarioData.childcare.wait_time_days;
        if (waitTime > 20) {
          alerts.push({
            id: 'wait-time-breach',
            title: 'Childcare Wait Time Breach',
            description: `Wait time exceeded threshold: ${waitTime} days`,
            severity: waitTime > 30 ? 'high' : 'medium',
            createdAt: new Date().toISOString()
          });
        }
      }

      if (scenarioData.scenario_id === 'educator-pipeline' && scenarioData.pipeline) {
        const backlog = scenarioData.pipeline.certification_backlog;
        if (backlog > 50) {
          alerts.push({
            id: 'certification-backlog',
            title: 'Certification Backlog Alert',
            description: `${backlog} applications pending review`,
            severity: backlog > 100 ? 'high' : 'medium',
            createdAt: new Date().toISOString()
          });
        }
      }

      if (scenarioData.scenario_id === 'social-cohesion' && scenarioData.service_reliability) {
        const outageRate = scenarioData.service_reliability.outage_rate;
        if (outageRate > 0.02) {
          alerts.push({
            id: 'service-outage',
            title: 'Service Reliability Breach',
            description: `Outage rate: ${(outageRate * 100).toFixed(1)}%`,
            severity: outageRate > 0.05 ? 'high' : 'medium',
            createdAt: new Date().toISOString()
          });
        }
      }

      // Extract guardrail data from reflexive analysis
      const guardrails = {
        concurrentSubsteps: Math.floor((reflexiveData?.reading?.oscillation || 0.3) * 10),
        maxSubsteps: 3,
        timeRemaining: Math.floor((1 - (reflexiveData?.reading?.persistencePk || 0.15)) * 500),
        allWithinLimits: (reflexiveData?.reading?.rmseRel || 0.2) < 0.3
      };

      return {
        alerts,
        claims: [], // Claims would come from separate system
        guardrails,
        isGoldenScenario: true,
        scenarioId: scenarioData.scenario_id,
        triValues: enrichedTask.tri
      };
    }

    // Fallback to default data
    return {
      alerts: [{
        id: 'system-breach',
        title: 'System Breach Detected',
        description: 'Threshold exceeded by 15%',
        severity: 'high',
        createdAt: new Date().toISOString()
      }],
      claims: [],
      guardrails: {
        concurrentSubsteps: 0,
        maxSubsteps: 3,
        timeRemaining: 480,
        allWithinLimits: true
      },
      isGoldenScenario: false
    };
  }, [enrichedTask]);
};