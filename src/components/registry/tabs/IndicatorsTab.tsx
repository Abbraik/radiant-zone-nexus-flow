import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Activity, Target, Info, AlertTriangle } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface IndicatorsTabProps {
  loop: LoopData;
}

interface Indicator {
  name: string;
  band: { min: number; max: number };
  alpha: number;
  unit?: string;
  currentValue?: number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
}

// Sample data mapping - in production this would come from the loop metadata
const getIndicatorsForLoop = (loopId: string): Indicator[] => {
  const indicatorData: Record<string, Indicator[]> = {
    'atlas-MAC-L05': [
      { name: 'Capex Growth (%YoY)', band: { min: 0, max: 12 }, alpha: 0.35, unit: '%', currentValue: 8.2, trend: 'up', status: 'normal' },
      { name: 'Capacity Utilization', band: { min: 72, max: 86 }, alpha: 0.30, unit: '%', currentValue: 89, trend: 'up', status: 'warning' },
      { name: 'ROI Expectations (index)', band: { min: 0.5, max: 0.8 }, alpha: 0.30, currentValue: 0.68, trend: 'stable', status: 'normal' },
      { name: 'Obsolescence Rate', band: { min: 0, max: 6 }, alpha: 0.35, unit: '%', currentValue: 3.2, trend: 'down', status: 'normal' }
    ],
    'atlas-MAC-L06': [
      { name: 'Export Orderbook (index)', band: { min: 45, max: 70 }, alpha: 0.30, currentValue: 52, trend: 'up', status: 'normal' },
      { name: 'REER Deviation', band: { min: -5, max: 5 }, alpha: 0.30, unit: '%', currentValue: 2.1, trend: 'stable', status: 'normal' },
      { name: 'Tradables Capacity Utilization', band: { min: 70, max: 88 }, alpha: 0.30, unit: '%', currentValue: 82, trend: 'up', status: 'normal' }
    ],
    'atlas-MAC-L07': [
      { name: 'Load Index / Ceiling (ratio)', band: { min: 0.6, max: 0.9 }, alpha: 0.35, currentValue: 0.82, trend: 'up', status: 'warning' },
      { name: 'Emissions Intensity', band: { min: -5, max: -2 }, alpha: 0.30, unit: '% YoY', currentValue: -3.1, trend: 'stable', status: 'normal' },
      { name: 'Biodiversity Sub-index', band: { min: 0.55, max: 0.8 }, alpha: 0.35, currentValue: 0.67, trend: 'down', status: 'normal' },
      { name: 'Water Sub-index', band: { min: 0.55, max: 0.8 }, alpha: 0.35, currentValue: 0.71, trend: 'stable', status: 'normal' },
      { name: 'Energy Sub-index', band: { min: 0.55, max: 0.8 }, alpha: 0.35, currentValue: 0.74, trend: 'up', status: 'normal' }
    ],
    'atlas-MAC-L08': [
      { name: 'Trust Index', band: { min: 0.55, max: 0.80 }, alpha: 0.40, currentValue: 0.62, trend: 'stable', status: 'normal' },
      { name: 'Participation Rate', band: { min: 35, max: 65 }, alpha: 0.40, unit: '%', currentValue: 48, trend: 'up', status: 'normal' },
      { name: 'Perceived Fairness (index)', band: { min: 0.5, max: 0.75 }, alpha: 0.35, currentValue: 0.58, trend: 'down', status: 'normal' }
    ],
    'atlas-MAC-L09': [
      { name: 'Buffer Adequacy', band: { min: 30, max: 120 }, alpha: 0.35, unit: 'days', currentValue: 67, trend: 'stable', status: 'normal' },
      { name: 'Response Latency', band: { min: 1, max: 5 }, alpha: 0.35, unit: 'days', currentValue: 2.8, trend: 'down', status: 'normal' },
      { name: 'Recovery Half-Life', band: { min: 15, max: 60 }, alpha: 0.35, unit: 'days', currentValue: 28, trend: 'stable', status: 'normal' }
    ],
    'atlas-MAC-L10': [
      { name: 'Health Stock (index)', band: { min: 0.6, max: 0.85 }, alpha: 0.25, currentValue: 0.73, trend: 'up', status: 'normal' },
      { name: 'Learning Stock (index)', band: { min: 0.55, max: 0.8 }, alpha: 0.25, currentValue: 0.68, trend: 'stable', status: 'normal' },
      { name: 'Participation', band: { min: 60, max: 78 }, alpha: 0.30, unit: '%', currentValue: 72, trend: 'up', status: 'normal' },
      { name: 'Productivity (index)', band: { min: 0.6, max: 0.85 }, alpha: 0.25, currentValue: 0.71, trend: 'up', status: 'normal' }
    ],
    'atlas-MES-L06': [
      { name: 'Peak Congestion', band: { min: 20, max: 40 }, alpha: 0.35, unit: '%', currentValue: 32, trend: 'up', status: 'normal' },
      { name: 'Travel Time Reliability (index)', band: { min: 0.75, max: 0.9 }, alpha: 0.30, currentValue: 0.84, trend: 'stable', status: 'normal' },
      { name: 'Network Capacity Utilization', band: { min: 65, max: 85 }, alpha: 0.30, unit: '%', currentValue: 78, trend: 'up', status: 'normal' }
    ],
    'atlas-MES-L07': [
      { name: 'Reserve Margin', band: { min: 15, max: 25 }, alpha: 0.30, unit: '%', currentValue: 18.5, trend: 'down', status: 'warning' },
      { name: 'SAIDI', band: { min: 0, max: 120 }, alpha: 0.35, unit: 'mins/customer/yr', currentValue: 85, trend: 'up', status: 'normal' },
      { name: 'SAIFI', band: { min: 0, max: 1.5 }, alpha: 0.35, unit: 'interruptions/yr', currentValue: 0.8, trend: 'stable', status: 'normal' }
    ],
    'atlas-MES-L08': [
      { name: 'Stress Index (ratio)', band: { min: 0.5, max: 0.8 }, alpha: 0.35, currentValue: 0.72, trend: 'up', status: 'normal' },
      { name: 'Non-Revenue Water', band: { min: 10, max: 25 }, alpha: 0.35, unit: '%', currentValue: 18, trend: 'down', status: 'normal' },
      { name: 'Reuse/Uptake', band: { min: 5, max: 25 }, alpha: 0.30, unit: '%', currentValue: 12, trend: 'up', status: 'normal' }
    ],
    'atlas-MES-L09': [
      { name: 'Uptime', band: { min: 99.0, max: 99.9 }, alpha: 0.35, unit: '%', currentValue: 99.4, trend: 'stable', status: 'normal' },
      { name: 'Error Rates', band: { min: 0, max: 8 }, alpha: 0.35, unit: '4xx/5xx per 1k', currentValue: 3.2, trend: 'down', status: 'normal' },
      { name: 'Adoption (DAU/MAU)', band: { min: 0.25, max: 0.5 }, alpha: 0.30, currentValue: 0.38, trend: 'up', status: 'normal' },
      { name: 'NPS (index)', band: { min: 30, max: 60 }, alpha: 0.30, currentValue: 45, trend: 'up', status: 'normal' }
    ],

    // Batch 2 - Meso Systems & Micro Foundations (MES-L02/03/04/10/11/12 + MIC-L01..L04)
    'atlas-MES-L02': [
      { name: 'Teacher–Student Ratio', band: { min: 40, max: 55 }, alpha: 0.3, unit: 'teachers/1000 students', currentValue: 48, trend: 'stable', status: 'normal' },
      { name: 'Attrition Rate', band: { min: 0, max: 8 }, alpha: 0.4, unit: '%', currentValue: 6.2, trend: 'up', status: 'warning' },
      { name: 'Accreditation Score', band: { min: 0.6, max: 0.85 }, alpha: 0.3, currentValue: 0.72, trend: 'up', status: 'normal' }
    ],
    'atlas-MES-L03': [
      { name: 'Matching Rate', band: { min: 35, max: 65 }, alpha: 0.3, unit: '% placements', currentValue: 52, trend: 'up', status: 'normal' },
      { name: 'Vacancy Fill-Time', band: { min: 15, max: 45 }, alpha: 0.3, unit: 'days', currentValue: 38, trend: 'stable', status: 'normal' },
      { name: 'Recognition Coverage', band: { min: 40, max: 80 }, alpha: 0.3, unit: '% occupations', currentValue: 62, trend: 'up', status: 'normal' }
    ],
    'atlas-MES-L04': [
      { name: 'Credit Acceptance Rate', band: { min: 45, max: 70 }, alpha: 0.4, unit: '%', currentValue: 58, trend: 'up', status: 'normal' },
      { name: 'DSO (Days Sales Outstanding)', band: { min: 30, max: 60 }, alpha: 0.4, unit: 'days', currentValue: 52, trend: 'down', status: 'normal' },
      { name: 'Default Rate', band: { min: 0, max: 6 }, alpha: 0.4, unit: '%', currentValue: 4.1, trend: 'stable', status: 'normal' }
    ],
    'atlas-MES-L10': [
      { name: 'Median Time-to-Implement', band: { min: 60, max: 180 }, alpha: 0.4, unit: 'days', currentValue: 125, trend: 'down', status: 'normal' },
      { name: 'Rework Share', band: { min: 0, max: 12 }, alpha: 0.4, unit: '%', currentValue: 8.5, trend: 'stable', status: 'normal' },
      { name: 'Backlog Size', band: { min: 0, max: 250 }, alpha: 0.3, unit: 'items', currentValue: 180, trend: 'down', status: 'normal' }
    ],
    'atlas-MES-L11': [
      { name: 'Active Conflicts', band: { min: 0, max: 8 }, alpha: 0.4, unit: 'count', currentValue: 5, trend: 'stable', status: 'normal' },
      { name: 'Time-to-Resolve', band: { min: 5, max: 30 }, alpha: 0.4, unit: 'days', currentValue: 18, trend: 'down', status: 'normal' },
      { name: 'Joint KPI Coverage', band: { min: 25, max: 70 }, alpha: 0.3, unit: '% missions', currentValue: 45, trend: 'up', status: 'normal' }
    ],
    'atlas-MES-L12': [
      { name: 'On-Time, On-Budget Share', band: { min: 65, max: 90 }, alpha: 0.3, unit: '% projects', currentValue: 78, trend: 'up', status: 'normal' },
      { name: 'Dispute Rate', band: { min: 0, max: 6 }, alpha: 0.3, unit: '% contracts', currentValue: 3.2, trend: 'stable', status: 'normal' },
      { name: 'Avg. Cost Variance', band: { min: -5, max: 5 }, alpha: 0.3, unit: '%', currentValue: 2.1, trend: 'stable', status: 'normal' }
    ],
    'atlas-MIC-L01': [
      { name: 'Buffer Days', band: { min: 30, max: 90 }, alpha: 0.4, unit: 'days', currentValue: 65, trend: 'down', status: 'normal' },
      { name: 'Hardship Rate', band: { min: 0, max: 12 }, alpha: 0.4, unit: '% HH', currentValue: 8.5, trend: 'up', status: 'warning' },
      { name: 'Savings Rate', band: { min: 8, max: 18 }, alpha: 0.3, unit: '% income', currentValue: 12.8, trend: 'stable', status: 'normal' }
    ],
    'atlas-MIC-L02': [
      { name: 'Missed Appointment Rate', band: { min: 0, max: 8 }, alpha: 0.4, unit: '%', currentValue: 5.2, trend: 'stable', status: 'normal' },
      { name: 'Adherence % Days Covered', band: { min: 65, max: 85 }, alpha: 0.4, unit: '%', currentValue: 74, trend: 'up', status: 'normal' },
      { name: 'Outcome Index', band: { min: 0.6, max: 0.85 }, alpha: 0.3, currentValue: 0.71, trend: 'up', status: 'normal' }
    ],
    'atlas-MIC-L03': [
      { name: 'Attendance Rate', band: { min: 85, max: 96 }, alpha: 0.3, unit: '%', currentValue: 91, trend: 'stable', status: 'normal' },
      { name: 'Learning Effort Index', band: { min: 0.5, max: 0.8 }, alpha: 0.3, currentValue: 0.68, trend: 'up', status: 'normal' },
      { name: 'Chronic Absence', band: { min: 0, max: 10 }, alpha: 0.3, unit: '% students', currentValue: 6.8, trend: 'down', status: 'normal' }
    ],
    'atlas-MIC-L04': [
      { name: 'Time-to-Fill', band: { min: 15, max: 45 }, alpha: 0.3, unit: 'days', currentValue: 32, trend: 'down', status: 'normal' },
      { name: 'Attrition Rate', band: { min: 0, max: 12 }, alpha: 0.3, unit: '%', currentValue: 9.2, trend: 'stable', status: 'normal' },
      { name: 'Offer Acceptance Rate', band: { min: 60, max: 90 }, alpha: 0.3, unit: '%', currentValue: 76, trend: 'up', status: 'normal' }
    ]
  };

  return indicatorData[loopId] || [];
};

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
    default: return <Activity className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'warning': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    default: return 'text-green-400';
  }
};

const IndicatorCard: React.FC<{ indicator: Indicator }> = ({ indicator }) => {
  const { name, band, alpha, unit, currentValue, trend, status } = indicator;
  const range = band.max - band.min;
  const progress = currentValue ? ((currentValue - band.min) / range) * 100 : 0;
  const isOutOfBand = currentValue !== undefined && (currentValue < band.min || currentValue > band.max);

  return (
    <Card className="glass-secondary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium text-foreground text-sm">{name}</h4>
            <div className="text-xs text-muted-foreground mt-1">
              Band: {band.min} ↔ {band.max} {unit}, α={alpha}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(trend)}
            {isOutOfBand && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
          </div>
        </div>

        {currentValue !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Value</span>
              <span className={`font-mono text-sm font-medium ${getStatusColor(status)}`}>
                {currentValue} {unit}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{band.min} {unit}</span>
                <span>{band.max} {unit}</span>
              </div>
              <Progress 
                value={Math.max(0, Math.min(100, progress))} 
                className="h-2"
              />
            </div>

            {isOutOfBand && (
              <div className="text-xs text-yellow-400 flex items-center gap-1 mt-2">
                <AlertTriangle className="w-3 h-3" />
                Out of band
              </div>
            )}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-muted/20">
          <div className="text-xs text-muted-foreground">
            <strong>α={alpha}</strong> - Smoothing factor for trend analysis
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const IndicatorsTab: React.FC<IndicatorsTabProps> = ({ loop }) => {
  const indicators = getIndicatorsForLoop(loop.id);
  const hasOutOfBandIndicators = indicators.some(indicator => 
    indicator.currentValue !== undefined && 
    (indicator.currentValue < indicator.band.min || indicator.currentValue > indicator.band.max)
  );

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
              <Target className="w-5 h-5" />
              Indicators & DE-Bands
            </CardTitle>
            <Badge variant={hasOutOfBandIndicators ? "destructive" : "secondary"}>
              {indicators.length} Indicators
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Key performance indicators with Deviation-Equilibrium (DE) bands for monitoring system health.
            DE-bands define normal operating ranges with alpha smoothing factors for trend analysis.
          </p>
        </CardContent>
      </Card>

      {/* Out of band warning */}
      {hasOutOfBandIndicators && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some indicators are currently outside their DE-bands. Review the flagged indicators below.
          </AlertDescription>
        </Alert>
      )}

      {/* Indicators Grid */}
      {indicators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map((indicator, index) => (
            <IndicatorCard key={index} indicator={indicator} />
          ))}
        </div>
      ) : (
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No indicators defined for this loop yet. Configure indicators and DE-bands to monitor system performance.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-sm">DE-Bands Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Band Types</h4>
              <div className="space-y-1 text-muted-foreground">
                <div>• <strong>Min ↔ Max:</strong> Normal operating range</div>
                <div>• <strong>α (Alpha):</strong> Smoothing factor (0-1)</div>
                <div>• <strong>Current Value:</strong> Latest measurement</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Status Indicators</h4>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span>Trending up</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-3 h-3 text-red-400" />
                  <span>Trending down</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-muted-foreground" />
                  <span>Stable</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-400" />
                  <span>Out of band</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IndicatorsTab;