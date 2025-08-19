// Anticipatory Bundle - Planning & Preparation Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';

const AnticipatoryBundle: React.FC<BundleProps5C> = ({ task }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Planning */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Scenario Planning</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Future scenarios and contingency plans
            </div>
            <div className="space-y-2">
              <div className="p-3 border rounded-md">
                <div className="font-medium">Scenario 1: Optimistic</div>
                <div className="text-sm text-muted-foreground">85% probability</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="font-medium">Scenario 2: Conservative</div>
                <div className="text-sm text-muted-foreground">60% probability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Playbook Builder */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Playbook Design</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Automated response sequences
            </div>
            <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">Playbook editor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stress Testing */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Stress Test Queue</h3>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            System resilience validation
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-md">
              <div className="font-medium text-green-800">Passed</div>
              <div className="text-sm text-green-600">Load Test</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-md">
              <div className="font-medium text-yellow-800">Running</div>
              <div className="text-sm text-yellow-600">Fault Test</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-md">
              <div className="font-medium text-muted-foreground">Queued</div>
              <div className="text-sm text-muted-foreground">Scale Test</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnticipatoryBundle;