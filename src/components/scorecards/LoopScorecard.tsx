import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Clock, Zap } from 'lucide-react';
import { LoopScorecard as LoopScorecardType } from '@/types/scorecard';
import { formatDistanceToNow } from 'date-fns';

interface LoopScorecardProps {
  scorecard: LoopScorecardType;
}

export const LoopScorecard: React.FC<LoopScorecardProps> = ({ scorecard }) => {
  const navigate = useNavigate();

  const getStatusColor = () => {
    if (scorecard.breach_count > 0) return 'destructive';
    if (scorecard.fatigue_score >= 3) return 'secondary';
    return 'default';
  };

  const getStatusText = () => {
    if (scorecard.breach_count > 0) return 'Breached';
    if (scorecard.fatigue_score >= 3) return 'Fatigued';
    return 'In-Band';
  };

  const getSlopeIcon = () => {
    if (scorecard.tri_slope > 0.1) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (scorecard.tri_slope < -0.1) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  const hasAlerts = scorecard.breach_days >= 7 || scorecard.fatigue_score >= 3 || scorecard.tri_slope <= -0.5;

  const handleOpenReflexive = () => {
    // Navigate to workspace with reflexive task for this loop
    navigate(`/workspace?loop=${scorecard.loop_id}&capacity=reflexive`);
  };

  const handleViewDetails = () => {
    navigate(`/registry/${scorecard.loop_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {scorecard.loop_name}
                {hasAlerts && (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusColor()}>
                  {getStatusText()}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getSlopeIcon()}
                  <span>{scorecard.tri_slope.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* TRI Values */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Time</div>
              <div className="font-medium">{scorecard.latest_tri.t_value.toFixed(1)}</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Resource</div>
              <div className="font-medium">{scorecard.latest_tri.r_value.toFixed(1)}</div>
            </div>
            <div className="p-2 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground">Impact</div>
              <div className="font-medium">{scorecard.latest_tri.i_value.toFixed(1)}</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Claim Velocity</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={Math.min(scorecard.claim_velocity * 20, 100)} 
                  className="w-16 h-2"
                />
                <span className="text-sm font-medium">{scorecard.claim_velocity}/wk</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fatigue Score</span>
              <div className="flex items-center gap-2">
                <Progress 
                  value={Math.min(scorecard.fatigue_score * 25, 100)} 
                  className="w-16 h-2"
                />
                <span className="text-sm font-medium">{scorecard.fatigue_score}</span>
              </div>
            </div>

            {scorecard.breach_count > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Breach Days</span>
                <Badge variant="destructive" className="text-xs">
                  {scorecard.breach_days} days
                </Badge>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">DE State</span>
              <Badge variant="outline" className="text-xs">
                {scorecard.de_state}
              </Badge>
            </div>
          </div>

          {/* Last Heartbeat */}
          {scorecard.heartbeat_at && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Last heartbeat: {formatDistanceToNow(new Date(scorecard.heartbeat_at), { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenReflexive}
              className="flex-1 flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              Reflexive Retune
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewDetails}
            >
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};