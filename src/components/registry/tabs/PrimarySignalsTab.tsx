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
  name: string;
  description: string;
  type: 'threshold' | 'trend' | 'event' | 'composite';
  priority: 'high' | 'medium' | 'low';
  status?: 'active' | 'normal' | 'triggered';
  lastTriggered?: string;
}

// Sample data mapping - in production this would come from the loop metadata
const getSignalsForLoop = (loopId: string): Signal[] => {
  const signalData: Record<string, Signal[]> = {
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