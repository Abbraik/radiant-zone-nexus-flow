import { useMemo } from 'react';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import { useDatabaseClaims, useDatabaseBreachEvents } from '@/hooks/useDatabaseData';
import type { EnhancedTask5C } from '@/5c/types';
import { getReflexiveScenarioData } from '@/utils/scenarioDataHelpers';

export const useResponsiveData = (task: EnhancedTask5C | null) => {
  const enrichedTask = useGoldenScenarioEnrichment(task);
  const { data: claims } = useDatabaseClaims(task?.id);
  const { data: breachEvents } = useDatabaseBreachEvents(task?.loop_id);
  
  return useMemo(() => {
    if (!enrichedTask && !claims) {
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

    // PRIORITY 1: Use database data if available
    if (claims && claims.length > 0) {
      // Transform database claims to expected format
      const dbClaims = claims.map(claim => ({
        id: claim.id,
        task_id: claim.task_id,
        assignee: claim.assignee,
        leverage: claim.leverage,
        status: claim.status,
        evidence: claim.evidence,
        raci: claim.raci
      }));

      // Generate alerts from breach events if available
      const alerts = breachEvents?.slice(0, 5).map(breach => ({
        id: breach.id,
        title: `${breach.breach_type.charAt(0).toUpperCase() + breach.breach_type.slice(1)} Breach`,
        description: `${breach.indicator_name}: ${breach.value} (threshold: ${breach.threshold_value})`,
        severity: breach.severity_score > 2 ? 'high' as const : 'medium' as const,
        createdAt: breach.created_at
      })) || [];

      return {
        alerts,
        claims: dbClaims,
        guardrails: {
          concurrentSubsteps: claims.filter(c => c.status === 'active').length,
          maxSubsteps: 3,
          timeRemaining: 480,
          allWithinLimits: claims.every(c => c.mandate_status === 'allowed')
        },
        isGoldenScenario: false,
        isDatabaseDriven: true
      };
    }

    // PRIORITY 2: Fall back to enriched golden scenario data
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
  }, [enrichedTask, claims, breachEvents]);
};