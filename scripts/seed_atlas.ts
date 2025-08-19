#!/usr/bin/env node

import { supabase } from '../src/integrations/supabase/client';

// SNL Catalog - upsert by label and domain
const SNL_CATALOG = [
  // Social domain
  { label: 'Society.Trust', domain: 'social', descriptor: 'Social trust and confidence in institutions' },
  { label: 'Society.Cohesion', domain: 'social', descriptor: 'Social cohesion and solidarity' },
  { label: 'Society.Participation', domain: 'social', descriptor: 'Civic participation and engagement' },
  { label: 'PerceivedFairness', domain: 'social', descriptor: 'Perceived fairness of systems and processes' },

  // Institution domain
  { label: 'Institutions.DecisionLatency', domain: 'institution', descriptor: 'Time delay in institutional decision-making' },
  { label: 'Institutions.CapacityIndex', domain: 'institution', descriptor: 'Institutional capacity measurement' },
  { label: 'Institutions.Authority', domain: 'institution', descriptor: 'Authority and mandate scope' },
  { label: 'Institutions.Budget', domain: 'institution', descriptor: 'Budget allocation and constraints' },
  { label: 'Institutions.DataInteroperability', domain: 'institution', descriptor: 'Data system integration capability' },
  { label: 'Institutions.Guardrails', domain: 'institution', descriptor: 'Policy and operational guardrails' },
  { label: 'Institutions.LegalProcess', domain: 'institution', descriptor: 'Legal process and compliance framework' },
  { label: 'Services.Latency', domain: 'institution', descriptor: 'Service delivery response time' },
  { label: 'Services.Capacity.Health', domain: 'institution', descriptor: 'Health service capacity' },
  { label: 'Edu.TeacherStock', domain: 'institution', descriptor: 'Teacher workforce availability' },
  { label: 'Procurement.PMO', domain: 'institution', descriptor: 'Procurement management office capacity' },
  { label: 'Firms.SME.CreditAccess', domain: 'institution', descriptor: 'SME access to credit and financing' },
  { label: 'ContractPerformance', domain: 'institution', descriptor: 'Contract execution performance' },

  // Population domain
  { label: 'Population.AgeCohorts', domain: 'population', descriptor: 'Age structure and demographic cohorts' },
  { label: 'DependencyRatio', domain: 'population', descriptor: 'Economic dependency ratio' },
  { label: 'Fertility', domain: 'population', descriptor: 'Fertility rates and patterns' },
  { label: 'Mortality', domain: 'population', descriptor: 'Mortality rates and life expectancy' },
  { label: 'Migration', domain: 'population', descriptor: 'Migration flows and patterns' },
  { label: 'HH.Income', domain: 'population', descriptor: 'Household income distribution' },
  { label: 'HH.Savings', domain: 'population', descriptor: 'Household savings behavior' },
  { label: 'HH.DebtService', domain: 'population', descriptor: 'Household debt servicing capacity' },

  // Resource domain
  { label: 'Prices', domain: 'resource', descriptor: 'General price levels and inflation' },
  { label: 'MoneySupply', domain: 'resource', descriptor: 'Money supply and liquidity' },
  { label: 'MoneyDemand', domain: 'resource', descriptor: 'Money demand and velocity' },
  { label: 'Output', domain: 'resource', descriptor: 'Economic output and productivity' },
  { label: 'LandSupply', domain: 'resource', descriptor: 'Available land for development' },
  { label: 'Housing.Approvals', domain: 'resource', descriptor: 'Housing development approvals' },
  { label: 'Housing.Starts', domain: 'resource', descriptor: 'Housing construction starts' },
  { label: 'Housing.Completions', domain: 'resource', descriptor: 'Housing construction completions' },
  { label: 'HouseholdFormation', domain: 'resource', descriptor: 'New household formation rate' },
  { label: 'CapitalStock', domain: 'resource', descriptor: 'Physical capital stock' },
  { label: 'Investment', domain: 'resource', descriptor: 'Investment flows and allocation' },
  { label: 'Obsolescence', domain: 'resource', descriptor: 'Capital obsolescence and depreciation' },
  { label: 'ExternalDemand', domain: 'resource', descriptor: 'External market demand' },
  { label: 'REER', domain: 'resource', descriptor: 'Real effective exchange rate' },
  { label: 'TradablesCapacity', domain: 'resource', descriptor: 'Tradable goods production capacity' },
  { label: 'Environment.Quality', domain: 'resource', descriptor: 'Environmental quality indicators' },
  { label: 'ResourceUse', domain: 'resource', descriptor: 'Natural resource utilization' },
  { label: 'Emissions', domain: 'resource', descriptor: 'Pollution and carbon emissions' },
  { label: 'Buffers', domain: 'resource', descriptor: 'Economic and resource buffers' },
  { label: 'ReserveMargin', domain: 'resource', descriptor: 'System reserve margins' },
  { label: 'Water.NRW', domain: 'resource', descriptor: 'Water non-revenue water losses' },
  { label: 'Supply', domain: 'resource', descriptor: 'Supply capacity and availability' },
  { label: 'Demand', domain: 'resource', descriptor: 'Demand patterns and growth' },
  { label: 'StressIndex', domain: 'resource', descriptor: 'System stress and pressure indicators' },
  { label: 'NetworkCapacity', domain: 'resource', descriptor: 'Network infrastructure capacity' },
  { label: 'Load', domain: 'resource', descriptor: 'System load and utilization' },

  // Product domain
  { label: 'ErrorRates', domain: 'product', descriptor: 'Digital system error rates' },
  { label: 'Uptime', domain: 'product', descriptor: 'System uptime and availability' },
  { label: 'Adoption', domain: 'product', descriptor: 'Technology and service adoption rates' },
  { label: 'Satisfaction', domain: 'product', descriptor: 'User satisfaction metrics' },
  { label: 'DataPlatform', domain: 'product', descriptor: 'Data platform capabilities' },
  { label: 'TicketQueue', domain: 'product', descriptor: 'Service ticket queue length' },
  { label: 'SLA', domain: 'product', descriptor: 'Service level agreement compliance' },
  { label: 'ResolutionRate', domain: 'product', descriptor: 'Issue resolution effectiveness' }
];

// ATLAS INDEX - 32 backbone loops
const ATLAS_INDEX = [
  // Meta-Layer (8 loops)
  { code: 'META-L01', name: 'Score Weighting & Band Management', type: 'perceptual', motif: 'B', layer: 'meta', snl: ['Society.Trust', 'Institutions.DecisionLatency'] },
  { code: 'META-L02', name: 'Controller Arbitration & Retuning', type: 'perceptual', motif: 'B', layer: 'meta', snl: ['Institutions.DecisionLatency', 'Institutions.CapacityIndex'] },
  { code: 'META-L03', name: 'Escalation Governance (N→P→S Ladder)', type: 'structural', motif: 'C', layer: 'meta', snl: ['Institutions.Authority', 'Institutions.Budget'] },
  { code: 'META-L04', name: 'Data Integrity & Standards', type: 'structural', motif: 'T', layer: 'meta', snl: ['Institutions.DataInteroperability', 'Services.Latency'] },
  { code: 'META-L05', name: 'Threshold Guardrail Auditor', type: 'perceptual', motif: 'B', layer: 'meta', snl: ['Institutions.Guardrails'] },
  { code: 'META-L06', name: 'Structural Proposal Pipeline', type: 'structural', motif: 'B', layer: 'meta', snl: ['Institutions.Authority', 'Institutions.Budget', 'Institutions.LegalProcess'] },
  { code: 'META-L07', name: 'Legitimacy & Participation Coupler', type: 'perceptual', motif: 'T', layer: 'meta', snl: ['Society.Trust', 'Society.Participation', 'Society.Cohesion'] },
  { code: 'META-L08', name: 'Early Warning & Risk Orchestrator', type: 'anticipatory', motif: 'C', layer: 'meta', snl: ['Environment.Quality', 'ExternalDemand'] },

  // Macro-Layer (10 loops)
  { code: 'MAC-L01', name: 'Demographic Regime & Support Ratio', type: 'structural', motif: 'B', layer: 'macro', snl: ['Population.AgeCohorts', 'DependencyRatio', 'Fertility', 'Mortality', 'Migration'] },
  { code: 'MAC-L02', name: 'Labor Market Macro Balance (Jobs↔Skills)', type: 'structural', motif: 'B', layer: 'macro', snl: ['HH.Income', 'Output'] },
  { code: 'MAC-L03', name: 'Price–Quantity Stability (Inflation & Output)', type: 'structural', motif: 'B', layer: 'macro', snl: ['Prices', 'MoneySupply', 'MoneyDemand', 'Output'] },
  { code: 'MAC-L04', name: 'Housing–Land Macro Elasticity', type: 'structural', motif: 'C', layer: 'macro', snl: ['LandSupply', 'Housing.Approvals', 'Prices', 'HouseholdFormation'] },
  { code: 'MAC-L05', name: 'Capital Accumulation & Investment Cycle', type: 'structural', motif: 'R', layer: 'macro', snl: ['CapitalStock', 'Investment', 'Obsolescence'] },
  { code: 'MAC-L06', name: 'External Demand & Competitiveness', type: 'structural', motif: 'C', layer: 'macro', snl: ['ExternalDemand', 'REER', 'TradablesCapacity'] },
  { code: 'MAC-L07', name: 'Resource Load & Ecological Ceiling', type: 'structural', motif: 'B', layer: 'macro', snl: ['Environment.Quality', 'ResourceUse', 'Emissions'] },
  { code: 'MAC-L08', name: 'Social Cohesion & National Legitimacy', type: 'perceptual', motif: 'R', layer: 'macro', snl: ['Society.Trust', 'Society.Cohesion', 'PerceivedFairness'] },
  { code: 'MAC-L09', name: 'Macro Resilience (Shock Absorption)', type: 'reactive', motif: 'B', layer: 'macro', snl: ['Buffers'] },
  { code: 'MAC-L10', name: 'Human Capital Regime (Health+Education)', type: 'structural', motif: 'C', layer: 'macro', snl: ['Services.Capacity.Health', 'Edu.TeacherStock'] },

  // Meso-Layer (12 loops)
  { code: 'MES-L01', name: 'Health Service Capacity & Access', type: 'structural', motif: 'B', layer: 'meso', snl: ['Services.Capacity.Health'] },
  { code: 'MES-L02', name: 'Teacher Pipeline & Classroom Throughput', type: 'structural', motif: 'B', layer: 'meso', snl: ['Edu.TeacherStock'] },
  { code: 'MES-L03', name: 'Skills–Jobs Matching (Sectoral)', type: 'structural', motif: 'B', layer: 'meso', snl: ['HH.Income', 'Output'] },
  { code: 'MES-L04', name: 'SME Liquidity & Credit Pipeline', type: 'structural', motif: 'R', layer: 'meso', snl: ['Firms.SME.CreditAccess'] },
  { code: 'MES-L05', name: 'Housing Delivery (Approvals→Starts→Complet.)', type: 'structural', motif: 'C', layer: 'meso', snl: ['Housing.Approvals', 'Housing.Starts', 'Housing.Completions'] },
  { code: 'MES-L06', name: 'Transport Throughput & Congestion', type: 'structural', motif: 'B', layer: 'meso', snl: ['NetworkCapacity', 'Load'] },
  { code: 'MES-L07', name: 'Energy Supply Adequacy & Reliability', type: 'structural', motif: 'B', layer: 'meso', snl: ['Supply', 'Demand', 'ReserveMargin'] },
  { code: 'MES-L08', name: 'Water Security & Loss Control', type: 'structural', motif: 'B', layer: 'meso', snl: ['Supply', 'Demand', 'Water.NRW', 'StressIndex'] },
  { code: 'MES-L09', name: 'Digital Services Reliability & Uptake', type: 'reactive', motif: 'R', layer: 'meso', snl: ['Uptime', 'ErrorRates', 'Adoption', 'Satisfaction'] },
  { code: 'MES-L10', name: 'Policy Implementation Latency', type: 'structural', motif: 'B', layer: 'meso', snl: ['Institutions.DecisionLatency'] },
  { code: 'MES-L11', name: 'Interministerial Coordination & Spillovers', type: 'structural', motif: 'T', layer: 'meso', snl: ['Institutions.Authority'] },
  { code: 'MES-L12', name: 'Procurement & Delivery Fidelity', type: 'structural', motif: 'B', layer: 'meso', snl: ['ContractPerformance', 'Procurement.PMO'] },

  // Micro-Layer (12 loops)
  { code: 'MIC-L01', name: 'HH Income–Consumption–Savings', type: 'structural', motif: 'B', layer: 'micro', snl: ['HH.Income', 'Prices', 'HH.Savings', 'HH.DebtService'] },
  { code: 'MIC-L02', name: 'HH Health Access & Adherence', type: 'reactive', motif: 'B', layer: 'micro', snl: ['Services.Capacity.Health'] },
  { code: 'MIC-L03', name: 'School Attendance & Learning Effort', type: 'perceptual', motif: 'B', layer: 'micro', snl: ['Edu.TeacherStock'] },
  { code: 'MIC-L04', name: 'Firm Hiring & Attrition', type: 'reactive', motif: 'B', layer: 'micro', snl: ['HH.Income'] },
  { code: 'MIC-L05', name: 'Firm Working Capital & Delayed Payments', type: 'structural', motif: 'B', layer: 'micro', snl: ['Firms.SME.CreditAccess'] },
  { code: 'MIC-L06', name: 'Service Ticket Resolution (Frontline)', type: 'reactive', motif: 'B', layer: 'micro', snl: ['TicketQueue', 'SLA', 'ResolutionRate'] },
  { code: 'MIC-L07', name: 'Price Adjustment to Local Shortages', type: 'reactive', motif: 'R', layer: 'micro', snl: ['Prices'] },
  { code: 'MIC-L08', name: 'Household Fertility Decision Support', type: 'perceptual', motif: 'B', layer: 'micro', snl: ['Fertility', 'HouseholdFormation'] },
  { code: 'MIC-L09', name: 'Migration Micro-Decision (Intent→Move)', type: 'perceptual', motif: 'C', layer: 'micro', snl: ['Migration', 'HH.Income'] },
  { code: 'MIC-L10', name: 'Compliance & Rule Adherence', type: 'perceptual', motif: 'B', layer: 'micro', snl: ['Society.Trust', 'PerceivedFairness'] },
  { code: 'MIC-L11', name: 'Household Digital Adoption', type: 'perceptual', motif: 'R', layer: 'micro', snl: ['Adoption', 'DataPlatform'] },
  { code: 'MIC-L12', name: 'Local Participation & Co-production', type: 'perceptual', motif: 'R', layer: 'micro', snl: ['Society.Participation', 'Society.Trust'] }
];

// Motif templates for CLD generation
const MOTIF_TEMPLATES = {
  B: { // Balancing loop
    nodes: [
      { label: 'Error', kind: 'stock', meta: { description: 'Gap between desired and actual state' } },
      { label: 'Adjustment', kind: 'aux', meta: { description: 'Corrective action taken' } },
      { label: 'State', kind: 'stock', meta: { description: 'Current system state' } }
    ],
    edges: [
      { from: 'Error', to: 'Adjustment', polarity: -1 },
      { from: 'Adjustment', to: 'State', polarity: -1 },
      { from: 'State', to: 'Error', polarity: -1 }
    ]
  },
  R: { // Reinforcing loop
    nodes: [
      { label: 'Driver', kind: 'stock', meta: { description: 'Primary driving factor' } },
      { label: 'Gain', kind: 'aux', meta: { description: 'Amplification mechanism' } }
    ],
    edges: [
      { from: 'Driver', to: 'Gain', polarity: 1 },
      { from: 'Gain', to: 'Driver', polarity: 1 }
    ]
  },
  C: { // Constraint/bottleneck loop
    nodes: [
      { label: 'Load', kind: 'stock', meta: { description: 'System demand or load' } },
      { label: 'Capacity', kind: 'stock', meta: { description: 'Available capacity' } },
      { label: 'Constraint', kind: 'aux', meta: { description: 'Bottleneck or limiting factor' } },
      { label: 'State', kind: 'stock', meta: { description: 'System performance state' } }
    ],
    edges: [
      { from: 'Load', to: 'Constraint', polarity: 1 },
      { from: 'Constraint', to: 'State', polarity: -1 },
      { from: 'Capacity', to: 'State', polarity: 1 },
      { from: 'State', to: 'Load', polarity: -1 }
    ]
  },
  T: { // Coordination/standardization loop
    nodes: [
      { label: 'Standard', kind: 'aux', meta: { description: 'Reference standard or protocol' } },
      { label: 'Variance', kind: 'stock', meta: { description: 'Deviation from standard' } },
      { label: 'Compliance', kind: 'stock', meta: { description: 'Level of compliance' } }
    ],
    edges: [
      { from: 'Standard', to: 'Variance', polarity: -1 },
      { from: 'Compliance', to: 'Variance', polarity: -1 },
      { from: 'Variance', to: 'Compliance', polarity: -1 }
    ]
  }
};

// Helper functions
async function upsertSNL() {
  console.log('📋 Upserting SNL entries...');
  
  for (const snl of SNL_CATALOG) {
    const { data, error } = await supabase
      .from('shared_nodes')
      .upsert(snl, { 
        onConflict: 'label,domain',
        ignoreDuplicates: false 
      });
    
    if (error && !error.message.includes('duplicate')) {
      console.error(`Error upserting SNL ${snl.label}:`, error);
    } else {
      console.log(`✅ Upserted SNL: ${snl.label} (${snl.domain})`);
    }
  }
}

async function createIndicators(loopId: string, loopCode: string, userId: string) {
  // Create 3 indicators per loop with index units
  const indicators = [
    { name: `${loopCode}-T1`, unit: 'index', target: 50, lower: 40, upper: 60 },
    { name: `${loopCode}-T2`, unit: 'index', target: 50, lower: 30, upper: 70 },
    { name: `${loopCode}-T3`, unit: 'index', target: 50, lower: 20, upper: 80 }
  ];

  for (const indicator of indicators) {
    // Create indicator
    const { data: indicatorData, error: indicatorError } = await supabase
      .from('indicators')
      .insert({
        user_id: userId,
        name: indicator.name,
        type: 'quantity',
        unit: indicator.unit,
        target_value: indicator.target,
        lower_bound: indicator.lower,
        upper_bound: indicator.upper
      })
      .select()
      .single();

    if (indicatorError) {
      console.error(`Error creating indicator ${indicator.name}:`, indicatorError);
      continue;
    }

    // Create DE band
    const { error: bandError } = await supabase
      .from('de_bands')
      .insert({
        loop_id: loopId,
        indicator: indicator.name,
        lower_bound: indicator.lower,
        upper_bound: indicator.upper,
        asymmetry: 0,
        smoothing_alpha: 0.3,
        user_id: userId,
        notes: `Generated DE band for ${loopCode}`
      });

    if (bandError) {
      console.error(`Error creating DE band for ${indicator.name}:`, bandError);
    }
  }
}

async function createSRTWindow(loopId: string, userId: string) {
  const { error } = await supabase
    .from('srt_windows')
    .insert({
      loop_id: loopId,
      window_start: new Date().toISOString(),
      window_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      reflex_horizon: '30 days',
      cadence: '1 week',
      user_id: userId
    });

  if (error) {
    console.error(`Error creating SRT window:`, error);
  }
}

async function createCLD(loopId: string, motif: string, loopCode: string) {
  const template = MOTIF_TEMPLATES[motif as keyof typeof MOTIF_TEMPLATES];
  if (!template) {
    console.warn(`No template found for motif: ${motif}`);
    return;
  }

  // Create nodes
  const nodeMap = new Map<string, string>();
  
  for (const nodeTemplate of template.nodes) {
    const { data, error } = await supabase
      .from('loop_nodes')
      .insert({
        loop_id: loopId,
        label: `${loopCode} ${nodeTemplate.label}`,
        kind: nodeTemplate.kind,
        meta: nodeTemplate.meta
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating node ${nodeTemplate.label}:`, error);
      continue;
    }

    nodeMap.set(nodeTemplate.label, data.id);
  }

  // Create edges
  for (const edgeTemplate of template.edges) {
    const fromNodeId = nodeMap.get(edgeTemplate.from);
    const toNodeId = nodeMap.get(edgeTemplate.to);

    if (!fromNodeId || !toNodeId) {
      console.warn(`Cannot create edge: missing node IDs`);
      continue;
    }

    const { error } = await supabase
      .from('loop_edges')
      .insert({
        loop_id: loopId,
        from_node: fromNodeId,
        to_node: toNodeId,
        polarity: edgeTemplate.polarity,
        delay_ms: 0,
        weight: 1.0
      });

    if (error) {
      console.error(`Error creating edge:`, error);
    }
  }

  // Make one node an indicator node if not already
  if (template.nodes.length > 0 && !template.nodes.some(n => n.kind === 'indicator')) {
    const firstNodeId = nodeMap.get(template.nodes[0].label);
    if (firstNodeId) {
      await supabase
        .from('loop_nodes')
        .update({ kind: 'indicator' })
        .eq('id', firstNodeId);
    }
  }
}

async function linkSNL(loopId: string, snlLabels: string[]) {
  for (const label of snlLabels) {
    // Find the SNL node
    const { data: snlNode } = await supabase
      .from('shared_nodes')
      .select('id')
      .eq('label', label)
      .single();

    if (!snlNode) {
      console.warn(`SNL node not found: ${label}`);
      continue;
    }

    // Link to loop
    const { error } = await supabase
      .from('loop_shared_nodes')
      .insert({
        loop_id: loopId,
        node_id: snlNode.id
      });

    if (error && !error.message.includes('duplicate')) {
      console.error(`Error linking SNL ${label}:`, error);
    }
  }
}

async function createAtlasLoop(loopSpec: typeof ATLAS_INDEX[0], userId: string) {
  console.log(`🔄 Creating loop: ${loopSpec.code} - ${loopSpec.name}`);

  // Upsert the loop
  const { data: loop, error: loopError } = await supabase
    .from('loops')
    .upsert({
      loop_code: loopSpec.code,
      name: loopSpec.name,
      loop_type: loopSpec.type as any,
      motif: loopSpec.motif,
      layer: loopSpec.layer,
      scale: loopSpec.layer as any, // Use layer as scale
      leverage_default: 'P' as any,
      status: 'draft',
      source_tag: 'NCF-PAGS-ATLAS',
      metadata: {
        atlas: true,
        generated: true,
        snl_links: loopSpec.snl
      },
      tags: ['atlas', 'ncf-pags'],
      user_id: userId
    }, { 
      onConflict: 'loop_code',
      ignoreDuplicates: false 
    })
    .select()
    .single();

  if (loopError) {
    console.error(`Error creating loop ${loopSpec.code}:`, loopError);
    return null;
  }

  const loopId = loop.id;

  // Create CLD
  await createCLD(loopId, loopSpec.motif, loopSpec.code);

  // Create indicators and DE bands
  await createIndicators(loopId, loopSpec.code, userId);

  // Create SRT window
  await createSRTWindow(loopId, userId);

  // Link SNL entries
  await linkSNL(loopId, loopSpec.snl);

  // Try to publish the loop
  const { data: publishResult, error: publishError } = await supabase.rpc('publish_loop', {
    loop_uuid: loopId
  });

  if (publishError) {
    console.warn(`Could not auto-publish ${loopSpec.code}: ${publishError.message}`);
  } else {
    console.log(`✅ Published loop: ${loopSpec.code}`);
  }

  return loop;
}

async function deprecateOldLoops() {
  console.log('🗂️ Deprecating non-atlas loops...');
  
  const { error } = await supabase
    .from('loops')
    .update({ status: 'deprecated' })
    .neq('source_tag', 'NCF-PAGS-ATLAS')
    .is('loop_code', null);

  if (error) {
    console.error('Error deprecating old loops:', error);
  } else {
    console.log('✅ Deprecated non-atlas loops');
  }
}

async function main() {
  console.log('🚀 Starting NCF-PAGS Atlas seeding...');

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('User not authenticated:', userError);
    return;
  }

  try {
    // Step 1: Upsert SNL catalog
    await upsertSNL();

    // Step 2: Create atlas loops
    console.log('🔧 Creating 32 atlas loops...');
    let createdCount = 0;
    
    for (const loopSpec of ATLAS_INDEX) {
      const loop = await createAtlasLoop(loopSpec, user.id);
      if (loop) createdCount++;
    }

    // Step 3: Deprecate old loops
    await deprecateOldLoops();

    console.log(`🎉 Atlas seeding complete! Created ${createdCount}/32 loops`);
    console.log(`📊 Summary:`);
    console.log(`   - Meta loops: ${ATLAS_INDEX.filter(l => l.layer === 'meta').length}`);
    console.log(`   - Macro loops: ${ATLAS_INDEX.filter(l => l.layer === 'macro').length}`);
    console.log(`   - Meso loops: ${ATLAS_INDEX.filter(l => l.layer === 'meso').length}`);
    console.log(`   - Micro loops: ${ATLAS_INDEX.filter(l => l.layer === 'micro').length}`);
    
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeder if called directly
if (require.main === module) {
  main();
}

export { main as seedAtlas };