// Signals Summary Card Component
// Shows loop-level signal scores and data quality status

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Database,
  Zap
} from "lucide-react";
import { useLoopSignalsOverview } from "@/hooks/useSignalsData";
import { cn } from "@/lib/utils";

interface SignalsSummaryCardProps {
  loopId: string;
  onDataTriageClick?: () => void;
  className?: string;
}

export function SignalsSummaryCard({ 
  loopId, 
  onDataTriageClick,
  className 
}: SignalsSummaryCardProps) {
  const { 
    summary, 
    indicators, 
    dataQualityIssues, 
    healthScore, 
    actionBlocked, 
    isLoading 
  } = useLoopSignalsOverview(loopId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Live Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Live Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No signals data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: number) => {
    if (severity < 0.5) return 'text-green-600 bg-green-50';
    if (severity < 1.0) return 'text-yellow-600 bg-yellow-50';
    if (severity < 1.5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getHealthColor = (score: number) => {
    if (score > 0.8) return 'text-green-600';
    if (score > 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Live Signals</span>
            <Badge variant="outline" className="text-xs">
              {summary.window}
            </Badge>
          </div>
          <div className={cn("text-sm font-mono", getHealthColor(healthScore))}>
            {Math.round(healthScore * 100)}%
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Data Quality Alert */}
        {actionBlocked && (
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <AlertDescription className="text-sm">
              <div className="flex items-center justify-between">
                <span>Data quality issues detected</span>
                {onDataTriageClick && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onDataTriageClick}
                    className="ml-2 h-6 text-xs"
                  >
                    Open Data Triage
                  </Button>
                )}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {summary.action_readiness.reasons.join(', ')}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Signal Scores Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Severity (ε)</span>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getSeverityColor(summary.scores.severity))}
              >
                {summary.scores.severity.toFixed(2)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Persistence (π)</span>
              <span className="font-mono text-xs">
                {Math.round(summary.scores.persistence * 100)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Dispersion (δ)</span>
              <span className="font-mono text-xs">
                {Math.round(summary.scores.dispersion * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Hub Load (η)</span>
              <span className="font-mono text-xs">
                {summary.scores.hub_load.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Indicators Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Indicators ({summary.indicators.length})
            </span>
            {dataQualityIssues.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {dataQualityIssues.length} DQ issues
              </Badge>
            )}
          </div>
          
          <div className="grid gap-2">
            {summary.indicators.slice(0, 4).map(indicator => (
              <div 
                key={indicator.indicator_key}
                className="flex items-center justify-between p-2 rounded bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    indicator.status === 'in_band' ? 'bg-green-500' :
                    indicator.status === 'above' ? 'bg-orange-500' : 'bg-red-500'
                  )} />
                  <span className="text-xs truncate max-w-[120px]">
                    {indicator.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono">
                    {indicator.latest_value.toFixed(1)}{indicator.unit}
                  </span>
                  {indicator.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
                  {indicator.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
                  {indicator.trend === 'stable' && <Minus className="w-3 h-3 text-gray-400" />}
                </div>
              </div>
            ))}
            
            {summary.indicators.length > 4 && (
              <div className="text-center py-1">
                <span className="text-xs text-muted-foreground">
                  +{summary.indicators.length - 4} more indicators
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Footer */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3" />
            <span>
              Last update: {new Date(summary.as_of).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span className={cn(
              actionBlocked ? 'text-destructive' : 'text-green-600'
            )}>
              {actionBlocked ? 'Blocked' : 'Ready'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}