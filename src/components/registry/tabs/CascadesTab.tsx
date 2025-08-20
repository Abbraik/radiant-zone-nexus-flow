import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, ArrowLeft, Link2, GitBranch, Info } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface CascadesTabProps {
  loop: LoopData;
}

interface CascadeHook {
  type: 'upstream' | 'downstream' | 'stability' | 'coupler';
  loopId: string;
  loopName: string;
  connection: string;
  description?: string;
  strength?: 'weak' | 'medium' | 'strong';
}

// Sample data mapping - in production this would come from the loop metadata
const getCascadesForLoop = (loopId: string): CascadeHook[] => {
  const cascadeData: Record<string, CascadeHook[]> = {
    // Batch 5 - META System Controls & Macro-Meso-Micro Loops
    'atlas-META-L01': [
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L04', 
        loopName: 'Data Integrity & Standards',
        connection: 'data quality → scoring reliability',
        description: 'Data integrity affects scoring system accuracy',
        strength: 'strong'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L07', 
        loopName: 'Legitimacy & Participation Coupler',
        connection: 'trust levels → band tolerance',
        description: 'Social trust affects acceptable performance bands',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-META-L02', 
        loopName: 'Controller Arbitration & Retuning',
        connection: 'band adjustments → controller parameters',
        description: 'Score weighting changes trigger controller updates',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-META-L03', 
        loopName: 'Escalation Governance',
        connection: 'persistent breaches → escalation triggers',
        description: 'Band violations feed escalation processes',
        strength: 'strong'
      }
    ],
    'atlas-META-L02': [
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L01', 
        loopName: 'Score Weighting & Band Management',
        connection: 'band parameters → controller tuning',
        description: 'Performance bands guide controller optimization',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-META-L05', 
        loopName: 'Threshold Guardrail Auditor',
        connection: 'actuation limits → guardrail monitoring',
        description: 'Controller actions monitored by guardrail system',
        strength: 'strong'
      }
    ],
    'atlas-META-L03': [
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L01', 
        loopName: 'Score Weighting & Band Management',
        connection: 'band breaches → escalation triggers',
        description: 'Performance violations initiate escalation processes',
        strength: 'strong'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-ALL-MACRO-MESO-BREACHES', 
        loopName: 'All Macro/Meso Breaches',
        connection: 'persistent breaches → escalation',
        description: 'Macro and meso loop breaches trigger escalation',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-META-L06', 
        loopName: 'Structural Proposal Pipeline',
        connection: 'chronic issues → structural changes',
        description: 'Persistent problems trigger structural interventions',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L11', 
        loopName: 'Interministerial Coordination',
        connection: 'escalation → coordination requirements',
        description: 'Escalated issues require cross-ministry coordination',
        strength: 'medium'
      }
    ],
    'atlas-META-L04': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L09', 
        loopName: 'Digital Services Reliability',
        connection: 'service performance → data quality',
        description: 'Digital service reliability affects data integrity',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-META-L01', 
        loopName: 'Score Weighting & Band Management',
        connection: 'data standards → scoring reliability',
        description: 'Data quality standards ensure reliable performance measurement',
        strength: 'strong'
      }
    ],
    'atlas-MAC-L01': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L04', 
        loopName: 'Housing–Land Macro Elasticity',
        connection: 'housing formation → demographic pressure',
        description: 'Housing costs affect household formation rates',
        strength: 'strong'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-MIC-L08', 
        loopName: 'Service Level Agreements',
        connection: 'service access → population retention',
        description: 'Service quality affects migration decisions',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L02', 
        loopName: 'Labor Market Macro Balance',
        connection: 'demographic structure → labor supply',
        description: 'Population structure affects workforce composition',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L02', 
        loopName: 'Teacher Pipeline',
        connection: 'cohort size → education demand',
        description: 'Population changes drive education service needs',
        strength: 'medium'
      }
    ],
    'atlas-MAC-L02': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L06', 
        loopName: 'External Demand & Competitiveness',
        connection: 'trade patterns → sectoral employment',
        description: 'External demand affects labor market structure',
        strength: 'medium'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L10', 
        loopName: 'Human Capital Regime',
        connection: 'skills stock → productivity',
        description: 'Human capital development affects labor productivity',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L03', 
        loopName: 'Sectoral Jobs Match',
        connection: 'labor demand → sectoral matching',
        description: 'Macro labor patterns affect sectoral employment',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L04', 
        loopName: 'Employment Transitions',
        connection: 'vacancy gaps → job matching',
        description: 'Macro imbalances affect individual job transitions',
        strength: 'medium'
      }
    ],
    'atlas-MAC-L03': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L06', 
        loopName: 'External Demand & Competitiveness',
        connection: 'import prices → domestic inflation',
        description: 'Trade terms affect domestic price level',
        strength: 'strong'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L07', 
        loopName: 'Energy Supply Adequacy',
        connection: 'energy costs → inflation',
        description: 'Energy prices feed into general price level',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L01', 
        loopName: 'Household Hardship',
        connection: 'inflation → cost of living',
        description: 'Price stability affects household purchasing power',
        strength: 'strong'
      }
    ],
    'atlas-MAC-L04': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L05', 
        loopName: 'Housing Delivery',
        connection: 'stage conversion → supply',
        description: 'Housing delivery efficiency affects market supply',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L08', 
        loopName: 'Service Level Agreements',
        connection: 'housing costs → household formation',
        description: 'Housing affordability affects household decisions',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L01', 
        loopName: 'Demographic Regime & Support Ratio',
        connection: 'formation delays → demographic patterns',
        description: 'Housing constraints affect population dynamics',
        strength: 'medium'
      }
    ],
    'atlas-MES-L01': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L10', 
        loopName: 'Human Capital Regime',
        connection: 'health workforce → service capacity',
        description: 'Health worker training affects service delivery capacity',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L02', 
        loopName: 'Household Health Access & Adherence',
        connection: 'service availability → access patterns',
        description: 'Health service capacity affects household access',
        strength: 'strong'
      }
    ],
    'atlas-MES-L05': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L04', 
        loopName: 'Housing–Land Macro Elasticity',
        connection: 'demand pressure → delivery requirements',
        description: 'Housing demand drives delivery system pressure',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L08', 
        loopName: 'Service Level Agreements',
        connection: 'delivery efficiency → affordability',
        description: 'Housing delivery affects household affordability',
        strength: 'medium'
      }
    ],
    'atlas-MIC-L11': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L09', 
        loopName: 'Digital Services Reliability',
        connection: 'service quality → adoption barriers',
        description: 'Digital service performance affects user adoption',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L08', 
        loopName: 'Social Cohesion & National Legitimacy',
        connection: 'digital inclusion → social cohesion',
        description: 'Digital adoption affects social participation',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L06', 
        loopName: 'Service Satisfaction',
        connection: 'digital adoption → service satisfaction',
        description: 'Digital adoption improves service experience',
        strength: 'medium'
      }
    ],
    'atlas-MIC-L12': [
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L07', 
        loopName: 'Legitimacy & Participation Coupler',
        connection: 'transparency → local engagement',
        description: 'National transparency drives local participation',
        strength: 'strong'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L09', 
        loopName: 'Digital Services Reliability',
        connection: 'digital platforms → participation tools',
        description: 'Digital infrastructure enables local participation',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L08', 
        loopName: 'Social Cohesion & National Legitimacy',
        connection: 'local participation → national trust',
        description: 'Local engagement strengthens national legitimacy',
        strength: 'strong'
      }
    ],
    
    // Batch 4+ Other loops
    'atlas-MAC-L05': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L06', 
        loopName: 'External Demand & Competitiveness',
        connection: 'export orderbook → expected profits',
        description: 'Export demand drives investment expectations',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L04', 
        loopName: 'SME Credit Access',
        connection: 'investment climate → SME credit conditions',
        description: 'Capital market conditions affect small business financing',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L05', 
        loopName: 'Working Capital Gaps',
        connection: 'capital availability → working capital stress',
        description: 'Investment cycles affect operational financing',
        strength: 'medium'
      },
      { 
        type: 'stability', 
        loopId: 'atlas-MAC-L03', 
        loopName: 'Price Stability',
        connection: 'overheating → inflation pressure',
        description: 'Capacity overutilization triggers price pressures',
        strength: 'strong'
      }
    ],
    'atlas-MAC-L06': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L03', 
        loopName: 'Sectoral Jobs Match',
        connection: 'trade patterns → sectoral employment demand',
        description: 'Export competitiveness shapes labor market structure',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L04', 
        loopName: 'Employment Transitions',
        connection: 'trade shocks → hiring dynamics',
        description: 'External demand shifts affect employment patterns',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L03', 
        loopName: 'Price Stability',
        connection: 'import prices → domestic price level',
        description: 'Trade terms affect domestic inflation',
        strength: 'strong'
      }
    ],
    'atlas-MAC-L07': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L08', 
        loopName: 'Water Security',
        connection: 'resource constraints → water availability',
        description: 'Environmental limits constrain water resources',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L05', 
        loopName: 'Housing Affordability',
        connection: 'environmental costs → housing stage costs',
        description: 'Environmental compliance affects construction costs',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L01', 
        loopName: 'Household Hardship',
        connection: 'resource stress → cost of living',
        description: 'Environmental pressures increase living costs',
        strength: 'medium'
      }
    ],
    'atlas-MAC-L08': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L10', 
        loopName: 'Regulatory Compliance',
        connection: 'trust levels → compliance behavior',
        description: 'Social trust affects regulatory adherence',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L12', 
        loopName: 'Local Participation',
        connection: 'legitimacy → civic engagement',
        description: 'National legitimacy drives local participation',
        strength: 'strong'
      },
      { 
        type: 'coupler', 
        loopId: 'atlas-META-L07', 
        loopName: 'Transparency & Participation',
        connection: 'transparency → participatory sprints',
        description: 'Social cohesion couples with transparency mechanisms',
        strength: 'strong'
      }
    ],
    'atlas-MAC-L09': [
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L08', 
        loopName: 'Early Warning System',
        connection: 'threat detection → resilience activation',
        description: 'Early warning triggers resilience mechanisms',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L01', 
        loopName: 'Health System Surge',
        connection: 'crisis response → health capacity',
        description: 'System shocks require health system scaling',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L06', 
        loopName: 'Transport Throughput',
        connection: 'emergency response → transport prioritization',
        description: 'Crisis response affects transport allocation',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L07', 
        loopName: 'Energy Supply Adequacy',
        connection: 'shock response → energy prioritization',
        description: 'Resilience measures affect energy distribution',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L09', 
        loopName: 'Digital Services Reliability',
        connection: 'crisis mode → service prioritization',
        description: 'Emergency response affects digital service priorities',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L07', 
        loopName: 'Price Stabilization',
        connection: 'shock response → price controls',
        description: 'Resilience measures include price interventions',
        strength: 'medium'
      }
    ],
    'atlas-MAC-L10': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L02', 
        loopName: 'Labor Market Balance',
        connection: 'human capital → labor productivity',
        description: 'Education and health outcomes drive labor market performance',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L02', 
        loopName: 'Teacher Pipeline',
        connection: 'education quality → teaching profession',
        description: 'Education system quality affects teacher supply',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L01', 
        loopName: 'Health Access',
        connection: 'health outcomes → system demand',
        description: 'Population health status drives healthcare demand',
        strength: 'strong'
      }
    ],
    'atlas-MES-L06': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L07', 
        loopName: 'Local Price Dynamics',
        connection: 'logistics costs → local prices',
        description: 'Transport costs directly affect local market prices',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L08', 
        loopName: 'Service Level Agreements',
        connection: 'transport reliability → service delivery',
        description: 'Transport performance affects service commitments',
        strength: 'medium'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L02', 
        loopName: 'Demand Management',
        connection: 'demand patterns → capacity planning',
        description: 'Transport demand management affects capacity needs',
        strength: 'medium'
      }
    ],
    'atlas-MES-L07': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L03', 
        loopName: 'Price Stability',
        connection: 'energy costs → inflation',
        description: 'Energy supply costs feed into general price level',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L12', 
        loopName: 'Service Delivery Variance',
        connection: 'power reliability → service quality',
        description: 'Energy reliability affects overall service delivery',
        strength: 'medium'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L07', 
        loopName: 'Resource Load & Ecological Ceiling',
        connection: 'energy production → environmental impact',
        description: 'Energy generation contributes to resource consumption',
        strength: 'strong'
      }
    ],
    'atlas-MES-L08': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L07', 
        loopName: 'Resource Load & Ecological Ceiling',
        connection: 'resource limits → water availability',
        description: 'Environmental constraints affect water supply',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L05', 
        loopName: 'Housing Stage Costs',
        connection: 'water costs → housing development',
        description: 'Water infrastructure costs affect housing development',
        strength: 'medium'
      }
    ],
    'atlas-MES-L09': [
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L11', 
        loopName: 'Habit Formation & Adoption',
        connection: 'service quality → user habits',
        description: 'Digital service reliability affects user adoption patterns',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L06', 
        loopName: 'Ticket & SLA Management',
        connection: 'service performance → support load',
        description: 'Service reliability affects support ticket volume',
        strength: 'medium'
      },
      { 
        type: 'upstream', 
        loopId: 'atlas-META-L04', 
        loopName: 'Platform Standards & SSO',
        connection: 'platform standards → service delivery',
        description: 'Platform standardization affects service reliability',
        strength: 'medium'
      }
    ],

    // Batch 2 - Meso Systems & Micro Foundations  
    'atlas-MES-L02': [
      { type: 'upstream', loopId: 'atlas-MAC-L10', loopName: 'Human Capital Regime', connection: 'education policy → teacher supply', strength: 'strong' },
      { type: 'upstream', loopId: 'atlas-MES-L10', loopName: 'Policy Implementation Latency', connection: 'policy delays → resource allocation', strength: 'medium' },
      { type: 'downstream', loopId: 'atlas-MIC-L03', loopName: 'School Attendance & Learning Effort', connection: 'teacher availability → learning outcomes', strength: 'strong' }
    ],
    'atlas-MES-L03': [
      { type: 'upstream', loopId: 'atlas-MAC-L06', loopName: 'External Demand & Competitiveness', connection: 'trade demand → sectoral employment', strength: 'strong' },
      { type: 'downstream', loopId: 'atlas-MIC-L04', loopName: 'Firm Hiring & Attrition', connection: 'skills matching → hiring success', strength: 'strong' }
    ],
    // Batch 2 loops - converted to CascadeHook[] format
    'atlas-MES-L04': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L05', 
        loopName: 'Capital Accumulation & Investment Cycle',
        connection: 'investment climate → SME credit conditions',
        description: 'Capital market conditions affect small business financing',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L05', 
        loopName: 'Firm Working Capital & Delayed Payments',
        connection: 'credit access → working capital stress',
        description: 'SME credit conditions affect operational financing',
        strength: 'strong'
      }
    ],
    'atlas-MES-L10': [
      { 
        type: 'upstream', 
        loopId: 'META-L03', 
        loopName: 'Policy Design & Iteration',
        connection: 'policy design → implementation latency',
        description: 'Policy complexity affects implementation speed',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L11', 
        loopName: 'Interministerial Coordination',
        connection: 'implementation delays → coordination needs',
        description: 'Implementation latency requires coordination',
        strength: 'medium'
      }
    ],
    'atlas-MES-L11': [
      { 
        type: 'upstream', 
        loopId: 'META-L03', 
        loopName: 'Policy Design & Iteration',
        connection: 'policy coordination → spillover management',
        description: 'Cross-cutting policies require coordination',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MES-L12', 
        loopName: 'Procurement & Delivery Fidelity',
        connection: 'coordination quality → delivery performance',
        description: 'Coordination affects procurement outcomes',
        strength: 'medium'
      }
    ],
    'atlas-MES-L12': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L11', 
        loopName: 'Interministerial Coordination',
        connection: 'coordination → procurement performance',
        description: 'Coordination quality affects delivery',
        strength: 'medium'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L03', 
        loopName: 'Price–Quantity Stability',
        connection: 'procurement variance → price effects',
        description: 'Delivery issues can affect price stability',
        strength: 'weak'
      }
    ],
    'atlas-MIC-L01': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MAC-L03', 
        loopName: 'Price–Quantity Stability',
        connection: 'inflation → household budgets',
        description: 'Price changes affect household finances',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MIC-L07', 
        loopName: 'Price Adjustment to Local Shortages',
        connection: 'household demand → local prices',
        description: 'Household consumption affects local markets',
        strength: 'medium'
      }
    ],
    'atlas-MIC-L02': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L01', 
        loopName: 'Health Access & Service Delivery',
        connection: 'health access → health outcomes',
        description: 'Service availability affects health adherence',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L10', 
        loopName: 'Human Capital Regime',
        connection: 'health outcomes → human capital',
        description: 'Health status affects human capital formation',
        strength: 'medium'
      }
    ],
    'atlas-MIC-L03': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L02', 
        loopName: 'Teacher Pipeline & Classroom Throughput',
        connection: 'teacher availability → learning outcomes',
        description: 'Teacher supply affects educational quality',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L10', 
        loopName: 'Human Capital Regime',
        connection: 'learning outcomes → human capital',
        description: 'Educational attainment builds human capital',
        strength: 'strong'
      }
    ],
    'atlas-MIC-L04': [
      { 
        type: 'upstream', 
        loopId: 'atlas-MES-L03', 
        loopName: 'Skills–Jobs Matching',
        connection: 'skills matching → hiring success',
        description: 'Skills alignment affects recruitment outcomes',
        strength: 'strong'
      },
      { 
        type: 'downstream', 
        loopId: 'atlas-MAC-L02', 
        loopName: 'Labor Market Macro Balance',
        connection: 'hiring patterns → labor market balance',
        description: 'Firm hiring affects overall labor dynamics',
        strength: 'medium'
      }
    ]
  };

  return cascadeData[loopId] || [];
};

const getConnectionIcon = (type: string) => {
  switch (type) {
    case 'upstream': return <ArrowLeft className="w-4 h-4" />;
    case 'downstream': return <ArrowRight className="w-4 h-4" />;
    case 'stability': return <Link2 className="w-4 h-4" />;
    case 'coupler': return <GitBranch className="w-4 h-4" />;
    default: return <GitBranch className="w-4 h-4" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'upstream': return 'secondary';
    case 'downstream': return 'default';
    case 'stability': return 'outline';
    case 'coupler': return 'destructive';
    default: return 'outline';
  }
};

const getStrengthColor = (strength?: string) => {
  switch (strength) {
    case 'strong': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'weak': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
};

const CascadeCard: React.FC<{ cascade: CascadeHook }> = ({ cascade }) => {
  const { type, loopId, loopName, connection, description, strength } = cascade;

  return (
    <Card className="glass-secondary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {getConnectionIcon(type)}
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{loopName}</h4>
              <div className="text-xs text-muted-foreground font-mono">{loopId}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getTypeColor(type)} className="text-xs capitalize">
              {type}
            </Badge>
            {strength && (
              <div className={`text-xs font-medium ${getStrengthColor(strength)}`}>
                {strength}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-foreground">
            {connection}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CascadesTab: React.FC<CascadesTabProps> = ({ loop }) => {
  const cascades = getCascadesForLoop(loop.id);
  const upstreamCascades = cascades.filter(c => c.type === 'upstream');
  const downstreamCascades = cascades.filter(c => c.type === 'downstream');
  const stabilityCascades = cascades.filter(c => c.type === 'stability');
  const couplerCascades = cascades.filter(c => c.type === 'coupler');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="glass-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Cascade Hooks
            </CardTitle>
            <Badge variant="secondary">
              {cascades.length} Connections
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cascade hooks define how this loop connects to and influences other loops in the system.
            These connections enable coordinated responses and system-wide optimization.
          </p>
        </CardContent>
      </Card>

      {cascades.length > 0 ? (
        <div className="space-y-6">
          {/* Upstream Dependencies */}
          {upstreamCascades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                Upstream Dependencies ({upstreamCascades.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {upstreamCascades.map((cascade, index) => (
                  <CascadeCard key={index} cascade={cascade} />
                ))}
              </div>
            </div>
          )}

          {/* Downstream Effects */}
          {downstreamCascades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                Downstream Effects ({downstreamCascades.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {downstreamCascades.map((cascade, index) => (
                  <CascadeCard key={index} cascade={cascade} />
                ))}
              </div>
            </div>
          )}

          {/* Stability Links */}
          {stabilityCascades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-muted-foreground" />
                Stability Links ({stabilityCascades.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {stabilityCascades.map((cascade, index) => (
                  <CascadeCard key={index} cascade={cascade} />
                ))}
              </div>
            </div>
          )}

          {/* Coupler Links */}
          {couplerCascades.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-muted-foreground" />
                Coupler Links ({couplerCascades.length})
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {couplerCascades.map((cascade, index) => (
                  <CascadeCard key={index} cascade={cascade} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No cascade hooks defined for this loop yet. Configure upstream, downstream, and stability connections to integrate this loop with the broader system.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Connection Summary */}
      {cascades.length > 0 && (
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-sm">Connection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{upstreamCascades.length}</div>
                <div className="text-muted-foreground">Upstream</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{downstreamCascades.length}</div>
                <div className="text-muted-foreground">Downstream</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{stabilityCascades.length}</div>
                <div className="text-muted-foreground">Stability</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{couplerCascades.length}</div>
                <div className="text-muted-foreground">Couplers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default CascadesTab;