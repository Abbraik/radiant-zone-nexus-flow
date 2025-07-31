import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronRight, Info, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { sixUniversalLevers, type GovernmentLever, type SubLever } from '../../types/levers';

interface SixLeverSelectorProps {
  selectedSubLevers?: string[];
  onSubLeverSelect?: (subLeverId: string) => void;
  onSubLeverDeselect?: (subLeverId: string) => void;
  filterByLeverIds?: string[];
  loopType?: 'Reinforcing' | 'Balancing';
  leveragePointRank?: number;
  multiSelect?: boolean;
}

export const SixLeverSelector: React.FC<SixLeverSelectorProps> = ({
  selectedSubLevers = [],
  onSubLeverSelect,
  onSubLeverDeselect,
  filterByLeverIds,
  loopType,
  leveragePointRank,
  multiSelect = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLevers, setExpandedLevers] = useState<Set<string>>(new Set());
  const [complexityFilter, setComplexityFilter] = useState<string>('all');

  const filteredLevers = useMemo(() => {
    let levers = sixUniversalLevers;

    // Filter by provided lever IDs if specified
    if (filterByLeverIds && filterByLeverIds.length > 0) {
      levers = levers.filter(lever => filterByLeverIds.includes(lever.id));
    }

    // Filter by search query
    if (searchQuery) {
      levers = levers.filter(lever =>
        lever.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lever.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lever.subLevers.some(subLever =>
          subLever.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subLever.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subLever.examples.some(example =>
            example.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }

    return levers;
  }, [searchQuery, filterByLeverIds]);

  const getFilteredSubLevers = (lever: GovernmentLever): SubLever[] => {
    let subLevers = lever.subLevers;

    // Filter by complexity if specified
    if (complexityFilter !== 'all') {
      subLevers = subLevers.filter(subLever => 
        subLever.complexity.toLowerCase() === complexityFilter
      );
    }

    // Filter by leverage point alignment if specified
    if (leveragePointRank && loopType) {
      subLevers = subLevers.filter(subLever =>
        subLever.leverageAlignment.some(alignment =>
          alignment.leveragePointRank === leveragePointRank &&
          alignment.applicableLoopTypes.includes(loopType)
        )
      );
    }

    return subLevers;
  };

  const toggleLeverExpansion = (leverId: string) => {
    const newExpanded = new Set(expandedLevers);
    if (newExpanded.has(leverId)) {
      newExpanded.delete(leverId);
    } else {
      newExpanded.add(leverId);
    }
    setExpandedLevers(newExpanded);
  };

  const handleSubLeverClick = (subLever: SubLever) => {
    if (selectedSubLevers.includes(subLever.id)) {
      onSubLeverDeselect?.(subLever.id);
    } else {
      if (!multiSelect) {
        // Clear previous selections in single-select mode
        selectedSubLevers.forEach(id => onSubLeverDeselect?.(id));
      }
      onSubLeverSelect?.(subLever.id);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'text-success border-success/30 bg-success/10';
      case 'Medium': return 'text-warning border-warning/30 bg-warning/10';
      case 'High': return 'text-destructive border-destructive/30 bg-destructive/10';
      default: return 'text-muted-foreground border-border-subtle bg-muted/10';
    }
  };

  const getTimeToImpactColor = (timeToImpact: string) => {
    switch (timeToImpact) {
      case 'Short': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Long': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getEffectivenessScore = (subLever: SubLever): number => {
    if (!leveragePointRank || !loopType) return 0;
    
    const alignment = subLever.leverageAlignment.find(a =>
      a.leveragePointRank === leveragePointRank &&
      a.applicableLoopTypes.includes(loopType)
    );
    
    return alignment?.effectivenessScore || 0;
  };

  return (
    <div className="glass-secondary rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <h3 className="text-lg font-semibold text-foreground">Six Universal Levers</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Comprehensive taxonomy of government intervention mechanisms
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search levers and sub-levers..."
            className="pl-10 glass border-border-subtle focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={complexityFilter}
            onChange={(e) => setComplexityFilter(e.target.value)}
            className="text-sm bg-glass-primary border border-border-subtle rounded-md px-2 py-1 text-foreground"
          >
            <option value="all">All Complexity</option>
            <option value="low">Low Complexity</option>
            <option value="medium">Medium Complexity</option>
            <option value="high">High Complexity</option>
          </select>
        </div>
      </div>

      {/* Levers List */}
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {filteredLevers.map((lever) => {
          const filteredSubLevers = getFilteredSubLevers(lever);
          const isExpanded = expandedLevers.has(lever.id);
          
          if (filteredSubLevers.length === 0 && searchQuery) {
            return null; // Hide levers with no matching sub-levers when searching
          }

          return (
            <motion.div
              key={lever.id}
              className="glass border border-border-subtle rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleLeverExpansion(lever.id)}
              >
                <CollapsibleTrigger asChild>
                  <motion.div
                    className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-glass-accent/50 transition-colors rounded-lg"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lever.icon}</span>
                      <div className="text-left">
                        <h4 className="font-medium text-foreground">{lever.name}</h4>
                        <p className="text-sm text-muted-foreground">{lever.domain}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {filteredSubLevers.length} options
                      </Badge>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </motion.div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <AnimatePresence>
                    <motion.div
                      className="px-4 pb-4 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filteredSubLevers.map((subLever) => {
                        const isSelected = selectedSubLevers.includes(subLever.id);
                        const effectivenessScore = getEffectivenessScore(subLever);

                        return (
                          <motion.div
                            key={subLever.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border-subtle hover:border-primary/50 hover:bg-glass-accent/30'
                            }`}
                            onClick={() => handleSubLeverClick(subLever)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            layout
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-foreground">{subLever.name}</h5>
                              {effectivenessScore > 0 && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  {effectivenessScore}% match
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {subLever.description}
                            </p>

                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`text-xs ${getComplexityColor(subLever.complexity)}`}>
                                {subLever.complexity}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getTimeToImpactColor(subLever.timeToImpact)}`}>
                                {subLever.timeToImpact} term
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {subLever.actionType}
                              </Badge>
                            </div>

                            {subLever.examples.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Examples:</p>
                                <div className="flex flex-wrap gap-1">
                                  {subLever.examples.slice(0, 2).map((example, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                  {subLever.examples.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{subLever.examples.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedSubLevers.length > 0 && (
        <motion.div
          className="mt-4 pt-4 border-t border-border-subtle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-muted-foreground mb-2">
            Selected: {selectedSubLevers.length} sub-lever{selectedSubLevers.length !== 1 ? 's' : ''}
          </p>
          <Button variant="outline" size="sm" onClick={() => selectedSubLevers.forEach(id => onSubLeverDeselect?.(id))}>
            Clear Selection
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SixLeverSelector;