import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import type { ResourceMetric } from '../../pages/missionControl/types';

interface ResourceHeatmapProps {
  resources: ResourceMetric[];
  className?: string;
}

export const ResourceHeatmap: React.FC<ResourceHeatmapProps> = ({
  resources,
  className = ''
}) => {
  const getUtilizationColor = (utilized: number, allocated: number) => {
    const percentage = (utilized / allocated) * 100;
    
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    if (percentage >= 50) return 'bg-primary';
    if (percentage >= 25) return 'bg-emerald-500';
    return 'bg-muted';
  };

  const getUtilizationIntensity = (utilized: number, allocated: number) => {
    const percentage = (utilized / allocated) * 100;
    return Math.min(percentage / 100, 1);
  };

  const getStatusVariant = (status: ResourceMetric['status']) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'healthy': return 'default';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: ResourceMetric['category']) => {
    switch (category) {
      case 'budget': return '💰';
      case 'personnel': return '👥';
      case 'infrastructure': return '🏗️';
      case 'tools': return '🛠️';
      default: return '📊';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
      }).format(value);
    }
    return `${value}${unit === 'people' ? '' : unit}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Heatmap grid */}
      <div className="grid grid-cols-2 gap-3">
        {resources.map((resource, index) => {
          const utilizationPercent = (resource.utilized / resource.allocated) * 100;
          const intensity = getUtilizationIntensity(resource.utilized, resource.allocated);

          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-3 rounded-lg border border-border/30 bg-background/30 hover:bg-background/50 transition-all cursor-pointer overflow-hidden"
            >
              {/* Background intensity */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: intensity * 0.3 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`absolute inset-0 ${getUtilizationColor(resource.utilized, resource.allocated)}`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getCategoryIcon(resource.category)}</span>
                    <Badge variant={getStatusVariant(resource.status)} className="text-xs">
                      {resource.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(utilizationPercent)}%
                  </div>
                </div>

                <h4 className="text-sm font-medium text-foreground mb-2 truncate">
                  {resource.name}
                </h4>

                {/* Utilization bar */}
                <div className="h-2 bg-muted/30 rounded-full mb-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${utilizationPercent}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${getUtilizationColor(resource.utilized, resource.allocated)}`}
                  />
                </div>

                {/* Resource details */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Used:</span>
                    <span className="text-foreground font-medium">
                      {formatValue(resource.utilized, resource.unit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="text-muted-foreground">
                      {formatValue(resource.allocated, resource.unit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="text-emerald-500">
                      {formatValue(resource.available, resource.unit)}
                    </span>
                  </div>
                </div>

                {/* Burn rate indicator */}
                <div className="mt-2 pt-2 border-t border-border/30">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Burn Rate:</span>
                    <span className={`${
                      resource.burnRate > resource.available * 0.1 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {formatValue(resource.burnRate, `${resource.unit}/day`)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-muted-foreground">&lt;50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-muted-foreground">50-75%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-muted-foreground">75-90%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-destructive" />
          <span className="text-muted-foreground">&gt;90%</span>
        </div>
      </div>
    </div>
  );
};