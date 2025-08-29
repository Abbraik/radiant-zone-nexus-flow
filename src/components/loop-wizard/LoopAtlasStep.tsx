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
import { Plus, X, Minus, Target, GitBranch, Settings, ArrowRight, Link, Users } from 'lucide-react';
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
      cascades: formData.cascades,
      shared_node_links: formData.shared_node_links,
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
  const cascades = form.watch('cascades') || [];
  const shared_node_links = form.watch('shared_node_links') || [];
  const availableNodes = formData.nodes.map(node => node.label);

  // Mock data for cascades and shared nodes (replace with real data)
  const availableLoops = [
    { id: 'loop-1', name: 'Urban Planning Loop', code: 'UPL-01' },
    { id: 'loop-2', name: 'Traffic Management Loop', code: 'TML-01' },
    { id: 'loop-3', name: 'Energy Distribution Loop', code: 'EDL-01' },
  ];

  const availableSharedNodes = [
    { id: 'snl-1', label: 'City Council', domain: 'institution' },
    { id: 'snl-2', label: 'Population Growth', domain: 'population' },
    { id: 'snl-3', label: 'Budget Allocation', domain: 'resource' },
    { id: 'snl-4', label: 'Public Transport', domain: 'product' },
    { id: 'snl-5', label: 'Community Engagement', domain: 'social' },
  ];

  const addCascade = () => {
    const currentCascades = form.getValues('cascades') || [];
    form.setValue('cascades', [
      ...currentCascades,
      {
        to_loop_id: '',
        relation: 'drives' as const,
        note: '',
      },
    ]);
  };

  const removeCascade = (index: number) => {
    const currentCascades = form.getValues('cascades') || [];
    form.setValue('cascades', currentCascades.filter((_, i) => i !== index));
  };

  const updateCascade = (index: number, field: string, value: any) => {
    const currentCascades = form.getValues('cascades') || [];
    const updated = [...currentCascades];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue('cascades', updated);
  };

  const addSharedNodeLink = () => {
    const currentLinks = form.getValues('shared_node_links') || [];
    form.setValue('shared_node_links', [
      ...currentLinks,
      {
        snl_id: '',
        role: 'actor' as const,
        note: '',
      },
    ]);
  };

  const removeSharedNodeLink = (index: number) => {
    const currentLinks = form.getValues('shared_node_links') || [];
    form.setValue('shared_node_links', currentLinks.filter((_, i) => i !== index));
  };

  const updateSharedNodeLink = (index: number, field: string, value: any) => {
    const currentLinks = form.getValues('shared_node_links') || [];
    const updated = [...currentLinks];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue('shared_node_links', updated);
  };

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

      {/* Loop Cascades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Loop Cascades
          </CardTitle>
          <CardDescription>
            Define relationships with other loops in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cascades.map((cascade, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Cascade {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCascade(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Loop</Label>
                    <Select 
                      onValueChange={(value) => updateCascade(index, 'to_loop_id', value)} 
                      value={cascade.to_loop_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select target loop" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLoops.map((loop) => (
                          <SelectItem key={loop.id} value={loop.id}>
                            {loop.name} ({loop.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Relation</Label>
                    <Select 
                      onValueChange={(value) => updateCascade(index, 'relation', value)} 
                      value={cascade.relation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drives">Drives - Direct causal influence</SelectItem>
                        <SelectItem value="influences">Influences - Indirect effect</SelectItem>
                        <SelectItem value="constrains">Constrains - Limits or bounds</SelectItem>
                        <SelectItem value="enables">Enables - Facilitates or allows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Note</Label>
                  <Textarea
                    value={cascade.note || ''}
                    onChange={(e) => updateCascade(index, 'note', e.target.value)}
                    placeholder="Describe the cascade relationship..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addCascade}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Loop Cascade
          </Button>
        </CardContent>
      </Card>

      {/* Shared Node Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Shared Node Links
          </CardTitle>
          <CardDescription>
            Link to shared nodes in the system library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {shared_node_links.map((link, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Shared Node {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSharedNodeLink(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shared Node</Label>
                    <Select 
                      onValueChange={(value) => updateSharedNodeLink(index, 'snl_id', value)} 
                      value={link.snl_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shared node" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSharedNodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.label} ({node.domain})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select 
                      onValueChange={(value) => updateSharedNodeLink(index, 'role', value)} 
                      value={link.role}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="actor">Actor - Active participant</SelectItem>
                        <SelectItem value="system">System - System component</SelectItem>
                        <SelectItem value="bottleneck">Bottleneck - Constraint point</SelectItem>
                        <SelectItem value="beneficiary">Beneficiary - Outcome recipient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Note</Label>
                  <Textarea
                    value={link.note || ''}
                    onChange={(e) => updateSharedNodeLink(index, 'note', e.target.value)}
                    placeholder="Describe the shared node relationship..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSharedNodeLink}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shared Node Link
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
        <Target className="w-4 h-4" />
        <AlertDescription>
          The Loop Atlas integrates your loop with the broader system registry through cascades and shared nodes. 
          This enables system-level analysis and cross-loop coordination for comprehensive governance.
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