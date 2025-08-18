import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, ExternalLink, Share2 } from 'lucide-react';
import { useLoopHydration } from '@/hooks/useLoopRegistry';
import { useNavigate } from 'react-router-dom';

interface SNLBrowserProps {
  loopId: string;
}

export const SNLBrowser: React.FC<SNLBrowserProps> = ({ loopId }) => {
  const { data: hydratedLoop } = useLoopHydration(loopId);
  const navigate = useNavigate();

  const nodes = hydratedLoop?.nodes || [];
  const edges = hydratedLoop?.edges || [];

  // Create a simple force-directed layout simulation
  const nodePositions = useMemo(() => {
    if (nodes.length === 0) return {};
    
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 200;
    const centerY = 150;
    const radius = 80;
    
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    
    return positions;
  }, [nodes]);

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'population': return '#3b82f6';
      case 'resource': return '#10b981';
      case 'products': return '#f59e0b';
      case 'social': return '#8b5cf6';
      case 'institution': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleNodeClick = (nodeId: string) => {
    // Here you could open a modal or navigate to a node detail view
    console.log('Node clicked:', nodeId);
  };

  if (!hydratedLoop) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading shared node layer...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Shared Node Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted rounded-lg" style={{ height: '300px' }}>
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Render edges */}
                {edges.map((edge) => {
                  const fromPos = nodePositions[edge.from_node];
                  const toPos = nodePositions[edge.to_node];
                  
                  if (!fromPos || !toPos) return null;
                  
                  return (
                    <line
                      key={edge.id}
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      stroke={edge.polarity === 1 ? '#10b981' : '#ef4444'}
                      strokeWidth="2"
                      strokeDasharray={edge.polarity === -1 ? '5,5' : undefined}
                      className="opacity-60"
                    />
                  );
                })}
                
                {/* Render nodes */}
                {nodes.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  
                  return (
                    <g key={node.id}>
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        fill={getDomainColor(node.domain)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleNodeClick(node.id)}
                      />
                      <text
                        x={pos.x}
                        y={pos.y + 25}
                        textAnchor="middle"
                        className="text-xs fill-current text-foreground pointer-events-none"
                      >
                        {node.label.length > 12 ? `${node.label.slice(0, 12)}...` : node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-green-500 rounded"></div>
                <span>Positive influence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-red-500 border-dashed rounded"></div>
                <span>Negative influence</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Node Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getDomainColor(node.domain) }}
                    />
                    <div>
                      <div className="font-medium">{node.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {node.descriptor || 'No description available'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{node.domain}</Badge>
                    {node.role && (
                      <Badge variant="secondary">{node.role}</Badge>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleNodeClick(node.id)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Connected Loops */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Connected Loops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Share2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Loop connections will be displayed here</p>
              <p className="text-sm">This feature shows other loops sharing nodes with this one</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};