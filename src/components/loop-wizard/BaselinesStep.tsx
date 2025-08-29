import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { baselinesReflexMemorySchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface BaselinesStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const BaselinesStep: React.FC<BaselinesStepProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useLoopWizardStore();

  const form = useForm({
    resolver: zodResolver(baselinesReflexMemorySchema),
    defaultValues: {
      baselines: formData.baselines,
      reflex_memory: formData.reflex_memory,
      generate_paradigm_statement: formData.generate_paradigm_statement,
      generate_aggregate_dashboard: formData.generate_aggregate_dashboard,
      generate_loop_atlas: formData.generate_loop_atlas,
      generate_module_reports: formData.generate_module_reports,
      create_followup_task: formData.create_followup_task,
    },
  });

  const baselines = form.watch('baselines');
  const createFollowupTask = form.watch('create_followup_task');

  const onSubmit = (data: any) => {
    updateFormData(data);
    toast({
      title: 'Step completed',
      description: 'TRI baselines and publication settings configured.',
    });
    onNext();
  };

  const updateBaseline = (field: 'trust' | 'reciprocity' | 'integrity', value: number[]) => {
    form.setValue(`baselines.${field}`, value[0]);
  };

  const triAverage = (baselines.trust + baselines.reciprocity + baselines.integrity) / 3;
  const triHealth = triAverage >= 0.7 ? 'Excellent' : triAverage >= 0.5 ? 'Good' : triAverage >= 0.3 ? 'Fair' : 'Poor';
  const triColor = triAverage >= 0.7 ? 'text-green-600' : triAverage >= 0.5 ? 'text-blue-600' : triAverage >= 0.3 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* TRI Baselines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>TRI Baseline</span>
              <div className={`text-sm font-normal ${triColor}`}>
                ({triHealth} - {Math.round(triAverage * 100)}%)
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Set initial Trust, Reciprocity, and Integrity values for this loop
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                TRI values represent the social foundation of your loop. These baseline values will be used for initial monitoring and can be updated over time.
              </AlertDescription>
            </Alert>

            {/* Trust */}
            <FormField
              control={form.control}
              name="baselines.trust"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Trust</FormLabel>
                    <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        updateBaseline('trust', value);
                      }}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                      aria-label="Trust baseline value"
                    />
                  </FormControl>
                  <FormDescription>
                    Level of trust between actors in this loop (0-100%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reciprocity */}
            <FormField
              control={form.control}
              name="baselines.reciprocity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Reciprocity</FormLabel>
                    <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        updateBaseline('reciprocity', value);
                      }}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                      aria-label="Reciprocity baseline value"
                    />
                  </FormControl>
                  <FormDescription>
                    Level of mutual exchange and cooperation (0-100%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Integrity */}
            <FormField
              control={form.control}
              name="baselines.integrity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Integrity</FormLabel>
                    <span className="text-sm font-medium">{(field.value * 100).toFixed(0)}%</span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                        updateBaseline('integrity', value);  
                      }}
                      max={1}
                      min={0}
                      step={0.01}
                      className="w-full"
                      aria-label="Integrity baseline value"
                    />
                  </FormControl>
                  <FormDescription>
                    Level of consistency and reliability (0-100%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TRI Health Indicator */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall TRI Health</span>
                <span className={`text-sm font-medium ${triColor}`}>{triHealth}</span>
              </div>
              <Progress value={triAverage * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Average of Trust, Reciprocity, and Integrity values
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reflex Memory */}
        <Card>
          <CardHeader>
            <CardTitle>Reflex Memory</CardTitle>
            <p className="text-sm text-muted-foreground">
              Document why this loop exists and its doctrinal foundation
            </p>
          </CardHeader>
          <CardContent>
          {/* Enhanced Reflex Memory fields are now handled in the new RRE sections above */}
          </CardContent>
        </Card>

        {/* Follow-up Task */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Actions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure what happens after loop creation
            </p>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="create_followup_task"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Create Follow-up Task</FormLabel>
                    <FormDescription>
                      Generate a task for initial monitoring and review (due in 7 days)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Create follow-up task"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {createFollowupTask && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  A task titled "Initial monitoring & review" will be created in the responsive capacity, due in 7 days. This will help ensure proper loop monitoring setup.
                </AlertDescription>
              </Alert>
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
            <span>Next: Review & Create</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};