import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Zap, Target, Users, CheckCircle, AlertTriangle, 
  ArrowLeft, ArrowRight, Save, Send, Calendar,
  Shield, TrendingUp, FileText, Link2, Plus,
  CheckSquare, Settings, Layers
} from 'lucide-react';
import { SixLeverSelector } from '@/components/widgets/SixLeverSelector';
import RACIMatrix from '@/components/widgets/RACIMatrix';
import EnhancedTaskCard from '@/components/workspace/EnhancedTaskCard';
import { toast } from '@/hooks/use-toast';
import { useEnhancedTasks } from '@/hooks/useEnhancedTasks';
import type { ZoneBundleProps } from '@/types/zone-bundles';

interface ActZoneBundleProps extends ZoneBundleProps {}

interface SprintData {
  id: string;
  source: {
    loopId: string | null;
    breachId: string | null;
    meadowsLevers: string[];
    tier: number;
  };
  instruments: Array<{
    family: string;
    action: string;
    params: Record<string, any>;
  }>;
  pathway: {
    actors: Array<{
      id: string;
      name: string;
      type: 'agency' | 'council' | 'department' | 'external';
    }>;
    edges: Array<{
      from: string;
      to: string;
      type: 'authority' | 'funding' | 'data' | 'coordination';
      label: string;
    }>;
  };
  mandateGate: {
    status: 'pass' | 'warn' | 'fail';
    notes: string;
    waiver?: boolean;
  };
  RACI: Array<{
    role: 'Lead' | 'Approve' | 'Consult' | 'Inform';
    actorId: string;
  }>;
  timeline: {
    start: string;
    end: string;
    milestones: Array<{
      label: string;
      date: string;
    }>;
  };
  kpis: Array<{
    id: string;
    label: string;
    target: number;
  }>;
  risks: Array<{
    desc: string;
    mitigation: string;
  }>;
}

const initialSprintData: SprintData = {
  id: '',
  source: {
    loopId: null,
    breachId: null,
    meadowsLevers: [],
    tier: 2
  },
  instruments: [],
  pathway: {
    actors: [],
    edges: []
  },
  mandateGate: {
    status: 'fail',
    notes: ''
  },
  RACI: [],
  timeline: {
    start: '',
    end: '',
    milestones: []
  },
  kpis: [],
  risks: []
};

const WIZARD_STEPS = [
  { id: 'source', label: 'Source & Fit', icon: Link2, required: true },
  { id: 'instruments', label: 'Instruments', icon: Target, required: true },
  { id: 'pathway', label: 'Pathway', icon: Zap, required: true },
  { id: 'mandate', label: 'Mandate Gate', icon: Shield, required: true },
  { id: 'raci', label: 'RACI & Timeline', icon: Users, required: true },
  { id: 'kpis', label: 'KPIs & Risks', icon: TrendingUp, required: true },
  { id: 'review', label: 'Review & Submit', icon: Send, required: true }
];

const ActZoneBundle: React.FC<ActZoneBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const { allTasks, claimTask } = useEnhancedTasks();
  const [showSprintWizard, setShowSprintWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sprintData, setSprintData] = useState<SprintData>(
    payload?.sprint || initialSprintData
  );
  const [stepValidations, setStepValidations] = useState<Record<string, boolean>>({});
  const [isDraft, setIsDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Show wizard if task is claimed or has sprint data
  const shouldShowWizard = showSprintWizard || taskData?.assignee || payload?.sprint;

  // Update payload when sprint data changes
  const updateSprintData = useCallback((updates: Partial<SprintData>) => {
    const newSprintData = { ...sprintData, ...updates };
    setSprintData(newSprintData);
    
    const newPayload = {
      ...payload,
      sprint: newSprintData,
      lastModified: new Date().toISOString()
    };
    
    onPayloadUpdate(newPayload);
  }, [sprintData, payload, onPayloadUpdate]);

  // Validate current step
  const validateStep = useCallback((stepIndex: number) => {
    const step = WIZARD_STEPS[stepIndex];
    let isValid = true;
    const errors: string[] = [];

    switch (step.id) {
      case 'source':
        if (!sprintData.source.loopId && !sprintData.source.breachId) {
          isValid = false;
          errors.push('Either loop or breach must be linked');
        }
        if (sprintData.source.meadowsLevers.length === 0) {
          isValid = false;
          errors.push('At least one Meadows lever required');
        }
        break;

      case 'instruments':
        if (sprintData.instruments.length === 0) {
          isValid = false;
          errors.push('At least one instrument must be selected');
        }
        break;

      case 'pathway':
        if (sprintData.pathway.actors.length === 0) {
          isValid = false;
          errors.push('At least one actor required');
        }
        const orphanActors = sprintData.pathway.actors.filter(actor => 
          !sprintData.pathway.edges.some(edge => 
            edge.from === actor.id || edge.to === actor.id
          )
        );
        if (orphanActors.length > 0 && sprintData.pathway.actors.length > 1) {
          isValid = false;
          errors.push('No orphan actors allowed');
        }
        break;

      case 'mandate':
        if (sprintData.mandateGate.status === 'fail' && !sprintData.mandateGate.waiver) {
          isValid = false;
          errors.push('Mandate gate must pass or have waiver');
        }
        break;

      case 'raci':
        const hasLead = sprintData.RACI.some(r => r.role === 'Lead');
        const hasApprover = sprintData.RACI.some(r => r.role === 'Approve');
        if (!hasLead) {
          isValid = false;
          errors.push('Lead role required');
        }
        if (!hasApprover) {
          isValid = false;
          errors.push('Approver role required');
        }
        if (!sprintData.timeline.start || !sprintData.timeline.end) {
          isValid = false;
          errors.push('Start and end dates required');
        }
        break;

      case 'kpis':
        if (sprintData.kpis.length === 0) {
          isValid = false;
          errors.push('At least one KPI required');
        }
        break;

      case 'review':
        // Check all previous steps
        const allStepsValid = Object.values(stepValidations).every(v => v);
        if (!allStepsValid) {
          isValid = false;
          errors.push('All previous steps must be valid');
        }
        break;
    }

    setStepValidations(prev => ({ ...prev, [step.id]: isValid }));
    return { isValid, errors };
  }, [sprintData, stepValidations]);

  // Navigation helpers
  const goToNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      const { isValid } = validateStep(currentStep);
      if (isValid || !WIZARD_STEPS[currentStep].required) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Actions
  const handleSaveDraft = useCallback(() => {
    updateSprintData({ id: sprintData.id || `sprint_${Date.now()}` });
    setIsDraft(true);
    setLastSaved(new Date());
    toast({
      title: "Draft Saved",
      description: "Sprint has been saved as draft."
    });
  }, [updateSprintData, sprintData.id]);

  const handleSubmitSprint = useCallback(() => {
    const allValid = WIZARD_STEPS.every(step => stepValidations[step.id]);
    
    if (!allValid) {
      toast({
        title: "Cannot Submit",
        description: "Please complete all required steps.",
        variant: "destructive"
      });
      return;
    }

    const sprintId = sprintData.id || `sprint_${Date.now()}`;
    updateSprintData({ id: sprintId });
    setIsDraft(false);
    setLastSaved(new Date());

    // Emit telemetry
    console.log('act.submitted', { taskId, sprintId });

    toast({
      title: "Sprint Submitted",
      description: "Sprint has been submitted successfully."
    });
  }, [stepValidations, updateSprintData, sprintData.id, taskId]);

  // Run validation on step change
  useEffect(() => {
    validateStep(currentStep);
  }, [currentStep, validateStep]);

  // Initialize from payload
  useEffect(() => {
    if (payload?.sprint) {
      setSprintData(payload.sprint);
    }
  }, [payload]);

  // Update parent validation
  useEffect(() => {
    const allValid = Object.values(stepValidations).every(v => v);
    onValidationChange(allValid);
  }, [stepValidations, onValidationChange]);

  const currentStepData = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  // Filter ACT zone tasks  
  const actTasks = allTasks.filter(task => task.zone === 'act');

  if (!shouldShowWizard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col bg-background"
      >
        {/* Original ACT Zone Layout */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">ACT Zone</h2>
                <p className="text-sm text-muted-foreground">
                  Execute interventions and ship solutions
                </p>
              </div>
              <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                ACT
              </Badge>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {actTasks.map((task) => (
              <Card key={task.id} className="hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setShowSprintWizard(true)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{task.title}</span>
                    <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                      {task.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                      ACT
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSprintWizard(true);
                      }}
                    >
                      Start Sprint
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Zone Tools */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Gate Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Validate intervention readiness and mandate
                </p>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participation Pack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Build engagement strategies and materials
                </p>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  PDI Storyboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Design implementation pathway and timeline
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col bg-background"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="p-4 space-y-4">
          {/* Title and Progress */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sprint Wizard</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {WIZARD_STEPS.length}: {currentStepData.label}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                ACT
              </Badge>
              {isDraft && (
                <Badge variant="outline" className="text-blue-500 border-blue-500/30">
                  Draft
                </Badge>
              )}
              {stepValidations[currentStepData.id] ? (
                <Badge variant="outline" className="text-green-500 border-green-500/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-500/30">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Issues
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              {WIZARD_STEPS.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex items-center gap-1 ${
                    index === currentStep ? 'text-primary font-medium' : ''
                  }`}
                >
                  <step.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={goToPrevious}
                disabled={currentStep === 0}
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={currentStep === WIZARD_STEPS.length - 1}
                size="sm"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={readonly}
                size="sm"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Draft
              </Button>
              <Button
                onClick={handleSubmitSprint}
                disabled={readonly || !Object.values(stepValidations).every(v => v)}
                size="sm"
              >
                <Send className="h-4 w-4 mr-1" />
                Submit Sprint
              </Button>
            </div>
          </div>

          {lastSaved && (
            <div className="text-xs text-muted-foreground text-right">
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStepData.id === 'source' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    Source & Fit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Loop ID</label>
                      <Input
                        placeholder="Link to loop..."
                        value={sprintData.source.loopId || ''}
                        onChange={(e) => updateSprintData({
                          source: { ...sprintData.source, loopId: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Breach ID</label>
                      <Input
                        placeholder="Link to breach..."
                        value={sprintData.source.breachId || ''}
                        onChange={(e) => updateSprintData({
                          source: { ...sprintData.source, breachId: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tier</label>
                    <Select 
                      value={sprintData.source.tier.toString()} 
                      onValueChange={(value) => updateSprintData({
                        source: { ...sprintData.source, tier: parseInt(value) }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Tier 1</SelectItem>
                        <SelectItem value="2">Tier 2</SelectItem>
                        <SelectItem value="3">Tier 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Meadows Levers</label>
                    <div className="flex flex-wrap gap-2">
                      {['LP1', 'LP2', 'LP3', 'LP4', 'LP5', 'LP6', 'LP7', 'LP8'].map(lever => (
                        <Badge
                          key={lever}
                          variant={sprintData.source.meadowsLevers.includes(lever) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newLevers = sprintData.source.meadowsLevers.includes(lever)
                              ? sprintData.source.meadowsLevers.filter(l => l !== lever)
                              : [...sprintData.source.meadowsLevers, lever];
                            updateSprintData({
                              source: { ...sprintData.source, meadowsLevers: newLevers }
                            });
                          }}
                        >
                          {lever}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStepData.id === 'instruments' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Instrument Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SixLeverSelector
                    selectedSubLevers={sprintData.instruments.map(i => i.family)}
                    onSubLeverSelect={(family) => {
                      const newInstrument = {
                        family,
                        action: `Action for ${family}`,
                        params: {}
                      };
                      updateSprintData({
                        instruments: [...sprintData.instruments, newInstrument]
                      });
                    }}
                    onSubLeverDeselect={(family) => {
                      updateSprintData({
                        instruments: sprintData.instruments.filter(i => i.family !== family)
                      });
                    }}
                    multiSelect={true}
                  />
                </CardContent>
              </Card>
            )}

            {currentStepData.id === 'pathway' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Pathway Builder
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Actors</h4>
                    <div className="space-y-2">
                      {sprintData.pathway.actors.map((actor, index) => (
                        <div key={actor.id} className="flex items-center gap-2 p-2 border rounded">
                          <span className="flex-1">{actor.name}</span>
                          <Badge variant="outline">{actor.type}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newActors = sprintData.pathway.actors.filter(a => a.id !== actor.id);
                              updateSprintData({
                                pathway: { ...sprintData.pathway, actors: newActors }
                              });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Actor name..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const name = e.currentTarget.value;
                              if (name) {
                                const newActor = {
                                  id: `actor_${Date.now()}`,
                                  name,
                                  type: 'agency' as const
                                };
                                updateSprintData({
                                  pathway: {
                                    ...sprintData.pathway,
                                    actors: [...sprintData.pathway.actors, newActor]
                                  }
                                });
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Edges</h4>
                    <div className="space-y-2">
                      {sprintData.pathway.edges.map((edge, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <span className="flex-1">{edge.label}</span>
                          <Badge variant="outline">{edge.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStepData.id === 'mandate' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Mandate Gate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select 
                      value={sprintData.mandateGate.status} 
                      onValueChange={(value: 'pass' | 'warn' | 'fail') => updateSprintData({
                        mandateGate: { ...sprintData.mandateGate, status: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">Pass</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="fail">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea
                      placeholder="Mandate gate notes..."
                      value={sprintData.mandateGate.notes}
                      onChange={(e) => updateSprintData({
                        mandateGate: { ...sprintData.mandateGate, notes: e.target.value }
                      })}
                    />
                  </div>

                  {sprintData.mandateGate.status === 'fail' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sprintData.mandateGate.waiver || false}
                        onChange={(e) => updateSprintData({
                          mandateGate: { ...sprintData.mandateGate, waiver: e.target.checked }
                        })}
                      />
                      <label className="text-sm">Attach waiver for authority exceptions</label>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStepData.id === 'raci' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    RACI & Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Timeline</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Start Date</label>
                        <Input
                          type="date"
                          value={sprintData.timeline.start}
                          onChange={(e) => updateSprintData({
                            timeline: { ...sprintData.timeline, start: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">End Date</label>
                        <Input
                          type="date"
                          value={sprintData.timeline.end}
                          onChange={(e) => updateSprintData({
                            timeline: { ...sprintData.timeline, end: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">RACI Assignments</h4>
                    <div className="space-y-2">
                      {['Lead', 'Approve', 'Consult', 'Inform'].map(role => (
                        <div key={role} className="flex items-center gap-2">
                          <span className="w-20 text-sm font-medium">{role}:</span>
                          <Select
                            value={sprintData.RACI.find(r => r.role === role)?.actorId || ''}
                            onValueChange={(actorId) => {
                              const newRaci = sprintData.RACI.filter(r => r.role !== role);
                              if (actorId) {
                                newRaci.push({ role: role as any, actorId });
                              }
                              updateSprintData({ RACI: newRaci });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select actor..." />
                            </SelectTrigger>
                            <SelectContent>
                              {sprintData.pathway.actors.map(actor => (
                                <SelectItem key={actor.id} value={actor.id}>
                                  {actor.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStepData.id === 'kpis' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    KPIs & Risks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">KPIs</h4>
                    <div className="space-y-2">
                      {sprintData.kpis.map((kpi, index) => (
                        <div key={kpi.id} className="flex items-center gap-2 p-2 border rounded">
                          <span className="flex-1">{kpi.label}</span>
                          <span className="text-sm text-muted-foreground">Target: {kpi.target}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newKpis = sprintData.kpis.filter(k => k.id !== kpi.id);
                              updateSprintData({ kpis: newKpis });
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="KPI label..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const label = e.currentTarget.value;
                              if (label) {
                                const newKpi = {
                                  id: `kpi_${Date.now()}`,
                                  label,
                                  target: 100
                                };
                                updateSprintData({
                                  kpis: [...sprintData.kpis, newKpi]
                                });
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Risks</h4>
                    <div className="space-y-2">
                      {sprintData.risks.map((risk, index) => (
                        <div key={index} className="p-2 border rounded space-y-1">
                          <div className="text-sm font-medium">{risk.desc}</div>
                          <div className="text-xs text-muted-foreground">Mitigation: {risk.mitigation}</div>
                        </div>
                      ))}
                      <div className="space-y-2">
                        <Input
                          placeholder="Risk description..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const desc = e.currentTarget.value;
                              if (desc) {
                                const mitigation = prompt('Enter mitigation strategy:') || '';
                                const newRisk = { desc, mitigation };
                                updateSprintData({
                                  risks: [...sprintData.risks, newRisk]
                                });
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStepData.id === 'review' && (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Review & Submit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Source</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Loop: {sprintData.source.loopId || 'None'}</div>
                          <div>Breach: {sprintData.source.breachId || 'None'}</div>
                          <div>Tier: {sprintData.source.tier}</div>
                          <div>Levers: {sprintData.source.meadowsLevers.join(', ')}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Instruments ({sprintData.instruments.length})</h4>
                        <div className="text-sm text-muted-foreground">
                          {sprintData.instruments.map(i => i.family).join(', ') || 'None selected'}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Pathway</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Actors: {sprintData.pathway.actors.length}</div>
                          <div>Edges: {sprintData.pathway.edges.length}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Mandate Gate</h4>
                        <div className="text-sm text-muted-foreground">
                          Status: {sprintData.mandateGate.status}
                          {sprintData.mandateGate.waiver && ' (with waiver)'}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Timeline</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Start: {sprintData.timeline.start || 'Not set'}</div>
                          <div>End: {sprintData.timeline.end || 'Not set'}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">KPIs & Risks</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>KPIs: {sprintData.kpis.length}</div>
                          <div>Risks: {sprintData.risks.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Validation Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {WIZARD_STEPS.slice(0, -1).map(step => (
                        <div key={step.id} className="flex items-center gap-2">
                          {stepValidations[step.id] ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActZoneBundle;