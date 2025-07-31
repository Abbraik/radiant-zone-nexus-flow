import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Info, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { CLDLink } from '../../types/cld';

export interface DelayIndicator {
  linkId: string;
  delayAmount: number;
  delayUnit: 'days' | 'weeks' | 'months' | 'years';
  delayType: 'information' | 'material' | 'perception' | 'decision';
  description?: string;
  impact: 'low' | 'medium' | 'high';
}

interface DelayIndicatorSystemProps {
  links: CLDLink[];
  delayIndicators: DelayIndicator[];
  onDelayUpdate: (linkId: string, delay: DelayIndicator) => void;
  onDelayRemove: (linkId: string) => void;
  selectedLinkId?: string;
}

export const DelayIndicatorSystem: React.FC<DelayIndicatorSystemProps> = ({
  links,
  delayIndicators,
  onDelayUpdate,
  onDelayRemove,
  selectedLinkId
}) => {
  const [showDelayConfig, setShowDelayConfig] = useState(false);
  const [editingDelay, setEditingDelay] = useState<string | null>(null);

  const getDelayColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'high': return 'bg-red-500/10 text-red-600 border-red-200';
    }
  };

  const getDelayTypeIcon = (type: DelayIndicator['delayType']) => {
    switch (type) {
      case 'information': return <Info className="h-3 w-3" />;
      case 'material': return <Settings className="h-3 w-3" />;
      case 'perception': return <AlertTriangle className="h-3 w-3" />;
      case 'decision': return <Clock className="h-3 w-3" />;
    }
  };

  const getDelayDescription = (type: DelayIndicator['delayType']) => {
    switch (type) {
      case 'information': return 'Time for information to flow';
      case 'material': return 'Time for physical processes';
      case 'perception': return 'Time to recognize changes';
      case 'decision': return 'Time to make decisions';
    }
  };

  const formatDelayTime = (amount: number, unit: DelayIndicator['delayUnit']) => {
    return `${amount} ${unit}${amount !== 1 ? 's' : ''}`;
  };

  const linksWithDelays = links.filter(link => 
    delayIndicators.some(indicator => indicator.linkId === link.id)
  );

  const linksWithoutDelays = links.filter(link => 
    !delayIndicators.some(indicator => indicator.linkId === link.id)
  );

  const handleAddDelay = (linkId: string) => {
    const newDelay: DelayIndicator = {
      linkId,
      delayAmount: 1,
      delayUnit: 'weeks',
      delayType: 'information',
      impact: 'medium',
      description: ''
    };
    onDelayUpdate(linkId, newDelay);
    setEditingDelay(linkId);
  };

  const handleUpdateDelay = (indicator: DelayIndicator, updates: Partial<DelayIndicator>) => {
    onDelayUpdate(indicator.linkId, { ...indicator, ...updates });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Delay Indicators</h3>
          <Badge variant="secondary" className="text-xs">
            {delayIndicators.length} active
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDelayConfig(!showDelayConfig)}
        >
          {showDelayConfig ? 'Hide Config' : 'Configure'}
        </Button>
      </div>

      {/* Current Delays */}
      {linksWithDelays.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Active Delays</h4>
          {linksWithDelays.map(link => {
            const indicator = delayIndicators.find(d => d.linkId === link.id)!;
            const isEditing = editingDelay === link.id;
            
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`p-4 ${selectedLinkId === link.id ? 'ring-2 ring-primary' : ''}`}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getDelayTypeIcon(indicator.delayType)}
                          <span className="font-medium text-sm">
                            Link Delay
                          </span>
                          <Badge className={getDelayColor(indicator.impact)}>
                            {indicator.impact} impact
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDelayTime(indicator.delayAmount, indicator.delayUnit)} - {getDelayDescription(indicator.delayType)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDelay(isEditing ? null : link.id)}
                        >
                          {isEditing ? 'Done' : 'Edit'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelayRemove(link.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    {isEditing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-3 pt-3 border-t border-border"
                      >
                        {/* Delay Amount */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Delay Duration: {indicator.delayAmount}
                          </label>
                          <Slider
                            value={[indicator.delayAmount]}
                            onValueChange={([value]) => handleUpdateDelay(indicator, { delayAmount: value })}
                            min={1}
                            max={52}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        {/* Delay Unit */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Time Unit
                          </label>
                          <div className="flex gap-1">
                            {(['days', 'weeks', 'months', 'years'] as DelayIndicator['delayUnit'][]).map(unit => (
                              <Button
                                key={unit}
                                variant={indicator.delayUnit === unit ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleUpdateDelay(indicator, { delayUnit: unit })}
                                className="text-xs"
                              >
                                {unit}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Delay Type */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Delay Type
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            {(['information', 'material', 'perception', 'decision'] as DelayIndicator['delayType'][]).map(type => (
                              <Button
                                key={type}
                                variant={indicator.delayType === type ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleUpdateDelay(indicator, { delayType: type })}
                                className="text-xs justify-start"
                              >
                                {getDelayTypeIcon(type)}
                                <span className="ml-1 capitalize">{type}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Impact Level */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">
                            Impact Level
                          </label>
                          <div className="flex gap-1">
                            {(['low', 'medium', 'high'] as DelayIndicator['impact'][]).map(impact => (
                              <Button
                                key={impact}
                                variant={indicator.impact === impact ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleUpdateDelay(indicator, { impact })}
                                className="text-xs"
                              >
                                {impact}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Delays */}
      {showDelayConfig && linksWithoutDelays.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <h4 className="text-sm font-medium text-muted-foreground">Add Delays</h4>
          <div className="space-y-2">
            {linksWithoutDelays.map(link => (
              <Card key={link.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Link {link.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {link.polarity} relationship
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddDelay(link.id)}
                  >
                    Add Delay
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Delay Guidelines */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-medium">Delay Guidelines</h4>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p><strong>Information delays:</strong> Time for data to flow and be processed</p>
            <p><strong>Material delays:</strong> Physical process completion time</p>
            <p><strong>Perception delays:</strong> Time to notice and interpret changes</p>
            <p><strong>Decision delays:</strong> Time needed for decision-making processes</p>
          </div>
        </div>
      </Card>

      {delayIndicators.length === 0 && (
        <Card className="p-6 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">No delays configured</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add delay indicators to model temporal relationships in your causal loop
          </p>
        </Card>
      )}
    </div>
  );
};