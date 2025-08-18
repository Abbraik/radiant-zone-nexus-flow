import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Network, AlertCircle, Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CoverageResult } from '@/hooks/useDeliberativeBundle';

interface CoverageMapProps {
  coverageData?: CoverageResult;
  onCreateOptionForGap?: (loopId: string) => void;
  onViewDetails?: (loopId: string, optionId: string) => void;
  isLoading?: boolean;
}

export const CoverageMap: React.FC<CoverageMapProps> = ({
  coverageData,
  onCreateOptionForGap,
  onViewDetails,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Coverage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coverageData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Coverage Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No coverage data available</p>
            <p className="text-sm">Run analysis on option set to see coverage</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { matrix, gaps, related_loops } = coverageData;
  const optionIds = Object.keys(Object.values(matrix)[0] || {});
  const loopIds = Object.keys(matrix);

  const getCoverageColor = (coverage: string) => {
    switch (coverage) {
      case 'direct':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'indirect':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'none':
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-muted';
    }
  };

  const getCoverageIcon = (coverage: string) => {
    switch (coverage) {
      case 'direct':
        return '●';
      case 'indirect':
        return '○';
      case 'none':
        return '—';
      default:
        return '?';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Coverage Analysis
            <Badge variant="outline">{loopIds.length} Loops</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Coverage Matrix */}
          <div className="space-y-4">
            <div className="text-sm font-medium">Loop × Option Coverage Matrix</div>
            
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Header row */}
                <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] gap-2 mb-2">
                  <div className="text-xs font-medium text-muted-foreground p-2">
                    Loops / Options
                  </div>
                  {optionIds.map((optionId, index) => (
                    <div key={optionId} className="text-xs font-medium text-center p-2">
                      Option {index + 1}
                    </div>
                  ))}
                </div>
                
                {/* Matrix rows */}
                {loopIds.map((loopId) => (
                  <div key={loopId} className="grid grid-cols-[200px_repeat(auto-fit,minmax(100px,1fr))] gap-2 mb-1">
                    <div className="text-sm p-2 bg-muted/50 rounded text-left">
                      Loop {loopId.slice(-8)}
                    </div>
                    {optionIds.map((optionId) => {
                      const coverage = matrix[loopId]?.[optionId] || 'none';
                      return (
                        <div
                          key={`${loopId}-${optionId}`}
                          className={`text-center p-2 rounded text-sm font-mono cursor-pointer hover:opacity-80 ${getCoverageColor(coverage)}`}
                          onClick={() => onViewDetails?.(loopId, optionId)}
                          title={`${coverage} coverage`}
                        >
                          {getCoverageIcon(coverage)}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-mono">●</span>
                <span>Direct Coverage</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-mono">○</span>
                <span>Indirect Coverage</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-mono">—</span>
                <span>No Coverage</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Coverage Gaps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Coverage Gaps
              </div>
              <Badge variant={gaps.length > 0 ? "destructive" : "default"}>
                {gaps.length} {gaps.length === 1 ? 'Gap' : 'Gaps'}
              </Badge>
            </div>
            
            {gaps.length > 0 ? (
              <div className="space-y-2">
                {gaps.map((gap, index) => (
                  <motion.div
                    key={gap.loop_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
                  >
                    <div>
                      <div className="font-medium text-orange-800 dark:text-orange-200">
                        {gap.loop_name || `Loop ${gap.loop_id.slice(-8)}`}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-300">
                        {gap.gap_type.replace('_', ' ')}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCreateOptionForGap?.(gap.loop_id)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Option
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-green-600 dark:text-green-400">
                <div className="font-medium">✓ Full Coverage Achieved</div>
                <div className="text-sm opacity-80">All loops are covered by at least one option</div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{loopIds.length - gaps.length}</div>
              <div className="text-xs text-muted-foreground">Covered Loops</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{gaps.length}</div>
              <div className="text-xs text-muted-foreground">Coverage Gaps</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{optionIds.length}</div>
              <div className="text-xs text-muted-foreground">Total Options</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};