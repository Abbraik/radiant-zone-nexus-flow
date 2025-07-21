import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { KeyStat } from './KeyStat';
import { useUserStats } from '../../hooks/useUserStats';
import { CheckCircle, Clock, Timer } from 'lucide-react';

export const ProfileStats: React.FC = () => {
  const { data: stats, isLoading } = useUserStats();

  return (
    <div className="p-6 bg-glass/70 backdrop-blur-20 rounded-3xl shadow-2xl border border-white/10 h-full">
      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-teal-500 text-white text-lg">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold text-white mb-1">
            Jordan Davis
          </h2>
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30">
            Product Manager
          </Badge>
        </div>
      </div>

      {/* Key Stats */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white mb-4">Key Statistics</h3>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <KeyStat
              icon={<CheckCircle className="h-5 w-5 text-teal-400" />}
              label="Tasks Completed"
              value={stats?.completed || 0}
              delay={0.3}
            />
            <KeyStat
              icon={<Clock className="h-5 w-5 text-amber-400" />}
              label="Tasks Pending"
              value={stats?.pending || 0}
              delay={0.4}
            />
            <KeyStat
              icon={<Timer className="h-5 w-5 text-blue-400" />}
              label="Avg. Completion Time"
              value={stats?.avgTime || 0}
              suffix="h"
              delay={0.5}
              decimals={1}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};