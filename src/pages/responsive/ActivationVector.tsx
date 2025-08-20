import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivationVectorProps {
  scores: {
    responsive: number;
    reflexive?: number;
    deliberative?: number;
    anticipatory?: number;
    structural?: number;
  };
}

export const ActivationVector: React.FC<ActivationVectorProps> = ({ scores }) => {
  const capacities = [
    { key: 'responsive', label: 'R', color: 'bg-destructive', score: scores.responsive || 0 },
    { key: 'reflexive', label: 'Rx', color: 'bg-warning', score: scores.reflexive || 0 },
    { key: 'deliberative', label: 'D', color: 'bg-info', score: scores.deliberative || 0 },
    { key: 'anticipatory', label: 'A', color: 'bg-success', score: scores.anticipatory || 0 },
    { key: 'structural', label: 'S', color: 'bg-secondary', score: scores.structural || 0 }
  ];

  const primaryCapacity = capacities.find(c => c.key === 'responsive');
  const maxScore = Math.max(...capacities.map(c => c.score));

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            {capacities.map((capacity, index) => (
              <motion.div
                key={capacity.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <div className={`
                  w-6 h-6 rounded-sm border border-border flex items-center justify-center text-xs font-bold
                  ${capacity.key === 'responsive' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  ${capacity.score === maxScore && capacity.score > 0 ? 'ring-2 ring-primary/50' : ''}
                `}>
                  {capacity.label}
                </div>
                
                {/* Score bar */}
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${capacity.score * 100}%` }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                    className={`h-full ${
                      capacity.key === 'responsive' ? 'bg-primary' :
                      capacity.score > 0.7 ? 'bg-success' :
                      capacity.score > 0.4 ? 'bg-warning' : 'bg-muted-foreground'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">5C Activation Vector</div>
            {capacities.map(capacity => (
              <div key={capacity.key} className="flex items-center justify-between gap-3 text-xs">
                <span className="capitalize">{capacity.key}:</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        capacity.key === 'responsive' ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                      style={{ width: `${capacity.score * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">
                    {Math.round(capacity.score * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};