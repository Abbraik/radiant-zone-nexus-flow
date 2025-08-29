import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { bandsSchema } from '@/lib/validation/loop-wizard';
import { toast } from '@/hooks/use-toast';

interface BandsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const BandsStep: React.FC<BandsStepProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useLoopWizardStore();

  const form = useForm({
    resolver: zodResolver(bandsSchema),
    defaultValues: {
      bands: formData.bands,
    },
  });

  const bands = form.watch('bands') || [];

  // Generate bands for each indicator if none exist
  React.useEffect(() => {
    if (bands.length === 0 && formData.indicators.length > 0) {
      const generatedBands = formData.indicators.map(indicator => ({
        indicator: indicator.indicator_key,
        lower_bound: 0,
        upper_bound: 100,
        asymmetry: 0,
        smoothing_alpha: 0.3,
        notes: '',
      }));
      form.setValue('bands', generatedBands);
    }
  }, [formData.indicators, bands.length, form]);

  const addBand = () => {
    const newBand = {
      indicator: '',
      lower_bound: 0,
      upper_bound: 100,
      asymmetry: 0,
      smoothing_alpha: 0.3,
      notes: '',
    };
    form.setValue('bands', [...bands, newBand]);
  };

  const removeBand = (index: number) => {
    const updatedBands = bands.filter((_: any, i: number) => i !== index);
    form.setValue('bands', updatedBands);
  };

  const updateBand = (index: number, field: string, value: any) => {
    const updatedBands = bands.map((band: any, i: number) =>
      i === index ? { ...band, [field]: value } : band
    );
    form.setValue('bands', updatedBands);
  };

  const onSubmit = (data: any) => {
    updateFormData(data);
    toast({
      title: 'Step completed',
      description: `${data.bands.length} adaptive bands configured.`,
    });
    onNext();
  };

  const availableIndicators = formData.indicators.map(ind => ind.indicator_key);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Adaptive Bands</CardTitle>
              <Button 
                type="button" 
                onClick={addBand}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Band</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure monitoring bands for your indicators to detect when values are outside normal ranges
            </p>
          </CardHeader>
          <CardContent>
            {bands.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No adaptive bands configured yet.</p>
                <p className="text-sm">Bands will be automatically generated for your indicators, or you can add custom ones.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {bands.map((band: any, index: number) => (
                  <Card key={index} className="border-2">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Indicator *</label>
                          <Select 
                            value={band.indicator} 
                            onValueChange={(value) => updateBand(index, 'indicator', value)}
                          >
                            <SelectTrigger aria-label={`Band ${index + 1} indicator`}>
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
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeBand(index)}
                            aria-label={`Remove band ${index + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="text-sm font-medium">Lower Bound</label>
                          <Input
                            type="number"
                            step="any"
                            value={band.lower_bound}
                            onChange={(e) => updateBand(index, 'lower_bound', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            aria-label={`Band ${index + 1} lower bound`}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum acceptable value
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Upper Bound</label>
                          <Input
                            type="number"
                            step="any"
                            value={band.upper_bound}
                            onChange={(e) => updateBand(index, 'upper_bound', parseFloat(e.target.value) || 0)}
                            placeholder="100"
                            aria-label={`Band ${index + 1} upper bound`}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Maximum acceptable value
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="text-sm font-medium">Asymmetry</label>
                          <Input
                            type="number"
                            step="0.1"
                            min="-1"
                            max="1"
                            value={band.asymmetry}
                            onChange={(e) => updateBand(index, 'asymmetry', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            aria-label={`Band ${index + 1} asymmetry`}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Band asymmetry (-1 to 1, default 0)
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Smoothing α</label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="1"
                            value={band.smoothing_alpha}
                            onChange={(e) => updateBand(index, 'smoothing_alpha', parseFloat(e.target.value) || 0.3)}
                            placeholder="0.3"
                            aria-label={`Band ${index + 1} smoothing alpha`}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Smoothing factor (0 to 1, default 0.3)
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          value={band.notes}
                          onChange={(e) => updateBand(index, 'notes', e.target.value)}
                          placeholder="Additional notes about this band configuration..."
                          rows={2}
                          aria-label={`Band ${index + 1} notes`}
                        />
                      </div>

                      {/* Band Visualization */}
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Band Preview</h4>
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-destructive rounded-full"></div>
                            <span>Below: &lt; {band.lower_bound}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-success rounded-full"></div>
                            <span>Normal: {band.lower_bound} - {band.upper_bound}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-destructive rounded-full"></div>
                            <span>Above: &gt; {band.upper_bound}</span>
                          </div>
                        </div>
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
            <span>Next: Watchpoints & Triggers</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};