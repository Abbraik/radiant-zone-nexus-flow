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

  // Calculate timeline span for horizontal positioning
  const now = new Date();
  const dates = sortedEvents.flatMap(event => [
    new Date(event.startDate),
    event.endDate ? new Date(event.endDate) : new Date(event.startDate)
  ]);
  const minDate = new Date(Math.min(now.getTime(), ...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(now.getTime(), ...dates.map(d => d.getTime())));
  const timeSpan = maxDate.getTime() - minDate.getTime();

  const getEventPosition = (date: Date) => {
    return ((date.getTime() - minDate.getTime()) / timeSpan) * 85; // 85% to leave margins
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="relative h-full overflow-x-auto overflow-y-hidden">
        {/* Horizontal timeline axis */}
        <div className="absolute top-12 left-8 right-8 h-0.5 bg-gradient-to-r from-teal-400/50 via-teal-400/30 to-transparent rounded-full" />
        
        {/* Current time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-10 w-0.5 h-6 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50"
          style={{ left: `${Math.min(Math.max(getEventPosition(now) + 8, 8), 93)}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-teal-300 font-medium whitespace-nowrap">
            NOW
          </div>
        </motion.div>
        
        {/* Events */}
        <div className="absolute top-16 left-8 right-8 h-full">
          {sortedEvents.map((event, index) => {
            const leftPos = Math.min(Math.max(getEventPosition(new Date(event.startDate)), 0), 85);
            const trackIndex = index % 2; // Use 2 tracks for better spacing

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`absolute bg-gradient-to-br ${getStatusColor(event.status)} backdrop-blur-xl border rounded-xl p-3 group transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                style={{
                  left: `${leftPos}%`,
                  top: `${trackIndex * 60 + 10}px`,
                  width: '200px',
                  minHeight: '120px'
                }}
              >
                {/* Priority indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl">
                  <div className={getPriorityIndicator(event.priority)} />
                </div>

                {/* Timeline connection dot */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-white/20 border-2 border-teal-400/50 backdrop-blur-sm">
                  <div className="w-1 h-1 rounded-full bg-teal-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Content */}
                <div className="pl-3 space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getTypeIcon(event.type)}
                      <Badge variant="secondary" className="text-xs bg-teal-400/20 border-teal-400/30 text-teal-200 px-2 py-1 flex-shrink-0">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(event.status)}
                    </div>
                  </div>

                  <h4 className="font-semibold text-white text-sm leading-tight">
                    {event.title}
                  </h4>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${event.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white px-2 py-1">
                      {event.progress}%
                    </Badge>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">
                      {format(new Date(event.startDate), 'MMM dd')}
                      {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd')}`}
                    </span>
                  </div>

                  {/* Assignees */}
                  {event.assignees.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <div className="flex -space-x-1">
                        {event.assignees.slice(0, 3).map((assignee, idx) => (
                          <div
                            key={assignee}
                            className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400/30 to-cyan-500/30 border border-white/40 flex items-center justify-center text-xs font-medium text-white"
                            title={assignee}
                          >
                            {assignee.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {event.assignees.length > 3 && (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-500/30 to-gray-600/30 border border-white/40 flex items-center justify-center text-xs font-medium text-white">
                            +{event.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Time labels */}
        <div className="absolute bottom-4 left-8 right-8 flex justify-between text-xs text-gray-300 font-medium">
          <span className="truncate">{format(minDate, 'MMM dd, yyyy')}</span>
          <span className="truncate">{format(maxDate, 'MMM dd, yyyy')}</span>
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
    </div>
  );
};