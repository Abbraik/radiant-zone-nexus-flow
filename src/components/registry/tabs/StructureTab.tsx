import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Network, 
  AlertTriangle, 
  Info,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Target
} from 'lucide-react';
import { LoopData, HydratedLoop, LoopNode, LoopEdge } from '@/types/loop-registry';

interface StructureTabProps {
  loop: LoopData;
  hydratedLoop?: HydratedLoop | null;
  isLoading?: boolean;
}

const NodeTypeLegend: React.FC = () => {
  const nodeTypes = [
    { kind: 'stock', icon: Square, label: 'Stock', color: 'text-blue-400' },
    { kind: 'flow', icon: Triangle, label: 'Flow', color: 'text-green-400' },
    { kind: 'aux', icon: Circle, label: 'Auxiliary', color: 'text-yellow-400' },
    { kind: 'actor', icon: Hexagon, label: 'Actor', color: 'text-purple-400' },
    { kind: 'indicator', icon: Target, label: 'Indicator', color: 'text-red-400' }
  ];

  return (
    <Card className="glass-secondary">
      <CardHeader>
        <CardTitle className="text-sm">Node Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {nodeTypes.map(({ kind, icon: Icon, label, color }) => (
            <div key={kind} className="flex items-center gap-2 text-sm">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CLDGraphReadonly: React.FC<{
  nodes: LoopNode[];
  edges: LoopEdge[];
}> = ({ nodes, edges }) => {
  if (nodes.length === 0) {
    return (
      <div className="h-96 bg-muted/10 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
        <div className="text-center text-muted-foreground">
          <Network className="w-8 h-8 mx-auto mb-2" />
          <div className="text-sm">No structure defined</div>
          <div className="text-xs">Add nodes and edges to visualize the loop structure</div>
        </div>
      </div>
    );
  }

  // Simple layout for demonstration
  const gridSize = Math.ceil(Math.sqrt(nodes.length));
  const cellWidth = 400 / gridSize;
  const cellHeight = 300 / gridSize;

  return (
    <div className="relative h-96 bg-muted/5 rounded-lg border overflow-hidden">
      {/* SVG Canvas */}
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Edges */}
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from_node);
          const toNode = nodes.find(n => n.id === edge.to_node);
          
          if (!fromNode || !toNode) return null;
          
          const fromIndex = nodes.indexOf(fromNode);
          const toIndex = nodes.indexOf(toNode);
          
          const fromX = (fromIndex % gridSize) * cellWidth + cellWidth / 2;
          const fromY = Math.floor(fromIndex / gridSize) * cellHeight + cellHeight / 2;
          const toX = (toIndex % gridSize) * cellWidth + cellWidth / 2;
          const toY = Math.floor(toIndex / gridSize) * cellHeight + cellHeight / 2;
          
          return (
            <g key={edge.id}>
              <line
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={edge.polarity === 1 ? '#22c55e' : '#ef4444'}
                strokeWidth="2"
                opacity="0.7"
                markerEnd="url(#arrowhead)"
              />
              {/* Edge label */}
              <text
                x={(fromX + toX) / 2}
                y={(fromY + toY) / 2 - 5}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {edge.polarity === 1 ? '+' : '-'}
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
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className="fill-muted-foreground"
            />
          </marker>
        </defs>
        
        {/* Nodes */}
        {nodes.map((node, index) => {
          const x = (index % gridSize) * cellWidth + cellWidth / 2;
          const y = Math.floor(index / gridSize) * cellHeight + cellHeight / 2;
          
          const getNodeColor = (domain: string) => {
            switch (domain) {
              case 'population': return '#3b82f6';
              case 'resource': return '#22c55e';
              case 'products': return '#eab308';
              case 'social': return '#a855f7';
              case 'institution': return '#ef4444';
              default: return '#6b7280';
            }
          };
          
          return (
            <g key={node.id}>
              <circle
                cx={x}
                cy={y}
                r="20"
                fill={getNodeColor(node.domain || 'default')}
                opacity="0.8"
                className="cursor-pointer hover:opacity-100"
              />
              <text
                x={x}
                y={y + 30}
                textAnchor="middle"
                className="text-xs fill-foreground"
              >
                {node.label.slice(0, 12)}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Pan/Zoom Controls */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Badge variant="secondary" className="text-xs">
          Use WASD + +/- to navigate
        </Badge>
      </div>
    </div>
  );
};

const StructureTab: React.FC<StructureTabProps> = ({ 
  loop, 
  hydratedLoop, 
  isLoading 
}) => {
  const nodes = hydratedLoop?.nodes || [];
  const edges = hydratedLoop?.edges || [];
  
  // Find isolated nodes
  const connectedNodeIds = new Set([
    ...edges.map(e => e.from_node),
    ...edges.map(e => e.to_node)
  ]);
  const isolatedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
  
  // Motif analysis
  const reinforcingLoops = edges.filter(e => e.polarity === 1).length;
  const balancingLoops = edges.filter(e => e.polarity === -1).length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Warnings */}
      {isolatedNodes.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isolatedNodes.length} isolated node{isolatedNodes.length !== 1 ? 's' : ''} detected: {' '}
            {isolatedNodes.map(n => n.label).join(', ')}. 
            These nodes are not connected to the main structure.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Structure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{nodes.length}</div>
              <div className="text-sm text-muted-foreground">Total Nodes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{edges.length}</div>
              <div className="text-sm text-muted-foreground">Causal Links</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {edges.length > 0 ? (edges.length / nodes.length).toFixed(1) : '0'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Connections</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Type Legend */}
      <NodeTypeLegend />

      {/* CLD Graph */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-5 h-5" />
            Causal Loop Diagram
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 bg-muted/10 rounded-lg flex items-center justify-center">
              <div className="text-muted-foreground">Loading structure...</div>
            </div>
          ) : (
            <CLDGraphReadonly nodes={nodes} edges={edges} />
          )}
        </CardContent>
      </Card>

      {/* Motif Analysis */}
      {edges.length > 0 && (
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Motif Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Link Polarity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-400">Reinforcing (+)</span>
                    <span className="text-sm">{reinforcingLoops}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-400">Balancing (-)</span>
                    <span className="text-sm">{balancingLoops}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Structure Health</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isolatedNodes.length === 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-sm">Node Connectivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${edges.length > 0 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="text-sm">Causal Links</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Structure Info */}
      {nodes.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This loop doesn't have any structural elements yet. 
            Use the Editor to add nodes and define causal relationships.
          </AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
};

export default StructureTab;