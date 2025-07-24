import React from 'react';
import { motion } from 'framer-motion';

interface GaugeProps {
  value: number; // 0-100
  size?: number; // diameter in pixels
  thickness?: number; // stroke width
  className?: string;
  label?: string;
  showValue?: boolean;
  color?: string;
  backgroundColor?: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  size = 200,
  thickness = 8,
  className = '',
  label = 'Health',
  showValue = true,
  color = 'hsl(var(--primary))',
  backgroundColor = 'hsl(var(--muted))'
}) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={thickness}
          opacity={0.3}
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Glow effect for high values */}
        {value > 80 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness / 2}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            opacity={0.4}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {showValue && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold text-foreground"
          >
            {Math.round(value)}%
          </motion.div>
        )}
        {label && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {label}
          </motion.div>
        )}
      </div>
    </div>
  );
};