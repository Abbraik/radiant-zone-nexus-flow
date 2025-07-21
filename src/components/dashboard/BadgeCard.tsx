import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../../hooks/useUserStats';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isUnlocked }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            isUnlocked
              ? 'bg-white/10 border-teal-500/30 hover:bg-white/15 hover:border-teal-400/50'
              : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-60'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-center">
            <div className={`text-2xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
              {badge.icon}
            </div>
            <h4 className={`text-xs font-medium mb-1 ${
              isUnlocked ? 'text-white' : 'text-gray-400'
            }`}>
              {badge.name}
            </h4>
            {isUnlocked && badge.unlockedAt && (
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(badge.unlockedAt, { addSuffix: true })}
              </p>
            )}
          </div>
          
          {isUnlocked && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-teal-400/20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-48">
        <div className="text-center">
          <p className="font-medium text-sm">{badge.name}</p>
          <p className="text-xs text-gray-300 mt-1">{badge.description}</p>
          {!isUnlocked && (
            <p className="text-xs text-amber-300 mt-2">{badge.criteria}</p>
          )}
          {isUnlocked && badge.unlockedAt && (
            <p className="text-xs text-teal-300 mt-2">
              Unlocked {formatDistanceToNow(badge.unlockedAt, { addSuffix: true })}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};