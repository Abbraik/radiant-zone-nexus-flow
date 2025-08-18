import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Network, 
  Target, 
  Wrench, 
  FileText, 
  Save, 
  CheckCircle, 
  Upload,
  User,
  AlertTriangle,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { PAGSGraphEditor } from './PAGSGraphEditor';
import { IndicatorsBandsEditor } from './IndicatorsBandsEditor';
import { LeversInstrumentsEditor } from './LeversInstrumentsEditor';
import { LoopDocsEditor } from './LoopDocsEditor';
import { toast } from '@/components/ui/use-toast';

interface LoopStudioProps {
  taskId: string;
  payload: any;
  onPayloadUpdate: (payload: any) => void;
  onValidationChange: (isValid: boolean, errors?: string[]) => void;
  readonly?: boolean;
  onClose?: () => void;
}

interface LoopData {
  id: string;
  name: string;
  purpose: string;
  steward: string;
  graph: {
    nodes: Array<{
      id: string;
      kind: 'Population' | 'Domain' | 'Institution';
      label: string;
      tags: string[];
      position?: { x: number; y: number };
    }>;
    edges: Array<{
      from: string;
      to: string;
      label: string;
      weight: number;
    }>;
  };
  typology: 'Reactive' | 'Structural' | 'Perceptual' | '';
  structureClass: 'Reinforcing' | 'Balancing' | 'Nested' | 'Cascading' | 'CrossDim' | '';
  indicators: Array<{
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
  }>;
  meadowsLevers: string[];
  instrumentFamilies: string[];
  publishToMonitor: boolean;
}

const initialLoopData: LoopData = {
  id: '',
  name: '',
  purpose: '',
  steward: '',
  graph: { nodes: [], edges: [] },
  typology: '',
  structureClass: '',
  indicators: [],
  meadowsLevers: [],
  instrumentFamilies: [],
  publishToMonitor: false
};

export const LoopStudio: React.FC<LoopStudioProps> = ({
  taskId,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false,
  onClose
}) => {
  const [loopData, setLoopData] = useState<LoopData>(
    payload?.loop || initialLoopData
  );
  const [activeTab, setActiveTab] = useState('graph');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Update payload when loop data changes
  const updatePayload = useCallback((updates: Partial<LoopData>) => {
    const newLoopData = { ...loopData, ...updates };
    setLoopData(newLoopData);
    
    const newPayload = {
      ...payload,
      loop: newLoopData,
      lastModified: new Date().toISOString()
    };
    
    onPayloadUpdate(newPayload);
  }, [loopData, payload, onPayloadUpdate]);

  // Validation logic
  const validateLoop = useCallback(() => {
    const errors: string[] = [];

    // Required fields
    if (!loopData.name.trim()) {
      errors.push('Loop name is required');
    }
    if (!loopData.typology) {
      errors.push('Typology selection is required');
    }
    if (!loopData.structureClass) {
      errors.push('Structure class selection is required');
    }

    // Node requirements
    const { nodes } = loopData.graph;
    const hasPopulation = nodes.some(n => n.kind === 'Population');
    const hasDomain = nodes.some(n => n.kind === 'Domain');
    const hasInstitution = nodes.some(n => n.kind === 'Institution');

    if (!hasPopulation) {
      errors.push('At least one Population node is required');
    }
    if (!hasDomain) {
      errors.push('At least one Domain node is required');
    }
    if (!hasInstitution) {
      errors.push('At least one Institution node is required');
    }

    // Indicator requirements
    if (loopData.indicators.length === 0) {
      errors.push('At least one indicator is required');
    } else {
      const hasValidBands = loopData.indicators.every(ind => 
        ind.band.method && ind.band.target !== undefined
      );
      if (!hasValidBands) {
        errors.push('All indicators must have valid band configuration');
      }

      const hasValidGuardrails = loopData.indicators.every(ind => 
        ind.guardrails.soft && ind.guardrails.hard
      );
      if (!hasValidGuardrails) {
        errors.push('All indicators must have guardrails configured');
      }
    }

    // Meadows levers requirement
    if (loopData.meadowsLevers.length === 0) {
      errors.push('At least one Meadows lever must be selected');
    }

    // Instrument families requirement
    if (loopData.instrumentFamilies.length === 0) {
      errors.push('At least one instrument family must be selected');
    }

    // Check for dangling edges
    const nodeIds = new Set(nodes.map(n => n.id));
    const hasDanglingEdges = loopData.graph.edges.some(e => 
      !nodeIds.has(e.from) || !nodeIds.has(e.to)
    );
    if (hasDanglingEdges) {
      errors.push('No dangling edges allowed');
    }

    setValidationErrors(errors);
    const isValid = errors.length === 0;
    onValidationChange(isValid, errors);
    
    return isValid;
  }, [loopData, onValidationChange]);

  // Handle validation
  const handleValidate = useCallback(async () => {
    setIsValidating(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isValid = validateLoop();
    setIsValidating(false);
    
    if (isValid) {
      toast({
        title: "Validation Successful",
        description: "Loop meets all requirements and is ready for publishing."
      });
    } else {
      toast({
        title: "Validation Failed",
        description: `${validationErrors.length} issues found. Check the validation panel.`,
        variant: "destructive"
      });
    }
  }, [validateLoop, validationErrors.length]);

  // Handle save draft
  const handleSaveDraft = useCallback(() => {
    updatePayload({ publishToMonitor: false });
    setLastSaved(new Date());
    toast({
      title: "Draft Saved",
      description: "Loop has been saved as draft."
    });
  }, [updatePayload]);

  // Handle publish to monitor
  const handlePublishToMonitor = useCallback(() => {
    if (validateLoop()) {
      updatePayload({ publishToMonitor: true });
      setLastSaved(new Date());
      
      // Emit telemetry event
      console.log('think.published', { taskId, loopId: loopData.id });
      
      toast({
        title: "Published to MONITOR",
        description: "Loop has been published and is now available in MONITOR zone."
      });
    } else {
      toast({
        title: "Cannot Publish",
        description: "Please fix validation errors before publishing.",
        variant: "destructive"
      });
    }
  }, [validateLoop, updatePayload, taskId, loopData.id]);

  // Run validation on data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      validateLoop();
    }, 300);
    return () => clearTimeout(timer);
  }, [loopData, validateLoop]);

  // Initialize from payload
  useEffect(() => {
    if (payload?.loop) {
      setLoopData(payload.loop);
    }
  }, [payload]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Toolbar - Sticky */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4 space-y-4">
          {/* Main Controls */}
          <div className="flex items-center gap-4">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Loop name"
                  value={loopData.name}
                  onChange={(e) => updatePayload({ name: e.target.value })}
                  className="text-lg font-semibold border-none shadow-none px-0"
                  disabled={readonly}
                />
                {loopData.steward && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Steward
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Select 
                  value={loopData.typology} 
                  onValueChange={(value) => updatePayload({ typology: value as any })}
                  disabled={readonly}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Typology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reactive">Reactive</SelectItem>
                    <SelectItem value="Structural">Structural</SelectItem>
                    <SelectItem value="Perceptual">Perceptual</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={loopData.structureClass} 
                  onValueChange={(value) => updatePayload({ structureClass: value as any })}
                  disabled={readonly}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reinforcing">Reinforcing</SelectItem>
                    <SelectItem value="Balancing">Balancing</SelectItem>
                    <SelectItem value="Nested">Nested</SelectItem>
                    <SelectItem value="Cascading">Cascading</SelectItem>
                    <SelectItem value="CrossDim">Cross-Dimensional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleValidate}
                disabled={readonly || isValidating}
                className="flex items-center gap-2"
              >
                {isValidating ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Validate
              </Button>

              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={readonly}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              <Button
                onClick={handlePublishToMonitor}
                disabled={readonly || validationErrors.length > 0}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Publish to MONITOR
              </Button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge 
                variant={validationErrors.length === 0 ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {validationErrors.length === 0 ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {validationErrors.length === 0 ? 'Valid' : `${validationErrors.length} Issues`}
              </Badge>

              {loopData.publishToMonitor && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Published
                </Badge>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {lastSaved && `Saved ${lastSaved.toLocaleTimeString()}`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Canvas - Left 2/3 */}
          <ResizablePanel defaultSize={67} minSize={50}>
            <div className="h-full p-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    PAGS Graph Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <PAGSGraphEditor
                    graph={loopData.graph}
                    onChange={(graph) => updatePayload({ graph })}
                    readonly={readonly}
                  />
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Inspector - Right 1/3 */}
          <ResizablePanel defaultSize={33} minSize={25}>
            <div className="h-full">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <div className="border-b border-border">
                  <TabsList className="grid grid-cols-4 w-full rounded-none">
                    <TabsTrigger value="graph" className="text-xs">
                      <Network className="h-3 w-3 mr-1" />
                      Nodes
                    </TabsTrigger>
                    <TabsTrigger value="indicators" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      Indicators
                    </TabsTrigger>
                    <TabsTrigger value="levers" className="text-xs">
                      <Wrench className="h-3 w-3 mr-1" />
                      Levers
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      Docs
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="graph" className="h-full mt-0 p-4">
                  <div className="space-y-4">
                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Graph Summary</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <div>Population nodes: {loopData.graph.nodes.filter(n => n.kind === 'Population').length}</div>
                        <div>Domain nodes: {loopData.graph.nodes.filter(n => n.kind === 'Domain').length}</div>
                        <div>Institution nodes: {loopData.graph.nodes.filter(n => n.kind === 'Institution').length}</div>
                        <div>Edges: {loopData.graph.edges.length}</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="space-y-1">
                        {['Population', 'Domain', 'Institution'].map(kind => {
                          const hasNodes = loopData.graph.nodes.some(n => n.kind === kind);
                          return (
                            <div key={kind} className="flex items-center gap-2">
                              {hasNodes ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-amber-600" />
                              )}
                              <span className="text-xs">{kind} node</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="indicators" className="h-full mt-0">
                  <IndicatorsBandsEditor
                    indicators={loopData.indicators}
                    onChange={(indicators) => updatePayload({ indicators })}
                    readonly={readonly}
                  />
                </TabsContent>

                <TabsContent value="levers" className="h-full mt-0">
                  <LeversInstrumentsEditor
                    meadowsLevers={loopData.meadowsLevers}
                    instrumentFamilies={loopData.instrumentFamilies}
                    onMeadowsChange={(meadowsLevers) => updatePayload({ meadowsLevers })}
                    onInstrumentsChange={(instrumentFamilies) => updatePayload({ instrumentFamilies })}
                    readonly={readonly}
                  />
                </TabsContent>

                <TabsContent value="docs" className="h-full mt-0">
                  <LoopDocsEditor
                    purpose={loopData.purpose}
                    onChange={(purpose) => updatePayload({ purpose })}
                    readonly={readonly}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Validation Errors Panel */}
      {validationErrors.length > 0 && (
        <div className="border-t border-border bg-destructive/5 p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Validation Issues ({validationErrors.length})
            </h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-xs text-destructive">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};