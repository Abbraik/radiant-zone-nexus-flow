import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Clock, Shield, Database, Link2, Info } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface ChecksTabProps {
  loop: LoopData;
}

interface Check {
  category: 'data' | 'configuration' | 'integration' | 'operational';
  name: string;
  description: string;
  status: 'passing' | 'failing' | 'warning' | 'pending';
  details?: string;
  lastRun?: string;
  automated?: boolean;
  value?: string;
  threshold?: string;
  frequency?: string;
}

// Sample data mapping - in production this would come from the loop metadata
const getChecksForLoop = (loopId: string): Check[] => {
  const checksData: Record<string, Check[]> = {
    'atlas-MAC-L05': [
      { 
        category: 'configuration', 
        name: 'Bands present', 
        description: 'DE-bands configured for all indicators',
        status: 'passing', 
        details: 'All 4 indicators have properly configured DE-bands',
        lastRun: '2 hours ago',
        automated: true
      },
      { 
        category: 'operational', 
        name: 'Overheating flag → auto-notify META-L02', 
        description: 'Automatic escalation when capacity utilization exceeds threshold',
        status: 'passing', 
        details: 'Auto-notification system active, last triggered 3 days ago',
        lastRun: '1 hour ago',
        automated: true
      },
      { 
        category: 'integration', 
        name: 'Cascade map to MES-L04 attached', 
        description: 'Downstream cascade connection properly configured',
        status: 'passing', 
        details: 'SME credit cascade link verified',
        lastRun: '6 hours ago',
        automated: true
      },
      { 
        category: 'data', 
        name: 'Data latency < 30d', 
        description: 'All data sources updated within 30 days',
        status: 'passing', 
        details: 'Latest data: 12 days old (capacity utilization)',
        lastRun: '30 minutes ago',
        automated: true
      }
    ],
    'atlas-MAC-L06': [
      { 
        category: 'data', 
        name: 'REER source integrity', 
        description: 'Real Effective Exchange Rate data source validation',
        status: 'passing', 
        details: 'Central bank feed active, no gaps detected',
        lastRun: '1 hour ago',
        automated: true
      },
      { 
        category: 'operational', 
        name: 'Lead/lag with orderbook (Granger flag)', 
        description: 'Statistical relationship between indicators validated',
        status: 'warning', 
        details: 'Granger causality test p-value: 0.08 (borderline significance)',
        lastRun: '1 day ago',
        automated: true
      },
      { 
        category: 'integration', 
        name: 'Escalation to META-L08 if sentinel spikes', 
        description: 'Automatic escalation system for extreme events',
        status: 'passing', 
        details: 'Escalation thresholds configured, system ready',
        lastRun: '4 hours ago',
        automated: true
      }
    ],
    'atlas-MAC-L07': [
      { 
        category: 'data', 
        name: 'MRV completeness ≥ 90%', 
        description: 'Monitoring, Reporting, Verification data completeness',
        status: 'passing', 
        details: 'Current completeness: 94.2%',
        lastRun: '6 hours ago',
        automated: true
      },
      { 
        category: 'operational', 
        name: 'Ratio > 0.9 for 2+ periods → META-L03', 
        description: 'Automatic escalation when ecological ceiling breached',
        status: 'passing', 
        details: 'Current load ratio: 0.82, monitoring active',
        lastRun: '2 hours ago',
        automated: true
      }
    ],
    'atlas-MAC-L08': [
      { 
        category: 'operational', 
        name: 'Event-study window set', 
        description: 'Statistical analysis window properly configured',
        status: 'passing', 
        details: 'Window: 30 days pre/post event',
        lastRun: '1 day ago',
        automated: false
      },
      { 
        category: 'operational', 
        name: 'Congruence gap > 0.3 → publish transparency pack', 
        description: 'Automatic transparency publication trigger',
        status: 'passing', 
        details: 'Current gap: 0.18, system ready',
        lastRun: '3 hours ago',
        automated: true
      }
    ],
    'atlas-MAC-L09': [
      { 
        category: 'operational', 
        name: 'Latency > 5d during shocks → auto-ticket MES-L11', 
        description: 'Automatic coordination escalation during crises',
        status: 'passing', 
        details: 'Current latency: 2.8 days, within threshold',
        lastRun: '1 hour ago',
        automated: true
      },
      { 
        category: 'data', 
        name: 'Buffer accounting reconciled weekly', 
        description: 'Regular reconciliation of reserve buffer data',
        status: 'passing', 
        details: 'Last reconciliation: 2 days ago, balanced',
        lastRun: '2 days ago',
        automated: true
      }
    ],
    'atlas-MAC-L10': [
      { 
        category: 'data', 
        name: 'Longitudinal cohort coverage', 
        description: 'Population cohort tracking data availability',
        status: 'passing', 
        details: 'Coverage: 89% of target cohorts tracked',
        lastRun: '1 week ago',
        automated: false
      },
      { 
        category: 'configuration', 
        name: 'Index methodology fixed', 
        description: 'Standardized calculation methodology in place',
        status: 'passing', 
        details: 'Methodology locked, version 2.3 active',
        lastRun: '1 month ago',
        automated: false
      },
      { 
        category: 'operational', 
        name: 'Mid-year sentinel review logged', 
        description: 'Regular mid-year review process completion',
        status: 'pending', 
        details: 'Next review due in 2 weeks',
        lastRun: 'N/A',
        automated: false
      }
    ],
    'atlas-MES-L06': [
      { 
        category: 'data', 
        name: 'Sensor uptime ≥ 95%', 
        description: 'Transport monitoring sensor availability',
        status: 'passing', 
        details: 'Current uptime: 97.8%',
        lastRun: '15 minutes ago',
        automated: true
      },
      { 
        category: 'configuration', 
        name: 'Corridor-level bands set', 
        description: 'DE-bands configured for each transport corridor',
        status: 'passing', 
        details: 'All 12 corridors have configured bands',
        lastRun: '1 day ago',
        automated: true
      },
      { 
        category: 'operational', 
        name: 'Surge staffing playbook linked', 
        description: 'Emergency response procedures integrated',
        status: 'passing', 
        details: 'Playbook v1.2 linked, tested last month',
        lastRun: '1 month ago',
        automated: false
      }
    ],
    'atlas-MES-L07': [
      { 
        category: 'operational', 
        name: 'Reserve < 15% for 2 periods → META-L03', 
        description: 'Automatic escalation for low energy reserves',
        status: 'warning', 
        details: 'Current reserve: 18.5%, monitoring closely',
        lastRun: '1 hour ago',
        automated: true
      },
      { 
        category: 'data', 
        name: 'Outage QC sample weekly', 
        description: 'Weekly quality control of outage data',
        status: 'passing', 
        details: 'Last QC: 3 days ago, 98.2% accuracy',
        lastRun: '3 days ago',
        automated: true
      }
    ],
    'atlas-MES-L08': [
      { 
        category: 'data', 
        name: 'DMA audits logged', 
        description: 'District Metered Area audit records maintained',
        status: 'passing', 
        details: '24/26 DMAs audited this quarter',
        lastRun: '1 week ago',
        automated: false
      },
      { 
        category: 'configuration', 
        name: 'NRW model fit R² > 0.6', 
        description: 'Non-Revenue Water model statistical validity',
        status: 'passing', 
        details: 'Current R²: 0.73, model performing well',
        lastRun: '2 weeks ago',
        automated: true
      },
      { 
        category: 'operational', 
        name: 'Sentinel drought route to META-L08', 
        description: 'Drought early warning escalation pathway',
        status: 'passing', 
        details: 'Escalation route tested, system ready',
        lastRun: '1 month ago',
        automated: false
      }
    ],
    'atlas-MES-L09': [
      { 
        category: 'configuration', 
        name: 'SLOs present', 
        description: 'Service Level Objectives properly defined',
        status: 'passing', 
        details: 'All 4 SLOs configured with appropriate thresholds',
        lastRun: '1 day ago',
        automated: true
      },
      { 
        category: 'operational', 
        name: 'Rollback automation configured', 
        description: 'Automatic rollback system for service failures',
        status: 'passing', 
        details: 'Rollback tested successfully last week',
        lastRun: '1 week ago',
        automated: true
      },
      { 
        category: 'data', 
        name: 'Adoption funnel instrumented', 
        description: 'User adoption tracking properly implemented',
        status: 'passing', 
        details: 'Full funnel tracking active, 12 touchpoints',
        lastRun: '2 hours ago',
        automated: true
      }
    ],

    // Batch 2 - Meso Systems & Micro Foundations
    'atlas-MES-L02': [
      { name: 'Roster & Payroll Reconciliation', status: 'passing', value: '98.5%', threshold: '≥ 98%', description: 'Cross-validation of teacher roster with payroll systems', lastRun: '2025-08-20 09:00', frequency: 'weekly' },
      { name: 'Attrition Segmentation', status: 'passing', value: 'Complete', threshold: 'By tenure and subject', description: 'Detailed breakdown of teacher departures', lastRun: '2025-08-19 16:00', frequency: 'monthly' },
      { name: 'Band Breach Notification', status: 'passing', value: 'Active', threshold: 'Auto-notify HR policy desk', description: 'Automated alerts for teacher-student ratio violations', lastRun: '2025-08-18 14:30', frequency: 'real-time' }
    ],
    'atlas-MES-L03': [
      { name: 'ISCO Mapping Coverage', status: 'passing', value: '96.2%', threshold: '≥ 95%', description: 'Occupation classification system coverage', lastRun: '2025-08-20 10:15', frequency: 'monthly' },
      { name: 'Placement Data Deduplication', status: 'passing', value: 'Active', threshold: 'Across platforms', description: 'Cross-platform job placement record deduplication', lastRun: '2025-08-20 08:45', frequency: 'daily' },
      { name: 'Monthly Cohort A/B Testing', status: 'passing', value: 'Configured', threshold: 'For intermediation changes', description: 'Statistical testing of matching interventions', lastRun: '2025-08-01 12:00', frequency: 'monthly' }
    ],
    'atlas-MES-L04': [
      { name: 'Bank Feed Latency', status: 'passing', value: '8.5 days', threshold: '< 10 days', description: 'Real-time banking data integration timeliness', lastRun: '2025-08-20 11:30', frequency: 'daily' },
      { name: 'Guarantee Utilization Monitoring', status: 'passing', value: 'Active', threshold: 'vs loss ratio', description: 'Credit guarantee performance tracking', lastRun: '2025-08-20 09:15', frequency: 'weekly' },
      { name: 'Factoring Uptake Tracking', status: 'passing', value: 'By sector', threshold: 'Sectoral breakdown', description: 'Invoice factoring adoption by business sector', lastRun: '2025-08-19 15:45', frequency: 'monthly' }
    ],
    'atlas-MES-L10': [
      { name: 'RACI Completeness', status: 'passing', value: 'Complete', threshold: 'On new sprints', description: 'Responsibility matrix validation for new initiatives', lastRun: '2025-08-20 08:00', frequency: 'per sprint' },
      { name: 'Critical Path Generation', status: 'passing', value: 'Automated', threshold: 'Auto-generated', description: 'Automatic project dependency mapping', lastRun: '2025-08-20 07:30', frequency: 'daily' },
      { name: 'Rework Root-Cause Tagging', status: 'warning', value: '85%', threshold: 'At closure', description: 'Issue categorization completion rate', lastRun: '2025-08-19 17:00', frequency: 'weekly' }
    ],
    'atlas-MES-L11': [
      { name: 'Cross-Agency Dependencies', status: 'passing', value: 'Declared', threshold: 'At sprint start', description: 'Inter-ministry dependency identification', lastRun: '2025-08-15 09:00', frequency: 'per sprint' },
      { name: 'Joint KPI Coverage', status: 'warning', value: '58%', threshold: 'All cross-ministry missions', description: 'Shared performance indicator implementation', lastRun: '2025-08-20 10:00', frequency: 'monthly' },
      { name: 'Conflict SLA Enforcement', status: 'passing', value: 'Active', threshold: 'Timer enforcement', description: 'Automated conflict resolution deadlines', lastRun: '2025-08-20 11:45', frequency: 'real-time' }
    ],
    'atlas-MES-L12': [
      { name: 'Performance-Based Clauses', status: 'passing', value: 'Present', threshold: 'In contracts', description: 'Contract performance linkage verification', lastRun: '2025-08-20 14:00', frequency: 'per contract' },
      { name: 'Open-Book Audits', status: 'passing', value: 'Quarterly', threshold: 'Scheduled', description: 'Transparent cost audit execution', lastRun: '2025-07-01 10:00', frequency: 'quarterly' },
      { name: 'Supplier Risk Heatmap', status: 'passing', value: 'Refreshed', threshold: 'Monthly', description: 'Vendor risk assessment updates', lastRun: '2025-08-01 16:00', frequency: 'monthly' }
    ],
    'atlas-MIC-L01': [
      { name: 'Household Panel Refresh', status: 'passing', value: '75 days', threshold: '≤ 90 days', description: 'Survey data collection cycle compliance', lastRun: '2025-08-20 12:00', frequency: 'continuous' },
      { name: 'Transfer Duplication Control', status: 'passing', value: 'Active', threshold: 'No duplicates', description: 'Social transfer payment deduplication', lastRun: '2025-08-20 06:00', frequency: 'daily' },
      { name: 'CPI Shock Sanity Checks', status: 'passing', value: 'Validated', threshold: 'Micro-sim', description: 'Price shock impact model validation', lastRun: '2025-08-19 20:00', frequency: 'weekly' }
    ],
    'atlas-MIC-L02': [
      { name: 'EHR/Claims Join Rate', status: 'passing', value: '92.3%', threshold: '≥ 90%', description: 'Health record integration completeness', lastRun: '2025-08-20 13:15', frequency: 'daily' },
      { name: 'Reminder Nudge A/B', status: 'passing', value: 'Instrumented', threshold: 'Active testing', description: 'Healthcare reminder system optimization', lastRun: '2025-08-18 11:00', frequency: 'monthly' },
      { name: 'Equity Monitoring', status: 'passing', value: 'By region & income', threshold: 'Quintile slices', description: 'Health access equity tracking', lastRun: '2025-08-20 15:30', frequency: 'monthly' }
    ],
    'atlas-MIC-L03': [
      { name: 'Attendance Ingestion Fidelity', status: 'passing', value: '99.2%', threshold: '≥ 99%', description: 'Daily attendance data quality', lastRun: '2025-08-20 07:00', frequency: 'daily' },
      { name: 'Support Program Linkage', status: 'passing', value: 'Verified', threshold: 'Meal/tutoring', description: 'Student support service integration', lastRun: '2025-08-19 14:00', frequency: 'weekly' },
      { name: 'Alert Fatigue Controls', status: 'passing', value: 'Active', threshold: 'Push messaging', description: 'Notification frequency optimization', lastRun: '2025-08-20 16:00', frequency: 'continuous' }
    ],
    'atlas-MIC-L04': [
      { name: 'ATS Integration', status: 'passing', value: 'Validated', threshold: 'System connectivity', description: 'Applicant tracking system integration', lastRun: '2025-08-20 08:30', frequency: 'daily' },
      { name: 'Diversity Guardrails', status: 'passing', value: 'Active', threshold: 'In matching flows', description: 'Hiring equity monitoring system', lastRun: '2025-08-20 12:30', frequency: 'weekly' },
      { name: 'Attrition Root-Cause Tagging', status: 'warning', value: '78%', threshold: 'Within 14 days', description: 'Employee departure reason classification', lastRun: '2025-08-19 18:00', frequency: 'per incident' }
    ]
  };

  return checksData[loopId] || [];
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'passing': return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'failing': return <XCircle className="w-4 h-4 text-red-400" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'pending': return <Clock className="w-4 h-4 text-muted-foreground" />;
    default: return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'data': return <Database className="w-4 h-4" />;
    case 'configuration': return <Shield className="w-4 h-4" />;
    case 'integration': return <Link2 className="w-4 h-4" />;
    case 'operational': return <CheckCircle className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'passing': return 'secondary';
    case 'failing': return 'destructive';
    case 'warning': return 'outline';
    case 'pending': return 'outline';
    default: return 'outline';
  }
};

const CheckCard: React.FC<{ check: Check }> = ({ check }) => {
  const { category, name, description, status, details, lastRun, automated } = check;
  
  return (
    <Card className="glass-secondary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground">
              {getCategoryIcon(category)}
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{name}</h4>
              <div className="text-xs text-muted-foreground capitalize">{category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status)}
            <Badge variant={getStatusBadge(status)} className="text-xs capitalize">
              {status}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {description}
        </p>

        {details && (
          <div className="text-sm text-foreground mb-3 p-2 bg-muted/10 rounded">
            {details}
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {automated !== undefined && (
              <span className={`${automated ? 'text-green-400' : 'text-muted-foreground'}`}>
                {automated ? 'Automated' : 'Manual'}
              </span>
            )}
          </div>
          {lastRun && lastRun !== 'N/A' && (
            <span className="text-muted-foreground">
              Last run: {lastRun}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const ChecksTab: React.FC<ChecksTabProps> = ({ loop }) => {
  const checks = getChecksForLoop(loop.id);
  const passingChecks = checks.filter(c => c.status === 'passing');
  const failingChecks = checks.filter(c => c.status === 'failing');
  const warningChecks = checks.filter(c => c.status === 'warning');
  const pendingChecks = checks.filter(c => c.status === 'pending');

  const checksByCategory = {
    data: checks.filter(c => c.category === 'data'),
    configuration: checks.filter(c => c.category === 'configuration'),
    integration: checks.filter(c => c.category === 'integration'),
    operational: checks.filter(c => c.category === 'operational')
  };

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
              <Shield className="w-5 h-5" />
              System Health Checks
            </CardTitle>
            <div className="flex items-center gap-2">
              {failingChecks.length > 0 && (
                <Badge variant="destructive">
                  {failingChecks.length} Failing
                </Badge>
              )}
              {warningChecks.length > 0 && (
                <Badge variant="outline">
                  {warningChecks.length} Warning
                </Badge>
              )}
              <Badge variant="secondary">
                {checks.length} Total
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Automated and manual health checks ensure system reliability, data quality, 
            and operational readiness. These validations run continuously to maintain system integrity.
          </p>
        </CardContent>
      </Card>

      {/* Status alerts */}
      {(failingChecks.length > 0 || warningChecks.length > 0) && (
        <Alert variant={failingChecks.length > 0 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {failingChecks.length > 0 && `${failingChecks.length} checks are failing and require immediate attention. `}
            {warningChecks.length > 0 && `${warningChecks.length} checks have warnings that should be reviewed.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Health Summary */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{passingChecks.length}</div>
              <div className="text-muted-foreground">Passing</div>
            </div>
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{warningChecks.length}</div>
              <div className="text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{failingChecks.length}</div>
              <div className="text-muted-foreground">Failing</div>
            </div>
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">{pendingChecks.length}</div>
              <div className="text-muted-foreground">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checks by Category */}
      {checks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(checksByCategory).map(([category, categoryChecks]) => (
            categoryChecks.length > 0 && (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                  {getCategoryIcon(category)}
                  {category} Checks ({categoryChecks.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {categoryChecks.map((check, index) => (
                    <CheckCard key={index} check={check} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No health checks configured for this loop yet. Set up automated and manual checks to monitor system health.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ChecksTab;