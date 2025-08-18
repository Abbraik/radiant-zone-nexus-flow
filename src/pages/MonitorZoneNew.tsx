import React from 'react';
import { ZonePage } from '../components/zones/ZonePage';
import MonitorZoneComponent from './MonitorZone';

export { default as MonitorZoneWorkspace } from './MonitorZone';

export const MonitorZone: React.FC = () => {
  return (
    <ZonePage
      zone="monitor"
      zoneName="Monitor"
      description="Track system health, respond to breaches, and analyze performance metrics"
      fallbackComponent={MonitorZoneComponent}
    />
  );
};