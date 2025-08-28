import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { useResetTasks } from '@/hooks/useResetTasks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const TasksSection: React.FC = () => {
  const { resetClaimedTasks, isResetting } = useResetTasks();
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch task statistics
  const { data: taskStats, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'task-stats'],
    queryFn: async () => {
      try {
        const [claimedResult, totalResult] = await Promise.all([
          supabase
            .from('tasks_v2')
            .select('task_id, capacity, status, title, created_at')
            .in('status', ['claimed', 'active', 'in_progress']),
          supabase
            .from('tasks_v2')
            .select('task_id, capacity, status')
        ]);

        if (claimedResult.error) {
          console.error('Failed to fetch claimed tasks:', claimedResult.error);
          return {
            claimedTasks: [],
            totalTasks: 0,
            claimedCount: 0,
            availableCount: 0,
          };
        }

        if (totalResult.error) {
          console.error('Failed to fetch total tasks:', totalResult.error);
          return {
            claimedTasks: claimedResult.data || [],
            totalTasks: 0,
            claimedCount: claimedResult.data?.length || 0,
            availableCount: 0,
          };
        }

        return {
          claimedTasks: claimedResult.data || [],
          totalTasks: totalResult.data?.length || 0,
          claimedCount: claimedResult.data?.length || 0,
          availableCount: totalResult.data?.filter(t => t.status === 'open').length || 0,
        };
      } catch (error) {
        console.error('Error in task stats query:', error);
        return {
          claimedTasks: [],
          totalTasks: 0,
          claimedCount: 0,
          availableCount: 0,
        };
      }
    },
  });

  const handleResetTasks = async () => {
    const result = await resetClaimedTasks();
    if (result.success) {
      setShowConfirm(false);
      refetch(); // Refresh the task statistics
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Task Management</h2>
          <p className="text-foreground-muted">Manage and reset claimed tasks in the system</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Task Management</h2>
        <p className="text-foreground-muted">
          Manage and reset claimed tasks in the system. Use this to return claimed tasks back to available status.
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats?.totalTasks || 0}</div>
            <p className="text-xs text-foreground-muted">
              All tasks in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Tasks</CardTitle>
            <Clock className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{taskStats?.availableCount || 0}</div>
            <p className="text-xs text-foreground-muted">
              Ready to be claimed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimed Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{taskStats?.claimedCount || 0}</div>
            <p className="text-xs text-foreground-muted">
              Currently claimed or in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reset Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5" />
            <span>Reset Claimed Tasks</span>
          </CardTitle>
          <CardDescription>
            Reset all claimed and in-progress tasks back to available status. This will make them available for claiming again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taskStats?.claimedCount && taskStats.claimedCount > 0 ? (
            <div className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <h4 className="font-medium text-warning mb-2">Currently Claimed Tasks</h4>
                <div className="space-y-2">
                  {taskStats.claimedTasks.slice(0, 5).map((task: any, index: number) => (
                    <div key={task.task_id || index} className="flex items-center justify-between text-sm">
                      <span className="truncate flex-1 mr-4">
                        {task.title || `${task.capacity} Task`}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                  {taskStats.claimedTasks.length > 5 && (
                    <p className="text-xs text-foreground-muted">
                      ...and {taskStats.claimedTasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              </div>

              <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-warning text-warning hover:bg-warning/10"
                    disabled={isResetting}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
                    {isResetting ? 'Resetting...' : `Reset ${taskStats.claimedCount} Claimed Tasks`}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Claimed Tasks</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset all {taskStats.claimedCount} claimed tasks back to available status? 
                      This action will:
                      <br />
                      • Make all claimed tasks available for claiming again
                      • Cancel any associated claims
                      • Cannot be undone
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleResetTasks}
                      className="bg-warning hover:bg-warning/90"
                      disabled={isResetting}
                    >
                      {isResetting ? 'Resetting...' : 'Reset Tasks'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <h4 className="font-medium text-success mb-1">All Clear!</h4>
              <p className="text-sm text-foreground-muted">
                No claimed tasks found. All tasks are currently available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};