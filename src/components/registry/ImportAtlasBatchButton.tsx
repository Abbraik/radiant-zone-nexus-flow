import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { importAtlasBatch1 } from '@/utils/importAtlasBatch';
import { Loader2, Database } from 'lucide-react';

export const ImportAtlasBatchButton: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const result = await importAtlasBatch1();
      if (result.success) {
        toast({
          title: 'Atlas Batch Imported',
          description: `Successfully imported ${result.count} Atlas loops with full structure!`,
        });
        // Refresh the page to show new data
        window.location.reload();
      } else {
        toast({
          title: 'Import Failed',
          description: result.error || 'Failed to import Atlas batch',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import Atlas batch',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button 
      onClick={handleImport} 
      disabled={isImporting}
      variant="outline"
      className="gap-2"
    >
      {isImporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isImporting ? 'Importing Atlas Batch...' : 'Import Atlas Batch 1'}
    </Button>
  );
};