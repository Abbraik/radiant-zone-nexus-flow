import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Eye, 
  ExternalLink, 
  CheckCircle,
  Clock,
  Target,
  Pause,
  Play
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
}

interface Watchpoint {
  id: string;
  name: string;
  status: 'active' | 'on-hold' | 'triggered';
}

interface AlertsWatchpointsProps {
  alerts: Alert[];
  watchpoints: Watchpoint[];
  onAckAlert: (alertId: string) => void;
  onRouteAlert?: (alertId: string) => void;
  onOpenAlert?: (alertId: string) => void;
}

export const AlertsWatchpoints: React.FC<AlertsWatchpointsProps> = ({
  alerts,
  watchpoints,
  onAckAlert,
  onRouteAlert,
  onOpenAlert
}) => {
  const getSeverityBadge = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return { variant: 'destructive' as const, label: 'High' };
      case 'medium':
        return { variant: 'warning' as const, label: 'Med' };
      case 'low':
        return { variant: 'secondary' as const, label: 'Low' };
    }
  };

  const getWatchpointStatus = (status: Watchpoint['status']) => {
    switch (status) {
      case 'active':
        return { 
          variant: 'success' as const, 
          label: 'Active',
          icon: Play
        };
      case 'on-hold':
        return { 
          variant: 'secondary' as const, 
          label: 'On Hold',
          icon: Pause
        };
      case 'triggered':
        return { 
          variant: 'destructive' as const, 
          label: 'Triggered',
          icon: AlertTriangle
        };
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Alerts & Watchpoints
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alerts Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-foreground">Recent Alerts</h4>
            <Badge variant="outline" className="text-xs">
              {alerts.length}
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {alerts.slice(0, 3).map((alert, index) => {
              const severity = getSeverityBadge(alert.severity);
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border border-border rounded-lg bg-card/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={severity.variant === 'warning' ? 'destructive' : severity.variant} className="text-xs">
                      {severity.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3">
                    {alert.message}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAckAlert(alert.id)}
                      className="text-xs"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ack
                    </Button>
                    {onRouteAlert && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRouteAlert(alert.id)}
                        className="text-xs"
                      >
                        Route
                      </Button>
                    )}
                    {onOpenAlert && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenAlert(alert.id)}
                        className="text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {alerts.length === 0 && (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No recent alerts
              </div>
            )}
          </div>
        </div>

        {/* Watchpoints Section */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-medium text-foreground">Armed Watchpoints</h4>
            <Badge variant="outline" className="text-xs">
              {watchpoints.filter(w => w.status === 'active').length} active
            </Badge>
          </div>
          
          <div className="space-y-2">
            {watchpoints.map((watchpoint, index) => {
              const status = getWatchpointStatus(watchpoint.status);
              return (
                <motion.div
                  key={watchpoint.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-2 border border-border rounded bg-card/30"
                >
                  <div className="flex items-center gap-2">
                    <status.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {watchpoint.name}
                    </span>
                  </div>
                  <Badge variant={status.variant === 'success' ? 'secondary' : status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                </motion.div>
              );
            })}
            
            {watchpoints.length === 0 && (
              <div className="text-center py-3 text-muted-foreground text-sm">
                No active watchpoints
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-border">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View All Alerts
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              <Target className="h-3 w-3 mr-1" />
              Configure Watchpoints
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};