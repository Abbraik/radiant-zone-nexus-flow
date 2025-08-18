import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Cog, Network } from 'lucide-react';
import type { CapacityBundleProps } from '@/types/capacity';

export const StructuralBundle: React.FC<CapacityBundleProps> = ({
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-500" />
            Structural Capacity Bundle
            <Badge variant="outline">System Design</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">Structural Transformation Mode</span>
              </div>
              <p className="text-sm text-purple-700">
                This bundle focuses on organizational structures, processes, and 
                systematic changes that affect the entire system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Change Scope
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.scope || 'department'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    scope: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="team">Team Level</option>
                  <option value="department">Department</option>
                  <option value="division">Division</option>
                  <option value="organization">Organization-wide</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Implementation Phase
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.phase || 'planning'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    phase: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="planning">Planning</option>
                  <option value="pilot">Pilot</option>
                  <option value="rollout">Rollout</option>
                  <option value="optimization">Optimization</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Structural Changes Required
              </label>
              <div className="space-y-2">
                {[
                  'Organizational Structure',
                  'Process Redesign',
                  'Technology Systems',
                  'Governance Model',
                  'Resource Allocation'
                ].map((change) => (
                  <label key={change} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={payload?.changes?.includes(change) || false}
                      onChange={(e) => {
                        const current = payload?.changes || [];
                        const updated = e.target.checked 
                          ? [...current, change]
                          : current.filter(c => c !== change);
                        onPayloadUpdate({
                          ...payload,
                          changes: updated
                        });
                      }}
                      disabled={readonly}
                    />
                    <span className="text-sm">{change}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Implementation Plan
              </label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Outline the structural changes and implementation approach..."
                value={payload?.implementationPlan || ''}
                onChange={(e) => onPayloadUpdate({
                  ...payload,
                  implementationPlan: e.target.value
                })}
                disabled={readonly}
              />
            </div>

            {!readonly && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Cog className="w-4 h-4 mr-2" />
                  Configure System
                </Button>
                <Button size="sm">
                  Deploy Changes
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};