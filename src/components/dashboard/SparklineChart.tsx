import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  width?: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ 
  data, 
  color = '#30D158', 
  height = 60,
  width = '100%' 
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      
      // Set up the starting positions
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      // Trigger the animation
      setTimeout(() => {
        path.style.transition = 'stroke-dashoffset 600ms ease-in-out';
        path.style.strokeDashoffset = '0';
      }, 100);
    }
  }, [data]);

  if (!data || data.length < 2) {
    return (
      <div 
        style={{ height }} 
        className="w-full flex items-center justify-center text-gray-500 text-sm"
      >
        No data available
      </div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Create SVG path
  const pathData = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 80; // 80% of height for padding
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div style={{ height, width }} className="relative">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <path
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill={`url(#gradient-${color.replace('#', '')})`}
          opacity="0.6"
        />
        
        {/* Line */}
        <motion.path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((value - min) / range) * 80;
          
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="0.8"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: 0.6 + (index * 0.05),
                ease: "easeOut"
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};