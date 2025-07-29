import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  MousePointer, 
  Move,
  RotateCcw,
  RotateCw,
  Copy,
  Trash2,
  Hand,
  Square,
  Circle,
  Minus
} from 'lucide-react';
import { Button } from '../ui/button';
import { CLDNode, CLDLink, CLDPosition } from '../../types/cld';

interface CLDCanvasProps {
  nodes: CLDNode[];
  links: CLDLink[];
  selectedNode: CLDNode | null;
  selectedLink: CLDLink | null;
  onNodeSelect: (node: CLDNode | null) => void;
  onLinkSelect: (link: CLDLink | null) => void;
  onNodeMove: (nodeId: string, position: CLDPosition) => void;
  onNodeAdd: (position: CLDPosition) => void;
  onNodeDelete: (nodeId: string) => void;
  onLinkAdd: (sourceId: string, targetId: string, polarity: 'positive' | 'negative') => void;
  onLinkDelete: (linkId: string) => void;
}

export const CLDCanvas: React.FC<CLDCanvasProps> = ({
  nodes,
  links,
  selectedNode,
  selectedLink,
  onNodeSelect,
  onLinkSelect,
  onNodeMove,
  onNodeAdd,
  onNodeDelete,
  onLinkAdd,
  onLinkDelete
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [tool, setTool] = useState<'select' | 'pan' | 'connect'>('select');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ sourceId: string; polarity: 'positive' | 'negative' } | null>(null);
  const [previewLine, setPreviewLine] = useState<{ start: CLDPosition; end: CLDPosition } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ position: CLDPosition; nodeId?: string; linkId?: string } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CLDNode | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [multiSelectBox, setMultiSelectBox] = useState<{ start: CLDPosition; end: CLDPosition } | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  const gridSize = 16;

  const snapPosition = useCallback((pos: CLDPosition): CLDPosition => {
    if (!snapToGrid) return pos;
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  }, [snapToGrid]);

  const getCanvasPosition = useCallback((clientX: number, clientY: number): CLDPosition => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  }, [pan, zoom]);

  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent) => {
    if (tool === 'select') {
      const position = snapPosition(getCanvasPosition(e.clientX, e.clientY));
      onNodeAdd(position);
    }
  }, [getCanvasPosition, snapPosition, onNodeAdd, tool]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (tool === 'pan' || (e.shiftKey && tool === 'select')) {
      setIsPanning(true);
      return;
    }
    
    if (tool === 'select' && !e.shiftKey) {
      // Start multi-select box
      const position = getCanvasPosition(e.clientX, e.clientY);
      setMultiSelectBox({ start: position, end: position });
    }
  }, [tool, getCanvasPosition]);

  const handleConnectorDrag = useCallback((clientX: number, clientY: number) => {
    if (!connecting || !previewLine) return;
    const position = getCanvasPosition(clientX, clientY);
    setPreviewLine(prev => prev ? { ...prev, end: position } : null);
  }, [connecting, previewLine, getCanvasPosition]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
      return;
    }

    if (multiSelectBox) {
      const position = getCanvasPosition(e.clientX, e.clientY);
      setMultiSelectBox(prev => prev ? { ...prev, end: position } : null);
    }

    if (connecting) {
      handleConnectorDrag(e.clientX, e.clientY);
    }
  }, [isPanning, multiSelectBox, connecting, getCanvasPosition, handleConnectorDrag]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    
    if (multiSelectBox) {
      // Select nodes within the box
      const { start, end } = multiSelectBox;
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);
      
      const selectedNodeIds = new Set(
        nodes
          .filter(node => 
            node.position.x >= minX && node.position.x <= maxX &&
            node.position.y >= minY && node.position.y <= maxY
          )
          .map(node => node.id)
      );
      
      setSelectedNodes(selectedNodeIds);
      setMultiSelectBox(null);
    }
  }, [multiSelectBox, nodes]);

  const handleNodeDragStart = useCallback((nodeId: string) => {
    setDraggedNode(nodeId);
    onNodeSelect(nodes.find(n => n.id === nodeId) || null);
  }, [nodes, onNodeSelect]);

  const handleNodeDrag = useCallback((nodeId: string, clientX: number, clientY: number) => {
    const position = snapPosition(getCanvasPosition(clientX, clientY));
    onNodeMove(nodeId, position);
  }, [getCanvasPosition, snapPosition, onNodeMove]);

  const handleNodeDragEnd = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const handleConnectorStart = useCallback((nodeId: string, polarity: 'positive' | 'negative', clientX: number, clientY: number) => {
    setConnecting({ sourceId: nodeId, polarity });
    const position = getCanvasPosition(clientX, clientY);
    setPreviewLine({ start: position, end: position });
  }, [getCanvasPosition]);

  const handleConnectorEnd = useCallback((targetNodeId?: string) => {
    if (connecting && targetNodeId && targetNodeId !== connecting.sourceId) {
      onLinkAdd(connecting.sourceId, targetNodeId, connecting.polarity);
    }
    setConnecting(null);
    setPreviewLine(null);
  }, [connecting, onLinkAdd]);

  const handleRightClick = useCallback((e: React.MouseEvent, nodeId?: string, linkId?: string) => {
    e.preventDefault();
    const position = getCanvasPosition(e.clientX, e.clientY);
    setContextMenu({ position, nodeId, linkId });
  }, [getCanvasPosition]);

  const handleContextMenuAction = useCallback((action: string) => {
    if (!contextMenu) return;
    
    switch (action) {
      case 'delete':
        if (contextMenu.nodeId) onNodeDelete(contextMenu.nodeId);
        if (contextMenu.linkId) onLinkDelete(contextMenu.linkId);
        break;
      case 'duplicate':
        if (contextMenu.nodeId) {
          const node = nodes.find(n => n.id === contextMenu.nodeId);
          if (node) {
            onNodeAdd({ x: node.position.x + 50, y: node.position.y + 50 });
          }
        }
        break;
    }
    setContextMenu(null);
  }, [contextMenu, nodes, onNodeDelete, onLinkDelete, onNodeAdd]);

  const zoomIn = useCallback(() => setZoom(prev => Math.min(prev * 1.2, 3)), []);
  const zoomOut = useCallback(() => setZoom(prev => Math.max(prev / 1.2, 0.3)), []);
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(zoom + delta, 0.1), 5);
    setZoom(newZoom);
  }, [zoom]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case '=':
          case '+':
            e.preventDefault();
            zoomIn();
            break;
          case '-':
            e.preventDefault();
            zoomOut();
            break;
          case '0':
            e.preventDefault();
            resetView();
            break;
        }
      } else {
        switch (e.key.toLowerCase()) {
          case 'v':
            setTool('select');
            break;
          case 'h':
            setTool('pan');
            break;
          case 'c':
            setTool('connect');
            break;
          case 'g':
            setShowGrid(!showGrid);
            break;
          case 's':
            if (!e.ctrlKey && !e.metaKey) {
              setSnapToGrid(!snapToGrid);
            }
            break;
          case 'escape':
            setTool('select');
            setConnecting(null);
            setPreviewLine(null);
            setSelectedNodes(new Set());
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetView, showGrid, snapToGrid]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`relative w-full h-full overflow-hidden ${
          tool === 'pan' ? 'cursor-grab' : 
          isPanning ? 'cursor-grabbing' : 
          tool === 'connect' ? 'cursor-crosshair' : 'cursor-default'
        }`}
        onDoubleClick={handleCanvasDoubleClick}
        onContextMenu={(e) => handleRightClick(e)}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleWheel}
        onClick={() => {
          if (!multiSelectBox && !isPanning) {
            onNodeSelect(null);
            onLinkSelect(null);
            setContextMenu(null);
            setSelectedNodes(new Set());
          }
        }}
      >
        {/* Grid Background */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
              backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
          />
        )}

        {/* Multi-select box */}
        {multiSelectBox && (
          <div
            className="absolute border-2 border-teal-400 bg-teal-400/10 pointer-events-none z-50"
            style={{
              left: Math.min(multiSelectBox.start.x, multiSelectBox.end.x) * zoom + pan.x,
              top: Math.min(multiSelectBox.start.y, multiSelectBox.end.y) * zoom + pan.y,
              width: Math.abs(multiSelectBox.end.x - multiSelectBox.start.x) * zoom,
              height: Math.abs(multiSelectBox.end.y - multiSelectBox.start.y) * zoom,
            }}
          />
        )}

        {/* Canvas Content */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Links */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map(link => {
              const sourceNode = nodes.find(n => n.id === link.sourceId);
              const targetNode = nodes.find(n => n.id === link.targetId);
              if (!sourceNode || !targetNode) return null;

              const isSelected = selectedLink?.id === link.id;
              const strokeColor = link.polarity === 'positive' ? '#10b981' : '#ef4444';
              const strokeWidth = isSelected ? 3 : 2;
              const lineType = link.lineType || 'curved';

              // Calculate path based on line type
              const getLinePath = () => {
                const x1 = sourceNode.position.x;
                const y1 = sourceNode.position.y;
                const x2 = targetNode.position.x;
                const y2 = targetNode.position.y;

                switch (lineType) {
                  case 'curved': {
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const offset = Math.sqrt(dx * dx + dy * dy) * 0.2;
                    const ctrlX = midX - dy / Math.sqrt(dx * dx + dy * dy) * offset;
                    const ctrlY = midY + dx / Math.sqrt(dx * dx + dy * dy) * offset;
                    return `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
                  }
                  case 'elbow': {
                    const midX = (x1 + x2) / 2;
                    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
                  }
                  default: // straight
                    return `M ${x1} ${y1} L ${x2} ${y2}`;
                }
              };

              const getLabelPosition = () => {
                const x1 = sourceNode.position.x;
                const y1 = sourceNode.position.y;
                const x2 = targetNode.position.x;
                const y2 = targetNode.position.y;

                switch (lineType) {
                  case 'curved': {
                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const offset = Math.sqrt(dx * dx + dy * dy) * 0.1;
                    return {
                      x: midX - dy / Math.sqrt(dx * dx + dy * dy) * offset,
                      y: midY + dx / Math.sqrt(dx * dx + dy * dy) * offset
                    };
                  }
                  case 'elbow': {
                    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
                  }
                  default:
                    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
                }
              };

              const labelPos = getLabelPosition();

              return (
                <motion.g
                  key={link.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkSelect(link);
                  }}
                  onContextMenu={(e) => handleRightClick(e, undefined, link.id)}
                >
                  <path
                    d={getLinePath()}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={link.polarity === 'negative' ? '5,5' : undefined}
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    className="transition-all duration-200"
                  />
                  
                  {/* Link label */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {link.polarity === 'positive' ? '+' : '-'}
                  </text>
                </motion.g>
              );
            })}

            {/* Preview line during connection */}
            {previewLine && (
              <line
                x1={previewLine.start.x}
                y1={previewLine.start.y}
                x2={previewLine.end.x}
                y2={previewLine.end.y}
                stroke={connecting?.polarity === 'positive' ? '#10b981' : '#ef4444'}
                strokeWidth={2}
                strokeDasharray="3,3"
                opacity={0.7}
              />
            )}

            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="currentColor"
                />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const isSelected = selectedNode?.id === node.id || selectedNodes.has(node.id);
            const isDragged = draggedNode === node.id;
            const dimmed = (selectedNode && selectedNode.id !== node.id && !selectedNodes.has(node.id)) || 
                          (selectedNodes.size > 0 && !selectedNodes.has(node.id) && !selectedNode);

            return (
              <motion.div
                key={node.id}
                className={`
                  absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                  bg-slate-800/95 backdrop-blur-md border-2 rounded-xl p-4 min-w-28 text-center
                  transition-all duration-300 ease-out group
                  ${isSelected 
                    ? 'border-teal-400 shadow-xl shadow-teal-400/30 bg-slate-700/95' 
                    : 'border-slate-500/50 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-400/20'
                  }
                  ${dimmed ? 'opacity-40' : 'opacity-100'}
                  ${isDragged ? 'z-50 rotate-1 scale-105' : 'z-10'}
                  ${tool === 'select' ? 'hover:scale-105' : ''}
                `}
                style={{
                  left: node.position.x,
                  top: node.position.y
                }}
                initial={{ scale: 0, opacity: 0, y: -20 }}
                animate={{ 
                  scale: 1, 
                  opacity: dimmed ? 0.4 : 1,
                  y: 0,
                  rotate: isDragged ? 1 : 0
                }}
                whileHover={{ 
                  scale: isDragged || tool !== 'select' ? 1 : 1.05,
                  transition: { duration: 0.2 }
                }}
                drag={tool === 'select'}
                dragMomentum={false}
                dragElastic={0.1}
                onDragStart={() => handleNodeDragStart(node.id)}
                onDrag={(_, info: PanInfo) => {
                  if (tool === 'select') {
                    handleNodeDrag(node.id, info.point.x, info.point.y);
                  }
                }}
                onDragEnd={handleNodeDragEnd}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.ctrlKey || e.metaKey) {
                    setSelectedNodes(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(node.id)) {
                        newSet.delete(node.id);
                      } else {
                        newSet.add(node.id);
                      }
                      return newSet;
                    });
                  } else {
                    onNodeSelect(node);
                    setSelectedNodes(new Set());
                  }
                }}
                onContextMenu={(e) => handleRightClick(e, node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="text-white text-sm font-semibold leading-tight">{node.label}</div>
                {node.description && (
                  <div className="text-slate-300 text-xs mt-2 opacity-80">{node.description}</div>
                )}
                
                {/* Node type indicator */}
                <div className={`absolute -top-2 -left-2 w-4 h-4 rounded-full border-2 border-slate-700
                  ${node.type === 'stock' ? 'bg-blue-500' :
                    node.type === 'flow' ? 'bg-green-500' :
                    node.type === 'auxiliary' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} 
                />

                {/* Connection ports - only show on hover or when connecting */}
                <div className={`absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-700
                  transition-all duration-200 cursor-crosshair
                  ${tool === 'connect' || connecting ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}
                     onMouseDown={(e) => {
                       e.stopPropagation();
                       handleConnectorStart(node.id, 'positive', e.clientX, e.clientY);
                     }}
                     title="Positive connection"
                />
                <div className={`absolute -bottom-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-700
                  transition-all duration-200 cursor-crosshair
                  ${tool === 'connect' || connecting ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}
                     onMouseDown={(e) => {
                       e.stopPropagation();
                       handleConnectorStart(node.id, 'negative', e.clientX, e.clientY);
                     }}
                     title="Negative connection"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="absolute top-4 left-4 flex gap-1 bg-slate-800/95 backdrop-blur-md rounded-xl p-2 border border-slate-600/50">
        {/* Tool Selection */}
        <Button
          variant={tool === 'select' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTool('select')}
          className={`${tool === 'select' ? 'bg-teal-600 border-teal-500' : 'bg-transparent border-slate-600'} text-white hover:bg-slate-700`}
          title="Select Tool (V)"
        >
          <MousePointer className="w-4 h-4" />
        </Button>
        <Button
          variant={tool === 'pan' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTool('pan')}
          className={`${tool === 'pan' ? 'bg-teal-600 border-teal-500' : 'bg-transparent border-slate-600'} text-white hover:bg-slate-700`}
          title="Pan Tool (H)"
        >
          <Hand className="w-4 h-4" />
        </Button>
        <Button
          variant={tool === 'connect' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTool('connect')}
          className={`${tool === 'connect' ? 'bg-teal-600 border-teal-500' : 'bg-transparent border-slate-600'} text-white hover:bg-slate-700`}
          title="Connection Tool (C)"
        >
          <Minus className="w-4 h-4 rotate-45" />
        </Button>
        
        <div className="w-px h-6 bg-slate-600 mx-1" />
        
        {/* View Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          title="Reset View (0)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-slate-600 mx-1" />
        
        {/* Grid Controls */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className={`bg-transparent border-slate-600 text-white hover:bg-slate-700 ${showGrid ? 'bg-teal-600/20 border-teal-500' : ''}`}
          title="Toggle Grid (G)"
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`bg-transparent border-slate-600 text-white hover:bg-slate-700 ${snapToGrid ? 'bg-teal-600/20 border-teal-500' : ''}`}
          title="Snap to Grid (S)"
        >
          <Square className="w-3 h-3" />
        </Button>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute top-4 right-4 bg-slate-800/95 backdrop-blur-md rounded-lg px-3 py-1 border border-slate-600/50">
        <span className="text-white text-sm font-mono">{Math.round(zoom * 100)}%</span>
      </div>

      {/* Node Tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm pointer-events-none"
            style={{
              left: hoveredNode.position.x * zoom + pan.x + 50,
              top: hoveredNode.position.y * zoom + pan.y - 50
            }}
          >
            <div className="font-medium">{hoveredNode.label}</div>
            {hoveredNode.description && (
              <div className="text-gray-400 mt-1">{hoveredNode.description}</div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Type: {hoveredNode.type} | Value: {hoveredNode.value || 'N/A'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 bg-slate-800 border border-slate-600 rounded-lg py-2 text-white shadow-lg"
            style={{
              left: contextMenu.position.x * zoom + pan.x,
              top: contextMenu.position.y * zoom + pan.y
            }}
          >
            {contextMenu.nodeId && (
              <>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2"
                  onClick={() => handleContextMenuAction('duplicate')}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2 text-red-400"
                  onClick={() => handleContextMenuAction('delete')}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {contextMenu.linkId && (
              <button
                className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center gap-2 text-red-400"
                onClick={() => handleContextMenuAction('delete')}
              >
                <Trash2 className="w-4 h-4" />
                Delete Link
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};