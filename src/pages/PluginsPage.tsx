import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Download, Settings, Star, Search, Filter, Code, Zap, Brain, BarChart, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const PluginsPage: React.FC = () => {
  const [plugins, setPlugins] = useState(mockPlugins);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('browse');

  const handleInstall = (pluginId: string) => {
    setPlugins(prev => prev.map(plugin => 
      plugin.id === pluginId 
        ? { ...plugin, status: 'pending' as const }
        : plugin
    ));
    
    // Simulate installation
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

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    
    if (activeTab === 'installed') {
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
              <Package className="h-16 w-16 text-primary" />
              <Code className="h-12 w-12 text-accent animate-pulse" />
              <Zap className="h-14 w-14 text-success" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-foreground mb-4"
          >
            Plugin Marketplace
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground-subtle max-w-2xl mx-auto"
          >
            Extend your governance capabilities with powerful plugins. From AI insights to 
            budget modeling, discover tools that enhance your workflow and decision-making.
          </motion.p>
        </div>
      </div>

      {/* Marketplace Content */}
      <div className="relative z-10 container mx-auto px-6 pb-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

          <AnimatePresence mode="wait">
            <TabsContent key={activeTab} value={activeTab} className="space-y-6">
              <motion.div
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
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default PluginsPage;