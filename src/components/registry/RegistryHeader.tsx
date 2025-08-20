import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ImportAtlasBatchButton } from './ImportAtlasBatchButton';
import { ImportAtlasBatch2Button } from './ImportAtlasBatch2Button';
import { ImportAtlasBatch3Button } from './ImportAtlasBatch3Button';
import { ImportAtlasBatch4Button } from './ImportAtlasBatch4Button';
import { 
  Plus, 
  Download, 
  Search, 
  Grid3X3, 
  List,
  Loader2,
  Keyboard
} from 'lucide-react';
import { ViewMode, SortOption } from '@/types/registry-ui';

interface RegistryHeaderProps {
  onNew: () => void;
  onImport: () => void;
  query: string;
  setQuery: (query: string) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (view: ViewMode) => void;
  isCreating?: boolean;
}

export const RegistryHeader: React.FC<RegistryHeaderProps> = ({
  onNew,
  onImport,
  query,
  setQuery,
  sort,
  setSort,
  viewMode,
  setViewMode,
  isCreating = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loop Registry</h1>
          <p className="text-muted-foreground mt-1">
            Discover, manage, and create system dynamics loops
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onImport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Import JSON
          </Button>

          <ImportAtlasBatchButton />
          
          <ImportAtlasBatch2Button />
          <ImportAtlasBatch3Button />
          <ImportAtlasBatch4Button />
          
          <Button
            onClick={async () => {
              try {
                const { seedSampleLoops } = await import('@/utils/seedSampleLoops');
                const result = await seedSampleLoops();
                if (result.success) {
                  window.location.reload();
                }
              } catch (error) {
                console.error('Error seeding atlas:', error);
                alert('Please sign in first to seed the atlas data.');
              }
            }}
            className="gap-2 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Seed Atlas
          </Button>
          
          <Button 
            onClick={onNew}
            disabled={isCreating}
            variant="outline"
            className="gap-2"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            New Loop
          </Button>
        </div>
      </div>

      <Separator />

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="registry-search"
            placeholder="Search loops..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Badge variant="outline" className="text-xs">
              <Keyboard className="w-3 h-3 mr-1" />
              /
            </Badge>
          </div>
        </div>

        {/* Sort */}
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="nodes">Node Count</SelectItem>
            <SelectItem value="indicators">Indicators</SelectItem>
          </SelectContent>
        </Select>

        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-border bg-background-secondary p-1">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="px-3"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};