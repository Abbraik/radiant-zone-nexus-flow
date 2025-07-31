import React from 'react';
import { motion } from 'framer-motion';

// Skeleton components for loading states
export const InterventionCardSkeleton: React.FC = () => (
  <motion.div
    className="glass rounded-lg p-4 border border-border-subtle"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 bg-muted/30 rounded animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-muted/30 rounded animate-pulse mb-2 w-3/4" />
        <div className="h-3 bg-muted/20 rounded animate-pulse w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 bg-muted/20 rounded animate-pulse" />
      <div className="h-6 w-20 bg-muted/20 rounded animate-pulse" />
    </div>
  </motion.div>
);

export const LeverSelectorSkeleton: React.FC = () => (
  <motion.div
    className="glass-secondary rounded-xl p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-6 bg-muted/30 rounded animate-pulse" />
      <div className="h-5 bg-muted/30 rounded animate-pulse w-48" />
    </div>
    
    <div className="space-y-4 mb-6">
      <div className="h-10 bg-muted/20 rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-muted/20 rounded animate-pulse" />
        <div className="h-8 w-24 bg-muted/20 rounded animate-pulse" />
      </div>
    </div>

    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="glass rounded-lg border border-border-subtle p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted/30 rounded animate-pulse" />
              <div>
                <div className="h-4 bg-muted/30 rounded animate-pulse mb-2 w-32" />
                <div className="h-3 bg-muted/20 rounded animate-pulse w-24" />
              </div>
            </div>
            <div className="w-4 h-4 bg-muted/20 rounded animate-pulse" />
          </div>
          
          <div className="space-y-2">
            {Array.from({ length: 2 + i }, (_, j) => (
              <div key={j} className="glass rounded-lg p-3">
                <div className="h-3 bg-muted/20 rounded animate-pulse mb-2 w-full" />
                <div className="h-3 bg-muted/15 rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export const RecommendationPaneSkeleton: React.FC = () => (
  <motion.div
    className="glass-secondary rounded-xl p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-6 bg-muted/30 rounded animate-pulse" />
      <div className="h-5 bg-muted/30 rounded animate-pulse w-40" />
    </div>

    <div className="glass rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-muted/30 rounded animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-muted/30 rounded animate-pulse mb-2 w-3/4" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-muted/20 rounded animate-pulse" />
            <div className="h-5 w-20 bg-muted/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="border-t border-border-subtle pt-3">
        <div className="h-3 bg-muted/20 rounded animate-pulse mb-2 w-full" />
        <div className="h-3 bg-muted/15 rounded animate-pulse w-2/3" />
      </div>
    </div>

    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="glass rounded-lg border border-border-subtle p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted/30 rounded animate-pulse" />
              <div>
                <div className="h-4 bg-muted/30 rounded animate-pulse mb-2 w-28" />
                <div className="h-3 bg-muted/20 rounded animate-pulse w-20" />
              </div>
            </div>
            <div className="w-4 h-4 bg-muted/20 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export const ImpactSimulatorSkeleton: React.FC = () => (
  <motion.div
    className="glass-secondary rounded-xl p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-muted/30 rounded animate-pulse" />
        <div className="h-5 bg-muted/30 rounded animate-pulse w-36" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-muted/20 rounded animate-pulse" />
        <div className="h-8 w-24 bg-muted/20 rounded animate-pulse" />
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="glass rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 bg-muted/20 rounded animate-pulse mb-2 w-16" />
              <div className="h-6 bg-muted/30 rounded animate-pulse w-12" />
            </div>
            <div className="w-8 h-8 bg-muted/30 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>

    <div className="glass rounded-lg p-4">
      <div className="h-5 bg-muted/30 rounded animate-pulse mb-4 w-40" />
      <div className="h-64 bg-muted/20 rounded animate-pulse" />
    </div>
  </motion.div>
);

export const MetaSolveFormSkeleton: React.FC = () => (
  <motion.div
    className="glass-secondary rounded-xl p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-6 h-6 bg-muted/30 rounded animate-pulse" />
      <div className="h-5 bg-muted/30 rounded animate-pulse w-48" />
    </div>

    <div className="space-y-6">
      <div className="glass rounded-lg p-4">
        <div className="h-4 bg-muted/30 rounded animate-pulse mb-4 w-32" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-3 bg-muted/20 rounded animate-pulse mb-2 w-20" />
            <div className="h-10 bg-muted/20 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-3 bg-muted/20 rounded animate-pulse mb-2 w-16" />
            <div className="h-10 bg-muted/20 rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="glass rounded-lg p-4">
        <div className="h-4 bg-muted/30 rounded animate-pulse mb-4 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 glass rounded-lg">
              <div className="w-10 h-10 bg-muted/30 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-3 bg-muted/30 rounded animate-pulse mb-2 w-3/4" />
                <div className="h-3 bg-muted/20 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Loading state for intervention detail editor
export const InterventionEditorSkeleton: React.FC = () => (
  <motion.div
    className="glass-secondary rounded-2xl border border-border-subtle p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-muted/30 rounded animate-pulse" />
        <div>
          <div className="h-5 bg-muted/30 rounded animate-pulse mb-2 w-48" />
          <div className="h-3 bg-muted/20 rounded animate-pulse w-24" />
        </div>
      </div>
      <div className="w-6 h-6 bg-muted/20 rounded animate-pulse" />
    </div>

    <div className="grid grid-cols-6 gap-1 mb-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-10 bg-muted/20 rounded animate-pulse" />
      ))}
    </div>

    <div className="space-y-6">
      <div className="glass rounded-lg p-4">
        <div className="h-4 bg-muted/30 rounded animate-pulse mb-4 w-32" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="h-10 bg-muted/20 rounded animate-pulse" />
          <div className="h-10 bg-muted/20 rounded animate-pulse" />
        </div>
        <div className="h-20 bg-muted/20 rounded animate-pulse" />
      </div>

      <div className="glass rounded-lg p-4">
        <div className="h-4 bg-muted/30 rounded animate-pulse mb-4 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-16 bg-muted/20 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Main loading component that can be used for the entire Act Zone
export const ActZoneLoadingSkeleton: React.FC = () => (
  <div className="h-full relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-3xl" />
      </div>
    </div>

    <div className="relative z-10 h-full flex flex-col">
      {/* Header Skeleton */}
      <div className="w-full glass h-20 flex items-center justify-between px-8 shadow-lg border-b border-border-subtle">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted/30 rounded animate-pulse" />
          <div className="h-6 bg-muted/30 rounded animate-pulse w-48" />
        </div>
        <div className="flex items-center space-x-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="w-10 h-10 bg-muted/30 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="glass-secondary rounded-2xl border border-border-subtle shadow-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RecommendationPaneSkeleton />
              </div>
              <div className="lg:col-span-2">
                <LeverSelectorSkeleton />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <MetaSolveFormSkeleton />
              <ImpactSimulatorSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default {
  InterventionCardSkeleton,
  LeverSelectorSkeleton,
  RecommendationPaneSkeleton,
  ImpactSimulatorSkeleton,
  MetaSolveFormSkeleton,
  InterventionEditorSkeleton,
  ActZoneLoadingSkeleton
};