import React from 'react';
import ResponsiveBundle from '@/bundles/responsive';
import { ReflexiveBundle } from '@/bundles/reflexive';
import { DeliberativeBundle } from '@/bundles/deliberative';
import { AnticipatoryBundle } from '@/bundles/anticipatory';
import { StructuralBundle } from '@/bundles/structural';
import type { Capacity, CapacityBundleProps } from '@/types/capacity';

interface DynamicCapacityBundleProps extends CapacityBundleProps {
  capacity: Capacity;
}

export const DynamicCapacityBundle: React.FC<DynamicCapacityBundleProps> = (props) => {
  const { capacity, ...bundleProps } = props;

  // ResponsiveBundle has different props structure - for now show placeholder
  if (capacity === 'responsive') {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Responsive capacity bundle requires different integration - coming soon
        </p>
      </div>
    );
  }

  switch (capacity) {
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