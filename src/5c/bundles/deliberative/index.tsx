// Deliberative Bundle - Analysis & Decision-Making Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';

const DeliberativeBundle: React.FC<BundleProps5C> = ({ task }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Options Panel */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Option Analysis</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Available intervention options for {task.capacity} capacity
            </div>
            <div className="space-y-2">
              <div className="p-3 border rounded-md">
                <div className="font-medium">Option A: Direct Intervention</div>
                <div className="text-sm text-muted-foreground">N-lever, Low risk</div>
              </div>
              <div className="p-3 border rounded-md">
                <div className="font-medium">Option B: Policy Adjustment</div>
                <div className="text-sm text-muted-foreground">P-lever, Medium risk</div>
              </div>
            </div>
          </div>
        </div>

        {/* MCDA Panel */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Decision Matrix</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Multi-criteria decision analysis
            </div>
            <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">MCDA visualization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Record */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Decision History</h3>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Recent decisions and their rationale
          </div>
          <div className="h-24 bg-muted/20 rounded-md flex items-center justify-center">
            <span className="text-muted-foreground">Decision timeline</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliberativeBundle;