import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Telescope } from 'lucide-react';
import type { CapacityBundleProps } from '@/types/capacity';

export const AnticipatoryBundle: React.FC<CapacityBundleProps> = ({
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
            <Telescope className="w-5 h-5 text-indigo-500" />
            Anticipatory Capacity Bundle
            <Badge variant="outline">Future Planning</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-900">Predictive Analysis Mode</span>
              </div>
              <p className="text-sm text-indigo-700">
                This bundle focuses on forecasting, scenario planning, 
                and proactive preparation for future conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Forecasting Horizon
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.horizon || '3months'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    horizon: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                  <option value="3years">3 Years</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Scenario Confidence
                </label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payload?.confidence || 'medium'}
                  onChange={(e) => onPayloadUpdate({
                    ...payload,
                    confidence: e.target.value
                  })}
                  disabled={readonly}
                >
                  <option value="high">High (80-95%)</option>
                  <option value="medium">Medium (60-80%)</option>
                  <option value="low">Low (40-60%)</option>
                  <option value="exploratory">Exploratory (&lt;40%)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Key Variables to Monitor
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Market Trends', 'Technology Changes', 'Regulatory Shifts', 'Resource Availability', 'Demand Patterns', 'Competitive Landscape'].map((variable) => (
                  <label key={variable} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={payload?.variables?.includes(variable) || false}
                      onChange={(e) => {
                        const current = payload?.variables || [];
                        const updated = e.target.checked 
                          ? [...current, variable]
                          : current.filter(v => v !== variable);
                        onPayloadUpdate({
                          ...payload,
                          variables: updated
                        });
                      }}
                      disabled={readonly}
                    />
                    <span className="text-sm">{variable}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Scenario Planning
              </label>
              <div className="space-y-3">
                {['Best Case', 'Most Likely', 'Worst Case'].map((scenario, index) => (
                  <div key={scenario}>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      {scenario} Scenario
                    </label>
                    <textarea
                      className="w-full p-2 border rounded-md resize-none text-sm"
                      rows={2}
                      placeholder={`Describe the ${scenario.toLowerCase()} scenario...`}
                      value={payload?.scenarios?.[index] || ''}
                      onChange={(e) => {
                        const scenarios = [...(payload?.scenarios || ['', '', ''])];
                      scenarios[index] = e.target.value;
                        onPayloadUpdate({
                          ...payload,
                          scenarios
                        });
                      }}
                      disabled={readonly}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preparation Actions
              </label>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={3}
                placeholder="What actions should be taken now to prepare for anticipated futures?"
                value={payload?.preparationActions || ''}
                onChange={(e) => onPayloadUpdate({
                  ...payload,
                  preparationActions: e.target.value
                })}
                disabled={readonly}
              />
            </div>

            {!readonly && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Review
                </Button>
                <Button size="sm">
                  Execute Preparation
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Prediction Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {payload?.accuracy?.short || '0%'}
              </div>
              <div className="text-xs text-gray-500">Short-term</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">
                {payload?.accuracy?.medium || '0%'}
              </div>
              <div className="text-xs text-gray-500">Medium-term</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {payload?.accuracy?.long || '0%'}
              </div>
              <div className="text-xs text-gray-500">Long-term</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};