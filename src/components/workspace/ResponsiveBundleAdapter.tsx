import React, { useCallback } from 'react';
import ResponsiveBundle from '@/bundles/responsive';
import type { CapacityBundleProps } from '@/types/capacity';
import { useResponsiveIntegration } from '@/hooks/useResponsiveIntegration';

interface ResponsiveBundleAdapterProps extends CapacityBundleProps {}

export const ResponsiveBundleAdapter: React.FC<ResponsiveBundleAdapterProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const {
    handleUpsertIncident,
    handleAppendIncidentEvent,
    handleCreateSprintWithTasks,
    handleOpenClaimDrawer
  } = useResponsiveIntegration(payload, onPayloadUpdate);

  // Extract responsive-specific data from task payload
  const loopCode = taskData?.loop_id || payload?.loopCode || 'UNKNOWN';
  const indicator = payload?.indicator || 'primary';
  const decision = payload?.decision || {
    severity: 0.5,
    guardrails: { timeboxDays: 14, caps: [] },
    srt: { cadence: '1 hour' },
    consent: { requireDeliberative: false }
  };
  const reading = payload?.reading;
  const lastIncidentId = payload?.lastIncidentId;

  const handleHandoff = useCallback((to: "reflexive"|"deliberative"|"structural", reason: string) => {
    // Update payload to indicate handoff request
    onPayloadUpdate({
      ...payload,
      handoffRequest: {
        to,
        reason,
        timestamp: new Date().toISOString()
      }
    });
  }, [payload, onPayloadUpdate]);

  // Global function injection for the bundle
  React.useEffect(() => {
    // @ts-ignore - Injecting global functions for the bundle
    window.upsertIncident = handleUpsertIncident;
    // @ts-ignore
    window.appendIncidentEvent = handleAppendIncidentEvent;
    // @ts-ignore
    window.createSprintWithTasks = handleCreateSprintWithTasks;
    // @ts-ignore
    window.openClaimDrawer = handleOpenClaimDrawer;

    return () => {
      // @ts-ignore - Cleanup
      delete window.upsertIncident;
      // @ts-ignore
      delete window.appendIncidentEvent;
      // @ts-ignore
      delete window.createSprintWithTasks;
      // @ts-ignore
      delete window.openClaimDrawer;
    };
  }, [handleUpsertIncident, handleAppendIncidentEvent, handleCreateSprintWithTasks, handleOpenClaimDrawer]);

  // Mark as valid by default for responsive capacity
  React.useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  return (
    <div className="space-y-4">
      <ResponsiveBundle
        loopCode={loopCode}
        indicator={indicator}
        decision={decision}
        reading={reading}
        lastIncidentId={lastIncidentId}
        onHandoff={handleHandoff}
      />
      
      {payload?.handoffRequest && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <span className="font-medium">Handoff Requested:</span>
            <span>{payload.handoffRequest.to} capacity</span>
          </div>
          <div className="text-sm text-amber-700 mt-1">
            {payload.handoffRequest.reason}
          </div>
        </div>
      )}
      
      {payload?.availableTasks && payload.availableTasks.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <span className="font-medium">Tasks Available:</span>
            <span>{payload.availableTasks.length} tasks ready for claiming</span>
          </div>
        </div>
      )}
    </div>
  );
};