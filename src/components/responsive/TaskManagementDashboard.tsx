import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  Filter,
  Clock,
  CheckCircle,
  User,
  AlertCircle,
  BarChart3,
  Plus
} from 'lucide-react';
import { TaskClaimPanel } from './TaskClaimPanel';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { supabase } from '@/integrations/supabase/client';

interface TaskManagementDashboardProps {
  sprintId?: string;
  onCreateTask?: () => void;
}

export const TaskManagementDashboard: React.FC<TaskManagementDashboardProps> = ({
  sprintId,
  onCreateTask
}) => {
  const {
    tasks,
    loading,
    claiming,
    claimTask,
    updateTaskProgress,
    releaseTask,
    getTasksByStatus,
    getMyTasks
  } = useTaskManagement(sprintId);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.capacity.toLowerCase().includes(query)
      );
    }

    // Capacity filter
    if (filterCapacity !== 'all') {
      filtered = filtered.filter(task => task.capacity.toLowerCase() === filterCapacity);
    }

    // Tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'available':
          filtered = filtered.filter(task => task.status === 'pending');
          break;
        case 'claimed':
          filtered = filtered.filter(task => task.status === 'claimed');
          break;
        case 'in_progress':
          filtered = filtered.filter(task => task.status === 'in_progress');
          break;
        case 'completed':
          filtered = filtered.filter(task => task.status === 'completed');
          break;
        case 'my_tasks':
          filtered = filtered.filter(task => task.assignee_id === currentUserId);
          break;
        case 'blocked':
          filtered = filtered.filter(task => task.status === 'blocked');
          break;
      }
    }

    return filtered.sort((a, b) => {
      // Sort by due date, then by created date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    });
  }, [tasks, searchQuery, filterCapacity, activeTab, currentUserId]);

  // Task statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const claimed = tasks.filter(t => t.status === 'claimed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const blocked = tasks.filter(t => t.status === 'blocked').length;
    const myTasks = tasks.filter(t => t.assignee_id === currentUserId).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      pending,
      claimed,
      inProgress,
      completed,
      blocked,
      myTasks,
      completionRate
    };
  }, [tasks, currentUserId]);

  const capacityOptions = useMemo(() => {
    const capacities = ['all', ...new Set(tasks.map(t => t.capacity.toLowerCase()))];
    return capacities;
  }, [tasks]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-700">Total</p>
                <p className="text-lg font-semibold text-blue-900">{taskStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-xs text-gray-700">Available</p>
                <p className="text-lg font-semibold text-gray-900">{taskStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-xs text-yellow-700">Claimed</p>
                <p className="text-lg font-semibold text-yellow-900">{taskStats.claimed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-700">In Progress</p>
                <p className="text-lg font-semibold text-blue-900">{taskStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-green-700">Completed</p>
                <p className="text-lg font-semibold text-green-900">{taskStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-red-700">Blocked</p>
                <p className="text-lg font-semibold text-red-900">{taskStats.blocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-purple-700">My Tasks</p>
                <p className="text-lg font-semibold text-purple-900">{taskStats.myTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm rounded-md"
              >
                {capacityOptions.map(capacity => (
                  <option key={capacity} value={capacity}>
                    {capacity === 'all' ? 'All Capacities' : capacity.charAt(0).toUpperCase() + capacity.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {onCreateTask && (
              <Button onClick={onCreateTask} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="my_tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredTasks.map((task) => (
                <TaskClaimPanel
                  key={task.id}
                  task={task}
                  onClaim={claimTask}
                  onUpdateProgress={updateTaskProgress}
                  onRelease={releaseTask}
                  currentUserId={currentUserId}
                  claiming={claiming === task.id}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks found matching your criteria</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};