import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  RefreshCw, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date;
  pendingActions: number;
  dataSize: string;
  syncProgress: number;
  isInstalled: boolean;
}

interface OfflineAction {
  id: string;
  type: 'task_update' | 'intervention' | 'metric_log' | 'collaboration';
  description: string;
  timestamp: Date;
  status: 'pending' | 'syncing' | 'synced' | 'error';
}

const mockOfflineActions: OfflineAction[] = [
  {
    id: 'action-1',
    type: 'task_update',
    description: 'Updated task "Process Optimization" progress to 75%',
    timestamp: new Date(Date.now() - 3600000),
    status: 'pending'
  },
  {
    id: 'action-2',
    type: 'intervention',
    description: 'Created intervention for Loop B resource allocation',
    timestamp: new Date(Date.now() - 1800000),
    status: 'pending'
  },
  {
    id: 'action-3',
    type: 'metric_log',
    description: 'Logged TRI improvement metrics',
    timestamp: new Date(Date.now() - 900000),
    status: 'synced'
  },
  {
    id: 'action-4',
    type: 'collaboration',
    description: 'Added comment to team discussion',
    timestamp: new Date(Date.now() - 600000),
    status: 'pending'
  }
];

// Service Worker registration and management
class OfflineService {
  private static instance: OfflineService;
  private isRegistered = false;

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  async register(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        this.isRegistered = true;
        return true;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
      }
    }
    return false;
  }

  async enableNotifications(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  async getCacheSize(): Promise<string> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      return this.formatBytes(usage);
    }
    return '0 MB';
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

// PWA Installation Component
const PWAInstaller: React.FC<{
  onInstall: () => void;
  isInstalled: boolean;
}> = ({ onInstall, isInstalled }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onInstall();
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <Card className="glass-secondary border-border-subtle/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <div className="text-sm font-medium text-foreground">PWA Installed</div>
              <div className="text-xs text-foreground-subtle">Ready for offline use</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-secondary border-border-subtle/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Install RGS Workspace
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-foreground-subtle mb-3">
          Install as a Progressive Web App for better performance and offline access.
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleInstall} disabled={!deferredPrompt}>
            <Download className="h-3 w-3 mr-1" />
            Install App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Offline Actions List
const OfflineActionsList: React.FC<{
  actions: OfflineAction[];
  onSync: () => void;
}> = ({ actions, onSync }) => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'task_update': return <CheckCircle className="h-4 w-4" />;
      case 'intervention': return <RefreshCw className="h-4 w-4" />;
      case 'metric_log': return <Database className="h-4 w-4" />;
      case 'collaboration': return <Globe className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-warning border-warning bg-warning/10">Pending</Badge>;
      case 'syncing':
        return <Badge variant="outline" className="text-info border-info bg-info/10">Syncing</Badge>;
      case 'synced':
        return <Badge variant="outline" className="text-success border-success bg-success/10">Synced</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  const pendingActions = actions.filter(a => a.status === 'pending');

  return (
    <Card className="glass-secondary border-border-subtle/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Offline Actions
          </CardTitle>
          {pendingActions.length > 0 && (
            <Button size="sm" onClick={onSync}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Sync All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="text-center py-4 text-foreground-subtle text-xs">
            No offline actions
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-glass-primary/30"
              >
                <div className="text-foreground-subtle mt-0.5">
                  {getActionIcon(action.type)}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-foreground mb-1">
                    {action.description}
                  </div>
                  <div className="text-xs text-foreground-subtle">
                    {action.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                {getStatusBadge(action.status)}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Offline PWA Panel
export const OfflinePWAPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: new Date(Date.now() - 900000),
    pendingActions: 3,
    dataSize: '12.3 MB',
    syncProgress: 0,
    isInstalled: false
  });
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>(mockOfflineActions);
  const [isInstalling, setIsInstalling] = useState(false);

  const offlineService = OfflineService.getInstance();

  useEffect(() => {
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPWA = async () => {
    setIsInstalling(true);
    const success = await offlineService.register();
    if (success) {
      await offlineService.enableNotifications();
      setSyncStatus(prev => ({ ...prev, isInstalled: true }));
    }
    setIsInstalling(false);
  };

  const handleSyncActions = () => {
    // Simulate syncing
    const pendingActions = offlineActions.filter(a => a.status === 'pending');
    
    pendingActions.forEach((action, index) => {
      setTimeout(() => {
        setOfflineActions(prev => prev.map(a => 
          a.id === action.id ? { ...a, status: 'syncing' as const } : a
        ));
        
        setTimeout(() => {
          setOfflineActions(prev => prev.map(a => 
            a.id === action.id ? { ...a, status: 'synced' as const } : a
          ));
        }, 1000);
      }, index * 500);
    });

    setSyncStatus(prev => ({ 
      ...prev, 
      lastSync: new Date(),
      pendingActions: 0 
    }));
  };

  const handleClearCache = async () => {
    await offlineService.clearCache();
    setSyncStatus(prev => ({ ...prev, dataSize: '0 MB' }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-4 z-50 glass rounded-3xl border border-border-subtle/30 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border-subtle/20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            {syncStatus.isOnline ? (
              <Wifi className="h-7 w-7 text-success" />
            ) : (
              <WifiOff className="h-7 w-7 text-warning" />
            )}
            Offline & PWA
          </h1>
          <Button variant="ghost" onClick={onClose}>
            <Globe className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Status */}
          <Card className="glass-secondary border-border-subtle/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-success" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-warning" />
                    Offline Mode
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-foreground-subtle">Last Sync</div>
                  <div className="text-sm font-medium">
                    {syncStatus.lastSync.toLocaleTimeString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-foreground-subtle">Cache Size</div>
                  <div className="text-sm font-medium">{syncStatus.dataSize}</div>
                </div>
              </div>

              {syncStatus.pendingActions > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-xs text-warning">
                    {syncStatus.pendingActions} actions pending sync
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSyncActions}
                  disabled={!syncStatus.isOnline || syncStatus.pendingActions === 0}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync Now
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearCache}>
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PWA Installation */}
          <PWAInstaller 
            onInstall={handleInstallPWA}
            isInstalled={syncStatus.isInstalled}
          />

          {/* Offline Actions */}
          <div className="lg:col-span-2">
            <OfflineActionsList 
              actions={offlineActions}
              onSync={handleSyncActions}
            />
          </div>

          {/* Performance Metrics */}
          <Card className="glass-secondary border-border-subtle/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="h-4 w-4" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground-subtle">Cache Efficiency</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-foreground-subtle">Offline Capability</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle/20">
                <div>
                  <div className="text-xs text-foreground-subtle">Load Time</div>
                  <div className="text-sm font-medium">1.2s</div>
                </div>
                <div>
                  <div className="text-xs text-foreground-subtle">Offline Features</div>
                  <div className="text-sm font-medium">12/15</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Optimization */}
          <Card className="glass-secondary border-border-subtle/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile Ready
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-subtle">Touch Optimized</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-subtle">Responsive Design</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-subtle">Push Notifications</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground-subtle">Gesture Support</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};