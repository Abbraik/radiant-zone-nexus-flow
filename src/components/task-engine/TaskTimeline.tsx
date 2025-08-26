import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, AlertCircle, CheckCircle, Pause, Play, X } from 'lucide-react';
import { taskEngine } from '@/services/taskEngine';
import type { TaskEvent } from '@/types/taskEngine';

interface TaskTimelineProps {
  taskId: string;
}

const eventIcons = {
  created: Clock,
  assigned: User,
  started: Play,
  paused: Pause,
  resumed: Play,
  completed: CheckCircle,
  cancelled: X,
  failed: AlertCircle,
  reminder_sent: Clock,
  sla_breach: AlertCircle,
  lock_acquired: Clock,
  lock_released: Clock
};

const eventColors = {
  created: 'bg-blue-500',
  assigned: 'bg-green-500',
  started: 'bg-green-500',
  paused: 'bg-yellow-500',
  resumed: 'bg-green-500',
  completed: 'bg-green-600',
  cancelled: 'bg-red-500',
  failed: 'bg-red-600',
  reminder_sent: 'bg-blue-400',
  sla_breach: 'bg-red-500',
  lock_acquired: 'bg-purple-500',
  lock_released: 'bg-purple-400'
};

export const TaskTimeline = ({ taskId }: TaskTimelineProps) => {
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const taskEvents = await taskEngine.getTaskEvents(taskId);
        setEvents(taskEvents);
      } catch (error) {
        console.error('Failed to load task events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [taskId]);

  const formatEventTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const formatEventTitle = (event: TaskEvent) => {
    const titles = {
      created: 'Task Created',
      assigned: 'Task Assigned',
      started: 'Task Started',
      paused: 'Task Paused',
      resumed: 'Task Resumed',
      completed: 'Task Completed',
      cancelled: 'Task Cancelled',
      failed: 'Task Failed',
      reminder_sent: 'Reminder Sent',
      sla_breach: 'SLA Breach',
      lock_acquired: 'Lock Acquired',
      lock_released: 'Lock Released'
    };
    return titles[event.event_type] || event.event_type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = eventIcons[event.event_type] || Clock;
              const isLast = index === events.length - 1;
              
              return (
                <div key={event.id} className="relative flex items-start gap-4">
                  {!isLast && (
                    <div className="absolute left-5 top-10 w-px h-6 bg-border" />
                  )}
                  
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${eventColors[event.event_type]} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        {formatEventTitle(event)}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatEventTime(event.created_at)}
                      </span>
                    </div>
                    
                    {event.details && Object.keys(event.details).length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {event.details.reason && (
                          <p>Reason: {event.details.reason}</p>
                        )}
                        {event.details.assignee && (
                          <p>Assignee: {event.details.assignee}</p>
                        )}
                        {event.details.duration && (
                          <p>Duration: {event.details.duration}min</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p>No events recorded yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};