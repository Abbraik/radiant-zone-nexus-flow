// Data Quality Banner Component
// Shows data quality warnings and provides access to triage tasks

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Database, 
  Clock, 
  TrendingDown,
  ExternalLink 
} from "lucide-react";
import { useDQStatus } from "@/hooks/useSignalsData";
import { cn } from "@/lib/utils";

interface DataQualityBannerProps {
  loopId?: string;
  indicatorKey?: string;
  onTriageClick?: () => void;
  className?: string;
}

export function DataQualityBanner({ 
  loopId, 
  indicatorKey, 
  onTriageClick,
  className 
}: DataQualityBannerProps) {
  const { data: dqStatuses, isLoading } = useDQStatus(
    { sourceId: undefined, indicatorKey },
    { refetchInterval: 60000 }
  );

  if (isLoading || !dqStatuses?.length) {
    return null;
  }

  // Filter to show only problematic statuses
  const issues = dqStatuses.filter(status => status.quality !== 'good');
  
  if (!issues.length) {
    return null;
  }

  const criticalIssues = issues.filter(status => status.quality === 'bad');
  const warnings = issues.filter(status => status.quality === 'warn');

  const getIssueIcon = (issue: typeof issues[0]) => {
    if (issue.schema_drift) return <TrendingDown className="w-4 h-4" />;
    if (issue.staleness_seconds > 86400) return <Clock className="w-4 h-4" />;
    return <Database className="w-4 h-4" />;
  };

  const getIssueDescription = (issue: typeof issues[0]) => {
    const problems: string[] = [];
    
    if (issue.missingness > 0.1) {
      problems.push(`${Math.round(issue.missingness * 100)}% missing data`);
    }
    
    if (issue.staleness_seconds > 3600) {
      const hours = Math.round(issue.staleness_seconds / 3600);
      problems.push(`${hours}h stale`);
    }
    
    if (issue.schema_drift) {
      problems.push('schema drift detected');
    }
    
    if (issue.outlier_rate > 0.05) {
      problems.push(`${Math.round(issue.outlier_rate * 100)}% outliers`);
    }

    return problems.join(', ') || 'data quality degraded';
  };

  return (
    <Alert 
      className={cn(
        "border-l-4",
        criticalIssues.length > 0 
          ? "border-l-destructive bg-destructive/5 border-destructive/30" 
          : "border-l-warning bg-warning/5 border-warning/30",
        className
      )}
    >
      <AlertTriangle className={cn(
        "w-4 h-4",
        criticalIssues.length > 0 ? "text-destructive" : "text-warning"
      )} />
      
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">
                Data Quality Issues Detected
              </span>
              <div className="flex gap-1">
                {criticalIssues.length > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {criticalIssues.length} critical
                  </Badge>
                )}
                {warnings.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {warnings.length} warnings
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-1">
              {issues.slice(0, 3).map((issue, index) => (
                <div 
                  key={`${issue.source_id}-${issue.indicator_key}-${index}`}
                  className="flex items-center gap-2 text-xs"
                >
                  {getIssueIcon(issue)}
                  <span className="text-muted-foreground">
                    {issue.indicator_key}:
                  </span>
                  <span>{getIssueDescription(issue)}</span>
                </div>
              ))}
              
              {issues.length > 3 && (
                <div className="text-xs text-muted-foreground pl-6">
                  +{issues.length - 3} more issues affecting data reliability
                </div>
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Automated capacity actions are blocked until data quality is restored.
            </div>
          </div>

          {onTriageClick && (
            <Button
              size="sm"
              variant="outline"
              onClick={onTriageClick}
              className="ml-4 h-8"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open Data Triage
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Compact version for smaller spaces
 */
export function DataQualityIndicator({ 
  loopId, 
  className 
}: { 
  loopId: string; 
  className?: string;
}) {
  const { data: dqStatuses } = useDQStatus();
  
  if (!dqStatuses?.length) {
    return null;
  }

  const issues = dqStatuses.filter(status => status.quality !== 'good');
  const hasCritical = issues.some(status => status.quality === 'bad');

  if (!issues.length) {
    return (
      <Badge variant="secondary" className={cn("text-xs", className)}>
        <Database className="w-3 h-3 mr-1" />
        Data OK
      </Badge>
    );
  }

  return (
    <Badge 
      variant={hasCritical ? "destructive" : "secondary"} 
      className={cn("text-xs", className)}
    >
      <AlertTriangle className="w-3 h-3 mr-1" />
      {issues.length} DQ issues
    </Badge>
  );
}