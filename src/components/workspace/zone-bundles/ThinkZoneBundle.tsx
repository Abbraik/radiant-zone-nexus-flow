import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Network, Target, Settings } from 'lucide-react';
import { LoopStudio } from '@/components/think-zone/LoopStudio';
import { VariablePalette } from '@/components/think-zone/VariablePalette';
import { ParameterPanel } from '@/components/think-zone/ParameterPanel';
import { LeverageDomainMapper } from '@/components/think-zone/LeverageDomainMapper';
import type { ZoneBundleProps } from '@/types/zone-bundles';

interface ThinkZoneBundleProps extends ZoneBundleProps {}

const ThinkZoneBundle: React.FC<ThinkZoneBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [cldModel, setCldModel] = useState(payload?.cldModel || {
    nodes: [],
    links: [],
    metadata: { title: '', description: '' }
  });
  const [indicators, setIndicators] = useState(payload?.indicators || []);
  const [leveragePoints, setLeveragePoints] = useState(payload?.leveragePoints || []);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update payload when data changes
  const updatePayload = useCallback((updates: any) => {
    const newPayload = {
      ...payload,
      ...updates,
      lastModified: new Date().toISOString()
    };
    onPayloadUpdate(newPayload);
  }, [payload, onPayloadUpdate]);

  // Handle CLD model changes
  const handleModelChange = useCallback((model: any) => {
    setCldModel(model);
    updatePayload({ cldModel: model });
  }, [updatePayload]);

  // Handle model save
  const handleModelSave = useCallback((model: any) => {
    setCldModel(model);
    updatePayload({ 
      cldModel: model,
      publishReady: validateModel(model)
    });
  }, [updatePayload]);

  // Handle indicators update
  const handleIndicatorsUpdate = useCallback((newIndicators: any[]) => {
    setIndicators(newIndicators);
    updatePayload({ indicators: newIndicators });
  }, [updatePayload]);

  // Handle leverage points update
  const handleLeverageUpdate = useCallback((newLeveragePoints: any[]) => {
    setLeveragePoints(newLeveragePoints);
    updatePayload({ leveragePoints: newLeveragePoints });
  }, [updatePayload]);

  // Validate the current model
  const validateModel = useCallback((model: any) => {
    const errors: string[] = [];
    
    // Check for required nodes
    const hasRequiredNodes = model.nodes?.some((node: any) => 
      ['population', 'domain', 'institution'].includes(node.type?.toLowerCase())
    );
    if (!hasRequiredNodes) {
      errors.push('At least one Population, Domain, or Institution node required');
    }

    // Check for indicators with band methods
    const hasIndicatorWithBand = indicators.some((indicator: any) => indicator.bandMethod);
    if (!hasIndicatorWithBand) {
      errors.push('At least one indicator with band method required');
    }

    // Check for dangling edges
    const hasDanglingEdges = model.links?.some((link: any) => !link.source || !link.target);
    if (hasDanglingEdges) {
      errors.push('No dangling edges allowed');
    }

    // Check for leverage points
    if (leveragePoints.length === 0) {
      errors.push('At least one leverage point must be mapped');
    }

    setValidationErrors(errors);
    const isValid = errors.length === 0;
    onValidationChange(isValid);
    
    return isValid;
  }, [indicators, leveragePoints, onValidationChange]);

  // Run validation when dependencies change
  useEffect(() => {
    validateModel(cldModel);
  }, [cldModel, indicators, leveragePoints, validateModel]);

  // Initialize from payload
  useEffect(() => {
    if (payload?.cldModel) {
      setCldModel(payload.cldModel);
    }
    if (payload?.indicators) {
      setIndicators(payload.indicators);
    }
    if (payload?.leveragePoints) {
      setLeveragePoints(payload.leveragePoints);
    }
  }, [payload]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Brain className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">THINK Zone Bundle</h2>
            <p className="text-sm text-muted-foreground">
              Loop Design & Systems Thinking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="text-blue-500 border-blue-500/30">
            THINK
          </Badge>
          {validationErrors.length === 0 ? (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Valid
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-500 border-amber-500/30">
              {validationErrors.length} Issues
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="canvas" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Loop Canvas
            </TabsTrigger>
            <TabsTrigger value="variables" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Variables
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="leverage" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Leverage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="canvas" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Causal Loop Diagram Builder</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <LoopStudio
                  taskId={taskId}
                  payload={payload}
                  onPayloadUpdate={onPayloadUpdate}
                  onValidationChange={onValidationChange}
                  readonly={readonly}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="variables" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Variable Palette</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <VariablePalette
                  onVariableSelect={(variable) => {
                    // Add variable to CLD model
                    const newNode = {
                      id: `node_${Date.now()}`,
                      type: 'variable',
                      data: { label: variable.label, variable },
                      position: { x: Math.random() * 400, y: Math.random() * 300 }
                    };
                    
                    const updatedModel = {
                      ...cldModel,
                      nodes: [...(cldModel.nodes || []), newNode]
                    };
                    
                    handleModelChange(updatedModel);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Parameters & Bands</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="text-sm text-muted-foreground">
                  Parameter panel integration will be available in the next phase.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leverage" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Leverage Domain Mapping</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="text-sm text-muted-foreground">
                  Leverage domain mapper integration will be available in the next phase.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <h4 className="text-sm font-medium text-amber-600 mb-2">
              Validation Issues ({validationErrors.length})
            </h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs text-amber-600">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ThinkZoneBundle;