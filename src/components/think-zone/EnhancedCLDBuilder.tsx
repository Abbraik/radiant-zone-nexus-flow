import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import { CLDCanvas } from '../cld/CLDCanvas';
import { CLDModel, CLDNode, CLDLink } from '../../types/cld';
import { VariablePalette } from './VariablePalette';
import { DelayIndicatorSystem, DelayIndicator } from './DelayIndicatorSystem';
import { LoopArchetype } from './LoopBrowser';
import { ArchetypeScaffolder } from './ArchetypeScaffolder';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Brain, Lightbulb, Clock, Save } from 'lucide-react';
import { toast } from '../ui/use-toast';

interface EnhancedCLDBuilderProps {
  selectedArchetype?: LoopArchetype;
  onModelChange: (model: CLDModel) => void;
  onSave: (model: CLDModel) => void;
}

export const EnhancedCLDBuilder: React.FC<EnhancedCLDBuilderProps> = ({
  selectedArchetype,
  onModelChange,
  onSave
}) => {
  const [model, setModel] = useState<CLDModel>(() => {
    if (selectedArchetype) {
      return ArchetypeScaffolder.generateModel(selectedArchetype);
    }
    return {
      id: `custom-model-${Date.now()}`,
      name: 'Custom CLD Model',
      description: 'Custom causal loop diagram',
      nodes: [],
      links: [],
      metadata: { isCustom: true },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [delayIndicators, setDelayIndicators] = useState<DelayIndicator[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update model and mark as changed
  const updateModel = useCallback((newModel: CLDModel) => {
    setModel(newModel);
    setHasUnsavedChanges(true);
    onModelChange(newModel);
  }, [onModelChange]);

  // Node operations
  const handleNodeAdd = useCallback((node: Omit<CLDNode, 'id'>) => {
    const newNode: CLDNode = {
      ...node,
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newModel = {
      ...model,
      nodes: [...model.nodes, newNode],
      updatedAt: new Date()
    };
    
    updateModel(newModel);
    generateAISuggestions(newModel);
    
    toast({
      title: "Node added",
      description: `${newNode.label} has been added to the model`
    });
  }, [model, updateModel]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<CLDNode>) => {
    const newModel = {
      ...model,
      nodes: model.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ),
      updatedAt: new Date()
    };
    updateModel(newModel);
  }, [model, updateModel]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    const newModel = {
      ...model,
      nodes: model.nodes.filter(node => node.id !== nodeId),
      links: model.links.filter(link => link.sourceId !== nodeId && link.targetId !== nodeId),
      updatedAt: new Date()
    };
    updateModel(newModel);
    setSelectedNodeId(null);
  }, [model, updateModel]);

  // Link operations
  const handleLinkAdd = useCallback((link: Omit<CLDLink, 'id'>) => {
    const newLink: CLDLink = {
      ...link,
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newModel = {
      ...model,
      links: [...model.links, newLink],
      updatedAt: new Date()
    };
    
    updateModel(newModel);
    generateAISuggestions(newModel);
    
    toast({
      title: "Connection added",
      description: `New ${newLink.polarity} link created`
    });
  }, [model, updateModel]);

  const handleLinkUpdate = useCallback((linkId: string, updates: Partial<CLDLink>) => {
    const newModel = {
      ...model,
      links: model.links.map(link => 
        link.id === linkId ? { ...link, ...updates } : link
      ),
      updatedAt: new Date()
    };
    updateModel(newModel);
  }, [model, updateModel]);

  const handleLinkDelete = useCallback((linkId: string) => {
    const newModel = {
      ...model,
      links: model.links.filter(link => link.id !== linkId),
      updatedAt: new Date()
    };
    updateModel(newModel);
    setSelectedLinkId(null);
    
    // Remove associated delay indicator
    setDelayIndicators(prev => prev.filter(delay => delay.linkId !== linkId));
  }, [model, updateModel]);

  // Variable palette integration
  const handleVariableSelect = useCallback((variable: any) => {
    const newNode: Omit<CLDNode, 'id'> = {
      label: variable.label,
      type: variable.type,
      position: {
        x: 200 + Math.random() * 400,
        y: 150 + Math.random() * 300
      },
      value: variable.defaultValue,
      description: variable.description,
      category: variable.category,
      metadata: {
        fromTemplate: true,
        variableType: variable.category
      }
    };
    
    handleNodeAdd(newNode);
  }, [handleNodeAdd]);

  // Delay indicator management
  const handleDelayUpdate = useCallback((linkId: string, delay: DelayIndicator) => {
    setDelayIndicators(prev => {
      const existing = prev.findIndex(d => d.linkId === linkId);
      if (existing >= 0) {
        const newDelays = [...prev];
        newDelays[existing] = delay;
        return newDelays;
      } else {
        return [...prev, delay];
      }
    });

    // Update the link with delay information
    handleLinkUpdate(linkId, { delay: delay.delayAmount });
  }, [handleLinkUpdate]);

  const handleDelayRemove = useCallback((linkId: string) => {
    setDelayIndicators(prev => prev.filter(delay => delay.linkId !== linkId));
    handleLinkUpdate(linkId, { delay: undefined });
  }, [handleLinkUpdate]);

  // AI Suggestions
  const generateAISuggestions = useCallback((currentModel: CLDModel) => {
    // Mock AI suggestions based on current model state
    const suggestions: string[] = [];
    
    if (currentModel.nodes.length < 3) {
      suggestions.push("Consider adding more variables to capture system complexity");
    }
    
    if (currentModel.links.length === 0) {
      suggestions.push("Connect variables to show causal relationships");
    }
    
    const hasBalancing = currentModel.links.some(link => link.polarity === 'negative');
    const hasReinforcing = currentModel.links.some(link => link.polarity === 'positive');
    
    if (!hasBalancing) {
      suggestions.push("Add balancing (negative) links to prevent unrealistic growth");
    }
    
    if (!hasReinforcing) {
      suggestions.push("Add reinforcing (positive) links to show growth dynamics");
    }
    
    if (selectedArchetype && currentModel.nodes.length > 0) {
      const archetypeVars = ArchetypeScaffolder.getAvailableVariables(selectedArchetype.id);
      const currentVars = currentModel.nodes.map(node => node.label);
      const missingVars = archetypeVars.filter(v => !currentVars.includes(v));
      
      if (missingVars.length > 0) {
        suggestions.push(`Consider adding: ${missingVars.slice(0, 2).join(', ')}`);
      }
    }
    
    setAiSuggestions(suggestions);
  }, [selectedArchetype]);

  // Save functionality
  const handleSave = useCallback(() => {
    onSave(model);
    setHasUnsavedChanges(false);
    toast({
      title: "Model saved",
      description: "Your causal loop diagram has been saved successfully"
    });
  }, [model, onSave]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">{model.name}</h2>
            {selectedArchetype && (
              <Badge variant="secondary" className="text-xs">
                {selectedArchetype.name} Archetype
              </Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="text-xs">
                Unsaved Changes
              </Badge>
            )}
          </div>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Model
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>{model.nodes.length} variables</span>
          <span>{model.links.length} connections</span>
          <span>{delayIndicators.length} delays</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Tools */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <Tabs defaultValue="variables" className="h-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="variables" className="text-xs">Variables</TabsTrigger>
                <TabsTrigger value="delays" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Delays
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  AI
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="variables" className="h-full mt-0">
                <VariablePalette
                  archetypeId={selectedArchetype?.id}
                  onVariableSelect={handleVariableSelect}
                />
              </TabsContent>
              
              <TabsContent value="delays" className="h-full mt-0 p-4">
                <DelayIndicatorSystem
                  links={model.links}
                  delayIndicators={delayIndicators}
                  onDelayUpdate={handleDelayUpdate}
                  onDelayRemove={handleDelayRemove}
                  selectedLinkId={selectedLinkId}
                />
              </TabsContent>
              
              <TabsContent value="ai" className="h-full mt-0 p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <h3 className="font-semibold">AI Suggestions</h3>
                  </div>
                  
                  {aiSuggestions.length > 0 ? (
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <Card key={index} className="p-3">
                          <p className="text-sm text-muted-foreground">{suggestion}</p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-4 text-center">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Start building your model to get AI suggestions
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center Panel - Canvas */}
          <ResizablePanel defaultSize={75} minSize={50}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <CLDCanvas
                nodes={model.nodes}
                links={model.links}
                selectedNode={selectedNodeId ? model.nodes.find(n => n.id === selectedNodeId) || null : null}
                selectedLink={selectedLinkId ? model.links.find(l => l.id === selectedLinkId) || null : null}
                onNodeSelect={(node) => setSelectedNodeId(node?.id || null)}
                onLinkSelect={(link) => setSelectedLinkId(link?.id || null)}
                onNodeMove={(nodeId, position) => handleNodeUpdate(nodeId, { position })}
                onNodeAdd={(position) => {
                  const newNode: Omit<CLDNode, 'id'> = {
                    label: 'New Variable',
                    type: 'auxiliary',
                    position,
                    description: 'Click to edit'
                  };
                  handleNodeAdd(newNode);
                }}
                onNodeDelete={handleNodeDelete}
                onLinkAdd={(sourceId, targetId, polarity) => {
                  const newLink: Omit<CLDLink, 'id'> = {
                    sourceId,
                    targetId,
                    polarity,
                    lineType: 'curved'
                  };
                  handleLinkAdd(newLink);
                }}
                onLinkDelete={handleLinkDelete}
              />
            </motion.div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};