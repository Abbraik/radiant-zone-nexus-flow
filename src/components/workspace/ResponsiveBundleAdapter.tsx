import React, { useCallback } from 'react';
import ResponsiveBundle from '@/bundles/responsive/ResponsiveBundle';
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
    srt: { cadence: '1 hour', horizon: 'P14D' },
    consent: { requireDeliberative: false },
    order: ['responsive' as const],
    templateActions: [],
    decisionId: `decision-${Date.now()}`,
    scores: { responsive: 1.0 },
    primary: 'responsive' as const,
    secondary: undefined,
    loopCode: loopCode,
    indicator: indicator
  };
  const reading = payload?.reading || {
    value: 42.3,
    lower: 35,
    upper: 45,
    slope: 0.12,
    oscillation: 0.6,
    dispersion: 0.4,
    persistencePk: 0.3,
    integralError: 0.2,
    hubSaturation: 0.7,
    guardrailViolation: payload?.guardrailViolation || null
  };
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
    <ResponsiveBundle
      loopCode={loopCode}
      indicator={indicator}
      decision={decision}
      reading={reading}
      lastIncidentId={lastIncidentId}
      onHandoff={handleHandoff}
    />
  );
};