import React from 'react';
import { motion } from 'framer-motion';
import { useBadges } from '../../hooks/useUserStats';
import { BadgeCard } from './BadgeCard';
import { Skeleton } from '../ui/skeleton';

export const AchievementsBadges: React.FC = () => {
  const { data: badges, isLoading } = useBadges();

  return (
    <div className="p-6 bg-glass/70 backdrop-blur-20 rounded-3xl shadow-2xl border border-white/10 h-full">
      <h3 className="text-xl font-semibold text-white mb-6">Achievements</h3>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Unlocked Badges */}
          {badges && badges.unlocked.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Unlocked</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {badges.unlocked.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.3 + (index * 0.1),
                      type: "spring",
                      bounce: 0.4
                    }}
                  >
                    <BadgeCard badge={badge} isUnlocked={true} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {badges && badges.locked.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Locked</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {badges.locked.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.5 + (index * 0.1),
                      type: "spring",
                      bounce: 0.4
                    }}
                  >
                    <BadgeCard badge={badge} isUnlocked={false} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};