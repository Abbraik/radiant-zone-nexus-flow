import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../hooks/useTasks';
import { Skeleton } from '../ui/skeleton';
import { ThinkZoneWorkspace } from '../zones/ThinkZoneWorkspace';
import { ActZoneWizard } from '../../pages/ActZoneWizard';
import { MonitorZoneWorkspace } from '../zones/MonitorZoneWorkspace';
import { InnovateLearnZoneWorkspace } from '../zones/InnovateLearnZoneWorkspace';

interface DynamicWidgetProps {
  widgetName: string;
  task: Task;
}

// Dynamic imports for all widgets
const widgetComponents = {
  TensionSelector: lazy(() => import('../widgets/TensionSelector')),
  SRTRangeSlider: lazy(() => import('../widgets/SRTRangeSlider')),
  SprintAnalyzer: lazy(() => import('../widgets/SprintAnalyzer')),
  TensionChips: lazy(() => import('../widgets/TensionChips')),
  PolicySelector: lazy(() => import('../widgets/PolicySelector')),
  
  InterventionPicker: lazy(() => import('../widgets/InterventionPicker')),
  BundlePreview: lazy(() => import('../widgets/BundlePreview')),
  SmartRolesPanel: lazy(() => import('../widgets/SmartRolesPanel')),
  RACIMatrix: lazy(() => import('../widgets/RACIMatrix')),
  InterventionScheduler: lazy(() => import('../widgets/InterventionScheduler')),
  DependencyGraph: lazy(() => import('../widgets/DependencyGraph')),
  
  LoopTable: lazy(() => import('../widgets/LoopTable')),
  TRIDetailDrawer: lazy(() => import('../widgets/TRIDetailDrawer')),
  PulseBarOverview: lazy(() => import('../widgets/PulseBarOverview')),
  TrendSparklines: lazy(() => import('../widgets/TrendSparklines')),
  AdvancedAnalytics: lazy(() => import('../widgets/AdvancedAnalytics')),
  
  SimulationParams: lazy(() => import('../widgets/SimulationParams')),
  SimulationPreview: lazy(() => import('../widgets/SimulationPreview')),
  InsightFeed: lazy(() => import('../widgets/InsightFeed')),
  ExperimentStudio: lazy(() => import('../widgets/ExperimentStudio')),
  KnowledgeGraph: lazy(() => import('../widgets/KnowledgeGraph')),
  OrsExporter: lazy(() => import('../widgets/OrsExporter')),
  
  // Phase 2: 3D Components
  Cascade3DViewer: lazy(() => import('../widgets/Cascade3DWidget')),
  DigitalTwinPreview: lazy(() => import('../widgets/DigitalTwinWidget')),
  
  // Think Zone Components
  ScenarioPlanner: lazy(() => import('../widgets/ScenarioPlanner'))
};

const LoadingSkeleton = () => (
  <div className="space-y-4 p-6 bg-glass/50 backdrop-blur-20 rounded-2xl">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const DynamicWidget: React.FC<DynamicWidgetProps> = ({ widgetName, task }) => {
  // Debug logging
  console.log('DynamicWidget render:', { widgetName, taskZone: task.zone, taskType: task.type });
  
  // Check if this is a zone workspace request
  if (widgetName === 'ZoneWorkspace') {
    switch (task.zone) {
      case 'think':
        console.log('DynamicWidget: Rendering enhanced ThinkZoneWorkspace for think task');
        return <ThinkZoneWorkspace />;
        case 'act':
          return <ActZoneWizard />;
      case 'monitor':
        return <MonitorZoneWorkspace />;
      case 'innovate-learn':
        return <InnovateLearnZoneWorkspace />;
      default:
        return (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">Unknown zone: {task.zone}</p>
          </div>
        );
    }
  }

  const WidgetComponent = widgetComponents[widgetName as keyof typeof widgetComponents];

  if (!WidgetComponent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="p-6 bg-glass/50 backdrop-blur-20 rounded-2xl border border-white/10"
      >
        <div className="text-center text-gray-400">
          Widget "{widgetName}" not found
        </div>
      </motion.div>
    );
  }

  // Generate props based on widget type and task
  const getWidgetProps = () => {
    const baseProps = { task };
    
    // Add specific props based on widget type
    switch (widgetName) {
      case 'TensionSelector':
      case 'SRTRangeSlider':
        return { ...baseProps, loopId: task.loop_id };
      case 'InterventionPicker':
      case 'BundlePreview':
      case 'SmartRolesPanel':
        return { ...baseProps, bundleId: task.loop_id };
      case 'LoopTable':
        return { ...baseProps, filter: { loopId: task.loop_id } };
      case 'TRIDetailDrawer':
        return { ...baseProps, loopId: task.loop_id };
      case 'SimulationParams':
      case 'SimulationPreview':
        return { ...baseProps, scenarioId: task.loop_id };
      case 'Cascade3DViewer':
      case 'DigitalTwinPreview':
        return baseProps;
      default:
        return baseProps;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="mb-6"
    >
      <Suspense fallback={<LoadingSkeleton />}>
        <WidgetComponent {...getWidgetProps()} />
      </Suspense>
    </motion.div>
  );
};