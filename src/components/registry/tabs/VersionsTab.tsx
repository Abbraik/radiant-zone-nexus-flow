import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GitBranch, Calendar, User, FileText, Tag, Info } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';
import { formatDistanceToNow } from 'date-fns';

interface VersionsTabProps {
  loop: LoopData;
}

interface VersionInfo {
  version: string;
  date: string;
  seedSource?: string;
  changes: string[];
  author?: string;
  notes?: string;
  isCurrent?: boolean;
  description?: string;
  status?: string;
}

// Sample data mapping - in production this would come from the loop metadata
const getVersionsForLoop = (loopId: string): VersionInfo[] => {
  const versionData: Record<string, VersionInfo[]> = {
    // Batch 5 - META System Controls & Macro-Meso-Micro Loops
    'atlas-META-L01': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Supervisory band & weight tuner seeded.',
        changes: ['Initial band management system', 'Weight tuning algorithms', 'Trust-latency constraint monitoring'],
        author: 'Meta-Control Systems Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-META-L02': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'PID/MPC/Rule family switching enabled.',
        changes: ['Controller arbitration framework', 'Multi-algorithm switching', 'Retuning automation'],
        author: 'Control Systems Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-META-L03': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Escalation ladder routing live.',
        changes: ['N→P→S escalation framework', 'Authority provisioning', 'Sprint ladder integration'],
        author: 'Governance Systems Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-META-L04': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Standards registry & API contracts enforced.',
        changes: ['Data integrity standards', 'API contract enforcement', 'Schema versioning system'],
        author: 'Data Architecture Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MAC-L01': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Long-horizon cohort tracking enabled.',
        changes: ['Demographic regime monitoring', 'Support ratio tracking', 'Cohort projection models', 'Migration flow analysis'],
        author: 'Demographic Analysis Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MAC-L02': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Sector pact & recognition toggles wired.',
        changes: ['Labor market balance monitoring', 'Skills matching framework', 'Wage drift detection', 'ISCO mapping system'],
        author: 'Labor Market Analytics Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MAC-L03': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Fiscal–monetary coordination & indexation rules parameterized.',
        changes: ['Price stability monitoring', 'Output gap tracking', 'Expectations management', 'SVAR counterfactual system'],
        author: 'Macroeconomic Policy Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MAC-L04': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'One-stop approvals and digital cadaster integration points defined.',
        changes: ['Housing-land elasticity monitoring', 'Approvals throughput tracking', 'Formation lag analysis', 'Digital cadaster integration'],
        author: 'Housing & Land Policy Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MES-L01': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Staffing & purchasing model levers active.',
        changes: ['Health capacity modeling', 'Wait time optimization', 'Coverage tracking', 'Staffing allocation algorithms'],
        author: 'Health Systems Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MES-L05': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Stage telemetry enabled; one-stop control toggles wired.',
        changes: ['Housing delivery pipeline tracking', 'Stage conversion monitoring', 'Cost analysis system', 'One-stop approvals integration'],
        author: 'Housing Delivery Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MIC-L11': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Assisted channels & onboarding kits enabled.',
        changes: ['Digital adoption tracking', 'Funnel analysis system', 'Assisted service channels', 'Onboarding optimization'],
        author: 'Digital Inclusion Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    'atlas-MIC-L12': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Micro-grants & community support flows active.',
        changes: ['Local participation tracking', 'Trust measurement system', 'Co-production capacity monitoring', 'Community support infrastructure'],
        author: 'Community Engagement Team',
        status: 'stable',
        isCurrent: true
      }
    ],
    
    // Other batches
    'atlas-MAC-L05': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'NCF–PAGS',
        changes: [
          'Seeded from NCF–PAGS baseline model',
          'Added overheating guardrails for capacity utilization',
          'Implemented alpha smoothing for indicators',
          'Configured DE-bands for all key metrics'
        ],
        author: 'PAGS Team',
        notes: 'Initial version with overheating protection mechanisms',
        isCurrent: true
      }
    ],
    'atlas-MAC-L06': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Trade Model v3.2',
        changes: [
          'Added pre-emptive export-promotion bundle links',
          'Implemented REER deviation monitoring',
          'Configured orderbook tracking system',
          'Set up global demand shock detection'
        ],
        author: 'Trade Policy Team',
        notes: 'Focuses on external competitiveness and trade dynamics',
        isCurrent: true
      }
    ],
    'atlas-MAC-L07': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Environmental Impact Model',
        changes: [
          'Aligned MRV standards with META-L04',
          'Implemented ecological ceiling monitoring',
          'Added biodiversity, water, and energy sub-indices',
          'Configured resource load tracking'
        ],
        author: 'Environmental Team',
        notes: 'Comprehensive environmental monitoring and sustainability tracking',
        isCurrent: true
      }
    ],
    'atlas-MAC-L08': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Social Cohesion Index v2.1',
        changes: [
          'Added congruence gap metric for META-L07 trigger',
          'Implemented trust and participation tracking',
          'Configured perceived fairness monitoring',
          'Set up transparency pack publishing'
        ],
        author: 'Social Policy Team',
        notes: 'Social cohesion and legitimacy measurement system',
        isCurrent: true
      }
    ],
    'atlas-MAC-L09': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Resilience Framework v4.0',
        changes: [
          'Linked contingency playbooks and reserve governance',
          'Implemented buffer adequacy monitoring',
          'Added response latency tracking',
          'Configured recovery half-life measurement'
        ],
        author: 'Emergency Management Team',
        notes: 'Macro-level shock absorption and resilience system',
        isCurrent: true
      }
    ],
    'atlas-MAC-L10': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Human Capital Model v2.3',
        changes: [
          'Activated cohort tracking system',
          'Implemented long horizon alerts to Annex G',
          'Added health and learning stock monitoring',
          'Configured productivity tracking'
        ],
        author: 'Human Development Team',
        notes: 'Long-term human capital development tracking with cohort analysis',
        isCurrent: true
      }
    ],
    'atlas-MES-L06': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Transport System Model',
        changes: [
          'Added incident telemetry system',
          'Implemented bus-lane toggle functionality',
          'Configured congestion monitoring',
          'Set up travel time reliability tracking'
        ],
        author: 'Transport Planning Team',
        notes: 'Real-time transport network monitoring and management',
        isCurrent: true
      }
    ],
    'atlas-MES-L07': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Energy Grid Model v3.1',
        changes: [
          'Implemented peak-season guardrails',
          'Added contingency procurement slider',
          'Configured SAIDI/SAIFI monitoring',
          'Set up reserve margin tracking'
        ],
        author: 'Energy Systems Team',
        notes: 'Grid reliability and energy security monitoring with seasonal adjustments',
        isCurrent: true
      }
    ],
    'atlas-MES-L08': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Water Management System',
        changes: [
          'Activated NRW decay curve tracking',
          'Implemented stress index monitoring',
          'Added reuse and uptake tracking',
          'Configured DMA audit logging'
        ],
        author: 'Water Management Team',
        notes: 'Water security and loss control with advanced analytics',
        isCurrent: true
      }
    ],
    'atlas-MES-L09': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        seedSource: 'Digital Services Platform',
        changes: [
          'Wired canary deploy and A/B testing hooks',
          'Implemented uptime and error rate monitoring',
          'Added adoption funnel instrumentation',
          'Configured NPS tracking'
        ],
        author: 'Digital Services Team',
        notes: 'Digital service reliability and user experience monitoring',
        isCurrent: true
      }
    ],

    // Batch 2 - Meso Systems & Micro Foundations
    'atlas-MES-L02': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Seeded from NCF–PAGS; workload model live with automated roster reconciliation.',
        changes: ['Initial teacher pipeline tracking', 'Workload model integration', 'Attrition segmentation by subject'],
        author: 'Education Systems Team',
        status: 'stable'
      }
    ],
    'atlas-MES-L03': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Sector pacts enabled with ISCO mapping and placement deduplication.',
        changes: ['Sectoral matching framework', 'ISCO occupation mapping', 'A/B testing for intermediation'],
        author: 'Labor Market Analytics Team',
        status: 'stable'
      }
    ],
    'atlas-MES-L04': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Guarantee & factoring rails linked with real-time bank feed integration.',
        changes: ['Credit guarantee integration', 'Factoring platform connectivity', 'Real-time DSO monitoring'],
        author: 'SME Finance Team',
        status: 'stable'
      }
    ],
    'atlas-MES-L10': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'PMO gate reviews active with automated critical path generation.',
        changes: ['RACI matrix automation', 'Critical path optimization', 'Rework root-cause tracking'],
        author: 'Policy Implementation Office',
        status: 'stable'
      }
    ],
    'atlas-MES-L11': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Escalation council routing set with cross-agency dependency tracking.',
        changes: ['SNA network analysis', 'Conflict resolution workflows', 'Joint KPI framework'],
        author: 'Coordination Office',
        status: 'stable'
      }
    ],
    'atlas-MES-L12': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'PBC templates & open-books wired with supplier risk heatmap.',
        changes: ['Performance-based contracting', 'Open-book audit automation', 'Supplier risk monitoring'],
        author: 'Procurement Excellence Team',
        status: 'stable'
      }
    ],
    'atlas-MIC-L01': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Targeting rules synced with social registry and micro-simulation capability.',
        changes: ['Social registry integration', 'CPI shock modeling', 'Transfer targeting optimization'],
        author: 'Social Protection Team',
        status: 'stable'
      }
    ],
    'atlas-MIC-L02': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Mobile care & copay caps gated by triggers with reminder nudge system.',
        changes: ['EHR-claims integration', 'Mobile care deployment', 'Adherence nudge system'],
        author: 'Digital Health Team',
        status: 'stable'
      }
    ],
    'atlas-MIC-L03': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Attendance nudge packs parameterized with meal/tutoring program linkage.',
        changes: ['Daily attendance tracking', 'Nudge system optimization', 'Support program integration'],
        author: 'Education Support Team',
        status: 'stable'
      }
    ],
    'atlas-MIC-L04': [
      {
        version: 'v1.0',
        date: '2025-08-20',
        description: 'Matching incentives & onboarding kits toggled with diversity guardrails.',
        changes: ['ATS integration', 'Diversity monitoring', 'Attrition root-cause analysis'],
        author: 'HR Analytics Team',
        status: 'stable'
      }
    ]
  };

  return versionData[loopId] || [];
};

const VersionCard: React.FC<{ version: VersionInfo }> = ({ version }) => {
  const { version: versionNumber, date, seedSource, changes, author, notes, isCurrent } = version;

  return (
    <Card className={`glass-secondary ${isCurrent ? 'border-primary/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium text-foreground">{versionNumber}</h4>
            {isCurrent && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </div>
        </div>

        {seedSource && (
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Seed Source</div>
            <div className="flex items-center gap-1 text-sm text-foreground">
              <Tag className="w-3 h-3" />
              {seedSource}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Changes</div>
            <ul className="text-sm text-foreground space-y-1">
              {changes.map((change, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>

          {notes && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">Notes</div>
              <p className="text-sm text-muted-foreground">{notes}</p>
            </div>
          )}

          {author && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-muted/20">
              <User className="w-3 h-3" />
              <span>by {author}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const VersionsTab: React.FC<VersionsTabProps> = ({ loop }) => {
  const versions = getVersionsForLoop(loop.id);
  const currentVersion = versions.find(v => v.isCurrent);

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
              Version Seed & History
            </CardTitle>
            <Badge variant="secondary">
              {versions.length} Version{versions.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Version history tracks the evolution of this loop, including its seed source, 
            major changes, and development milestones.
          </p>
        </CardContent>
      </Card>

      {/* Current Version Highlight */}
      {currentVersion && (
        <Card className="glass-secondary border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Current Version: {currentVersion.version}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Release Date</label>
                <div className="text-foreground">{currentVersion.date}</div>
              </div>
              {currentVersion.seedSource && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seed Source</label>
                  <div className="text-foreground">{currentVersion.seedSource}</div>
                </div>
              )}
            </div>
            {currentVersion.notes && (
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1">{currentVersion.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      {versions.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Version History
          </h3>
          <div className="space-y-4">
            {versions.map((version, index) => (
              <VersionCard key={index} version={version} />
            ))}
          </div>
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No version history available for this loop yet. Version information will appear here as the loop evolves.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Seed Information */}
      {currentVersion?.seedSource && (
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-sm">Seed Source Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>
                This loop was seeded from <strong>{currentVersion.seedSource}</strong>, 
                providing the foundational structure and parameters. The seed source ensures 
                consistency with established models and methodologies.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default VersionsTab;