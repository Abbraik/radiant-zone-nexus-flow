import React from 'react';
import { ReflexiveBundle } from '@/bundles/reflexive';
import { DeliberativeBundle } from '@/bundles/deliberative';
import { AnticipatoryBundle } from '@/bundles/anticipatory';
import { StructuralBundle } from '@/bundles/structural';
import { ResponsiveBundleAdapter } from './ResponsiveBundleAdapter';
import type { Capacity, CapacityBundleProps } from '@/types/capacity';

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
      // Use new anticipatory bundle with screens
      const loopCode = bundleProps.taskData?.loop_id || 'UNKNOWN';
      const indicator = bundleProps.payload?.indicator || 'Primary';
      const screen = new URLSearchParams(window.location.search).get('screen') as 
        "risk-watchboard" | "scenario-sim" | "pre-positioner" | "trigger-library" || "risk-watchboard";
      const decision = bundleProps.payload?.decision || {
        decisionId: 'mock-decision',
        severity: 0.5,
        loopCode,
        indicator,
        consent: { requireDeliberative: false, legitimacyGap: 0.2 },
        guardrails: { caps: [] },
        srt: { horizon: "P30D", cadence: "weekly" },
        scores: { responsive: 40, reflexive: 50, deliberative: 60, anticipatory: 80, structural: 30 },
        order: ['anticipatory', 'deliberative', 'reflexive', 'responsive', 'structural'],
        primary: 'anticipatory' as const,
        templateActions: []
      };
      const reading = bundleProps.payload?.reading || {
        loopCode,
        indicator,
        ewsProb: 0.75,
        bufferAdequacy: 0.4,
        dispersion: 0.3,
        persistencePk: 30
      };
      
      return (
        <AnticipatoryBundle
          loopCode={loopCode}
          indicator={indicator}
          decision={decision}
          reading={reading}
          screen={screen}
          onHandoff={(to, reason) => {
            console.log(`Handoff to ${to}: ${reason}`);
            // Handle handoff logic here
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