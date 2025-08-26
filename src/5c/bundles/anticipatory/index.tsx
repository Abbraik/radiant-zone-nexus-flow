// Anticipatory Bundle - Planning & Preparation Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import { useAnticipatoryBundle } from '@/hooks/useAnticipatoryBundle';
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
  Activity
} from 'lucide-react';

const AnticipatoryBundle: React.FC<BundleProps5C> = ({ task }) => {
  const {
    scenarios,
    scenarioResults,
    watchpoints,
    triggerRules,
    activationEvents,
    createScenario,
    runScenario,
    createWatchpoint,
    createTriggerRule,
    evaluateWatchpoints,
    isLoadingScenarios,
    isLoadingWatchpoints,
    isRunningScenario,
    isEvaluating
  } = useAnticipatoryBundle(task);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Anticipatory Planning</h2>
          <p className="text-muted-foreground">Future-oriented preparation and risk management</p>
        </div>
        <Button 
          onClick={() => evaluateWatchpoints.mutate()}
          disabled={isEvaluating}
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
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
                target_loops: []
              })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {isLoadingScenarios ? (
              <div className="text-sm text-muted-foreground">Loading scenarios...</div>
            ) : scenarios.length > 0 ? (
              scenarios.slice(0, 3).map((scenario) => (
                <div key={scenario.id} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Loops: {scenario.target_loops.length}
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
                      disabled={isRunningScenario}
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
                risk_channel: 'system',
                loop_codes: [],
                ews_prob: 0.7,
                status: 'armed'
              })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {isLoadingWatchpoints ? (
              <div className="text-sm text-muted-foreground">Loading watchpoints...</div>
            ) : watchpoints.length > 0 ? (
              watchpoints.slice(0, 3).map((watchpoint) => (
                <div key={watchpoint.id} className="p-3 border rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{watchpoint.risk_channel}</div>
                      <div className="text-sm text-muted-foreground">
                        EWS: {Math.round(watchpoint.ews_prob * 100)}%
                      </div>
                    </div>
                    <Badge variant={watchpoint.status === 'armed' ? 'default' : 'secondary'}>
                      {watchpoint.status}
                    </Badge>
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
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Trigger Rules & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trigger Rules */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Trigger Rules</h3>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => createTriggerRule.mutate({
                name: 'New Trigger Rule',
                expr_raw: 'risk > 0.8',
                authority: 'system',
                action_ref: 'alert'
              })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {triggerRules.length > 0 ? (
              triggerRules.slice(0, 3).map((rule) => (
                <div key={rule.id} className="p-3 border rounded-md">
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {rule.expr_raw}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Window: {rule.window_hours}h | Authority: {rule.authority}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No trigger rules defined</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Events */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Events</h3>
          </div>
          
          <div className="space-y-3">
            {activationEvents.length > 0 ? (
              activationEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium text-sm">{event.kind}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.source} • {event.loop_code || 'Global'}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(event.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent events</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnticipatoryBundle;