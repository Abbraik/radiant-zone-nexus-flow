// Reflexive Bundle - Memory & Optimization Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import { useReflexiveData } from '@/hooks/useReflexiveData';

const ReflexiveBundle: React.FC<BundleProps5C> = ({ task }) => {
  const { memory, scorecard, retuning } = useReflexiveData(task);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Memory Panel */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Reflex Memory</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Recent adjustments and optimizations for loop {task.loop_id}
            </div>
            <div className="space-y-2">
              {memory.map((item) => (
                <div key={item.id} className="p-2 border rounded text-sm">
                  <div className="font-medium">{item.action}</div>
                  <div className="text-muted-foreground text-xs">{item.description}</div>
                  <div className="text-xs text-right">{new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retune Panel */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Band Adjustment</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              DE band optimization {retuning.suggested ? 'recommended' : 'not needed'}
            </div>
            {retuning.suggested ? (
              <div className="space-y-2">
                {retuning.recommendations.map((rec, index) => (
                  <div key={index} className="p-2 border rounded text-sm">
                    <div className="font-medium">{rec.parameter}</div>
                    <div className="text-xs text-muted-foreground">
                      {rec.current} → {rec.suggested}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center">
                <span className="text-muted-foreground">No retuning needed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scorecard */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Loop Scorecard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{scorecard.fatigue}</div>
            <div className="text-sm text-muted-foreground">Fatigue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{scorecard.deState}</div>
            <div className="text-sm text-muted-foreground">DE State</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{scorecard.velocity}</div>
            <div className="text-sm text-muted-foreground">Velocity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{scorecard.breachDays}</div>
            <div className="text-sm text-muted-foreground">Breach Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflexiveBundle;