import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Plus, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { indicatorsSourcesSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface IndicatorsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const IndicatorsStep: React.FC<IndicatorsStepProps> = ({ onNext, onPrevious }) => {
  const { 
    formData, 
    updateFormData, 
    addIndicator, 
    removeIndicator, 
    updateIndicator,
    addSource,
    removeSource,
    updateSource
  } = useLoopWizardStore();

  const [selectedIndicatorIndex, setSelectedIndicatorIndex] = useState<number | null>(null);

  const form = useForm({
    resolver: zodResolver(indicatorsSourcesSchema),
    defaultValues: {
      indicators: formData.indicators,
      sources: formData.sources,
    },
  });

  const onSubmit = (data: any) => {
    updateFormData(data);
    toast({
      title: 'Step completed',
      description: `${data.indicators.length} indicators and ${data.sources.length} sources saved.`,
    });
    onNext();
  };

  const handleAddIndicator = () => {
    addIndicator();
    // Update form with new indicator
    const newIndicators = [...form.getValues('indicators'), {
      indicator_key: '',
      title: '',
      unit: '',
      triad_tag: 'population' as const,
      notes: '',
    }];
    form.setValue('indicators', newIndicators);
  };

  const handleRemoveIndicator = (index: number) => {
    removeIndicator(index);
    const updatedIndicators = form.getValues('indicators').filter((_: any, i: number) => i !== index);
    form.setValue('indicators', updatedIndicators);
  };

  const handleIndicatorChange = (index: number, field: string, value: any) => {
    const indicators = form.getValues('indicators');
    indicators[index] = { ...indicators[index], [field]: value };
    form.setValue('indicators', indicators);
    updateIndicator(index, { [field]: value });
  };

  const handleAddSource = () => {
    addSource();
    const newSources = [...form.getValues('sources'), {
      name: '',
      type: 'pull' as const,
      provider: '',
      schedule_cron: '0 6 * * *',
      schema_version: 1,
      enabled: true,
      pii_class: 'none' as const,
      config: {},
    }];
    form.setValue('sources', newSources);
  };

  const handleRemoveSource = (index: number) => {
    removeSource(index);
    const updatedSources = form.getValues('sources').filter((_: any, i: number) => i !== index);
    form.setValue('sources', updatedSources);
  };

  const handleSourceChange = (index: number, field: string, value: any) => {
    const sources = form.getValues('sources');
    sources[index] = { ...sources[index], [field]: value };
    form.setValue('sources', sources);
    updateSource(index, { [field]: value });
  };

  const indicators = form.watch('indicators');
  const sources = form.watch('sources') || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Indicators Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Indicators</CardTitle>
              <Button 
                type="button" 
                onClick={handleAddIndicator}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Indicator</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Define the key indicators this loop will monitor
            </p>
          </CardHeader>
          <CardContent>
            {indicators.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No indicators defined yet. Add your first indicator to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {indicators.map((indicator: any, index: number) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium">Indicator Key *</label>
                          <Input
                            value={indicator.indicator_key}
                            onChange={(e) => handleIndicatorChange(index, 'indicator_key', e.target.value)}
                            placeholder="rent_to_income"
                            aria-label={`Indicator ${index + 1} key`}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Title *</label>
                          <Input
                            value={indicator.title}
                            onChange={(e) => handleIndicatorChange(index, 'title', e.target.value)}
                            placeholder="Rent-to-Income Ratio"
                            aria-label={`Indicator ${index + 1} title`}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Unit *</label>
                          <Input
                            value={indicator.unit}
                            onChange={(e) => handleIndicatorChange(index, 'unit', e.target.value)}
                            placeholder="%"
                            aria-label={`Indicator ${index + 1} unit`}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">TRI Tag *</label>
                          <Select 
                            value={indicator.triad_tag} 
                            onValueChange={(value) => handleIndicatorChange(index, 'triad_tag', value)}
                          >
                            <SelectTrigger aria-label={`Indicator ${index + 1} TRI tag`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="population">Population</SelectItem>
                              <SelectItem value="domain">Domain</SelectItem>
                              <SelectItem value="institution">Institution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          value={indicator.notes}
                          onChange={(e) => handleIndicatorChange(index, 'notes', e.target.value)}
                          placeholder="Additional notes about this indicator..."
                          rows={2}
                          aria-label={`Indicator ${index + 1} notes`}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedIndicatorIndex(index)}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Configure Sources
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>
                                Sources for {indicator.title || `Indicator ${index + 1}`}
                              </DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4">
                              <p className="text-sm text-muted-foreground mb-4">
                                Configure data sources for this indicator in the Sources section below.
                              </p>
                            </div>
                          </DrawerContent>
                        </Drawer>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveIndicator(index)}
                          aria-label={`Remove indicator ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sources Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Data Sources</CardTitle>
              <Button 
                type="button" 
                onClick={handleAddSource}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Source</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure data sources that will feed your indicators
            </p>
          </CardHeader>
          <CardContent>
            {sources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No data sources configured yet. Sources are optional but recommended.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sources.map((source: any, index: number) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Name *</label>
                          <Input
                            value={source.name}
                            onChange={(e) => handleSourceChange(index, 'name', e.target.value)}
                            placeholder="Stats Bureau Housing"
                            aria-label={`Source ${index + 1} name`}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Type *</label>
                          <Select 
                            value={source.type} 
                            onValueChange={(value) => handleSourceChange(index, 'type', value)}
                          >
                            <SelectTrigger aria-label={`Source ${index + 1} type`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pull">Pull</SelectItem>
                              <SelectItem value="push">Push</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Provider *</label>
                          <Input
                            value={source.provider}
                            onChange={(e) => handleSourceChange(index, 'provider', e.target.value)}
                            placeholder="s3"
                            aria-label={`Source ${index + 1} provider`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="text-sm font-medium">Schedule (Cron)</label>
                          <Input
                            value={source.schedule_cron}
                            onChange={(e) => handleSourceChange(index, 'schedule_cron', e.target.value)}
                            placeholder="0 6 * * *"
                            aria-label={`Source ${index + 1} schedule`}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">PII Class</label>
                          <Select 
                            value={source.pii_class} 
                            onValueChange={(value) => handleSourceChange(index, 'pii_class', value)}
                          >
                            <SelectTrigger aria-label={`Source ${index + 1} PII class`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="restricted">Restricted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={source.enabled}
                            onCheckedChange={(checked) => handleSourceChange(index, 'enabled', checked)}
                            aria-label={`Enable source ${index + 1}`}
                          />
                          <label className="text-sm font-medium">Enabled</label>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveSource(index)}
                          aria-label={`Remove source ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <Button type="submit" className="flex items-center space-x-2">
            <span>Next: Loop Structure</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};