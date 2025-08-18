import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Activity, TrendingUp, Gauge, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CapacityBundleProps } from '@/types/capacity';

export const ReflexiveBundle: React.FC<CapacityBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const handleApplyRetune = () => {
    // Updates de_bands + scorecard via RPC
    onPayloadUpdate({
      ...payload,
      lastRetune: new Date().toISOString(),
      retuneCount: (payload?.retuneCount || 0) + 1
    });
  };

  // Mock data for demonstration
  const scorecardData = {
    triValues: { T: 0.7, R: 0.8, I: 0.6 },
    deState: 'stable',
    claimVelocity: 1.2,
    fatigue: 0.3
  };

  return (
    <div className="space-y-6">
      {/* Unified Equilibrium Scorecard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hover-scale"
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-500" />
              Unified Equilibrium Scorecard
              <Badge variant="outline">Live Metrics</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* TRI Values */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">TRI Values</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Tension</span>
                    <span className="text-sm font-medium text-red-500">{scorecardData.triValues.T}</span>
                  </div>
                  <Progress value={scorecardData.triValues.T * 100} className="h-1" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Resonance</span>
                    <span className="text-sm font-medium text-green-500">{scorecardData.triValues.R}</span>
                  </div>
                  <Progress value={scorecardData.triValues.R * 100} className="h-1" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Impact</span>
                    <span className="text-sm font-medium text-blue-500">{scorecardData.triValues.I}</span>
                  </div>
                  <Progress value={scorecardData.triValues.I * 100} className="h-1" />
                </div>
              </div>

              {/* DE State */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">DE State</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500 mb-2">{scorecardData.deState}</div>
                  <Badge variant="secondary" className="text-xs">Normal Range</Badge>
                </div>
              </div>

              {/* Claim Velocity */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Claim Velocity</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-2">{scorecardData.claimVelocity}</div>
                  <div className="text-xs text-muted-foreground">claims/hour</div>
                  <Badge variant="outline" className="text-xs mt-1">+20% vs baseline</Badge>
                </div>
              </div>

              {/* Fatigue Level */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Fatigue Level</h4>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-2">{scorecardData.fatigue}</div>
                  <Progress value={scorecardData.fatigue * 100} className="h-2 mb-2" />
                  <Badge variant="secondary" className="text-xs">Low</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Band Retune Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hover-scale"
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              Band Retune Suggestions
              <Badge variant="secondary">3 Pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'Response Time', current: '250ms', suggested: '200ms', confidence: 0.85, impact: 'medium' },
                { metric: 'Memory Usage', current: '75%', suggested: '70%', confidence: 0.92, impact: 'high' },
                { metric: 'Error Rate', current: '0.1%', suggested: '0.05%', confidence: 0.78, impact: 'low' }
              ].map((suggestion, index) => (
                <div key={index} className="p-3 bg-background border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{suggestion.metric}</div>
                    <Badge variant={suggestion.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                      {suggestion.impact} impact
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-medium">{suggestion.current}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suggested: </span>
                      <span className="font-medium text-primary">{suggestion.suggested}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Confidence</span>
                      <span>{Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                    <Progress value={suggestion.confidence * 100} className="h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mid-sprint Heartbeat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hover-scale"
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Mid-sprint Heartbeat
              <Badge variant="outline">Real-time</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Activity className="w-6 h-6 mx-auto text-green-500" />
                <div className="text-sm font-medium">System Health</div>
                <Badge variant="secondary" className="text-xs">Excellent</Badge>
              </div>
              <div className="space-y-2">
                <TrendingUp className="w-6 h-6 mx-auto text-blue-500" />
                <div className="text-sm font-medium">Performance</div>
                <Badge variant="secondary" className="text-xs">Improving</Badge>
              </div>
              <div className="space-y-2">
                <RefreshCw className="w-6 h-6 mx-auto text-purple-500" />
                <div className="text-sm font-medium">Adaptation</div>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Primary CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Apply Retune</h3>
                <p className="text-sm text-muted-foreground">
                  Update DE bands and scorecard based on current performance data
                </p>
              </div>
              <Button 
                onClick={handleApplyRetune}
                disabled={readonly}
                size="lg"
                className="min-w-[200px]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Apply Retune
              </Button>
              {payload?.lastRetune && (
                <div className="text-xs text-muted-foreground">
                  Last retune: {new Date(payload.lastRetune).toLocaleTimeString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};