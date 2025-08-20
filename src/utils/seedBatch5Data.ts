// Seed Batch 5 Loop Data for Development
import { LoopData } from '@/types/loop-registry';

export const batch5Loops: LoopData[] = [
  {
    id: 'atlas-META-L01',
    name: 'Score Weighting & Band Management',
    loop_type: 'structural',
    scale: 'macro',
    status: 'draft',
    leverage_default: 'N',
    notes: 'Supervisory band & weight tuner seeded.',
    metadata: {
      loop_code: 'META-L01',
      batch: 5,
      node_count: 8,
      edge_count: 12,
      indicator_count: 3,
      has_snl: true,
      has_de_band: true,
      has_srt: true,
      atlas_data: {
        nodes: [],
        edges: [],
        indicators: [
          { name: 'Band-Hit Frequency', unit: '% periods', de_band: { lower: 0, upper: 15, asymmetry: 0.0, alpha: 0.4 } },
          { name: 'Dispersion Index (T2/T3)', unit: 'index', de_band: { lower: 0.1, upper: 0.35, asymmetry: 0.0, alpha: 0.4 } },
          { name: 'Composite Error (Tier-1)', unit: 'σ', de_band: { lower: 0.5, upper: 1.2, asymmetry: 0.0, alpha: 0.4 } }
        ],
        shared_nodes: ['Society.Trust', 'Institutions.DecisionLatency'],
        de_bands: [],
        srt: { reflex_horizon: 'P30D', cadence: 'monthly' }
      }
    },
    controller: {},
    thresholds: {},
    tags: ['meta-control', 'supervisory', 'band-management'],
    node_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null,
    source_tag: 'NCF-PAGS-ATLAS',
    loop_code: 'META-L01',
    version: 1
  },
  {
    id: 'atlas-META-L02',
    name: 'Controller Arbitration & Retuning',
    loop_type: 'structural',
    scale: 'macro',
    status: 'draft',
    leverage_default: 'P',
    notes: 'PID/MPC/Rule family switching enabled.',
    metadata: {
      loop_code: 'META-L02',
      batch: 5,
      node_count: 6,
      edge_count: 10,
      indicator_count: 3,
      has_snl: true,
      has_de_band: true,
      has_srt: true,
      atlas_data: {
        nodes: [],
        edges: [],
        indicators: [
          { name: 'Variance of Error', unit: 'σ²', de_band: { lower: 0.2, upper: 0.8, asymmetry: 0.0, alpha: 0.3 } },
          { name: 'Oscillation Score', unit: 'index', de_band: { lower: 0, upper: 0.3, asymmetry: 0.0, alpha: 0.3 } },
          { name: 'Actuation Overrun', unit: '% periods', de_band: { lower: 0, upper: 10, asymmetry: 0.0, alpha: 0.3 } }
        ],
        shared_nodes: ['Institutions.CapacityIndex'],
        de_bands: [],
        srt: { reflex_horizon: 'P30D', cadence: 'monthly' }
      }
    },
    controller: {},
    thresholds: {},
    tags: ['meta-control', 'controller', 'arbitration'],
    node_count: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null,
    source_tag: 'NCF-PAGS-ATLAS',
    loop_code: 'META-L02',
    version: 1
  },
  {
    id: 'atlas-META-L03',
    name: 'Escalation Governance (N→P→S Ladder)',
    loop_type: 'structural',
    scale: 'macro',
    status: 'draft',
    leverage_default: 'S',
    notes: 'Escalation ladder routing live.',
    metadata: {
      loop_code: 'META-L03',
      batch: 5,
      node_count: 7,
      edge_count: 11,
      indicator_count: 3,
      has_snl: true,
      has_de_band: true,
      has_srt: true,
      atlas_data: {
        nodes: [],
        edges: [],
        indicators: [
          { name: 'Breach Persistence', unit: '% periods', de_band: { lower: 0, upper: 30, asymmetry: 0.0, alpha: 0.4 } },
          { name: 'Integral Error', unit: 'Σσ', de_band: { lower: 0.5, upper: 2.0, asymmetry: 0.0, alpha: 0.4 } },
          { name: 'Escalation Actions', unit: 'count/qtr', de_band: { lower: 0, upper: 4, asymmetry: 0.0, alpha: 0.3 } }
        ],
        shared_nodes: ['Institutions.Authority', 'Budget', 'Backlog'],
        de_bands: [],
        srt: { reflex_horizon: 'P60D', cadence: 'bi-monthly' }
      }
    },
    controller: {},
    thresholds: {},
    tags: ['meta-control', 'escalation', 'governance'],
    node_count: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null,
    source_tag: 'NCF-PAGS-ATLAS',
    loop_code: 'META-L03',
    version: 1
  },
  {
    id: 'atlas-META-L04',
    name: 'Data Integrity & Standards',
    loop_type: 'structural',
    scale: 'macro',
    status: 'draft',
    leverage_default: 'S',
    notes: 'Standards registry & API contracts enforced.',
    metadata: {
      loop_code: 'META-L04',
      batch: 5,
      node_count: 5,
      edge_count: 8,
      indicator_count: 3,
      has_snl: true,
      has_de_band: true,
      has_srt: true,
      atlas_data: {
        nodes: [],
        edges: [],
        indicators: [
          { name: 'QA Conformance', unit: '% checks passed', de_band: { lower: 85, upper: 98, asymmetry: 0.0, alpha: 0.4 } },
          { name: 'Latency', unit: 'days', de_band: { lower: 1, upper: 7, asymmetry: 0.0, alpha: 0.4 } },
          { name: 'KPI Volatility', unit: 'σ', de_band: { lower: 0.1, upper: 0.4, asymmetry: 0.0, alpha: 0.3 } }
        ],
        shared_nodes: ['Institutions.DataInteroperability', 'Services.Latency'],
        de_bands: [],
        srt: { reflex_horizon: 'P30D', cadence: 'monthly' }
      }
    },
    controller: {},
    thresholds: {},
    tags: ['meta-control', 'data-integrity', 'standards'],
    node_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null,
    source_tag: 'NCF-PAGS-ATLAS',
    loop_code: 'META-L04',
    version: 1
  },
  // Add all the other loops...
  {
    id: 'atlas-MAC-L01',
    name: 'Demographic Regime & Support Ratio',
    loop_type: 'structural',
    scale: 'macro',
    status: 'draft',
    leverage_default: 'N',
    notes: 'Long-horizon cohort tracking enabled.',
    metadata: {
      loop_code: 'MAC-L01',
      batch: 5,
      node_count: 9,
      edge_count: 14,
      indicator_count: 3,
      has_snl: true,
      has_de_band: true,
      has_srt: true,
      atlas_data: {
        nodes: [],
        edges: [],
        indicators: [
          { name: 'Support Ratio', unit: 'workers/dependents', de_band: { lower: 1.8, upper: 2.6, asymmetry: 0.0, alpha: 0.2 } },
          { name: 'Dependency Ratio', unit: '%', de_band: { lower: 45, upper: 65, asymmetry: 0.0, alpha: 0.2 } },
          { name: 'Fertility Rate', unit: 'children/woman', de_band: { lower: 1.7, upper: 2.4, asymmetry: 0.0, alpha: 0.2 } }
        ],
        shared_nodes: ['Fertility', 'Mortality', 'Migration', 'Population.AgeCohorts', 'DependencyRatio'],
        de_bands: [],
        srt: { reflex_horizon: 'P365D', cadence: 'annual' }
      }
    },
    controller: {},
    thresholds: {},
    tags: ['macro', 'demographics', 'population'],
    node_count: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null,
    source_tag: 'NCF-PAGS-ATLAS',
    loop_code: 'MAC-L01',
    version: 1
  }
  // ... continue with all other loops
];

export const seedBatch5LoopsIfNeeded = () => {
  // This would typically check if loops exist and seed them if not
  console.log('Batch 5 loops available for seeding:', batch5Loops.length);
  return batch5Loops;
};