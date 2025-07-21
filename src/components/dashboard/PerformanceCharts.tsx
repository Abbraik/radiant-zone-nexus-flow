import React from 'react';
import { motion } from 'framer-motion';
import { usePerformanceData } from '../../hooks/useUserStats';
import { SparklineChart } from './SparklineChart';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { TrendingUp, Target, Zap } from 'lucide-react';

export const PerformanceCharts: React.FC = () => {
  const { data: performanceData, isLoading } = usePerformanceData();

  // Generate mock data for mini sparklines
  const triReviewTimes = Array.from({ length: 7 }, () => Math.random() * 3 + 1);
  const simulationRuns = Array.from({ length: 7 }, () => Math.random() * 4 + 1);
  const bundlePublishes = Array.from({ length: 7 }, () => Math.random() * 2 + 0.5);

  return (
    <div className="p-6 bg-glass/70 backdrop-blur-20 rounded-3xl shadow-2xl border border-white/10 h-full">
      <h3 className="text-xl font-semibold text-white mb-6">Performance</h3>
      
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Main Performance Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-4">
              Tasks Completed (Last 14 Days)
            </h4>
            <div className="h-32 bg-white/5 rounded-xl p-4 border border-white/10">
              <SparklineChart 
                data={performanceData?.map(d => d.tasksCompleted) || []}
                color="#30D158"
                height={96}
              />
            </div>
          </div>

          {/* Mini Sparklines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-medium text-gray-300">TRI Reviews</span>
              </div>
              <div className="h-12 mb-2">
                <SparklineChart 
                  data={triReviewTimes}
                  color="#60A5FA"
                  height={48}
                />
              </div>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                Avg: {triReviewTimes.reduce((a, b) => a + b, 0) / triReviewTimes.length || 0}.2h
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium text-gray-300">Simulations</span>
              </div>
              <div className="h-12 mb-2">
                <SparklineChart 
                  data={simulationRuns}
                  color="#FBBF24"
                  height={48}
                />
              </div>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 text-xs">
                Total: {Math.floor(simulationRuns.reduce((a, b) => a + b, 0))}
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-teal-400" />
                <span className="text-xs font-medium text-gray-300">Bundles</span>
              </div>
              <div className="h-12 mb-2">
                <SparklineChart 
                  data={bundlePublishes}
                  color="#30D158"
                  height={48}
                />
              </div>
              <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 text-xs">
                Rate: {bundlePublishes.length}/week
              </Badge>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};