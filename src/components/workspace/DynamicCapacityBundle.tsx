import React from 'react';
import { ReflexiveBundle } from '@/bundles/reflexive';
import { DeliberativeBundle } from '@/bundles/deliberative';
import AnticipatoryBundle from '@/bundles/anticipatory/AnticipatoryBundle';
import { StructuralBundle } from '@/bundles/structural';
import { ResponsiveBundleAdapter } from './ResponsiveBundleAdapter';
import type { Capacity, CapacityBundleProps } from '@/types/capacity';
import { toast } from 'sonner';

interface DynamicCapacityBundleProps extends CapacityBundleProps {
  capacity: Capacity;
}

export const DynamicCapacityBundle: React.FC<DynamicCapacityBundleProps> = (props) => {
  const { capacity, ...bundleProps } = props;

  switch (capacity) {
    case 'responsive':
      return <ResponsiveBundleAdapter {...bundleProps} />;
    case 'reflexive': {
      // Use the new comprehensive Reflexive page
      const loopCode = bundleProps.taskData?.loop_id || 'UNKNOWN';
      const indicator = bundleProps.payload?.indicator || 'Primary';
      const decision = bundleProps.payload?.decision || {
        decisionId: 'mock-decision',
        severity: 0.5,
        loopCode,
        indicator,
        consent: { requireDeliberative: false, legitimacyGap: 0.2 },
        guardrails: { caps: [] },
        srt: { horizon: "P14D", cadence: "daily" },
        scores: { responsive: 60, reflexive: 80, deliberative: 40, anticipatory: 30, structural: 20 },
        order: ['reflexive', 'responsive', 'deliberative', 'anticipatory', 'structural'],
        primary: 'reflexive' as const,
        templateActions: []
      };
      const reading = bundleProps.payload?.reading || {
        loopCode,
        indicator,
        value: 0.65,
        lower: 0.3,
        upper: 0.8,
        oscillation: 0.4,
        rmseRel: 0.3,
        dispersion: 0.35,
        slope: 0.02,
        persistencePk: 0.2,
        integralError: 0.1,
        dataPenalty: 0.0
      };
      
      // Dynamic import the new page
      const ReflexiveCapacityPage = React.lazy(() => import('@/pages/reflexive/ReflexiveCapacityPage'));
      
      return (
        <React.Suspense fallback={<div className="p-6">Loading Reflexive Capacity...</div>}>
          <ReflexiveCapacityPage
            loopCode={loopCode}
            indicator={indicator}
            decision={decision}
            reading={reading}
            onHandoff={(to, reason) => {
              console.log(`Handoff to ${to}: ${reason}`);
              // Handle handoff logic here
            }}
          />
        </React.Suspense>
      );
    }
    case 'deliberative':
      return <DeliberativeBundle {...bundleProps} />;
    case 'anticipatory': {
      const task = bundleProps.taskData;
      const params = new URLSearchParams(window.location.search);
      
      // Mock data - in real app this would come from props/context
      const mockWatchboard = [
        { riskChannel: "ExternalDemand" as const, ewsProb: 0.82, trend: "up" as const, leadTimeDays: 9, linkedLoops: ["MAC-L06","MES-L03"], bufferAdequacy: 0.32 },
        { riskChannel: "Heat" as const, ewsProb: 0.66, trend: "flat" as const, leadTimeDays: 6, linkedLoops: ["MES-L01"], bufferAdequacy: 0.5 },
        { riskChannel: "WaterStress" as const, ewsProb: 0.58, trend: "up" as const, leadTimeDays: 14, linkedLoops: ["MES-L08"], bufferAdequacy: 0.41 },
      ];
      const mockScenarios = [
        { id: "s1", name: "Heat +3°C", summary: "High temperature scenario" },
        { id: "s2", name: "Supply Shock", summary: "Major supplier disruption" },
      ];
      const mockPrePositionPacks = [
        { id: "pack1", title: "Resource Pack", items: [{ label: "Emergency supplies", note: "72hr capacity" }], status: "draft" as const },
        { id: "pack2", title: "Regulatory Pack", items: [{ label: "Emergency declarations" }], status: "armed" as const },
      ];
      const mockTriggerTemplates = [
        { id: "t1", name: "Heat Emergency", condition: "Temperature threshold exceeded", thresholdLabel: "Max temp ≥ 38°C for 3+ days" },
      ];

        return (
          <AnticipatoryBundle 
            loopCode={task?.loop_id || bundleProps.taskData?.loop_id || "MAC-L01"}
            indicator={bundleProps.payload?.indicator || "Primary"}
            ewsProb={0.78}
            leadTimeDays={9}
            bufferAdequacy={0.32}
            consentRequired={false}
            screen={params.get('screen') as any || 'risk-watchboard'}
            watchboard={mockWatchboard}
            scenarios={mockScenarios}
            prePositionPacks={mockPrePositionPacks}
            triggerTemplates={mockTriggerTemplates}
            handoff={{
              enableResponsive: true,
              enableDeliberative: false,
              enableStructural: false,
              onHandoff: (to) => {
                console.log('Handoff requested:', { to });
                toast.info(`Handoff to ${to} capacity`);
              }
            }}
            onArmWatchpoint={(riskChannel) => {
              console.log('Arm watchpoint:', riskChannel);
              toast.success(`Armed watchpoint for ${riskChannel}`);
            }}
            onRunScenario={(scenarioId) => {
              console.log('Run scenario:', scenarioId);
              toast.success(`Running scenario ${scenarioId}`);
            }}
            onStagePrePosition={(packIds) => {
              console.log('Stage pre-position:', packIds);
              toast.success(`Staged pre-position packs: ${packIds.join(', ')}`);
            }}
            onSaveTrigger={(templateId) => {
              console.log('Save trigger:', templateId);
              toast.success(`Saved trigger ${templateId}`);
            }}
            onEvent={(name, payload) => {
              console.log('Analytics event:', name, payload);
            }}
          />
        );
    }
    case 'structural':
      return <StructuralBundle {...bundleProps} />;
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