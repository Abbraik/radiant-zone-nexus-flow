import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { seedSampleLoops } from '@/utils/seedSampleLoops';
import { Loader2, Database } from 'lucide-react';

export const SeedLoopsButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedSampleLoops();
      if (result.success) {
        toast({
          title: 'Sample Data Created',
          description: `Successfully created ${result.count} sample loops!`,
        });
        // Refresh the page to show new data
        window.location.reload();
      } else {
        toast({
          title: 'Seeding Failed',
          description: result.error || 'Failed to create sample data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create sample data',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={handleSeed} 
      disabled={isSeeding}
      variant="outline"
      className="gap-2"
    >
      {isSeeding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isSeeding ? 'Creating Sample Data...' : 'Seed Sample Loops'}
    </Button>
  );
};