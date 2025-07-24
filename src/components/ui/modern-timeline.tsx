import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { formatDistanceToNow, format } from 'date-fns';
import { Calendar, Clock, Users, Target, Zap, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import type { TimelineEvent } from '../../pages/missionControl/types';

interface ModernTimelineProps {
  events: TimelineEvent[];
  className?: string;
  height?: number;
}

export const ModernTimeline: React.FC<ModernTimelineProps> = ({
  events,
  className = '',
  height = 200
}) => {
  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'active': return <Play className="w-4 h-4 text-teal-400" />;
      case 'planned': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-400/30';
      case 'active': return 'from-teal-500/20 to-cyan-600/20 border-teal-400/30';
      case 'planned': return 'from-gray-500/20 to-gray-600/20 border-gray-400/30';
      case 'overdue': return 'from-red-500/20 to-red-600/20 border-red-400/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-400/30';
    }
  };

  const getPriorityIndicator = (priority: TimelineEvent['priority']) => {
    switch (priority) {
      case 'critical': return 'h-full w-1 bg-gradient-to-b from-red-400 to-red-600 rounded-full';
      case 'high': return 'h-full w-1 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full';
      case 'medium': return 'h-full w-1 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full';
      case 'low': return 'h-full w-1 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full';
      default: return 'h-full w-1 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'sprint': return <Zap className="w-4 h-4" />;
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'deadline': return <Calendar className="w-4 h-4" />;
      case 'review': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Sort events by start date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="relative h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Timeline spine */}
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-teal-400/50 to-transparent rounded-full" />
        
        {/* Events */}
        <div className="space-y-4 pl-16 pr-4 py-4">
          {sortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-12 top-3 w-4 h-4 rounded-full bg-white/10 border-2 border-teal-400/50 flex items-center justify-center backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
              </div>

              {/* Event card */}
              <div className={`relative bg-gradient-to-br ${getStatusColor(event.status)} backdrop-blur-xl border rounded-xl p-4 group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl`}>
                {/* Priority indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl">
                  <div className={getPriorityIndicator(event.priority)} />
                </div>

                {/* Content */}
                <div className="pl-3 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getTypeIcon(event.type)}
                      <h4 className="font-semibold text-white truncate text-sm">
                        {event.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusIcon(event.status)}
                      <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white px-2 py-1">
                        {event.progress}%
                      </Badge>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${event.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-4 text-gray-300 min-w-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {format(new Date(event.startDate), 'MMM dd')}
                          {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd')}`}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-teal-400/20 border-teal-400/30 text-teal-200 px-2 py-1 flex-shrink-0">
                        {event.type}
                      </Badge>
                    </div>

                    {/* Assignees */}
                    {event.assignees.length > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Users className="w-3 h-3 text-gray-400" />
                        <div className="flex -space-x-1">
                          {event.assignees.slice(0, 3).map((assignee, idx) => (
                            <div
                              key={assignee}
                              className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400/30 to-cyan-500/30 border-2 border-white/40 flex items-center justify-center text-xs font-medium text-white"
                              title={assignee}
                            >
                              {assignee.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {event.assignees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-500/30 to-gray-600/30 border-2 border-white/40 flex items-center justify-center text-xs font-medium text-white">
                              +{event.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {sortedEvents.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No timeline events available</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.7);
        }
      `}</style>
    </div>
  );
};