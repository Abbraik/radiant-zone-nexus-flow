import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEnhancedTasks } from '../../hooks/useEnhancedTasks';
import { DynamicZoneBundleLoader } from '../workspace/DynamicZoneBundleLoader';
import { useFeatureFlags, FeatureFlagGuard } from '../layout/FeatureFlagProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, ArrowLeft, Target, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import ZoneToolsDock from '../zone/ZoneToolsDock';
import ZoneToolsPortals from '../zone/ZoneToolsPortals';
import { useToolsStore } from '../../stores/toolsStore';
import type { Zone, TaskType } from '../../types/zone-bundles';

// Import legacy zone workspaces as fallbacks
import { ThinkZoneWorkspace } from './ThinkZoneWorkspace';
import { ActZone as ActZoneWorkspace } from '../../pages/ActZone';
import MonitorZone from '../../pages/MonitorZone';
import { InnovateLearnZoneWorkspace } from './InnovateLearnZoneWorkspace';

interface ZonePageProps {
  zone: Zone;
  zoneName: string;
  description: string;
  fallbackComponent: React.ComponentType;
}

export const ZonePage: React.FC<ZonePageProps> = ({ 
  zone, 
  zoneName, 
  description, 
  fallbackComponent: FallbackComponent 
}) => {
  const navigate = useNavigate();
  const { flags } = useFeatureFlags();
  const { activeTask, updateTaskPayload, isLoading } = useEnhancedTasks();
  const [taskPayload, setTaskPayload] = useState<any>({});
  const [validationState, setValidationState] = useState<{isValid: boolean, errors?: string[]}>({ isValid: false });

  const handlePayloadUpdate = (payload: any) => {
    setTaskPayload(payload);
    if (activeTask) {
      updateTaskPayload(activeTask.id, payload);
    }
  };

  const handleValidationChange = (isValid: boolean, errors?: string[]) => {
    setValidationState({ isValid, errors });
  };

  // Check if we have a task that matches this zone
  const zoneTask = activeTask && activeTask.zone === zone ? activeTask : null;

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 p-6 bg-glass/70 backdrop-blur-20 rounded-2xl border border-white/10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
            <span className="text-white font-medium">Loading {zoneName} workspace...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // If zone bundles are not enabled or no zone task, show fallback
  if (!flags.useZoneBundles || !zoneTask) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-screen w-full relative"
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button 
            onClick={() => useToolsStore.getState().openAbout('workflow')} 
            className="btn-chip"
          >
            What is this? (workflow)
          </button>
          {!flags.useZoneBundles && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              Zone Bundles Disabled
            </Badge>
          )}
          {!zoneTask && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              No Active Task
            </Badge>
          )}
        </div>

        {!zoneTask && (
          <div className="absolute top-20 right-4 z-10">
            <Card className="w-80 glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">No {zoneName} Task Active</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Go to the workspace to claim a {zoneName.toLowerCase()} zone task to see the zone bundle interface.
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/workspace')}
                  className="w-full"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Go to Workspace
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <FallbackComponent />
        <ZoneToolsDock zone={zone as any} />
        <ZoneToolsPortals zone={zone as any} />
      </motion.div>
    );
  }

  // Show zone bundle interface
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Zone Header */}
      <div className="p-6 border-b border-border/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/workspace')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Workspace
            </Button>
            <div className="h-6 w-px bg-border/50" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-400"></div>
              <h1 className="text-xl font-semibold text-foreground">{zoneName} Zone</h1>
              <Badge variant="outline" className="capitalize">
                {zoneTask.task_type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500/20 text-green-300">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Zone Bundle Active
            </Badge>
            <button 
              onClick={() => useToolsStore.getState().openAbout('workflow')} 
              className="btn-chip"
            >
              What is this?
            </button>
          </div>
        </div>
      </div>

      {/* Zone Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Task Header */}
            <Card className="mb-6 glass border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  {zoneTask.title}
                </CardTitle>
                <CardDescription>{zoneTask.description}</CardDescription>
              </CardHeader>
            </Card>

            {/* Zone Bundle Interface */}
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <DynamicZoneBundleLoader
                  zone={zone}
                  taskType={zoneTask.task_type as TaskType}
                  taskId={zoneTask.id}
                  taskData={zoneTask}
                  payload={zoneTask.payload || {}}
                  onPayloadUpdate={handlePayloadUpdate}
                  onValidationChange={handleValidationChange}
                  readonly={false}
                />
              </CardContent>
            </Card>

            {/* Validation Status */}
            {validationState.errors && validationState.errors.length > 0 && (
              <Card className="mt-4 border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive mb-2">Validation Issues</h4>
                      <ul className="text-sm text-destructive/80 space-y-1">
                        {validationState.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      <ZoneToolsDock zone={zone as any} />
      <ZoneToolsPortals zone={zone as any} />
    </motion.div>
  );
};