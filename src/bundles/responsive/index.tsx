import React, { useState } from 'react';
import type { CapacityBundleProps } from '@/types/capacity';
import { CheckpointConsole } from './components/CheckpointConsole';
import { GuardrailsPanel } from './components/GuardrailsPanel';
import { QuickActionsBar } from './components/QuickActionsBar';
import { HarmonizationDrawer } from './components/HarmonizationDrawer';
import { MicroLoopAlertRail } from '@/components/monitor/MicroLoopAlertRail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
  const claimId = (taskData as any)?.claim_id || 'mock-claim-id';
  const loopData = (taskData as any)?.loop || { id: 'mock-loop', name: 'Sample Loop', type: 'micro', scale: 'micro' };
  
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
      {/* Header - Simplified */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-background/95 backdrop-blur-sm"
      >
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">{loopData.name}</h1>
              <Badge variant="outline">Responsive Mode</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge>Leverage: N→P</Badge>
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Execution Track */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Claim Panel - Simplified */}
            <Card>
              <CardHeader>
                <CardTitle>Active Claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Claim execution in progress...</p>
              </CardContent>
            </Card>
            
            <CheckpointConsole 
              claimId={claimId}
              onCheckpointCreated={handleMarkCheckpoint}
            />
          </div>

          {/* Right Column - Safety & Signals */}
          <div className="space-y-6">
            <MicroLoopAlertRail 
              workspaceType="monitor"
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