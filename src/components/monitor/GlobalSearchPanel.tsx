import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Target, 
  MessageSquare,
  TrendingUp,
  Activity,
  Users,
  X,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface SearchResult {
  id: string;
  type: 'loop' | 'bundle' | 'task' | 'feedback';
  title: string;
  description: string;
  status: string;
  lastUpdated: Date;
  relevanceScore: number;
  contextPath: string[];
  metadata: Record<string, any>;
}

interface SearchFilters {
  types: string[];
  statuses: string[];
  dateRange: 'all' | '24h' | '7d' | '30d';
  sortBy: 'relevance' | 'date' | 'status';
}

const mockSearchResults: SearchResult[] = [
  {
    id: 'env-quality-loop',
    type: 'loop',
    title: 'Environmental Quality Loop',
    description: 'Economic model influences environmental quality affecting health outcomes',
    status: 'critical',
    lastUpdated: new Date(Date.now() - 3600000),
    relevanceScore: 95,
    contextPath: ['Macro Loops', 'Environmental Systems'],
    metadata: { breachCount: 6, leveragePoint: 'Environmental Policies' }
  },
  {
    id: 'env-permit-bundle',
    type: 'bundle',
    title: 'Environmental Permit Processing Bundle',
    description: 'Streamline environmental permit review and approval processes',
    status: 'in-progress',
    lastUpdated: new Date(Date.now() - 7200000),
    relevanceScore: 87,
    contextPath: ['Meso Loops', 'Environmental Impact Assessment'],
    metadata: { progress: 65, estimatedCompletion: '2024-02-15' }
  },
  {
    id: 'env-compliance-task',
    type: 'task',
    title: 'Update Environmental Compliance Guidelines',
    description: 'Review and update guidelines based on new regulations',
    status: 'pending',
    lastUpdated: new Date(Date.now() - 14400000),
    relevanceScore: 78,
    contextPath: ['Micro Tasks', 'Environmental Permit Review'],
    metadata: { assignee: 'Environmental Team', priority: 'high' }
  },
  {
    id: 'env-feedback-stream',
    type: 'feedback',
    title: 'Environmental Quality Concerns',
    description: 'Community feedback regarding air quality and industrial emissions',
    status: 'active',
    lastUpdated: new Date(Date.now() - 1800000),
    relevanceScore: 92,
    contextPath: ['Community Pulse', 'Environmental Quality'],
    metadata: { sentiment: 'negative', volume: 156, themes: ['air quality', 'industrial'] }
  }
];

export function GlobalSearchPanel({ 
  query, 
  onQueryChange, 
  onResultSelect 
}: {
  query: string;
  onQueryChange: (query: string) => void;
  onResultSelect: (result: SearchResult) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    statuses: [],
    dateRange: 'all',
    sortBy: 'relevance'
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        const filteredResults = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setIsSearching(false);
        setIsOpen(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'loop': return Activity;
      case 'bundle': return Target;
      case 'task': return Clock;
      case 'feedback': return MessageSquare;
      default: return Search;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'healthy': return 'text-success';
      case 'in-progress': return 'text-primary';
      case 'active': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'healthy': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search loops, bundles, tasks, or feedback..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 pr-20 w-80 glass-secondary border-border/50"
        />
        
        {/* Search Filters */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <Filter className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 glass border-border/50" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Filter by Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {['loop', 'bundle', 'task', 'feedback'].map(type => (
                      <Button
                        key={type}
                        variant={filters.types.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            types: prev.types.includes(type)
                              ? prev.types.filter(t => t !== type)
                              : [...prev.types, type]
                          }));
                        }}
                        className="text-xs capitalize"
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Filter by Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['critical', 'warning', 'healthy', 'in-progress', 'active'].map(status => (
                      <Button
                        key={status}
                        variant={filters.statuses.includes(status) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            statuses: prev.statuses.includes(status)
                              ? prev.statuses.filter(s => s !== status)
                              : [...prev.statuses, status]
                          }));
                        }}
                        className="text-xs capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {query && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onQueryChange('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="glass border-border/50 shadow-lg">
              <CardContent className="p-0">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-center">
                    <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No results found</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-96">
                    <div className="p-2">
                      {results.map((result) => {
                        const Icon = getResultIcon(result.type);
                        return (
                          <motion.div
                            key={result.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="p-3 rounded-lg cursor-pointer hover:bg-muted/20 transition-colors group"
                            onClick={() => {
                              onResultSelect(result);
                              setIsOpen(false);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-1.5 rounded ${getStatusColor(result.status)} bg-current/10`}>
                                <Icon className="h-3 w-3" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm font-medium text-foreground truncate">
                                    {result.title}
                                  </h4>
                                  <div className="flex items-center space-x-2 ml-2">
                                    <Badge variant={getStatusBadgeVariant(result.status)} className="text-xs">
                                      {result.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {result.type}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {result.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <span>{result.contextPath.join(' › ')}</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>{result.lastUpdated.toLocaleTimeString()}</span>
                                    </div>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}