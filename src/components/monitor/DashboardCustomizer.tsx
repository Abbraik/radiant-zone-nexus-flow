import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Grid, 
  List, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw,
  Settings,
  Monitor,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface DashboardPanel {
  id: string;
  name: string;
  type: 'macro' | 'meso' | 'micro' | 'alerts' | 'trends' | 'analytics';
  visible: boolean;
  position: { row: number; col: number; span: number };
  icon: React.ElementType;
}

interface DashboardLayout {
  id: string;
  name: string;
  type: 'grid' | 'list' | 'hybrid';
  panels: DashboardPanel[];
}

interface DashboardCustomizerProps {
  currentLayout: string;
  layouts: DashboardLayout[];
  onLayoutChange: (layoutId: string) => void;
  onPanelToggle: (panelId: string) => void;
  onSavePreset: (name: string, layout: DashboardLayout) => void;
}

const defaultPanels: DashboardPanel[] = [
  { 
    id: 'macro-panel', 
    name: 'Macro Loops', 
    type: 'macro', 
    visible: true, 
    position: { row: 0, col: 0, span: 2 },
    icon: Activity
  },
  { 
    id: 'meso-panel', 
    name: 'Meso Loops', 
    type: 'meso', 
    visible: true, 
    position: { row: 0, col: 2, span: 1 },
    icon: BarChart3
  },
  { 
    id: 'micro-panel', 
    name: 'Micro Loops', 
    type: 'micro', 
    visible: true, 
    position: { row: 1, col: 2, span: 1 },
    icon: Monitor
  },
  { 
    id: 'alerts-panel', 
    name: 'Alert System', 
    type: 'alerts', 
    visible: true, 
    position: { row: 2, col: 0, span: 3 },
    icon: Activity
  }
];

const rolePresets = {
  'C-Suite': {
    name: 'Executive View',
    description: 'High-level strategic overview',
    panels: ['macro-panel', 'alerts-panel', 'trends-panel']
  },
  'Ops Manager': {
    name: 'Operations View', 
    description: 'Process and task monitoring',
    panels: ['meso-panel', 'micro-panel', 'alerts-panel']
  },
  'Analyst': {
    name: 'Analysis View',
    description: 'Detailed metrics and trends',
    panels: ['macro-panel', 'meso-panel', 'micro-panel', 'analytics-panel']
  }
};

export function DashboardCustomizer({
  currentLayout = 'grid',
  layouts = [],
  onLayoutChange,
  onPanelToggle,
  onSavePreset
}: Partial<DashboardCustomizerProps>) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [panels, setPanels] = useState(defaultPanels);
  const [presetName, setPresetName] = useState('');

  const handlePanelToggle = (panelId: string) => {
    setPanels(prev => prev.map(panel => 
      panel.id === panelId ? { ...panel, visible: !panel.visible } : panel
    ));
    onPanelToggle?.(panelId);
  };

  const handleSavePreset = () => {
    if (presetName && onSavePreset) {
      const layout: DashboardLayout = {
        id: `preset-${Date.now()}`,
        name: presetName,
        type: 'grid',
        panels: panels
      };
      onSavePreset(presetName, layout);
      setPresetName('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="glass-secondary border-border/50">
          <Layout className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl glass border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Dashboard Customization</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Layout Type Selector */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Layout Type</h4>
            <div className="grid grid-cols-3 gap-3">
              {['grid', 'list', 'hybrid'].map((layout) => (
                <motion.div key={layout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      currentLayout === layout 
                        ? 'border-primary ring-1 ring-primary/20' 
                        : 'border-border/50 hover:border-primary/50'
                    }`}
                    onClick={() => onLayoutChange?.(layout)}
                  >
                    <CardContent className="p-4 text-center">
                      {layout === 'grid' && <Grid className="h-6 w-6 mx-auto mb-2" />}
                      {layout === 'list' && <List className="h-6 w-6 mx-auto mb-2" />}
                      {layout === 'hybrid' && <Layout className="h-6 w-6 mx-auto mb-2" />}
                      <p className="text-sm font-medium capitalize">{layout}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Panel Visibility Controls */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Dashboard Panels</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Edit Mode</span>
                <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
              </div>
            </div>
            
            <div className="space-y-2">
              {panels.map((panel) => {
                const Icon = panel.icon;
                return (
                  <div key={panel.id} className="flex items-center justify-between p-3 rounded-lg glass-secondary">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{panel.name}</span>
                      <Badge variant="outline" className="text-xs">{panel.type}</Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePanelToggle(panel.id)}
                        className="h-7 w-7 p-0"
                      >
                        {panel.visible ? (
                          <Eye className="h-3 w-3 text-success" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Role Presets */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Role Presets</h4>
            <div className="space-y-2">
              {Object.entries(rolePresets).map(([role, preset]) => (
                <div key={role} className="flex items-center justify-between p-3 rounded-lg glass-secondary">
                  <div>
                    <p className="text-sm font-medium">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">{preset.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Save/Reset Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset to Default
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleSavePreset}
                className="text-xs"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Preset
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}