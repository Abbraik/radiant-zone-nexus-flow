// Deliberative Bundle - Analysis & Decision-Making Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import DeliberativeBundle from './DeliberativeBundle';
import type { DeliberativeUiProps } from './types.ui';

const DeliberativeBundleWrapper: React.FC<BundleProps5C> = ({ task }) => {
  // Mock data for demonstration - integrate with real data sources
  const deliberativeProps: DeliberativeUiProps = {
    loopCode: task.capacity || 'Deliberative',
    mission: 'Multi-criteria decision analysis and portfolio optimization',
    screen: 'intake',
    options: [
      { 
        id: 'opt1', 
        name: 'Direct Intervention', 
        synopsis: 'N-lever, Low risk',
        costs: { capex: 250000, opex: 50000 },
        latencyDays: 30,
        authorityFlag: 'ok'
      },
      { 
        id: 'opt2', 
        name: 'Policy Adjustment', 
        synopsis: 'P-lever, Medium risk',
        costs: { capex: 100000, opex: 25000 },
        latencyDays: 60,
        authorityFlag: 'review'
      }
    ],
    evidence: [
      { 
        id: 'ev1', 
        label: 'Loop indicators and metrics',
        loopCodes: [task.capacity || 'deliberative'],
        indicators: ['effectiveness', 'cost', 'feasibility']
      }
    ],
    scenarios: [
      { id: 'sc1', name: 'Base case', summary: 'Normal conditions' },
      { id: 'sc2', name: 'Stress test', summary: 'High volatility' }
    ],
    criteria: [
      { id: 'c1', label: 'Effectiveness', weight: 0.35, direction: 'maximize' },
      { id: 'c2', label: 'Cost', weight: 0.25, direction: 'minimize' },
      { id: 'c3', label: 'Feasibility', weight: 0.20, direction: 'maximize' },
      { id: 'c4', label: 'Time to impact', weight: 0.20, direction: 'minimize' }
    ],
    scores: [
      { optionId: 'opt1', criterionId: 'c1', score: 0.8 },
      { optionId: 'opt1', criterionId: 'c2', score: 0.6 },
      { optionId: 'opt1', criterionId: 'c3', score: 0.9 },
      { optionId: 'opt1', criterionId: 'c4', score: 0.7 },
      { optionId: 'opt2', criterionId: 'c1', score: 0.6 },
      { optionId: 'opt2', criterionId: 'c2', score: 0.8 },
      { optionId: 'opt2', criterionId: 'c3', score: 0.7 },
      { optionId: 'opt2', criterionId: 'c4', score: 0.5 }
    ],
    frontier: [
      { optionIds: ['opt1'], risk: 0.3, cost: 0.4, equity: 0.7, label: 'P1', feasible: true },
      { optionIds: ['opt2'], risk: 0.5, cost: 0.2, equity: 0.6, label: 'P2', feasible: true }
    ],
    hardConstraints: [
      { id: 'cons1', label: 'Budget ≤ $500k', active: true }
    ],
    selectedPortfolio: null,
    mandateChecks: [
      { id: 'm1', label: 'Statutory authority', status: 'ok' },
      { id: 'm2', label: 'Budget envelope', status: 'risk', note: 'Requires approval' }
    ],
    guardrails: [
      { id: 'g1', label: 'Max deployment time', kind: 'timebox', value: '90 days', required: true, selected: true }
    ],
    participation: [
      { id: 'p1', label: 'Stakeholder consultation', status: 'planned', audience: 'Key stakeholders' }
    ],
    consentIndex: 0.75,
    handoff: {
      enableResponsive: true,
      enableStructural: true,
      enableReflexive: true,
      onHandoff: (to) => console.log(`Handoff to ${to}`)
    }
  };

  return <DeliberativeBundle {...deliberativeProps} />;
};

export default DeliberativeBundleWrapper;