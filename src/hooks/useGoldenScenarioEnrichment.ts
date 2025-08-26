// Golden Scenario Task Enrichment Hook
import { useMemo } from 'react';
import { GoldenScenarioGenerator } from '@/services/goldenScenarioGenerator';
import type { EnhancedTask5C } from '@/5c/types';
import type { GoldenScenarioPayload } from '@/types/golden-scenario-payloads';

export const useGoldenScenarioEnrichment = (task: EnhancedTask5C | null) => {
  const enrichedTask = useMemo(() => {
    if (!task) return null;

    // Check if this is a golden scenario task
    const isGoldenScenario = task.user_id === '00000000-0000-0000-0000-000000000000';
    if (!isGoldenScenario) return task;

    // Determine scenario type from task title or loop_id
    let scenarioId: string | null = null;
    const title = task.title?.toLowerCase() || '';
    const loopId = task.loop_id?.toLowerCase() || '';

    if (title.includes('fertility') || title.includes('childcare') || loopId.includes('fer-l01')) {
      scenarioId = 'fertility';
    } else if (title.includes('educator') || title.includes('pipeline') || loopId.includes('fer-l02')) {
      scenarioId = 'educator-pipeline';
    } else if (title.includes('labour') || title.includes('matching') || loopId.includes('lab-l01')) {
      scenarioId = 'labour-matching';
    } else if (title.includes('social') || title.includes('cohesion') || loopId.includes('soc-l01')) {
      scenarioId = 'social-cohesion';
    }

    if (!scenarioId) return task;

    // Generate rich payload for the scenario
    const scenarioPayload = GoldenScenarioGenerator.generatePayloadForScenario(scenarioId);
    if (!scenarioPayload) return task;

    // Enrich the task with scenario-specific data
    return {
      ...task,
      payload: {
        ...task.payload,
        ...scenarioPayload,
        // Add enrichment metadata
        enrichment: {
          source: 'golden_scenario_generator',
          generated_at: new Date().toISOString(),
          scenario_id: scenarioId,
          version: '1.0'
        }
      },
      // Update TRI values based on scenario indicators
      tri: {
        t_value: getTriValueFromScenario(scenarioPayload, 'transparency'),
        r_value: getTriValueFromScenario(scenarioPayload, 'responsiveness'), 
        i_value: getTriValueFromScenario(scenarioPayload, 'inclusiveness')
      }
    };
  }, [task]);

  return enrichedTask;
};

// Helper function to derive TRI values from scenario data
function getTriValueFromScenario(payload: GoldenScenarioPayload, dimension: 'transparency' | 'responsiveness' | 'inclusiveness'): number {
  const baseValue = 0.5;
  
  switch (payload.scenario_id) {
    case 'fertility':
      const fertPayload = payload as any;
      switch (dimension) {
        case 'transparency':
          // Higher wait times = lower transparency
          return Math.max(0.1, Math.min(0.9, 0.8 - (fertPayload.childcare.wait_time_days - 20) * 0.01));
        case 'responsiveness':
          // Higher capacity utilization = higher responsiveness
          return Math.max(0.2, Math.min(0.9, fertPayload.childcare.capacity_utilization));
        case 'inclusiveness':
          // More support programs = higher inclusiveness
          return Math.max(0.3, Math.min(0.8, 0.5 + fertPayload.fertility.support_programs.length * 0.1));
      }
      break;
      
    case 'educator-pipeline':
      const eduPayload = payload as any;
      switch (dimension) {
        case 'transparency':
          // Lower processing days = higher transparency
          return Math.max(0.2, Math.min(0.9, 0.9 - (eduPayload.pipeline.credential_processing_days - 30) * 0.01));
        case 'responsiveness':
          return Math.max(0.3, Math.min(0.8, eduPayload.workforce.training_programs[0]?.completion_rate || 0.6));
        case 'inclusiveness':
          return Math.max(0.4, Math.min(0.9, 1 - eduPayload.workforce.vacancy_rate));
      }
      break;
      
    case 'labour-matching':
      const labPayload = payload as any;
      switch (dimension) {
        case 'transparency':
          return Math.max(0.3, Math.min(0.8, 0.8 - labPayload.labour_market.skills_mismatch_index * 0.2));
        case 'responsiveness':
          return Math.max(0.2, Math.min(0.9, 0.9 - (labPayload.labour_market.vacancy_fill_time_days - 20) * 0.015));
        case 'inclusiveness':
          return Math.max(0.4, Math.min(0.9, 1 - labPayload.labour_market.unemployment_rate * 5));
      }
      break;
      
    case 'social-cohesion':
      const socPayload = payload as any;
      switch (dimension) {
        case 'transparency':
          return Math.max(0.2, Math.min(0.9, socPayload.community_trust.trust_index));
        case 'responsiveness':
          return Math.max(0.3, Math.min(0.9, 1 - socPayload.service_reliability.outage_rate * 20));
        case 'inclusiveness':
          return Math.max(0.4, Math.min(0.8, socPayload.community_trust.participation_rate * 2));
      }
      break;
  }
  
  return baseValue;
}