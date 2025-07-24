import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Download, Settings, Star, Search, Filter, Code, Zap, Brain, BarChart, Shield,
  Wifi, WifiOff, RefreshCw, Smartphone, Globe, Check, Clock, AlertCircle,
  Lock, Eye, FileText, AlertTriangle, CheckCircle, Users, Activity, Key, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types from PluginsPage
interface Plugin {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  version: string;
  author: string;
  category: 'ai' | 'analytics' | 'automation' | 'integration' | 'security' | 'productivity';
  rating: number;
  downloads: number;
  status: 'available' | 'installed' | 'pending';
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

// Types from OfflinePage
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

// Types from SecurityPage
interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  maxValue: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

interface ComplianceItem {
  id: string;
  standard: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  lastAudit: Date;
  nextAudit: Date;
}

interface Threat {
  id: string;
  type: 'malware' | 'phishing' | 'unauthorized_access' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  affectedUsers?: number;
}

// Mock data from all three pages
const mockPlugins: Plugin[] = [
  {
    id: '1',
    name: 'AI Task Optimizer',
    description: 'Automatically optimize task allocation using machine learning',
    longDescription: 'Uses advanced AI algorithms to analyze team performance and automatically suggest optimal task assignments.',
    version: '2.1.0',
    author: 'AI Labs',
    category: 'ai',
    rating: 4.8,
    downloads: 12500,
    status: 'available',
    price: 0,
    icon: Brain,
    tags: ['machine-learning', 'optimization', 'tasks']
  },
  {
    id: '2',
    name: 'Advanced Analytics Suite',
    description: 'Comprehensive analytics and reporting dashboard',
    longDescription: 'Detailed analytics with custom dashboards, predictive insights, and automated reporting.',
    version: '1.5.2',
    author: 'DataViz Pro',
    category: 'analytics',
    rating: 4.6,
    downloads: 8900,
    status: 'installed',
    price: 29,
    icon: BarChart,
    tags: ['analytics', 'dashboards', 'reporting']
  },
  {
    id: '3',
    name: 'Workflow Automation',
    description: 'Create custom automation workflows for repetitive tasks',
    longDescription: 'Build complex automation workflows with visual editor and trigger-based actions.',
    version: '3.0.1',
    author: 'Automation Inc',
    category: 'automation',
    rating: 4.7,
    downloads: 15200,
    status: 'available',
    price: 15,
    icon: Zap,
    tags: ['automation', 'workflows', 'efficiency']
  },
  {
    id: '4',
    name: 'Security Monitor',
    description: 'Real-time security monitoring and threat detection',
    longDescription: 'Monitor workspace security, detect anomalies, and provide compliance reporting.',
    version: '1.2.8',
    author: 'SecureWork',
    category: 'security',
    rating: 4.9,
    downloads: 6700,
    status: 'pending',
    price: 49,
    icon: Shield,
    tags: ['security', 'monitoring', 'compliance']
  }
];

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

const mockSecurityMetrics: SecurityMetric[] = [
  {
    id: '1',
    name: 'Password Strength',
    value: 85,
    maxValue: 100,
    status: 'good',
    description: 'Average password strength across all users'
  },
  {
    id: '2',
    name: 'Two-Factor Authentication',
    value: 72,
    maxValue: 100,
    status: 'warning',
    description: 'Percentage of users with 2FA enabled'
  },
  {
    id: '3',
    name: 'Data Encryption',
    value: 100,
    maxValue: 100,
    status: 'good',
    description: 'Data encryption coverage'
  },
  {
    id: '4',
    name: 'Access Control',
    value: 94,
    maxValue: 100,
    status: 'good',
    description: 'Proper access controls implementation'
  }
];

const mockAuditEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'sarah.chen@company.com',
    action: 'LOGIN',
    resource: 'Workspace Dashboard',
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    status: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: 'marcus.johnson@company.com',
    action: 'FILE_DOWNLOAD',
    resource: 'governance-policy.pdf',
    ip: '192.168.1.105',
    userAgent: 'Firefox 121.0.0.0',
    status: 'success'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: 'unknown@suspicious.com',
    action: 'LOGIN_ATTEMPT',
    resource: 'Admin Panel',
    ip: '45.123.456.789',
    userAgent: 'Bot/1.0',
    status: 'failed'
  }
];

const mockComplianceItems: ComplianceItem[] = [
  {
    id: '1',
    standard: 'SOC 2',
    requirement: 'Access Control Management',
    status: 'compliant',
    lastAudit: new Date('2024-01-15'),
    nextAudit: new Date('2024-07-15')
  },
  {
    id: '2',
    standard: 'GDPR',
    requirement: 'Data Protection Impact Assessment',
    status: 'partial',
    lastAudit: new Date('2024-02-01'),
    nextAudit: new Date('2024-05-01')
  },
  {
    id: '3',
    standard: 'ISO 27001',
    requirement: 'Information Security Management',
    status: 'compliant',
    lastAudit: new Date('2024-01-20'),
    nextAudit: new Date('2024-07-20')
  }
];

const mockThreats: Threat[] = [
  {
    id: '1',
    type: 'unauthorized_access',
    severity: 'high',
    description: 'Multiple failed login attempts detected from suspicious IP',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'investigating',
    affectedUsers: 0
  },
  {
    id: '2',
    type: 'phishing',
    severity: 'medium',
    description: 'Suspicious email campaign targeting user credentials',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'resolved',
    affectedUsers: 3
  }
];

// Helper functions
const getCategoryIcon = (category: Plugin['category']) => {
  switch (category) {
    case 'ai': return Brain;
    case 'analytics': return BarChart;
    case 'automation': return Zap;
    case 'integration': return Code;
    case 'security': return Shield;
    case 'productivity': return Package;
    default: return Package;
  }
};

const getStatusBadge = (status: Plugin['status']) => {
  switch (status) {
    case 'installed':
      return <Badge variant="default" className="bg-success text-success-foreground">Installed</Badge>;
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'available':
      return <Badge variant="outline">Available</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Components
const PluginCard: React.FC<{
  plugin: Plugin;
  onInstall: (pluginId: string) => void;
  onUninstall: (pluginId: string) => void;
  onConfigure: (pluginId: string) => void;
}> = ({ plugin, onInstall, onUninstall, onConfigure }) => {
  const Icon = plugin.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Icon className="h-8 w-8 text-primary mt-1" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{plugin.name}</CardTitle>
              <p className="text-sm text-foreground-subtle">by {plugin.author}</p>
            </div>
            {getStatusBadge(plugin.status)}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="text-sm text-foreground-subtle mb-4 flex-1">
            {plugin.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-amber-400" />
                <span>{plugin.rating}</span>
              </div>
              <span className="text-foreground-subtle">•</span>
              <span className="text-foreground-subtle">{plugin.downloads.toLocaleString()} downloads</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {plugin.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-bold">
                {plugin.price === 0 ? 'Free' : `$${plugin.price}/mo`}
              </div>
              <div className="flex gap-2">
                {plugin.status === 'installed' ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => onConfigure(plugin.id)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onUninstall(plugin.id)}>
                      Uninstall
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => onInstall(plugin.id)}
                    disabled={plugin.status === 'pending'}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {plugin.status === 'pending' ? 'Installing...' : 'Install'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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

const SecurityMetricsCard: React.FC<{ metrics: SecurityMetric[] }> = ({ metrics }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Security Overview
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{metric.name}</span>
            <Badge variant={
              metric.status === 'good' ? 'default' : 
              metric.status === 'warning' ? 'secondary' : 'destructive'
            }>
              {metric.value}%
            </Badge>
          </div>
          <Progress 
            value={(metric.value / metric.maxValue) * 100} 
            className="h-2"
          />
          <p className="text-xs text-foreground-subtle">{metric.description}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

const AuditTrailCard: React.FC<{ entries: AuditEntry[] }> = ({ entries }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Eye className="h-5 w-5" />
        Audit Trail
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-background-secondary">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              entry.status === 'success' ? 'bg-success' :
              entry.status === 'warning' ? 'bg-warning' : 'bg-destructive'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{entry.action}</span>
                <Badge variant={
                  entry.status === 'success' ? 'default' :
                  entry.status === 'warning' ? 'secondary' : 'destructive'
                }>
                  {entry.status}
                </Badge>
              </div>
              <p className="text-xs text-foreground-subtle truncate">
                {entry.user} • {entry.resource} • {entry.ip}
              </p>
              <p className="text-xs text-foreground-subtle">
                {entry.timestamp.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ComplianceCard: React.FC<{ items: ComplianceItem[] }> = ({ items }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Compliance Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-lg bg-background-secondary">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{item.standard}</span>
              <Badge variant={
                item.status === 'compliant' ? 'default' :
                item.status === 'partial' ? 'secondary' : 'destructive'
              }>
                {item.status}
              </Badge>
            </div>
            <p className="text-sm text-foreground-subtle mb-2">{item.requirement}</p>
            <div className="flex justify-between text-xs text-foreground-subtle">
              <span>Last: {item.lastAudit.toLocaleDateString()}</span>
              <span>Next: {item.nextAudit.toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ThreatMonitoringCard: React.FC<{ threats: Threat[] }> = ({ threats }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        Threat Monitoring
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {threats.map((threat) => (
          <Alert key={threat.id} className={
            threat.severity === 'critical' ? 'border-destructive' :
            threat.severity === 'high' ? 'border-warning' : ''
          }>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{threat.type.replace('_', ' ')}</span>
                <div className="flex gap-2">
                  <Badge variant={
                    threat.severity === 'critical' ? 'destructive' :
                    threat.severity === 'high' ? 'secondary' : 'outline'
                  }>
                    {threat.severity}
                  </Badge>
                  <Badge variant={
                    threat.status === 'resolved' ? 'default' :
                    threat.status === 'investigating' ? 'secondary' : 'outline'
                  }>
                    {threat.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm mb-2">{threat.description}</p>
              <div className="flex justify-between text-xs text-foreground-subtle">
                <span>{threat.timestamp.toLocaleString()}</span>
                {threat.affectedUsers !== undefined && (
                  <span>{threat.affectedUsers} users affected</span>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plugins');
  
  // Plugin state
  const [plugins, setPlugins] = useState(mockPlugins);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePluginTab, setActivePluginTab] = useState('browse');
  
  // Offline state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(mockSyncStatus);
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>(mockOfflineActions);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Security state
  const [activeSecurityTab, setActiveSecurityTab] = useState('overview');

  // Plugin handlers
  const handleInstall = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, status: 'pending' as const }
        : plugin
    ));
    
    setTimeout(() => {
      setPlugins(prev => prev.map(plugin => 
        plugin.id === pluginId 
          ? { ...plugin, status: 'installed' as const }
          : plugin
      ));
    }, 2000);
  };

  const handleUninstall = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, status: 'available' as const }
        : plugin
    ));
  };

  const handleConfigure = (pluginId: string) => {
    console.log('Configuring plugin:', pluginId);
  };

  // Offline handlers
  useEffect(() => {
    const handleOnlineStatus = () => {
      setSyncStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine
      }));
    };

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

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    
    if (activePluginTab === 'installed') {
      return matchesSearch && matchesCategory && plugin.status === 'installed';
    }
    
    return matchesSearch && matchesCategory;
  });

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
              <Settings className="h-16 w-16 text-primary" />
              <Package className="h-12 w-12 text-accent animate-pulse" />
              <Shield className="h-14 w-14 text-success" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-foreground mb-4"
          >
            Admin Dashboard
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground-subtle max-w-2xl mx-auto"
          >
            Manage plugins, monitor offline capabilities, and maintain security compliance 
            from one centralized administrative interface.
          </motion.p>
        </div>
      </div>

      {/* Admin Content */}
      <div className="relative z-10 container mx-auto px-6 pb-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="plugins">Plugins</TabsTrigger>
            <TabsTrigger value="offline">Offline & PWA</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Plugins Tab */}
            <TabsContent key={activeTab} value="plugins" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Tabs value={activePluginTab} onValueChange={setActivePluginTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                    <TabsTrigger value="browse">Browse Plugins</TabsTrigger>
                    <TabsTrigger value="installed">Installed</TabsTrigger>
                  </TabsList>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
                      <Input
                        placeholder="Search plugins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="ai">AI & ML</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="automation">Automation</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <TabsContent value={activePluginTab} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPlugins.map((plugin) => (
                        <PluginCard
                          key={plugin.id}
                          plugin={plugin}
                          onInstall={handleInstall}
                          onUninstall={handleUninstall}
                          onConfigure={handleConfigure}
                        />
                      ))}
                    </div>
                    
                    {filteredPlugins.length === 0 && (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No plugins found</h3>
                        <p className="text-foreground-subtle">
                          Try adjusting your search or browse different categories.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </TabsContent>

            {/* Offline & PWA Tab */}
            <TabsContent key={activeTab} value="offline" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
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
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent key={activeTab} value="security" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Tabs value={activeSecurityTab} onValueChange={setActiveSecurityTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                    <TabsTrigger value="threats">Threats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <SecurityMetricsCard metrics={mockSecurityMetrics} />
                      <ThreatMonitoringCard threats={mockThreats} />
                    </div>
                  </TabsContent>

                  <TabsContent value="audit" className="space-y-6">
                    <div className="max-w-4xl mx-auto">
                      <AuditTrailCard entries={mockAuditEntries} />
                    </div>
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-6">
                    <div className="max-w-4xl mx-auto">
                      <ComplianceCard items={mockComplianceItems} />
                    </div>
                  </TabsContent>

                  <TabsContent value="threats" className="space-y-6">
                    <div className="max-w-4xl mx-auto">
                      <ThreatMonitoringCard threats={mockThreats} />
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;