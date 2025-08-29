import React, { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { flowSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface FlowStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

// Custom node component
const CustomNode = ({ data }: { data: any }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-background border-2 border-primary`}>
    <div className="font-bold text-sm">{data.label}</div>
    <div className="text-xs text-muted-foreground">{data.kind}</div>
  </div>
);

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const FlowStep: React.FC<FlowStepProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useLoopWizardStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Convert form data to React Flow format
  const initialNodes: Node[] = formData.nodes.map((node, index) => ({
    id: `node-${index}`,
    type: 'custom',
    position: node.pos,
    data: { 
      label: node.label, 
      kind: node.kind,
      originalIndex: index 
    },
  }));

  const initialEdges: Edge[] = formData.edges.map((edge, index) => {
    const fromIndex = formData.nodes.findIndex(n => n.label === edge.from_label);
    const toIndex = formData.nodes.findIndex(n => n.label === edge.to_label);
    return {
      id: `edge-${index}`,
      source: `node-${fromIndex}`,
      target: `node-${toIndex}`,
      label: edge.polarity === 1 ? '+' : '-',
      style: { stroke: edge.polarity === 1 ? '#22c55e' : '#ef4444' },
      data: { originalIndex: index, ...edge },
    };
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [newNodeLabel, setNewNodeLabel] = React.useState('');
  const [newNodeKind, setNewNodeKind] = React.useState<'stock' | 'flow' | 'aux' | 'actor' | 'indicator'>('stock');

  const form = useForm({
    resolver: zodResolver(flowSchema),
    defaultValues: {
      nodes: formData.nodes,
      edges: formData.edges,
    },
  });

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (sourceNode && targetNode) {
        const newEdge = {
          ...params,
          id: `edge-${Date.now()}`,
          label: '+',
          style: { stroke: '#22c55e' },
          data: {
            from_label: sourceNode.data.label,
            to_label: targetNode.data.label,
            polarity: 1 as const,
            delay_ms: 0,
            weight: 1.0,
            note: '',
          },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [nodes, setEdges]
  );

  const addNode = () => {
    if (!newNodeLabel.trim()) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: newNodeLabel, 
        kind: newNodeKind,
        originalIndex: nodes.length 
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNewNodeLabel('');
    setNewNodeKind('stock');
  };

  const removeNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const toggleEdgePolarity = (edgeId: string) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          const newPolarity = edge.data?.polarity === 1 ? -1 : 1;
          return {
            ...edge,
            label: newPolarity === 1 ? '+' : '-',
            style: { stroke: newPolarity === 1 ? '#22c55e' : '#ef4444' },
            data: { ...edge.data, polarity: newPolarity },
          };
        }
        return edge;
      })
    );
  };

  const onSubmit = () => {
    // Convert React Flow data back to form format
    const formNodes = nodes.map((node) => ({
      label: node.data.label,
      kind: node.data.kind,
      meta: {},
      pos: node.position,
    }));

    const formEdges = edges.map((edge) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      return {
        from_label: sourceNode?.data.label || '',
        to_label: targetNode?.data.label || '',
        polarity: edge.data?.polarity || 1,
        delay_ms: edge.data?.delay_ms || 0,
        weight: edge.data?.weight || 1.0,
        note: edge.data?.note || '',
      };
    });

    const flowData = { nodes: formNodes, edges: formEdges };
    
    try {
      flowSchema.parse(flowData);
      updateFormData(flowData);
      toast({
        title: 'Step completed',
        description: `${formNodes.length} nodes and ${formEdges.length} edges saved.`,
      });
      onNext();
    } catch (error) {
      toast({
        title: 'Validation error',
        description: 'Please ensure at least one node is added to the flow.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Node Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Add Nodes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create the building blocks of your loop structure
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Node Label</label>
              <Input
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="Affordable Supply"
                aria-label="New node label"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kind</label>
              <Select value={newNodeKind} onValueChange={(value: any) => setNewNodeKind(value)}>
                <SelectTrigger className="w-32" aria-label="Node kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="flow">Flow</SelectItem>
                  <SelectItem value="aux">Auxiliary</SelectItem>
                  <SelectItem value="actor">Actor</SelectItem>
                  <SelectItem value="indicator">Indicator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addNode} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Node</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* React Flow Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>Loop Structure</CardTitle>
          <p className="text-sm text-muted-foreground">
            Drag nodes to position them and connect them to create feedback loops
          </p>
        </CardHeader>
        <CardContent>
          <div 
            ref={reactFlowWrapper} 
            className="w-full h-96 border border-border rounded-lg"
            role="application"
            aria-label="Loop structure editor"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="top-right"
            >
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </div>
          
          {/* Node Management */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Nodes ({nodes.length})</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => (
                <div 
                  key={node.id} 
                  className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full"
                >
                  <Badge variant="secondary">{node.data.kind}</Badge>
                  <span className="text-sm">{node.data.label}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeNode(node.id)}
                    className="h-4 w-4 p-0"
                    aria-label={`Remove node ${node.data.label}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Edge Management */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Connections ({edges.length})</h4>
            </div>
            <div className="space-y-2">
              {edges.map((edge) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);
                return (
                  <div 
                    key={edge.id} 
                    className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm">
                      {sourceNode?.data.label} → {targetNode?.data.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={edge.data?.polarity === 1 ? "default" : "destructive"}
                        onClick={() => toggleEdgePolarity(edge.id)}
                        className="h-6 w-6 p-0"
                        aria-label={`Toggle polarity for edge from ${sourceNode?.data.label} to ${targetNode?.data.label}`}
                      >
                        {edge.data?.polarity === 1 ? '+' : '-'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        <Button onClick={onSubmit} className="flex items-center space-x-2">
          <span>Next: Adaptive Bands</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};