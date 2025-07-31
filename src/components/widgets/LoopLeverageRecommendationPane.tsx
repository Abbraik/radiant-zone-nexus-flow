import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Zap, ChevronRight, Info } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { sixUniversalLevers, getRecommendedLevers, type LoopLeverageContext } from '../../types/levers';

interface LoopLeverageRecommendationPaneProps {
  loopContext?: LoopLeverageContext;
  onLeverRecommendationClick?: (leverId: string) => void;
}

export const LoopLeverageRecommendationPane: React.FC<LoopLeverageRecommendationPaneProps> = ({
  loopContext,
  onLeverRecommendationClick
}) => {
  const [expandedLever, setExpandedLever] = useState<string | null>(null);

  const recommendedLevers = loopContext 
    ? getRecommendedLevers(loopContext.leveragePointRank, loopContext.loopType)
    : [];

  const getDeBandColor = (status: string) => {
    switch (status) {
      case 'red': return 'de-band-red';
      case 'orange': return 'de-band-orange';
      case 'yellow': return 'de-band-yellow';
      case 'green': return 'de-band-green';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getLoopTypeIcon = (type: string) => {
    return type === 'Reinforcing' ? '🔄' : '⚖️';
  };

  if (!loopContext) {
    return (
      <motion.div
        className="glass-secondary rounded-xl p-6 h-full"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Loop Context</h3>
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            Select a Think Zone output to see contextual lever recommendations
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-secondary rounded-xl p-6 h-full flex flex-col"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Loop-Leverage Context</h3>
      </div>

      {/* Loop Context Display */}
      <motion.div
        className="glass rounded-lg p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{getLoopTypeIcon(loopContext.loopType)}</span>
          <div className="flex-1">
            <h4 className="font-medium text-foreground">{loopContext.loopName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {loopContext.loopType} Loop
              </Badge>
              <Badge className={`text-xs tension-chip ${getDeBandColor(loopContext.deBandStatus)}`}>
                DE-Band: {loopContext.deBandStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Target Leverage Point:</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            #{loopContext.leveragePointRank} - {loopContext.leveragePointName}
          </p>
        </div>
      </motion.div>

      {/* Recommended Levers */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-accent" />
          <h4 className="font-medium text-foreground">Recommended Levers</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Top 3 lever domains most aligned with your selected leverage point and loop type
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-3">
          {recommendedLevers.map((lever, index) => (
            <motion.div
              key={lever.id}
              className="glass rounded-lg border border-border-subtle hover:border-primary/30 transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => onLeverRecommendationClick?.(lever.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lever.icon}</span>
                    <div>
                      <h5 className="font-medium text-foreground">{lever.name}</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lever.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: lever.color, color: lever.color }}
                    >
                      #{index + 1} Match
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {lever.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {lever.subLevers.slice(0, 3).map((subLever) => (
                    <Badge key={subLever.id} variant="secondary" className="text-xs">
                      {subLever.name}
                    </Badge>
                  ))}
                  {lever.subLevers.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{lever.subLevers.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {recommendedLevers.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No specific recommendations available for this leverage point
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-border-subtle">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onLeverRecommendationClick?.('all')}
        >
          View All Six Levers
        </Button>
      </div>
    </motion.div>
  );
};

export default LoopLeverageRecommendationPane;