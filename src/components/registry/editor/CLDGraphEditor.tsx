import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, RotateCcw, Grid, ZoomIn, ZoomOut, Move, Link2, Trash2 } from 'lucide-react';
import { LoopNode, LoopEdge } from '@/types/loop-registry';

interface CLDGraphEditorProps {
  nodes: LoopNode[];
  edges: LoopEdge[];
  onNodesChange: (nodes: LoopNode[]) => void;
  onEdgesChange: (edges: LoopEdge[]) => void;
}

interface Position {
  x: number;
  y: number;
}

interface ViewState {
  zoom: number;
  pan: Position;
}

const nodeKinds = [
  { value: 'stock', label: 'Stock', color: 'bg-blue-500' },
  { value: 'flow', label: 'Flow', color: 'bg-green-500' },
  { value: 'aux', label: 'Auxiliary', color: 'bg-yellow-500' },
  { value: 'actor', label: 'Actor', color: 'bg-purple-500' },
  { value: 'indicator', label: 'Indicator', color: 'bg-red-500' }
];

export const CLDGraphEditor: React.FC<CLDGraphEditorProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange
}) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [viewState, setViewState] = useState<ViewState>({ zoom: 1, pan: { x: 0, y: 0 } });
  const [mode, setMode] = useState<'select' | 'node' | 'edge'>('select');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [dragStart, setDragStart] = useState<Position | null>(null);
  const [edgeStart, setEdgeStart] = useState<string | null>(null);

  const gridSize = 20;

  const snapPosition = (pos: Position): Position => {
    if (!snapToGrid) return pos;
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  };

  const getNodeColor = (kind: string) => {
    return nodeKinds.find(k => k.value === kind)?.color || 'bg-gray-500';
  };

  const handleCanvasClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'node') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const rawPos = {
      x: (event.clientX - rect.left - viewState.pan.x) / viewState.zoom,
      y: (event.clientY - rect.top - viewState.pan.y) / viewState.zoom
    };

    const position = snapPosition(rawPos);

    const newNode: LoopNode = {
      id: `node-${Date.now()}`,
      label: `New Node ${nodes.length + 1}`,
      kind: 'aux',
      meta: { position }
    };

    onNodesChange([...nodes, newNode]);
    setSelectedNode(newNode.id);
    setMode('select');
  };

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (mode === 'edge') {
      if (!edgeStart) {
        setEdgeStart(nodeId);
      } else if (edgeStart !== nodeId) {
        const newEdge: LoopEdge = {
          id: `edge-${Date.now()}`,
          from_node: edgeStart,
          to_node: nodeId,
          polarity: 1,
          delay_ms: 0,
          weight: 1.0
        };
        onEdgesChange([...edges, newEdge]);
        setEdgeStart(null);
        setMode('select');
      }
    } else {
      setSelectedNode(nodeId);
      setSelectedEdge(null);
    }
  };

  const handleNodeDrag = (nodeId: string, event: React.MouseEvent) => {
    if (mode !== 'select') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startPos = {
      x: event.clientX,
      y: event.clientY
    };

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const originalPos = node.meta?.position || { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startPos.x) / viewState.zoom;
      const deltaY = (e.clientY - startPos.y) / viewState.zoom;

      const newPos = snapPosition({
        x: originalPos.x + deltaX,
        y: originalPos.y + deltaY
      });

      onNodesChange(nodes.map(n => 
        n.id === nodeId 
          ? { ...n, meta: { ...n.meta, position: newPos } }
          : n
      ));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDeleteSelected = () => {
    if (selectedNode) {
      onNodesChange(nodes.filter(n => n.id !== selectedNode));
      onEdgesChange(edges.filter(e => e.from_node !== selectedNode && e.to_node !== selectedNode));
      setSelectedNode(null);
    }
    if (selectedEdge) {
      onEdgesChange(edges.filter(e => e.id !== selectedEdge));
      setSelectedEdge(null);
    }
  };

  const handleZoom = (delta: number) => {
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(0.25, Math.min(3, prev.zoom + delta))
    }));
  };

  const resetView = () => {
    setViewState({ zoom: 1, pan: { x: 0, y: 0 } });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'n':
          setMode('node');
          break;
        case 'e':
          setMode('edge');
          setEdgeStart(null);
          break;
        case 'escape':
          setMode('select');
          setEdgeStart(null);
          setSelectedNode(null);
          setSelectedEdge(null);
          break;
        case 'delete':
        case 'backspace':
          handleDeleteSelected();
          break;
        case 'g':
          setSnapToGrid(!snapToGrid);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [snapToGrid, selectedNode, selectedEdge]);

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const selectedEdgeData = selectedEdge ? edges.find(e => e.id === selectedEdge) : null;

  return (
    <div className="h-full flex">
      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border">
              <Button
                variant={mode === 'select' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('select')}
              >
                <Move className="w-4 h-4" />
              </Button>
              <Button
                variant={mode === 'node' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMode('node')}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant={mode === 'edge' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => { setMode('edge'); setEdgeStart(null); }}
              >
                <Link2 className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant={snapToGrid ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSnapToGrid(!snapToGrid)}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleZoom(-0.25)}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-mono w-12 text-center">
                {Math.round(viewState.zoom * 100)}%
              </span>
              <Button variant="ghost" size="sm" onClick={() => handleZoom(0.25)}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" onClick={resetView}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-background relative overflow-hidden">
          {mode === 'node' && (
            <div className="absolute top-2 left-2 z-10">
              <Badge>Click to place node</Badge>
            </div>
          )}
          {mode === 'edge' && (
            <div className="absolute top-2 left-2 z-10">
              <Badge>
                {edgeStart ? 'Click target node' : 'Click source node'}
              </Badge>
            </div>
          )}

          <svg
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            onClick={handleCanvasClick}
          >
            {/* Grid */}
            {snapToGrid && (
              <defs>
                <pattern
                  id="grid"
                  width={gridSize * viewState.zoom}
                  height={gridSize * viewState.zoom}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${gridSize * viewState.zoom} 0 L 0 0 0 ${gridSize * viewState.zoom}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.2"
                  />
                </pattern>
              </defs>
            )}

            <g transform={`translate(${viewState.pan.x}, ${viewState.pan.y}) scale(${viewState.zoom})`}>
              {snapToGrid && (
                <rect
                  x={-1000}
                  y={-1000}
                  width={2000}
                  height={2000}
                  fill="url(#grid)"
                />
              )}

              {/* Edges */}
              {edges.map((edge) => {
                const fromNode = nodes.find(n => n.id === edge.from_node);
                const toNode = nodes.find(n => n.id === edge.to_node);
                
                if (!fromNode || !toNode) return null;

                const fromPos = fromNode.meta?.position || { x: 0, y: 0 };
                const toPos = toNode.meta?.position || { x: 0, y: 0 };

                return (
                  <g key={edge.id}>
                    <line
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      stroke={selectedEdge === edge.id ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                      strokeWidth={selectedEdge === edge.id ? 3 : 2}
                      markerEnd="url(#arrowhead)"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdge(edge.id);
                        setSelectedNode(null);
                      }}
                    />
                    {/* Polarity indicator */}
                    <circle
                      cx={(fromPos.x + toPos.x) / 2}
                      cy={(fromPos.y + toPos.y) / 2}
                      r={8}
                      fill={edge.polarity === 1 ? 'hsl(var(--green-500))' : 'hsl(var(--red-500))'}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdge(edge.id);
                        setSelectedNode(null);
                      }}
                    />
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize="10"
                      className="pointer-events-none"
                    >
                      {edge.polarity === 1 ? '+' : '-'}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const pos = node.meta?.position || { x: 0, y: 0 };
                const isSelected = selectedNode === node.id;
                const isEdgeStart = edgeStart === node.id;

                return (
                  <g key={node.id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected || isEdgeStart ? 25 : 20}
                      fill={isSelected ? 'hsl(var(--primary))' : isEdgeStart ? 'hsl(var(--accent))' : getNodeColor(node.kind)}
                      stroke={isSelected || isEdgeStart ? 'hsl(var(--background))' : 'hsl(var(--border))'}
                      strokeWidth={isSelected || isEdgeStart ? 3 : 1}
                      className="cursor-pointer"
                      onClick={(e) => handleNodeClick(node.id, e)}
                      onMouseDown={(e) => handleNodeDrag(node.id, e)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 30}
                      textAnchor="middle"
                      className="text-xs font-medium pointer-events-none"
                      fill="hsl(var(--foreground))"
                    >
                      {node.label}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 35}
                      textAnchor="middle"
                      className="text-xs pointer-events-none"
                      fill="hsl(var(--muted-foreground))"
                    >
                      {node.kind}
                    </text>
                  </g>
                );
              })}

              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="hsl(var(--muted-foreground))"
                  />
                </marker>
              </defs>
            </g>
          </svg>
        </div>
      </div>

      {/* Inspector Panel */}
      <Card className="w-80 m-4 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Inspector
            {(selectedNode || selectedEdge) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedNodeData && (
            <div className="space-y-4">
              <div>
                <Label>Label</Label>
                <Input
                  value={selectedNodeData.label}
                  onChange={(e) => {
                    onNodesChange(nodes.map(n => 
                      n.id === selectedNode 
                        ? { ...n, label: e.target.value }
                        : n
                    ));
                  }}
                />
              </div>

              <div>
                <Label>Kind</Label>
                <Select
                  value={selectedNodeData.kind}
                  onValueChange={(value) => {
                    onNodesChange(nodes.map(n => 
                      n.id === selectedNode 
                        ? { ...n, kind: value as any }
                        : n
                    ));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeKinds.map(kind => (
                      <SelectItem key={kind.value} value={kind.value}>
                        {kind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Domain</Label>
                <Select
                  value={selectedNodeData.domain}
                  onValueChange={(value) => {
                    onNodesChange(nodes.map(n => 
                      n.id === selectedNode 
                        ? { ...n, domain: value as any }
                        : n
                    ));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="population">Population</SelectItem>
                    <SelectItem value="resource">Resource</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedEdgeData && (
            <div className="space-y-4">
              <div>
                <Label>Polarity</Label>
                <Select
                  value={selectedEdgeData.polarity.toString()}
                  onValueChange={(value) => {
                    onEdgesChange(edges.map(e => 
                      e.id === selectedEdge 
                        ? { ...e, polarity: parseInt(value) as 1 | -1 }
                        : e
                    ));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Positive (+)</SelectItem>
                    <SelectItem value="-1">Negative (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Weight</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={selectedEdgeData.weight || 1}
                  onChange={(e) => {
                    onEdgesChange(edges.map(e => 
                      e.id === selectedEdge 
                        ? { ...e, weight: parseFloat((e as any).target.value) || 1 }
                        : e
                    ));
                  }}
                />
              </div>

              <div>
                <Label>Delay (ms)</Label>
                <Input
                  type="number"
                  value={selectedEdgeData.delay_ms || 0}
                  onChange={(e) => {
                    onEdgesChange(edges.map(e => 
                      e.id === selectedEdge 
                        ? { ...e, delay_ms: parseInt((e as any).target.value) || 0 }
                        : e
                    ));
                  }}
                />
              </div>
            </div>
          )}

          {!selectedNode && !selectedEdge && (
            <div className="text-center text-muted-foreground py-8">
              <p>Select a node or edge to edit properties</p>
              <div className="mt-4 space-y-2 text-xs">
                <p><kbd>N</kbd> - Node tool</p>
                <p><kbd>E</kbd> - Edge tool</p>
                <p><kbd>G</kbd> - Toggle grid</p>
                <p><kbd>Delete</kbd> - Delete selected</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};