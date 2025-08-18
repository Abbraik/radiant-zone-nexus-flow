import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFeatureFlags } from '@/components/layout/FeatureFlagProvider';
import { createCapacityService } from '@/services/capacity-api';
import { EnhancedTask } from '@/types/capacity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const Workspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const taskId = searchParams.get('task');
  
  const [task, setTask] = useState<EnhancedTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCapacityBundle, setActiveCapacityBundle] = useState<string | null>(null);

  const capacityService = createCapacityService(flags.SUPABASE_LIVE);

  useEffect(() => {
    if (taskId) {
      loadTask();
    } else {
      setLoading(false);
    }
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;
    
    try {
      const taskData = await capacityService.getTaskById(taskId);
      setTask(taskData);
      setActiveCapacityBundle(taskData?.capacity || null);
    } catch (error) {
      console.error('Failed to load task:', error);
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handlePayloadUpdate = async (payload: any) => {
    if (!task) return;
    
    try {
      await capacityService.updateTaskPayload(task.id, payload);
      setTask({ ...task, payload });
      toast.success('Task updated');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleCompleteTask = async () => {
    if (!task) return;
    
    try {
      await capacityService.updateTaskPayload(task.id, { 
        ...task.payload, 
        status: 'done',
        completed_at: new Date().toISOString()
      });
      setTask({ ...task, status: 'done' });
      toast.success('Task completed');
      navigate('/');
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast.error('Failed to complete task');
    }
  };

  if (!flags.CAPACITY_WORKSPACE) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Capacity Workspace</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The capacity workspace feature is currently disabled.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading workspace...</p>
        </motion.div>
      </div>
    );
  }

  if (!taskId || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>No Task Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please select a task to work on in the capacity workspace.
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Meta-Loop Console Overlay */}
      {flags.META_LOOP_CONSOLE && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 bg-primary/5 border-b border-border backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                Meta-Loop Console
              </Badge>
              <span className="text-sm text-muted-foreground">
                Task: {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={task.capacity === 'responsive' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {task.capacity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {task.scale.toUpperCase()}
              </Badge>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Workspace */}
      <div className={`container mx-auto p-6 ${flags.META_LOOP_CONSOLE ? 'pt-20' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <p className="text-muted-foreground">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              {task.status !== 'done' && (
                <Button onClick={handleCompleteTask} size="sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </div>

          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Task Details
                <Badge variant="outline">{task.capacity}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                  <p className="capitalize">{task.capacity}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loop Type</label>
                  <p className="capitalize">{task.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scale</label>
                  <p className="capitalize">{task.scale}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Leverage</label>
                  <p>{task.leverage}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Bundle Area */}
          <Card>
            <CardHeader>
              <CardTitle>
                {task.capacity.charAt(0).toUpperCase() + task.capacity.slice(1)} Capacity Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {task.capacity.charAt(0).toUpperCase() + task.capacity.slice(1)} Bundle
                </h3>
                <p className="text-muted-foreground mb-4">
                  Capacity-specific tools will be loaded here based on the task type and requirements.
                </p>
                <Badge variant="outline">
                  Bundle: {task.capacity} • Type: {task.type} • Scale: {task.scale}
                </Badge>
              </motion.div>
            </CardContent>
          </Card>

          {/* TRI Values (if available) */}
          {task.tri && (
            <Card>
              <CardHeader>
                <CardTitle>TRI Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{task.tri.T}</div>
                    <div className="text-sm text-muted-foreground">Tension</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{task.tri.R}</div>
                    <div className="text-sm text-muted-foreground">Resonance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{task.tri.I}</div>
                    <div className="text-sm text-muted-foreground">Impact</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};