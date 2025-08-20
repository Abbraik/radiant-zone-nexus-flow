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
    case 'reflexive':
      return <ReflexiveBundle {...bundleProps} />;
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