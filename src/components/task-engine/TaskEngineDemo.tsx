import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Plus, 
  Eye, 
  Play, 
  Pause, 
  CheckCircle, 
  Clock,
  BarChart3,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import { TaskHistoryView } from './TaskHistoryView';
import { TaskCreationModal } from './TaskCreationModal';
import { TaskSummaryCard } from './TaskSummaryCard';
import type { TaskV2 } from '@/types/taskEngine';

export const TaskEngineDemo = () => {
  const {
    tasks,
    summary,
    tasksLoading,
    activeTasks,
    myTasks,
    overdueTasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus,
    isUpdating
  } = useTaskEngine();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'history'>('list');

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
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskAction = (task: TaskV2, action: string) => {
    switch (action) {
      case 'start':
        updateTaskStatus(task.id, 'active');
        break;
      case 'pause':
        updateTaskStatus(task.id, 'paused');
        break;
      case 'complete':
        updateTaskStatus(task.id, 'completed');
        break;
      case 'cancel':
        updateTaskStatus(task.id, 'cancelled');
        break;
      case 'view':
        setSelectedTask(task);
        setViewMode('history');
        break;
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  if (selectedTask && viewMode === 'history') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedTask(null);
              setViewMode('list');
            }}
          >
            ← Back to Tasks
          </Button>
        </div>
        <TaskHistoryView task={selectedTask} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Engine V2</h1>
          <p className="text-muted-foreground">Advanced task management with locking, events, and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <TaskSummaryCard
            title="Total Tasks"
            value={summary.total_tasks}
            icon={<Settings className="h-4 w-4" />}
            trend="+2 from last week"
          />
          <TaskSummaryCard
            title="Active Tasks"
            value={summary.by_status.active}
            icon={<Play className="h-4 w-4" />}
            trend={`${activeTasks.length} running`}
          />
          <TaskSummaryCard
            title="Overdue"
            value={summary.overdue_count}
            icon={<AlertTriangle className="h-4 w-4" />}
            trend={summary.overdue_count > 0 ? "Needs attention" : "All good"}
            variant={summary.overdue_count > 0 ? "destructive" : "default"}
          />
          <TaskSummaryCard
            title="Avg. Completion"
            value={`${formatDuration(summary.avg_completion_time)}`}
            icon={<BarChart3 className="h-4 w-4" />}
            trend="Within SLA"
          />
        </div>
      )}

      {/* Task Lists */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="my">My Tasks ({myTasks.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TaskList 
            tasks={tasks} 
            loading={tasksLoading}
            onTaskAction={handleTaskAction}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            formatDuration={formatDuration}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <TaskList 
            tasks={activeTasks} 
            loading={tasksLoading}
            onTaskAction={handleTaskAction}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            formatDuration={formatDuration}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="my" className="space-y-4">
          <TaskList 
            tasks={myTasks} 
            loading={tasksLoading}
            onTaskAction={handleTaskAction}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            formatDuration={formatDuration}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <TaskList 
            tasks={overdueTasks} 
            loading={tasksLoading}
            onTaskAction={handleTaskAction}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            formatDuration={formatDuration}
            isUpdating={isUpdating}
          />
        </TabsContent>
      </Tabs>

      {/* Create Task Modal */}
      <TaskCreationModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

interface TaskListProps {
  tasks: TaskV2[];
  loading: boolean;
  onTaskAction: (task: TaskV2, action: string) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  formatDuration: (minutes?: number) => string;
  isUpdating: boolean;
}

const TaskList = ({ 
  tasks, 
  loading, 
  onTaskAction, 
  getStatusColor, 
  getPriorityColor, 
  formatDuration,
  isUpdating 
}: TaskListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Settings className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground">Create your first task to get started</p>
        </CardContent>
      </Card>
    );  
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
                  {task.due_date && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  {task.estimated_duration && (
                    <span>Est. {formatDuration(task.estimated_duration)}</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTaskAction(task, 'view')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {task.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTaskAction(task, 'start')}
                    disabled={isUpdating}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                
                {task.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTaskAction(task, 'pause')}
                      disabled={isUpdating}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTaskAction(task, 'complete')}
                      disabled={isUpdating}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {task.status === 'paused' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTaskAction(task, 'start')}
                    disabled={isUpdating}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};