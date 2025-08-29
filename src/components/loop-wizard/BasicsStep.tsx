import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useLoopWizardStore } from '@/stores/useLoopWizardStore';
import { basicsSchema } from '@/lib/validation/loop-wizard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BasicsStepProps {
  onNext: () => void;
}

export const BasicsStep: React.FC<BasicsStepProps> = ({ onNext }) => {
  const { formData, updateFormData, setError, clearError } = useLoopWizardStore();

  const form = useForm({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      name: formData.name,
      loop_code: formData.loop_code,
      description: formData.description,
      type: formData.type,
      scale: formData.scale,
      domain: formData.domain,
      layer: formData.layer,
      doctrine_reference: formData.doctrine_reference,
    },
  });

  const checkLoopCodeUniqueness = async (loopCode: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('loops')
        .select('loop_code')
        .eq('loop_code', loopCode)
        .maybeSingle();

      if (error) {
        console.error('Error checking loop code uniqueness:', error);
        return false;
      }

      return !data; // Return true if no loop with this code exists
    } catch (error) {
      console.error('Error checking loop code uniqueness:', error);
      return false;
    }
  };

  const onSubmit = async (data: any) => {
    try {
      clearError('loop_code');

      // Check loop code uniqueness
      const isUnique = await checkLoopCodeUniqueness(data.loop_code);
      if (!isUnique) {
        setError('loop_code', 'Loop code already exists. Please choose a different code.');
        form.setError('loop_code', { 
          type: 'manual', 
          message: 'Loop code already exists. Please choose a different code.' 
        });
        return;
      }

      // Update form data and proceed
      updateFormData(data);
      toast({
        title: 'Step completed',
        description: 'Basics & doctrine information saved.',
      });
      onNext();
    } catch (error) {
      console.error('Error validating basics step:', error);
      toast({
        title: 'Validation error',
        description: 'Failed to validate loop code uniqueness. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loop Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loop Name *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Housing Cohesion Loop"
                    aria-describedby="name-description"
                  />
                </FormControl>
                <FormDescription id="name-description">
                  A descriptive name for your loop
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Loop Code */}
          <FormField
            control={form.control}
            name="loop_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loop Code *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="LOOP-HOUSING-01"
                    aria-describedby="loop_code-description"
                    style={{ textTransform: 'uppercase' }}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  />
                </FormControl>
                <FormDescription id="loop_code-description">
                  Unique identifier (A-Z, 0-9, hyphens, underscores only)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe the purpose and scope of this loop..."
                  rows={3}
                  aria-describedby="description-description"
                />
              </FormControl>
              <FormDescription id="description-description">
                Optional detailed description of the loop
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Loop Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loop Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger aria-describedby="type-description">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reactive">Reactive</SelectItem>
                    <SelectItem value="perceptual">Perceptual</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription id="type-description">
                  The fundamental type of this loop
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scale */}
          <FormField
            control={form.control}
            name="scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scale *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger aria-describedby="scale-description">
                      <SelectValue placeholder="Select scale" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="micro">Micro</SelectItem>
                    <SelectItem value="meso">Meso</SelectItem>
                    <SelectItem value="macro">Macro</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription id="scale-description">
                  The operational scale of this loop
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Domain */}
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Housing"
                    aria-describedby="domain-description"
                  />
                </FormControl>
                <FormDescription id="domain-description">
                  The domain or sector this loop operates in
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Layer */}
          <FormField
            control={form.control}
            name="layer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Layer *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Policy"
                    aria-describedby="layer-description"
                  />
                </FormControl>
                <FormDescription id="layer-description">
                  The systemic layer (e.g., Policy, Operations, Culture)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Doctrine Reference */}
          <FormField
            control={form.control}
            name="doctrine_reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctrine Reference</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://doctrine.example.com/housing or HUB-REF-001"
                    aria-describedby="doctrine-description"
                  />
                </FormControl>
                <FormDescription id="doctrine-description">
                  Optional URL or internal hub key for doctrine reference
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="flex items-center space-x-2">
            <span>Next: Indicators</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};