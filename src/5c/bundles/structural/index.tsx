// Structural Bundle - System Architecture & Design Capacity
import React from 'react';
import { BundleProps5C } from '@/5c/types';

const StructuralBundle: React.FC<BundleProps5C> = ({ task }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loop Design */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Loop Architecture</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              System structure and relationships
            </div>
            <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center">
              <span className="text-muted-foreground">CLD canvas</span>
            </div>
          </div>
        </div>

        {/* Leverage Mapping */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Leverage Points</h3>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              System intervention points
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="font-medium">Parameters (N)</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Low Impact</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="font-medium">Paradigms (P)</span>
                <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">Med Impact</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="font-medium">Structure (S)</span>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">High Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Mapping */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Domain Architecture</h3>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Cross-domain relationships and dependencies
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-md">
              <div className="font-medium">Economic</div>
              <div className="text-sm text-muted-foreground">{task.scale}</div>
            </div>
            <div className="text-center p-3 border rounded-md">
              <div className="font-medium">Social</div>
              <div className="text-sm text-muted-foreground">{task.type}</div>
            </div>
            <div className="text-center p-3 border rounded-md">
              <div className="font-medium">Technical</div>
              <div className="text-sm text-muted-foreground">{task.leverage}</div>
            </div>
            <div className="text-center p-3 border rounded-md">
              <div className="font-medium">Political</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructuralBundle;