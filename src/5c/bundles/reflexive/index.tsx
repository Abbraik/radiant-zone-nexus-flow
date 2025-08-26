// Reflexive Bundle - Memory & Optimization Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import { useReflexiveData } from '@/hooks/useReflexiveData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Settings, BarChart3, Clock } from 'lucide-react';

const ReflexiveBundle: React.FC<BundleProps5C> = ({ task }) => {
  const loopId = task.loop_id;
  const {
    reflexMemory,
    controllerTunings,
    bandWeightChanges,
    scorecardData,
    deBands,
    isLoading,
    createReflexMemory,
    updateDeBands,
    updateScorecard
  } = useReflexiveData(loopId);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading reflexive data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Panel */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Reflex Memory ({reflexMemory.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reflexMemory.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-3 border rounded">
                  <div className="font-medium">{entry.rationale}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Button size="sm" onClick={() => createReflexMemory.mutate({
                indicator: 'primary',
                description: 'New memory entry',
                before: {},
                after: {}
              })}>
                Add Memory
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* DE Bands Panel */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              DE Bands ({deBands.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deBands.slice(0, 2).map((band) => (
                <div key={band.id} className="p-3 border rounded">
                  <div className="font-medium">{band.indicator}</div>
                  <div className="text-sm">
                    Bounds: {band.lower_bound?.toFixed(2) || 'N/A'} - {band.upper_bound?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              ))}
              <Button size="sm" onClick={() => updateDeBands.mutate({
                indicator: 'primary',
                lower_bound: 0.2,
                upper_bound: 0.8
              })}>
                Update Bands
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scorecard */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Loop Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {scorecardData?.ci?.toFixed(1) || '0.5'}
              </div>
              <div className="text-sm text-muted-foreground">Composite Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">stable</div>
              <div className="text-sm text-muted-foreground">DE State</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{controllerTunings.length}</div>
              <div className="text-sm text-muted-foreground">Tunings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{bandWeightChanges.length}</div>
              <div className="text-sm text-muted-foreground">Adjustments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReflexiveBundle;