import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, TrendingDown, Activity, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TriggerAlert } from '@/types/scorecard';

interface AlertRailProps {
  className?: string;
}

export const AlertRail: React.FC<AlertRailProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<TriggerAlert[]>([]);

  useEffect(() => {
    // Subscribe to band_crossings changes for real-time alerts
    const channel = supabase
      .channel('alert-rail')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'band_crossings'
        },
        (payload) => {
          console.log('New band crossing detected:', payload);
          
          // Create alert from band crossing
          const newAlert: TriggerAlert = {
            id: `breach-${payload.new.id}`,
            type: 'breach',
            severity: 'high',
            message: `Loop breach detected - value ${payload.new.value} crossed threshold`,
            loop_id: payload.new.loop_id,
            created_at: payload.new.at,
          };
          
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
          
          // Auto-remove after 30 seconds
          setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
          }, 30000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAlertIcon = (type: TriggerAlert['type']) => {
    switch (type) {
      case 'breach': return <AlertTriangle className="h-4 w-4" />;
      case 'slope': return <TrendingDown className="h-4 w-4" />;
      case 'fatigue': return <Activity className="h-4 w-4" />;
      case 'srt': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (severity: TriggerAlert['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'default';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-20 right-4 z-50 space-y-2 max-w-sm ${className}`}>
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          >
            <Alert variant={getAlertVariant(alert.severity)} className="shadow-lg backdrop-blur-sm">
              <div className="flex items-start gap-2">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {alert.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>
                  <AlertDescription className="text-sm">
                    {alert.message}
                  </AlertDescription>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissAlert(alert.id)}
                  className="h-6 w-6 p-0 hover:bg-background/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};