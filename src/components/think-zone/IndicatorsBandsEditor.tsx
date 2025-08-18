import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Target, 
  Trash2, 
  TrendingUp, 
  AlertTriangle,
  Shield,
  BarChart3
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Indicator {
  id: string;
  label: string;
  tier: number;
  band: {
    method: 'zscore' | 'quantile' | 'holtwinters';
    target: number;
    upper: number;
    lower: number;
    hysteresis: number;
  };
  guardrails: {
    soft: [number, number];
    hard: [number, number];
  };
  dataRef: string;
}

interface IndicatorsBandsEditorProps {
  indicators: Indicator[];
  onChange: (indicators: Indicator[]) => void;
  readonly?: boolean;
}

const BAND_METHODS = {
  zscore: { label: 'Z-Score', description: 'Standard deviation based bands' },
  quantile: { label: 'Quantile', description: 'Percentile based bands' },
  holtwinters: { label: 'Holt-Winters', description: 'Seasonal trend bands' }
};

const TIER_LABELS = {
  1: { label: 'Primary', color: 'bg-red-500/10 text-red-700 border-red-200' },
  2: { label: 'Secondary', color: 'bg-amber-500/10 text-amber-700 border-amber-200' },
  3: { label: 'Tertiary', color: 'bg-blue-500/10 text-blue-700 border-blue-200' }
};

export const IndicatorsBandsEditor: React.FC<IndicatorsBandsEditorProps> = ({
  indicators,
  onChange,
  readonly = false
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [isAddingIndicator, setIsAddingIndicator] = useState(false);

  // Add new indicator
  const handleAddIndicator = useCallback(() => {
    const newIndicator: Indicator = {
      id: `indicator-${Date.now()}`,
      label: 'New Indicator',
      tier: 3,
      band: {
        method: 'zscore',
        target: 0,
        upper: 1,
        lower: -1,
        hysteresis: 0.1
      },
      guardrails: {
        soft: [-1.5, 1.5],
        hard: [-2, 2]
      },
      dataRef: ''
    };

    const newIndicators = [...indicators, newIndicator];
    onChange(newIndicators);
    setSelectedIndicator(newIndicator.id);
    setIsAddingIndicator(false);
    
    toast({
      title: "Indicator Added",
      description: "New indicator has been added to the loop"
    });
  }, [indicators, onChange]);

  // Update indicator
  const handleUpdateIndicator = useCallback((indicatorId: string, updates: Partial<Indicator>) => {
    const newIndicators = indicators.map(indicator =>
      indicator.id === indicatorId ? { ...indicator, ...updates } : indicator
    );
    onChange(newIndicators);
  }, [indicators, onChange]);

  // Delete indicator
  const handleDeleteIndicator = useCallback((indicatorId: string) => {
    const newIndicators = indicators.filter(indicator => indicator.id !== indicatorId);
    onChange(newIndicators);
    setSelectedIndicator(null);
    
    toast({
      title: "Indicator Deleted",
      description: "Indicator has been removed from the loop"
    });
  }, [indicators, onChange]);

  // Update band
  const handleUpdateBand = useCallback((indicatorId: string, bandUpdates: Partial<Indicator['band']>) => {
    handleUpdateIndicator(indicatorId, {
      band: {
        ...indicators.find(i => i.id === indicatorId)?.band!,
        ...bandUpdates
      }
    });
  }, [handleUpdateIndicator, indicators]);

  // Update guardrails
  const handleUpdateGuardrails = useCallback((indicatorId: string, type: 'soft' | 'hard', values: [number, number]) => {
    const indicator = indicators.find(i => i.id === indicatorId);
    if (!indicator) return;

    handleUpdateIndicator(indicatorId, {
      guardrails: {
        ...indicator.guardrails,
        [type]: values
      }
    });
  }, [handleUpdateIndicator, indicators]);

  const selectedIndicatorData = selectedIndicator ? 
    indicators.find(i => i.id === selectedIndicator) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <h3 className="font-semibold">Indicators & Bands</h3>
          </div>
          {!readonly && (
            <Button
              size="sm"
              onClick={handleAddIndicator}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {indicators.length} indicators configured
        </div>
      </div>

      {/* Indicators List */}
      <div className="flex-1 overflow-y-auto">
        {indicators.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No indicators configured</p>
            {!readonly && (
              <p className="text-xs">Add indicators to track loop performance</p>
            )}
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {indicators.map((indicator, index) => (
              <motion.div
                key={indicator.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedIndicator === indicator.id 
                      ? 'ring-2 ring-ring ring-opacity-50' 
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedIndicator(indicator.id)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {indicator.label}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${TIER_LABELS[indicator.tier as keyof typeof TIER_LABELS]?.color}`}
                            >
                              {TIER_LABELS[indicator.tier as keyof typeof TIER_LABELS]?.label}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Method: {BAND_METHODS[indicator.band.method].label}</div>
                            <div>Target: {indicator.band.target}</div>
                            <div>Range: [{indicator.band.lower}, {indicator.band.upper}]</div>
                          </div>
                        </div>
                        
                        {!readonly && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteIndicator(indicator.id);
                            }}
                            className="h-6 w-6 p-0 text-destructive opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      {/* Quick status indicators */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Bands</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-amber-500" />
                          <span className="text-xs text-muted-foreground">Guardrails</span>
                        </div>
                        {indicator.dataRef && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-muted-foreground">Linked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Indicator Detail */}
      <AnimatePresence>
        {selectedIndicatorData && !readonly && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4 bg-accent/20">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Edit Indicator</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIndicator(null)}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>

              {/* Basic Properties */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Label</label>
                  <Input
                    value={selectedIndicatorData.label}
                    onChange={(e) => handleUpdateIndicator(selectedIndicatorData.id, { label: e.target.value })}
                    className="h-8"
                    placeholder="Indicator name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Tier</label>
                    <Select
                      value={selectedIndicatorData.tier.toString()}
                      onValueChange={(value) => handleUpdateIndicator(selectedIndicatorData.id, { tier: Number(value) })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TIER_LABELS).map(([tier, config]) => (
                          <SelectItem key={tier} value={tier}>
                            {config.label} (Tier {tier})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Data Reference</label>
                    <Input
                      value={selectedIndicatorData.dataRef}
                      onChange={(e) => handleUpdateIndicator(selectedIndicatorData.id, { dataRef: e.target.value })}
                      className="h-8"
                      placeholder="table.column"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Band Configuration */}
              <div className="space-y-3">
                <h5 className="font-medium text-xs flex items-center gap-2">
                  <BarChart3 className="h-3 w-3" />
                  Band Configuration
                </h5>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Method</label>
                  <Select
                    value={selectedIndicatorData.band.method}
                    onValueChange={(value) => handleUpdateBand(selectedIndicatorData.id, { method: value as any })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BAND_METHODS).map(([method, config]) => (
                        <SelectItem key={method} value={method}>
                          <div>
                            <div className="font-medium">{config.label}</div>
                            <div className="text-xs text-muted-foreground">{config.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Target</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.band.target}
                      onChange={(e) => handleUpdateBand(selectedIndicatorData.id, { target: Number(e.target.value) })}
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Hysteresis</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={selectedIndicatorData.band.hysteresis}
                      onChange={(e) => handleUpdateBand(selectedIndicatorData.id, { hysteresis: Number(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Lower Bound</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.band.lower}
                      onChange={(e) => handleUpdateBand(selectedIndicatorData.id, { lower: Number(e.target.value) })}
                      className="h-8"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium">Upper Bound</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.band.upper}
                      onChange={(e) => handleUpdateBand(selectedIndicatorData.id, { upper: Number(e.target.value) })}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Guardrails Configuration */}
              <div className="space-y-3">
                <h5 className="font-medium text-xs flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Guardrails
                </h5>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Soft Guardrails</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.guardrails.soft[0]}
                      onChange={(e) => handleUpdateGuardrails(selectedIndicatorData.id, 'soft', [Number(e.target.value), selectedIndicatorData.guardrails.soft[1]])}
                      className="h-8"
                      placeholder="Lower"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.guardrails.soft[1]}
                      onChange={(e) => handleUpdateGuardrails(selectedIndicatorData.id, 'soft', [selectedIndicatorData.guardrails.soft[0], Number(e.target.value)])}
                      className="h-8"
                      placeholder="Upper"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Hard Guardrails</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.guardrails.hard[0]}
                      onChange={(e) => handleUpdateGuardrails(selectedIndicatorData.id, 'hard', [Number(e.target.value), selectedIndicatorData.guardrails.hard[1]])}
                      className="h-8"
                      placeholder="Lower"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedIndicatorData.guardrails.hard[1]}
                      onChange={(e) => handleUpdateGuardrails(selectedIndicatorData.id, 'hard', [selectedIndicatorData.guardrails.hard[0], Number(e.target.value)])}
                      className="h-8"
                      placeholder="Upper"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};