import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Users } from 'lucide-react';
import { taskEngine } from '@/services/taskEngine';
import { useToast } from '@/hooks/use-toast';
import type { TaskAssignment } from '@/types/taskEngine';

interface TaskAssignmentPanelProps {
  taskId: string;
}

export const TaskAssignmentPanel = ({ taskId }: TaskAssignmentPanelProps) => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAssignment, setNewAssignment] = useState({
    userId: '',
    role: 'assignee'
  });

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const taskAssignments = await taskEngine.getTaskAssignments(taskId);
        setAssignments(taskAssignments);
      } catch (error) {
        console.error('Failed to load assignments:', error);
        toast({
          title: "Error",
          description: "Failed to load task assignments",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, [taskId, toast]);

  const handleAddAssignment = async () => {
    if (!newAssignment.userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive"
      });
      return;
    }

    try {
      const assignment = await taskEngine.assignTask(taskId, newAssignment.userId, newAssignment.role);
      setAssignments(prev => [...prev, assignment]);
      setNewAssignment({ userId: '', role: 'assignee' });
      
      toast({
        title: "Success",
        description: "Task assigned successfully"
      });
    } catch (error) {
      console.error('Failed to assign task:', error);
      toast({
        title: "Error",
        description: "Failed to assign task",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'assignee': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'reviewer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'observer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatUserId = (userId: string) => {
    // For demo purposes, show first 8 chars of UUID or the full string if shorter
    return userId.length > 8 ? `${userId.substring(0, 8)}...` : userId;
  };

  const getInitials = (userId: string) => {
    return userId.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
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
          <Users className="h-5 w-5" />
          Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Assignments */}
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(assignment.user_id)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {formatUserId(assignment.user_id)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned {new Date(assignment.assigned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getRoleColor(assignment.role)}>
                  {assignment.role}
                </Badge>
              </div>
            </div>
          ))}
          
          {assignments.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm">No assignments yet</p>
            </div>
          )}
        </div>

        {/* Add New Assignment */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="text-sm font-medium">Add Assignment</h4>
          
          <div className="flex gap-2">
            <Input
              placeholder="User ID"
              value={newAssignment.userId}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, userId: e.target.value }))}
              className="flex-1"
            />
            
            <Select
              value={newAssignment.role}
              onValueChange={(value) => setNewAssignment(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assignee">Assignee</SelectItem>
                <SelectItem value="reviewer">Reviewer</SelectItem>
                <SelectItem value="observer">Observer</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleAddAssignment} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};