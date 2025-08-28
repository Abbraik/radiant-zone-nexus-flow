import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { updateTask5C } from '@/5c/services';
import { QUERY_KEYS_5C } from '@/5c/types';
import { useToast } from '@/hooks/use-toast';

export const TaskStatusManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const revertTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: 'open' | 'blocked' | 'claimed' | 'active' | 'done' }) =>
      updateTask5C(taskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_5C.tasks() });
      toast({
        title: "Task Status Updated",
        description: "Task has been returned to available status"
      });
      setIsUpdating(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive"
      });
      setIsUpdating(false);
    }
  });

  const handleRevertTask = async () => {
    setIsUpdating(true);
    // Return the completed task to available status
    await revertTaskMutation.mutateAsync({
      taskId: 'abf29327-b091-443d-bd97-d6a9c8bbd949', // Childcare Wait Time Surge task
      status: 'open' as const
    });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Return Completed Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Childcare Wait Time Surge</h3>
          <Badge variant="secondary">Responsive Capacity</Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Currently: Completed
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          This will return the completed task back to the available tasks pool in the 5C workspace.
        </p>

        <Button 
          onClick={handleRevertTask}
          disabled={isUpdating || revertTaskMutation.isPending}
          className="w-full"
        >
          {isUpdating || revertTaskMutation.isPending ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Available
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};