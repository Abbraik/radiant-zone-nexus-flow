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
    'atlas-MES-L04': {
      upstream: [
        { id: 'atlas-MAC-L05', name: 'Capital Accumulation & Investment Cycle', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MIC-L05', name: 'Firm Working Capital & Delayed Payments', influence: 'strong', status: 'stable' }
      ]
    },
    'atlas-MES-L10': {
      upstream: [
        { id: 'META-L03', name: 'Policy Design & Iteration', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MES-L11', name: 'Interministerial Coordination', influence: 'medium', status: 'stable' }
      ]
    },
    'atlas-MES-L11': {
      upstream: [
        { id: 'META-L03', name: 'Policy Design & Iteration', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MES-L12', name: 'Procurement & Delivery Fidelity', influence: 'medium', status: 'stable' }
      ]
    },
    'atlas-MES-L12': {
      upstream: [
        { id: 'atlas-MES-L11', name: 'Interministerial Coordination', influence: 'medium', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MAC-L03', name: 'Price–Quantity Stability', influence: 'weak', status: 'stable' }
      ]
    },
    'atlas-MIC-L01': {
      upstream: [
        { id: 'atlas-MAC-L03', name: 'Price–Quantity Stability', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MIC-L07', name: 'Price Adjustment to Local Shortages', influence: 'medium', status: 'stable' }
      ]
    },
    'atlas-MIC-L02': {
      upstream: [
        { id: 'atlas-MES-L01', name: 'Health Access & Service Delivery', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MAC-L10', name: 'Human Capital Regime', influence: 'medium', status: 'stable' }
      ]
    },
    'atlas-MIC-L03': {
      upstream: [
        { id: 'atlas-MES-L02', name: 'Teacher Pipeline & Classroom Throughput', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MAC-L10', name: 'Human Capital Regime', influence: 'strong', status: 'stable' }
      ]
    },
    'atlas-MIC-L04': {
      upstream: [
        { id: 'atlas-MES-L03', name: 'Skills–Jobs Matching', influence: 'strong', status: 'stable' }
      ],
      downstream: [
        { id: 'atlas-MAC-L02', name: 'Labor Market Macro Balance', influence: 'medium', status: 'stable' }
      ]
    }
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