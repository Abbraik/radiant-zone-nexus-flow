import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './badge';
import { formatDistanceToNow } from 'date-fns';
import type { Alert } from '../../pages/missionControl/types';

interface AlertTickerProps {
  alerts: Alert[];
  autoScroll?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  maxVisible?: number;
}

export const AlertTicker: React.FC<AlertTickerProps> = ({
  alerts,
  autoScroll = true,
  pauseOnHover = true,
  className = '',
  maxVisible = 4
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const visibleAlerts = alerts.slice(0, maxVisible);

  useEffect(() => {
    if (!autoScroll || isPaused || visibleAlerts.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleAlerts.length);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoScroll, isPaused, visibleAlerts.length]);

  const getAlertTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'error': return 'bg-destructive';
      case 'warning': return 'bg-warning';
      case 'success': return 'bg-emerald-500';
      default: return 'bg-primary';
    }
  };

  const getSeverityVariant = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div 
      className={`space-y-3 ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        {visibleAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20, height: 0 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              height: 'auto',
              scale: index === currentIndex ? 1.02 : 1
            }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ 
              duration: 0.3,
              type: 'spring',
              stiffness: 100
            }}
            className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
              index === currentIndex 
                ? 'bg-background/70 border-primary/50 shadow-lg' 
                : 'bg-background/50 border-border/30 hover:bg-background/70'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant={getSeverityVariant(alert.severity)}
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{alert.source}</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className={`w-1.5 h-1.5 rounded-full ${getAlertTypeColor(alert.type)}`}
                  />
                </div>
                
                <h4 className="text-sm text-foreground font-medium mb-1">
                  {alert.title}
                </h4>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {alert.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </span>
                  
                  {alert.actionable && (
                    <Badge variant="outline" className="text-xs">
                      Action Required
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className={`w-2 h-2 rounded-full ml-3 mt-1 ${getAlertTypeColor(alert.type)}`} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation dots */}
      {visibleAlerts.length > 1 && (
        <div className="flex justify-center gap-1 pt-2">
          {visibleAlerts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-muted hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};