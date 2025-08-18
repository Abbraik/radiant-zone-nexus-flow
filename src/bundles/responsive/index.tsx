import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Clock, AlertTriangle } from 'lucide-react';
import type { CapacityBundleProps } from '@/types/capacity';

export const ResponsiveBundle: React.FC<CapacityBundleProps> = ({
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
            <Zap className="w-5 h-5 text-orange-500" />
            Responsive Capacity Bundle
            <Badge variant="outline">Reactive Loop</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-900">Rapid Response Mode</span>
              </div>
              <p className="text-sm text-orange-700">
                This bundle is optimized for immediate response to emerging situations.
                Focus on quick assessment and immediate action items.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Response Time Target
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.responseTime || '1h'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    responseTime: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="15m">15 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                  <option value="24h">24 hours</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority Level
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.priority || 'high'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    priority: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Immediate Actions Required
              </label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="List immediate actions that need to be taken..."
                value={payload?.immediateActions || ''}
                onChange={(e) => onPayloadUpdate({
                  ...payload,
                  immediateActions: e.target.value
                })}
                disabled={readonly}
              />
            </div>

            {!readonly && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Save Draft
                </Button>
                <Button size="sm">
                  Submit Response
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Response Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              'Situation assessed',
              'Key stakeholders notified',
              'Immediate risks identified',
              'Response plan activated',
              'Resources allocated'
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={payload?.checklist?.[index] || false}
                  onChange={(e) => {
                    const newChecklist = [...(payload?.checklist || [])];
                    newChecklist[index] = e.target.checked;
                    onPayloadUpdate({
                      ...payload,
                      checklist: newChecklist
                    });
                  }}
                  disabled={readonly}
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};