import React from 'react';
import { ReflexiveBundle } from '@/bundles/reflexive';
import DeliberativeBundleWrapper from '@/5c/bundles/deliberative';
import AnticipatoryBundle from '@/bundles/anticipatory/AnticipatoryBundle';
import { StructuralBundle } from '@/bundles/structural';
import { ResponsiveBundleAdapter } from './ResponsiveBundleAdapter';
import { ReflexiveCapacityWrapper } from '@/pages/ReflexiveCapacityWrapper';
import { DeliberativeCapacityWrapper } from '@/pages/DeliberativeCapacityWrapper';
import { AnticipatoryCapacityWrapper } from '@/pages/AnticipatoryCapacityWrapper';
import { StructuralCapacityWrapper } from '@/pages/StructuralCapacityWrapper';
import type { Capacity, CapacityBundleProps } from '@/types/capacity';
import type { EnhancedTask5C } from '@/5c/types';
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
        <ReflexiveCapacityWrapper
          loopCode={loopCode}
          indicator={indicator}
          controllerSettings={bundleProps.payload?.controllerSettings}
          tuningHistory={bundleProps.payload?.tuningHistory}
        >
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
          <DeliberativeBundleWrapper task={task5c} />
        </DeliberativeCapacityWrapper>
      );
    }
    case 'anticipatory': {
      const task = bundleProps.taskData;
      const params = new URLSearchParams(window.location.search);
      
      // Mock data - in real app this would come from props/context
      const mockWatchboard = [
        { 
          riskChannel: "ExternalDemand" as const, 
          ewsProb: 0.82, 
          trend: "up" as const, 
          leadTimeDays: 9, 
          linkedLoops: ["MAC-L06","MES-L03"], 
          bufferAdequacy: 0.32,
          series: [
            { t: "2024-01-01", v: 0.45 },
            { t: "2024-01-02", v: 0.52 },
            { t: "2024-01-03", v: 0.61 },
            { t: "2024-01-04", v: 0.72 },
            { t: "2024-01-05", v: 0.82 }
          ]
        },
        { 
          riskChannel: "Heat" as const, 
          ewsProb: 0.66, 
          trend: "flat" as const, 
          leadTimeDays: 6, 
          linkedLoops: ["MES-L01"], 
          bufferAdequacy: 0.5,
          series: [
            { t: "2024-01-01", v: 0.73 },
            { t: "2024-01-02", v: 0.68 },
            { t: "2024-01-03", v: 0.65 },
            { t: "2024-01-04", v: 0.67 },
            { t: "2024-01-05", v: 0.66 }
          ]
        },
        { 
          riskChannel: "WaterStress" as const, 
          ewsProb: 0.58, 
          trend: "up" as const, 
          leadTimeDays: 14, 
          linkedLoops: ["MES-L08"], 
          bufferAdequacy: 0.41,
          series: [
            { t: "2024-01-01", v: 0.35 },
            { t: "2024-01-02", v: 0.42 },
            { t: "2024-01-03", v: 0.48 },
            { t: "2024-01-04", v: 0.53 },
            { t: "2024-01-05", v: 0.58 }
          ]
        },
      ];

      const mockEwsComposition = [
        { 
          label: "External Demand", 
          weight: 0.35, 
          series: [
            { t: "2024-01-01", v: 0.45 },
            { t: "2024-01-02", v: 0.52 },
            { t: "2024-01-03", v: 0.61 },
            { t: "2024-01-04", v: 0.72 },
            { t: "2024-01-05", v: 0.82 }
          ]
        },
        { 
          label: "Heat Risk", 
          weight: 0.28, 
          series: [
            { t: "2024-01-01", v: 0.73 },
            { t: "2024-01-02", v: 0.68 },
            { t: "2024-01-03", v: 0.65 },
            { t: "2024-01-04", v: 0.67 },
            { t: "2024-01-05", v: 0.66 }
          ]
        },
        { 
          label: "Water Stress", 
          weight: 0.37, 
          series: [
            { t: "2024-01-01", v: 0.35 },
            { t: "2024-01-02", v: 0.42 },
            { t: "2024-01-03", v: 0.48 },
            { t: "2024-01-04", v: 0.53 },
            { t: "2024-01-05", v: 0.58 }
          ]
        }
      ];

      const mockBuffers = [
        { label: "Cash Reserve", current: 0.42, target: 0.60 },
        { label: "Inventory", current: 0.28, target: 0.45 },
        { label: "Capacity", current: 0.73, target: 0.80 },
        { label: "Supply Chain", current: 0.32, target: 0.50 }
      ];

      const mockGeoGrid = Array.from({ length: 32 }, (_, i) => ({
        id: `cell-${i}`,
        value: Math.random() * 0.8 + 0.1 // Random values between 0.1 and 0.9
      }));

      const mockScenarios = [
        { id: "s1", name: "Heat +3°C", summary: "High temperature scenario" },
        { id: "s2", name: "Supply Shock", summary: "Major supplier disruption" },
      ];

      const mockPrePositionPacks = [
        { 
          id: "pack1", 
          title: "Resource Pack", 
          items: [{ label: "Emergency supplies", note: "72hr capacity" }], 
          status: "draft" as const,
          costCeiling: 250000,
          readinessScore: 0.85,
          shelfLifeDays: 45
        },
        { 
          id: "pack2", 
          title: "Regulatory Pack", 
          items: [{ label: "Emergency declarations" }], 
          status: "armed" as const,
          costCeiling: 150000,
          readinessScore: 0.92,
          shelfLifeDays: 90
        },
      ];

      const mockTriggerTemplates = [
        { id: "t1", name: "Heat Emergency", condition: "Temperature threshold exceeded", thresholdLabel: "Max temp ≥ 38°C for 3+ days" },
      ];

      return (
        <AnticipatoryCapacityWrapper
          loopCode={task?.loop_id || bundleProps.taskData?.loop_id || "MAC-L01"}
          indicator={bundleProps.payload?.indicator || "Primary"}
          screen={params.get('screen') as any || 'risk-watchboard'}
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
        >
          <AnticipatoryBundle 
            loopCode={task?.loop_id || bundleProps.taskData?.loop_id || "MAC-L01"}
            indicator={bundleProps.payload?.indicator || "Primary"}
            ewsProb={0.78}
            leadTimeDays={9}
            bufferAdequacy={0.32}
            consentRequired={false}
            screen={params.get('screen') as any || 'risk-watchboard'}
            watchboard={mockWatchboard}
            ewsComposition={mockEwsComposition}
            buffers={mockBuffers}
            geoGrid={mockGeoGrid}
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
        </AnticipatoryCapacityWrapper>
      );
    }
    case 'structural':
      return (
        <StructuralCapacityWrapper
          loopCode={bundleProps.taskData?.loop_id || 'STRUCT-001'}
          indicator={bundleProps.payload?.indicator || 'Primary'}
          screen={bundleProps.payload?.screen}
        >
          <StructuralBundle {...bundleProps} />
        </StructuralCapacityWrapper>
      );
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