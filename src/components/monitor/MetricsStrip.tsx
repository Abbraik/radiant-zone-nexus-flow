import React from 'react';
import { ds } from '@/services/datasource';
import ParallaxCard from '@/components/motion/ParallaxCard';

export default function MetricsStrip() {
  const [metrics, setMetrics] = React.useState({ tri: 0, pci: 0, mttrDays: 0, uptakePct: 0 });

  React.useEffect(() => {
    ds.getMetricsSummary().then(setMetrics);
  }, []);

  const MetricTile = ({ label, value, unit = '', color = 'text-white' }: { 
    label: string; 
    value: number; 
    unit?: string; 
    color?: string; 
  }) => (
    <ParallaxCard className="glass-panel min-w-[160px]">
      <div className="tile-title mb-1">{label}</div>
      <div className={`tile-value ${color}`}>
        {typeof value === 'number' ? value.toFixed(value % 1 === 0 ? 0 : 1) : value}{unit}
      </div>
    </ParallaxCard>
  );

  return (
    <div className="flex gap-3 w-full max-w-4xl">
      <MetricTile 
        label="TRI"
        value={metrics.tri}
        color={metrics.tri >= 70 ? 'text-green-400' : metrics.tri >= 50 ? 'text-yellow-400' : 'text-red-400'}
      />
      <MetricTile 
        label="PCI" 
        value={metrics.pci}
        color={metrics.pci >= 70 ? 'text-green-400' : metrics.pci >= 50 ? 'text-yellow-400' : 'text-red-400'}
      />
      <MetricTile 
        label="MTTR"
        value={metrics.mttrDays}
        unit=" days"
        color={metrics.mttrDays <= 10 ? 'text-green-400' : metrics.mttrDays <= 15 ? 'text-yellow-400' : 'text-red-400'}
      />
      <MetricTile 
        label="Uptake"
        value={metrics.uptakePct}
        unit="%"
        color={metrics.uptakePct >= 70 ? 'text-green-400' : metrics.uptakePct >= 50 ? 'text-yellow-400' : 'text-red-400'}
      />
    </div>
  );
}