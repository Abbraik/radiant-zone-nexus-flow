import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useActivityLog } from '../../hooks/useUserStats';
import { CheckCircle, Plus, Play } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const getEventIcon = (type: string) => {
  switch (type) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-teal-400" />;
    case 'claimed':
      return <Plus className="h-4 w-4 text-blue-400" />;
    case 'started':
      return <Play className="h-4 w-4 text-amber-400" />;
    default:
      return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'completed':
      return 'border-teal-500/50 bg-teal-500/10';
    case 'claimed':
      return 'border-blue-500/50 bg-blue-500/10';
    case 'started':
      return 'border-amber-500/50 bg-amber-500/10';
    default:
      return 'border-gray-500/50 bg-gray-500/10';
  }
};

export const ActivityTimeline: React.FC = () => {
  const { data: activities, isLoading } = useActivityLog(undefined, 5);

  return (
    <div className="p-6 bg-glass/70 backdrop-blur-20 rounded-3xl shadow-2xl border border-white/10 h-full">
      <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
          {activities?.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors hover:bg-white/5 cursor-pointer ${getEventColor(activity.type)}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {activity.type === 'completed' && 'Completed: '}
                  {activity.type === 'claimed' && 'Claimed: '}
                  {activity.type === 'started' && 'Started: '}
                  {activity.taskTitle}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};