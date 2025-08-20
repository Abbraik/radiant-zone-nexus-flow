import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MessageSquare,
  ArrowRight,
  Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CheckpointConsoleProps {
  reading: {
    value: number;
    lower: number;
    upper: number;
    slope: number;
  };
  incidentId?: string | null;
  timelineEvents: Array<{
    id: number;
    timestamp: Date;
    kind: string;
    description: string;
    icon: any;
  }>;
  playbook?: {
    id: string;
    name: string;
    rationale: string;
    tasks: any[];
  };
  onStartSprint: () => void;
  isStartingSprint: boolean;
}

export const CheckpointConsole: React.FC<CheckpointConsoleProps> = ({
  reading,
  incidentId,
  timelineEvents,
  playbook,
  onStartSprint,
  isStartingSprint
}) => {
  const isInBand = reading.value >= reading.lower && reading.value <= reading.upper;
  const bandPosition = ((reading.value - reading.lower) / (reading.upper - reading.lower)) * 100;
  
  // Generate sparkline data points (mock)
  const sparklineData = Array.from({ length: 14 }, (_, i) => ({
    x: i,
    y: reading.value + (Math.random() - 0.5) * 5
  }));

  const getSeverityBadge = () => {
    if (reading.value > reading.upper * 1.2) return { variant: 'destructive' as const, label: 'Critical' };
    if (reading.value > reading.upper) return { variant: 'destructive' as const, label: 'High' };
    if (reading.value < reading.lower) return { variant: 'warning' as const, label: 'Low' };
    return { variant: 'success' as const, label: 'Normal' };
  };

  const severity = getSeverityBadge();

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Checkpoint Console
          </CardTitle>
          <Badge variant={severity.variant === 'warning' || severity.variant === 'success' ? 'secondary' : severity.variant}>
            {severity.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-foreground">
                {reading.value.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Band: {reading.lower}-{reading.upper}
              </div>
              <div className={`flex items-center gap-1 text-sm ${reading.slope > 0 ? 'text-destructive' : 'text-success'}`}>
                <TrendingUp className={`h-4 w-4 ${reading.slope < 0 ? 'rotate-180' : ''}`} />
                {reading.slope > 0 ? '+' : ''}{(reading.slope * 100).toFixed(1)}%
              </div>
            </div>
            
            {/* Sparkline */}
            <div className="w-32 h-8 relative">
              <svg width="100%" height="100%" className="text-primary">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  points={sparklineData.map(d => `${(d.x / 13) * 128},${32 - ((d.y - reading.lower) / (reading.upper - reading.lower)) * 32}`).join(' ')}
                />
              </svg>
            </div>
          </div>
          
          {/* Band Visualization */}
          <div className="relative">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success/30 absolute"
                style={{ left: '0%', width: '100%' }}
              />
              <div 
                className="h-full bg-primary absolute rounded-full transition-all duration-300"
                style={{ 
                  left: `${Math.max(0, Math.min(100, bandPosition))}%`,
                  width: '4px',
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{reading.lower}</span>
              <span>{reading.upper}</span>
            </div>
          </div>
        </div>

        {/* Incident Timeline */}
        {(incidentId || timelineEvents.length > 0) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Incident Timeline
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {timelineEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-sm py-1"
                >
                  <event.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground flex-1">{event.description}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                  </span>
                </motion.div>
              ))}
              {timelineEvents.length === 0 && (
                <div className="text-muted-foreground text-sm py-2">
                  No timeline events yet
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playbook Suggestion */}
        {playbook && !incidentId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Suggested playbook: {playbook.name}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {playbook.rationale}
                </p>
                <div className="text-xs text-muted-foreground">
                  {playbook.tasks.length} tasks ready to deploy
                </div>
              </div>
              <Button 
                size="sm"
                onClick={onStartSprint}
                disabled={isStartingSprint}
                className="ml-4"
              >
                {isStartingSprint ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Starting...
                  </>
                ) : (
                  <>
                    Apply & Start Sprint
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* No Incident State */}
        {!incidentId && !playbook && (
          <div className="text-center py-6 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              No active incident. Start a containment sprint if risk is rising.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};