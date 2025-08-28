import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { useIndicatorsData } from '@/hooks/useAdminData';

export const IndicatorsSection: React.FC = () => {
  const { indicators, bandCrossings, isLoading } = useIndicatorsData();

  const totalIndicators = indicators.length;
  const recentBreaches = bandCrossings.filter(bc => 
    new Date(bc.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  // Estimate in-band vs out-of-band based on recent breaches
  const outOfBandCount = recentBreaches.length;
  const inBandCount = Math.max(0, totalIndicators - outOfBandCount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Indicators & DE Bands</h2>
          <p className="text-sm text-foreground-muted">
            Manage indicators, detection bands, and signal processing
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Indicator
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Indicator Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Indicators</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge>{totalIndicators}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Band</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge className="bg-success/20 text-success border-success/30">{inBandCount}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Out of Band</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge className="bg-warning/20 text-warning border-warning/30">{outOfBandCount}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Recent Band Breaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))
                ) : bandCrossings.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No recent band breaches</p>
                ) : (
                  bandCrossings.slice(0, 5).map((crossing) => (
                    <div key={crossing.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          crossing.direction === 'above' || crossing.direction === 'below'
                            ? 'bg-warning/20' 
                            : 'bg-info/20'
                        }`}>
                          {crossing.direction === 'above' || crossing.direction === 'below' ? (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          ) : (
                            <TrendingUp className="h-4 w-4 text-info" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Loop {crossing.loop_id?.slice(0, 8)}...</p>
                          <p className="text-xs text-foreground-muted">
                            {crossing.direction} band - Value: {crossing.value?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        crossing.direction === 'above' || crossing.direction === 'below'
                          ? "bg-warning/20 text-warning border-warning/30"
                          : "bg-info/20 text-info border-info/30"
                      }>
                        {crossing.direction === 'above' || crossing.direction === 'below' ? 'Critical' : 'Normal'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};