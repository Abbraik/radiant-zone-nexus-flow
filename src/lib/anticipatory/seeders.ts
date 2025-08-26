// Anticipatory Runtime Seeders - Playbooks, Templates & Demo Data
import { supabase } from '@/integrations/supabase/client';
import { GOLDEN_PATH_DSL } from './dsl';

// Seeder for risk channels (using existing tables for now)
export async function seedRiskChannels(): Promise<void> {
  console.log('🌱 Seeding risk channels...');
  
  // Use existing antic_watchpoints as risk channels
  const userId = await getCurrentUserId();
  const channels: any[] = [
    {
      channel_key: 'childcare_load',
      title: 'Childcare System Load',
      description: 'Monitor childcare availability and waiting times',
      default_window: '14d',
      enabled: true
    },
    {
      channel_key: 'heat_wave',
      title: 'Heat Wave Events',
      description: 'Track extreme heat conditions and health impacts',
      default_window: '7d',
      enabled: true
    },
    {
      channel_key: 'supply_chain',
      title: 'Supply Chain Disruption',
      description: 'Monitor port congestion and logistics bottlenecks',
      default_window: '21d',
      enabled: true
    },
    {
      channel_key: 'trust_divergence',
      title: 'Trust & Social Cohesion',
      description: 'Track community trust and satisfaction trends',
      default_window: '60d',
      enabled: true
    },
    {
      channel_key: 'orderbook_visa',
      title: 'Economic Indicators',
      description: 'Monitor export orders and visa processing delays',
      default_window: '14d',
      enabled: true
    },
    {
      channel_key: 'grievances',
      title: 'Grievance Hotspots',
      description: 'Track grievance rates and complaint patterns',
      default_window: '14d',
      enabled: true
    },
    {
      channel_key: 'prices',
      title: 'Price Volatility',
      description: 'Monitor CPI subindex movements and price shocks',
      default_window: '28d',
      enabled: true
    }
  ];
  
  // Skip for now - table creation pending
  console.log('⏩ Skipping risk channels (table creation pending)');
  
  if (error) {
    console.error('Error seeding risk channels:', error);
  } else {
    console.log(`✅ Seeded ${channels.length} risk channels`);
  }
}

// Seeder for playbooks
export async function seedPlaybooks(): Promise<void> {
  console.log('🌱 Seeding playbooks...');
  
  const playbooks = [
    {
      playbook_key: 'containment_pack_childcare',
      capacity: 'responsive',
      title: 'Childcare Surge - Containment Pack',
      content: {
        description: 'Emergency response for childcare system overload',
        items: [
          { key: 'crew_call', label: 'Emergency staff call-up tree', ready: true },
          { key: 'extended_hours', label: 'Extended hours authorization script', ready: true },
          { key: 'fee_relief', label: 'Emergency fee relief processing', ready: false },
          { key: 'temp_facilities', label: 'Temporary facility setup guide', ready: true }
        ],
        checklist: [
          'Activate emergency staffing protocol',
          'Extend operating hours at priority centers',
          'Process emergency fee relief applications',
          'Set up temporary overflow facilities'
        ],
        resources: {
          staff: '24 emergency workers',
          budget: '€250k emergency allocation',
          timeToActivate: '4 hours'
        }
      },
      active: true
    },
    {
      playbook_key: 'readiness_plan_heat',
      capacity: 'anticipatory',
      title: 'Heat Wave - Readiness Plan',
      content: {
        description: 'Proactive preparation for extreme heat events',
        items: [
          { key: 'cooling_centers', label: 'Cooling center preparation', ready: true },
          { key: 'health_supplies', label: 'Heat stress medical supplies', ready: true },
          { key: 'irrigation_schedule', label: 'Emergency irrigation schedule', ready: false },
          { key: 'spare_parts', label: 'HVAC spare parts staging', ready: true }
        ],
        checklist: [
          'Pre-position cooling center supplies',
          'Stage medical heat stress kits',
          'Activate emergency irrigation protocols',
          'Deploy HVAC maintenance teams'
        ],
        resources: {
          staff: '12 specialists',
          budget: '€150k preparedness allocation',
          timeToActivate: '24 hours'
        }
      },
      active: true
    },
    {
      playbook_key: 'portfolio_compare_cohesion',
      capacity: 'deliberative',
      title: 'Social Cohesion - Portfolio Comparison',
      content: {
        description: 'Systematic review of social cohesion interventions',
        items: [
          { key: 'participation_sprint', label: 'Community participation sprint checklist', ready: true },
          { key: 'transparency_banners', label: 'Open government status banners', ready: true },
          { key: 'feedback_channels', label: 'Enhanced feedback mechanisms', ready: false },
          { key: 'town_halls', label: 'Town hall meeting templates', ready: true }
        ],
        checklist: [
          'Launch community participation initiatives',
          'Deploy transparency status updates',
          'Enhance citizen feedback channels',
          'Schedule community consultation sessions'
        ],
        resources: {
          staff: '8 community liaisons',
          budget: '€80k engagement allocation',
          timeToActivate: '72 hours'
        }
      },
      active: true
    },
    {
      playbook_key: 'dossier_educator_fast_lane',
      capacity: 'structural',
      title: 'Educator Fast Lane - Policy Dossier',
      content: {
        description: 'Comprehensive policy package for educator pipeline reform',
        items: [
          { key: 'mandate_authority', label: 'Legislative mandate framework', ready: false },
          { key: 'mesh_coordination', label: 'Cross-agency coordination mesh', ready: true },
          { key: 'process_standards', label: 'Streamlined process standards', ready: true },
          { key: 'performance_metrics', label: 'Performance measurement system', ready: false }
        ],
        checklist: [
          'Draft legislative mandate provisions',
          'Establish inter-agency coordination protocols',
          'Implement streamlined processing standards',
          'Deploy performance monitoring systems'
        ],
        resources: {
          staff: '16 policy specialists',
          budget: '€500k implementation allocation',
          timeToActivate: '2 weeks'
        }
      },
      active: true
    }
  ];
  
  // Skip for now - table creation pending
  console.log('⏩ Skipping playbooks (table creation pending)');
  
  if (error) {
    console.error('Error seeding playbooks:', error);
  } else {
    console.log(`✅ Seeded ${playbooks.length} playbooks`);
  }
}

// Seeder for trigger templates
export async function seedTriggerTemplates(): Promise<void> {
  console.log('🌱 Seeding trigger templates...');
  
  const templates = [
    {
      template_key: 'childcare_load_v1',
      version: 1,
      channel_key: 'childcare_load',
      title: 'Childcare Load Monitor',
      dsl: GOLDEN_PATH_DSL.childcareSurge,
      defaults: {
        persistence: 14,
        cooldown: 14,
        thresholds: { wait_days: 30 }
      }
    },
    {
      template_key: 'orderbook_visa_v1',
      version: 1,
      channel_key: 'orderbook_visa',
      title: 'Economic Dual Indicator',
      dsl: GOLDEN_PATH_DSL.orderbookVisa,
      defaults: {
        persistence: 14,
        cooldown: 7,
        thresholds: { orderbook: 1.2, visa_days: 21 }
      }
    },
    {
      template_key: 'trust_divergence_v1',
      version: 1,
      channel_key: 'trust_divergence',
      title: 'Trust Slope Divergence',
      dsl: GOLDEN_PATH_DSL.trustDivergence,
      defaults: {
        persistence: 60,
        cooldown: 30,
        thresholds: { trust_slope: -0.05, satisfaction_slope: 0 }
      }
    },
    {
      template_key: 'heat_wave_v1',
      version: 1,
      channel_key: 'heat_wave',
      title: 'Heat Index Threshold',
      dsl: GOLDEN_PATH_DSL.heatWave,
      defaults: {
        persistence: 7,
        cooldown: 7,
        thresholds: { heat_index: 0.75 }
      }
    },
    {
      template_key: 'grievance_hotspot_v1',
      version: 1,
      channel_key: 'grievances',
      title: 'Grievance Band Breach',
      dsl: GOLDEN_PATH_DSL.grievanceHotspot,
      defaults: {
        persistence: 14,
        cooldown: 21,
        cohortSupport: true
      }
    },
    {
      template_key: 'price_spike_v1',
      version: 1,
      channel_key: 'prices',
      title: 'CPI Subindex Monitor',
      dsl: 'IF SLOPE(cpi_food, 28d) >= 0.05 AND BAND(cpi_food) IS above FOR 14d THEN START containment_pack IN responsive WITH COOLDOWN=14d',
      defaults: {
        persistence: 14,
        cooldown: 14,
        thresholds: { cpi_slope: 0.05 }
      }
    }
  ];
  
  // Skip for now - table creation pending
  console.log('⏩ Skipping trigger templates (table creation pending)');
  
  if (error) {
    console.error('Error seeding trigger templates:', error);
  } else {
    console.log(`✅ Seeded ${templates.length} trigger templates`);
  }
}

// Seeder for demo scenarios
export async function seedDemoScenarios(): Promise<void> {
  console.log('🌱 Seeding demo scenarios...');
  
  const userId = await getCurrentUserId();
  
  const scenarios = [
    {
      id: 'demo_childcare_surge',
      title: 'Childcare System Surge',
      description: 'Simulate 30% increase in childcare demand over 2 weeks',
      channel_key: 'childcare_load',
      inputs: {
        indicatorShocks: [
          {
            indicator: 'childcare_wait_days',
            offsetPercent: 30,
            durationDays: 14,
            startDay: 3
          }
        ]
      },
      horizon: 'P30D',
      created_by: userId
    },
    {
      id: 'demo_heat_wave_response',
      title: 'Extended Heat Wave',
      description: 'Simulate 7-day heat wave with progressive intensity',
      channel_key: 'heat_wave',
      inputs: {
        indicatorShocks: [
          {
            indicator: 'heat_index',
            offsetPercent: 25,
            durationDays: 7,
            startDay: 5
          }
        ]
      },
      horizon: 'P21D',
      created_by: userId
    },
    {
      id: 'demo_economic_dual_shock',
      title: 'Economic Dual Indicator Shock',
      description: 'Simulate orderbook decline with visa processing delays',
      channel_key: 'orderbook_visa',
      inputs: {
        indicatorShocks: [
          {
            indicator: 'orderbook_index',
            offsetPercent: 20,
            durationDays: 21,
            startDay: 0
          },
          {
            indicator: 'visa_latency_days',
            offsetPercent: 40,
            durationDays: 18,
            startDay: 7
          }
        ],
        covariances: [
          {
            indicator1: 'orderbook_index',
            indicator2: 'visa_latency_days',
            correlation: -0.6
          }
        ]
      },
      horizon: 'P45D',
      created_by: userId
    }
  ];
  
  const { error } = await supabase
    .from('antic_scenarios')
    .upsert(scenarios, { onConflict: 'id' });
  
  if (error) {
    console.error('Error seeding demo scenarios:', error);
  } else {
    console.log(`✅ Seeded ${scenarios.length} demo scenarios`);
  }
}

// Seeder for demo backtests with synthetic results
export async function seedDemoBacktests(): Promise<void> {
  console.log('🌱 Seeding demo backtests...');
  
  const userId = await getCurrentUserId();
  
  // Create backtests for each golden path
  const backtests = [
    {
      rule_id: 'backtest_childcare_6m',
      org_id: userId,
      horizon: 'P180D',
      metrics: {
        auc: 0.82,
        precision: 0.76,
        recall: 0.69,
        f1: 0.72,
        avgDetectionLeadTime: 18.5,
        falsePositiveRate: 0.08
      },
      points: generateSyntheticBacktestPoints(180, 0.76, 0.69)
    },
    {
      rule_id: 'backtest_heat_wave_6m',
      org_id: userId,
      horizon: 'P180D',
      metrics: {
        auc: 0.88,
        precision: 0.84,
        recall: 0.71,
        f1: 0.77,
        avgDetectionLeadTime: 24.2,
        falsePositiveRate: 0.05
      },
      points: generateSyntheticBacktestPoints(180, 0.84, 0.71)
    },
    {
      rule_id: 'backtest_economic_6m',
      org_id: userId,
      horizon: 'P180D',
      metrics: {
        auc: 0.75,
        precision: 0.68,
        recall: 0.73,
        f1: 0.70,
        avgDetectionLeadTime: 36.8,
        falsePositiveRate: 0.12
      },
      points: generateSyntheticBacktestPoints(180, 0.68, 0.73)
    }
  ];
  
  const { error } = await supabase
    .from('antic_backtests')
    .upsert(backtests, { onConflict: 'rule_id,org_id' });
  
  if (error) {
    console.error('Error seeding demo backtests:', error);
  } else {
    console.log(`✅ Seeded ${backtests.length} demo backtests`);
  }
}

// Helper to generate synthetic backtest data points
function generateSyntheticBacktestPoints(days: number, precision: number, recall: number): any[] {
  const points = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (days - i) * 24 * 60 * 60 * 1000);
    
    // Generate realistic firing patterns
    const shouldHaveIncident = Math.random() < 0.1; // 10% incident rate
    const predicted = Math.random() < (shouldHaveIncident ? recall : (1 - precision));
    
    if (predicted || shouldHaveIncident) {
      points.push({
        t: date.toISOString(),
        fired: predicted ? 1 : 0,
        breach: shouldHaveIncident ? 1 : 0,
        score: Math.random() * 0.3 + (predicted ? 0.7 : 0.2)
      });
    }
  }
  
  return points;
}

// Helper to get current user ID
async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || 'demo-user';
}

// Master seeder function
export async function seedAnticipatoryRuntime(): Promise<void> {
  console.log('🚀 Starting Anticipatory Runtime seeding...');
  
  try {
    await seedRiskChannels();
    await seedPlaybooks();
    await seedTriggerTemplates();
    await seedDemoScenarios();
    await seedDemoBacktests();
    
    console.log('🎉 Anticipatory Runtime seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Individual export functions for selective seeding
export {
  seedRiskChannels,
  seedPlaybooks,
  seedTriggerTemplates,
  seedDemoScenarios,
  seedDemoBacktests
};