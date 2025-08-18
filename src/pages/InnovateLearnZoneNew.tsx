import React from 'react';
import { ZonePage } from '../components/zones/ZonePage';
import { InnovateLearnZoneWorkspace } from '../components/zones/InnovateLearnZoneWorkspace';

export const InnovateLearnZone: React.FC = () => {
  return (
    <ZonePage
      zone="innovate-learn"
      zoneName="Innovate & Learn"
      description="Design experiments, run simulations, and capture insights from system testing"
      fallbackComponent={InnovateLearnZoneWorkspace}
    />
  );
};