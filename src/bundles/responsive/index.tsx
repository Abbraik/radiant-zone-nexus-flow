import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Zap, Clock, AlertTriangle, User, CheckCircle2, Pause, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CapacityBundleProps } from '@/types/capacity';

export const ResponsiveBundle: React.FC<CapacityBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  const handleMarkCheckpoint = () => {
    // Write tri_events with checkpoint tag
    onPayloadUpdate({
      ...payload,
      lastCheckpoint: new Date().toISOString(),
      checkpointCount: (payload?.checkpointCount || 0) + 1
    });
  };

  return (
    <div className="space-y-6">
      {/* Active Claim Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hover-scale"
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Active Claim
              <Badge variant="outline">Execution Mode</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* RACI Matrix */}
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">RESPONSIBLE</div>
                  <div className="flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-sm">You</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">ACCOUNTABLE</div>
                  <div className="flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-sm">Team Lead</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">CONSULTED</div>
                  <div className="flex items-center justify-center gap-1">
                    <User className="w-3 h-3 text-blue-500" />
                    <User className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="text-sm">2 Experts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">INFORMED</div>
                  <div className="flex items-center justify-center gap-1">
                    <User className="w-3 h-3 text-green-500" />
                    <User className="w-3 h-3 text-green-500" />
                    <User className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="text-sm">3 Stakeholders</div>
                </div>
              </div>

              <Separator />

              {/* Execution Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Execution Steps</span>
                  <Badge variant="secondary">{payload?.completedSteps || 0}/5</Badge>
                </div>
                <Progress value={((payload?.completedSteps || 0) / 5) * 100} className="h-2" />
                
                <div className="space-y-2">
                  {[
                    'Initial assessment',
                    'Resource allocation',
                    'Implementation start',
                    'Mid-point review',
                    'Final execution'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 ${
                        index < (payload?.completedSteps || 0) 
                          ? 'text-green-500' 
                          : 'text-muted-foreground'
                      }`} />
                      <span className={index < (payload?.completedSteps || 0) 
                        ? 'line-through text-muted-foreground' 
                        : ''
                      }>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Micro-Loop Alert Rail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="hover-scale"
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Micro-Loop Alert Rail
              <Badge variant="destructive" className="text-xs">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'band_crossing', message: 'System load exceeded upper bound', time: '2m ago', severity: 'high' },
                { type: 'performance', message: 'Response time degradation detected', time: '5m ago', severity: 'medium' },
                { type: 'resource', message: 'Memory usage within normal range', time: '8m ago', severity: 'low' }
              ].map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs text-muted-foreground">{alert.time}</div>
                    </div>
                  </div>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hover-scale"
      >
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                Priority Up
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4" />
                Re-order
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Sub-step
              </Button>
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
                <h3 className="text-lg font-semibold">Mark Checkpoint</h3>
                <p className="text-sm text-muted-foreground">
                  Record current progress and system state for future reference
                </p>
              </div>
              <Button 
                onClick={handleMarkCheckpoint}
                disabled={readonly}
                size="lg"
                className="min-w-[200px]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Checkpoint
              </Button>
              {payload?.lastCheckpoint && (
                <div className="text-xs text-muted-foreground">
                  Last checkpoint: {new Date(payload.lastCheckpoint).toLocaleTimeString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};