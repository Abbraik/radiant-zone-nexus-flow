import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import type { DigitalTwinData } from '../../pages/missionControl/types';

interface DigitalTwinThumbnailProps {
  twin: DigitalTwinData;
  onClick?: () => void;
  className?: string;
}

export const DigitalTwinThumbnail: React.FC<DigitalTwinThumbnailProps> = ({
  twin,
  onClick,
  className = ''
}) => {
  const getStatusColor = (status: DigitalTwinData['status']) => {
    switch (status) {
      case 'running': return 'bg-emerald-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getStatusVariant = (status: DigitalTwinData['status']) => {
    switch (status) {
      case 'running': return 'default';
      case 'completed': return 'secondary';
      case 'paused': return 'outline';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  // Create mini sparkline path from response data
  const createSparklinePath = (data: number[]) => {
    if (data.length < 2) return '';
    
    const width = 60;
    const height = 20;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative p-3 rounded-lg border border-border/30 
        bg-background/30 hover:bg-background/50 
        transition-all duration-200 cursor-pointer
        overflow-hidden ${className}
      `}
    >
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(twin.status)}`} />
        <Badge variant={getStatusVariant(twin.status)} className="text-xs">
          {twin.status}
        </Badge>
      </div>

      {/* Twin name */}
      <h4 className="text-xs font-medium text-foreground mb-1 truncate">
        {twin.name}
      </h4>

      {/* Type */}
      <p className="text-xs text-muted-foreground mb-2 capitalize">
        {twin.type}
      </p>

      {/* Mini metrics */}
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="text-center">
          <div className="text-xs font-medium text-foreground">
            {twin.metrics.efficiency}%
          </div>
          <div className="text-xs text-muted-foreground">Eff</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-medium text-foreground">
            {twin.metrics.quality}%
          </div>
          <div className="text-xs text-muted-foreground">Qual</div>
        </div>
      </div>

      {/* Mini sparkline */}
      <div className="flex items-center justify-center h-5">
        <svg width="60" height="20" className="overflow-visible">
          <motion.path
            d={createSparklinePath(twin.responseData)}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          
          {/* Data points */}
          {twin.responseData.map((value, index) => {
            const max = Math.max(...twin.responseData);
            const min = Math.min(...twin.responseData);
            const range = max - min || 1;
            const x = (index / (twin.responseData.length - 1)) * 60;
            const y = 20 - ((value - min) / range) * 20;
            
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="hsl(var(--primary))"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.2 }}
              />
            );
          })}
        </svg>
      </div>

      {/* Last run time */}
      <div className="text-xs text-muted-foreground mt-1">
        {twin.lastRun && (
          <span>
            Last: {new Date(twin.lastRun).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-primary/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};