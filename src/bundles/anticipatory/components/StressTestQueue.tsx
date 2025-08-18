import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnticipatoryBundle, StressTest } from '@/hooks/useAnticipatoryBundle';
import { Play, Download, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StressTestQueueProps {
  taskId: string;
  loopId: string;
}

const SEVERITY_COLORS = {
  1: 'bg-emerald-500',
  2: 'bg-blue-500', 
  3: 'bg-amber-500',
  4: 'bg-orange-500',
  5: 'bg-red-500'
};

const STATUS_ICONS = {
  pending: Clock,
  running: AlertCircle,
  completed: CheckCircle,
  failed: XCircle
};

const STATUS_COLORS = {
  pending: 'text-muted-foreground',
  running: 'text-blue-500',
  completed: 'text-emerald-500',
  failed: 'text-red-500'
};

export default function StressTestQueue({ taskId, loopId }: StressTestQueueProps) {
  const {
    scenarios,
    stressTests,
    createStressTest,
    isCreatingStressTest
  } = useAnticipatoryBundle(taskId, loopId);

  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<number>(3);

  const handleCreateStressTest = () => {
    if (!selectedScenario) return;
    
    createStressTest.mutate({
      scenarioId: selectedScenario,
      severity: selectedSeverity
    });
    
    setSelectedScenario('');
    setSelectedSeverity(3);
  };

  const handleRunTest = (testId: string) => {
    // Mock running a stress test - in reality this would trigger the actual test execution
    console.log('Running stress test:', testId);
  };

  const handleExportResults = (test: StressTest) => {
    const data = {
      test_id: test.id,
      name: test.name,
      severity: test.severity,
      status: test.status,
      result: test.result,
      created_at: test.created_at
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stress-test-${test.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityLabel = (severity: number) => {
    const labels = {
      1: 'Minimal',
      2: 'Low', 
      3: 'Medium',
      4: 'High',
      5: 'Extreme'
    };
    return labels[severity as keyof typeof labels] || 'Unknown';
  };

  const getExpectedImpact = (severity: number) => {
    const impacts = {
      1: 'Minor performance degradation',
      2: 'Noticeable slowdown',
      3: 'Significant impact on KPIs',
      4: 'Major service disruption',
      5: 'System failure scenarios'
    };
    return impacts[severity as keyof typeof impacts] || 'Unknown impact';
  };

  return (
    <div className="space-y-6">
      {/* Queue New Test */}
      <Card>
        <CardHeader>
          <CardTitle>Queue New Stress Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Scenario</label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Select a scenario to test..." />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    <div className="flex items-center gap-2">
                      <span>{scenario.name}</span>
                      {scenario.pinned && (
                        <Badge variant="secondary" className="text-xs">Pinned</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Severity Level</label>
            <Select 
              value={selectedSeverity.toString()} 
              onValueChange={(value) => setSelectedSeverity(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((severity) => (
                  <SelectItem key={severity} value={severity.toString()}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS]}`} />
                      <span>Level {severity} - {getSeverityLabel(severity)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {getExpectedImpact(selectedSeverity)}
            </p>
          </div>

          <Button 
            onClick={handleCreateStressTest}
            disabled={!selectedScenario || isCreatingStressTest}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            Queue Stress Test
          </Button>
        </CardContent>
      </Card>

      {/* Test Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stress Test Queue</span>
            <Badge variant="outline">
              {stressTests.length} tests
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stressTests.map((test) => {
              const StatusIcon = STATUS_ICONS[test.status];
              
              return (
                <Card key={test.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${SEVERITY_COLORS[test.severity as keyof typeof SEVERITY_COLORS]}`} />
                        <div>
                          <h4 className="font-medium text-sm">{test.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Level {test.severity} - {getSeverityLabel(test.severity)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${STATUS_COLORS[test.status]}`} />
                        <Badge 
                          variant={test.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {test.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress bar for running tests */}
                    {test.status === 'running' && (
                      <div className="mb-3">
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Simulating scenario impact...
                        </p>
                      </div>
                    )}

                    {/* Expected Impact */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Expected Impact:</p>
                      <p className="text-sm">{getExpectedImpact(test.severity)}</p>
                    </div>

                    {/* Results Preview */}
                    {test.status === 'completed' && test.result && (
                      <div className="mb-3 p-2 bg-muted/30 rounded">
                        <p className="text-xs font-medium mb-1">Results Summary:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>Peak Impact: {test.result.peak_impact || 'N/A'}</div>
                          <div>Recovery Time: {test.result.recovery_time || 'N/A'}</div>
                          <div>Failed Components: {test.result.failed_components || 0}</div>
                          <div>Risk Score: {test.result.risk_score || 'N/A'}</div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {test.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRunTest(test.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </Button>
                      )}
                      
                      {test.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportResults(test)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      Created: {new Date(test.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {stressTests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No stress tests queued</p>
                <p className="text-sm">Create a scenario and queue your first stress test</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}