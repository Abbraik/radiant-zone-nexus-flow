import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Zap, Play, Plus } from 'lucide-react';
import type { DecisionResult } from '@/services/capacity-decision/types';

interface ExperimentPlannerProps {
  decision: DecisionResult;
  onScheduleReview: () => void;
}

export const ExperimentPlanner: React.FC<ExperimentPlannerProps> = ({
  decision,
  onScheduleReview
}) => {
  const [experimentName, setExperimentName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [evalMethod, setEvalMethod] = useState<'ITS' | 'DiD' | 'AB'>('ITS');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([decision.indicator]);

  const availableIndicators = [
    decision.indicator,
    'Oscillation Score',
    'RMSE',
    'Variance of Error',
    'Integral Error',
    'Dispersion Index',
    'Hub Saturation'
  ];

  const reviewDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Experiment & Evaluation
        </CardTitle>
        <CardDescription>
          Design experiments and schedule evaluation reviews to validate changes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experiment Sketch */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Experiment Design (Optional)</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-name">Experiment Name</Label>
              <Input
                id="exp-name"
                placeholder="e.g., Controller Tuning A/B Test"
                value={experimentName}
                onChange={(e) => setExperimentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Segment</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Traffic</SelectItem>
                  <SelectItem value="high-variance">High Variance</SelectItem>
                  <SelectItem value="normal-ops">Normal Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hypothesis">Hypothesis</Label>
            <Textarea
              id="hypothesis"
              placeholder="If we [change], then we expect [outcome] because [reasoning]..."
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* AB Arms */}
          <div className="space-y-3">
            <Label>Experiment Arms</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Control (50%)</span>
                  <Badge variant="secondary">Current</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Existing controller parameters
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Treatment (50%)</span>
                  <Badge variant="outline">New</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Proposed controller changes
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Evaluation Planner */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Evaluation Plan</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={evalMethod} onValueChange={(value: any) => setEvalMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ITS">
                    <div>
                      <div className="font-medium">ITS</div>
                      <div className="text-xs text-muted-foreground">Interrupted Time Series</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="DiD">
                    <div>
                      <div className="font-medium">DiD</div>
                      <div className="text-xs text-muted-foreground">Difference-in-Differences</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="AB">
                    <div>
                      <div className="font-medium">A/B Test</div>
                      <div className="text-xs text-muted-foreground">Randomized Controlled Trial</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Review Date</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{reviewDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Indicators to Monitor</Label>
            <div className="flex flex-wrap gap-2">
              {availableIndicators.map((indicator) => (
                <Badge
                  key={indicator}
                  variant={selectedIndicators.includes(indicator) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedIndicators(prev =>
                      prev.includes(indicator)
                        ? prev.filter(i => i !== indicator)
                        : [...prev, indicator]
                    );
                  }}
                >
                  {indicator}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onScheduleReview} variant="outline" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Review
          </Button>
          <Button 
            disabled={!experimentName || !hypothesis}
            className="flex-1"
          >
            <Play className="mr-2 h-4 w-4" />
            Start Experiment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};