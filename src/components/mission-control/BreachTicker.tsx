import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Play, Pause, Download, ExternalLink, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useBreachTicker } from '@/hooks/useBreachTicker';
import { formatDistanceToNow, format } from 'date-fns';

interface BreachTickerProps {
  className?: string;
}

export const BreachTicker: React.FC<BreachTickerProps> = ({ className }) => {
  const { data, isLoading, error, isPolling, togglePolling } = useBreachTicker();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  if (error) {
    return (
      <Card className={`bg-white/5 backdrop-blur-xl border border-white/20 p-6 ${className}`}>
        <div className="text-destructive text-sm">Failed to load breach data</div>
      </Card>
    );
  }

  const paginatedData = data?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) || [];
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (severity >= 60) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (severity >= 40) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 80) return 'Critical';
    if (severity >= 60) return 'High';
    if (severity >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <Card className={`bg-white/5 backdrop-blur-xl border border-white/20 p-6 h-full ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-white drop-shadow-sm">Tier-3 Breach Ticker</h3>
          <AlertTriangle className="w-5 h-5 text-red-400 drop-shadow-sm" />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePolling}
            className="text-white hover:bg-white/10"
          >
            {isPolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Breach List */}
          <div className="space-y-3 min-h-80">
            {paginatedData.length > 0 ? (
              paginatedData.map((breach, index) => (
                <motion.div
                  key={breach.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-200 border border-white/20 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold truncate group-hover:text-teal-300 transition-colors">
                          {breach.loop_name}
                        </h4>
                        <Badge className={`${getSeverityColor(breach.severity_score)} text-xs font-semibold`}>
                          {getSeverityLabel(breach.severity_score)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">Cohort:</span>
                          {breach.cohort}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">Geo:</span>
                          {breach.geo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {breach.persistence}d
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          Magnitude: {breach.magnitude.toFixed(1)}
                          {breach.magnitude_change > 0 ? (
                            <TrendingUp className="w-3 h-3 text-red-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-emerald-400" />
                          )}
                        </span>
                        <span>
                          Updated {formatDistanceToNow(new Date(breach.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {breach.severity_score.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-400">Severity</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-300 hover:bg-teal-400/10 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Loop
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-300 hover:bg-teal-400/10 text-xs"
                    >
                      Sprint Draft
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-300 hover:bg-teal-400/10 text-xs"
                    >
                      View Cascade
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-200 font-medium">
                No tier-3 breaches detected
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="text-xs text-gray-400">
                Page {currentPage + 1} of {totalPages} ({data?.length || 0} total breaches)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="text-teal-300 border-teal-400/30 hover:bg-teal-400/10"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="text-teal-300 border-teal-400/30 hover:bg-teal-400/10"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="text-xs text-gray-400">
              {isPolling ? 'Live feed active' : 'Feed paused'} • 
              Severity = magnitude × persistence
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-teal-300 border-teal-400/30 hover:bg-teal-400/10"
              >
                Export Top Breaches
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};