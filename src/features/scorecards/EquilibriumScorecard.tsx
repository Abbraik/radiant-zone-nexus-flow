import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface EquilibriumScorecardProps {
  loopId: string;
  scorecard?: {
    last_tri: any;
    de_state: string;
    claim_velocity: number;
    fatigue: number;
  };
}

export const EquilibriumScorecard: React.FC<EquilibriumScorecardProps> = ({
  loopId,
  scorecard
}) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'stable': return 'text-green-600 bg-green-50';
      case 'diverging': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (velocity: number) => {
    if (velocity > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (velocity < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  if (!scorecard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equilibrium Scorecard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No scorecard data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Equilibrium Scorecard
          <Badge className={getStateColor(scorecard.de_state)}>
            {scorecard.de_state}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* TRI Values */}
          {scorecard.last_tri && (
            <div>
              <h4 className="text-sm font-medium mb-2">Latest TRI</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-500">
                    {scorecard.last_tri.T || 0}
                  </div>
                  <div className="text-xs text-gray-500">Tension</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-500">
                    {scorecard.last_tri.R || 0}
                  </div>
                  <div className="text-xs text-gray-500">Resonance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-500">
                    {scorecard.last_tri.I || 0}
                  </div>
                  <div className="text-xs text-gray-500">Impact</div>
                </div>
              </div>
            </div>
          )}

          {/* Claim Velocity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Claim Velocity</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(scorecard.claim_velocity)}
                <span className="text-sm">
                  {Math.abs(scorecard.claim_velocity).toFixed(1)}/week
                </span>
              </div>
            </div>
            <Progress 
              value={Math.min(Math.abs(scorecard.claim_velocity) * 10, 100)} 
              className="h-2"
            />
          </div>

          {/* Fatigue Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">System Fatigue</span>
              <span className="text-sm font-medium">
                {scorecard.fatigue}%
              </span>
            </div>
            <Progress 
              value={scorecard.fatigue} 
              className="h-2"
              // Change color based on fatigue level
              style={{
                '--progress-background': scorecard.fatigue > 75 
                  ? 'rgb(239 68 68)' 
                  : scorecard.fatigue > 50 
                  ? 'rgb(245 158 11)' 
                  : 'rgb(34 197 94)'
              } as React.CSSProperties}
            />
          </div>

          {/* Overall Health */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Health</span>
              <Badge variant={
                scorecard.de_state === 'stable' ? 'default' : 
                scorecard.de_state === 'diverging' ? 'secondary' : 
                'destructive'
              }>
                {scorecard.de_state === 'stable' ? 'Healthy' :
                 scorecard.de_state === 'diverging' ? 'At Risk' :
                 'Critical'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};