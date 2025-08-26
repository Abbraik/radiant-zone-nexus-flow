// Anticipatory Bundle - Planning & Preparation Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import { useAnticipatoryData } from '@/hooks/useAnticipatoryData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Shield, 
  Zap, 
  AlertTriangle,
  Clock,
  Target,
  Play,
  Plus,
  Activity,
  Database
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AnticipatoryBundle: React.FC<BundleProps5C> = ({ task }) => {
  const loopId = task.loop_id;
  
  const {
    scenarios,
    scenarioResults,
    watchpoints,
    triggerRules,
    buffers,
    prePositionOrders,
    isLoading,
    createWatchpoint,
    createScenario,
    runScenario,
    armWatchpoint
  } = useAnticipatoryData(loopId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading anticipatory data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Anticipatory Planning</h2>
          <p className="text-muted-foreground">Future-oriented preparation and risk management</p>
        </div>
        <Button 
          onClick={() => createWatchpoint.mutate({
            risk_channel: 'system_stress',
            ews_prob: 0.75,
            status: 'armed'
          })}
          disabled={createWatchpoint.isPending}
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          {createWatchpoint.isPending ? 'Creating...' : 'New Watchpoint'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenarios */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Scenario Planning</h3>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => createScenario.mutate({ 
                name: `Scenario ${scenarios.length + 1}`,
                assumptions: { probability: 0.3 },
                target_loops: [loopId]
              })}
              disabled={createScenario.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {scenarios.length > 0 ? (
              scenarios.slice(0, 3).map((scenario) => (
                <div key={scenario.id} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Loops: {scenario.target_loops.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(scenario.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => runScenario.mutate({
                        scenarioId: scenario.id,
                        params: { 
                          without_mitigation: 0.6,
                          with_mitigation: 0.3,
                          affected_loops: scenario.target_loops
                        }
                      })}
                      disabled={runScenario.isPending}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No scenarios created yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Watchpoints */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Watchpoints</h3>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => createWatchpoint.mutate({
                risk_channel: 'system_overload',
                loop_codes: [loopId],
                ews_prob: 0.7,
                status: 'armed'
              })}
              disabled={createWatchpoint.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {watchpoints.length > 0 ? (
              watchpoints.slice(0, 3).map((watchpoint) => (
                <div key={watchpoint.id} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{watchpoint.risk_channel}</div>
                      <div className="text-sm text-muted-foreground">
                        EWS: {Math.round(watchpoint.ews_prob * 100)}%
                      </div>
                      {watchpoint.confidence && (
                        <div className="text-xs text-muted-foreground">
                          Confidence: {Math.round(watchpoint.confidence * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={watchpoint.status === 'armed' ? 'default' : 'secondary'}>
                        {watchpoint.status}
                      </Badge>
                      {watchpoint.status !== 'armed' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => armWatchpoint.mutate(watchpoint.id)}
                          disabled={armWatchpoint.isPending}
                        >
                          Arm
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No watchpoints configured</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Buffers & Pre-position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buffers */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Buffer Status</h3>
          </div>
          
          <div className="space-y-3">
            {buffers.length > 0 ? (
              buffers.slice(0, 3).map((buffer) => (
                <div key={buffer.id} className="p-3 bg-muted/20 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{buffer.label}</div>
                    <Badge variant={buffer.current >= buffer.target ? 'default' : 'secondary'}>
                      {Math.round(buffer.current * 100)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target: {Math.round(buffer.target * 100)}%
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No buffers configured</p>
              </div>
            )}
          </div>
        </Card>

        {/* Pre-position Orders */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Pre-position Status</h3>
          </div>
          
          <div className="space-y-3">
            {prePositionOrders.length > 0 ? (
              prePositionOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{order.title}</div>
                      <div className="text-sm text-muted-foreground">{order.kind}</div>
                    </div>
                    <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                  {order.readiness_score && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Readiness: {Math.round(order.readiness_score * 100)}%
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pre-position orders</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Scenario Results */}
      {scenarioResults.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Results</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarioResults.slice(0, 3).map((result) => (
              <div key={result.id} className="p-4 bg-muted/20 rounded-md">
                <div className="text-sm font-medium mb-2">
                  Mitigation Delta
                </div>
                <div className="text-2xl font-bold text-primary">
                  {Math.round(result.mitigation_delta * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Breach prob reduced
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnticipatoryBundle;