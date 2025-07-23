import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Download, 
  Star, 
  Search, 
  Filter, 
  CheckCircle,
  ExternalLink,
  Settings,
  Trash2,
  Plus,
  Code,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'analytics' | 'automation' | 'collaboration' | 'visualization' | 'integration';
  rating: number;
  downloads: number;
  price: 'free' | 'premium';
  status: 'installed' | 'available' | 'pending' | 'error';
  icon: string;
  screenshots: string[];
  features: string[];
  permissions: string[];
  lastUpdated: Date;
}

const mockPlugins: Plugin[] = [
  {
    id: 'budget-modeler',
    name: 'Budget Modeler Pro',
    description: 'Advanced financial modeling and budget planning widget for governance loops.',
    version: '2.1.0',
    author: 'FinanceTools Inc.',
    category: 'analytics',
    rating: 4.8,
    downloads: 15420,
    price: 'premium',
    status: 'installed',
    icon: '💰',
    screenshots: [],
    features: ['Real-time budget tracking', 'Scenario modeling', 'ROI calculations', 'Export to Excel'],
    permissions: ['Read financial data', 'Create reports', 'Access user preferences'],
    lastUpdated: new Date(Date.now() - 86400000 * 3)
  },
  {
    id: 'citizen-survey',
    name: 'Citizen Survey Tool',
    description: 'Collect and analyze citizen feedback with beautiful survey forms and analytics.',
    version: '1.5.2',
    author: 'GovTech Solutions',
    category: 'collaboration',
    rating: 4.6,
    downloads: 8750,
    price: 'free',
    status: 'available',
    icon: '📊',
    screenshots: [],
    features: ['Custom survey builder', 'Real-time analytics', 'Multi-language support', 'Mobile responsive'],
    permissions: ['Create surveys', 'Access contact data', 'Send notifications'],
    lastUpdated: new Date(Date.now() - 86400000 * 7)
  },
  {
    id: 'ai-insights',
    name: 'AI Insights Engine',
    description: 'Machine learning powered insights and predictive analytics for your governance data.',
    version: '3.0.1',
    author: 'DataMind AI',
    category: 'analytics',
    rating: 4.9,
    downloads: 23100,
    price: 'premium',
    status: 'available',
    icon: '🤖',
    screenshots: [],
    features: ['Predictive modeling', 'Anomaly detection', 'Natural language insights', 'Auto-recommendations'],
    permissions: ['Read all data', 'Create AI models', 'Access external APIs'],
    lastUpdated: new Date(Date.now() - 86400000 * 1)
  },
  {
    id: 'slack-integration',
    name: 'Slack Integration',
    description: 'Seamless integration with Slack for notifications and collaboration.',
    version: '1.2.0',
    author: 'Workspace Labs',
    category: 'integration',
    rating: 4.4,
    downloads: 31200,
    price: 'free',
    status: 'installed',
    icon: '💬',
    screenshots: [],
    features: ['Real-time notifications', 'Task updates', 'Team mentions', 'Status sync'],
    permissions: ['Send messages', 'Read team data', 'Access webhooks'],
    lastUpdated: new Date(Date.now() - 86400000 * 14)
  },
  {
    id: 'compliance-tracker',
    name: 'Compliance Tracker',
    description: 'Track regulatory compliance and generate audit reports automatically.',
    version: '2.3.1',
    author: 'ComplianceFirst',
    category: 'automation',
    rating: 4.7,
    downloads: 12300,
    price: 'premium',
    status: 'pending',
    icon: '🛡️',
    screenshots: [],
    features: ['Automated compliance checks', 'Audit trail generation', 'Risk assessment', 'Regulatory updates'],
    permissions: ['Read compliance data', 'Generate reports', 'Access audit logs'],
    lastUpdated: new Date(Date.now() - 86400000 * 5)
  }
];

// Plugin Card Component
const PluginCard: React.FC<{
  plugin: Plugin;
  onInstall: (pluginId: string) => void;
  onUninstall: (pluginId: string) => void;
  onConfigure: (pluginId: string) => void;
}> = ({ plugin, onInstall, onUninstall, onConfigure }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analytics': return <Package className="h-4 w-4" />;
      case 'automation': return <Zap className="h-4 w-4" />;
      case 'collaboration': return <Users className="h-4 w-4" />;
      case 'visualization': return <Code className="h-4 w-4" />;
      case 'integration': return <ExternalLink className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'installed':
        return <Badge variant="outline" className="text-success border-success bg-success/10">Installed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-warning border-warning bg-warning/10">Installing...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full glass-secondary border-border-subtle/20 hover:border-primary/30 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{plugin.icon}</div>
              <div>
                <CardTitle className="text-lg text-foreground">{plugin.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryIcon(plugin.category)}
                    <span className="ml-1 capitalize">{plugin.category}</span>
                  </Badge>
                  {plugin.price === 'premium' && (
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-400">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {getStatusBadge(plugin.status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-foreground-subtle line-clamp-2">
            {plugin.description}
          </p>

          {/* Metrics */}
          <div className="flex items-center gap-4 text-xs text-foreground-subtle">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {plugin.rating}
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {plugin.downloads.toLocaleString()}
            </div>
            <div>v{plugin.version}</div>
          </div>

          {/* Features */}
          <div>
            <div className="text-xs font-medium text-foreground mb-2">Key Features:</div>
            <div className="flex flex-wrap gap-1">
              {plugin.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {plugin.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{plugin.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {plugin.author.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-foreground-subtle">{plugin.author}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {plugin.status === 'installed' ? (
              <>
                <Button variant="outline" size="sm" onClick={() => onConfigure(plugin.id)} className="flex-1">
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onUninstall(plugin.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            ) : plugin.status === 'pending' ? (
              <Button disabled size="sm" className="flex-1">
                Installing...
              </Button>
            ) : (
              <Button size="sm" onClick={() => onInstall(plugin.id)} className="flex-1">
                <Download className="h-3 w-3 mr-1" />
                Install
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Plugin Marketplace Component
export const PluginMarketplace: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [plugins, setPlugins] = useState<Plugin[]>(mockPlugins);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('marketplace');

  const handleInstall = (pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, status: 'pending' as const } : p
    ));
    
    // Simulate installation
    setTimeout(() => {
      setPlugins(prev => prev.map(p => 
        p.id === pluginId ? { ...p, status: 'installed' as const } : p
      ));
    }, 2000);
  };

  const handleUninstall = (pluginId: string) => {
    setPlugins(prev => prev.map(p => 
      p.id === pluginId ? { ...p, status: 'available' as const } : p
    ));
  };

  const handleConfigure = (pluginId: string) => {
    console.log('Configure plugin:', pluginId);
  };

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesTab = activeTab === 'marketplace' || 
                      (activeTab === 'installed' && plugin.status === 'installed');
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const installedCount = plugins.filter(p => p.status === 'installed').length;

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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Package className="h-7 w-7 text-primary" />
            Plugin Marketplace
          </h1>
          <Button variant="ghost" onClick={onClose}>
            <Package className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="marketplace">
              Marketplace
              <Badge variant="secondary" className="ml-2 text-xs">
                {plugins.filter(p => p.status !== 'installed').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="installed">
              Installed
              <Badge variant="secondary" className="ml-2 text-xs">
                {installedCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters & Search */}
      <div className="p-6 border-b border-border-subtle/20">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-glass-primary/50 border-border-subtle/30"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {['analytics', 'automation', 'collaboration', 'integration'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="flex-1 overflow-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${selectedCategory}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onInstall={handleInstall}
                onUninstall={handleUninstall}
                onConfigure={handleConfigure}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPlugins.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No plugins found</h3>
            <p className="text-foreground-subtle">
              Try adjusting your search or category filters.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};