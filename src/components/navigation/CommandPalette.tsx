import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, Search, ArrowRight, Loader2 } from 'lucide-react';
import { useGlue } from '@/hooks/useGlue';
import { useDebounce } from '@/hooks/useDebounce';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  url: string;
  metadata: any;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { search, navigateToResult, createTaskWithLink } = useGlue();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);
      search(debouncedQuery)
        .then(setResults)
        .catch(console.error)
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery, search]);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          navigateToResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [results, selectedIndex, navigateToResult, onClose]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'loop': return '🔄';
      case 'task': return '📋';
      case 'claim': return '⚡';
      case 'watchpoint': return '👁️';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'loop': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      case 'claim': return 'bg-orange-100 text-orange-800';
      case 'watchpoint': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search loops, tasks, claims, watchpoints..."
            className="border-0 focus-visible:ring-0 text-sm"
            autoFocus
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">K</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : results.length === 0 ? (
            query.trim() ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Command className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start typing to search across your workspace</p>
                <div className="mt-4 space-y-1 text-xs">
                  <p>• Search loops, tasks, claims, and watchpoints</p>
                  <p>• Use <kbd className="px-1 py-0.5 bg-muted rounded">↑</kbd> <kbd className="px-1 py-0.5 bg-muted rounded">↓</kbd> to navigate</p>
                  <p>• Press <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to open</p>
                </div>
              </div>
            )
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => navigateToResult(result)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                    index === selectedIndex ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTypeIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{result.title}</p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTypeColor(result.type)}`}
                        >
                          {result.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </p>
                      {result.metadata?.capacity && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {result.metadata.capacity}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}