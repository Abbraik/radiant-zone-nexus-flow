// Mini Chart Component for Indicators
// Lightweight visualization with band overlays

import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIndicatorSeries } from "@/hooks/useSignalsData";
import { cn } from "@/lib/utils";

interface IndicatorMiniChartProps {
  indicatorKey: string;
  title?: string;
  height?: number;
  showBands?: boolean;
  className?: string;
}

export function IndicatorMiniChart({ 
  indicatorKey, 
  title, 
  height = 60,
  showBands = true,
  className 
}: IndicatorMiniChartProps) {
  const { data: series, isLoading } = useIndicatorSeries(indicatorKey, {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  });

  // Generate SVG path for the data
  const chartData = useMemo(() => {
    if (!series || !series.data_points.length) return null;

    const points = series.data_points;
    const values = points.map(p => p.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    // Create SVG path
    const width = 300;
    const chartHeight = height - 20;
    
    const pathPoints = points.map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    });

    const smoothedPathPoints = points.map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = chartHeight - ((point.value_smoothed - minValue) / valueRange) * chartHeight;
      return `${x},${y}`;
    });

    // Band lines (if configured)
    let upperBandY, lowerBandY;
    if (showBands && series.band_config.upper_bound !== undefined) {
      upperBandY = chartHeight - ((series.band_config.upper_bound - minValue) / valueRange) * chartHeight;
    }
    if (showBands && series.band_config.lower_bound !== undefined) {
      lowerBandY = chartHeight - ((series.band_config.lower_bound - minValue) / valueRange) * chartHeight;
    }

    return {
      width,
      height: chartHeight,
      rawPath: `M${pathPoints.join(' L')}`,
      smoothedPath: `M${smoothedPathPoints.join(' L')}`,
      upperBandY,
      lowerBandY,
      latestValue: points[points.length - 1],
      valueRange: { min: minValue, max: maxValue },
    };
  }, [series, height, showBands]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-3">
          <div className="animate-pulse">
            <div className="h-3 bg-muted rounded w-24 mb-2" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || !series) {
    return (
      <Card className={className}>
        <CardContent className="p-3">
          <div className="flex items-center justify-center h-12 text-xs text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above': return 'text-orange-600 bg-orange-50';
      case 'below': return 'text-red-600 bg-red-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{title}</span>
            <Badge 
              variant="outline" 
              className={cn("text-xs", getStatusColor(chartData.latestValue.status))}
            >
              {chartData.latestValue.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="p-3">
        {/* SVG Chart */}
        <div className="relative">
          <svg 
            width={chartData.width} 
            height={height}
            className="w-full"
            viewBox={`0 0 ${chartData.width} ${height}`}
          >
            {/* Band zones */}
            {showBands && chartData.upperBandY !== undefined && chartData.lowerBandY !== undefined && (
              <rect
                x="0"
                y={Math.min(chartData.upperBandY, chartData.lowerBandY)}
                width={chartData.width}
                height={Math.abs(chartData.upperBandY - chartData.lowerBandY)}
                fill="hsl(var(--muted))"
                fillOpacity="0.3"
              />
            )}
            
            {/* Upper band line */}
            {showBands && chartData.upperBandY !== undefined && (
              <line
                x1="0"
                y1={chartData.upperBandY}
                x2={chartData.width}
                y2={chartData.upperBandY}
                stroke="hsl(var(--destructive))"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
            )}
            
            {/* Lower band line */}
            {showBands && chartData.lowerBandY !== undefined && (
              <line
                x1="0"
                y1={chartData.lowerBandY}
                x2={chartData.width}
                y2={chartData.lowerBandY}
                stroke="hsl(var(--destructive))"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.6"
              />
            )}
            
            {/* Raw data line */}
            <path
              d={chartData.rawPath}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1"
              opacity="0.4"
            />
            
            {/* Smoothed data line */}
            <path
              d={chartData.smoothedPath}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            
            {/* Latest value point */}
            <circle
              cx={chartData.width}
              cy={chartData.height - ((chartData.latestValue.value_smoothed - chartData.valueRange.min) / 
                   (chartData.valueRange.max - chartData.valueRange.min)) * chartData.height}
              r="3"
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Chart Footer */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Latest:</span>
            <span className="font-mono">
              {chartData.latestValue.value.toFixed(1)}
              {series.unit}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>Band pos:</span>
            <span className={cn(
              "font-mono",
              Math.abs(chartData.latestValue.band_pos) > 1 ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {chartData.latestValue.band_pos > 0 ? '+' : ''}{chartData.latestValue.band_pos.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}