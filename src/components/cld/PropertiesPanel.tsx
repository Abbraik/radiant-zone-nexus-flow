import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Settings,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';
import { CLDNode, CLDLink } from '../../types/cld';

interface PropertiesPanelProps {
  selectedNode: CLDNode | null;
  selectedLink: CLDLink | null;
  onNodeUpdate: (nodeId: string, updates: Partial<CLDNode>) => void;
  onLinkUpdate: (linkId: string, updates: Partial<CLDLink>) => void;
  onRunSimulation: () => void;
  simulationRunning: boolean;
  simulationResults?: any;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  selectedLink,
  onNodeUpdate,
  onLinkUpdate,
  onRunSimulation,
  simulationRunning,
  simulationResults
}) => {
  const [formData, setFormData] = useState<Partial<CLDNode & CLDLink>>({});
  const [validation, setValidation] = useState<{ [key: string]: string }>({});
  const [showSimulationOverlay, setShowSimulationOverlay] = useState(false);

  // Update form data when selection changes
  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode);
    } else if (selectedLink) {
      setFormData(selectedLink);
    } else {
      setFormData({});
    }
    setValidation({});
  }, [selectedNode, selectedLink]);

  const validateField = (field: string, value: any) => {
    const errors: { [key: string]: string } = {};

    switch (field) {
      case 'label':
        if (!value || value.trim().length === 0) {
          errors.label = 'Label is required';
        } else if (value.length > 50) {
          errors.label = 'Label must be less than 50 characters';
        }
        break;
      case 'value':
        if (value !== undefined && value !== '' && isNaN(Number(value))) {
          errors.value = 'Value must be a number';
        }
        break;
      case 'delay':
        if (value !== undefined && value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
          errors.delay = 'Delay must be a positive number';
        }
        break;
    }

    setValidation(prev => ({ ...prev, [field]: errors[field] || '' }));
    return !errors[field];
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);

    // Auto-update canvas
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { [field]: value });
    } else if (selectedLink) {
      onLinkUpdate(selectedLink.id, { [field]: value });
    }
  };

  const handleRunSimulation = () => {
    if (!simulationRunning) {
      onRunSimulation();
      setShowSimulationOverlay(true);
    }
  };

  const ValidationIcon = ({ field }: { field: string }) => {
    if (!validation[field]) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  if (!selectedNode && !selectedLink) {
    return (
      <div className="w-80 h-full bg-slate-800/90 backdrop-blur-sm border-l border-slate-600 p-6 flex flex-col items-center justify-center text-gray-400">
        <Info className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-center">Select a node or link to edit its properties</p>
        
        {/* Quick Actions */}
        <div className="mt-8 w-full space-y-4">
          <Button
            onClick={handleRunSimulation}
            disabled={simulationRunning}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {simulationRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          
          {simulationResults && (
            <Button
              variant="outline"
              onClick={() => setShowSimulationOverlay(true)}
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Results
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-slate-800/90 backdrop-blur-sm border-l border-slate-600 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">
              {selectedNode ? 'Node Properties' : 'Link Properties'}
            </h3>
            <p className="text-gray-400 text-sm">
              {selectedNode ? selectedNode.label : `${selectedLink?.polarity} Connection`}
            </p>
          </div>
        </div>

        <Separator className="bg-slate-600" />

        {/* Node Properties */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Basic Properties */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Label</Label>
                <ValidationIcon field="label" />
              </div>
              <Input
                value={formData.label || ''}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                placeholder="Enter node label"
              />
              {validation.label && (
                <p className="text-red-400 text-xs">{validation.label}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-white">Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-teal-500 resize-none"
                placeholder="Describe this variable"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-white">Type</Label>
              <Select
                value={formData.type || 'stock'}
                onValueChange={(value) => handleFieldChange('type', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="stock" className="text-white">Stock</SelectItem>
                  <SelectItem value="flow" className="text-white">Flow</SelectItem>
                  <SelectItem value="auxiliary" className="text-white">Auxiliary</SelectItem>
                  <SelectItem value="constant" className="text-white">Constant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Numeric Properties */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-sm">Initial Value</Label>
                  <ValidationIcon field="value" />
                </div>
                <Input
                  type="number"
                  value={formData.value || ''}
                  onChange={(e) => handleFieldChange('value', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-sm">Delay (months)</Label>
                  <ValidationIcon field="delay" />
                </div>
                <Input
                  type="number"
                  value={formData.delay || ''}
                  onChange={(e) => handleFieldChange('delay', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-3">
              <Label className="text-white">Advanced Settings</Label>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Track in Simulation</span>
                <Switch
                  checked={formData.tracked !== false}
                  onCheckedChange={(checked) => handleFieldChange('tracked', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Volatility</Label>
                <Slider
                  value={[formData.volatility || 0]}
                  onValueChange={([value]) => handleFieldChange('volatility', value)}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Stable</span>
                  <span>Volatile</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Link Properties */}
        {selectedLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <Label className="text-white">Polarity</Label>
              <Select
                value={formData.polarity || 'positive'}
                onValueChange={(value) => handleFieldChange('polarity', value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:border-teal-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="positive" className="text-white">Positive (+)</SelectItem>
                  <SelectItem value="negative" className="text-white">Negative (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Strength</Label>
              <Slider
                value={[formData.strength || 1]}
                onValueChange={([value]) => handleFieldChange('strength', value)}
                max={2}
                min={0.1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white text-sm">Delay (months)</Label>
                <ValidationIcon field="delay" />
              </div>
              <Input
                type="number"
                value={formData.delay || ''}
                onChange={(e) => handleFieldChange('delay', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:border-teal-500"
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>
          </motion.div>
        )}

        <Separator className="bg-slate-600" />

        {/* Simulation Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-teal-400" />
            <h4 className="text-white font-medium">Simulation</h4>
          </div>

          <Button
            onClick={handleRunSimulation}
            disabled={simulationRunning}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {simulationRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>

          {simulationResults && (
            <Button
              variant="outline"
              onClick={() => setShowSimulationOverlay(true)}
              className="w-full border-slate-600 text-white hover:bg-slate-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Toggle Results Overlay
            </Button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Simulation Overlay Toggle */}
      <AnimatePresence>
        {showSimulationOverlay && simulationResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-600"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Simulation Results</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSimulationOverlay(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-3 text-white">
                <p>Simulation completed successfully!</p>
                <div className="text-sm text-gray-400">
                  <p>Duration: 12 months</p>
                  <p>Time steps: 144</p>
                  <p>Convergence: Stable</p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowSimulationOverlay(false)}
                className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};