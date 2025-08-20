import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { importAtlasBatch5 } from '@/utils/importAtlasBatch5';

export const ImportAtlasBatch5Button: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      await importAtlasBatch5();
      // Refresh the page to show newly imported loops
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button
      onClick={handleImport}
      disabled={isImporting}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isImporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Database className="h-4 w-4" />
      )}
      {isImporting ? 'Importing...' : 'Import Atlas Batch 5 (Final)'}
    </Button>
  );
};