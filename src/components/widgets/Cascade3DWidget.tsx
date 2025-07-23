import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Target, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Cascade3DWidgetProps {
  task: any;
}

interface GoalNode {
  id: string;
  title: string;
  type: 'goal' | 'okr' | 'task' | 'metric';
  status: 'healthy' | 'at-risk' | 'critical' | 'completed';
  progress: number;
  x: number;
  y: number;
  z: number;
}

const mockNodes: GoalNode[] = [
  { id: '1', title: 'Operational Excellence', type: 'goal', status: 'healthy', progress: 78, x: 0, y: 0, z: 0 },
  { id: '2', title: 'Reduce Response Time', type: 'okr', status: 'at-risk', progress: 65, x: -150, y: 100, z: -50 },
  { id: '3', title: 'Improve TRI Score', type: 'okr', status: 'healthy', progress: 82, x: 150, y: 100, z: -50 },
  { id: '4', title: 'Automate Decisions', type: 'task', status: 'critical', progress: 25, x: -200, y: 200, z: -100 },
  { id: '5', title: 'Streamline Process', type: 'task', status: 'healthy', progress: 90, x: -100, y: 200, z: -100 },
  { id: '6', title: 'Resource Optimization', type: 'task', status: 'at-risk', progress: 55, x: 100, y: 200, z: -100 },
  { id: '7', title: 'Stakeholder Satisfaction', type: 'metric', status: 'healthy', progress: 85, x: 200, y: 200, z: -100 }
];

const Cascade3DWidget: React.FC<Cascade3DWidgetProps> = ({ task }) => {
  const [rotation, setRotation] = useState({ x: -10, y: 20 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!isRotating) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: (prev.y + 0.5) % 360
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [isRotating]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success';
      case 'at-risk': return 'bg-warning';
      case 'critical': return 'bg-destructive';
      case 'completed': return 'bg-primary';
      default: return 'bg-foreground-subtle';
    }
  };

  const getNodeSize = (type: string) => {
    switch (type) {
      case 'goal': return 'w-16 h-16';
      case 'okr': return 'w-12 h-12';
      case 'task': return 'w-10 h-10';
      case 'metric': return 'w-8 h-8';
      default: return 'w-10 h-10';
    }
  };

  const resetView = () => {
    setRotation({ x: -10, y: 20 });
    setSelectedNode(null);
  };

  return (
    <Card className="w-full h-[500px] glass-secondary border-border-subtle/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5 text-primary" />
            3D Goals Cascade
            <Badge variant="outline" className="text-xs">Interactive</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsRotating(!isRotating)}
              className="text-xs"
            >
              {isRotating ? 'Pause' : 'Rotate'}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetView} className="text-xs">
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-full pb-6">
        <div className="h-full relative">
          {/* 3D Scene Container */}
          <div 
            className="w-full h-full relative"
            style={{
              perspective: '1000px',
              perspectiveOrigin: 'center center'
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
                transition: isRotating ? 'none' : 'transform 0.3s ease'
              }}
            >
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(-1px)' }}>
                <line x1="50%" y1="50%" x2="35%" y2="60%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
                <line x1="50%" y1="50%" x2="65%" y2="60%" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
                <line x1="35%" y1="60%" x2="25%" y2="70%" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
                <line x1="35%" y1="60%" x2="40%" y2="70%" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
                <line x1="65%" y1="60%" x2="60%" y2="70%" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
                <line x1="65%" y1="60%" x2="75%" y2="70%" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.4" />
              </svg>

              {/* 3D Nodes */}
              {mockNodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${getNodeSize(node.type)} ${getNodeColor(node.status)} rounded-lg flex items-center justify-center shadow-lg`}
                  style={{
                    transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px)`,
                    left: '50%',
                    top: '50%',
                    marginLeft: '-20px',
                    marginTop: '-20px'
                  }}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                >
                  <div className="text-white text-xs font-bold">
                    {node.type === 'goal' ? '🎯' : 
                     node.type === 'okr' ? '📊' : 
                     node.type === 'task' ? '✓' : '📈'}
                  </div>
                  
                  {/* Node Label */}
                  <div 
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-xs text-foreground-subtle whitespace-nowrap z-10 bg-background/80 px-2 py-1 rounded"
                    style={{ transform: `translateX(-50%) rotateX(${-rotation.x}deg) rotateY(${-rotation.y}deg)` }}
                  >
                    {node.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node Details Panel */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 right-4 bg-background-secondary/95 backdrop-blur-sm rounded-lg p-4 border border-border-subtle/30">
              {(() => {
                const node = mockNodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 ${getNodeColor(node.status)} rounded-full`} />
                      <span className="font-medium">{node.title}</span>
                      <Badge variant="secondary" className="text-xs">{node.type}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{node.progress}%</span>
                    </div>
                    <div className="w-full bg-background-tertiary rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${getNodeColor(node.status)}`}
                        style={{ width: `${node.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Cascade3DWidget;