import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { TensionLevel } from '../../types';

interface TensionChipProps {
  tension: TensionLevel;
  className?: string;
  showIcon?: boolean;
}

const tensionConfig = {
  high: {
    label: 'High Tension',
    icon: '🔥',
    className: 'tension-high'
  },
  medium: {
    label: 'Medium Tension', 
    icon: '⚡',
    className: 'tension-medium'
  },
  low: {
    label: 'Low Tension',
    icon: '🟢',
    className: 'tension-low'
  },
  neutral: {
    label: 'Neutral',
    icon: '⚪',
    className: 'bg-muted text-muted-foreground border border-border'
  }
};

export const TensionChip: React.FC<TensionChipProps> = ({
  tension,
  className,
  showIcon = true
}) => {
  const config = tensionConfig[tension];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn('tension-chip', config.className, className)}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </motion.div>
  );
};