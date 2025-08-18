import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkline } from '@/components/ui/sparkline';
import { Play, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SimulationResult {
  before: {
    in_band_percentage: number;
    breach_count: number;
    avg_variance?: number;
  };
  after: {
    in_band_percentage: number;
    breach_count: number;
    avg_variance?: number;
  };
  improvement: {
    variance_reduction: number;
    false_positive_reduction: number;
    risk_grade: string;
  };
}

interface SimulationPreviewProps {
  simulation?: SimulationResult;
  isSimulating?: boolean;
  triSeries?: Array<{
    t_value: number;
    r_value: number;
    i_value: number;
  }>;
  lookbackDays?: number;
}

export const SimulationPreview: React.FC<SimulationPreviewProps> = ({
  simulation,
  isSimulating = false,
  triSeries = [],
  lookbackDays = 60
}) => {
  const getRiskColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'low': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getDeltaIcon = (before: number, after: number) => {
    if (after > before) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (after < before) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
  };

  if (isSimulating) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Running simulation...</p>
        </CardContent>
      </Card>
    );
  }

  if (!simulation) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="p-6 text-center">
          <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No simulation data</p>
          <p className="text-sm text-muted-foreground mt-1">
            Preview changes to see projected impact
          </p>
        </CardContent>
      </Card>
    );
  }

  const beforeAfterData = [
    { label: 'In-Band %', before: simulation.before.in_band_percentage, after: simulation.after.in_band_percentage },
    { label: 'Breaches', before: simulation.before.breach_count, after: simulation.after.breach_count },
  ];

  if (simulation.before.avg_variance !== undefined && simulation.after.avg_variance !== undefined) {
    beforeAfterData.push({
      label: 'Variance',
      before: simulation.before.avg_variance,
      after: simulation.after.avg_variance
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-sm border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Simulation Preview
            <Badge variant="outline">{lookbackDays} days lookback</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Before vs After Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Before Changes</h4>
              <div className="space-y-3">
                {beforeAfterData.map((metric, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                    <div className="text-lg font-bold">
                      {metric.label.includes('%') 
                        ? `${metric.before.toFixed(1)}%`
                        : metric.before.toFixed(metric.label === 'Variance' ? 3 : 0)
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">After Changes</h4>
              <div className="space-y-3">
                {beforeAfterData.map((metric, index) => (
                  <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      {metric.label}
                      {getDeltaIcon(metric.before, metric.after)}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {metric.label.includes('%') 
                        ? `${metric.after.toFixed(1)}%`
                        : metric.after.toFixed(metric.label === 'Variance' ? 3 : 0)
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Summary */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Expected Improvements</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Variance Reduction</span>
                  <span className="font-medium">
                    {Math.round(simulation.improvement.variance_reduction * 100)}%
                  </span>
                </div>
                <Progress value={simulation.improvement.variance_reduction * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">False Positive Reduction</span>
                  <span className="font-medium">
                    {Math.round(simulation.improvement.false_positive_reduction * 100)}%
                  </span>
                </div>
                <Progress value={simulation.improvement.false_positive_reduction * 100} className="h-2" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Risk Grade</span>
              <Badge className={getRiskColor(simulation.improvement.risk_grade)} variant="outline">
                {simulation.improvement.risk_grade} risk
              </Badge>
            </div>
          </div>

          {/* TRI Visualization */}
          {triSeries.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">TRI Trend Impact</h4>
              <div className="bg-muted/30 p-4 rounded-lg">
                <Sparkline
                  data={triSeries.map(point => (point.t_value + point.r_value + point.i_value) / 3)}
                  width={280}
                  height={60}
                  color="hsl(var(--primary))"
                  fillColor="hsl(var(--primary) / 0.1)"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Projected stability improvement based on proposed changes
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};