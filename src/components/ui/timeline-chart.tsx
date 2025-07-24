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
      case 'completed': return 'bg-emerald-500';
      case 'active': return 'bg-primary';
      case 'planned': return 'bg-muted';
      case 'overdue': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: TimelineEvent['priority']) => {
    switch (priority) {
      case 'critical': return 'border-destructive';
      case 'high': return 'border-warning';
      case 'medium': return 'border-primary';
      case 'low': return 'border-muted';
      default: return 'border-muted';
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
    if (!event.endDate) return 2; // Point event
    const startPos = getEventPosition(new Date(event.startDate));
    const endPos = getEventPosition(new Date(event.endDate));
    return Math.max(endPos - startPos, 2);
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Timeline axis */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-border">
        {/* Current time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-0 w-0.5 h-4 bg-primary transform -translate-x-0.5 -translate-y-2"
          style={{ left: `${getEventPosition(now)}%` }}
        >
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs text-primary whitespace-nowrap">
            Now
          </div>
        </motion.div>
      </div>

      {/* Events */}
      <div className="absolute top-8 left-0 right-0" style={{ height: height - 60 }}>
        {sortedEvents.map((event, index) => {
          const leftPos = getEventPosition(new Date(event.startDate));
          const width = getEventWidth(event);
          const trackIndex = index % 3; // Simple track assignment

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`absolute border-2 rounded-lg p-2 cursor-pointer hover:z-10 transition-all ${getPriorityColor(event.priority)}`}
              style={{
                left: `${leftPos}%`,
                width: `${Math.max(width, 12)}%`,
                top: `${trackIndex * 40}px`,
                minWidth: '120px'
              }}
            >
              {/* Event bar */}
              <div className={`h-2 rounded-full mb-2 ${getStatusColor(event.status)}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${event.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-foreground/20 rounded-full"
                />
              </div>

              {/* Event content */}
              <div className="bg-background/90 rounded p-2 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{getTypeIcon(event.type)}</span>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {event.progress}%
                  </Badge>
                </div>

                <h4 className="text-sm font-medium text-foreground mb-1 truncate">
                  {event.title}
                </h4>

                <div className="text-xs text-muted-foreground">
                  {format(new Date(event.startDate), 'MMM dd')}
                  {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd')}`}
                </div>

                {event.assignees.length > 0 && (
                  <div className="flex -space-x-1 mt-2">
                    {event.assignees.slice(0, 3).map((assignee, idx) => (
                      <div
                        key={assignee}
                        className="w-4 h-4 rounded-full bg-primary/20 border border-background flex items-center justify-center text-xs"
                        title={assignee}
                      >
                        {assignee.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {event.assignees.length > 3 && (
                      <div className="w-4 h-4 rounded-full bg-muted border border-background flex items-center justify-center text-xs">
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
        <span>{format(minDate, 'MMM dd')}</span>
        <span>{format(maxDate, 'MMM dd')}</span>
      </div>
    </div>
  );
};