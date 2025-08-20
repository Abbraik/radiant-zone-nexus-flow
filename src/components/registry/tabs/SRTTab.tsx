import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Calendar, Zap, Timer, Info } from 'lucide-react';
import { LoopData } from '@/types/loop-registry';

interface SRTTabProps {
  loop: LoopData;
}

interface SRTConfig {
  reflexHorizon: string;
  cadence: string;
  description?: string;
  reviewFrequency?: string;
  escalationThreshold?: string;
}

// Sample data mapping - in production this would come from the loop metadata
const getSRTForLoop = (loopId: string): SRTConfig | null => {
  const srtData: Record<string, SRTConfig> = {
    'atlas-MAC-L05': {
      reflexHorizon: 'P90D',
      cadence: 'Quarterly review',
      description: 'Medium-term capital cycle monitoring with quarterly strategic reviews',
      reviewFrequency: 'Every 3 months',
      escalationThreshold: '2 consecutive quarters off-target'
    },
    'atlas-MAC-L06': {
      reflexHorizon: 'P90D',
      cadence: 'Quarterly',
      description: 'External demand and competitiveness tracking',
      reviewFrequency: 'Every 3 months',
      escalationThreshold: 'REER deviation > ±5% for 30 days'
    },
    'atlas-MAC-L07': {
      reflexHorizon: 'P180D',
      cadence: 'Semiannual',
      description: 'Long-term ecological and resource sustainability monitoring',
      reviewFrequency: 'Every 6 months',
      escalationThreshold: 'Ceiling breach for 2+ periods'
    },
    'atlas-MAC-L08': {
      reflexHorizon: 'P90D',
      cadence: 'Quarterly',
      description: 'Social cohesion and national legitimacy assessment',
      reviewFrequency: 'Every 3 months',
      escalationThreshold: 'Trust index < 0.55 for 2 periods'
    },
    'atlas-MAC-L09': {
      reflexHorizon: 'P60D',
      cadence: 'Bi-monthly',
      description: 'Rapid response system resilience monitoring',
      reviewFrequency: 'Every 2 months',
      escalationThreshold: 'Response latency > 5 days'
    },
    'atlas-MAC-L10': {
      reflexHorizon: 'P365D',
      cadence: 'Annual (with mid-year scan)',
      description: 'Long-term human capital development tracking',
      reviewFrequency: 'Yearly with 6-month checkpoint',
      escalationThreshold: 'Two consecutive years of decline'
    },
    'atlas-MES-L06': {
      reflexHorizon: 'P30D',
      cadence: 'Monthly',
      description: 'High-frequency transport system monitoring',
      reviewFrequency: 'Every month',
      escalationThreshold: 'Peak congestion > 40% for 1 week'
    },
    'atlas-MES-L07': {
      reflexHorizon: 'P60D',
      cadence: 'Bi-monthly (monthly during peak season)',
      description: 'Energy system reliability with seasonal adjustments',
      reviewFrequency: 'Every 2 months, monthly May-September',
      escalationThreshold: 'Reserve margin < 15% for 2 periods'
    },
    'atlas-MES-L08': {
      reflexHorizon: 'P90D',
      cadence: 'Quarterly',
      description: 'Water security and infrastructure monitoring',
      reviewFrequency: 'Every 3 months',
      escalationThreshold: 'Stress index > 0.8 or NRW > 25%'
    },
    'atlas-MES-L09': {
      reflexHorizon: 'P30D',
      cadence: 'Monthly',
      description: 'Digital services performance monitoring',
      reviewFrequency: 'Every month',
      escalationThreshold: 'Uptime < 99% or error rate > 8/1k'
    }
  };

  return srtData[loopId] || null;
};

const parseReflexHorizon = (horizon: string) => {
  const match = horizon.match(/P(\d+)([DM])/);
  if (!match) return { value: horizon, unit: '', days: 0 };
  
  const value = parseInt(match[1]);
  const unit = match[2] === 'D' ? 'Days' : 'Months';
  const days = match[2] === 'D' ? value : value * 30;
  
  return { value, unit, days };
};

const getCadenceFrequency = (cadence: string): string => {
  if (cadence.toLowerCase().includes('monthly')) return 'High';
  if (cadence.toLowerCase().includes('quarterly')) return 'Medium';
  if (cadence.toLowerCase().includes('annual')) return 'Low';
  if (cadence.toLowerCase().includes('bi-monthly')) return 'Medium-High';
  if (cadence.toLowerCase().includes('semiannual')) return 'Low-Medium';
  return 'Variable';
};

const SRTTab: React.FC<SRTTabProps> = ({ loop }) => {
  const srtConfig = getSRTForLoop(loop.id);
  
  if (!srtConfig) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card className="glass-secondary">
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No SRT (Sensing Response Time) and Cadence configuration defined for this loop yet.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const reflexHorizon = parseReflexHorizon(srtConfig.reflexHorizon);
  const frequency = getCadenceFrequency(srtConfig.cadence);

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
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            SRT & Cadence Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sensing Response Time (SRT) defines how quickly the system detects and responds to changes.
            Cadence sets the rhythm for regular monitoring and review cycles.
          </p>
        </CardContent>
      </Card>

      {/* SRT Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Reflex Horizon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-muted/10 rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">
                {reflexHorizon.value}
              </div>
              <div className="text-lg text-muted-foreground mb-1">
                {reflexHorizon.unit}
              </div>
              <div className="text-sm text-muted-foreground">
                ({reflexHorizon.days} days total)
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Time Window:</span> {srtConfig.reflexHorizon}
              </div>
              <div>
                <span className="font-medium">Purpose:</span> Detection and initial response timeframe
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Review Cadence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-muted/10 rounded-lg">
              <div className="text-lg font-bold text-primary mb-2">
                {srtConfig.cadence}
              </div>
              <Badge variant="secondary" className="mb-2">
                {frequency} Frequency
              </Badge>
              <div className="text-sm text-muted-foreground">
                {srtConfig.reviewFrequency}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Details */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Configuration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {srtConfig.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-foreground mt-1">{srtConfig.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Review Schedule</label>
              <div className="text-foreground mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                {srtConfig.reviewFrequency}
              </div>
            </div>

            {srtConfig.escalationThreshold && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Escalation Trigger</label>
                <div className="text-foreground mt-1">
                  {srtConfig.escalationThreshold}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timing Analysis */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg">Timing Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="font-semibold text-primary">Response Speed</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {reflexHorizon.days < 60 ? 'Fast' : reflexHorizon.days < 180 ? 'Medium' : 'Slow'}
              </div>
              <div className="text-muted-foreground">
                {reflexHorizon.days} day window
              </div>
            </div>

            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="font-semibold text-primary">Review Intensity</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {frequency}
              </div>
              <div className="text-muted-foreground">
                Monitoring frequency
              </div>
            </div>

            <div className="text-center p-4 bg-muted/10 rounded-lg">
              <div className="font-semibold text-primary">Responsiveness</div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {reflexHorizon.days < 30 && frequency === 'High' ? 'High' :
                 reflexHorizon.days < 90 && frequency !== 'Low' ? 'Medium' : 'Low'}
              </div>
              <div className="text-muted-foreground">
                Overall system agility
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SRTTab;