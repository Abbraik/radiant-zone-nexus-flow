import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Activity, Target, Info, AlertTriangle, Zap, Bell } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface IndicatorsSignalsTabProps {
  loop: LoopData;
}

interface Indicator {
  name: string;
  band: { min: number; max: number };
  alpha: number;
  unit?: string;
  currentValue?: number;
  trend?: 'up' | 'down' | 'stable';
  lastUpdated?: string;
  status?: 'normal' | 'warning' | 'critical';
  description?: string;
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

// Sample data for indicators - in production this would come from the loop metadata
const getIndicatorsForLoop = (loopId: string): Indicator[] => {
  const indicatorData: Record<string, Indicator[]> = {
    // Batch 4 - META System Controls & Health Access
    'atlas-META-L01': [
      { name: 'Band-Hit Frequency', band: { min: 0, max: 15 }, alpha: 0.4, unit: '% periods', currentValue: 12, trend: 'up', status: 'warning', description: 'Frequency of band violations' },
      { name: 'Dispersion Index (T2/T3)', band: { min: 0.1, max: 0.35 }, alpha: 0.4, unit: 'index', currentValue: 0.28, trend: 'stable', status: 'normal', description: 'Tier 2/3 performance dispersion' },
      { name: 'Composite Error (Tier-1)', band: { min: 0.5, max: 1.2 }, alpha: 0.4, unit: 'σ', currentValue: 0.9, trend: 'down', status: 'normal', description: 'Primary tier composite error metric' }
    ],
    'atlas-META-L02': [
      { name: 'Variance of Error', band: { min: 0.2, max: 0.8 }, alpha: 0.3, unit: 'σ²', currentValue: 0.6, trend: 'stable', status: 'normal', description: 'Controller error variance measure' },
      { name: 'Oscillation Score', band: { min: 0, max: 0.3 }, alpha: 0.3, unit: 'index', currentValue: 0.15, trend: 'down', status: 'normal', description: 'System oscillation magnitude' },
      { name: 'Actuation Overrun', band: { min: 0, max: 10 }, alpha: 0.3, unit: '% periods', currentValue: 5, trend: 'stable', status: 'normal', description: 'Control action overrun frequency' }
    ],
    'atlas-META-L03': [
      { name: 'Breach Persistence', band: { min: 0, max: 30 }, alpha: 0.4, unit: '% periods', currentValue: 22, trend: 'up', status: 'warning', description: 'Duration of breach conditions' },
      { name: 'Integral Error', band: { min: 0.5, max: 2.0 }, alpha: 0.4, unit: 'Σσ', currentValue: 1.6, trend: 'up', status: 'warning', description: 'Accumulated system error' },
      { name: 'Escalation Actions', band: { min: 0, max: 4 }, alpha: 0.3, unit: 'count/qtr', currentValue: 2, trend: 'stable', status: 'normal', description: 'Quarterly escalation frequency' }
    ],
    'atlas-META-L04': [
      { name: 'QA Conformance', band: { min: 85, max: 98 }, alpha: 0.4, unit: '% checks passed', currentValue: 94, trend: 'stable', status: 'normal', description: 'Quality assurance pass rate' },
      { name: 'Latency', band: { min: 1, max: 7 }, alpha: 0.4, unit: 'days', currentValue: 4, trend: 'stable', status: 'normal', description: 'Data processing latency' },
      { name: 'KPI Volatility', band: { min: 0.1, max: 0.4 }, alpha: 0.3, unit: 'σ', currentValue: 0.25, trend: 'down', status: 'normal', description: 'Key performance indicator volatility' }
    ],
    'atlas-META-L05': [
      { name: 'Guardrail Violation Rate', band: { min: 0, max: 5 }, alpha: 0.4, unit: '% periods', currentValue: 2, trend: 'stable', status: 'normal', description: 'Frequency of guardrail breaches' },
      { name: 'Renewal w/o Evaluation', band: { min: 0, max: 20 }, alpha: 0.4, unit: '%', currentValue: 8, trend: 'down', status: 'normal', description: 'Renewals without proper evaluation' },
      { name: 'Oscillation Score', band: { min: 0, max: 0.3 }, alpha: 0.3, unit: 'index', currentValue: 0.12, trend: 'stable', status: 'normal', description: 'System oscillation magnitude' }
    ],
    'atlas-META-L06': [
      { name: 'Adoption Latency', band: { min: 30, max: 180 }, alpha: 0.4, unit: 'days', currentValue: 120, trend: 'down', status: 'normal', description: 'Time to adopt structural proposals' },
      { name: 'Backlog Size', band: { min: 0, max: 50 }, alpha: 0.3, unit: 'proposals', currentValue: 28, trend: 'up', status: 'warning', description: 'Number of pending proposals' },
      { name: 'Post-Adoption Trend Break', band: { min: 0.5, max: 2.0 }, alpha: 0.3, unit: 'σ', currentValue: 1.2, trend: 'stable', status: 'normal', description: 'Trend change after adoption' }
    ],
    'atlas-META-L07': [
      { name: 'Trust Index', band: { min: 0.55, max: 0.80 }, alpha: 0.4, unit: 'index', currentValue: 0.68, trend: 'stable', status: 'normal', description: 'Public trust measurement' },
      { name: 'Participation Rate', band: { min: 35, max: 65 }, alpha: 0.4, unit: '%', currentValue: 52, trend: 'up', status: 'normal', description: 'Citizen participation in governance' },
      { name: 'Service–Trust Congruence Gap', band: { min: 0.0, max: 0.3 }, alpha: 0.3, unit: 'index', currentValue: 0.18, trend: 'down', status: 'normal', description: 'Gap between service delivery and trust' }
    ],
    'atlas-META-L08': [
      { name: 'Early Warning Score', band: { min: 0.3, max: 0.7 }, alpha: 0.3, unit: 'index', currentValue: 0.45, trend: 'stable', status: 'normal', description: 'Composite early warning indicator' },
      { name: 'Lead-Time Gained', band: { min: 3, max: 21 }, alpha: 0.3, unit: 'days', currentValue: 14, trend: 'up', status: 'normal', description: 'Early warning lead time advantage' },
      { name: 'Watchpoints Armed', band: { min: 1, max: 8 }, alpha: 0.4, unit: 'count', currentValue: 4, trend: 'stable', status: 'normal', description: 'Number of active watchpoints' }
    ],
    'atlas-MES-L01': [
      { name: 'Median Wait', band: { min: 7, max: 30 }, alpha: 0.4, unit: 'days', currentValue: 18, trend: 'down', status: 'normal', description: 'Healthcare service wait times' },
      { name: 'Coverage %', band: { min: 70, max: 95 }, alpha: 0.3, unit: '%', currentValue: 87, trend: 'up', status: 'normal', description: 'Healthcare coverage percentage' },
      { name: 'Throughput per Clinician', band: { min: 60, max: 120 }, alpha: 0.4, unit: 'cases/mo', currentValue: 95, trend: 'stable', status: 'normal', description: 'Clinician productivity measure' }
    ],
    'atlas-MIC-L10': [
      { name: 'Violation Rate', band: { min: 0, max: 8 }, alpha: 0.4, unit: 'per 1k', currentValue: 3, trend: 'down', status: 'normal', description: 'Compliance violation frequency' },
      { name: 'Legitimacy Index', band: { min: 0.55, max: 0.8 }, alpha: 0.4, unit: 'index', currentValue: 0.72, trend: 'stable', status: 'normal', description: 'Perceived institutional legitimacy' },
      { name: 'Enforcement Visibility', band: { min: 0.5, max: 0.8 }, alpha: 0.4, unit: 'index', currentValue: 0.65, trend: 'up', status: 'normal', description: 'Public awareness of enforcement' }
    ],
  };

  return indicatorData[loopId] || [];
};

// Sample data for signals - in production this would come from the loop metadata  
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
  };

  return signalData[loopId] || [];
};

const getIndicatorStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'text-green-400';
    case 'warning': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    default: return 'text-muted-foreground';
  }
};

const getIndicatorStatusBadge = (status: string) => {
  switch (status) {
    case 'normal': return 'secondary';
    case 'warning': return 'outline';
    case 'critical': return 'destructive';
    default: return 'outline';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
    case 'stable': return <Activity className="w-4 h-4 text-blue-400" />;
    default: return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-blue-400';
    default: return 'text-muted-foreground';
  }
};

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'outline';
    case 'low': return 'secondary';
    default: return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'triggered':
    case 'active': return 'text-red-400';
    case 'escalated': return 'text-purple-400';
    case 'monitoring': return 'text-yellow-400';
    case 'resolved': return 'text-green-400';
    default: return 'text-muted-foreground';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'triggered':
    case 'active': return 'destructive';
    case 'escalated': return 'destructive';
    case 'monitoring': return 'outline';
    case 'resolved': return 'secondary';
    default: return 'outline';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'threshold': return <Target className="w-4 h-4" />;
    case 'trend': return <TrendingUp className="w-4 h-4" />;
    case 'event': return <Zap className="w-4 h-4" />;
    case 'composite': return <Activity className="w-4 h-4" />;
    default: return <Info className="w-4 h-4" />;
  }
};

const IndicatorCard: React.FC<{ indicator: Indicator }> = ({ indicator }) => {
  const { name, band, alpha, unit, currentValue, trend, status, description } = indicator;
  const isOutOfBand = currentValue !== undefined && (currentValue < band.min || currentValue > band.max);
  const bandProgress = currentValue !== undefined ? 
    Math.max(0, Math.min(100, ((currentValue - band.min) / (band.max - band.min)) * 100)) : 50;

  return (
    <Card className={`glass-secondary ${isOutOfBand ? 'border-red-500/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-foreground text-sm">{name}</h4>
            {unit && <div className="text-xs text-muted-foreground">{unit}</div>}
          </div>
          <div className="flex items-center gap-2">
            {status && (
              <Badge variant={getIndicatorStatusBadge(status)} className="text-xs capitalize">
                {status}
              </Badge>
            )}
            {trend && getTrendIcon(trend)}
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
        )}

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-muted-foreground">DE-Band Range</span>
              <span className="font-mono text-xs">
                {band.min} - {band.max} {unit}
              </span>
            </div>
            <Progress 
              value={bandProgress} 
              className={`h-2 ${isOutOfBand ? 'bg-red-900/20' : 'bg-muted/20'}`}
            />
            {currentValue !== undefined && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">Current</span>
                <span className={`text-xs font-mono ${isOutOfBand ? 'text-red-400' : 'text-green-400'}`}>
                  {currentValue} {unit}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              <strong>α={alpha}</strong> - Smoothing factor for trend analysis
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SignalCard: React.FC<{ signal: Signal }> = ({ signal }) => {
  const displayName = signal.signal || signal.name || 'Unnamed Signal';
  const isActive = signal.status === 'triggered' || signal.status === 'active' || signal.status === 'escalated';

  return (
    <Card className={`glass-secondary ${isActive ? 'border-red-500/20' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            <div className="text-muted-foreground mt-0.5">
              {getTypeIcon(signal.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm leading-tight">
                {displayName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {signal.type}
                </Badge>
                {signal.frequency && (
                  <span className="text-xs text-muted-foreground">
                    {signal.frequency}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {signal.severity && (
              <Badge variant={getSeverityBadge(signal.severity)} className="text-xs capitalize">
                {signal.severity}
              </Badge>
            )}
            {signal.status && (
              <Badge variant={getStatusBadge(signal.status)} className="text-xs capitalize">
                {signal.status}
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {signal.description}
        </p>

        <div className="flex items-center justify-between text-xs">
          <span className={`font-medium ${getStatusColor(signal.status)}`}>
            {signal.status === 'triggered' ? 'Currently Triggered' : 
             signal.status === 'active' ? 'Active Monitoring' :
             signal.status === 'escalated' ? 'Escalated' :
             signal.status === 'resolved' ? 'Resolved' : 'Normal'}
          </span>
          {signal.lastTriggered && (
            <span className="text-muted-foreground">
              Last: {signal.lastTriggered}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const IndicatorsSignalsTab: React.FC<IndicatorsSignalsTabProps> = ({ loop }) => {
  const indicators = getIndicatorsForLoop(loop.id);
  const signals = getSignalsForLoop(loop.id);
  
  const hasOutOfBandIndicators = indicators.some(indicator => 
    indicator.currentValue !== undefined && 
    (indicator.currentValue < indicator.band.min || indicator.currentValue > indicator.band.max)
  );
  
  const activeSignals = signals.filter(s => s.status === 'triggered' || s.status === 'active');
  const triggeredSignals = signals.filter(s => s.status === 'triggered');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Indicators Section */}
      <div>
        <Card className="glass-primary mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              Indicators & DE-Bands
              {hasOutOfBandIndicators && (
                <Badge variant="destructive" className="ml-2">
                  {indicators.filter(i => i.currentValue !== undefined && 
                    (i.currentValue < i.band.min || i.currentValue > i.band.max)).length} Out of Band
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasOutOfBandIndicators && (
              <Alert className="mb-4 border-red-500/20 bg-red-500/5">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  Some indicators are currently outside their DE-band ranges. Review and consider retuning.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-6">
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {indicators.filter(i => i.status === 'normal').length}
                </div>
                <div className="text-muted-foreground">Normal</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {indicators.filter(i => i.status === 'warning').length}
                </div>
                <div className="text-muted-foreground">Warning</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {indicators.filter(i => i.status === 'critical').length}
                </div>
                <div className="text-muted-foreground">Critical</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {indicators.filter(i => i.trend === 'stable').length}
                </div>
                <div className="text-muted-foreground">Stable</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {indicators.map((indicator, index) => (
                <motion.div
                  key={`${indicator.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IndicatorCard indicator={indicator} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signals Section */}
      <div>
        <Card className="glass-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Primary Signals
              {activeSignals.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {activeSignals.length} Active
                </Badge>
              )}
              {triggeredSignals.length > 0 && (
                <Badge variant="destructive" className="ml-2 animate-pulse">
                  {triggeredSignals.length} Triggered
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {triggeredSignals.length > 0 && (
              <Alert className="mb-4 border-red-500/20 bg-red-500/5">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  {triggeredSignals.length} signal{triggeredSignals.length > 1 ? 's are' : ' is'} currently triggered and requires immediate attention.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-6">
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {signals.filter(s => s.status === 'active' || s.status === 'triggered').length}
                </div>
                <div className="text-muted-foreground">Active</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">
                  {signals.filter(s => s.status === 'monitoring').length}
                </div>
                <div className="text-muted-foreground">Monitoring</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {signals.filter(s => s.status === 'resolved').length}
                </div>
                <div className="text-muted-foreground">Resolved</div>
              </div>
              <div className="text-center p-4 bg-muted/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {signals.filter(s => s.status === 'escalated').length}
                </div>
                <div className="text-muted-foreground">Escalated</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {signals.map((signal, index) => (
                <motion.div
                  key={`${signal.signal || signal.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SignalCard signal={signal} />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default IndicatorsSignalsTab;