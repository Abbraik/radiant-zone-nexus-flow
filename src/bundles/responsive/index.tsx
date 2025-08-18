import React, { useState } from 'react';
import type { CapacityBundleProps } from '@/types/capacity';
import { ResponsiveHeader } from './components/ResponsiveHeader';
import { ActiveClaimPanel } from './components/ActiveClaimPanel';
import { SubStepPlanner } from './components/SubStepPlanner';
import { CheckpointConsole } from './components/CheckpointConsole';
import { GuardrailsPanel } from './components/GuardrailsPanel';
import { QuickActionsBar } from './components/QuickActionsBar';
import { HarmonizationDrawer } from './components/HarmonizationDrawer';
import { MicroLoopAlertRail } from '@/components/monitor/MicroLoopAlertRail';

export const ResponsiveBundle: React.FC<CapacityBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const [showHarmonization, setShowHarmonization] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  
  // Mock data - should come from task/claim
  const claimId = taskData?.claim_id || 'mock-claim-id';
  const loopData = taskData?.loop || { id: 'mock-loop', name: 'Sample Loop', type: 'micro', scale: 'micro' };
  
  // Mock conflicts for demo
  const conflicts = [
    {
      id: 'conflict-1',
      loopName: 'Resource Optimization Loop',
      actor: 'DevOps Team',
      leverIntent: 'N→P' as const,
      sharedNodes: ['Infrastructure', 'Database'],
      status: 'active' as const,
      priority: 'high' as const
    }
  ];

  const handleMarkCheckpoint = () => {
    onPayloadUpdate({
      ...payload,
      lastCheckpoint: new Date().toISOString(),
      checkpointCount: (payload?.checkpointCount || 0) + 1
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <ResponsiveHeader 
        loop={loopData}
        task={taskData}
        claimId={claimId}
      />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Execution Track */}
          <div className="lg:col-span-2 space-y-6">
            <ActiveClaimPanel 
              claimId={claimId}
              readonly={readonly}
            />
            
            <SubStepPlanner 
              claimId={claimId}
              readonly={readonly}
              reorderMode={reorderMode}
              onReorderModeChange={setReorderMode}
            />
            
            <CheckpointConsole 
              claimId={claimId}
              onCheckpointCreated={handleMarkCheckpoint}
            />
          </div>

          {/* Right Column - Safety & Signals */}
          <div className="space-y-6">
            <MicroLoopAlertRail 
              workspaceType="responsive"
              onCreateTask={() => {}}
              maxVisible={5}
            />
            
            <GuardrailsPanel 
              claimId={claimId}
              isManager={true} // TODO: Get from user role
            />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <QuickActionsBar 
        claimId={claimId}
        readonly={readonly}
        onAddSubstep={() => {}}
        onReorderMode={() => setReorderMode(!reorderMode)}
        onMarkCheckpoint={handleMarkCheckpoint}
        onRequestEscalation={() => {}}
        onSwitchMode={() => {}}
      />

      {/* Harmonization Drawer */}
      <HarmonizationDrawer 
        conflicts={conflicts}
        isOpen={showHarmonization}
        onOpenChange={setShowHarmonization}
        isManager={true} // TODO: Get from user role
      />
    </div>
  );
};