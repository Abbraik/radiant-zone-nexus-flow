import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import { TaskTimeline } from '@/components/taskEngine/TaskTimeline';
import { TaskAssignmentPanel } from '@/components/taskEngine/TaskAssignmentPanel';
import { TaskCreationModal } from '@/components/taskEngine/TaskCreationModal';
import { TaskHistoryView } from '@/components/taskEngine/TaskHistoryView';
import { TaskAuditView } from '@/components/taskEngine/TaskAuditView';
import { TaskSummaryCard } from '@/components/taskEngine/TaskSummaryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TaskEngineWorkspace: React.FC = () => {
  const {
    tasks,
    templates,
    summary,
    selectedTask,
    setSelectedTask,
    activeTasks,
    myTasks,
    overdueTasks,
    tasksLoading,
    createTask,
    updateTaskStatus,
    completeTask,
    pauseTask,
    resumeTask,
    cancelTask,
    assignTask,
    acquireLock,
    isCreating,
    isUpdating,
    isAssigning,
    isAcquiringLock
  } = useTaskEngine();

  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Get the currently active task (first active task or selected task)
  const activeTask = selectedTask || activeTasks[0] || null;

  const handleTaskSelect = (task: any) => {
    setSelectedTask(task);
  };

  const handleTaskAction = (action: string, taskId: string) => {
    switch (action) {
      case 'complete':
        completeTask(taskId);
        break;
      case 'pause':
        pauseTask(taskId);
        break;
      case 'resume':
        resumeTask(taskId);
        break;
      case 'cancel':
        cancelTask(taskId);
        break;
      case 'acquire-lock':
        acquireLock(taskId);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (tasksLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Task Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Engine V2</h1>
            <p className="text-muted-foreground">Advanced task management and workflow automation</p>
          </div>
          <Button
            onClick={() => setIsTaskCreationOpen(true)}
            className="gap-2"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            {isCreating ? 'Creating...' : 'Create Task'}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TaskSummaryCard
            title="Total Tasks"
            value={summary?.total_tasks || tasks.length}
            icon={<Clock className="h-4 w-4" />}
            color="blue"
          />
          <TaskSummaryCard
            title="Active Tasks"
            value={activeTasks.length}
            icon={<AlertCircle className="h-4 w-4" />}
            color="green"
          />
          <TaskSummaryCard
            title="My Tasks"
            value={myTasks.length}
            icon={<Clock className="h-4 w-4" />}
            color="purple"
          />
          <TaskSummaryCard
            title="Overdue"
            value={overdueTasks.length}
            icon={<AlertCircle className="h-4 w-4" />}
            color="red"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Task List and Active Task */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Task */}
            {activeTask && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Active Task</span>
                    <Badge 
                      variant={
                        activeTask.priority === 'critical' ? 'destructive' :
                        activeTask.priority === 'high' ? 'default' :
                        'secondary'
                      }
                    >
                      {activeTask.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{activeTask.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{activeTask.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{activeTask.status}</Badge>
                      {activeTask.due_date && (
                        <Badge variant="outline">
                          Due: {new Date(activeTask.due_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleTaskAction('complete', activeTask.id)}
                        disabled={isUpdating}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUpdating ? 'Updating...' : 'Complete'}
                      </Button>
                      
                      {activeTask.status === 'active' ? (
                        <Button
                          onClick={() => handleTaskAction('pause', activeTask.id)}
                          disabled={isUpdating}
                          size="sm"
                          variant="outline"
                        >
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleTaskAction('resume', activeTask.id)}
                          disabled={isUpdating}
                          size="sm"
                          variant="outline"
                        >
                          Resume
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleTaskAction('acquire-lock', activeTask.id)}
                        disabled={isAcquiringLock}
                        size="sm"
                        variant="outline"
                      >
                        {isAcquiringLock ? 'Locking...' : 'Lock Task'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Task Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Task Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskTimeline
                  tasks={tasks}
                  onTaskSelect={handleTaskSelect}
                  selectedTask={selectedTask}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Assignment Panel and Tabs */}
          <div className="space-y-6">
            <TaskAssignmentPanel
              tasks={tasks}
              onAssign={assignTask}
              isAssigning={isAssigning}
            />

            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="audit">Audit</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="history" className="mt-4">
                    <TaskHistoryView 
                      taskId={selectedTask?.id} 
                      events={[]} // This would come from the task engine service
                    />
                  </TabsContent>
                  
                  <TabsContent value="audit" className="mt-4">
                    <TaskAuditView 
                      taskId={selectedTask?.id}
                      events={[]} // This would come from the task engine service
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* No Active Task State */}
        {!activeTask && tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card>
              <CardContent className="pt-6">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No Tasks Yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first task to get started with the Task Engine
                </p>
                <Button
                  onClick={() => setIsTaskCreationOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create First Task
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={isTaskCreationOpen}
        onClose={() => setIsTaskCreationOpen(false)}
        onCreate={createTask}
        isCreating={isCreating}
        templates={templates}
      />
    </div>
  );
};