import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, X, FlaskConical, Users, Target } from 'lucide-react';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { modulesExperimentsSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface ModulesExperimentsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ModulesExperimentsStep: React.FC<ModulesExperimentsStepProps> = ({ onNext, onPrevious }) => {
  const { 
    formData, 
    updateFormData, 
    addExperiment, 
    removeExperiment, 
    updateExperiment,
    addPilot,
    removePilot,
    updatePilot
  } = useLoopWizardStore();
  
  const form = useForm({
    resolver: zodResolver(modulesExperimentsSchema),
    defaultValues: {
      experiments: formData.experiments,
      pilots: formData.pilots,
    },
  });

  const onSubmit = async (data: any) => {
    updateFormData(data);
    toast({ title: 'Modules & Experiments configured successfully' });
    onNext();
  };

  const addStakeholder = (pilotIndex: number) => {
    const currentPilots = form.getValues('pilots') || [];
    const updated = [...currentPilots];
    const currentStakeholders = updated[pilotIndex].stakeholders || [];
    updated[pilotIndex].stakeholders = [...currentStakeholders, ''];
    form.setValue('pilots', updated);
  };

  const removeStakeholder = (pilotIndex: number, stakeholderIndex: number) => {
    const currentPilots = form.getValues('pilots') || [];
    const updated = [...currentPilots];
    updated[pilotIndex].stakeholders = updated[pilotIndex].stakeholders.filter((_, i) => i !== stakeholderIndex);
    form.setValue('pilots', updated);
  };

  const updateStakeholder = (pilotIndex: number, stakeholderIndex: number, value: string) => {
    const currentPilots = form.getValues('pilots') || [];
    const updated = [...currentPilots];
    updated[pilotIndex].stakeholders[stakeholderIndex] = value;
    form.setValue('pilots', updated);
  };

  const addLearningObjective = (pilotIndex: number) => {
    const currentPilots = form.getValues('pilots') || [];
    const updated = [...currentPilots];
    const currentObjectives = updated[pilotIndex].learning_objectives || [];
    updated[pilotIndex].learning_objectives = [...currentObjectives, ''];
    form.setValue('pilots', updated);
  };

  const removeLearningObjective = (pilotIndex: number, objectiveIndex: number) => {
    const currentPilots = form.getValues('pilots') || [];
    const updated = [...currentPilots];
    updated[pilotIndex].learning_objectives = updated[pilotIndex].learning_objectives.filter((_, i) => i !== objectiveIndex);
    form.setValue('pilots', updated);
  };

  const updateLearningObjective = (pilotIndex: number, objectiveIndex: number, value: string) => {
    const currentPilots = form.getValues('pilots') || [];
    const updated = [...currentPilots];
    updated[pilotIndex].learning_objectives[objectiveIndex] = value;
    form.setValue('pilots', updated);
  };

  const experiments = form.watch('experiments') || [];
  const pilots = form.watch('pilots') || [];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Experiments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5" />
            Experiments
          </CardTitle>
          <CardDescription>
            Design controlled experiments to test hypotheses (DiD, RCT, Synthetic Control)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {experiments.map((experiment, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Experiment {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeExperiment(index);
                      const current = form.getValues('experiments');
                      form.setValue('experiments', current.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={experiment.name}
                      onChange={(e) => {
                        updateExperiment(index, { name: e.target.value });
                        const current = form.getValues('experiments');
                        current[index].name = e.target.value;
                        form.setValue('experiments', current);
                      }}
                      placeholder="Experiment name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Methodology</Label>
                    <Select 
                      onValueChange={(value: any) => {
                        updateExperiment(index, { methodology: value });
                        const current = form.getValues('experiments');
                        current[index].methodology = value;
                        form.setValue('experiments', current);
                      }} 
                      value={experiment.methodology}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select methodology" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rct">Randomized Controlled Trial (RCT)</SelectItem>
                        <SelectItem value="did">Difference-in-Differences (DiD)</SelectItem>
                        <SelectItem value="synthetic_control">Synthetic Control</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hypothesis</Label>
                  <Textarea
                    value={experiment.hypothesis}
                    onChange={(e) => {
                      updateExperiment(index, { hypothesis: e.target.value });
                      const current = form.getValues('experiments');
                      current[index].hypothesis = e.target.value;
                      form.setValue('experiments', current);
                    }}
                    placeholder="What hypothesis will this experiment test?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Success Criteria</Label>
                  <Textarea
                    value={experiment.success_criteria}
                    onChange={(e) => {
                      updateExperiment(index, { success_criteria: e.target.value });
                      const current = form.getValues('experiments');
                      current[index].success_criteria = e.target.value;
                      form.setValue('experiments', current);
                    }}
                    placeholder="How will you measure success?"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timeline (weeks)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="104"
                      value={experiment.timeline_weeks}
                      onChange={(e) => {
                        updateExperiment(index, { timeline_weeks: parseInt(e.target.value) });
                        const current = form.getValues('experiments');
                        current[index].timeline_weeks = parseInt(e.target.value);
                        form.setValue('experiments', current);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Resources Required</Label>
                    <Input
                      value={experiment.resources_required}
                      onChange={(e) => {
                        updateExperiment(index, { resources_required: e.target.value });
                        const current = form.getValues('experiments');
                        current[index].resources_required = e.target.value;
                        form.setValue('experiments', current);
                      }}
                      placeholder="Budget, personnel, equipment..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Evaluation Plan</Label>
                  <Textarea
                    value={experiment.evaluation_plan}
                    onChange={(e) => {
                      updateExperiment(index, { evaluation_plan: e.target.value });
                      const current = form.getValues('experiments');
                      current[index].evaluation_plan = e.target.value;
                      form.setValue('experiments', current);
                    }}
                    placeholder="How will you evaluate results and validity?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ethical Considerations</Label>
                  <Textarea
                    value={experiment.ethical_considerations}
                    onChange={(e) => {
                      updateExperiment(index, { ethical_considerations: e.target.value });
                      const current = form.getValues('experiments');
                      current[index].ethical_considerations = e.target.value;
                      form.setValue('experiments', current);
                    }}
                    placeholder="Ethical review, consent, potential risks..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              addExperiment();
              const current = form.getValues('experiments') || [];
              form.setValue('experiments', [
                ...current,
                {
                  name: '',
                  hypothesis: '',
                  methodology: 'rct' as const,
                  success_criteria: '',
                  timeline_weeks: 12,
                  resources_required: '',
                  evaluation_plan: '',
                  ethical_considerations: '',
                },
              ]);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experiment
          </Button>
        </CardContent>
      </Card>

      {/* Pilots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pilots
          </CardTitle>
          <CardDescription>
            Design pilot programs to test interventions in real-world settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pilots.map((pilot, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Pilot {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removePilot(index);
                      const current = form.getValues('pilots');
                      form.setValue('pilots', current.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={pilot.name}
                      onChange={(e) => {
                        updatePilot(index, { name: e.target.value });
                        const current = form.getValues('pilots');
                        current[index].name = e.target.value;
                        form.setValue('pilots', current);
                      }}
                      placeholder="Pilot program name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (weeks)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="52"
                      value={pilot.duration_weeks}
                      onChange={(e) => {
                        updatePilot(index, { duration_weeks: parseInt(e.target.value) });
                        const current = form.getValues('pilots');
                        current[index].duration_weeks = parseInt(e.target.value);
                        form.setValue('pilots', current);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Objective</Label>
                  <Textarea
                    value={pilot.objective}
                    onChange={(e) => {
                      updatePilot(index, { objective: e.target.value });
                      const current = form.getValues('pilots');
                      current[index].objective = e.target.value;
                      form.setValue('pilots', current);
                    }}
                    placeholder="What is the main objective of this pilot?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Scope</Label>
                  <Textarea
                    value={pilot.scope}
                    onChange={(e) => {
                      updatePilot(index, { scope: e.target.value });
                      const current = form.getValues('pilots');
                      current[index].scope = e.target.value;
                      form.setValue('pilots', current);
                    }}
                    placeholder="Define the boundaries and scale of this pilot..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stakeholders</Label>
                  <div className="space-y-2">
                    {(pilot.stakeholders || []).map((stakeholder, stakeholderIndex) => (
                      <div key={stakeholderIndex} className="flex items-center gap-2">
                        <Input
                          value={stakeholder}
                          onChange={(e) => updateStakeholder(index, stakeholderIndex, e.target.value)}
                          placeholder="Stakeholder name/role..."
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeStakeholder(index, stakeholderIndex)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addStakeholder(index)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stakeholder
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Risk Mitigation</Label>
                  <Textarea
                    value={pilot.risk_mitigation}
                    onChange={(e) => {
                      updatePilot(index, { risk_mitigation: e.target.value });
                      const current = form.getValues('pilots');
                      current[index].risk_mitigation = e.target.value;
                      form.setValue('pilots', current);
                    }}
                    placeholder="How will you identify and mitigate risks?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Learning Objectives</Label>
                  <div className="space-y-2">
                    {(pilot.learning_objectives || []).map((objective, objectiveIndex) => (
                      <div key={objectiveIndex} className="flex items-center gap-2">
                        <Input
                          value={objective}
                          onChange={(e) => updateLearningObjective(index, objectiveIndex, e.target.value)}
                          placeholder="What do you want to learn?"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLearningObjective(index, objectiveIndex)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLearningObjective(index)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Learning Objective
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              addPilot();
              const current = form.getValues('pilots') || [];
              form.setValue('pilots', [
                ...current,
                {
                  name: '',
                  objective: '',
                  scope: '',
                  duration_weeks: 8,
                  stakeholders: [],
                  risk_mitigation: '',
                  learning_objectives: [],
                },
              ]);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pilot
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <FlaskConical className="w-4 h-4" />
        <AlertDescription>
          RRE Modules combine rigorous experimental design with practical pilot implementation. 
          Focus on generating valid, testable evidence to inform doctrine development.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit">
          Next: Baselines & Reflex Memory
        </Button>
      </div>
    </form>
  );
};