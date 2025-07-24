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
    <div className={`relative w-full ${className}`} style={{ height }}>
      {/* Timeline axis */}
      <div className="absolute top-12 left-4 right-4 h-0.5 bg-white/30 rounded-full">
        {/* Current time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute w-0.5 h-4 bg-teal-400 transform -translate-x-0.5 -translate-y-2"
          style={{ left: `${Math.min(Math.max(getEventPosition(now), 2), 98)}%` }}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-teal-300 font-medium whitespace-nowrap">
            NOW
          </div>
        </motion.div>
      </div>

      {/* Events */}
      <div className="absolute top-16 left-4 right-4" style={{ height: height - 80 }}>
        {sortedEvents.map((event, index) => {
          const leftPos = Math.min(Math.max(getEventPosition(new Date(event.startDate)), 0), 80);
          const eventWidth = getEventWidth(event);
          const availableWidth = 80 - leftPos;
          const finalWidth = Math.min(Math.max(eventWidth, 15), availableWidth);
          const trackIndex = index % 2; // Use only 2 tracks for better vertical spacing

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`absolute rounded-lg p-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:z-10 bg-white/8 backdrop-blur-sm border shadow-lg ${getPriorityColor(event.priority)}`}
              style={{
                left: `${leftPos}%`,
                width: `${finalWidth}%`,
                top: `${trackIndex * 45 + 10}px`,
                minWidth: '120px',
                maxWidth: `${availableWidth}%`
              }}
            >
              {/* Event progress bar */}
              <div className={`h-2 rounded-full mb-2 ${getStatusColor(event.status)}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className="h-full bg-white/30 rounded-full"
                />
              </div>

              {/* Event content */}
              <div className="space-y-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm">{getTypeIcon(event.type)}</span>
                  <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white px-1 py-0 flex-shrink-0">
                    {event.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-teal-400/20 border-teal-400/30 text-teal-200 px-1 py-0 ml-auto flex-shrink-0">
                    {event.progress}%
                  </Badge>
                </div>

                <h4 className="text-sm font-medium text-white truncate leading-tight">
                  {event.title}
                </h4>

                <div className="text-xs text-gray-300 truncate">
                  {format(new Date(event.startDate), 'MMM dd')}
                  {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd')}`}
                </div>

                {event.assignees.length > 0 && (
                  <div className="flex -space-x-1 mt-1 overflow-hidden">
                    {event.assignees.slice(0, 3).map((assignee, idx) => (
                      <div
                        key={assignee}
                        className="w-5 h-5 rounded-full bg-teal-400/30 border border-white/30 flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                        title={assignee}
                      >
                        {assignee.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {event.assignees.length > 3 && (
                      <div className="w-5 h-5 rounded-full bg-gray-500/30 border border-white/30 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
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
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-300 font-medium">
        <span className="truncate">{format(minDate, 'MMM dd, yyyy')}</span>
        <span className="truncate">{format(maxDate, 'MMM dd, yyyy')}</span>
      </div>
    </div>
  );
};