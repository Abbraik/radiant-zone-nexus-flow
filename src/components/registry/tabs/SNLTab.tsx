import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2, Database, RefreshCw, Link, Info, AlertCircle } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface SNLTabProps {
  loop: LoopData;
}

interface SharedNode {
  id?: string;
  name?: string;
  label?: string;
  type?: 'stock' | 'flow' | 'auxiliary' | 'indicator' | 'state';
  domain?: string;
  descriptor?: string;
  sharedWith?: string[];
  syncStatus?: 'synced' | 'out-of-sync' | 'pending';
  status?: string;
  lastSync?: string;
  lastUpdated?: string;
  usage?: number;
  description?: string;
  connections?: number;
}

// Sample data mapping - in production this would come from the loop metadata
const getSharedNodesForLoop = (loopId: string): SharedNode[] => {
  const snlData: Record<string, SharedNode[]> = {
    // Batch 4 - META System Controls & Health Access
    'atlas-META-L01': [
      { name: 'Society.Trust', type: 'state', description: 'Public trust in institutions and systems', connections: 3, status: 'stable' },
      { name: 'Institutions.DecisionLatency', type: 'state', description: 'Time required for institutional decision-making processes', connections: 2, status: 'stable' }
    ],
    'atlas-META-L02': [
      { name: 'Institutions.CapacityIndex', type: 'state', description: 'Aggregate measure of institutional operational capacity', connections: 4, status: 'stable' }
    ],
    'atlas-META-L03': [
      { name: 'Institutions.Authority', type: 'state', description: 'Institutional authority and decision-making power', connections: 3, status: 'stable' },
      { name: 'Budget', type: 'flow', description: 'Financial resources available for operations', connections: 5, status: 'stable' },
      { name: 'Backlog', type: 'stock', description: 'Accumulated pending tasks and decisions', connections: 2, status: 'increasing' }
    ],
    'atlas-META-L04': [
      { name: 'Institutions.DataInteroperability', type: 'state', description: 'Ability of systems to exchange and use data effectively', connections: 6, status: 'improving' },
      { name: 'Services.Latency', type: 'state', description: 'Response time characteristics of system services', connections: 4, status: 'stable' }
    ],
    'atlas-META-L05': [
      { name: 'Institutions.Guardrails', type: 'state', description: 'Automated safeguards and operational limits', connections: 3, status: 'stable' }
    ],
    'atlas-META-L06': [
      { name: 'Institutions.LegalProcess', type: 'state', description: 'Legal framework and process efficiency', connections: 2, status: 'stable' },
      { name: 'Institutions.Authority', type: 'state', description: 'Institutional authority and decision-making power', connections: 3, status: 'stable' }
    ],
    'atlas-META-L07': [
      { name: 'Society.Trust', type: 'state', description: 'Public trust in institutions and systems', connections: 5, status: 'stable' },
      { name: 'Society.Participation', type: 'state', description: 'Level of public engagement in governance processes', connections: 4, status: 'stable' },
      { name: 'PerceivedLegitimacy', type: 'state', description: 'Public perception of institutional legitimacy', connections: 3, status: 'stable' }
    ],
    'atlas-META-L08': [
      { name: 'Environment.Risk', type: 'state', description: 'Environmental risk factors and threat levels', connections: 3, status: 'monitored' },
      { name: 'SupplyChainRisk', type: 'state', description: 'Supply chain vulnerability and disruption risk', connections: 4, status: 'monitored' },
      { name: 'GeopoliticsRisk', type: 'state', description: 'Geopolitical tensions and stability risks', connections: 2, status: 'monitored' }
    ],
    'atlas-MES-L01': [
      { name: 'Services.Capacity.Health', type: 'stock', description: 'Healthcare system service delivery capacity', connections: 5, status: 'expanding' },
      { name: 'QueueLength', type: 'stock', description: 'Number of people waiting for healthcare services', connections: 3, status: 'decreasing' },
      { name: 'Coverage', type: 'state', description: 'Population coverage of healthcare services', connections: 4, status: 'improving' },
      { name: 'Latency', type: 'state', description: 'Healthcare service response and wait times', connections: 3, status: 'stable' }
    ],
    'atlas-MIC-L10': [
      { name: 'PerceivedLegitimacy', type: 'state', description: 'Public perception of institutional legitimacy', connections: 4, status: 'stable' },
      { name: 'EnforcementVisibility', type: 'state', description: 'Public awareness of fair enforcement actions', connections: 2, status: 'improving' },
      { name: 'Norms', type: 'state', description: 'Social norms and expectations around compliance', connections: 3, status: 'stable' }
    ],

    'atlas-MAC-L05': [
      { 
        name: 'Firms.CapitalStock', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L02', 'atlas-MES-L03'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Total productive capital stock of firms in the economy'
      },
      { 
        name: 'CapacityUtilization', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L02', 'atlas-MAC-L03'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Current utilization rate of productive capacity'
      },
      { 
        name: 'ExpectedProfit', 
        type: 'auxiliary', 
        sharedWith: ['atlas-MAC-L06', 'atlas-MES-L04'], 
        syncStatus: 'out-of-sync', 
        lastSync: '6 hours ago',
        description: 'Forward-looking profit expectations driving investment decisions'
      }
    ],
    'atlas-MAC-L06': [
      { 
        name: 'ExternalDemand', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L02'], 
        syncStatus: 'synced', 
        lastSync: '30 minutes ago',
        description: 'Aggregate external demand for domestic products'
      },
      { 
        name: 'REER', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L03'], 
        syncStatus: 'synced', 
        lastSync: '45 minutes ago',
        description: 'Real Effective Exchange Rate measure'
      },
      { 
        name: 'TradablesCapacity', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L03'], 
        syncStatus: 'pending', 
        description: 'Production capacity in tradeable sectors'
      }
    ],
    'atlas-MAC-L07': [
      { 
        name: 'Environment.Quality', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L08', 'atlas-MIC-L01'], 
        syncStatus: 'synced', 
        lastSync: '3 hours ago',
        description: 'Overall environmental quality index'
      },
      { 
        name: 'ResourceUse', 
        type: 'flow', 
        sharedWith: ['atlas-MES-L05', 'atlas-MES-L08'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Rate of natural resource consumption'
      },
      { 
        name: 'Emissions', 
        type: 'flow', 
        sharedWith: ['atlas-MAC-L03'], 
        syncStatus: 'out-of-sync', 
        lastSync: '8 hours ago',
        description: 'Greenhouse gas emissions flow'
      }
    ],
    'atlas-MAC-L08': [
      { 
        name: 'Society.Trust', 
        type: 'stock', 
        sharedWith: ['atlas-MIC-L10', 'atlas-MIC-L12'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Social trust levels in institutions and society'
      },
      { 
        name: 'Society.Participation', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L12'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Level of civic and political participation'
      },
      { 
        name: 'PerceivedFairness', 
        type: 'auxiliary', 
        sharedWith: ['atlas-MIC-L10'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Public perception of fairness in institutions and policies'
      }
    ],
    'atlas-MAC-L09': [
      { 
        name: 'Buffers', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L07', 'atlas-MES-L08'], 
        syncStatus: 'synced', 
        lastSync: '4 hours ago',
        description: 'Strategic reserves and buffers for crisis response'
      },
      { 
        name: 'ResponseLatency', 
        type: 'indicator', 
        sharedWith: ['atlas-MES-L11'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Time delay in system response to shocks'
      }
    ],
    'atlas-MAC-L10': [
      { 
        name: 'HealthStock', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L01'], 
        syncStatus: 'synced', 
        lastSync: '6 hours ago',
        description: 'Population health capital stock'
      },
      { 
        name: 'LearningStock', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L02'], 
        syncStatus: 'synced', 
        lastSync: '12 hours ago',
        description: 'Population learning and knowledge capital'
      },
      { 
        name: 'Participation', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L08'], 
        syncStatus: 'out-of-sync', 
        lastSync: '1 day ago',
        description: 'Participation in education and health systems'
      }
    ],
    'atlas-MES-L06': [
      { 
        name: 'NetworkCapacity', 
        type: 'stock', 
        sharedWith: ['atlas-MES-L07'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Transport network infrastructure capacity'
      },
      { 
        name: 'Load', 
        type: 'flow', 
        sharedWith: ['atlas-MES-L07'], 
        syncStatus: 'synced', 
        lastSync: '30 minutes ago',
        description: 'Current load on transport infrastructure'
      },
      { 
        name: 'TravelTimeReliability', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L07'], 
        syncStatus: 'synced', 
        lastSync: '45 minutes ago',
        description: 'Predictability of travel times across the network'
      }
    ],
    'atlas-MES-L07': [
      { 
        name: 'GenCapacity', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L07'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Electrical generation capacity'
      },
      { 
        name: 'ReserveMargin', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L09'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Available generation capacity above peak demand'
      },
      { 
        name: 'OutageRate', 
        type: 'indicator', 
        sharedWith: ['atlas-MES-L12'], 
        syncStatus: 'synced', 
        lastSync: '3 hours ago',
        description: 'Frequency and duration of power outages'
      }
    ],
    'atlas-MES-L08': [
      { 
        name: 'Supply', 
        type: 'stock', 
        sharedWith: ['atlas-MAC-L07'], 
        syncStatus: 'synced', 
        lastSync: '4 hours ago',
        description: 'Available water supply capacity'
      },
      { 
        name: 'Demand', 
        type: 'flow', 
        sharedWith: ['atlas-MES-L05'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'Water demand from all sectors'
      },
      { 
        name: 'NonRevenueWater', 
        type: 'indicator', 
        sharedWith: ['atlas-MES-L12'], 
        syncStatus: 'out-of-sync', 
        lastSync: '1 day ago',
        description: 'Water losses through leakage and theft'
      },
      { 
        name: 'StressIndex', 
        type: 'indicator', 
        sharedWith: ['atlas-MAC-L07'], 
        syncStatus: 'synced', 
        lastSync: '6 hours ago',
        description: 'Water stress ratio relative to sustainable limits'
      }
    ],
    'atlas-MES-L09': [
      { 
        name: 'Uptime', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L06'], 
        syncStatus: 'synced', 
        lastSync: '15 minutes ago',
        description: 'Digital service availability percentage'
      },
      { 
        name: 'ErrorRates', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L06'], 
        syncStatus: 'synced', 
        lastSync: '5 minutes ago',
        description: 'Rate of service errors and failures'
      },
      { 
        name: 'Adoption', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L11'], 
        syncStatus: 'synced', 
        lastSync: '1 hour ago',
        description: 'Digital service adoption rates'
      },
      { 
        name: 'Satisfaction', 
        type: 'indicator', 
        sharedWith: ['atlas-MIC-L11'], 
        syncStatus: 'synced', 
        lastSync: '2 hours ago',
        description: 'User satisfaction with digital services'
      }
    ],

    // Batch 2 - Meso Systems & Micro Foundations
    'atlas-MES-L02': [
      { id: 'edu-teacher-stock', label: 'Edu.TeacherStock', domain: 'social', descriptor: 'Active teacher workforce by subject and region', status: 'active', lastUpdated: '2025-08-20', usage: 95 },
      { id: 'training-intake', label: 'TrainingIntake', domain: 'social', descriptor: 'New teacher training pipeline capacity', status: 'active', lastUpdated: '2025-08-19', usage: 78 },
      { id: 'attrition', label: 'Attrition', domain: 'social', descriptor: 'Teacher departure rates by tenure and subject', status: 'active', lastUpdated: '2025-08-20', usage: 89 },
      { id: 'class-size', label: 'ClassSize', domain: 'social', descriptor: 'Student-teacher ratios by school and subject', status: 'active', lastUpdated: '2025-08-20', usage: 92 }
    ],
    'atlas-MES-L03': [
      { id: 'labor-demand-sectoral', label: 'LaborDemandSectoral', domain: 'resource', descriptor: 'Job vacancies by sector and skill level', status: 'active', lastUpdated: '2025-08-20', usage: 88 },
      { id: 'skills-profile', label: 'SkillsProfile', domain: 'social', descriptor: 'Worker skill distributions and certifications', status: 'active', lastUpdated: '2025-08-19', usage: 82 },
      { id: 'matching-rate', label: 'MatchingRate', domain: 'resource', descriptor: 'Job-seeker placement success rates', status: 'active', lastUpdated: '2025-08-20', usage: 91 }
    ],
    'atlas-MES-L04': [
      { id: 'sme-cashflow', label: 'SME.Cashflow', domain: 'resource', descriptor: 'Small business cash flow positions', status: 'active', lastUpdated: '2025-08-20', usage: 87 },
      { id: 'credit-access', label: 'CreditAccess', domain: 'resource', descriptor: 'SME credit availability and terms', status: 'active', lastUpdated: '2025-08-19', usage: 85 },
      { id: 'default-risk', label: 'DefaultRisk', domain: 'resource', descriptor: 'SME loan default probabilities', status: 'active', lastUpdated: '2025-08-20', usage: 79 },
      { id: 'guarantees', label: 'Guarantees', domain: 'institution', descriptor: 'Government credit guarantee utilization', status: 'active', lastUpdated: '2025-08-18', usage: 73 }
    ],
    'atlas-MES-L10': [
      { id: 'institutions-decision-latency', label: 'Institutions.DecisionLatency', domain: 'institution', descriptor: 'Policy decision implementation timelines', status: 'active', lastUpdated: '2025-08-20', usage: 94 },
      { id: 'backlog', label: 'Backlog', domain: 'institution', descriptor: 'Pending policy items by priority', status: 'active', lastUpdated: '2025-08-20', usage: 88 },
      { id: 'raci', label: 'RACI', domain: 'institution', descriptor: 'Responsibility assignment matrices', status: 'active', lastUpdated: '2025-08-19', usage: 76 }
    ],
    'atlas-MES-L11': [
      { id: 'sna-betweenness', label: 'SNA.Betweenness', domain: 'institution', descriptor: 'Inter-agency coordination network centrality', status: 'active', lastUpdated: '2025-08-20', usage: 83 },
      { id: 'coordination-load', label: 'CoordinationLoad', domain: 'institution', descriptor: 'Cross-ministry collaboration intensity', status: 'active', lastUpdated: '2025-08-20', usage: 91 },
      { id: 'conflict-incidence', label: 'ConflictIncidence', domain: 'institution', descriptor: 'Inter-agency dispute frequency', status: 'active', lastUpdated: '2025-08-19', usage: 67 },
      { id: 'shared-budget', label: 'SharedBudget', domain: 'resource', descriptor: 'Joint funding pool allocations', status: 'active', lastUpdated: '2025-08-18', usage: 71 },
      { id: 'joint-kpi', label: 'JointKPI', domain: 'institution', descriptor: 'Cross-agency performance indicators', status: 'active', lastUpdated: '2025-08-20', usage: 58 }
    ],
    'atlas-MES-L12': [
      { id: 'contract-performance', label: 'ContractPerformance', domain: 'institution', descriptor: 'Public procurement delivery outcomes', status: 'active', lastUpdated: '2025-08-20', usage: 92 },
      { id: 'cost-variance', label: 'CostVariance', domain: 'resource', descriptor: 'Budget vs actual spending deviations', status: 'active', lastUpdated: '2025-08-20', usage: 89 },
      { id: 'schedule-variance', label: 'ScheduleVariance', domain: 'institution', descriptor: 'Project timeline adherence rates', status: 'active', lastUpdated: '2025-08-19', usage: 85 },
      { id: 'disputes', label: 'Disputes', domain: 'institution', descriptor: 'Contract dispute frequency and resolution', status: 'active', lastUpdated: '2025-08-17', usage: 64 }
    ],
    'atlas-MIC-L01': [
      { id: 'hh-income', label: 'HH.Income', domain: 'resource', descriptor: 'Household income distributions and sources', status: 'active', lastUpdated: '2025-08-20', usage: 96 },
      { id: 'prices', label: 'Prices', domain: 'resource', descriptor: 'Consumer price indices by category', status: 'active', lastUpdated: '2025-08-20', usage: 94 },
      { id: 'hh-savings', label: 'HH.Savings', domain: 'resource', descriptor: 'Household savings rates and buffers', status: 'active', lastUpdated: '2025-08-19', usage: 87 },
      { id: 'debt-service', label: 'DebtService', domain: 'resource', descriptor: 'Household debt service ratios', status: 'active', lastUpdated: '2025-08-20', usage: 82 },
      { id: 'buffer-days', label: 'BufferDays', domain: 'resource', descriptor: 'Days of expenses covered by savings', status: 'active', lastUpdated: '2025-08-20', usage: 91 },
      { id: 'transfers', label: 'Transfers', domain: 'institution', descriptor: 'Social transfer payments and targeting', status: 'active', lastUpdated: '2025-08-18', usage: 75 },
      { id: 'hardship-rate', label: 'HardshipRate', domain: 'social', descriptor: 'Proportion of households in financial distress', status: 'active', lastUpdated: '2025-08-20', usage: 88 }
    ],
    'atlas-MIC-L02': [
      { id: 'access-health', label: 'Access.Health', domain: 'social', descriptor: 'Healthcare service accessibility metrics', status: 'active', lastUpdated: '2025-08-20', usage: 93 },
      { id: 'adherence', label: 'Adherence', domain: 'social', descriptor: 'Treatment adherence rates by condition', status: 'active', lastUpdated: '2025-08-19', usage: 86 },
      { id: 'oop-cost', label: 'OOPcost', domain: 'resource', descriptor: 'Out-of-pocket healthcare expenses', status: 'active', lastUpdated: '2025-08-20', usage: 84 },
      { id: 'health-outcomes', label: 'HealthOutcomes', domain: 'social', descriptor: 'Population health indicators and trends', status: 'active', lastUpdated: '2025-08-18', usage: 89 }
    ],
    'atlas-MIC-L03': [
      { id: 'attendance', label: 'Attendance', domain: 'social', descriptor: 'Student attendance rates by school and grade', status: 'active', lastUpdated: '2025-08-20', usage: 97 },
      { id: 'learning-effort', label: 'LearningEffort', domain: 'social', descriptor: 'Student engagement and effort metrics', status: 'active', lastUpdated: '2025-08-19', usage: 81 },
      { id: 'household-support', label: 'HouseholdSupport', domain: 'social', descriptor: 'Family support for student learning', status: 'active', lastUpdated: '2025-08-20', usage: 74 }
    ],
    'atlas-MIC-L04': [
      { id: 'vacancies', label: 'Vacancies', domain: 'resource', descriptor: 'Open job positions by firm and role', status: 'active', lastUpdated: '2025-08-20', usage: 90 },
      { id: 'applications', label: 'Applications', domain: 'resource', descriptor: 'Job application volumes and quality', status: 'active', lastUpdated: '2025-08-20', usage: 88 },
      { id: 'hiring-rate', label: 'HiringRate', domain: 'resource', descriptor: 'Successful hiring rates by sector', status: 'active', lastUpdated: '2025-08-19', usage: 85 },
      { id: 'attrition', label: 'Attrition', domain: 'resource', descriptor: 'Employee departure rates and reasons', status: 'active', lastUpdated: '2025-08-20', usage: 87 }
    ]
  };

  return snlData[loopId] || [];
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'stock': return <Database className="w-4 h-4" />;
    case 'flow': return <Share2 className="w-4 h-4" />;
    case 'auxiliary': return <Link className="w-4 h-4" />;
    case 'indicator': return <RefreshCw className="w-4 h-4" />;
    default: return <Database className="w-4 h-4" />;
  }
};

const getSyncStatusColor = (status: string) => {
  switch (status) {
    case 'synced': return 'text-green-400';
    case 'out-of-sync': return 'text-red-400';
    case 'pending': return 'text-yellow-400';
    default: return 'text-muted-foreground';
  }
};

const getSyncStatusBadge = (status: string) => {
  switch (status) {
    case 'synced': return 'secondary';
    case 'out-of-sync': return 'destructive';
    case 'pending': return 'outline';
    default: return 'outline';
  }
};

const SharedNodeCard: React.FC<{ node: SharedNode }> = ({ node }) => {
  const { name, type, sharedWith, syncStatus, lastSync, description } = node;
  const needsAttention = syncStatus === 'out-of-sync' || syncStatus === 'pending';

  return (
    <Card className={`glass-secondary ${needsAttention ? 'border-yellow-500/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {getNodeIcon(type)}
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{name}</h4>
              <div className="text-xs text-muted-foreground capitalize">{type}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getSyncStatusBadge(syncStatus)} className="text-xs capitalize">
              {syncStatus.replace('-', ' ')}
            </Badge>
            {needsAttention && <AlertCircle className="w-4 h-4 text-yellow-400" />}
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
        )}

        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Shared With</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {sharedWith.map((loopId, index) => (
                <Badge key={index} variant="outline" className="text-xs font-mono">
                  {loopId.replace('atlas-', '')}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${getSyncStatusColor(syncStatus)}`}>
              {syncStatus === 'synced' ? 'In Sync' : 
               syncStatus === 'out-of-sync' ? 'Needs Sync' : 'Sync Pending'}
            </span>
            {lastSync && (
              <span className="text-muted-foreground">
                Last sync: {lastSync}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SNLTab: React.FC<SNLTabProps> = ({ loop }) => {
  const sharedNodes = getSharedNodesForLoop(loop.id);
  const outOfSyncNodes = sharedNodes.filter(n => n.syncStatus === 'out-of-sync');
  const pendingNodes = sharedNodes.filter(n => n.syncStatus === 'pending');

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
              <Share2 className="w-5 h-5" />
              Shared Nodes (SNL)
            </CardTitle>
            <div className="flex items-center gap-2">
              {outOfSyncNodes.length > 0 && (
                <Badge variant="destructive">
                  {outOfSyncNodes.length} Out of Sync
                </Badge>
              )}
              <Badge variant="secondary">
                {sharedNodes.length} Shared
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Shared Node Links (SNL) are system variables that synchronize across multiple loops.
            These nodes ensure consistency and coordination between different system components.
          </p>
        </CardContent>
      </Card>

      {/* Sync status alerts */}
      {(outOfSyncNodes.length > 0 || pendingNodes.length > 0) && (
        <Alert variant={outOfSyncNodes.length > 0 ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {outOfSyncNodes.length > 0 && `${outOfSyncNodes.length} nodes are out of sync and need attention. `}
            {pendingNodes.length > 0 && `${pendingNodes.length} nodes have pending synchronization.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Shared Nodes Grid */}
      {sharedNodes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sharedNodes.map((node, index) => (
            <SharedNodeCard key={index} node={node} />
          ))}
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No shared nodes defined for this loop yet. Configure shared nodes to synchronize variables across multiple loops.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Summary Statistics */}
      {sharedNodes.length > 0 && (
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-sm">Synchronization Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {sharedNodes.filter(n => n.syncStatus === 'synced').length}
                </div>
                <div className="text-muted-foreground">Synced</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {outOfSyncNodes.length}
                </div>
                <div className="text-muted-foreground">Out of Sync</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {pendingNodes.length}
                </div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {new Set(sharedNodes.flatMap(n => n.sharedWith)).size}
                </div>
                <div className="text-muted-foreground">Connected Loops</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SNLTab;