import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Zap, TrendingUp, Activity, Info, Bell } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface PrimarySignalsTabProps {
  loop: LoopData;
}

interface Signal {
  name?: string;
  signal?: string;
  description: string;
  type: 'threshold' | 'trend' | 'event' | 'composite';
  priority?: 'high' | 'medium' | 'low';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  frequency?: string;
  status?: 'active' | 'normal' | 'triggered' | 'monitoring' | 'resolved' | 'escalated';
  lastTriggered?: string;
}

// Sample data mapping - in production this would come from the loop metadata
const getSignalsForLoop = (loopId: string): Signal[] => {
  const signalData: Record<string, Signal[]> = {
    // Batch 4 - META System Controls & Health Access
    'atlas-META-L01': [
      { signal: 'Tier-1 composite error upshift', type: 'threshold', severity: 'high', frequency: 'occasional', description: 'Composite performance error increasing beyond acceptable bounds', lastTriggered: '2025-08-15', status: 'monitoring' },
      { signal: 'Cross-tier dispersion persistence', type: 'trend', severity: 'medium', frequency: 'rare', description: 'Performance variance across organizational tiers remaining elevated', lastTriggered: '2025-07-28', status: 'resolved' },
      { signal: 'Trust/latency constraints binding', type: 'composite', severity: 'high', frequency: 'rare', description: 'System trust and response latency creating operational constraints', lastTriggered: '2025-08-12', status: 'active' }
    ],
    'atlas-META-L02': [
      { signal: 'Relative RMSE deterioration vs peers', type: 'trend', severity: 'medium', frequency: 'occasional', description: 'System performance metrics declining relative to comparable systems', lastTriggered: '2025-08-18', status: 'monitoring' },
      { signal: 'Sustained oscillations beyond band', type: 'threshold', severity: 'high', frequency: 'rare', description: 'System showing persistent oscillatory behavior outside normal parameters', lastTriggered: '2025-08-05', status: 'resolved' },
      { signal: 'Actuation overruns vs caps', type: 'threshold', severity: 'high', frequency: 'occasional', description: 'Control actions exceeding predefined operational limits', lastTriggered: '2025-08-19', status: 'active' }
    ],
    'atlas-META-L03': [
      { signal: 'Persistent Tier-1 breaches (k periods)', type: 'event', severity: 'critical', frequency: 'rare', description: 'Top-tier performance breaches continuing beyond threshold periods', lastTriggered: '2025-08-14', status: 'escalated' },
      { signal: 'Integral error above threshold', type: 'threshold', severity: 'high', frequency: 'occasional', description: 'Cumulative system error exceeding acceptable bounds', lastTriggered: '2025-08-17', status: 'active' },
      { signal: 'Hub-node saturation across missions', type: 'composite', severity: 'high', frequency: 'rare', description: 'Critical system nodes approaching capacity limits', lastTriggered: '2025-08-10', status: 'monitoring' }
    ],
    'atlas-META-L04': [
      { signal: 'Missingness spikes', type: 'event', severity: 'medium', frequency: 'occasional', description: 'Data completeness dropping below acceptable levels', lastTriggered: '2025-08-16', status: 'monitoring' },
      { signal: 'Schema drift / reconciliation errors', type: 'event', severity: 'high', frequency: 'rare', description: 'Data structure changes causing integration failures', lastTriggered: '2025-08-08', status: 'resolved' },
      { signal: 'Telemetry out of SLA', type: 'threshold', severity: 'medium', frequency: 'frequent', description: 'System monitoring data delivery outside service level agreements', lastTriggered: '2025-08-20', status: 'active' }
    ],
    'atlas-META-L05': [
      { signal: 'Actuation beyond caps', type: 'threshold', severity: 'high', frequency: 'rare', description: 'System actions exceeding predefined safety limits', lastTriggered: '2025-08-11', status: 'resolved' },
      { signal: 'Repeated renewals without interim eval', type: 'trend', severity: 'medium', frequency: 'occasional', description: 'Operational parameters being renewed without proper evaluation', lastTriggered: '2025-08-13', status: 'monitoring' },
      { signal: 'Oscillation above band', type: 'threshold', severity: 'medium', frequency: 'occasional', description: 'System behavior showing oscillations beyond normal ranges', lastTriggered: '2025-08-19', status: 'active' }
    ],
    'atlas-META-L06': [
      { signal: 'Chronic Tier-1 shortfall', type: 'trend', severity: 'high', frequency: 'rare', description: 'Persistent underperformance in top-tier metrics', lastTriggered: '2025-08-09', status: 'monitoring' },
      { signal: 'Identified sectoral bottlenecks', type: 'composite', severity: 'medium', frequency: 'occasional', description: 'Specific sectors showing consistent performance constraints', lastTriggered: '2025-08-15', status: 'active' },
      { signal: 'Authority/budget readiness', type: 'threshold', severity: 'low', frequency: 'frequent', description: 'Organizational readiness for authorized budget utilization', lastTriggered: '2025-08-20', status: 'monitoring' }
    ],
    'atlas-META-L07': [
      { signal: 'Trust delta vs delivery widening', type: 'trend', severity: 'high', frequency: 'occasional', description: 'Gap between public trust and service delivery performance increasing', lastTriggered: '2025-08-12', status: 'active' },
      { signal: 'Low participation elasticity to outreach', type: 'trend', severity: 'medium', frequency: 'occasional', description: 'Public engagement not responding effectively to outreach efforts', lastTriggered: '2025-08-07', status: 'monitoring' },
      { signal: 'Fairness/perception dips in surveys', type: 'threshold', severity: 'medium', frequency: 'rare', description: 'Public perception of fairness declining in survey data', lastTriggered: '2025-07-30', status: 'resolved' }
    ],
    'atlas-META-L08': [
      { signal: 'Environmental/supply/geopolitical sentinel spikes', type: 'event', severity: 'critical', frequency: 'rare', description: 'Early warning indicators showing elevated risk across multiple domains', lastTriggered: '2025-08-16', status: 'escalated' },
      { signal: 'Cascading corridor risks', type: 'composite', severity: 'high', frequency: 'occasional', description: 'Risk propagation across interconnected system pathways', lastTriggered: '2025-08-18', status: 'active' },
      { signal: 'Forecast variance widening', type: 'trend', severity: 'medium', frequency: 'frequent', description: 'Prediction accuracy declining across forecast models', lastTriggered: '2025-08-20', status: 'monitoring' }
    ],
    'atlas-MES-L01': [
      { signal: 'Queue lengths rising', type: 'trend', severity: 'medium', frequency: 'frequent', description: 'Healthcare service wait times increasing beyond targets', lastTriggered: '2025-08-20', status: 'active' },
      { signal: 'Latency breaches in specific services', type: 'threshold', severity: 'high', frequency: 'occasional', description: 'Specific healthcare services showing response time violations', lastTriggered: '2025-08-17', status: 'active' },
      { signal: 'Quality index dips', type: 'threshold', severity: 'medium', frequency: 'rare', description: 'Healthcare service quality metrics declining', lastTriggered: '2025-08-03', status: 'resolved' }
    ],
    'atlas-MIC-L10': [
      { signal: 'Violation clusters by geography/sector', type: 'composite', severity: 'medium', frequency: 'occasional', description: 'Regulatory violations showing geographic or sectoral concentration patterns', lastTriggered: '2025-08-14', status: 'monitoring' },
      { signal: 'Sentiment dips linked to perceived unfairness', type: 'trend', severity: 'high', frequency: 'rare', description: 'Public sentiment declining due to perceptions of unfair treatment', lastTriggered: '2025-08-06', status: 'resolved' },
      { signal: 'Low visibility of fair enforcement', type: 'threshold', severity: 'medium', frequency: 'frequent', description: 'Public awareness of fair enforcement actions insufficient', lastTriggered: '2025-08-19', status: 'active' }
    ],

    'atlas-MAC-L05': [
      { name: 'Capex approval rate', description: 'Sudden changes in capital expenditure approval rates', type: 'trend', priority: 'high', status: 'normal' },
      { name: 'Utilization > 86% (overheating risk)', description: 'Capacity utilization exceeding safe operating threshold', type: 'threshold', priority: 'high', status: 'triggered', lastTriggered: '2 days ago' },
      { name: 'Sharp ROI expectation jumps', description: 'Rapid increases in return on investment expectations', type: 'trend', priority: 'medium', status: 'normal' },
      { name: 'Default spreads widening (risk-off)', description: 'Credit spread expansion indicating risk aversion', type: 'composite', priority: 'high', status: 'normal' }
    ],
    'atlas-MAC-L06': [
      { name: 'Global demand shock', description: 'Sudden shifts in international demand patterns', type: 'event', priority: 'high', status: 'normal' },
      { name: 'REER misalignment > ±5%', description: 'Real effective exchange rate deviation beyond tolerance', type: 'threshold', priority: 'high', status: 'normal' },
      { name: 'Port/standards bottlenecks', description: 'Infrastructure or regulatory constraints limiting trade', type: 'composite', priority: 'medium', status: 'normal' }
    ],
    'atlas-MAC-L07': [
      { name: 'Ceiling breach', description: 'Environmental load exceeding sustainable limits', type: 'threshold', priority: 'high', status: 'normal' },
      { name: 'MRV gaps', description: 'Missing or incomplete monitoring, reporting, verification data', type: 'event', priority: 'medium', status: 'active', lastTriggered: '1 week ago' },
      { name: 'Persistent permit non-compliance', description: 'Ongoing violations of environmental permits', type: 'composite', priority: 'high', status: 'normal' }
    ],
    'atlas-MAC-L08': [
      { name: 'Trust delta vs service delivery', description: 'Divergence between trust levels and service quality', type: 'composite', priority: 'high', status: 'normal' },
      { name: 'Grievance index spikes', description: 'Sudden increases in public complaints or grievances', type: 'trend', priority: 'high', status: 'normal' },
      { name: 'Participation elasticity', description: 'Changes in civic participation responsiveness', type: 'trend', priority: 'medium', status: 'normal' }
    ],
    'atlas-MAC-L09': [
      { name: 'Shock severity index', description: 'Magnitude of external system shocks', type: 'composite', priority: 'high', status: 'normal' },
      { name: 'Reserve drawdown velocity', description: 'Speed of buffer depletion during crises', type: 'trend', priority: 'high', status: 'normal' },
      { name: 'Coordination lag', description: 'Delays in multi-agency response coordination', type: 'threshold', priority: 'medium', status: 'normal' }
    ],
    'atlas-MAC-L10': [
      { name: 'Attainment stagnation', description: 'Educational achievement plateaus or declines', type: 'trend', priority: 'medium', status: 'normal' },
      { name: 'Cohort health shocks', description: 'Sudden health impacts on specific population groups', type: 'event', priority: 'high', status: 'normal' },
      { name: 'Low returns to schooling', description: 'Declining economic benefits of education', type: 'trend', priority: 'medium', status: 'normal' }
    ],
    'atlas-MES-L06': [
      { name: 'Reliability dips', description: 'Drops in transport service reliability', type: 'threshold', priority: 'medium', status: 'normal' },
      { name: 'Corridor load saturation', description: 'Transportation corridors reaching capacity limits', type: 'threshold', priority: 'high', status: 'normal' },
      { name: 'Incident spikes', description: 'Increases in transport-related incidents', type: 'trend', priority: 'high', status: 'normal' }
    ],
    'atlas-MES-L07': [
      { name: 'Outage bursts', description: 'Clusters of power system failures', type: 'event', priority: 'high', status: 'normal' },
      { name: 'Heat-wave stress', description: 'Grid stress during extreme temperature events', type: 'event', priority: 'high', status: 'normal' },
      { name: 'Fuel supply constraints', description: 'Limitations in energy fuel availability', type: 'threshold', priority: 'medium', status: 'normal' }
    ],
    'atlas-MES-L08': [
      { name: 'NRW spikes', description: 'Sudden increases in non-revenue water losses', type: 'trend', priority: 'medium', status: 'normal' },
      { name: 'Drought sentinel', description: 'Early warning indicators of water scarcity', type: 'composite', priority: 'high', status: 'normal' },
      { name: 'Tariff non-payment bursts', description: 'Clusters of water service payment defaults', type: 'trend', priority: 'medium', status: 'normal' }
    ],
    'atlas-MES-L09': [
      { name: 'Spiky 5xx', description: 'Server error rate anomalies', type: 'trend', priority: 'high', status: 'normal' },
      { name: 'Funnel drop-off', description: 'User abandonment in service workflows', type: 'trend', priority: 'medium', status: 'normal' },
      { name: 'Session failure clusters', description: 'Groups of failed user sessions', type: 'event', priority: 'medium', status: 'normal' }
    ],

    // Batch 2 - Meso Systems & Micro Foundations
    'atlas-MES-L02': [
      { name: 'Teacher Attrition Spike', description: 'Attrition spikes by subject/region', type: 'threshold', priority: 'high', status: 'normal', lastTriggered: '2025-07-15' },
      { name: 'Training Bottleneck', description: 'Training intake bottlenecks (practicum slots, scholarships)', type: 'event', priority: 'medium', status: 'normal', lastTriggered: '2025-06-20' },
      { name: 'Class Size Drift', description: 'Class size drift above band', type: 'threshold', priority: 'medium', status: 'triggered', lastTriggered: '2025-08-10' }
    ],
    'atlas-MES-L03': [
      { name: 'Skills Mismatch', description: 'Mismatch index rising (skills vs. demand)', type: 'trend', priority: 'high', status: 'normal', lastTriggered: '2025-07-22' },
      { name: 'Extended Fill Time', description: 'Fill-time beyond 45 days', type: 'threshold', priority: 'medium', status: 'active', lastTriggered: '2025-08-18' },
      { name: 'Recognition Gaps', description: 'Recognition gaps in growth occupations', type: 'composite', priority: 'medium', status: 'normal', lastTriggered: '2025-05-30' }
    ],
    'atlas-MES-L04': [
      { name: 'Extended DSO', description: 'DSO > 60 days', type: 'threshold', priority: 'high', status: 'normal', lastTriggered: '2025-07-05' },
      { name: 'Low Credit Acceptance', description: 'Credit acceptance < 45%', type: 'threshold', priority: 'high', status: 'normal', lastTriggered: '2025-06-15' },
      { name: 'Default Rate Rise', description: 'Default rate rising above 6%', type: 'trend', priority: 'high', status: 'normal', lastTriggered: '2025-05-10' }
    ],
    'atlas-MES-L10': [
      { name: 'Implementation Delay', description: 'Decision latency trending up', type: 'trend', priority: 'medium', status: 'normal', lastTriggered: '2025-07-28' },
      { name: 'High Rework', description: 'Rework share > 12%', type: 'threshold', priority: 'medium', status: 'normal', lastTriggered: '2025-06-12' },
      { name: 'Backlog Growth', description: 'Backlog growth for ≥ 2 cycles', type: 'trend', priority: 'high', status: 'normal', lastTriggered: '2025-05-25' }
    ],
    'atlas-MES-L11': [
      { name: 'Conflict Escalation', description: 'Conflict tickets rising', type: 'trend', priority: 'high', status: 'active', lastTriggered: '2025-08-12' },
      { name: 'Coordination Bottleneck', description: 'High SNA betweenness + unresolved dependencies', type: 'composite', priority: 'high', status: 'normal', lastTriggered: '2025-07-08' },
      { name: 'Low Joint Coverage', description: 'Low joint KPI coverage', type: 'threshold', priority: 'medium', status: 'normal', lastTriggered: '2025-06-18' }
    ],
    'atlas-MES-L12': [
      { name: 'Service Disruption', description: 'SAIDI/SAIFI-linked disruptions triggering claims', type: 'event', priority: 'high', status: 'normal', lastTriggered: '2025-07-20' },
      { name: 'Cost Variance', description: 'Variance creeping beyond ±5%', type: 'threshold', priority: 'medium', status: 'normal', lastTriggered: '2025-06-25' },
      { name: 'Dispute Spike', description: 'Spike in dispute rate > 6%', type: 'threshold', priority: 'medium', status: 'normal', lastTriggered: '2025-05-15' }
    ],
    'atlas-MIC-L01': [
      { name: 'Price Shock', description: 'Price shocks (CPI sub-baskets)', type: 'event', priority: 'high', status: 'triggered', lastTriggered: '2025-08-15' },
      { name: 'Debt Service Spike', description: 'Debt service spikes', type: 'threshold', priority: 'high', status: 'normal', lastTriggered: '2025-07-10' },
      { name: 'Transfer Activation', description: 'Transfer system activation thresholds', type: 'threshold', priority: 'medium', status: 'active', lastTriggered: '2025-08-08' }
    ],
    'atlas-MIC-L02': [
      { name: 'Adherence Gap', description: 'Adherence gaps by condition', type: 'composite', priority: 'medium', status: 'normal', lastTriggered: '2025-07-18' },
      { name: 'Price Barrier', description: 'OOP price barriers', type: 'threshold', priority: 'high', status: 'normal', lastTriggered: '2025-06-28' },
      { name: 'Access Outage', description: 'Clinic access outages', type: 'event', priority: 'high', status: 'normal', lastTriggered: '2025-05-22' }
    ],
    'atlas-MIC-L03': [
      { name: 'Seasonal Absence', description: 'Absence spikes post-holiday/seasonal', type: 'event', priority: 'medium', status: 'normal', lastTriggered: '2025-07-25' },
      { name: 'Tutoring Gap', description: 'Tutoring coverage gaps', type: 'threshold', priority: 'medium', status: 'normal', lastTriggered: '2025-06-30' },
      { name: 'Support Deficit', description: 'Household support deficits', type: 'composite', priority: 'high', status: 'normal', lastTriggered: '2025-05-18' }
    ],
    'atlas-MIC-L04': [
      { name: 'Churn Trap', description: 'Vacancy re-open cycles (churn traps)', type: 'event', priority: 'high', status: 'normal', lastTriggered: '2025-07-12' },
      { name: 'Low Acceptance', description: 'Low acceptance rate', type: 'threshold', priority: 'medium', status: 'normal', lastTriggered: '2025-06-22' },
      { name: 'Attrition Burst', description: 'Attrition bursts by role/tenure', type: 'event', priority: 'high', status: 'normal', lastTriggered: '2025-05-28' }
    ],
    // Batch 5 additions
    'atlas-MAC-L01': [
      { signal: 'Support ratio outside band for ≥ k periods', type: 'threshold', severity: 'high', frequency: 'rare', description: 'Worker-to-dependent ratio breaching sustainable bounds', lastTriggered: '2025-07-20', status: 'monitoring' },
      { signal: 'Sharp decline in fertility with housing/childcare constraints', type: 'composite', severity: 'high', frequency: 'occasional', description: 'Fertility rate drops linked to affordability pressures', lastTriggered: '2025-08-10', status: 'active' },
      { signal: 'Migration flow volatility affecting cohort structure', type: 'trend', severity: 'medium', frequency: 'occasional', description: 'Migration patterns disrupting demographic balance', lastTriggered: '2025-08-05', status: 'monitoring' }
    ],
    'atlas-MAC-L02': [
      { signal: 'Persistent vacancy–unemployment gap > 2 pp', type: 'threshold', severity: 'high', frequency: 'occasional', description: 'Large mismatch between job vacancies and unemployment', lastTriggered: '2025-08-12', status: 'active' },
      { signal: 'Fill-time increases across sectors', type: 'trend', severity: 'medium', frequency: 'frequent', description: 'Time to fill job vacancies increasing broadly', lastTriggered: '2025-08-18', status: 'monitoring' },
      { signal: 'Credentialing/recognition coverage gaps', type: 'composite', severity: 'medium', frequency: 'occasional', description: 'Skills recognition system missing key occupations', lastTriggered: '2025-08-01', status: 'resolved' }
    ],
    'atlas-MAC-L03': [
      { signal: 'Inflation > 5% or < 2% for ≥ 2 quarters', type: 'threshold', severity: 'critical', frequency: 'rare', description: 'Price stability outside target range persistently', lastTriggered: '2025-06-30', status: 'resolved' },
      { signal: 'Rising inflation expectations dispersion', type: 'trend', severity: 'high', frequency: 'occasional', description: 'Public expectations of inflation becoming more volatile', lastTriggered: '2025-08-15', status: 'monitoring' },
      { signal: 'Energy/food price shocks feeding into CPI', type: 'event', severity: 'high', frequency: 'occasional', description: 'Essential goods price increases affecting general inflation', lastTriggered: '2025-08-08', status: 'active' }
    ],
    'atlas-MAC-L04': [
      { signal: 'Price-to-income rising above 6', type: 'threshold', severity: 'critical', frequency: 'rare', description: 'Housing affordability reaching crisis levels', lastTriggered: '2025-07-15', status: 'resolved' },
      { signal: 'Stage-bottlenecks in approvals/starts/completions', type: 'composite', severity: 'high', frequency: 'frequent', description: 'Housing delivery pipeline showing systematic delays', lastTriggered: '2025-08-19', status: 'active' },
      { signal: 'Household formation delays > 18 months', type: 'threshold', severity: 'medium', frequency: 'occasional', description: 'Young adults delaying household formation due to housing costs', lastTriggered: '2025-08-05', status: 'monitoring' }
    ],
    'atlas-MES-L05': [
      { signal: 'Starts-to-completions conversion falling', type: 'trend', severity: 'high', frequency: 'occasional', description: 'Housing construction pipeline experiencing conversion issues', lastTriggered: '2025-08-14', status: 'active' },
      { signal: 'Time-in-stage > 180 days', type: 'threshold', severity: 'medium', frequency: 'frequent', description: 'Housing delivery stages taking longer than target timeframes', lastTriggered: '2025-08-19', status: 'active' },
      { signal: 'Cost spikes not explained by inputs', type: 'event', severity: 'high', frequency: 'occasional', description: 'Unexplained housing cost increases beyond input price changes', lastTriggered: '2025-08-12', status: 'monitoring' }
    ],
    'atlas-MIC-L11': [
      { signal: 'Onboarding failures or long session times', type: 'composite', severity: 'medium', frequency: 'frequent', description: 'Digital service onboarding showing usability issues', lastTriggered: '2025-08-18', status: 'active' },
      { signal: 'High drop-off at critical steps', type: 'threshold', severity: 'high', frequency: 'frequent', description: 'Users abandoning digital services at key interaction points', lastTriggered: '2025-08-20', status: 'active' },
      { signal: 'Low literacy zones with access gaps', type: 'composite', severity: 'medium', frequency: 'occasional', description: 'Digital divide affecting service adoption in underserved areas', lastTriggered: '2025-08-10', status: 'monitoring' }
    ],
    'atlas-MIC-L12': [
      { signal: 'Low turnout to participatory budgeting', type: 'threshold', severity: 'medium', frequency: 'occasional', description: 'Community engagement levels below targets for local decision-making', lastTriggered: '2025-08-15', status: 'monitoring' },
      { signal: 'Weak co-production capacity in target areas', type: 'composite', severity: 'high', frequency: 'rare', description: 'Community capacity for co-producing services is insufficient', lastTriggered: '2025-07-28', status: 'active' },
      { signal: 'Trust dips not explained by service quality', type: 'event', severity: 'medium', frequency: 'rare', description: 'Local trust declining despite stable service performance', lastTriggered: '2025-08-05', status: 'monitoring' }
    ]
  };

  return signalData[loopId] || [];
};

const getSignalIcon = (type: string) => {
  switch (type) {
    case 'threshold': return <AlertTriangle className="w-4 h-4" />;
    case 'trend': return <TrendingUp className="w-4 h-4" />;
    case 'event': return <Zap className="w-4 h-4" />;
    case 'composite': return <Activity className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'triggered': return 'text-red-400';
    case 'active': return 'text-yellow-400';
    case 'normal': return 'text-green-400';
    default: return 'text-muted-foreground';
  }
};

const SignalCard: React.FC<{ signal: Signal }> = ({ signal }) => {
  const { name, description, type, priority, status, lastTriggered } = signal;
  const isActive = status === 'triggered' || status === 'active';

  return (
    <Card className={`glass-secondary ${isActive ? 'border-yellow-500/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={getStatusColor(status)}>
              {getSignalIcon(type)}
            </div>
            <h4 className="font-medium text-foreground text-sm">{name}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getPriorityColor(priority)} className="text-xs">
              {priority}
            </Badge>
            {isActive && <div className={`w-2 h-2 rounded-full ${status === 'triggered' ? 'bg-red-400' : 'bg-yellow-400'} animate-pulse`} />}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Type: <span className="capitalize font-medium">{type}</span>
            </span>
            <span className={`font-medium ${getStatusColor(status)}`}>
              {status || 'normal'}
            </span>
          </div>
          {lastTriggered && (
            <span className="text-muted-foreground">
              Last: {lastTriggered}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PrimarySignalsTab: React.FC<PrimarySignalsTabProps> = ({ loop }) => {
  const signals = getSignalsForLoop(loop.id);
  const activeSignals = signals.filter(s => s.status === 'triggered' || s.status === 'active');
  const triggeredSignals = signals.filter(s => s.status === 'triggered');

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
              <Bell className="w-5 h-5" />
              Primary Signals
            </CardTitle>
            <div className="flex items-center gap-2">
              {triggeredSignals.length > 0 && (
                <Badge variant="destructive">
                  {triggeredSignals.length} Triggered
                </Badge>
              )}
              <Badge variant="secondary">
                {signals.length} Total
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Critical warning signals that indicate potential system instability or require immediate attention.
            These signals are continuously monitored and can trigger automated responses or escalations.
          </p>
        </CardContent>
      </Card>

      {/* Active signals alert */}
      {activeSignals.length > 0 && (
        <Alert variant={triggeredSignals.length > 0 ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {activeSignals.length} signal{activeSignals.length !== 1 ? 's' : ''} currently active.
            {triggeredSignals.length > 0 && ` ${triggeredSignals.length} triggered and require immediate attention.`}
          </AlertDescription>
        </Alert>
      )}

      {/* Signals Grid */}
      {signals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {signals.map((signal, index) => (
            <SignalCard key={index} signal={signal} />
          ))}
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No primary signals defined for this loop yet. Configure early warning signals to monitor system health.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-sm">Signal Types & Priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Signal Types</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="w-3 h-3" />
                  <span><strong>Threshold:</strong> Value crosses predefined limits</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-3 h-3" />
                  <span><strong>Trend:</strong> Rate of change exceeds normal patterns</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span><strong>Event:</strong> Discrete occurrence requiring attention</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  <span><strong>Composite:</strong> Multi-factor condition</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Status Indicators</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-muted-foreground"><strong>Triggered:</strong> Immediate action required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-muted-foreground"><strong>Active:</strong> Monitoring closely</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-muted-foreground"><strong>Normal:</strong> Within expected range</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PrimarySignalsTab;