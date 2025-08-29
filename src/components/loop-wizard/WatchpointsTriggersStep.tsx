import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Plus, Trash2, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { watchpointsTriggersSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface WatchpointsTriggersStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const WatchpointsTriggersStep: React.FC<WatchpointsTriggersStepProps> = ({ onNext, onPrevious }) => {
  const { 
    formData, 
    updateFormData,
    addWatchpoint,
    removeWatchpoint,
    updateWatchpoint,
    addTrigger,
    removeTrigger,
    updateTrigger
  } = useLoopWizardStore();

  const form = useForm({
    resolver: zodResolver(watchpointsTriggersSchema),
    defaultValues: {
      watchpoints: formData.watchpoints,
      triggers: formData.triggers,
    },
  });

  const watchpoints = form.watch('watchpoints') || [];
  const triggers = form.watch('triggers') || [];

  const handleAddWatchpoint = () => {
    addWatchpoint();
    const newWatchpoints = [...form.getValues('watchpoints'), {
      indicator: '',
      direction: 'up' as const,
      threshold_value: 0,
      threshold_band: null,
      armed: true,
    }];
    form.setValue('watchpoints', newWatchpoints);
  };

  const handleRemoveWatchpoint = (index: number) => {
    removeWatchpoint(index);
    const updatedWatchpoints = form.getValues('watchpoints').filter((_: any, i: number) => i !== index);
    form.setValue('watchpoints', updatedWatchpoints);
  };

  const handleWatchpointChange = (index: number, field: string, value: any) => {
    const watchpoints = form.getValues('watchpoints');
    watchpoints[index] = { ...watchpoints[index], [field]: value };
    form.setValue('watchpoints', watchpoints);
    updateWatchpoint(index, { [field]: value });
  };

  const handleAddTrigger = () => {
    addTrigger();
    const newTriggers = [...form.getValues('triggers'), {
      name: '',
      condition: '',
      threshold: 0,
      window_hours: 24,
      action_ref: '',
      authority: '',
      consent_note: '',
      valid_from: 'now',
      expires_at: 'in_180d',
    }];
    form.setValue('triggers', newTriggers);
  };

  const handleRemoveTrigger = (index: number) => {
    removeTrigger(index);
    const updatedTriggers = form.getValues('triggers').filter((_: any, i: number) => i !== index);
    form.setValue('triggers', updatedTriggers);
  };

  const handleTriggerChange = (index: number, field: string, value: any) => {
    const triggers = form.getValues('triggers');
    triggers[index] = { ...triggers[index], [field]: value };
    form.setValue('triggers', triggers);
    updateTrigger(index, { [field]: value });
  };

  const onSubmit = (data: any) => {
    updateFormData(data);
    toast({
      title: 'Step completed',
      description: `${data.watchpoints.length} watchpoints and ${data.triggers.length} triggers configured.`,
    });
    onNext();
  };

  const availableIndicators = formData.indicators.map(ind => ind.indicator_key);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="watchpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="watchpoints" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Watchpoints</span>
              <Badge variant="secondary">{watchpoints.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="triggers" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Triggers</span>
              <Badge variant="secondary">{triggers.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="watchpoints">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Watchpoints</CardTitle>
                  <Button 
                    type="button" 
                    onClick={handleAddWatchpoint}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Watchpoint</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor specific indicators and get notified when they exceed thresholds
                </p>
              </CardHeader>
              <CardContent>
                {watchpoints.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No watchpoints configured yet.</p>
                    <p className="text-sm">Add watchpoints to monitor your indicators for threshold breaches.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {watchpoints.map((watchpoint: any, index: number) => (
                      <Card key={index} className="border-2">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Indicator *</label>
                              <Select 
                                value={watchpoint.indicator} 
                                onValueChange={(value) => handleWatchpointChange(index, 'indicator', value)}
                              >
                                <SelectTrigger aria-label={`Watchpoint ${index + 1} indicator`}>
                                  <SelectValue placeholder="Select indicator" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableIndicators.map((indicator) => (
                                    <SelectItem key={indicator} value={indicator}>
                                      {indicator}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Direction *</label>
                              <Select 
                                value={watchpoint.direction} 
                                onValueChange={(value) => handleWatchpointChange(index, 'direction', value)}
                              >
                                <SelectTrigger aria-label={`Watchpoint ${index + 1} direction`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="up">Above Threshold</SelectItem>
                                  <SelectItem value="down">Below Threshold</SelectItem>
                                  <SelectItem value="band">Outside Band</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Threshold Value</label>
                              <Input
                                type="number"
                                step="any"
                                value={watchpoint.threshold_value || ''}
                                onChange={(e) => handleWatchpointChange(index, 'threshold_value', parseFloat(e.target.value) || null)}
                                placeholder="35"
                                aria-label={`Watchpoint ${index + 1} threshold value`}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={watchpoint.armed}
                                onCheckedChange={(checked) => handleWatchpointChange(index, 'armed', checked)}
                                aria-label={`Enable watchpoint ${index + 1}`}
                              />
                              <label className="text-sm font-medium">
                                Armed {watchpoint.armed ? '(Active)' : '(Disabled)'}
                              </label>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveWatchpoint(index)}
                              aria-label={`Remove watchpoint ${index + 1}`}
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
          </TabsContent>

          <TabsContent value="triggers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Triggers</CardTitle>
                  <Button 
                    type="button" 
                    onClick={handleAddTrigger}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Trigger</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Define automated responses when specific conditions are met
                </p>
              </CardHeader>
              <CardContent>
                {triggers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No triggers configured yet.</p>
                    <p className="text-sm">Add triggers to automate responses to specific conditions.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {triggers.map((trigger: any, index: number) => (
                      <Card key={index} className="border-2">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Name *</label>
                              <Input
                                value={trigger.name}
                                onChange={(e) => handleTriggerChange(index, 'name', e.target.value)}
                                placeholder="Rent Pressure Alert"
                                aria-label={`Trigger ${index + 1} name`}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Authority *</label>
                              <Input
                                value={trigger.authority}
                                onChange={(e) => handleTriggerChange(index, 'authority', e.target.value)}
                                placeholder="PFS Analyst"
                                aria-label={`Trigger ${index + 1} authority`}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="text-sm font-medium">Condition *</label>
                            <Input
                              value={trigger.condition}
                              onChange={(e) => handleTriggerChange(index, 'condition', e.target.value)}
                              placeholder="avg(rent_to_income, 14d) > 35"
                              aria-label={`Trigger ${index + 1} condition`}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              DSL condition string (e.g., avg(indicator, 14d) > threshold)
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <label className="text-sm font-medium">Threshold</label>
                              <Input
                                type="number"
                                step="any"
                                value={trigger.threshold}
                                onChange={(e) => handleTriggerChange(index, 'threshold', parseFloat(e.target.value) || 0)}
                                placeholder="35"
                                aria-label={`Trigger ${index + 1} threshold`}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Window Hours *</label>
                              <Input
                                type="number"
                                min="1"
                                value={trigger.window_hours}
                                onChange={(e) => handleTriggerChange(index, 'window_hours', parseInt(e.target.value) || 24)}
                                placeholder="24"
                                aria-label={`Trigger ${index + 1} window hours`}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Action Reference *</label>
                              <Input
                                value={trigger.action_ref}
                                onChange={(e) => handleTriggerChange(index, 'action_ref', e.target.value)}
                                placeholder="open:responsive.monitor"
                                aria-label={`Trigger ${index + 1} action reference`}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="text-sm font-medium">Consent Note</label>
                            <Textarea
                              value={trigger.consent_note}
                              onChange={(e) => handleTriggerChange(index, 'consent_note', e.target.value)}
                              placeholder="Monitoring only - no automatic actions"
                              rows={2}
                              aria-label={`Trigger ${index + 1} consent note`}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="text-sm font-medium">Valid From</label>
                              <Select 
                                value={trigger.valid_from} 
                                onValueChange={(value) => handleTriggerChange(index, 'valid_from', value)}
                              >
                                <SelectTrigger aria-label={`Trigger ${index + 1} valid from`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="now">Now</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Expires At</label>
                              <Select 
                                value={trigger.expires_at} 
                                onValueChange={(value) => handleTriggerChange(index, 'expires_at', value)}
                              >
                                <SelectTrigger aria-label={`Trigger ${index + 1} expires at`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in_180d">In 180 days</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-end mt-4">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveTrigger(index)}
                              aria-label={`Remove trigger ${index + 1}`}
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
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPrevious} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          <Button type="submit" className="flex items-center space-x-2">
            <span>Next: Baselines</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};