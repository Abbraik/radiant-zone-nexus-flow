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
import { Plus, X, Minus, Target, GitBranch, Settings } from 'lucide-react';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { loopAtlasSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface LoopAtlasStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const LoopAtlasStep: React.FC<LoopAtlasStepProps> = ({ onNext, onPrevious }) => {
  const { 
    formData, 
    updateFormData, 
    addLoopClassification, 
    removeLoopClassification, 
    updateLoopClassification 
  } = useLoopWizardStore();
  
  const form = useForm({
    resolver: zodResolver(loopAtlasSchema),
    defaultValues: {
      bands: formData.bands,
      loop_classification: formData.loop_classification,
      system_purpose: formData.system_purpose,
      key_feedbacks: formData.key_feedbacks,
    },
  });

  const onSubmit = async (data: any) => {
    updateFormData(data);
    toast({ title: 'Loop Atlas configured successfully' });
    onNext();
  };

  const addBand = () => {
    const currentBands = form.getValues('bands') || [];
    form.setValue('bands', [
      ...currentBands,
      {
        indicator: '',
        lower_bound: 0,
        upper_bound: 1,
        asymmetry: 0,
        smoothing_alpha: 0.3,
        notes: '',
      },
    ]);
  };

  const removeBand = (index: number) => {
    const currentBands = form.getValues('bands') || [];
    form.setValue('bands', currentBands.filter((_, i) => i !== index));
  };

  const updateBand = (index: number, field: string, value: any) => {
    const currentBands = form.getValues('bands') || [];
    const updated = [...currentBands];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue('bands', updated);
  };

  const addKeyFeedback = () => {
    const currentFeedbacks = form.getValues('key_feedbacks') || [];
    form.setValue('key_feedbacks', [...currentFeedbacks, '']);
  };

  const removeKeyFeedback = (index: number) => {
    const currentFeedbacks = form.getValues('key_feedbacks') || [];
    form.setValue('key_feedbacks', currentFeedbacks.filter((_, i) => i !== index));
  };

  const updateKeyFeedback = (index: number, value: string) => {
    const currentFeedbacks = form.getValues('key_feedbacks') || [];
    const updated = [...currentFeedbacks];
    updated[index] = value;
    form.setValue('key_feedbacks', updated);
  };

  const addLeveragePoint = (classificationIndex: number) => {
    const currentClassifications = form.getValues('loop_classification') || [];
    const updated = [...currentClassifications];
    const currentPoints = updated[classificationIndex].leverage_points || [];
    updated[classificationIndex].leverage_points = [...currentPoints, ''];
    form.setValue('loop_classification', updated);
  };

  const removeLeveragePoint = (classificationIndex: number, pointIndex: number) => {
    const currentClassifications = form.getValues('loop_classification') || [];
    const updated = [...currentClassifications];
    updated[classificationIndex].leverage_points = updated[classificationIndex].leverage_points.filter((_, i) => i !== pointIndex);
    form.setValue('loop_classification', updated);
  };

  const updateLeveragePoint = (classificationIndex: number, pointIndex: number, value: string) => {
    const currentClassifications = form.getValues('loop_classification') || [];
    const updated = [...currentClassifications];
    updated[classificationIndex].leverage_points[pointIndex] = value;
    form.setValue('loop_classification', updated);
  };

  const bands = form.watch('bands') || [];
  const loop_classification = form.watch('loop_classification') || [];
  const key_feedbacks = form.watch('key_feedbacks') || [];
  const availableNodes = formData.nodes.map(node => node.label);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* System Purpose */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            System Purpose
          </CardTitle>
          <CardDescription>
            Define the fundamental purpose and intent of this system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="system_purpose">System Purpose *</Label>
            <Textarea
              id="system_purpose"
              {...form.register('system_purpose')}
              placeholder="What is the fundamental purpose this system serves? What outcomes is it designed to achieve?"
              rows={4}
            />
            {form.formState.errors.system_purpose && (
              <p className="text-sm text-destructive">{form.formState.errors.system_purpose.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loop Classifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Loop Classifications
          </CardTitle>
          <CardDescription>
            Identify reinforcing and balancing loops with their leverage points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loop_classification.map((classification, index) => (
            <Card key={index} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    Loop {index + 1}: {classification.loop_type === 'reinforcing' ? 'Reinforcing (R)' : 'Balancing (B)'}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeLoopClassification(index);
                      const current = form.getValues('loop_classification');
                      form.setValue('loop_classification', current.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>From Node</Label>
                    <Select 
                      onValueChange={(value) => {
                        updateLoopClassification(index, { from_node: value });
                        const current = form.getValues('loop_classification');
                        current[index].from_node = value;
                        form.setValue('loop_classification', current);
                      }} 
                      value={classification.from_node}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNodes.map((node) => (
                          <SelectItem key={node} value={node}>{node}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>To Node</Label>
                    <Select 
                      onValueChange={(value) => {
                        updateLoopClassification(index, { to_node: value });
                        const current = form.getValues('loop_classification');
                        current[index].to_node = value;
                        form.setValue('loop_classification', current);
                      }} 
                      value={classification.to_node}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNodes.map((node) => (
                          <SelectItem key={node} value={node}>{node}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Loop Type</Label>
                    <Select 
                      onValueChange={(value: any) => {
                        updateLoopClassification(index, { loop_type: value });
                        const current = form.getValues('loop_classification');
                        current[index].loop_type = value;
                        form.setValue('loop_classification', current);
                      }} 
                      value={classification.loop_type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reinforcing">Reinforcing (R)</SelectItem>
                        <SelectItem value="balancing">Balancing (B)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={classification.description}
                    onChange={(e) => {
                      updateLoopClassification(index, { description: e.target.value });
                      const current = form.getValues('loop_classification');
                      current[index].description = e.target.value;
                      form.setValue('loop_classification', current);
                    }}
                    placeholder="Describe how this loop behaves and its impact on the system..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Leverage Points</Label>
                  <div className="space-y-2">
                    {(classification.leverage_points || []).map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-center gap-2">
                        <Input
                          value={point}
                          onChange={(e) => updateLeveragePoint(index, pointIndex, e.target.value)}
                          placeholder="Enter leverage point..."
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLeveragePoint(index, pointIndex)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLeveragePoint(index)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Leverage Point
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
              addLoopClassification();
              const current = form.getValues('loop_classification') || [];
              form.setValue('loop_classification', [
                ...current,
                {
                  from_node: '',
                  to_node: '',
                  loop_type: 'reinforcing' as const,
                  description: '',
                  leverage_points: [],
                },
              ]);
            }}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Loop Classification
          </Button>
        </CardContent>
      </Card>

      {/* Key Feedbacks */}
      <Card>
        <CardHeader>
          <CardTitle>Key System Feedbacks</CardTitle>
          <CardDescription>
            Identify the most important feedback mechanisms in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {key_feedbacks.map((feedback, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={feedback}
                onChange={(e) => updateKeyFeedback(index, e.target.value)}
                placeholder="Describe a key feedback mechanism..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeKeyFeedback(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addKeyFeedback}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Key Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Adaptive Bands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Adaptive Bands
          </CardTitle>
          <CardDescription>
            Configure monitoring bands for system indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bands.map((band, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Band {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBand(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Indicator</Label>
                    <Select 
                      onValueChange={(value) => updateBand(index, 'indicator', value)} 
                      value={band.indicator}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select indicator" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.indicators.map((indicator) => (
                          <SelectItem key={indicator.indicator_key} value={indicator.indicator_key}>
                            {indicator.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Smoothing Alpha</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={band.smoothing_alpha}
                      onChange={(e) => updateBand(index, 'smoothing_alpha', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Lower Bound</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={band.lower_bound}
                      onChange={(e) => updateBand(index, 'lower_bound', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Upper Bound</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={band.upper_bound}
                      onChange={(e) => updateBand(index, 'upper_bound', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Asymmetry</Label>
                    <Input
                      type="number"
                      min="-1"
                      max="1"
                      step="0.1"
                      value={band.asymmetry}
                      onChange={(e) => updateBand(index, 'asymmetry', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={band.notes}
                    onChange={(e) => updateBand(index, 'notes', e.target.value)}
                    placeholder="Additional notes about this band..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addBand}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Adaptive Band
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <GitBranch className="w-4 h-4" />
        <AlertDescription>
          The Loop Atlas identifies key system feedbacks and leverage points for intervention. 
          Focus on the most critical loops that drive system behavior.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit">
          Next: Modules & Experiments
        </Button>
      </div>
    </form>
  );
};