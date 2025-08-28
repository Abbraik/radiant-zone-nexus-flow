import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskStatusManager } from '@/components/admin/TaskStatusManager';

export const TaskRevert: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <TaskStatusManager />
    </div>
  );
};