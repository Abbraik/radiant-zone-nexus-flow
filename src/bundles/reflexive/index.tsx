import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Eye, Layers } from 'lucide-react';
import type { CapacityBundleProps } from '@/types/capacity';

export const ReflexiveBundle: React.FC<CapacityBundleProps> = ({
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
            <RefreshCw className="w-5 h-5 text-green-500" />
            Reflexive Capacity Bundle
            <Badge variant="outline">Adaptive Learning</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Reflexive Learning Mode</span>
              </div>
              <p className="text-sm text-green-700">
                This bundle emphasizes pattern recognition, adaptive responses, 
                and continuous learning from system feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Learning Cycle
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.learningCycle || 'observe'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    learningCycle: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="observe">Observe</option>
                  <option value="orient">Orient</option>
                  <option value="decide">Decide</option>
                  <option value="act">Act</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Feedback Frequency
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.feedbackFreq || 'daily'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    feedbackFreq: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pattern Recognition Areas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Performance Trends', 'User Behavior', 'System Bottlenecks', 'Resource Usage'].map((area) => (
                  <label key={area} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={payload?.patterns?.includes(area) || false}
                      onChange={(e) => {
                        const current = payload?.patterns || [];
                        const updated = e.target.checked 
                          ? [...current, area]
                          : current.filter(p => p !== area);
                        onPayloadUpdate({
                          ...payload,
                          patterns: updated
                        });
                      }}
                      disabled={readonly}
                    />
                    <span className="text-sm">{area}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Adaptation Strategy
              </label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Describe how the system should adapt based on learned patterns..."
                value={payload?.adaptationStrategy || ''}
                onChange={(e) => onPayloadUpdate({
                  ...payload,
                  adaptationStrategy: e.target.value
                })}
                disabled={readonly}
              />
            </div>

            {!readonly && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Layers className="w-4 h-4 mr-2" />
                  View Patterns
                </Button>
                <Button size="sm">
                  Apply Learning
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Learning Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {payload?.metrics?.adaptationRate || '0%'}
              </div>
              <div className="text-xs text-gray-500">Adaptation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {payload?.metrics?.patternAccuracy || '0%'}
              </div>
              <div className="text-xs text-gray-500">Pattern Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};