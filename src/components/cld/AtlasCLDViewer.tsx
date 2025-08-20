import React, { useMemo } from 'react';
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
  Target,
  Eye,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoopData } from '@/types/loop-registry';
import { CLDEngine } from '@/engines/CLDEngine';

interface AtlasCLDViewerProps {
  loop: LoopData;
  onEdit?: () => void;
  readonly?: boolean;
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

const AtlasCLDGraph: React.FC<{
  atlasData: any;
  readonly?: boolean;
}> = ({ atlasData, readonly = true }) => {
  const { nodes, edges, layout } = useMemo(() => {
    const atlasNodes = atlasData.nodes || [];
    const atlasEdges = atlasData.edges || [];
    
    // Generate layout positions
    const positions = CLDEngine.generateForceLayout(atlasNodes, atlasEdges, 600, 400);
    
    const nodesWithPositions = atlasNodes.map((node: any, index: number) => ({
      ...node,
      position: positions[index] || { x: 300, y: 200 }
    }));
    
    return {
      nodes: nodesWithPositions,
      edges: atlasEdges,
      layout: positions
    };
  }, [atlasData]);

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

  const getNodeColor = (kind: string) => {
    return CLDEngine.getNodeColor(kind);
  };

  return (
    <div className="relative h-96 bg-muted/5 rounded-lg border overflow-hidden">
      {/* SVG Canvas */}
      <svg className="w-full h-full" viewBox="0 0 600 400">
        {/* Edges */}
        {edges.map((edge: any) => {
          const fromNode = nodes.find((n: any) => n.id === edge.from_node);
          const toNode = nodes.find((n: any) => n.id === edge.to_node);
          
          if (!fromNode || !toNode) return null;
          
          const fromPos = fromNode.position;
          const toPos = toNode.position;
          
          // Calculate edge path with curved lines for better visualization
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Curve control point perpendicular to the line
          const curvature = Math.min(dist * 0.1, 30);
          const controlX = midX + (-dy / dist) * curvature;
          const controlY = midY + (dx / dist) * curvature;
          
          return (
            <g key={edge.id}>
              {/* Curved edge */}
              <path
                d={`M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`}
                stroke={edge.polarity === 1 ? '#22c55e' : '#ef4444'}
                strokeWidth="2"
                fill="none"
                opacity="0.7"
                markerEnd="url(#arrowhead)"
              />
              
              {/* Polarity indicator */}
              <circle
                cx={controlX}
                cy={controlY}
                r="8"
                fill={edge.polarity === 1 ? '#22c55e' : '#ef4444'}
                opacity="0.9"
              />
              <text
                x={controlX}
                y={controlY}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs fill-white font-medium"
              >
                {edge.polarity === 1 ? '+' : '-'}
              </text>
              
              {/* Edge weight indicator */}
              {edge.weight && (
                <text
                  x={controlX}
                  y={controlY + 15}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                  {edge.weight.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Arrow markers */}
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
        {nodes.map((node: any) => {
          const pos = node.position;
          const color = getNodeColor(node.kind);
          
          return (
            <g key={node.id}>
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill={color}
                opacity="0.8"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-100"
              />
              
              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y - 30}
                textAnchor="middle"
                className="text-xs font-medium fill-foreground"
              >
                {node.label.length > 15 ? node.label.slice(0, 15) + '...' : node.label}
              </text>
              
              {/* Node kind */}
              <text
                x={pos.x}
                y={pos.y + 35}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {node.kind}
              </text>
              
              {/* SNL indicator */}
              {node.meta?.snl && (
                <circle
                  cx={pos.x + 15}
                  cy={pos.y - 15}
                  r="4"
                  fill="hsl(var(--accent))"
                  stroke="hsl(var(--background))"
                  strokeWidth="1"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Controls */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Badge variant="secondary" className="text-xs">
          {readonly ? <Eye className="w-3 h-3 mr-1" /> : <Edit3 className="w-3 h-3 mr-1" />}
          {readonly ? 'View Mode' : 'Edit Mode'}
        </Badge>
      </div>
    </div>
  );
};

export const AtlasCLDViewer: React.FC<AtlasCLDViewerProps> = ({ 
  loop, 
  onEdit,
  readonly = true 
}) => {
  const atlasData = useMemo(() => CLDEngine.extractAtlasData(loop), [loop]);
  const stats = useMemo(() => CLDEngine.getStructureStats(loop), [loop]);
  
  if (!atlasData || !CLDEngine.hasStructureData(loop)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This loop doesn't have any structural elements yet. 
            {onEdit && !readonly && 'Use the Editor to add nodes and define causal relationships.'}
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  // Find isolated nodes
  const nodes = atlasData.nodes || [];
  const edges = atlasData.edges || [];
  const connectedNodeIds = new Set([
    ...edges.map((e: any) => e.from_node),
    ...edges.map((e: any) => e.to_node)
  ]);
  const isolatedNodes = nodes.filter((node: any) => !connectedNodeIds.has(node.id));

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
            {isolatedNodes.map((n: any) => n.label).join(', ')}. 
            These nodes are not connected to the main structure.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Structure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.nodeCount}</div>
              <div className="text-sm text-muted-foreground">Total Nodes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{stats.edgeCount}</div>
              <div className="text-sm text-muted-foreground">Causal Links</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {stats.avgConnections.toFixed(1)}
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Network className="w-5 h-5" />
              Causal Loop Diagram
            </CardTitle>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Structure
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AtlasCLDGraph atlasData={atlasData} readonly={readonly} />
        </CardContent>
      </Card>

      {/* Motif Analysis */}
      {stats.edgeCount > 0 && (
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
                    <span className="text-sm">{stats.reinforcingLinks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-400">Balancing (-)</span>
                    <span className="text-sm">{stats.balancingLinks}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Structure Health</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stats.isolatedNodes === 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-sm">Node Connectivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stats.edgeCount > 0 ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span className="text-sm">Causal Links</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AtlasCLDViewer;