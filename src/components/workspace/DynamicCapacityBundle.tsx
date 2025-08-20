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
      // Extract required props from task data
      const loopCode = bundleProps.taskData?.loop_id || 'UNKNOWN';
      const indicator = bundleProps.payload?.indicator || 'Primary';
      const decision = bundleProps.payload?.decision || {
        severity: 0.5,
        loopCode,
        indicator,
        consent: { requireDeliberative: false },
        guardrails: { caps: [] },
        srt: { horizon: "P14D", cadence: "daily" }
      };
      const reading = bundleProps.payload?.reading;
      const screen = bundleProps.payload?.screen || "controller-tuner";
      
      return (
        <ReflexiveBundle 
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
    case 'deliberative':
      return <DeliberativeBundle {...bundleProps} />;
    case 'anticipatory':
      return <AnticipatoryBundle {...bundleProps} />;
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