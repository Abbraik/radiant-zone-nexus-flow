import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Target, Users } from 'lucide-react';
import type { CapacityBundleProps } from '@/types/capacity';

export const DeliberativeBundle: React.FC<CapacityBundleProps> = ({
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
            <Brain className="w-5 h-5 text-blue-500" />
            Deliberative Capacity Bundle
            <Badge variant="outline">Strategic Planning</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Strategic Analysis Mode</span>
              </div>
              <p className="text-sm text-blue-700">
                This bundle focuses on thorough analysis, stakeholder consultation, 
                and systematic decision-making processes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Analysis Timeframe
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.timeframe || '2weeks'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    timeframe: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="1week">1 week</option>
                  <option value="2weeks">2 weeks</option>
                  <option value="1month">1 month</option>
                  <option value="3months">3 months</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Stakeholder Groups
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.stakeholders || 'core'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    stakeholders: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="core">Core Team</option>
                  <option value="extended">Extended Team</option>
                  <option value="cross-functional">Cross-functional</option>
                  <option value="organization-wide">Organization-wide</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Strategic Objectives
              </label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Define the key strategic objectives and success criteria..."
                value={payload?.objectives || ''}
                onChange={(e) => onPayloadUpdate({
                  ...payload,
                  objectives: e.target.value
                })}
                disabled={readonly}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Analysis Framework
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['SWOT Analysis', 'Risk Assessment', 'Cost-Benefit', 'Impact Analysis'].map((framework) => (
                  <label key={framework} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={payload?.frameworks?.includes(framework) || false}
                      onChange={(e) => {
                        const current = payload?.frameworks || [];
                        const updated = e.target.checked 
                          ? [...current, framework]
                          : current.filter(f => f !== framework);
                        onPayloadUpdate({
                          ...payload,
                          frameworks: updated
                        });
                      }}
                      disabled={readonly}
                    />
                    <span className="text-sm">{framework}</span>
                  </label>
                ))}
              </div>
            </div>

            {!readonly && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Stakeholders
                </Button>
                <Button size="sm">
                  Begin Analysis
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};