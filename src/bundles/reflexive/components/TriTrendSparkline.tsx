import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkline } from '@/components/ui/sparkline';
import { TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TriTrendSparklineProps {
  triSeries: Array<{
    at: string;
    t_value: number;
    r_value: number;
    i_value: number;
    tag?: string;
  }>;
  slope?: number;
  confidence?: number;
}

export const TriTrendSparkline: React.FC<TriTrendSparklineProps> = ({
  triSeries,
  slope = 0,
  confidence = 0.8
}) => {
  if (!triSeries?.length) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No TRI data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate averages for each point
  const avgValues = triSeries.map(point => 
    (point.t_value + point.r_value + point.i_value) / 3
  );

  const tValues = triSeries.map(point => point.t_value);
  const rValues = triSeries.map(point => point.r_value);
  const iValues = triSeries.map(point => point.i_value);

  // Calculate basic statistics
  const avgT = tValues.reduce((sum, val) => sum + val, 0) / tValues.length;
  const avgR = rValues.reduce((sum, val) => sum + val, 0) / rValues.length;
  const avgI = iValues.reduce((sum, val) => sum + val, 0) / iValues.length;
  
  const variance = avgValues.reduce((sum, val) => sum + Math.pow(val - (avgT + avgR + avgI) / 3, 2), 0) / avgValues.length;

  const getSlopeColor = (slope: number) => {
    if (slope > 0.1) return 'bg-green-500/10 text-green-700 border-green-200';
    if (slope < -0.1) return 'bg-red-500/10 text-red-700 border-red-200';
    return 'bg-gray-500/10 text-gray-700 border-gray-200';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            TRI Trend Analysis
            <Badge variant="outline">{triSeries.length} points</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Sparklines */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Combined TRI</span>
                <span className="font-medium">
                  Avg: {((avgT + avgR + avgI) / 3).toFixed(3)}
                </span>
              </div>
              <Sparkline
                data={avgValues}
                width={280}
                height={60}
                color="hsl(var(--primary))"
                fillColor="hsl(var(--primary) / 0.1)"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-500">T</span>
                  <span>{avgT.toFixed(2)}</span>
                </div>
                <Sparkline
                  data={tValues}
                  width={80}
                  height={30}
                  color="#ef4444"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-500">R</span>
                  <span>{avgR.toFixed(2)}</span>
                </div>
                <Sparkline
                  data={rValues}
                  width={80}
                  height={30}
                  color="#22c55e"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-500">I</span>
                  <span>{avgI.toFixed(2)}</span>
                </div>
                <Sparkline
                  data={iValues}
                  width={80}
                  height={30}
                  color="#3b82f6"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
            <div>
              <Badge className={getSlopeColor(slope)} variant="outline">
                {slope > 0 ? '+' : ''}{slope.toFixed(3)}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">Slope</div>
            </div>

            <div>
              <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {Math.round(confidence * 100)}%
              </span>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>

            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center gap-1 cursor-help">
                      <span className="text-sm font-medium">
                        {variance.toFixed(3)}
                      </span>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Variance indicates system stability</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="text-xs text-muted-foreground">Variance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};