import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAnticipatoryBundle, Playbook } from '@/hooks/useAnticipatoryBundle';
import { Plus, BookOpen, Zap, Clock, CheckCircle, ArrowRight, Settings } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface PlaybookBuilderProps {
  taskId: string;
  loopId: string;
}

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  owner: string;
  lever: 'N' | 'P' | 'S';
  sla_minutes: number;
  required: boolean;
}

const LEVER_COLORS = {
  N: 'bg-blue-500',
  P: 'bg-amber-500', 
  S: 'bg-red-500'
};

const LEVER_LABELS = {
  N: 'Natural',
  P: 'Physical',
  S: 'Structural'
};

export default function PlaybookBuilder({ taskId, loopId }: PlaybookBuilderProps) {
  const {
    playbooks,
    createPlaybook
  } = useAnticipatoryBundle(taskId, loopId);

  const [builderOpen, setBuilderOpen] = useState(false);
  const [currentPlaybook, setCurrentPlaybook] = useState({
    title: '',
    lever_order: ['N', 'P', 'S'] as string[],
    auto_action: false,
    steps: [] as PlaybookStep[],
    guards: {},
    success_criteria: {}
  });

  const [newStep, setNewStep] = useState<{
    title: string;
    description: string;
    owner: string;
    lever: 'N' | 'P' | 'S';
    sla_minutes: number;
    required: boolean;
  }>({
    title: '',
    description: '',
    owner: '',
    lever: 'N',
    sla_minutes: 60,
    required: true
  });

  const handleAddStep = () => {
    if (!newStep.title) return;

    const step: PlaybookStep = {
      id: `step-${Date.now()}`,
      ...newStep
    };

    setCurrentPlaybook(prev => ({
      ...prev,
      steps: [...prev.steps, step]
    }));

    setNewStep({
      title: '',
      description: '',
      owner: '',
      lever: 'N' as const,
      sla_minutes: 60,
      required: true
    });
  };

  const handleRemoveStep = (stepId: string) => {
    setCurrentPlaybook(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const steps = Array.from(currentPlaybook.steps);
    const [reorderedItem] = steps.splice(result.source.index, 1);
    steps.splice(result.destination.index, 0, reorderedItem);

    setCurrentPlaybook(prev => ({
      ...prev,
      steps
    }));
  };

  const handleCreatePlaybook = () => {
    if (!currentPlaybook.title || currentPlaybook.steps.length === 0) return;

    createPlaybook.mutate({
      title: currentPlaybook.title,
      lever_order: currentPlaybook.lever_order,
      steps: currentPlaybook.steps,
      guards: currentPlaybook.guards,
      success_criteria: currentPlaybook.success_criteria,
      auto_action: currentPlaybook.auto_action
    });

    setBuilderOpen(false);
    setCurrentPlaybook({
      title: '',
      lever_order: ['N', 'P', 'S'],
      auto_action: false,
      steps: [],
      guards: {},
      success_criteria: {}
    });
  };

  const getStepsByLever = (lever: string) => {
    return currentPlaybook.steps.filter(step => step.lever === lever);
  };

  const getTotalSLA = () => {
    return currentPlaybook.steps.reduce((total, step) => total + step.sla_minutes, 0);
  };

  return (
    <div className="space-y-6">
      {/* Playbook Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Playbook Builder
            </div>
            <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Build Playbook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Build New Playbook</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Playbook Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., High Demand Response"
                        value={currentPlaybook.title}
                        onChange={(e) => setCurrentPlaybook(prev => ({ 
                          ...prev, 
                          title: e.target.value 
                        }))}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-action"
                        checked={currentPlaybook.auto_action}
                        onCheckedChange={(checked) => setCurrentPlaybook(prev => ({ 
                          ...prev, 
                          auto_action: checked 
                        }))}
                      />
                      <Label htmlFor="auto-action">Auto-execute on trigger</Label>
                    </div>
                  </div>

                  {/* Lever Order */}
                  <div>
                    <Label>Lever Escalation Order</Label>
                    <div className="flex gap-2 mt-2">
                      {currentPlaybook.lever_order.map((lever, index) => (
                        <div key={lever} className="flex items-center gap-2">
                          {index > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                          <Badge className={`${LEVER_COLORS[lever as keyof typeof LEVER_COLORS]} text-white`}>
                            {lever} - {LEVER_LABELS[lever as keyof typeof LEVER_LABELS]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Step Form */}
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-sm">Add Step</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="step-title">Step Title</Label>
                          <Input
                            id="step-title"
                            placeholder="e.g., Increase server capacity"
                            value={newStep.title}
                            onChange={(e) => setNewStep(prev => ({ 
                              ...prev, 
                              title: e.target.value 
                            }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="step-lever">Lever Type</Label>
                          <Select 
                            value={newStep.lever} 
                            onValueChange={(value: 'N' | 'P' | 'S') => 
                              setNewStep(prev => ({ ...prev, lever: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="N">N - Natural (Communication, Process)</SelectItem>
                              <SelectItem value="P">P - Physical (Resources, Infrastructure)</SelectItem>
                              <SelectItem value="S">S - Structural (Policy, Governance)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="step-description">Description</Label>
                        <Textarea
                          id="step-description"
                          placeholder="Detailed instructions for this step..."
                          value={newStep.description}
                          onChange={(e) => setNewStep(prev => ({ 
                            ...prev, 
                            description: e.target.value 
                          }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="step-owner">Owner</Label>
                          <Input
                            id="step-owner"
                            placeholder="User ID or role"
                            value={newStep.owner}
                            onChange={(e) => setNewStep(prev => ({ 
                              ...prev, 
                              owner: e.target.value 
                            }))}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="step-sla">SLA (minutes)</Label>
                          <Input
                            id="step-sla"
                            type="number"
                            value={newStep.sla_minutes}
                            onChange={(e) => setNewStep(prev => ({ 
                              ...prev, 
                              sla_minutes: parseInt(e.target.value) || 60 
                            }))}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-6">
                          <Switch
                            id="step-required"
                            checked={newStep.required}
                            onCheckedChange={(checked) => setNewStep(prev => ({ 
                              ...prev, 
                              required: checked 
                            }))}
                          />
                          <Label htmlFor="step-required">Required</Label>
                        </div>
                      </div>
                      
                      <Button onClick={handleAddStep} disabled={!newStep.title}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Step
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Steps Overview */}
                  {currentPlaybook.steps.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Playbook Steps ({currentPlaybook.steps.length})</span>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="h-4 w-4" />
                            Total SLA: {getTotalSLA()} minutes
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="playbook-steps">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                              >
                                {currentPlaybook.steps.map((step, index) => (
                                  <Draggable key={step.id} draggableId={step.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="p-3 border rounded-lg bg-background"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-start gap-3">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-mono text-muted-foreground">
                                                {index + 1}
                                              </span>
                                              <Badge 
                                                className={`${LEVER_COLORS[step.lever]} text-white text-xs`}
                                              >
                                                {step.lever}
                                              </Badge>
                                            </div>
                                            <div>
                                              <h4 className="font-medium text-sm">{step.title}</h4>
                                              <p className="text-xs text-muted-foreground">
                                                {step.description}
                                              </p>
                                              <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                                                <span>Owner: {step.owner}</span>
                                                <span>SLA: {step.sla_minutes}m</span>
                                                {step.required && <span className="text-amber-600">Required</span>}
                                              </div>
                                            </div>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveStep(step.id)}
                                          >
                                            ×
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreatePlaybook}
                      disabled={!currentPlaybook.title || currentPlaybook.steps.length === 0}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Create Playbook
                    </Button>
                    <Button variant="outline" onClick={() => setBuilderOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Existing Playbooks */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Playbooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {playbooks.map((playbook) => (
              <Card key={playbook.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{playbook.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {playbook.auto_action && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto-execute
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {(playbook.steps as PlaybookStep[]).length} steps
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lever Order Preview */}
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Escalation Order:</p>
                    <div className="flex gap-1">
                      {playbook.lever_order.map((lever, index) => (
                        <div key={lever} className="flex items-center gap-1">
                          {index > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                          <Badge 
                            className={`${LEVER_COLORS[lever as keyof typeof LEVER_COLORS]} text-white text-xs`}
                          >
                            {lever}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps Summary */}
                  <div className="space-y-2">
                    {(playbook.steps as PlaybookStep[]).slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-xs font-mono text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <Badge 
                          className={`${LEVER_COLORS[step.lever]} text-white text-xs`}
                        >
                          {step.lever}
                        </Badge>
                        <span className="flex-1 truncate">{step.title}</span>
                        <span className="text-xs text-muted-foreground">{step.sla_minutes}m</span>
                      </div>
                    ))}
                    {(playbook.steps as PlaybookStep[]).length > 3 && (
                      <p className="text-xs text-muted-foreground ml-8">
                        +{(playbook.steps as PlaybookStep[]).length - 3} more steps
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {playbooks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No playbooks created</p>
                <p className="text-sm">Build your first response playbook</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
