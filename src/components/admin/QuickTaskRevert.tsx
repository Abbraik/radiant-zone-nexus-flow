import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { updateTask5C } from '@/5c/services';
import { QUERY_KEYS_5C } from '@/5c/types';
import { useToast } from '@/hooks/use-toast';

export const QuickTaskRevert: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const revertTaskMutation = useMutation({
    mutationFn: () =>
      updateTask5C('abf29327-b091-443d-bd97-d6a9c8bbd949', { status: 'open' as const }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_5C.tasks() });
      toast({
        title: "Task Returned",
        description: "The 'Childcare Wait Time Surge' task is now available in the 5C workspace"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to revert task: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  return (
    <Button 
      onClick={() => revertTaskMutation.mutate()}
      disabled={revertTaskMutation.isPending}
      size="sm"
      variant="outline"
      className="gap-2"
    >
      {revertTaskMutation.isPending ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Reverting...
        </>
      ) : (
        <>
          <ArrowLeft className="h-4 w-4" />
          Return Completed Task
        </>
      )}
    </Button>
  );
};