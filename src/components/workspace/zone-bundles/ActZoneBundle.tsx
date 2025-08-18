import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Users, CheckCircle } from 'lucide-react';
import InterventionPicker from '@/components/widgets/InterventionPicker';
import RACIMatrix from '@/components/widgets/RACIMatrix';
import { SixLeverSelector } from '@/components/widgets/SixLeverSelector';
import type { ZoneBundleProps } from '@/types/zone-bundles';

interface ActZoneBundleProps extends ZoneBundleProps {}

const ActZoneBundle: React.FC<ActZoneBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [activeTab, setActiveTab] = useState('instruments');
  const [selectedInstruments, setSelectedInstruments] = useState(payload?.instruments || []);
  const [pathwayGraph, setPathwayGraph] = useState(payload?.pathway || { nodes: [], edges: [], isValid: false });
  const [mandateGate, setMandateGate] = useState(payload?.mandateGate || { passed: false, waiver: false });
  const [raciMatrix, setRaciMatrix] = useState(payload?.raci || {});
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

  // Handle instruments selection
  const handleInstrumentsUpdate = useCallback((instruments: any[]) => {
    setSelectedInstruments(instruments);
    updatePayload({ instruments });
  }, [updatePayload]);

  // Handle pathway updates
  const handlePathwayUpdate = useCallback((pathway: any) => {
    setPathwayGraph(pathway);
    updatePayload({ pathway });
  }, [updatePayload]);

  // Handle mandate gate updates
  const handleMandateGateUpdate = useCallback((gate: any) => {
    setMandateGate(gate);
    updatePayload({ mandateGate: gate });
  }, [updatePayload]);

  // Handle RACI matrix updates
  const handleRaciUpdate = useCallback((raci: any) => {
    setRaciMatrix(raci);
    updatePayload({ raci });
  }, [updatePayload]);

  // Validate the current state
  const validateState = useCallback(() => {
    const errors: string[] = [];
    
    // Check for selected instruments
    if (selectedInstruments.length === 0) {
      errors.push('At least one instrument must be selected');
    }

    // Check pathway validity
    if (!pathwayGraph.isValid) {
      errors.push('Pathway graph must be complete');
    }

    // Check mandate gate
    if (!mandateGate.passed && !mandateGate.waiver) {
      errors.push('Mandate gate must be passed or waiver attached');
    }

    // Check RACI completeness
    const raciKeys = Object.keys(raciMatrix);
    if (raciKeys.length === 0) {
      errors.push('RACI matrix must be defined');
    }

    setValidationErrors(errors);
    const isValid = errors.length === 0;
    onValidationChange(isValid);
    
    return isValid;
  }, [selectedInstruments, pathwayGraph, mandateGate, raciMatrix, onValidationChange]);

  // Run validation when dependencies change
  useEffect(() => {
    validateState();
  }, [validateState]);

  // Initialize from payload
  useEffect(() => {
    if (payload?.instruments) {
      setSelectedInstruments(payload.instruments);
    }
    if (payload?.pathway) {
      setPathwayGraph(payload.pathway);
    }
    if (payload?.mandateGate) {
      setMandateGate(payload.mandateGate);
    }
    if (payload?.raci) {
      setRaciMatrix(payload.raci);
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
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">ACT Zone Bundle</h2>
            <p className="text-sm text-muted-foreground">
              Sprint Planning & Intervention Design
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="text-amber-500 border-amber-500/30">
            ACT
          </Badge>
          {validationErrors.length === 0 ? (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              Valid
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-500 border-red-500/30">
              {validationErrors.length} Issues
            </Badge>
          )}
          {mandateGate.passed && (
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Gate Passed
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="instruments" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Instruments
            </TabsTrigger>
            <TabsTrigger value="pathway" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Pathway
            </TabsTrigger>
            <TabsTrigger value="mandate" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Mandate Gate
            </TabsTrigger>
            <TabsTrigger value="raci" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              RACI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instruments" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Government Instruments</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="space-y-6">
                  <SixLeverSelector
                    selectedSubLevers={selectedInstruments.map(i => i.id)}
                    onSubLeverSelect={(id) => {
                      const newInstrument = { id, name: `Instrument ${id}` };
                      handleInstrumentsUpdate([...selectedInstruments, newInstrument]);
                    }}
                    onSubLeverDeselect={(id) => {
                      handleInstrumentsUpdate(selectedInstruments.filter(i => i.id !== id));
                    }}
                  />
                  <InterventionPicker
                    task={{ 
                      id: taskId, 
                      title: taskData?.title || 'ACT Task',
                      ...taskData 
                    } as any}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pathway" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Pathway Builder</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Pathway Builder</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Build authority, funding, data, and coordination pathways for your interventions.
                      This component will be implemented in the next phase.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mandate" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Mandate Gate</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="space-y-6">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium mb-2">Authority Check</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={mandateGate.passed}
                          onChange={(e) => handleMandateGateUpdate({
                            ...mandateGate,
                            passed: e.target.checked
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Authority confirmed for selected instruments</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={mandateGate.waiver}
                          onChange={(e) => handleMandateGateUpdate({
                            ...mandateGate,
                            waiver: e.target.checked
                          })}
                          className="rounded"
                        />
                        <span className="text-sm">Waiver attached for authority exceptions</span>
                      </label>
                    </div>
                  </div>
                  
                  {!mandateGate.passed && !mandateGate.waiver && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <p className="text-sm text-amber-600">
                        ⚠️ Either authority must be confirmed or a waiver must be attached to proceed.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="raci" className="h-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>RACI Matrix</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <RACIMatrix
                  task={{ 
                    id: taskId, 
                    title: taskData?.title || 'ACT Task',
                    ...taskData 
                  } as any}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <h4 className="text-sm font-medium text-red-600 mb-2">
              Validation Issues ({validationErrors.length})
            </h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs text-red-600">
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

export default ActZoneBundle;