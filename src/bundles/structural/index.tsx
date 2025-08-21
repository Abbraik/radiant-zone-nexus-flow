import React from 'react';
import type { CapacityBundleProps } from '@/types/capacity';
import StructuralBundle from './StructuralBundle';
import type { StructuralUiProps } from './types.ui';

export const StructuralBundleWrapper: React.FC<CapacityBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  // Mock data for the comprehensive structural interface
  const mockAuthorities = [
    { id: 'a1', label: 'Planning Act §12', type: 'statute' as const, status: 'exists' as const, note: 'General authority present' },
    { id: 'a2', label: 'Digital Cadaster Order', type: 'order' as const, status: 'draft' as const },
    { id: 'a3', label: 'Housing Budget Rule 2025', type: 'budget_rule' as const, status: 'exists' as const }
  ];

  const mockBudgets = [
    { 
      id: 'b1', 
      label: 'Housing Capex 25–26', 
      currency: 'USD', 
      amount: 500_000_000, 
      window: { from: '2025-01-01', to: '2026-12-31' }, 
      status: 'available' as const 
    },
    { 
      id: 'b2', 
      label: 'Infrastructure Opex', 
      currency: 'USD', 
      amount: 75_000_000, 
      window: { from: '2025-01-01', to: '2025-12-31' }, 
      status: 'constrained' as const,
      note: 'Requires treasury approval'
    }
  ];

  const mockDelegNodes = [
    { id: 'n1', label: 'Ministry of Housing', kind: 'ministry' as const, role: 'owner' as const },
    { id: 'n2', label: 'Planning Agency', kind: 'agency' as const, role: 'controller' as const },
    { id: 'n3', label: 'Water Utility', kind: 'agency' as const, role: 'operator' as const },
    { id: 'n4', label: 'City Council', kind: 'council' as const, role: 'auditor' as const }
  ];

  const mockDelegEdges = [
    { id: 'e1', from: 'n2', to: 'n1', right: 'approve' as const },
    { id: 'e2', from: 'n3', to: 'n2', right: 'data_access' as const },
    { id: 'e3', from: 'n1', to: 'n4', right: 'coordinate' as const }
  ];

  const mockMandateChecks = [
    { id: 'm1', label: 'Statutory Authority', status: 'ok' as const },
    { id: 'm2', label: 'Budget Envelope', status: 'risk' as const, note: 'Treasury sign-off pending' },
    { id: 'm3', label: 'Environmental Compliance', status: 'ok' as const, note: 'EIA completed' }
  ];

  const mockMesh = {
    nodes: mockDelegNodes,
    edges: mockDelegEdges,
    metrics: [
      { label: 'Betweenness', value: 0.62, unit: 'centrality' },
      { label: 'Conflicts Open', value: 7, unit: 'count' },
      { label: 'Coordination Efficiency', value: 0.73, unit: 'score' }
    ],
    issues: [
      { 
        id: 'i1', 
        label: 'Housing–Water bottleneck', 
        severity: 'high' as const, 
        loopRefs: ['MAC-L04', 'MES-L08'],
        note: 'Approval delays due to water capacity constraints'
      },
      { 
        id: 'i2', 
        label: 'Budget authority overlap', 
        severity: 'med' as const, 
        loopRefs: ['MAC-L04'],
        note: 'Ministry and agency both claim budget approval rights'
      }
    ]
  };

  const mockProcess = {
    steps: [
      { id: 's1', label: 'Approvals Screening', kind: 'gate' as const, latencyDaysTarget: 10 },
      { id: 's2', label: 'Environmental Review', kind: 'review' as const, latencyDaysTarget: 20 },
      { id: 's3', label: 'Community Consultation', kind: 'checkpoint' as const, latencyDaysTarget: 15 }
    ],
    raci: [
      { id: 'r1', stepId: 's1', actorId: 'n2', role: 'A' as const },
      { id: 'r2', stepId: 's2', actorId: 'n3', role: 'R' as const },
      { id: 'r3', stepId: 's3', actorId: 'n1', role: 'C' as const }
    ],
    slas: [
      { id: 'sl1', stepId: 's1', kpi: 'Time to decision', target: '≤ 10d' },
      { id: 'sl2', stepId: 's2', kpi: 'Review completeness', target: '≥ 95%' }
    ],
    latencyDist: [
      { label: '0–5d', value: 20 },
      { label: '6–10d', value: 40 },
      { label: '11–20d', value: 22 },
      { label: '>20d', value: 8 }
    ],
    varianceSeries: [
      { t: '2025-Q1', v: 0.22 },
      { t: '2025-Q2', v: 0.18 },
      { t: '2025-Q3', v: 0.25 },
      { t: '2025-Q4', v: 0.20 }
    ]
  };

  const mockForge = {
    standards: [
      { 
        id: 'st1', 
        name: 'Approvals Schema', 
        kind: 'schema' as const, 
        version: '1.0.0', 
        status: 'proposed' as const, 
        ownerNodeId: 'n2', 
        summary: 'Project, parcel, water, emissions fields' 
      },
      { 
        id: 'st2', 
        name: 'Water API Standard', 
        kind: 'api' as const, 
        version: '2.1.0', 
        status: 'adopted' as const, 
        ownerNodeId: 'n3', 
        summary: 'RESTful API for water capacity checks' 
      }
    ],
    conformance: [
      { id: 'cf1', standardId: 'st1', actorId: 'n1', status: 'warn' as const, lastRun: '2025-08-01' },
      { id: 'cf2', standardId: 'st2', actorId: 'n2', status: 'pass' as const, lastRun: '2025-08-15' }
    ]
  };

  const mockMarket = {
    permits: [
      { 
        id: 'p1', 
        name: 'Approvals Quota Permit', 
        capRule: 'Stage conversion ≥ 0.7', 
        priceRule: 'Congestion fee', 
        mrvStandardId: 'st1' 
      },
      { 
        id: 'p2', 
        name: 'Water Allocation Permit', 
        capRule: 'NRW ≤ 20%', 
        priceRule: 'Tiered pricing' 
      }
    ],
    pricing: [
      { id: 'pr1', label: 'CPI-X Indexation', formula: 'price_t = price_{t-1} × (1 + CPI - X)' },
      { id: 'pr2', label: 'Peak Load Pricing', formula: 'price = base × (1 + congestion_factor)' }
    ],
    auctions: [
      { 
        id: 'au1', 
        name: 'Approvals Slot Auction', 
        mechanism: 'uniform_price' as const, 
        lotSize: '50 slots/quarter', 
        reservePrice: 10_000 
      }
    ],
    fairnessChart: [
      { label: 'Low-income households', value: 0.65 },
      { label: 'Developers (SME)', value: 0.55 },
      { label: 'Large developers', value: 0.45 }
    ],
    elasticityChart: [
      { t: '2025-Q1', v: 1.0 },
      { t: '2025-Q2', v: 1.2 },
      { t: '2025-Q3', v: 1.1 },
      { t: '2025-Q4', v: 1.3 }
    ]
  };

  const structuralProps: StructuralUiProps = {
    loopCode: taskData?.loop_id || 'MAC-L04 · Housing–Land Elasticity',
    mission: taskData?.description || 'Increase approvals throughput while honoring NRW cap and ecological ceiling',
    screen: (payload?.screen as any) || 'mandate',
    authorities: mockAuthorities,
    budgets: mockBudgets,
    delegNodes: mockDelegNodes,
    delegEdges: mockDelegEdges,
    mandateChecks: mockMandateChecks,
    mesh: mockMesh,
    process: mockProcess,
    forge: mockForge,
    market: mockMarket,
    onMandateCheckChange: (id, status, note) => {
      console.log('Mandate check change:', { id, status, note });
      onPayloadUpdate?.({ ...payload, mandateChecks: { ...payload?.mandateChecks, [id]: { status, note } } });
    },
    onAddAuthority: () => console.log('Add authority'),
    onAddBudget: () => console.log('Add budget'),
    onDelegationEdit: (edge) => console.log('Edit delegation:', edge),
    onMeshEdit: (meshPayload) => console.log('Edit mesh:', meshPayload),
    onProcessEdit: (processPayload) => console.log('Edit process:', processPayload),
    onRaciEdit: (entry) => console.log('Edit RACI:', entry),
    onStandardEdit: (spec) => console.log('Edit standard:', spec),
    onConformanceToggle: (id, status) => console.log('Toggle conformance:', { id, status }),
    onMarketEdit: (marketPayload) => console.log('Edit market:', marketPayload),
    onExportDossier: () => console.log('Export dossier'),
    onEvent: (name, eventPayload) => console.log('Event:', name, eventPayload),
    busy: false
  };

  return <StructuralBundle {...structuralProps} />;
};

// Export both the wrapper and the original bundle
export { StructuralBundleWrapper as StructuralBundle };
export { default as StructuralBundleCore } from './StructuralBundle';