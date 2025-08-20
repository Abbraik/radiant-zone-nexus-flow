import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow, differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

interface SRTCountdownProps {
  dueDate: Date;
  cadence: string;
  className?: string;
}

export const SRTCountdown: React.FC<SRTCountdownProps> = ({ 
  dueDate, 
  cadence, 
  className = '' 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const total = differenceInSeconds(dueDate, now);
      
      if (total <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const days = differenceInDays(dueDate, now);
      const hours = differenceInHours(dueDate, now) % 24;
      const minutes = differenceInMinutes(dueDate, now) % 60;
      const seconds = total % 60;

      setTimeRemaining({ days, hours, minutes, seconds, total });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [dueDate]);

  const getUrgencyLevel = () => {
    const hoursRemaining = timeRemaining.total / 3600;
    if (hoursRemaining <= 2) return 'critical';
    if (hoursRemaining <= 24) return 'warning';
    return 'normal';
  };

  const urgency = getUrgencyLevel();
  
  const formatTimeString = () => {
    if (timeRemaining.total <= 0) return 'Expired';
    
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours}h`;
    } else if (timeRemaining.hours > 0) {
      return `${timeRemaining.hours}h ${timeRemaining.minutes}m`;
    } else {
      return `${timeRemaining.minutes}m ${timeRemaining.seconds}s`;
    }
  };

  const getBadgeVariant = () => {
    switch (urgency) {
      case 'critical':
        return 'destructive' as const;
      case 'warning':
        return 'outline' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      animate={urgency === 'critical' ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: urgency === 'critical' ? Infinity : 0 }}
    >
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>SRT</span>
      </div>
      
      <Badge 
        variant={getBadgeVariant()} 
        className={`text-xs font-mono ${urgency === 'critical' ? 'animate-pulse' : ''} ${urgency === 'warning' ? 'border-warning text-warning' : ''}`}
      >
        {urgency === 'critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
        {formatTimeString()}
      </Badge>
      
      <div className="text-xs text-muted-foreground">
        {cadence}
      </div>
    </motion.div>
  );
};