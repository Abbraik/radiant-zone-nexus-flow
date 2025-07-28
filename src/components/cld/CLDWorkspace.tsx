import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CLDCanvas } from './CLDCanvas';
import { PropertiesPanel } from './PropertiesPanel';
import { AddNodeFAB } from './AddNodeFAB';
import { StatusBar } from './StatusBar';
import { SimulationPreviewOverlay } from './SimulationPreviewOverlay';
import { CLDNode, CLDLink, CLDPosition, CLDModel } from '../../types/cld';
import { useToast } from '../ui/use-toast';

export const CLDWorkspace: React.FC = () => {
  const { toast } = useToast();
  
  // Model state
  const [model, setModel] = useState<CLDModel>({
    id: 'model-1',
    name: 'System Dynamics Model',
    nodes: [],
    links: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // UI state
  const [selectedNode, setSelectedNode] = useState<CLDNode | null>(null);
  const [selectedLink, setSelectedLink] = useState<CLDLink | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentScenario, setCurrentScenario] = useState('Baseline');
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showSimulationOverlay, setShowSimulationOverlay] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<Date>();

  // Mock collaborators
  const [collaborators] = useState([
    { id: '1', name: 'Alice', color: '#10b981' },
    { id: '2', name: 'Bob', color: '#3b82f6' },
    { id: '3', name: 'Carol', color: '#f59e0b' }
  ]);

  const scenarios = ['Baseline', 'Optimistic', 'Pessimistic', 'Growth Strategy', 'Crisis Response'];

  // Mark changes
  const markUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
    setModel(prev => ({ ...prev, updatedAt: new Date() }));
  }, []);

  // Node operations
  const handleNodeAdd = useCallback((position: CLDPosition, template?: any) => {
    const newNode: CLDNode = {
      id: `node-${Date.now()}`,
      label: template?.label || 'New Variable',
      description: template?.description || '',
      type: template?.type || 'stock',
      position,
      value: template?.defaultValue || 0,
      delay: 0,
      volatility: 0,
      tracked: true,
      category: template?.category || 'Custom'
    };

    setModel(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    setSelectedNode(newNode);
    markUnsaved();
    
    toast({
      title: "Node Added",
      description: `Added ${newNode.label} to the model`,
      duration: 2000
    });
  }, [markUnsaved, toast]);

  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<CLDNode>) => {
    setModel(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, ...updates } : null);
    }
    
    markUnsaved();
  }, [selectedNode, markUnsaved]);

  const handleNodeMove = useCallback((nodeId: string, position: CLDPosition) => {
    handleNodeUpdate(nodeId, { position });
  }, [handleNodeUpdate]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setModel(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      links: prev.links.filter(link => link.sourceId !== nodeId && link.targetId !== nodeId)
    }));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    
    markUnsaved();
    
    toast({
      title: "Node Deleted",
      description: "Node and its connections have been removed",
      duration: 2000
    });
  }, [selectedNode, markUnsaved, toast]);

  // Link operations
  const handleLinkAdd = useCallback((sourceId: string, targetId: string, polarity: 'positive' | 'negative') => {
    // Check if link already exists
    const existingLink = model.links.find(link => 
      link.sourceId === sourceId && link.targetId === targetId
    );
    
    if (existingLink) {
      toast({
        title: "Link Already Exists",
        description: "A connection between these nodes already exists",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    const newLink: CLDLink = {
      id: `link-${Date.now()}`,
      sourceId,
      targetId,
      polarity,
      strength: 1,
      delay: 0
    };

    setModel(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    setSelectedLink(newLink);
    markUnsaved();
    
    toast({
      title: "Connection Added",
      description: `Added ${polarity} connection`,
      duration: 2000
    });
  }, [model.links, markUnsaved, toast]);

  const handleLinkUpdate = useCallback((linkId: string, updates: Partial<CLDLink>) => {
    setModel(prev => ({
      ...prev,
      links: prev.links.map(link =>
        link.id === linkId ? { ...link, ...updates } : link
      )
    }));
    
    if (selectedLink?.id === linkId) {
      setSelectedLink(prev => prev ? { ...prev, ...updates } : null);
    }
    
    markUnsaved();
  }, [selectedLink, markUnsaved]);

  const handleLinkDelete = useCallback((linkId: string) => {
    setModel(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== linkId)
    }));
    
    if (selectedLink?.id === linkId) {
      setSelectedLink(null);
    }
    
    markUnsaved();
    
    toast({
      title: "Connection Deleted",
      description: "Connection has been removed",
      duration: 2000
    });
  }, [selectedLink, markUnsaved, toast]);

  // Simulation
  const handleRunSimulation = useCallback(async () => {
    if (model.nodes.length === 0) {
      toast({
        title: "No Model to Simulate",
        description: "Add some nodes before running simulation",
        variant: "destructive",
        duration: 3000
      });
      return;
    }

    setSimulationStatus('running');
    setShowSimulationOverlay(true);
    
    toast({
      title: "Simulation Started",
      description: "Running system dynamics simulation...",
      duration: 2000
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock results
      const mockResults = {
        duration: 12,
        timeSteps: 144,
        convergence: 'stable' as const,
        results: model.nodes.map(node => ({
          nodeId: node.id,
          values: Array.from({ length: 144 }, (_, i) => 
            (node.value || 0) + Math.sin(i / 10) * 10 + Math.random() * 5
          ),
          timestamps: Array.from({ length: 144 }, (_, i) => 
            new Date(Date.now() + i * 2.5 * 24 * 60 * 60 * 1000)
          )
        }))
      };
      
      setSimulationResults(mockResults);
      setSimulationStatus('completed');
      setLastRunTime(new Date());
      
      toast({
        title: "Simulation Complete",
        description: "System dynamics simulation finished successfully",
        duration: 3000
      });
    } catch (error) {
      setSimulationStatus('error');
      toast({
        title: "Simulation Failed",
        description: "An error occurred during simulation",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [model, toast]);

  // Save model
  const handleSave = useCallback(() => {
    // Simulate save operation
    setTimeout(() => {
      setHasUnsavedChanges(false);
      toast({
        title: "Model Saved",
        description: "All changes have been saved",
        duration: 2000
      });
    }, 500);
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'n':
            if (!e.ctrlKey && !e.metaKey) {
              handleNodeAdd({ x: 400, y: 300 });
            }
            break;
          case 'r':
            if (!e.ctrlKey && !e.metaKey) {
              handleRunSimulation();
            }
            break;
          case 'delete':
          case 'backspace':
            if (selectedNode) {
              handleNodeDelete(selectedNode.id);
            } else if (selectedLink) {
              handleLinkDelete(selectedLink.id);
            }
            break;
          case 'escape':
            setSelectedNode(null);
            setSelectedLink(null);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleNodeAdd, handleRunSimulation, selectedNode, selectedLink, handleNodeDelete, handleLinkDelete]);

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <CLDCanvas
            nodes={model.nodes}
            links={model.links}
            selectedNode={selectedNode}
            selectedLink={selectedLink}
            onNodeSelect={setSelectedNode}
            onLinkSelect={setSelectedLink}
            onNodeMove={handleNodeMove}
            onNodeAdd={handleNodeAdd}
            onNodeDelete={handleNodeDelete}
            onLinkAdd={handleLinkAdd}
            onLinkDelete={handleLinkDelete}
          />

          {/* Add Node FAB */}
          <AddNodeFAB onAddNode={handleNodeAdd} />

          {/* Simulation Preview Overlay */}
          {showSimulationOverlay && simulationResults && (
            <SimulationPreviewOverlay
              results={simulationResults}
              onClose={() => setShowSimulationOverlay(false)}
              nodes={model.nodes}
            />
          )}
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          selectedNode={selectedNode}
          selectedLink={selectedLink}
          onNodeUpdate={handleNodeUpdate}
          onLinkUpdate={handleLinkUpdate}
          onRunSimulation={handleRunSimulation}
          simulationRunning={simulationStatus === 'running'}
          simulationResults={simulationResults}
        />
      </div>

      {/* Status Bar */}
      <StatusBar
        hasUnsavedChanges={hasUnsavedChanges}
        currentScenario={currentScenario}
        scenarios={scenarios}
        onScenarioChange={setCurrentScenario}
        simulationStatus={simulationStatus}
        lastRunTime={lastRunTime}
        onSave={handleSave}
        collaborators={collaborators}
      />

      {/* Global selection dimming effect */}
      {(selectedNode || selectedLink) && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            mixBlendMode: 'multiply'
          }}
        />
      )}
    </div>
  );
};