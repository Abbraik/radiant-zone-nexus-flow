import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  MousePointer, 
  Move,
  RotateCcw,
  RotateCw,
  Copy,
  Trash2
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
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ sourceId: string; polarity: 'positive' | 'negative' } | null>(null);
  const [previewLine, setPreviewLine] = useState<{ start: CLDPosition; end: CLDPosition } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ position: CLDPosition; nodeId?: string; linkId?: string } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CLDNode | null>(null);

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
    const position = snapPosition(getCanvasPosition(e.clientX, e.clientY));
    onNodeAdd(position);
  }, [getCanvasPosition, snapPosition, onNodeAdd]);

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

  const handleConnectorDrag = useCallback((clientX: number, clientY: number) => {
    if (!connecting || !previewLine) return;
    const position = getCanvasPosition(clientX, clientY);
    setPreviewLine(prev => prev ? { ...prev, end: position } : null);
  }, [connecting, previewLine, getCanvasPosition]);

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

  // Keyboard shortcuts
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full h-full cursor-crosshair"
        onDoubleClick={handleCanvasDoubleClick}
        onContextMenu={(e) => handleRightClick(e)}
        onClick={() => {
          onNodeSelect(null);
          onLinkSelect(null);
          setContextMenu(null);
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

        {/* Canvas Content */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
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
                  <line
                    x1={sourceNode.position.x}
                    y1={sourceNode.position.y}
                    x2={targetNode.position.x}
                    y2={targetNode.position.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={link.polarity === 'negative' ? '5,5' : undefined}
                    markerEnd="url(#arrowhead)"
                  />
                  
                  {/* Link label */}
                  <text
                    x={(sourceNode.position.x + targetNode.position.x) / 2}
                    y={(sourceNode.position.y + targetNode.position.y) / 2}
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
            const isSelected = selectedNode?.id === node.id;
            const isDragged = draggedNode === node.id;
            const dimmed = selectedNode && selectedNode.id !== node.id;

            return (
              <motion.div
                key={node.id}
                className={`
                  absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                  bg-slate-800/90 backdrop-blur-sm border-2 rounded-lg p-3 min-w-24 text-center
                  transition-all duration-200
                  ${isSelected 
                    ? 'border-teal-500 shadow-lg shadow-teal-500/25' 
                    : 'border-slate-600 hover:border-slate-500'
                  }
                  ${dimmed ? 'opacity-50' : 'opacity-100'}
                  ${isDragged ? 'z-50' : 'z-10'}
                `}
                style={{
                  left: node.position.x,
                  top: node.position.y
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: dimmed ? 0.5 : 1 }}
                whileHover={{ scale: isDragged ? 1 : 1.05 }}
                drag
                dragMomentum={false}
                onDragStart={() => handleNodeDragStart(node.id)}
                onDrag={(_, info) => handleNodeDrag(node.id, info.point.x, info.point.y)}
                onDragEnd={handleNodeDragEnd}
                onClick={(e) => {
                  e.stopPropagation();
                  onNodeSelect(node);
                }}
                onContextMenu={(e) => handleRightClick(e, node.id)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="text-white text-sm font-medium">{node.label}</div>
                {node.description && (
                  <div className="text-gray-400 text-xs mt-1">{node.description}</div>
                )}

                {/* Connection ports */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                     onMouseDown={(e) => {
                       e.stopPropagation();
                       handleConnectorStart(node.id, 'positive', e.clientX, e.clientY);
                     }}
                />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                     onMouseDown={(e) => {
                       e.stopPropagation();
                       handleConnectorStart(node.id, 'negative', e.clientX, e.clientY);
                     }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={zoomIn}
          className="bg-slate-800/90 backdrop-blur-sm border-slate-600 text-white hover:bg-slate-700"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={zoomOut}
          className="bg-slate-800/90 backdrop-blur-sm border-slate-600 text-white hover:bg-slate-700"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className={`bg-slate-800/90 backdrop-blur-sm border-slate-600 text-white hover:bg-slate-700 ${showGrid ? 'bg-teal-600' : ''}`}
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSnapToGrid(!snapToGrid)}
          className={`bg-slate-800/90 backdrop-blur-sm border-slate-600 text-white hover:bg-slate-700 ${snapToGrid ? 'bg-teal-600' : ''}`}
        >
          <MousePointer className="w-4 h-4" />
        </Button>
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