import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bell, Zap, Target, Eye } from 'lucide-react';

interface SignalEvent {
  id: string;
  event_type: string;
  watchpoint_id: string;
  loop_id: string;
  indicator_value: number;
  threshold_crossed: number;
  severity: string;
  auto_action_taken: boolean;
  playbook_executed: any;
  created_at: string;
}

export default function EventToastBus() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Listen for new signal events (watchpoint trips, etc.)
  const { data: recentEvents } = useQuery({
    queryKey: ['recent-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('signal_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as SignalEvent[];
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Subscribe to real-time events
  useEffect(() => {
    const channel = supabase
      .channel('signal-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'signal_events'
        },
        (payload) => {
          const event = payload.new as SignalEvent;
          handleNewEvent(event);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNewEvent = (event: SignalEvent) => {
    const getEventIcon = () => {
      switch (event.event_type) {
        case 'watchpoint_trip': return Eye;
        case 'threshold_breach': return Zap;
        case 'automated_action': return Target;
        default: return Bell;
      }
    };

    const getSeverityColor = () => {
      switch (event.severity) {
        case 'high': return 'destructive';
        case 'medium': return 'default';
        case 'low': return 'secondary';
        default: return 'default';
      }
    };

    const getEventTitle = () => {
      switch (event.event_type) {
        case 'watchpoint_trip': return 'Watchpoint Triggered';
        case 'threshold_breach': return 'Threshold Breached';
        case 'automated_action': return 'Automated Action Taken';
        default: return 'System Event';
      }
    };

    const getEventDescription = () => {
      if (event.event_type === 'watchpoint_trip') {
        return `Value ${event.indicator_value.toFixed(2)} crossed threshold ${event.threshold_crossed?.toFixed(2)}`;
      }
      return `System event detected - ${event.severity} severity`;
    };

    const getActionButton = () => {
      if (event.auto_action_taken && event.playbook_executed?.task_id) {
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/workspace?task=${event.playbook_executed.task_id}`)}
            className="ml-2"
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Open Task
          </Button>
        );
      }
      
      if (event.event_type === 'watchpoint_trip') {
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/workspace?watchpoint=${event.watchpoint_id}`)}
            className="ml-2"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        );
      }

      return null;
    };

    const Icon = getEventIcon();

    toast({
      title: getEventTitle(),
      description: getEventDescription(),
      variant: getSeverityColor() as any,
      action: getActionButton(),
      duration: event.severity === 'high' ? 0 : 5000, // High severity stays until dismissed
    });
  };

  // Listen for successful task/claim/mode events
  useEffect(() => {
    const taskChannel = supabase
      .channel('task-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          const task = payload.new;
          if (task.capacity) {
            toast({
              title: "New task created",
              description: `${task.capacity} task: ${task.name}`,
              action: (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/workspace?task=${task.id}`)}
                >
                  Open <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(taskChannel);
    };
  }, [toast, navigate]);

  // This component doesn't render anything visible - it just manages toasts
  return null;
}