import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ChevronDown, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface BreachTimelineProps {
  breachTimeline: Array<{
    at: string;
    breach_type: string;
    value: number;
    threshold_value: number;
    severity_score: number;
    duration_minutes: number;
  }>;
}

export const BreachTimeline: React.FC<BreachTimelineProps> = ({
  breachTimeline
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!breachTimeline?.length) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 mb-2">✓</div>
          <p className="text-sm text-green-700">No breaches in recent history</p>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'bg-red-500/10 text-red-700 border-red-200';
    if (severity >= 3) return 'bg-orange-500/10 text-orange-700 border-orange-200';
    if (severity >= 2) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    return 'bg-gray-500/10 text-gray-700 border-gray-200';
  };

  const getBreachTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'upper': return '↗';
      case 'lower': return '↙';
      case 'return': return '↩';
      default: return '⚠';
    }
  };

  const totalDuration = breachTimeline.reduce((sum, breach) => sum + breach.duration_minutes, 0);
  const avgSeverity = breachTimeline.reduce((sum, breach) => sum + breach.severity_score, 0) / breachTimeline.length;
  const recentBreaches = breachTimeline.filter(breach => 
    new Date(breach.at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Breach Timeline
              <Badge variant="outline">{breachTimeline.length} events</Badge>
            </CardTitle>
            
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Details
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-red-600">{recentBreaches}</div>
              <div className="text-xs text-muted-foreground">Last 7 days</div>
            </div>
            
            <div>
              <div className="text-lg font-bold text-orange-600">
                {Math.round(totalDuration / 60)}h
              </div>
              <div className="text-xs text-muted-foreground">Total duration</div>
            </div>
            
            <div>
              <div className="text-lg font-bold">
                {avgSeverity.toFixed(1)}/5
              </div>
              <div className="text-xs text-muted-foreground">Avg severity</div>
            </div>
          </div>

          {/* Recent Breaches Preview */}
          <div className="space-y-2">
            {breachTimeline.slice(0, 3).map((breach, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getBreachTypeIcon(breach.breach_type)}</span>
                  <div>
                    <div className="text-sm font-medium">
                      {breach.breach_type} breach
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(breach.at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={getSeverityColor(breach.severity_score)} variant="outline">
                    Severity {breach.severity_score}
                  </Badge>
                  {breach.duration_minutes > 0 && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.round(breach.duration_minutes)}min
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Timeline */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent className="space-y-2 pt-4 border-t">
              {breachTimeline.slice(3).map((breach, index) => (
                <div
                  key={index + 3}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getBreachTypeIcon(breach.breach_type)}</span>
                    <div>
                      <div className="text-sm font-medium">
                        {breach.breach_type} breach
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(breach.at), 'MMM dd, HH:mm')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Value: {breach.value.toFixed(2)} (threshold: {breach.threshold_value.toFixed(2)})
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={getSeverityColor(breach.severity_score)} variant="outline">
                      {breach.severity_score}
                    </Badge>
                    {breach.duration_minutes > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(breach.duration_minutes)}min
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
};