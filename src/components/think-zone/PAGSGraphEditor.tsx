import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Users, 
  Building, 
  Globe, 
  Trash2, 
  Edit3,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Move
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PAGSNode {
  id: string;
  kind: 'Population' | 'Domain' | 'Institution';
  label: string;
  tags: string[];
  position?: { x: number; y: number };
}

interface PAGSEdge {
  from: string;
  to: string;
  label: string;
  weight: number;
}

interface PAGSGraph {
  nodes: PAGSNode[];
  edges: PAGSEdge[];
}

interface PAGSGraphEditorProps {
  graph: PAGSGraph;
  onChange: (graph: PAGSGraph) => void;
  readonly?: boolean;
}

const NODE_CONFIGS = {
  Population: {
    color: 'hsl(221, 83%, 53%)', // blue
    icon: Users,
    bgClass: 'bg-blue-500/10 border-blue-500/30 text-blue-700',
    description: 'Groups, demographics, communities'
  },
  Domain: {
    color: 'hsl(173, 58%, 39%)', // teal
    icon: Globe,
    bgClass: 'bg-teal-500/10 border-teal-500/30 text-teal-700',
    description: 'Policy areas, sectors, fields'
  },
  Institution: {
    color: 'hsl(263, 70%, 50%)', // purple
    icon: Building,
    bgClass: 'bg-purple-500/10 border-purple-500/30 text-purple-700',
    description: 'Organizations, frameworks, systems'
  }
};

export const PAGSGraphEditor: React.FC<PAGSGraphEditorProps> = ({
  graph,
  onChange,
  readonly = false
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<{ from: string; to: string } | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeKind, setNewNodeKind] = useState<PAGSNode['kind']>('Population');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  // Add new node
  const handleAddNode = useCallback((kind: PAGSNode['kind'], position: { x: number; y: number }) => {
    const newNode: PAGSNode = {
      id: `${kind.toLowerCase()}-${Date.now()}`,
      kind,
      label: `New ${kind}`,
      tags: [],
      position
    };

    const newGraph = {
      ...graph,
      nodes: [...graph.nodes, newNode]
    };

    onChange(newGraph);
    setSelectedNode(newNode.id);
    setIsAddingNode(false);
    
    toast({
      title: "Node Added",
      description: `${kind} node has been added to the graph`
    });
  }, [graph, onChange]);

  // Update node
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<PAGSNode>) => {
    const newGraph = {
      ...graph,
      nodes: graph.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    };
    onChange(newGraph);
  }, [graph, onChange]);

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    const newGraph = {
      nodes: graph.nodes.filter(node => node.id !== nodeId),
      edges: graph.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId)
    };
    onChange(newGraph);
    setSelectedNode(null);
    
    toast({
      title: "Node Deleted",
      description: "Node and its connections have been removed"
    });
  }, [graph, onChange]);

  // Add edge
  const handleAddEdge = useCallback((from: string, to: string) => {
    if (from === to) return;
    
    // Check if edge already exists
    const exists = graph.edges.some(edge => 
      (edge.from === from && edge.to === to) || 
      (edge.from === to && edge.to === from)
    );
    
    if (exists) return;

    const newEdge: PAGSEdge = {
      from,
      to,
      label: 'influences',
      weight: 0.5
    };

    const newGraph = {
      ...graph,
      edges: [...graph.edges, newEdge]
    };

    onChange(newGraph);
    setSelectedEdge({ from, to });
    
    toast({
      title: "Connection Added",
      description: "New connection has been created"
    });
  }, [graph, onChange]);

  // Update edge
  const handleUpdateEdge = useCallback((from: string, to: string, updates: Partial<PAGSEdge>) => {
    const newGraph = {
      ...graph,
      edges: graph.edges.map(edge => 
        (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)
          ? { ...edge, ...updates } : edge
      )
    };
    onChange(newGraph);
  }, [graph, onChange]);

  // Delete edge
  const handleDeleteEdge = useCallback((from: string, to: string) => {
    const newGraph = {
      ...graph,
      edges: graph.edges.filter(edge => 
        !((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from))
      )
    };
    onChange(newGraph);
    setSelectedEdge(null);
    
    toast({
      title: "Connection Removed",
      description: "Connection has been deleted"
    });
  }, [graph, onChange]);

  // Handle SVG click for adding nodes
  const handleSVGClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isAddingNode || readonly) return;

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    handleAddNode(newNodeKind, { x, y });
  }, [isAddingNode, newNodeKind, pan, zoom, handleAddNode, readonly]);

  // Mouse handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (readonly) return;
    
    e.stopPropagation();
    setDraggedNode(nodeId);
    
    const node = graph.nodes.find(n => n.id === nodeId);
    if (node && node.position) {
      setDragOffset({
        x: e.clientX - node.position.x * zoom - pan.x,
        y: e.clientY - node.position.y * zoom - pan.y
      });
    }
  }, [graph.nodes, zoom, pan, readonly]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggedNode || readonly) return;

    const newX = (e.clientX - dragOffset.x - pan.x) / zoom;
    const newY = (e.clientY - dragOffset.y - pan.y) / zoom;

    handleUpdateNode(draggedNode, { position: { x: newX, y: newY } });
  }, [draggedNode, dragOffset, pan, zoom, handleUpdateNode, readonly]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  // Add mouse event listeners
  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  // Calculate edge path
  const getEdgePath = (from: PAGSNode, to: PAGSNode) => {
    if (!from.position || !to.position) return '';
    
    const dx = to.position.x - from.position.x;
    const dy = to.position.y - from.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Control point for curved edge
    const controlX = (from.position.x + to.position.x) / 2 + dy * 0.2;
    const controlY = (from.position.y + to.position.y) / 2 - dx * 0.2;
    
    return `M ${from.position.x} ${from.position.y} Q ${controlX} ${controlY} ${to.position.x} ${to.position.y}`;
  };

  const selectedNodeData = selectedNode ? graph.nodes.find(n => n.id === selectedNode) : null;
  const selectedEdgeData = selectedEdge ? graph.edges.find(e => 
    (e.from === selectedEdge.from && e.to === selectedEdge.to) ||
    (e.from === selectedEdge.to && e.to === selectedEdge.from)
  ) : null;

  return (
    <div className="h-full flex">
      {/* Main Canvas */}
      <div className="flex-1 relative bg-background rounded-lg border">
        {/* Toolbar */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm border rounded-lg p-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.min(zoom * 1.2, 3))}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setZoom(Math.max(zoom / 1.2, 0.3))}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowGrid(!showGrid)}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Add Node Controls */}
        {!readonly && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-2 space-y-2">
              <div className="flex items-center gap-2">
                <Select value={newNodeKind} onValueChange={(value) => setNewNodeKind(value as PAGSNode['kind'])}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(NODE_CONFIGS).map(([kind, config]) => (
                      <SelectItem key={kind} value={kind}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-3 w-3" />
                          {kind}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant={isAddingNode ? "default" : "outline"}
                  onClick={() => setIsAddingNode(!isAddingNode)}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
              {isAddingNode && (
                <div className="text-xs text-muted-foreground">
                  Click on the canvas to add a {newNodeKind} node
                </div>
              )}
            </div>
          </div>
        )}

        {/* SVG Canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-crosshair"
          onClick={handleSVGClick}
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Grid */}
          {showGrid && (
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
          )}
          {showGrid && (
            <rect width="100%" height="100%" fill="url(#grid)" />
          )}

          {/* Edges */}
          {graph.edges.map((edge) => {
            const fromNode = graph.nodes.find(n => n.id === edge.from);
            const toNode = graph.nodes.find(n => n.id === edge.to);
            
            if (!fromNode?.position || !toNode?.position) return null;
            
            const isSelected = selectedEdge && 
              ((selectedEdge.from === edge.from && selectedEdge.to === edge.to) ||
               (selectedEdge.from === edge.to && selectedEdge.to === edge.from));

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={getEdgePath(fromNode, toNode)}
                  stroke={isSelected ? "hsl(var(--ring))" : "hsl(var(--border))"}
                  strokeWidth={isSelected ? 3 : 2}
                  fill="none"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdge({ from: edge.from, to: edge.to });
                  }}
                />
                {/* Arrow */}
                <circle
                  cx={toNode.position.x}
                  cy={toNode.position.y}
                  r="4"
                  fill={isSelected ? "hsl(var(--ring))" : "hsl(var(--border))"}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((node) => {
            if (!node.position) return null;
            
            const config = NODE_CONFIGS[node.kind];
            const isSelected = selectedNode === node.id;
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.position.x}, ${node.position.y})`}
                className="cursor-pointer"
                onMouseDown={(e) => handleMouseDown(e as any, node.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node.id);
                }}
              >
                <circle
                  cx="0"
                  cy="0"
                  r="30"
                  fill={config.color}
                  fillOpacity="0.1"
                  stroke={config.color}
                  strokeWidth={isSelected ? 3 : 2}
                  strokeOpacity={isSelected ? 1 : 0.6}
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  className="text-xs font-medium fill-current"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label.slice(0, 10)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Properties Panel */}
      {(selectedNodeData || selectedEdgeData) && !readonly && (
        <div className="w-64 border-l bg-background p-4 space-y-4">
          {selectedNodeData && (
            <Card className="p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Node Properties</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteNode(selectedNodeData.id)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium">Label</label>
                  <Input
                    value={selectedNodeData.label}
                    onChange={(e) => handleUpdateNode(selectedNodeData.id, { label: e.target.value })}
                    className="h-8"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Kind</label>
                  <Select
                    value={selectedNodeData.kind}
                    onValueChange={(value) => handleUpdateNode(selectedNodeData.id, { kind: value as PAGSNode['kind'] })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(NODE_CONFIGS).map(([kind, config]) => (
                        <SelectItem key={kind} value={kind}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-3 w-3" />
                            {kind}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Tags</label>
                  <Input
                    placeholder="youth, health, civic"
                    value={selectedNodeData.tags.join(', ')}
                    onChange={(e) => handleUpdateNode(selectedNodeData.id, { 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })}
                    className="h-8"
                  />
                </div>
              </div>
            </Card>
          )}

          {selectedEdgeData && (
            <Card className="p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Edge Properties</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => selectedEdge && handleDeleteEdge(selectedEdge.from, selectedEdge.to)}
                    className="h-6 w-6 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium">Label</label>
                  <Input
                    value={selectedEdgeData.label}
                    onChange={(e) => selectedEdge && handleUpdateEdge(selectedEdge.from, selectedEdge.to, { label: e.target.value })}
                    className="h-8"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Weight</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedEdgeData.weight}
                    onChange={(e) => selectedEdge && handleUpdateEdge(selectedEdge.from, selectedEdge.to, { weight: Number(e.target.value) })}
                    className="h-8"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};