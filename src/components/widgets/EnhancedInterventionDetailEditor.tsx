import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  DollarSign,
  Settings,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { toast } from '../../hooks/use-toast';
import type { 
  EnhancedIntervention, 
  MicroTask, 
  InterventionParameter, 
  BudgetLineItem,
  AutomationRule 
} from '../../types/intervention';
import { getSubLeverById } from '../../types/levers';

interface EnhancedInterventionDetailEditorProps {
  intervention: EnhancedIntervention;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedIntervention: EnhancedIntervention) => void;
}

export const EnhancedInterventionDetailEditor: React.FC<EnhancedInterventionDetailEditorProps> = ({
  intervention,
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editedIntervention, setEditedIntervention] = useState<EnhancedIntervention>(intervention);

  const handleSave = () => {
    onSave({
      ...editedIntervention,
      updatedAt: new Date(),
      lastModifiedBy: 'current-user' // TODO: Get from auth context
    });
    
    toast({
      title: "Intervention Updated",
      description: "All changes have been saved successfully."
    });
    
    onClose();
  };

  const addMicroTask = () => {
    const newTask: MicroTask = {
      id: `task-${Date.now()}`,
      name: '',
      description: '',
      type: 'execution',
      assignedTo: {
        personId: '',
        name: '',
        title: '',
        organization: '',
        raciBadge: 'R',
        timeCommitment: '20% FTE'
      },
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      estimatedHours: 8,
      status: 'not-started',
      progress: 0,
      blockers: [],
      isPartOfMiniLoop: false,
      dependencies: [],
      dependents: [],
      resourceRequirements: [],
      deliverables: [],
      qualityCriteria: []
    };

    setEditedIntervention(prev => ({
      ...prev,
      microTasks: [...prev.microTasks, newTask]
    }));
  };

  const addParameter = () => {
    const newParameter: InterventionParameter = {
      id: `param-${Date.now()}`,
      name: '',
      type: 'text',
      value: '',
      defaultValue: '',
      description: '',
      category: 'configuration',
      required: false,
      sensitive: false
    };

    setEditedIntervention(prev => ({
      ...prev,
      parameters: [...prev.parameters, newParameter]
    }));
  };

  const addBudgetLineItem = () => {
    const newLineItem: BudgetLineItem = {
      id: `budget-${Date.now()}`,
      category: 'operations',
      subcategory: '',
      description: '',
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      justification: '',
      priority: 'important',
      timeline: 'upfront',
      riskLevel: 'low'
    };

    setEditedIntervention(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        lineItems: [...prev.budget.lineItems, newLineItem]
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/20 text-success border-success/30';
      case 'in-progress': return 'bg-primary/20 text-primary border-primary/30';
      case 'blocked': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'setup': return <Settings className="h-4 w-4" />;
      case 'execution': return <PlayCircle className="h-4 w-4" />;
      case 'monitoring': return <Target className="h-4 w-4" />;
      case 'review': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative glass-secondary rounded-2xl border border-border-subtle shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{editedIntervention.icon}</span>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{editedIntervention.name}</h2>
                <p className="text-sm text-muted-foreground">{editedIntervention.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(editedIntervention.status)}>
                {editedIntervention.status}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-6 bg-glass rounded-none border-b border-border-subtle">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="sub-levers">Sub-Levers</TabsTrigger>
              <TabsTrigger value="micro-tasks">Micro-Tasks</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <TabsContent value="overview" className="p-6 space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Intervention Name</Label>
                        <Input
                          value={editedIntervention.name}
                          onChange={(e) => setEditedIntervention(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select
                          value={editedIntervention.category}
                          onValueChange={(value) => setEditedIntervention(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Process">Process</SelectItem>
                            <SelectItem value="Governance">Governance</SelectItem>
                            <SelectItem value="Policy">Policy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={editedIntervention.description}
                        onChange={(e) => setEditedIntervention(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed intervention description..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Effort Level</Label>
                        <Select
                          value={editedIntervention.effort}
                          onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                            setEditedIntervention(prev => ({ ...prev, effort: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Expected Impact</Label>
                        <Select
                          value={editedIntervention.impact}
                          onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                            setEditedIntervention(prev => ({ ...prev, impact: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Time to Impact</Label>
                        <Select
                          value={editedIntervention.timeToImpact}
                          onValueChange={(value: 'Short' | 'Medium' | 'Long') => 
                            setEditedIntervention(prev => ({ ...prev, timeToImpact: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Short">Short Term</SelectItem>
                            <SelectItem value="Medium">Medium Term</SelectItem>
                            <SelectItem value="Long">Long Term</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loop Context */}
                {editedIntervention.parentLoopId && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Loop Context</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Parent Loop:</strong> {editedIntervention.parentLoopId}</p>
                        <p className="text-sm"><strong>Target Variables:</strong> {editedIntervention.targetLoopVariables.join(', ')}</p>
                        <p className="text-sm"><strong>Expected Impact:</strong> {editedIntervention.expectedLoopImpact.impactType}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="parameters" className="p-6 space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Configuration Parameters</span>
                      <Button variant="outline" size="sm" onClick={addParameter}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Parameter
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editedIntervention.parameters.map((param, index) => (
                      <div key={param.id} className="glass rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Parameter Name</Label>
                            <Input
                              value={param.name}
                              onChange={(e) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  parameters: prev.parameters.map((p, i) => 
                                    i === index ? { ...p, name: e.target.value } : p
                                  )
                                }));
                              }}
                              placeholder="Parameter name"
                            />
                          </div>
                          <div>
                            <Label>Type</Label>
                            <Select
                              value={param.type}
                              onValueChange={(value: any) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  parameters: prev.parameters.map((p, i) => 
                                    i === index ? { ...p, type: value } : p
                                  )
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="select">Select</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="currency">Currency</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Value</Label>
                            {param.type === 'number' || param.type === 'currency' ? (
                              <Input
                                type="number"
                                value={param.value}
                                onChange={(e) => {
                                  setEditedIntervention(prev => ({
                                    ...prev,
                                    parameters: prev.parameters.map((p, i) => 
                                      i === index ? { ...p, value: parseFloat(e.target.value) || 0 } : p
                                    )
                                  }));
                                }}
                              />
                            ) : param.type === 'boolean' ? (
                              <div className="flex items-center pt-2">
                                <Switch
                                  checked={param.value}
                                  onCheckedChange={(checked) => {
                                    setEditedIntervention(prev => ({
                                      ...prev,
                                      parameters: prev.parameters.map((p, i) => 
                                        i === index ? { ...p, value: checked } : p
                                      )
                                    }));
                                  }}
                                />
                              </div>
                            ) : (
                              <Input
                                value={param.value}
                                onChange={(e) => {
                                  setEditedIntervention(prev => ({
                                    ...prev,
                                    parameters: prev.parameters.map((p, i) => 
                                      i === index ? { ...p, value: e.target.value } : p
                                    )
                                  }));
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={param.description}
                            onChange={(e) => {
                              setEditedIntervention(prev => ({
                                ...prev,
                                parameters: prev.parameters.map((p, i) => 
                                  i === index ? { ...p, description: e.target.value } : p
                                )
                              }));
                            }}
                            placeholder="Parameter description..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sub-levers" className="p-6 space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Sub-Levers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editedIntervention.selectedSubLevers.map((subLeverId) => {
                      const subLever = getSubLeverById(subLeverId);
                      if (!subLever) return null;

                      return (
                        <div key={subLeverId} className="glass rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-foreground">{subLever.name}</h4>
                              <p className="text-sm text-muted-foreground">{subLever.description}</p>
                            </div>
                            <Badge variant="outline">{subLever.actionType}</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Examples:</h5>
                            <div className="flex flex-wrap gap-2">
                              {subLever.examples.map((example, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="micro-tasks" className="p-6 space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Micro-Tasks ({editedIntervention.microTasks.length})</span>
                      <Button variant="outline" size="sm" onClick={addMicroTask}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editedIntervention.microTasks.map((task, index) => (
                      <div key={task.id} className="glass rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getTaskTypeIcon(task.type)}
                            <div>
                              <Input
                                value={task.name}
                                onChange={(e) => {
                                  setEditedIntervention(prev => ({
                                    ...prev,
                                    microTasks: prev.microTasks.map((t, i) => 
                                      i === index ? { ...t, name: e.target.value } : t
                                    )
                                  }));
                                }}
                                placeholder="Task name"
                                className="font-medium mb-1"
                              />
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{task.type}</Badge>
                            <div className="text-sm text-muted-foreground">
                              {task.progress}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Due Date</Label>
                            <Input
                              type="date"
                              value={task.dueDate.toISOString().split('T')[0]}
                              onChange={(e) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  microTasks: prev.microTasks.map((t, i) => 
                                    i === index ? { ...t, dueDate: new Date(e.target.value) } : t
                                  )
                                }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Estimated Hours</Label>
                            <Input
                              type="number"
                              value={task.estimatedHours}
                              onChange={(e) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  microTasks: prev.microTasks.map((t, i) => 
                                    i === index ? { ...t, estimatedHours: parseInt(e.target.value) || 0 } : t
                                  )
                                }));
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <Label>Mini-Loop Integration</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Switch
                              checked={task.isPartOfMiniLoop}
                              onCheckedChange={(checked) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  microTasks: prev.microTasks.map((t, i) => 
                                    i === index ? { ...t, isPartOfMiniLoop: checked } : t
                                  )
                                }));
                              }}
                            />
                            <span className="text-sm text-muted-foreground">
                              Part of feedback loop
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="budget" className="p-6 space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Budget Breakdown</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-primary">
                          ${editedIntervention.budget.totalBudget.toLocaleString()}
                        </span>
                        <Button variant="outline" size="sm" onClick={addBudgetLineItem}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Line Item
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editedIntervention.budget.lineItems.map((item, index) => (
                      <div key={item.id} className="glass rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <Label>Category</Label>
                            <Select
                              value={item.category}
                              onValueChange={(value: any) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  budget: {
                                    ...prev.budget,
                                    lineItems: prev.budget.lineItems.map((li, i) => 
                                      i === index ? { ...li, category: value } : li
                                    )
                                  }
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="personnel">Personnel</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="communications">Communications</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  budget: {
                                    ...prev.budget,
                                    lineItems: prev.budget.lineItems.map((li, i) => 
                                      i === index ? { ...li, description: e.target.value } : li
                                    )
                                  }
                                }));
                              }}
                              placeholder="Line item description"
                            />
                          </div>
                          <div>
                            <Label>Unit Cost</Label>
                            <Input
                              type="number"
                              value={item.unitCost}
                              onChange={(e) => {
                                const unitCost = parseFloat(e.target.value) || 0;
                                setEditedIntervention(prev => ({
                                  ...prev,
                                  budget: {
                                    ...prev.budget,
                                    lineItems: prev.budget.lineItems.map((li, i) => 
                                      i === index ? { 
                                        ...li, 
                                        unitCost, 
                                        totalCost: unitCost * li.quantity 
                                      } : li
                                    )
                                  }
                                }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Total Cost</Label>
                            <div className="flex items-center justify-between px-3 py-2 border border-border-subtle rounded-md bg-muted/20">
                              <span className="font-medium">${item.totalCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="p-6 space-y-6 m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground">
                        Automation rules feature coming soon
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Configure "If X then Y" conditions to automate task creation and status updates
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border-subtle">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Last updated: {editedIntervention.updatedAt.toLocaleDateString()}
              </div>
              <Badge variant="outline">
                {editedIntervention.microTasks.length} tasks
              </Badge>
              <Badge variant="outline">
                ${editedIntervention.budget.totalBudget.toLocaleString()} budget
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedInterventionDetailEditor;