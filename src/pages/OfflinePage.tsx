import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Download, Smartphone, Globe, Check, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date;
  pendingActions: number;
  cacheSize: string;
  syncProgress: number;
  isInstalled: boolean;
}

interface OfflineAction {
  id: string;
  type: 'task_update' | 'comment_add' | 'file_upload' | 'settings_change';
  description: string;
  timestamp: Date;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}

const mockSyncStatus: SyncStatus = {
  isOnline: true,
  lastSync: new Date(),
  pendingActions: 3,
  cacheSize: '12.4 MB',
  syncProgress: 75,
  isInstalled: false
};

const mockOfflineActions: OfflineAction[] = [
  {
    id: '1',
    type: 'task_update',
    description: 'Updated task "Review governance framework"',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '2',
    type: 'comment_add',
    description: 'Added comment to "Budget approval process"',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'synced'
  },
  {
    id: '3',
    type: 'file_upload',
    description: 'Uploaded document "Policy_v2.pdf"',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'pending'
  }
];

const PWAInstaller: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-success">
        <Check className="h-4 w-4" />
        <span className="text-sm">PWA Installed</span>
      </div>
    );
  }

  if (deferredPrompt) {
    return (
      <Button onClick={handleInstall} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Install App
      </Button>
    );
  }

  return (
    <div className="text-sm text-foreground-subtle">
      PWA installation not available in this browser
    </div>
  );
};

const OfflineActionsList: React.FC<{ 
  actions: OfflineAction[];
  onSyncAll: () => void;
}> = ({ actions, onSyncAll }) => {
  const getActionIcon = (type: OfflineAction['type']) => {
    switch (type) {
      case 'task_update': return RefreshCw;
      case 'comment_add': return Clock;
      case 'file_upload': return Download;
      case 'settings_change': return RefreshCw;
      default: return RefreshCw;
    }
  };

  const getStatusBadge = (status: OfflineAction['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'syncing':
        return <Badge variant="outline">Syncing</Badge>;
      case 'synced':
        return <Badge variant="default" className="bg-success text-success-foreground">Synced</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const pendingActions = actions.filter(action => action.status === 'pending');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Offline Actions</h3>
        {pendingActions.length > 0 && (
          <Button onClick={onSyncAll} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = getActionIcon(action.type);
          return (
            <div key={action.id} className="flex items-center gap-3 p-3 rounded-lg bg-background-secondary">
              <Icon className="h-4 w-4 text-foreground-subtle" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{action.description}</p>
                <p className="text-xs text-foreground-subtle">
                  {action.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {getStatusBadge(action.status)}
            </div>
          );
        })}
      </div>
      
      {actions.length === 0 && (
        <div className="text-center py-6 text-foreground-subtle">
          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No offline actions recorded</p>
        </div>
      )}
    </div>
  );
};

const OfflinePage: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(mockSyncStatus);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>(mockOfflineActions);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setSyncStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };

    // Initialize status
    setSyncStatus(prev => ({
      ...prev,
      isOnline: navigator.onLine
    }));
    setIsInitialized(true);
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSyncAll = async () => {
    setOfflineActions(prev => 
      prev.map(action => 
        action.status === 'pending' 
          ? { ...action, status: 'syncing' as const }
          : action
      )
    );

    // Simulate sync process
    setTimeout(() => {
      setOfflineActions(prev => 
        prev.map(action => 
          action.status === 'syncing' 
            ? { ...action, status: 'synced' as const }
            : action
        )
      );
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        pendingActions: 0
      }));
    }, 2000);
  };

  const handleClearCache = async () => {
    setSyncStatus(prev => ({
      ...prev,
      cacheSize: '0 MB'
    }));
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary" />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center gap-4">
              <Wifi className="h-16 w-16 text-success" />
              <Smartphone className="h-12 w-12 text-primary animate-pulse" />
              <Globe className="h-14 w-14 text-accent" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-foreground mb-4"
          >
            Offline & Progressive Web App
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground-subtle max-w-2xl mx-auto"
          >
            Work anywhere, anytime. Install as a mobile app, sync offline changes, 
            and maintain productivity even without internet connectivity.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pb-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <Wifi className="h-5 w-5 text-success" />
                ) : (
                  <WifiOff className="h-5 w-5 text-destructive" />
                )}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
                  {syncStatus.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Last Sync</span>
                <span className="text-sm text-foreground-subtle">
                  {syncStatus.lastSync.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Pending Actions</span>
                <Badge variant={syncStatus.pendingActions > 0 ? 'secondary' : 'outline'}>
                  {syncStatus.pendingActions}
                </Badge>
              </div>
              
              {syncStatus.syncProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sync Progress</span>
                    <span>{syncStatus.syncProgress}%</span>
                  </div>
                  <Progress value={syncStatus.syncProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* PWA Installation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Progressive Web App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Install Status</span>
                <PWAInstaller />
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Mobile Features</h4>
                <ul className="space-y-2 text-sm text-foreground-subtle">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Offline access to cached data
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Background sync when online
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Push notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Native app experience
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Cache Size</span>
                <span className="text-sm font-medium">{syncStatus.cacheSize}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Service Worker</span>
                <Badge variant={isInitialized ? 'default' : 'secondary'}>
                  {isInitialized ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearCache}
                className="w-full"
              >
                Clear Cache
              </Button>
            </CardContent>
          </Card>

          {/* Offline Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <OfflineActionsList 
                actions={offlineActions} 
                onSyncAll={handleSyncAll}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;