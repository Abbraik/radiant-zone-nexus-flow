import React from 'react';
import { Search, Plus, FileDown, Layout, Grid3X3, List, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ViewMode, SortOption } from '@/types/registry-ui';

interface RegistryHeaderProps {
  onNew: () => void;
  onImport: () => void;
  query: string;
  setQuery: (q: string) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isCreating?: boolean;
  searchLoops?: {
    data?: any[];
    isLoading?: boolean;
  };
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
  isCreating,
  searchLoops
}) => {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex flex-col gap-4">
        {/* Title & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loop Registry</h1>
            <p className="text-muted-foreground mt-1">
              NCF-PAGS Atlas — All 42 loops from batches 1-5 pre-loaded
              <Badge variant="secondary" className="ml-2">Public Access</Badge>
              <Badge variant="outline" className="ml-2">
                {searchLoops.data?.length || 0} loops loaded
              </Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onNew} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? 'Creating...' : 'New Loop'}
            </Button>
            <Button variant="outline" onClick={onImport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="registry-search"
              placeholder="Search loops..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="nodes">Node Count</SelectItem>
              <SelectItem value="indicators">Indicators</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};