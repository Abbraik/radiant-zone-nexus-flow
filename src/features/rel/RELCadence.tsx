import React from 'react';
import { createCapacityService } from '@/services/capacity-api';
import { EquilibriumScorecard } from '@/features/scorecards/EquilibriumScorecard';
import { MandateGate } from '@/features/mandateGate/MandateGate';
import { useFeatureFlags } from '@/components/layout/FeatureFlagProvider';

interface RELCadenceProps {
  loopId: string;
  interval?: number; // milliseconds
}

export const RELCadence: React.FC<RELCadenceProps> = ({ 
  loopId, 
  interval = 5000 // 5 seconds default
}) => {
  const { flags } = useFeatureFlags();
  const [relScore, setRelScore] = React.useState(94);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (!flags.REL_CADENCE || !isActive) return;

    const updateREL = () => {
      // Simulate REL score updates
      const variance = (Math.random() - 0.5) * 4; // +/- 2 points
      setRelScore(prev => Math.max(0, Math.min(100, prev + variance)));
    };

    const intervalId = setInterval(updateREL, interval);
    
    return () => clearInterval(intervalId);
  }, [flags.REL_CADENCE, isActive, interval]);

  if (!flags.REL_CADENCE) return null;

  const getRELColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">REL:</span>
      <span className={`font-medium ${getRELColor(relScore)}`}>
        {relScore.toFixed(1)}%
      </span>
      <div 
        className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}
        title={`REL Cadence ${isActive ? 'Active' : 'Inactive'}`}
      />
    </div>
  );
};