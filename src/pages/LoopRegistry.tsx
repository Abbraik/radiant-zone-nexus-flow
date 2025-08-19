import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useLoopRegistry } from '@/hooks/useLoopRegistry';
import { RegistryHeader } from '@/components/registry/RegistryHeader';
import { FacetSidebar } from '@/components/registry/FacetSidebar';
import { RegistryResults } from '@/components/registry/RegistryResults';
import { EmptyState, ErrorState } from '@/components/registry/RegistryStates';
import { MOTIF_DESCRIPTIONS, LAYER_DESCRIPTIONS } from '@/types/registry';
import { useDebounce } from '@/hooks/useDebounce';
import { RegistryFilters, ViewMode, SortOption, defaultFilters } from '@/types/registry-ui';

const LoopRegistry: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL state management
  const query = searchParams.get('q') || '';
  const viewMode = (searchParams.get('view') as ViewMode) || 'cards';
  const sort = (searchParams.get('sort') as SortOption) || 'updated';
  const page = parseInt(searchParams.get('page') || '1');
  
  // Parse filters from URL
  const filters = useMemo(() => {
    const urlFilters = { ...defaultFilters };
    
    const loopTypes = searchParams.get('loop_type');
    if (loopTypes) urlFilters.loop_type = loopTypes.split(',');
    
    const motifs = searchParams.get('motif');
    if (motifs) urlFilters.motif = motifs.split(',');
    
    const layers = searchParams.get('layer');
    if (layers) urlFilters.layer = layers.split(',');
    
    const scales = searchParams.get('scale');
    if (scales) urlFilters.scale = scales.split(',');
    
    const statuses = searchParams.get('status');
    if (statuses) urlFilters.status = statuses.split(',');
    
    const tags = searchParams.get('tags');
    if (tags) urlFilters.tags = tags.split(',');
    
    urlFilters.has_snl = searchParams.get('has_snl') === 'true';
    urlFilters.has_de_band = searchParams.get('has_de_band') === 'true';
    urlFilters.has_srt = searchParams.get('has_srt') === 'true';
    
    return urlFilters;
  }, [searchParams]);

  const debouncedQuery = useDebounce(query, 300);
  
  // Data fetching
  const { searchLoops, createLoop } = useLoopRegistry();
  
  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!searchLoops.data) return [];
    
    let filtered = searchLoops.data.filter(loop => {
      // Text search
      if (debouncedQuery) {
        const searchLower = debouncedQuery.toLowerCase();
        const matches = 
          loop.name.toLowerCase().includes(searchLower) ||
          loop.notes?.toLowerCase().includes(searchLower) ||
          (loop.tags || []).some(tag => tag.toLowerCase().includes(searchLower));
        if (!matches) return false;
      }
      
      // Facet filters
      if (filters.loop_type.length > 0 && !filters.loop_type.includes(loop.loop_type)) return false;
      if (filters.scale?.length > 0 && !filters.scale.includes(loop.scale)) return false;
      if (filters.status.length > 0 && !filters.status.includes(loop.status)) return false;
      
      // Boolean filters
      if (filters.has_snl && (loop.node_count || 0) === 0) return false;
      
      return true;
    });
    
    // Sort data
    filtered.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'nodes':
          return (b.node_count || 0) - (a.node_count || 0);
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
    
    return filtered;
  }, [searchLoops.data, debouncedQuery, filters, sort]);

  // Update URL params
  const updateParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };

  const setQuery = (q: string) => updateParams({ q: q || null, page: '1' });
  const setViewMode = (view: ViewMode) => updateParams({ view });
  const setSort = (sortOption: SortOption) => updateParams({ sort: sortOption, page: '1' });
  
  const updateFilters = (newFilters: Partial<RegistryFilters>) => {
    const updates: Record<string, string | null> = { page: '1' };
    
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        updates[key] = value.length > 0 ? value.join(',') : null;
      } else if (typeof value === 'boolean') {
        updates[key] = value ? 'true' : null;
      }
    });
    
    updateParams(updates);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams({ 
      view: viewMode, 
      sort,
      ...(query && { q: query })
    }));
  };

  const handleNewLoop = () => {
    createLoop.mutate({});
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import clicked');
  };

  const handleExport = (loopId: string) => {
    // TODO: Implement export functionality
    console.log('Export loop:', loopId);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('registry-search')?.focus();
      }
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('registry-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  if (searchLoops.error) {
    return <ErrorState onRetry={() => searchLoops.refetch()} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <RegistryHeader
          onNew={handleNewLoop}
          onImport={handleImport}
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isCreating={createLoop.isPending}
        />

        <div className="flex gap-6 mt-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <FacetSidebar
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
              hasActiveFilters={Object.values(filters).some(v => 
                Array.isArray(v) ? v.length > 0 : v === true
              )}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {filteredData.length === 0 && !searchLoops.isLoading ? (
              <EmptyState 
                hasQuery={!!debouncedQuery}
                hasFilters={Object.values(filters).some(v => 
                  Array.isArray(v) ? v.length > 0 : v === true
                )}
                onClear={clearFilters}
                onNew={handleNewLoop}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegistryResults
                  data={filteredData}
                  isLoading={searchLoops.isLoading}
                  viewMode={viewMode}
                  onExport={handleExport}
                  totalCount={filteredData.length}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopRegistry;