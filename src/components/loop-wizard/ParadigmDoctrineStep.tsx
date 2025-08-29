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
import { Plus, X, Lightbulb, Globe, BookOpen, Hash, Target, Layers } from 'lucide-react';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { paradigmDoctrineSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface ParadigmDoctrineStepProps {
  onNext: () => void;
}

export const ParadigmDoctrineStep: React.FC<ParadigmDoctrineStepProps> = ({ onNext }) => {
  const { formData, updateFormData } = useLoopWizardStore();
  
  const form = useForm({
    resolver: zodResolver(paradigmDoctrineSchema),
    defaultValues: {
      name: formData.name,
      loop_code: formData.loop_code,
      description: formData.description,
      synopsis: formData.synopsis,
      type: formData.type,
      scale: formData.scale,
      domain: formData.domain,
      layer: formData.layer,
      motif: formData.motif,
      default_leverage: formData.default_leverage,
      tags: formData.tags,
      doctrine_reference: formData.doctrine_reference,
      worldview: formData.worldview,
      paradigm_statement: formData.paradigm_statement,
      coherence_principles: formData.coherence_principles,
      cas_assumptions: formData.cas_assumptions,
    },
  });

  const onSubmit = async (data: any) => {
    updateFormData(data);
    toast({ title: 'Paradigm & Doctrine configured successfully' });
    onNext();
  };

  const addCoherencePrinciple = () => {
    const currentPrinciples = form.getValues('coherence_principles') || [];
    form.setValue('coherence_principles', [...currentPrinciples, '']);
  };

  const removeCoherencePrinciple = (index: number) => {
    const currentPrinciples = form.getValues('coherence_principles') || [];
    form.setValue('coherence_principles', currentPrinciples.filter((_, i) => i !== index));
  };

  const updateCoherencePrinciple = (index: number, value: string) => {
    const currentPrinciples = form.getValues('coherence_principles') || [];
    const updated = [...currentPrinciples];
    updated[index] = value;
    form.setValue('coherence_principles', updated);
  };

  const coherencePrinciples = form.watch('coherence_principles') || [];
  const worldview = form.watch('worldview');
  const tags = form.watch('tags') || [];

  const addTag = () => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', [...currentTags, '']);
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const currentTags = form.getValues('tags') || [];
    const updated = [...currentTags];
    updated[index] = value;
    form.setValue('tags', updated);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Core loop identification and metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Loop Name *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="e.g., Urban Heat Mitigation Loop"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="loop_code">Loop Code *</Label>
              <Input
                id="loop_code"
                {...form.register('loop_code')}
                placeholder="e.g., UHM-L01"
                className="font-mono"
              />
              {form.formState.errors.loop_code && (
                <p className="text-sm text-destructive">{form.formState.errors.loop_code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe the loop's scope and purpose..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea
              id="synopsis"
              {...form.register('synopsis')}
              placeholder="Brief summary for registry display..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Loop Type *</Label>
              <Select onValueChange={(value: any) => form.setValue('type', value)} value={form.watch('type')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reactive">Reactive</SelectItem>
                  <SelectItem value="perceptual">Perceptual</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scale">Scale *</Label>
              <Select onValueChange={(value: any) => form.setValue('scale', value)} value={form.watch('scale')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="meso">Meso</SelectItem>
                  <SelectItem value="macro">Macro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="layer">Layer *</Label>
              <Select onValueChange={(value: any) => form.setValue('layer', value)} value={form.watch('layer')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select layer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meta">Meta - System governance and coordination</SelectItem>
                  <SelectItem value="macro">Macro - Strategic system-wide patterns</SelectItem>
                  <SelectItem value="meso">Meso - Intermediate organizational structures</SelectItem>
                  <SelectItem value="micro">Micro - Individual operational processes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain *</Label>
            <Input
              id="domain"
              {...form.register('domain')}
              placeholder="e.g., urban planning, healthcare"
            />
          </div>
        </CardContent>
      </Card>

      {/* Registry Classification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Registry Classification
          </CardTitle>
          <CardDescription>
            Classify loop behavior patterns and leverage points for registry integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motif">System Motif *</Label>
              <Select onValueChange={(value: any) => form.setValue('motif', value)} value={form.watch('motif')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select motif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B">B - Balancing (Self-correcting equilibrium)</SelectItem>
                  <SelectItem value="R">R - Reinforcing (Self-amplifying patterns)</SelectItem>
                  <SelectItem value="N">N - Saturation/Nonlinear (Capacity limits)</SelectItem>
                  <SelectItem value="C">C - Constraint/Bottleneck (System restrictions)</SelectItem>
                  <SelectItem value="T">T - Transport/Delay (Time delays & flow)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default_leverage">Default Leverage *</Label>
              <Select onValueChange={(value: any) => form.setValue('default_leverage', value)} value={form.watch('default_leverage')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leverage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N">N - Narrative (Stories, beliefs, mental models)</SelectItem>
                  <SelectItem value="P">P - Policy (Rules, procedures, structures)</SelectItem>
                  <SelectItem value="S">S - Structure (Physical systems, infrastructure)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    placeholder="Enter tag..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTag(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Tag
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RRE Paradigm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            RRE Paradigm
          </CardTitle>
          <CardDescription>
            Define the worldview and paradigm for knowledge production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="worldview">Worldview *</Label>
            <Select onValueChange={(value: any) => form.setValue('worldview', value)} value={worldview}>
              <SelectTrigger>
                <SelectValue placeholder="Select worldview" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cas">Complex Adaptive Systems (CAS)</SelectItem>
                <SelectItem value="coherence">Coherence-based</SelectItem>
                <SelectItem value="systems">Systems Thinking</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paradigm_statement">Paradigm Statement *</Label>
            <Textarea
              id="paradigm_statement"
              {...form.register('paradigm_statement')}
              placeholder="Define your paradigm for understanding this system..."
              rows={4}
            />
            {form.formState.errors.paradigm_statement && (
              <p className="text-sm text-destructive">{form.formState.errors.paradigm_statement.message}</p>
            )}
          </div>

          {worldview === 'cas' && (
            <div className="space-y-2">
              <Label htmlFor="cas_assumptions">CAS Assumptions</Label>
              <Textarea
                id="cas_assumptions"
                {...form.register('cas_assumptions')}
                placeholder="What are your key assumptions about this system as a complex adaptive system?"
                rows={3}
              />
            </div>
          )}

          {worldview === 'coherence' && (
            <div className="space-y-2">
              <Label>Coherence Principles</Label>
              <div className="space-y-2">
                {coherencePrinciples.map((principle, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={principle}
                      onChange={(e) => updateCoherencePrinciple(index, e.target.value)}
                      placeholder="Enter coherence principle..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCoherencePrinciple(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCoherencePrinciple}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Coherence Principle
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctrine Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Doctrine Reference
          </CardTitle>
          <CardDescription>
            Link to relevant doctrine or methodological framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="doctrine_reference">Doctrine Reference</Label>
            <Textarea
              id="doctrine_reference"
              {...form.register('doctrine_reference')}
              placeholder="Reference to relevant doctrine, framework, or methodology..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Lightbulb className="w-4 h-4" />
        <AlertDescription>
          The RRE Paradigm defines how knowledge will be produced and validated in this loop. 
          It ensures that evidence-based learning is grounded in a clear worldview and methodology.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button type="submit">
          Next: Aggregates & Indicators
        </Button>
      </div>
    </form>
  );
};