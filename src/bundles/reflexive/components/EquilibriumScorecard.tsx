import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gauge, TrendingUp, TrendingDown, Activity, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface EquilibriumScorecardProps {
  scorecard?: {
    latest_t_value: number;
    latest_r_value: number;
    latest_i_value: number;
    de_state: string;
    claim_velocity: number;
    fatigue_score: number;
    breach_count: number;
    breach_days: number;
    tri_slope: number;
  };
  onOpenRetune?: () => void;
}

export const EquilibriumScorecard: React.FC<EquilibriumScorecardProps> = ({
  scorecard,
  onOpenRetune
}) => {
  if (!scorecard) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No scorecard data available</p>
        </CardContent>
      </Card>
    );
  }

  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'stable': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'unstable': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-500/10 text-red-700 border-red-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (slope: number) => {
    if (slope > 0.1) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (slope < -0.1) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusBadge = () => {
    if (scorecard.breach_count > 0) {
      return <Badge variant="destructive">Breached ({scorecard.breach_days}d)</Badge>;
    }
    if (scorecard.fatigue_score >= 3) {
      return <Badge variant="secondary">Fatigued ({scorecard.fatigue_score})</Badge>;
    }
    return <Badge variant="outline">In-Band</Badge>;
  };

  const hasAlerts = scorecard.breach_count > 0 || scorecard.fatigue_score >= 3 || scorecard.tri_slope <= -0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              Unified Equilibrium Scorecard
              {hasAlerts && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* TRI Values Display */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">
                {scorecard.latest_t_value.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">Tension</div>
              <Progress 
                value={scorecard.latest_t_value * 100} 
                className="h-2"
              />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">
                {scorecard.latest_r_value.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">Resonance</div>
              <Progress 
                value={scorecard.latest_r_value * 100} 
                className="h-2"
              />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {scorecard.latest_i_value.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">Impact</div>
              <Progress 
                value={scorecard.latest_i_value * 100} 
                className="h-2"
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <Badge className={getStateColor(scorecard.de_state)} variant="outline">
                {scorecard.de_state}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">DE State</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {getTrendIcon(scorecard.tri_slope)}
                <span className="font-medium">{scorecard.claim_velocity}/wk</span>
              </div>
              <div className="text-xs text-muted-foreground">Claim Velocity</div>
            </div>

            <div className="text-center">
              <div className="font-medium text-orange-500">
                {scorecard.fatigue_score}
              </div>
              <div className="text-xs text-muted-foreground">Fatigue Level</div>
            </div>

            <div className="text-center">
              <div className="font-medium">
                {scorecard.tri_slope > 0 ? '+' : ''}{scorecard.tri_slope.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground">TRI Slope</div>
            </div>
          </div>

          {/* Action Button */}
          {onOpenRetune && (
            <div className="pt-4 border-t">
              <Button 
                onClick={onOpenRetune} 
                className="w-full gap-2"
                variant={hasAlerts ? "default" : "outline"}
              >
                <Zap className="h-4 w-4" />
                Open Retune Panel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};