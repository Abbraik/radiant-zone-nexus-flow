import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { History, FileText, Users, Settings } from 'lucide-react';
import { TaskTimeline } from './TaskTimeline';
import { TaskAssignmentPanel } from './TaskAssignmentPanel';
import { TaskAuditView } from './TaskAuditView';
import type { TaskV2 } from '@/types/taskEngine';

interface TaskHistoryViewProps {
  task: TaskV2;
}

export const TaskHistoryView = ({ task }: TaskHistoryViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Task Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{task.title}</CardTitle>
              {task.description && (
                <p className="text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">
                {new Date(task.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated Duration</p>
              <p className="font-medium">
                {formatDuration(task.estimated_duration)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Actual Duration</p>
              <p className="font-medium">
                {formatDuration(task.actual_duration)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <TaskTimeline taskId={task.id} />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <TaskAssignmentPanel taskId={task.id} />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <TaskAuditView taskId={task.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};