import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { formatDistanceToNow, format } from 'date-fns';
import type { TimelineEvent } from '../../pages/missionControl/types';

interface TimelineChartProps {
  events: TimelineEvent[];
  className?: string;
  height?: number;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  events,
  className = '',
  height = 200
}) => {
  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-400 shadow-emerald-400/50';
      case 'active': return 'bg-teal-400 shadow-teal-400/50';
      case 'planned': return 'bg-gray-400 shadow-gray-400/30';
      case 'overdue': return 'bg-red-400 shadow-red-400/50';
      default: return 'bg-gray-400 shadow-gray-400/30';
    }
  };

  const getPriorityColor = (priority: TimelineEvent['priority']) => {
    switch (priority) {
      case 'critical': return 'border-red-400 shadow-red-400/20';
      case 'high': return 'border-orange-400 shadow-orange-400/20';
      case 'medium': return 'border-teal-400 shadow-teal-400/20';
      case 'low': return 'border-gray-400 shadow-gray-400/10';
      default: return 'border-gray-400 shadow-gray-400/10';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'sprint': return '🚀';
      case 'milestone': return '🎯';
      case 'deadline': return '⏰';
      case 'review': return '🔍';
      default: return '📅';
    }
  };

  // Sort events by start date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Calculate timeline span
  const now = new Date();
  const dates = sortedEvents.flatMap(event => [
    new Date(event.startDate),
    event.endDate ? new Date(event.endDate) : new Date(event.startDate)
  ]);
  const minDate = new Date(Math.min(now.getTime(), ...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(now.getTime(), ...dates.map(d => d.getTime())));
  const timeSpan = maxDate.getTime() - minDate.getTime();

  const getEventPosition = (date: Date) => {
    return ((date.getTime() - minDate.getTime()) / timeSpan) * 100;
  };

  const getEventWidth = (event: TimelineEvent) => {
    if (!event.endDate) return 8; // Point event - smaller width
    const startPos = getEventPosition(new Date(event.startDate));
    const endPos = getEventPosition(new Date(event.endDate));
    return Math.max(endPos - startPos, 8);
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Timeline axis */}
      <div className="absolute top-8 left-8 right-8 h-2 bg-white/20 rounded-full shadow-lg">
        {/* Current time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 w-1 h-8 bg-teal-400 rounded-full transform -translate-x-0.5 -translate-y-3 shadow-lg shadow-teal-400/50"
          style={{ left: `${Math.min(Math.max(getEventPosition(now), 2), 98)}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-teal-300 font-semibold whitespace-nowrap drop-shadow-sm">
            NOW
          </div>
        </motion.div>
      </div>

      {/* Events */}
      <div className="absolute top-16 left-8 right-8 overflow-hidden" style={{ height: height - 100 }}>
        {sortedEvents.map((event, index) => {
          const leftPos = Math.min(Math.max(getEventPosition(new Date(event.startDate)), 0), 88);
          const width = getEventWidth(event);
          const maxWidth = 88 - leftPos;
          const trackIndex = index % 3;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`absolute rounded-lg p-2 cursor-pointer hover:z-10 transition-all duration-200 hover:scale-105 bg-white/10 backdrop-blur-sm border shadow-lg ${getPriorityColor(event.priority)}`}
              style={{
                left: `${leftPos}%`,
                width: `${Math.min(Math.max(width, 10), maxWidth)}%`,
                top: `${trackIndex * 35}px`,
                minWidth: '100px',
                maxWidth: `${maxWidth}%`
              }}
            >
              {/* Event progress bar */}
              <div className={`h-3 rounded-full mb-3 ${getStatusColor(event.status)} shadow-lg`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-white/40 rounded-full backdrop-blur-sm"
                />
              </div>

              {/* Event content */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-inner border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg drop-shadow-sm">{getTypeIcon(event.type)}</span>
                  <Badge variant="outline" className="text-xs bg-white/20 border-white/30 text-white font-medium">
                    {event.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-teal-400/20 border-teal-400/30 text-teal-200 font-semibold">
                    {event.progress}%
                  </Badge>
                </div>

                <h4 className="text-sm font-semibold text-white mb-2 truncate drop-shadow-sm">
                  {event.title}
                </h4>

                <div className="text-xs text-gray-200 font-medium">
                  {format(new Date(event.startDate), 'MMM dd')}
                  {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd')}`}
                </div>

                {event.assignees.length > 0 && (
                  <div className="flex -space-x-1 mt-3">
                    {event.assignees.slice(0, 3).map((assignee, idx) => (
                      <div
                        key={assignee}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400/30 to-cyan-500/30 border-2 border-white/40 flex items-center justify-center text-xs font-semibold text-white shadow-lg"
                        title={assignee}
                      >
                        {assignee.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {event.assignees.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        +{event.assignees.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Time labels */}
      <div className="absolute bottom-2 left-8 right-8 flex justify-between text-sm text-gray-200 font-semibold">
        <span className="drop-shadow-sm">{format(minDate, 'MMM dd')}</span>
        <span className="drop-shadow-sm">{format(maxDate, 'MMM dd')}</span>
      </div>
    </div>
  );
};