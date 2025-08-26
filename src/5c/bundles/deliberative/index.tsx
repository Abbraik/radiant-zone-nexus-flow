// Deliberative Bundle - Enhanced with Dynamic Data
import React from 'react';
import { BundleProps5C } from '@/5c/types';
import { useDeliberativeData } from '@/hooks/useDeliberativeData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Target, Plus } from 'lucide-react';

const DeliberativeBundle: React.FC<BundleProps5C> = ({ task }) => {
  const loopId = task.loop_id;
  const {
    sessions,
    activeSession,
    criteria,
    options,
    frontierPoints,
    dossiers,
    isLoading,
    createSession,
    addCriterion,
    addOption
  } = useDeliberativeData(loopId);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading deliberative data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Deliberative Capacity</h2>
          <p className="text-muted-foreground">Multi-criteria decision analysis and stakeholder engagement</p>
        </div>
        <Button onClick={() => createSession.mutate({
          org_id: task.user_id,
          mission: `Analysis for ${task.title}`,
          activation_vector: { task_id: task.id }
        })}>
          New Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sessions ({sessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSession ? (
              <div>
                <div className="font-medium">{activeSession.mission}</div>
                <div className="text-sm text-muted-foreground">{activeSession.status}</div>
              </div>
            ) : (
              <p className="text-muted-foreground">No active session</p>
            )}
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Criteria ({criteria.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => addCriterion.mutate({
              label: 'New Criterion',
              description: 'Evaluation criterion',
              weight: 1.0,
              direction: 'maximize',
              scale_hint: '1-5'
            })}>
              <Plus className="h-3 w-3 mr-1" />
              Add Criterion
            </Button>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Options ({options.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => addOption.mutate({
              name: 'New Option',
              synopsis: 'Policy option description',
              tags: [],
              costs: {},
              latency_days: 30
            })}>
              <Plus className="h-3 w-3 mr-1" />
              Add Option
            </Button>
          </CardContent>
        </Card>
      </div>

      {frontierPoints.length > 0 && (
        <Card className="p-6">
          <CardTitle>Frontier Analysis</CardTitle>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {frontierPoints.slice(0, 3).map((point) => (
              <div key={point.id} className="p-3 bg-muted/20 rounded">
                <div className="font-medium">{point.label}</div>
                <div className="text-sm">Risk: {Math.round(point.risk * 100)}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DeliberativeBundle;