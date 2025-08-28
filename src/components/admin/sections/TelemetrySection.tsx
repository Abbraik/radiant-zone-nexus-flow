import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, BarChart3, Clock, Zap } from 'lucide-react';
import { useTelemetryData } from '@/hooks/useAdminData';

export const TelemetrySection: React.FC = () => {
  const { data: telemetry, isLoading } = useTelemetryData();

  const formatTrend = (value: number) => {
    if (value > 0) return `↑ ${value.toFixed(1)}%`;
    if (value < 0) return `↓ ${Math.abs(value).toFixed(1)}%`;
    return '→ 0%';
  };

  const getTrendColor = (value: number, isErrorRate = false) => {
    const isPositive = isErrorRate ? value < 0 : value > 0;
    return isPositive 
      ? "bg-success/20 text-success border-success/30"
      : "bg-warning/20 text-warning border-warning/30";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Telemetry</h2>
        <p className="text-sm text-foreground-muted">
          System performance metrics and operational insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Task Throughput
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">{telemetry?.taskThroughput || 0}</div>
                <p className="text-xs text-foreground-muted">
                  Tasks completed today
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {telemetry?.avgResponseTime ? `${telemetry.avgResponseTime.toFixed(1)}h` : 'N/A'}
                </div>
                <p className="text-xs text-foreground-muted">
                  {(telemetry?.avgResponseTime || 0) < 4 ? 'Below 4h SLA target' : 'Above SLA target'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              System Load
            </CardTitle>
            <Zap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {telemetry?.systemLoad ? `${telemetry.systemLoad.toFixed(0)}%` : 'N/A'}
                </div>
                <p className="text-xs text-foreground-muted">
                  {(telemetry?.systemLoad || 0) < 80 ? 'Optimal range' : 'High load'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Data Quality
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {telemetry?.dataQuality ? `${telemetry.dataQuality.toFixed(0)}%` : 'N/A'}
                </div>
                <p className="text-xs text-foreground-muted">
                  {(telemetry?.dataQuality || 0) > 90 ? 'Above quality threshold' : 'Below quality threshold'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Task Completion Rate</span>
                    <Badge className={getTrendColor(telemetry?.completionTrend || 0)}>
                      {formatTrend(telemetry?.completionTrend || 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Processing Time</span>
                    <Badge className={getTrendColor(-(telemetry?.processingTime || 0))}>
                      {telemetry?.processingTime ? `${telemetry.processingTime.toFixed(1)}h` : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <Badge className={getTrendColor(-(telemetry?.errorRate || 0), true)}>
                      {telemetry?.errorRate ? `${telemetry.errorRate.toFixed(1)}%` : 'N/A'}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Usage</span>
                <Badge variant="outline">45%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <Badge variant="outline">62%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connections</span>
                <Badge variant="outline">18/50</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};