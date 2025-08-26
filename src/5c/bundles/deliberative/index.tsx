// Deliberative Bundle - Analysis & Decision-Making Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import DeliberativeBundle from './DeliberativeBundle';
import type { DeliberativeUiProps } from './types.ui';
import { getDeliberativeScenarioData, getScenarioSpecificData } from '@/utils/scenarioDataHelpers';

const DeliberativeBundleWrapper: React.FC<BundleProps5C & { taskData?: any }> = ({ task, taskData }) => {
  // Check if this is a golden scenario with enriched data
  const scenarioSpecificData = getDeliberativeScenarioData(taskData);
  const isGoldenScenario = !!scenarioSpecificData;

  console.log('DeliberativeBundleWrapper received:', { task, taskData, scenarioSpecificData, isGoldenScenario });
  // Use scenario-specific data or fallback to mock data
  const mockOptions = scenarioSpecificData?.options || [
    { id: 'opt1', name: 'Elasticity Reform', synopsis: 'Zoning flexibility and density bonuses', costs: { capex: 500000, opex: 125000 }, latencyDays: 180, authorityFlag: 'ok' as const },
    { id: 'opt2', name: 'Social Housing', synopsis: 'Public housing development program', costs: { capex: 2500000, opex: 400000 }, latencyDays: 365, authorityFlag: 'review' as const },
    { id: 'opt3', name: 'Rent Stabilization', synopsis: 'Tenant protection and rent control measures', costs: { opex: 50000 }, latencyDays: 90, authorityFlag: 'ok' as const }
  ];

  const mockEvidence = [
    { id: 'ev1', label: 'Housing Market Analysis Q3 2024', loopCodes: [task.loop_id], indicators: ['Price/Income Ratio', 'Vacancy Rate'] },
    { id: 'ev2', label: 'Community Impact Assessment', loopCodes: [task.loop_id], indicators: ['Displacement Risk'] }
  ];

  const mockScenarios = [
    { id: 'sc1', name: 'Economic Downturn', summary: 'Reduced housing demand scenario' },
    { id: 'sc2', name: 'Population Surge', summary: 'Rapid population growth scenario' }
  ];

  const mockCriteria = scenarioSpecificData?.criteria || [
    { id: 'crit1', label: 'Effectiveness', weight: 0.30, direction: 'maximize' as const },
    { id: 'crit2', label: 'Cost Efficiency', weight: 0.25, direction: 'maximize' as const },
    { id: 'crit3', label: 'Time to Impact', weight: 0.20, direction: 'minimize' as const },
    { id: 'crit4', label: 'Equity', weight: 0.15, direction: 'maximize' as const },
    { id: 'crit5', label: 'Political Feasibility', weight: 0.10, direction: 'maximize' as const }
  ];

  const mockScores = [
    { optionId: 'opt1', criterionId: 'crit1', score: 0.7 },
    { optionId: 'opt1', criterionId: 'crit2', score: 0.8 },
    { optionId: 'opt1', criterionId: 'crit3', score: 0.6 },
    { optionId: 'opt1', criterionId: 'crit4', score: 0.5 },
    { optionId: 'opt1', criterionId: 'crit5', score: 0.9 },
    { optionId: 'opt2', criterionId: 'crit1', score: 0.9 },
    { optionId: 'opt2', criterionId: 'crit2', score: 0.4 },
    { optionId: 'opt2', criterionId: 'crit3', score: 0.3 },
    { optionId: 'opt2', criterionId: 'crit4', score: 0.9 },
    { optionId: 'opt2', criterionId: 'crit5', score: 0.6 },
    { optionId: 'opt3', criterionId: 'crit1', score: 0.6 },
    { optionId: 'opt3', criterionId: 'crit2', score: 0.9 },
    { optionId: 'opt3', criterionId: 'crit3', score: 0.9 },
    { optionId: 'opt3', criterionId: 'crit4', score: 0.7 },
    { optionId: 'opt3', criterionId: 'crit5', score: 0.5 }
  ];

  const mockFrontier = [
    { optionIds: ['opt1'], label: 'Reform Package', risk: 0.3, cost: 0.4, equity: 0.6, regretWorst: 0.2, feasible: true },
    { optionIds: ['opt2'], label: 'Housing Program', risk: 0.6, cost: 0.8, equity: 0.9, regretWorst: 0.4, feasible: true },
    { optionIds: ['opt3'], label: 'Rent Controls', risk: 0.2, cost: 0.1, equity: 0.7, regretWorst: 0.3, feasible: true },
    { optionIds: ['opt1', 'opt3'], label: 'Combined Approach', risk: 0.4, cost: 0.5, equity: 0.8, regretWorst: 0.1, feasible: true }
  ];

  const mockMandateChecks = [
    { id: 'm1', label: 'Statutory Authority', status: 'ok' as const, note: 'Housing Act 2019 provides authority' },
    { id: 'm2', label: 'Budget Envelope', status: 'risk' as const, note: 'Requires supplemental appropriation' },
    { id: 'm3', label: 'Environmental Compliance', status: 'ok' as const }
  ];

  const mockGuardrails = [
    { id: 'g1', label: 'Max displacement rate', kind: 'cap' as const, value: '≤ 5%', required: true, selected: true },
    { id: 'g2', label: 'Implementation timeline', kind: 'timebox' as const, value: '≤ 18 months', required: false, selected: true },
    { id: 'g3', label: 'Mid-point review', kind: 'checkpoint' as const, value: '6-month assessment', required: true, selected: true }
  ];

  const mockParticipation = [
    { id: 'p1', label: 'Community Forums', audience: 'Affected neighborhoods', status: 'planned' as const, date: '2024-02-15' },
    { id: 'p2', label: 'Stakeholder Workshop', audience: 'Housing providers', status: 'done' as const, date: '2024-01-20' },
    { id: 'p3', label: 'City Council Hearing', audience: 'Public', status: 'planned' as const, date: '2024-03-01' }
  ];

  const mockScenarioOutcomes = [
    // Economic Downturn scenario outcomes
    { scenarioId: 'sc1', scenarioName: 'Economic Downturn', optionId: 'opt1', outcomeScore: 0.75, riskDelta: -0.1 },
    { scenarioId: 'sc1', scenarioName: 'Economic Downturn', optionId: 'opt2', outcomeScore: 0.45, riskDelta: 0.2 },
    { scenarioId: 'sc1', scenarioName: 'Economic Downturn', optionId: 'opt3', outcomeScore: 0.85, riskDelta: -0.05 },
    
    // Population Surge scenario outcomes
    { scenarioId: 'sc2', scenarioName: 'Population Surge', optionId: 'opt1', outcomeScore: 0.65, riskDelta: 0.1 },
    { scenarioId: 'sc2', scenarioName: 'Population Surge', optionId: 'opt2', outcomeScore: 0.90, riskDelta: -0.15 },
    { scenarioId: 'sc2', scenarioName: 'Population Surge', optionId: 'opt3', outcomeScore: 0.40, riskDelta: 0.25 }
  ];

  const deliberativeProps: DeliberativeUiProps = {
    loopCode: task.loop_id,
    mission: task.description,
    screen: 'intake',
    options: mockOptions,
    evidence: mockEvidence,
    scenarios: mockScenarios,
    criteria: mockCriteria,
    scores: mockScores,
    scenarioOutcomes: mockScenarioOutcomes,
    frontier: mockFrontier,
    hardConstraints: [
      { id: 'hc1', label: 'Budget ≤ $3M total', active: true },
      { id: 'hc2', label: 'No new zoning required', active: false }
    ],
    selectedPortfolio: null,
    mandateChecks: mockMandateChecks,
    guardrails: mockGuardrails,
    participation: mockParticipation,
    consentIndex: 0.72,
    handoff: {
      enableResponsive: true,
      enableStructural: true,
      enableReflexive: true,
      onHandoff: (to) => console.log(`Handoff to ${to}`)
    },
    onAddOption: () => console.log('Adding new option'),
    onEditWeights: (criteria) => console.log('Editing weights:', criteria),
    onPickPortfolio: (point) => console.log('Selected portfolio:', point),
    onToggleConstraint: (id) => console.log('Toggle constraint:', id),
    onToggleGuardrail: (id, selected) => console.log('Toggle guardrail:', id, selected),
    onSetParticipationStatus: (id, status) => console.log('Set participation status:', id, status),
    onExportDossier: () => console.log('Exporting dossier'),
    onEvent: (name, payload) => console.log('Event:', name, payload)
  };

  return <DeliberativeBundle {...deliberativeProps} />;
};

export default DeliberativeBundleWrapper;