import React from 'react';
import { ZonePage } from '../components/zones/ZonePage';
import { ThinkZoneWorkspace } from '../components/zones/ThinkZoneWorkspace';

export const ThinkZone: React.FC = () => {
  return (
    <ZonePage
      zone="think"
      zoneName="Think"
      description="Design and analyze system dynamics, loops, and leverage points"
      fallbackComponent={ThinkZoneWorkspace}
    />
  );
};