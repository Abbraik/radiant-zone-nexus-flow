import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface KeyStatProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
  decimals?: number;
}

export const KeyStat: React.FC<KeyStatProps> = ({ 
  icon, 
  label, 
  value, 
  suffix = '', 
  delay = 0,
  decimals = 0 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const animationRef = useRef<number>();
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Only animate once when component mounts
    if (hasAnimated.current) return;
    
    const timer = setTimeout(() => {
      hasAnimated.current = true;
      let start = 0;
      const duration = 1000; // 1 second
      const increment = value / (duration / 16); // 60fps
      
      const animate = () => {
        start += increment;
        if (start >= value) {
          setAnimatedValue(value);
        } else {
          setAnimatedValue(start);
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animate();
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty dependency array to run only once

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-2xl font-semibold text-white">
          {animatedValue.toFixed(decimals)}{suffix}
        </div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </motion.div>
  );
};