import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Clock, 
  ExternalLink,
  Check,
  Bell,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { LoopAlert, AlertSeverity } from '../../types/monitor';

interface AlertSystemProps {
  alerts?: LoopAlert[];
  onAlertClick?: (alert: LoopAlert) => void;
  onAlertAcknowledge?: (alertId: string) => void;
  onAlertResolve?: (alertId: string) => void;
  maxVisible?: number;
}

// Mock alerts data
const mockAlerts: LoopAlert[] = [
  {
    id: 'alert-1',
    loopId: 'micro-2',
    type: 'breach',
    severity: 'critical',
    title: 'Environmental Impact Assessment: Critical DE-Band Breach',
    message: 'TRI Score dropped to 4.8, below critical threshold of 5.0. Task rework rate at 35%.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    acknowledged: false,
    actionRequired: true,
    contextUrl: '/monitor/micro-2',
  },
  {
    id: 'alert-2',
    loopId: 'meso-2',
    type: 'threshold',
    severity: 'warning',
    title: 'Compliance Enforcement: Throughput Rate Below Target',
    message: 'Process throughput rate at 78%, below target of 85%. Pilot success rate declining.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    acknowledged: true,
    actionRequired: false,
    contextUrl: '/monitor/meso-2',
  },
  {
    id: 'alert-3',
    loopId: 'macro-2',
    type: 'trend',
    severity: 'warning',
    title: 'Environmental Quality: Declining Trend Detected',
    message: 'TRI Score trending downward over past 4 periods. Current: 6.2, trend: -0.15/period.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    acknowledged: false,
    actionRequired: true,
    contextUrl: '/monitor/macro-2',
  },
  {
    id: 'alert-4',
    loopId: 'system',
    type: 'system',
    severity: 'info',
    title: 'Scheduled System Health Check Completed',
    message: 'All system components operational. Next check scheduled in 4 hours.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    acknowledged: true,
    actionRequired: false,
  },
];

const AlertIcon = ({ severity }: { severity: AlertSeverity }) => {
  const icons = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  };
  const colors = {
    critical: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };
  
  const Icon = icons[severity];
  return <Icon className={`w-5 h-5 ${colors[severity]}`} />;
};

const AlertBanner: React.FC<{
  alert: LoopAlert;
  onAcknowledge: () => void;
  onResolve: () => void;
  onNavigate: () => void;
  onDismiss: () => void;
}> = ({ alert, onAcknowledge, onResolve, onNavigate, onDismiss }) => {
  const bgColors = {
    critical: 'bg-red-500/20 border-red-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/30',
    info: 'bg-blue-500/20 border-blue-500/30',
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${bgColors[alert.severity]} backdrop-blur-sm`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <AlertIcon severity={alert.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium text-sm">{alert.title}</h4>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                alert.severity === 'critical' ? 'text-red-400 border-red-400/30' :
                alert.severity === 'warning' ? 'text-yellow-400 border-yellow-400/30' :
                'text-blue-400 border-blue-400/30'
              }`}
            >
              {alert.severity}
            </Badge>
            {alert.actionRequired && (
              <Badge variant="outline" className="text-orange-400 border-orange-400/30 text-xs">
                Action Required
              </Badge>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
            {alert.acknowledged && (
              <Badge variant="outline" className="text-green-400 border-green-400/30 text-xs">
                Acknowledged
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!alert.acknowledged && (
            <Button
              size="sm"
              variant="outline"
              onClick={onAcknowledge}
              className="border-white/30 text-white hover:bg-white/10 text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Ack
            </Button>
          )}
          {alert.contextUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={onNavigate}
              className="border-white/30 text-white hover:bg-white/10 text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View
            </Button>
          )}
          {alert.actionRequired && alert.acknowledged && (
            <Button
              size="sm"
              variant="outline"
              onClick={onResolve}
              className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs"
            >
              Resolve
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="text-gray-400 hover:text-white hover:bg-white/10 p-1"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const AlertSystem: React.FC<AlertSystemProps> = ({
  alerts = mockAlerts,
  onAlertClick,
  onAlertAcknowledge,
  onAlertResolve,
  maxVisible = 5,
}) => {
  const [visibleAlerts, setVisibleAlerts] = useState<LoopAlert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
  const [showDismissed, setShowDismissed] = useState(false);

  useEffect(() => {
    let filtered = alerts;
    
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }
    
    if (!showDismissed) {
      filtered = filtered.filter(alert => !alert.resolvedAt);
    }
    
    // Sort by severity and timestamp
    filtered.sort((a, b) => {
      const severityOrder = { critical: 3, warning: 2, info: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    setVisibleAlerts(filtered.slice(0, maxVisible));
  }, [alerts, filterSeverity, showDismissed, maxVisible]);

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolvedAt).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.resolvedAt).length;
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged && !a.resolvedAt).length;

  const handleAcknowledge = (alertId: string) => {
    onAlertAcknowledge?.(alertId);
  };

  const handleResolve = (alertId: string) => {
    onAlertResolve?.(alertId);
  };

  const handleNavigate = (alert: LoopAlert) => {
    onAlertClick?.(alert);
    if (alert.contextUrl) {
      // In a real app, you'd use proper routing
      console.log('Navigate to:', alert.contextUrl);
    }
  };

  const handleDismiss = (alertId: string) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (visibleAlerts.length === 0) {
    return (
      <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
        <div className="text-center">
          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <h3 className="text-white font-medium">No Active Alerts</h3>
          <p className="text-gray-400 text-sm">All systems operating normally</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alert Summary Header */}
      <motion.div
        className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-white font-medium">System Alerts</h3>
          </div>
          {unacknowledgedCount > 0 && (
            <Badge variant="outline" className="text-red-400 border-red-400/30">
              {unacknowledgedCount} unacknowledged
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filterSeverity === 'critical' ? 'default' : 'outline'}
              onClick={() => setFilterSeverity(filterSeverity === 'critical' ? 'all' : 'critical')}
              className="text-xs"
            >
              Critical ({criticalCount})
            </Button>
            <Button
              size="sm"
              variant={filterSeverity === 'warning' ? 'default' : 'outline'}
              onClick={() => setFilterSeverity(filterSeverity === 'warning' ? 'all' : 'warning')}
              className="text-xs"
            >
              Warning ({warningCount})
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDismissed(!showDismissed)}
            className="border-white/30 text-white text-xs"
          >
            <Filter className="w-3 h-3 mr-1" />
            {showDismissed ? 'Hide Resolved' : 'Show All'}
          </Button>
        </div>
      </motion.div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {visibleAlerts.map((alert) => (
            <AlertBanner
              key={alert.id}
              alert={alert}
              onAcknowledge={() => handleAcknowledge(alert.id)}
              onResolve={() => handleResolve(alert.id)}
              onNavigate={() => handleNavigate(alert)}
              onDismiss={() => handleDismiss(alert.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {alerts.length > maxVisible && (
        <div className="text-center">
          <Button variant="outline" className="border-white/30 text-white">
            View All Alerts ({alerts.length})
          </Button>
        </div>
      )}
    </div>
  );
};