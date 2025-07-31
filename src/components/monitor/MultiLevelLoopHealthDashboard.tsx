import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Bell,
  User,
  Settings,
  Globe,
  Building2,
  Cog,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Eye,
  Plus,
  Download,
  Share,
  Filter,
  BarChart3,
  Activity,
  Target,
  Zap,
  Clock,
  Users,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Progress } from '../ui/progress';
import { EnhancedLoop, LoopLayer } from '../../types/monitor';

interface MultiLevelLoopHealthDashboardProps {
  loops?: EnhancedLoop[];
  onLoopSelect?: (loop: EnhancedLoop) => void;
  onLayerToggle?: (layer: LoopLayer) => void;
}

// Enhanced mock data with additional properties for the new dashboard
const mockEnhancedLoops: EnhancedLoop[] = [
  // Macro Loops (11 loops)
  {
    id: 'macro-1',
    name: 'Population & Development',
    description: 'Comprehensive population growth and development dynamics',
    layer: 'macro',
    type: 'reinforcing',
    triScore: 7.8,
    deBand: 'green',
    srtHorizon: 52,
    trend: [7.2, 7.4, 7.6, 7.8, 7.8, 8.0],
    status: 'healthy',
    lastCheck: '2 hours ago',
    nextCheck: '4 hours',
    layerData: {
      leveragePoints: ['Education Access', 'Healthcare Infrastructure', 'Economic Mobility'],
      systemScope: 'population',
      policyImpact: 85,
      stakeholderCount: 12000,
      cldThumbnail: '/api/placeholder/200/120'
    },
    alertThresholds: { triLower: 6.0, triUpper: 9.0, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'macro-2',
    name: 'Environmental Quality',
    description: 'Ecosystem health and environmental sustainability metrics',
    layer: 'macro',
    type: 'balancing',
    triScore: 6.2,
    deBand: 'yellow',
    srtHorizon: 26,
    trend: [6.8, 6.5, 6.3, 6.1, 6.2, 6.1],
    status: 'warning',
    lastCheck: '1 hour ago',
    nextCheck: '3 hours',
    layerData: {
      leveragePoints: ['Carbon Pricing', 'Green Infrastructure', 'Regulatory Framework'],
      systemScope: 'environment',
      policyImpact: 72,
      stakeholderCount: 8500,
      cldThumbnail: '/api/placeholder/200/120'
    },
    alertThresholds: { triLower: 5.0, triUpper: 8.0, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'macro-3',
    name: 'Economic Resilience',
    layer: 'macro',
    type: 'reinforcing',
    triScore: 8.1,
    deBand: 'green',
    srtHorizon: 78,
    trend: [7.8, 7.9, 8.0, 8.1, 8.1, 8.2],
    status: 'healthy',
    lastCheck: '3 hours ago',
    nextCheck: '6 hours',
    layerData: {
      leveragePoints: ['Innovation Investment', 'Market Diversification', 'Skills Development'],
      systemScope: 'economy',
      policyImpact: 91,
      stakeholderCount: 15000,
      cldThumbnail: '/api/placeholder/200/120'
    },
    alertThresholds: { triLower: 7.0, triUpper: 9.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Meso Loops
  {
    id: 'meso-1',
    name: 'Budget Allocation Process',
    layer: 'meso',
    type: 'reinforcing',
    parentLoopId: 'macro-1',
    triScore: 8.1,
    deBand: 'green',
    srtHorizon: 12,
    trend: [7.8, 7.9, 8.0, 8.1, 8.1, 8.2],
    status: 'healthy',
    lastCheck: '30 minutes ago',
    nextCheck: '2 hours',
    layerData: {
      processType: 'budget',
      throughputRate: 95,
      averageDeviation: 8,
      pilotSuccessRate: 87,
      resourceUtilization: 92,
    },
    alertThresholds: { triLower: 7.0, triUpper: 9.0, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'meso-2',
    name: 'Compliance Enforcement',
    layer: 'meso',
    type: 'balancing',
    parentLoopId: 'macro-2',
    triScore: 5.8,
    deBand: 'yellow',
    srtHorizon: 8,
    trend: [6.2, 6.0, 5.9, 5.8, 5.8, 5.7],
    status: 'warning',
    lastCheck: '45 minutes ago',
    nextCheck: '1 hour',
    layerData: {
      processType: 'compliance',
      throughputRate: 78,
      averageDeviation: 15,
      pilotSuccessRate: 65,
      resourceUtilization: 85,
    },
    alertThresholds: { triLower: 6.0, triUpper: 8.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Micro Loops
  {
    id: 'micro-1',
    name: 'Grant Application Review',
    layer: 'micro',
    type: 'reinforcing',
    parentLoopId: 'meso-1',
    triScore: 7.5,
    deBand: 'green',
    srtHorizon: 2,
    trend: [7.2, 7.3, 7.4, 7.5, 7.5, 7.6],
    status: 'healthy',
    lastCheck: '15 minutes ago',
    nextCheck: '45 minutes',
    layerData: {
      taskType: 'review',
      reworkPercentage: 12,
      averageCompletionTime: 4.5,
      alertFrequency: 0.2,
      bottleneckIndicators: ['Document Quality', 'Reviewer Availability'],
    },
    alertThresholds: { triLower: 6.5, triUpper: 8.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'micro-2',
    name: 'Environmental Impact Assessment',
    layer: 'micro',
    type: 'balancing',
    parentLoopId: 'meso-2',
    triScore: 4.8,
    deBand: 'red',
    srtHorizon: 3,
    trend: [5.5, 5.2, 5.0, 4.9, 4.8, 4.7],
    status: 'critical',
    lastCheck: '10 minutes ago',
    nextCheck: '20 minutes',
    layerData: {
      taskType: 'approval',
      reworkPercentage: 35,
      averageCompletionTime: 12.8,
      alertFrequency: 2.1,
      bottleneckIndicators: ['Data Validation', 'Expert Review', 'Stakeholder Input'],
    },
    alertThresholds: { triLower: 5.0, triUpper: 7.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sparkline Component
const Sparkline: React.FC<{ data: number[]; status: string; className?: string }> = ({ 
  data, 
  status, 
  className = "w-20 h-8" 
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = status === 'healthy' ? 'rgb(34, 197, 94)' : 
                     status === 'warning' ? 'rgb(234, 179, 8)' : 'rgb(239, 68, 68)';

  return (
    <div className={className}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// DE-Band Gauge Component
const DEBandGauge: React.FC<{ value: number; band: string; className?: string }> = ({ 
  value, 
  band, 
  className = "w-16 h-8" 
}) => {
  const percentage = Math.min(Math.max((value / 10) * 100, 0), 100);
  const color = band === 'green' ? 'rgb(34, 197, 94)' : 
                band === 'yellow' ? 'rgb(234, 179, 8)' : 
                band === 'orange' ? 'rgb(251, 146, 60)' : 'rgb(239, 68, 68)';

  return (
    <div className={className}>
      <svg width="100%" height="100%" viewBox="0 0 100 50">
        <path
          d="M 10 40 A 40 40 0 0 1 90 40"
          fill="none"
          stroke="rgb(55, 65, 81)"
          strokeWidth="4"
        />
        <motion.path
          d={`M 10 40 A 40 40 0 0 1 ${10 + (80 * percentage / 100)} ${40 - Math.sin((percentage / 100) * Math.PI) * 40}`}
          fill="none"
          stroke={color}
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <circle cx={10 + (80 * percentage / 100)} cy={40 - Math.sin((percentage / 100) * Math.PI) * 40} r="3" fill={color} />
      </svg>
    </div>
  );
};

// Top Navigation Bar Component
const TopNavigationBar: React.FC<{
  searchQuery: string;
  onSearchChange: (query: string) => void;
  role: string;
  onRoleChange: (role: string) => void;
  alertCount: number;
}> = ({ searchQuery, onSearchChange, role, onRoleChange, alertCount }) => {
  return (
    <motion.div 
      className="h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-6 gap-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Global Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search loops, bundles, or tasks... (⌘K)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/50 border-muted-foreground/20"
        />
      </div>

      {/* Role Switcher */}
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-48 bg-muted/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="c-suite">C-Suite View</SelectItem>
          <SelectItem value="analyst">Analyst View</SelectItem>
          <SelectItem value="ops-manager">Ops Manager View</SelectItem>
        </SelectContent>
      </Select>

      {/* Alerts */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {alertCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 text-xs"
                >
                  {alertCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{alertCount} active alerts</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* User Menu */}
      <Button variant="ghost" size="sm">
        <User className="w-5 h-5" />
      </Button>

      {/* Settings */}
      <Button variant="ghost" size="sm">
        <Settings className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};

// Macro Loop Card Component
const MacroLoopCard: React.FC<{
  loop: EnhancedLoop;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}> = ({ loop, isSelected, onSelect, onHover }) => {
  const Icon = loop.type === 'reinforcing' ? RotateCcw : Target;

  return (
    <motion.div
      className={`relative p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
          : 'border-border/50 bg-background/50 hover:border-primary/50 hover:bg-background/80'
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      layout
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <div className={`w-2 h-2 rounded-full ${
            loop.deBand === 'green' ? 'bg-green-500' :
            loop.deBand === 'yellow' ? 'bg-yellow-500' :
            loop.deBand === 'orange' ? 'bg-orange-500' : 'bg-red-500'
          }`} />
        </div>
        {loop.status === 'critical' && (
          <AlertTriangle className="w-4 h-4 text-destructive" />
        )}
      </div>

      {/* Loop Name */}
      <h3 className="font-semibold text-sm mb-2 leading-tight">{loop.name}</h3>

      {/* Sparkline */}
      <div className="mb-3">
        <Sparkline data={loop.trend} status={loop.status} className="w-full h-6" />
      </div>

      {/* DE-Band Gauge */}
      <div className="flex items-center justify-between">
        <DEBandGauge value={loop.triScore} band={loop.deBand} />
        <span className="text-sm font-medium">{loop.triScore}</span>
      </div>

      {/* CLD Thumbnail Overlay (on hover) */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 bg-background/95 rounded-xl p-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="w-20 h-12 bg-muted rounded mb-2 mx-auto flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">CLD Thumbnail</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Meso Loop Tile Component
const MesoLoopTile: React.FC<{
  loop: EnhancedLoop;
  onSelect: () => void;
}> = ({ loop, onSelect }) => {
  const data = loop.layerData as any;
  const Icon = Building2;

  return (
    <motion.div
      className="p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition-all"
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">{loop.name}</h4>
        </div>
        <div className="flex items-center gap-1">
          {loop.trend.slice(-2)[1] > loop.trend.slice(-2)[0] ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : loop.trend.slice(-2)[1] < loop.trend.slice(-2)[0] ? (
            <TrendingDown className="w-3 h-3 text-red-500" />
          ) : (
            <Minus className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Success Rate</span>
          <span className="font-medium">{data.throughputRate}%</span>
        </div>
        <Progress value={data.throughputRate} className="h-1" />
      </div>
    </motion.div>
  );
};

// Micro Loop Gauge Component
const MicroLoopGauge: React.FC<{
  loop: EnhancedLoop;
  onSelect: () => void;
}> = ({ loop, onSelect }) => {
  const data = loop.layerData as any;
  const pulseScore = Math.floor(Math.random() * 100); // Mock pulse score

  return (
    <motion.div
      className="p-3 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 cursor-pointer transition-all"
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Cog className="w-3 h-3 text-muted-foreground" />
          <h5 className="font-medium text-xs">{loop.name}</h5>
        </div>
        {loop.status === 'critical' && (
          <AlertTriangle className="w-3 h-3 text-destructive" />
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DEBandGauge value={loop.triScore} band={loop.deBand} className="w-8 h-4" />
          <Badge variant="outline" className="text-xs px-1 py-0">
            {pulseScore}
          </Badge>
        </div>
        <span className="text-xs font-medium">{data.averageCompletionTime}h</span>
      </div>

      {loop.status === 'critical' && (
        <div className="mt-2 flex gap-1">
          <Button size="sm" variant="outline" className="text-xs h-6 px-2">
            Quick Fix
          </Button>
        </div>
      )}
    </motion.div>
  );
};

// Right Sidebar Component
const RightSidebar: React.FC<{
  selectedLoop?: EnhancedLoop;
  onClose: () => void;
}> = ({ selectedLoop, onClose }) => {
  if (!selectedLoop) return null;

  return (
    <motion.div
      className="w-80 bg-background/80 backdrop-blur-xl border-l border-border p-6 overflow-y-auto"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">{selectedLoop.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {selectedLoop.layer} • {selectedLoop.type}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* CLD Viewer */}
      <Card className="mb-6">
        <CardHeader>
          <h4 className="font-medium text-sm">Causal Loop Diagram</h4>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Key Parameters */}
      <Card className="mb-6">
        <CardHeader>
          <h4 className="font-medium text-sm">Key Parameters</h4>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">TRI Score</span>
            <span className="font-medium">{selectedLoop.triScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">DE-Band</span>
            <Badge variant={selectedLoop.deBand === 'green' ? 'default' : 'destructive'}>
              {selectedLoop.deBand}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">SRT Horizon</span>
            <span className="font-medium">{selectedLoop.srtHorizon}w</span>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <Card className="mb-6">
        <CardHeader>
          <h4 className="font-medium text-sm">Performance Trend</h4>
        </CardHeader>
        <CardContent>
          <Sparkline data={selectedLoop.trend} status={selectedLoop.status} className="w-full h-16" />
        </CardContent>
      </Card>

      {/* Action Panel */}
      <Card>
        <CardHeader>
          <h4 className="font-medium text-sm">Actions</h4>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Think Sprint
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            AI Recommendations
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Dashboard Component
export const MultiLevelLoopHealthDashboard: React.FC<MultiLevelLoopHealthDashboardProps> = ({
  loops = mockEnhancedLoops,
  onLoopSelect,
  onLayerToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState('analyst');
  const [selectedLoop, setSelectedLoop] = useState<EnhancedLoop | null>(null);
  const [hoveredLoop, setHoveredLoop] = useState<string | null>(null);

  const filteredLoops = useMemo(() => {
    return loops.filter(loop => 
      loop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loop.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [loops, searchQuery]);

  const loopsByLayer = useMemo(() => {
    return {
      macro: filteredLoops.filter(loop => loop.layer === 'macro'),
      meso: filteredLoops.filter(loop => loop.layer === 'meso'),
      micro: filteredLoops.filter(loop => loop.layer === 'micro'),
    };
  }, [filteredLoops]);

  const alertCount = useMemo(() => {
    return loops.filter(loop => loop.status === 'critical' || loop.deBand === 'red').length;
  }, [loops]);

  const handleLoopSelect = (loop: EnhancedLoop) => {
    setSelectedLoop(loop);
    onLoopSelect?.(loop);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Top Navigation */}
      <TopNavigationBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        role={role}
        onRoleChange={setRole}
        alertCount={alertCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Three-Pane Main Grid */}
        <div className="flex-1 grid grid-cols-12 gap-6 p-6">
          {/* Primary Column - Macro Loop Panel */}
          <div className="col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Macro Loops
                </h2>
                <Badge variant="outline" className="text-sm">
                  {loopsByLayer.macro.length} active
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {loopsByLayer.macro.map((loop, index) => (
                  <motion.div
                    key={loop.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MacroLoopCard
                      loop={loop}
                      isSelected={selectedLoop?.id === loop.id}
                      onSelect={() => handleLoopSelect(loop)}
                      onHover={(hovering) => setHoveredLoop(hovering ? loop.id : null)}
                    />
                  </motion.div>
                ))}
                
                {/* All Loops Summary Card */}
                <motion.div
                  className="p-4 rounded-xl border-2 border-dashed border-border/50 bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: loopsByLayer.macro.length * 0.1 }}
                >
                  <Activity className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">All Loops</span>
                  <span className="text-xs text-muted-foreground">Overview</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Secondary Column */}
          <div className="col-span-5 space-y-6">
            {/* Meso Loop Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Meso Loops
                </h3>
                <Badge variant="outline" className="text-xs">
                  {loopsByLayer.meso.length} active
                </Badge>
              </div>

              <div className="space-y-3">
                {loopsByLayer.meso.map((loop, index) => (
                  <motion.div
                    key={loop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MesoLoopTile
                      loop={loop}
                      onSelect={() => handleLoopSelect(loop)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Micro Loop Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Cog className="w-4 h-4" />
                  Micro Loops
                </h3>
                <Badge variant="outline" className="text-xs">
                  {loopsByLayer.micro.length} active
                </Badge>
              </div>

              <div className="space-y-3">
                {loopsByLayer.micro.map((loop, index) => (
                  <motion.div
                    key={loop.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MicroLoopGauge
                      loop={loop}
                      onSelect={() => handleLoopSelect(loop)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Sidebar */}
        <AnimatePresence>
          {selectedLoop && (
            <RightSidebar
              selectedLoop={selectedLoop}
              onClose={() => setSelectedLoop(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};