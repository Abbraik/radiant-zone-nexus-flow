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
    if (timeSpan === 0) return 10; // Fallback for single event
    return 10 + ((date.getTime() - minDate.getTime()) / timeSpan) * 80; // 10% margin on each side
  };

  const getEventWidth = (event: TimelineEvent) => {
    if (!event.endDate) return 0; // Point event
    const startPos = getEventPosition(new Date(event.startDate));
    const endPos = getEventPosition(new Date(event.endDate));
    return Math.max(endPos - startPos, 0);
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="relative h-full overflow-x-auto overflow-y-hidden">
        {/* Horizontal timeline axis */}
        <div className="absolute top-16 left-8 right-8 h-0.5 bg-gradient-to-r from-teal-400/50 via-teal-400/70 to-teal-400/50 rounded-full" />
        
        {/* Current time indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-14 w-0.5 h-6 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50 z-10"
          style={{ left: `${getEventPosition(now)}%` }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-teal-300 font-semibold whitespace-nowrap bg-teal-400/20 px-2 py-1 rounded-full backdrop-blur-sm border border-teal-400/30">
            NOW
          </div>
        </motion.div>
        
        {/* Timeline dots positioned on the timeline axis */}
        <div className="absolute top-0 left-0 right-0 h-full">
          {sortedEvents.map((event, index) => {
            const eventStartPos = getEventPosition(new Date(event.startDate));
            
            return (
              <div key={`dot-${event.id}`}>
                {/* Timeline dot positioned on the axis */}
                <div 
                  className="absolute w-3 h-3 rounded-full bg-teal-400/30 border-2 border-teal-400 backdrop-blur-sm z-20"
                  style={{
                    left: `${eventStartPos}%`,
                    top: '14.5px', // Positioned on the timeline axis
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-teal-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Date label positioned below the dot on timeline */}
                <div 
                  className="absolute text-xs text-gray-300 font-medium bg-gray-800/50 px-2 py-1 rounded border border-white/10 backdrop-blur-sm whitespace-nowrap z-10"
                  style={{
                    left: `${eventStartPos}%`,
                    top: '30px',
                    transform: 'translateX(-50%)'
                  }}
                >
                  {format(new Date(event.startDate), 'MMM dd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Events */}
        <div className="absolute top-0 left-0 right-0 h-full">
          {sortedEvents.map((event, index) => {
            const eventStartPos = getEventPosition(new Date(event.startDate));
            const trackIndex = index % 2;
            const isTopTrack = trackIndex === 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: isTopTrack ? -20 : 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                className={`absolute bg-gradient-to-br ${getStatusColor(event.status)} backdrop-blur-xl border rounded-lg p-3 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}
                style={{
                  left: `calc(${eventStartPos}% - 90px)`, // Center the card on the date
                  top: isTopTrack ? '55px' : '120px', // Adjusted to account for date labels
                  width: '180px',
                  height: '90px'
                }}
              >
                {/* Priority indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg">
                  <div className={getPriorityIndicator(event.priority)} />
                </div>

                {/* Timeline connection line - connects to dot on timeline */}
                <div 
                  className="absolute w-0.5 bg-white/40 z-0"
                  style={{
                    left: '50%',
                    [isTopTrack ? 'bottom' : 'top']: isTopTrack ? '90px' : '-25px',
                    height: isTopTrack ? '25px' : '40px',
                    transform: 'translateX(-50%)'
                  }}
                />

                {/* Content */}
                <div className="pl-3 h-full flex flex-col justify-between">
                  {/* Header */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(event.type)}
                        <Badge variant="secondary" className="text-xs bg-teal-400/20 border-teal-400/30 text-teal-200 px-1 py-0">
                          {event.type}
                        </Badge>
                      </div>
                      {getStatusIcon(event.status)}
                    </div>

                    <h4 className="font-semibold text-white text-xs leading-tight line-clamp-2">
                      {event.title}
                    </h4>
                  </div>

                  {/* Progress section */}
                  <div className="space-y-1">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${event.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white px-1 py-0">
                        {event.progress}%
                      </Badge>
                      {/* Assignees */}
                      {event.assignees.length > 0 && (
                        <div className="flex -space-x-1">
                          {event.assignees.slice(0, 2).map((assignee, idx) => (
                            <div
                              key={assignee}
                              className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400/40 to-cyan-500/40 border border-white/50 flex items-center justify-center text-xs font-medium text-white"
                              title={assignee}
                            >
                              {assignee.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {event.assignees.length > 2 && (
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-500/40 to-gray-600/40 border border-white/50 flex items-center justify-center text-xs font-medium text-white">
                              +{event.assignees.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Time range labels */}
        <div className="absolute bottom-4 left-8 right-8 flex justify-between text-xs text-gray-400 font-medium">
          <span className="bg-white/5 px-2 py-1 rounded border border-white/10 backdrop-blur-sm opacity-60">
            Timeline Range
          </span>
          <span className="bg-white/5 px-2 py-1 rounded border border-white/10 backdrop-blur-sm opacity-60">
            {format(minDate, 'MMM yyyy')} - {format(maxDate, 'MMM yyyy')}
          </span>
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