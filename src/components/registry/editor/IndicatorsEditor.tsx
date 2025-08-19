import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BarChart3 } from 'lucide-react';
import { LoopNode } from '@/types/loop-registry';

interface IndicatorsEditorProps {
  loopId?: string;
  nodes: LoopNode[];
}

// Mock indicator data for now
const mockIndicators = [
  {
    id: '1',
    name: 'Customer Satisfaction',
    kind: 'outcome',
    unit: 'score',
    source: 'survey',
    hasData: true,
    hasBand: true,
    lastValue: 4.2
  },
  {
    id: '2', 
    name: 'Processing Time',
    kind: 'process',
    unit: 'minutes',
    source: 'system',
    hasData: true,
    hasBand: false,
    lastValue: 12.5
  }
];

export const IndicatorsEditor: React.FC<IndicatorsEditorProps> = ({ loopId, nodes }) => {
  const [indicators] = useState(mockIndicators);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

  const indicatorNodes = nodes.filter(node => node.kind === 'indicator');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Indicators & DE-Bands</h2>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Indicator
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Import from CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Indicators List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Indicators ({indicators.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {indicators.map((indicator) => (
                  <div
                    key={indicator.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedIndicator === indicator.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedIndicator(indicator.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{indicator.name}</h4>
                          <Badge variant="outline">{indicator.kind}</Badge>
                          {indicator.hasBand && (
                            <Badge variant="default" className="bg-green-500">Band</Badge>
                          )}
                          {!indicator.hasBand && (
                            <Badge variant="destructive">No Band</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Unit: {indicator.unit}</span>
                          <span>Source: {indicator.source}</span>
                          {indicator.hasData && (
                            <span>Last: {indicator.lastValue}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {indicators.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No indicators defined yet</p>
                    <p className="text-sm">Add indicators to track loop performance</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inspector Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Indicator Nodes</CardTitle>
            </CardHeader>
            <CardContent>
              {indicatorNodes.length > 0 ? (
                <div className="space-y-2">
                  {indicatorNodes.map((node) => (
                    <div
                      key={node.id}
                      className="p-3 border rounded-lg"
                    >
                      <div className="font-medium">{node.label}</div>
                      <div className="text-sm text-muted-foreground">
                        Domain: {node.domain || 'None'}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Create Indicator
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No indicator nodes in graph</p>
                  <p className="text-xs">Add nodes with kind="indicator" first</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedIndicator && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>DE-Band Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Band configuration coming soon
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};