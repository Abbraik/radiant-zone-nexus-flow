import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lock, Database, AlertTriangle } from 'lucide-react';
import { taskEngine } from '@/services/taskEngine';
import type { TaskEvent, TaskLock, TaskOutput } from '@/types/taskEngine';

interface TaskAuditViewProps {
  taskId: string;
}

export const TaskAuditView = ({ taskId }: TaskAuditViewProps) => {
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [outputs, setOutputs] = useState<TaskOutput[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuditData = async () => {
      try {
        const [taskEvents, taskOutputs] = await Promise.all([
          taskEngine.getTaskEvents(taskId),
          taskEngine.getTaskOutputs(taskId)
        ]);
        
        setEvents(taskEvents);
        setOutputs(taskOutputs);
      } catch (error) {
        console.error('Failed to load audit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuditData();
  }, [taskId]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventSeverity = (eventType: string) => {
    switch (eventType) {
      case 'failed':
      case 'sla_breach':
        return 'error';
      case 'cancelled':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'info';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
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
          <FileText className="h-5 w-5" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="outputs">Outputs</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {events.map((event) => {
                  const severity = getEventSeverity(event.event_type);
                  
                  return (
                    <div key={event.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(severity)}>
                            {event.event_type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(event.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      {event.details && Object.keys(event.details).length > 0 && (
                        <div className="bg-muted/50 rounded p-2">
                          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        Created by: {event.created_by}
                      </div>
                    </div>
                  );
                })}
                
                {events.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p>No events recorded</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="outputs" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {outputs.map((output) => (
                  <div key={output.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {output.output_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(output.published_at)}
                        </span>
                      </div>
                      <Database className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="bg-muted/50 rounded p-2">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {JSON.stringify(output.content, null, 2)}
                      </pre>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Published by: {output.published_by}
                    </div>
                  </div>
                ))}
                
                {outputs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p>No outputs published</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};