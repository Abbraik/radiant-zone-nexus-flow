import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { X, Maximize2, RotateCcw, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';

interface GoalNode {
  id: string;
  title: string;
  type: 'goal' | 'okr' | 'task' | 'metric';
  status: 'healthy' | 'at-risk' | 'critical' | 'completed';
  position: [number, number, number];
  connections: string[];
  value?: number;
  target?: number;
  progress?: number;
}

interface Cascade3DViewerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: any;
  onNodeSelect?: (nodeId: string) => void;
}

// Mock cascade data - in real app, this would come from your data source
const mockCascadeData: GoalNode[] = [
  {
    id: 'goal-1',
    title: 'Operational Excellence',
    type: 'goal',
    status: 'healthy',
    position: [0, 4, 0],
    connections: ['okr-1', 'okr-2'],
    progress: 78
  },
  {
    id: 'okr-1',
    title: 'Reduce Response Time',
    type: 'okr',
    status: 'at-risk',
    position: [-3, 2, 0],
    connections: ['task-1', 'task-2'],
    value: 2.3,
    target: 2.0,
    progress: 65
  },
  {
    id: 'okr-2', 
    title: 'Improve TRI Score',
    type: 'okr',
    status: 'healthy',
    position: [3, 2, 0],
    connections: ['task-3', 'metric-1'],
    value: 78,
    target: 85,
    progress: 82
  },
  {
    id: 'task-1',
    title: 'Automate Decisions',
    type: 'task',
    status: 'critical',
    position: [-5, 0, -2],
    connections: [],
    progress: 25
  },
  {
    id: 'task-2',
    title: 'Streamline Process',
    type: 'task', 
    status: 'healthy',
    position: [-1, 0, -2],
    connections: [],
    progress: 90
  },
  {
    id: 'task-3',
    title: 'Resource Optimization',
    type: 'task',
    status: 'at-risk',
    position: [1, 0, -2],
    connections: [],
    progress: 55
  },
  {
    id: 'metric-1',
    title: 'Stakeholder Satisfaction',
    type: 'metric',
    status: 'healthy',
    position: [5, 0, -2],
    connections: [],
    value: 4.2,
    target: 4.5,
    progress: 85
  }
];

// 3D Node Component
const CascadeNode: React.FC<{
  node: GoalNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
}> = ({ node, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animation for floating effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.1;
    }
  });

  // Color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981'; // green
      case 'at-risk': return '#f59e0b'; // yellow
      case 'critical': return '#ef4444'; // red
      case 'completed': return '#6366f1'; // blue
      default: return '#6b7280'; // gray
    }
  };

  // Size based on type
  const getNodeSize = (type: string) => {
    switch (type) {
      case 'goal': return [1.2, 0.8, 0.6];
      case 'okr': return [1.0, 0.6, 0.5];
      case 'task': return [0.8, 0.5, 0.4];
      case 'metric': return [0.6, 0.6, 0.6];
      default: return [0.8, 0.5, 0.4];
    }
  };

  const nodeColor = getStatusColor(node.status);
  const nodeSize = getNodeSize(node.type);
  const emissiveIntensity = isSelected ? 0.3 : hovered ? 0.2 : 0.1;

  return (
    <group position={node.position}>
      {/* Main Node Geometry */}
      {node.type === 'metric' ? (
        <Sphere
          ref={meshRef}
          args={[nodeSize[0], 16, 16]}
          onClick={() => onSelect(node.id)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={emissiveIntensity}
            metalness={0.3}
            roughness={0.4}
          />
        </Sphere>
      ) : (
        <Box
          ref={meshRef}
          args={nodeSize}
          onClick={() => onSelect(node.id)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={emissiveIntensity}
            metalness={0.3}
            roughness={0.4}
          />
        </Box>
      )}

      {/* Node Label */}
      <Text
        position={[0, nodeSize[1] + 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
        textAlign="center"
      >
        {node.title}
      </Text>

      {/* Progress Indicator */}
      {node.progress && (
        <Text
          position={[0, -nodeSize[1] - 0.3, 0]}
          fontSize={0.2}
          color="#a3a3a3"
          anchorX="center"
          anchorY="middle"
        >
          {node.progress}%
        </Text>
      )}

      {/* Selection Ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <torusGeometry args={[nodeSize[0] + 0.3, 0.05, 8, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
};

// Connection Lines Component
const CascadeConnections: React.FC<{ nodes: GoalNode[] }> = ({ nodes }) => {
  const lines = useMemo(() => {
    const connections: Array<{ start: [number, number, number]; end: [number, number, number] }> = [];
    
    nodes.forEach(node => {
      node.connections.forEach(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode) {
          connections.push({
            start: node.position,
            end: targetNode.position
          });
        }
      });
    });
    
    return connections;
  }, [nodes]);

  return (
    <>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[line.start, line.end]}
          color="#4f46e5"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </>
  );
};

// Scene Setup Component
const CascadeScene: React.FC<{
  nodes: GoalNode[];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
}> = ({ nodes, selectedNodeId, onNodeSelect }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
      
      {/* Nodes */}
      {nodes.map(node => (
        <CascadeNode
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onSelect={onNodeSelect}
        />
      ))}
      
      {/* Connections */}
      <CascadeConnections nodes={nodes} />
      
      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
};

// Goal Radar Minimap Component
const GoalRadarMinimap: React.FC<{ nodes: GoalNode[]; selectedNodeId: string | null }> = ({ 
  nodes, 
  selectedNodeId 
}) => {
  const healthCounts = useMemo(() => {
    return nodes.reduce((acc, node) => {
      acc[node.status] = (acc[node.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [nodes]);

  return (
    <Card className="absolute top-4 right-4 p-4 glass-secondary border-border-subtle/30 w-48">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Target className="h-4 w-4" />
        Goal Radar
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground-subtle">Healthy</span>
          <Badge variant="outline" className="text-xs bg-success/20 text-success border-success/30">
            {healthCounts.healthy || 0}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground-subtle">At Risk</span>
          <Badge variant="outline" className="text-xs bg-warning/20 text-warning border-warning/30">
            {healthCounts['at-risk'] || 0}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground-subtle">Critical</span>
          <Badge variant="outline" className="text-xs bg-destructive/20 text-destructive border-destructive/30">
            {healthCounts.critical || 0}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-foreground-subtle">Completed</span>
          <Badge variant="outline" className="text-xs bg-info/20 text-info border-info/30">
            {healthCounts.completed || 0}
          </Badge>
        </div>
      </div>
      
      {selectedNodeId && (
        <div className="mt-3 pt-3 border-t border-border-subtle/20">
          <span className="text-xs text-foreground-subtle">Selected:</span>
          <div className="text-xs text-primary font-medium mt-1">
            {nodes.find(n => n.id === selectedNodeId)?.title}
          </div>
        </div>
      )}
    </Card>
  );
};

// Main Component
export const Cascade3DViewer: React.FC<Cascade3DViewerProps> = ({
  isOpen,
  onClose,
  activeTask,
  onNodeSelect
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodes] = useState<GoalNode[]>(mockCascadeData);

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    onNodeSelect?.(nodeId);
  };

  const resetView = () => {
    setSelectedNodeId(null);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 glass-secondary border-b border-border-subtle/30 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">3D Goals Cascade</h1>
          <Badge variant="outline" className="text-xs">
            {nodes.length} nodes
          </Badge>
          {activeTask && (
            <Badge variant="secondary" className="text-xs">
              Context: {activeTask.title}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetView}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
          
          <Button variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 pt-16">
        <Canvas
          camera={{ position: [8, 6, 8], fov: 60 }}
          style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}
        >
          <CascadeScene
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </Canvas>
      </div>

      {/* Goal Radar Minimap */}
      <GoalRadarMinimap nodes={nodes} selectedNodeId={selectedNodeId} />

      {/* Node Details Panel */}
      {selectedNodeId && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute left-4 top-20 bottom-4 w-72"
        >
          <Card className="h-full glass-secondary border-border-subtle/30 p-6">
            {(() => {
              const selectedNode = nodes.find(n => n.id === selectedNodeId);
              if (!selectedNode) return null;
              
              return (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        selectedNode.status === 'healthy' ? 'bg-success/20 text-success border-success/30' :
                        selectedNode.status === 'at-risk' ? 'bg-warning/20 text-warning border-warning/30' :
                        selectedNode.status === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                        'bg-info/20 text-info border-info/30'
                      }`}
                    >
                      {selectedNode.status}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {selectedNode.type}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {selectedNode.title}
                  </h3>
                  
                  {selectedNode.progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-foreground-subtle mb-1">
                        <span>Progress</span>
                        <span>{selectedNode.progress}%</span>
                      </div>
                      <div className="w-full bg-glass-primary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${selectedNode.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedNode.value && selectedNode.target && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-foreground-subtle mb-1">
                        <span>Current / Target</span>
                        <span>{selectedNode.value} / {selectedNode.target}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Zap className="h-4 w-4 mr-2" />
                      Intervene
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Details
                    </Button>
                  </div>
                </>
              );
            })()}
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Card className="glass-secondary border-border-subtle/30 px-4 py-2">
          <p className="text-xs text-foreground-subtle text-center">
            Click nodes to select • Drag to rotate • Scroll to zoom • Right-click to pan
          </p>
        </Card>
      </div>
    </motion.div>
  );
};