import React from 'react';
import ReflexiveBundle from '@/5c/bundles/reflexive';
import DeliberativeBundle from '@/5c/bundles/deliberative';
import AnticipatoryBundle from '@/5c/bundles/anticipatory';
import StructuralBundle from '@/5c/bundles/structural';
import { ResponsiveBundleAdapter } from './ResponsiveBundleAdapter';
import { ReflexiveCapacityWrapper } from '@/pages/ReflexiveCapacityWrapper';
import { DeliberativeCapacityWrapper } from '@/pages/DeliberativeCapacityWrapper';
import { AnticipatoryCapacityWrapper } from '@/pages/AnticipatoryCapacityWrapper';
import { StructuralCapacityWrapper } from '@/pages/StructuralCapacityWrapper';
import type { Capacity, CapacityBundleProps } from '@/types/capacity';
import type { EnhancedTask5C } from '@/5c/types';
import { toast } from 'sonner';
import { useInteractiveCapacityActions } from '@/hooks/useInteractiveCapacityActions';

interface DynamicCapacityBundleProps extends CapacityBundleProps {
  capacity: Capacity;
}

export const DynamicCapacityBundle: React.FC<DynamicCapacityBundleProps> = (bundleProps) => {
  const { capacity } = bundleProps;

  // Simplified interactive actions - pass null for now to avoid type issues
  const interactiveActions = useInteractiveCapacityActions(null);

  switch (capacity) {
    case 'responsive':
      return <ResponsiveBundleAdapter {...bundleProps} />;
    case 'reflexive': {
      // Use the new comprehensive Reflexive page
      const loopCode = bundleProps.taskData?.loop_id || 'UNKNOWN';
      const task5c: EnhancedTask5C = {
        id: bundleProps.taskId,
        capacity: 'reflexive',
        loop_id: loopCode,
        type: 'structural',
        scale: 'meso',
        leverage: 'P',
        tri: { t_value: 0.5, r_value: 0.6, i_value: 0.7 },
        title: bundleProps.taskData?.title || 'Reflexive Analysis',
        description: bundleProps.taskData?.description || 'Memory and optimization',
        status: 'open',
        payload: bundleProps.payload || {},
        user_id: bundleProps.taskData?.user_id || 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return (
        <ReflexiveCapacityWrapper
          loopCode={loopCode}
          indicator={bundleProps.payload?.indicator || 'Primary'}
          controllerSettings={{}}
          tuningHistory={[]}
          taskData={bundleProps.taskData}
        >
          <ReflexiveBundle task={task5c} />
        </ReflexiveCapacityWrapper>
      );
    }
    case 'deliberative': {
      // Convert task data to 5C format expected by DeliberativeBundle
      const task5c: EnhancedTask5C = { 
        id: bundleProps.taskId,
        capacity: 'deliberative',
        loop_id: bundleProps.taskData?.loop_id || 'DELIB-001',
        type: 'perceptual',
        scale: 'macro',
        leverage: 'S',
        tri: { t_value: 0.7, r_value: 0.6, i_value: 0.8 },
        title: bundleProps.taskData?.title || 'Strategic Architecture Planning',
        description: bundleProps.taskData?.description || 'Conduct comprehensive analysis and planning for next-generation system architecture',
        status: 'active',
        payload: bundleProps.payload || {},
        user_id: 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return (
        <DeliberativeCapacityWrapper
          loopCode={task5c.loop_id}
          indicator={bundleProps.payload?.indicator || 'Primary'}
          taskData={bundleProps.taskData}
        >
          <DeliberativeBundle task={task5c} />
        </DeliberativeCapacityWrapper>
      );
    }
    case 'anticipatory': {
      const task5c: EnhancedTask5C = {
        id: bundleProps.taskId,
        capacity: 'anticipatory',
        loop_id: bundleProps.taskData?.loop_id || 'ANTIC-001',
        type: 'perceptual',
        scale: 'meso',
        leverage: 'N',
        tri: { t_value: 0.6, r_value: 0.5, i_value: 0.8 },
        title: bundleProps.taskData?.title || 'Anticipatory Planning',
        description: bundleProps.taskData?.description || 'Future-oriented risk management',
        status: 'open',
        payload: bundleProps.payload || {},
        user_id: bundleProps.taskData?.user_id || 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return (
        <AnticipatoryCapacityWrapper
          loopCode={task5c.loop_id}
          indicator={bundleProps.payload?.indicator || 'Primary'}
          taskData={bundleProps.taskData}
          onArmWatchpoint={(riskChannel) => console.log('Arm watchpoint:', riskChannel)}
          onRunScenario={(scenarioId) => console.log('Run scenario:', scenarioId)}
          onStagePrePosition={(packIds) => console.log('Stage pre-position:', packIds)}
          onSaveTrigger={(templateId) => console.log('Save trigger:', templateId)}
        >
          <AnticipatoryBundle task={task5c} />
        </AnticipatoryCapacityWrapper>
      );
    }
    case 'structural': {
      const task5c: EnhancedTask5C = {
        id: bundleProps.taskId,
        capacity: 'structural',
        loop_id: bundleProps.taskData?.loop_id || 'STRUCT-001',
        type: 'structural',
        scale: 'meso',
        leverage: 'S',
        tri: { t_value: 0.7, r_value: 0.8, i_value: 0.6 },
        title: bundleProps.taskData?.title || 'Structural Analysis',
        description: bundleProps.taskData?.description || 'System architecture and design',
        status: 'open',
        payload: bundleProps.payload || {},
        user_id: bundleProps.taskData?.user_id || 'user-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return (
        <StructuralCapacityWrapper
          loopCode={task5c.loop_id}
          indicator={bundleProps.payload?.indicator || 'Primary'}
          taskData={bundleProps.taskData}
          onUpdateMandate={async (mandate) => console.log('Update mandate:', mandate)}
          onSaveProcessMap={async (processMap) => console.log('Save process map:', processMap)}
          onPublishStandard={async (standard) => console.log('Publish standard:', standard)}
        >
          <StructuralBundle task={task5c} />
        </StructuralCapacityWrapper>
      );
    }
    default:
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Capacity bundle not found: {capacity}
          </p>
        </div>
      );
  }
};