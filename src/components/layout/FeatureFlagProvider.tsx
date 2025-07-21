import React, { createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores/ui-store';
import type { FeatureFlags } from '../../types';

interface FeatureFlagContextType {
  flags: FeatureFlags;
  updateFlag: (flag: keyof FeatureFlags, value: boolean) => void;
  isEnabled: (flag: keyof FeatureFlags) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
  const { featureFlags, updateFeatureFlag } = useUIStore();

  const isEnabled = (flag: keyof FeatureFlags): boolean => {
    return featureFlags[flag];
  };

  const contextValue: FeatureFlagContextType = {
    flags: featureFlags,
    updateFlag: updateFeatureFlag,
    isEnabled
  };

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// Feature Flag Guard Component
interface FeatureFlagGuardProps {
  flag: keyof FeatureFlags;
  children: ReactNode;
  fallback?: ReactNode;
  transition?: boolean;
}

export const FeatureFlagGuard: React.FC<FeatureFlagGuardProps> = ({
  flag,
  children,
  fallback = null,
  transition = true
}) => {
  const { isEnabled } = useFeatureFlags();
  const enabled = isEnabled(flag);

  if (!transition) {
    return enabled ? <>{children}</> : <>{fallback}</>;
  }

  return (
    <AnimatePresence mode="wait">
      {enabled ? (
        <motion.div
          key="enabled"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        fallback && (
          <motion.div
            key="disabled"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {fallback}
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};

// Feature Flag Chip Component
interface FeatureFlagChipProps {
  flag: keyof FeatureFlags;
  className?: string;
}

export const FeatureFlagChip: React.FC<FeatureFlagChipProps> = ({ flag, className = '' }) => {
  const { isEnabled } = useFeatureFlags();
  const enabled = isEnabled(flag);

  if (!enabled) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary border border-primary/30 ${className}`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      {flag}
    </motion.div>
  );
};