// Guardrails Panel - Policy display and live validation
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Settings,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useGuardrails } from '@/hooks/useGuardrails';
import { GuardrailEngine, type GuardrailContext } from '@/lib/guardrails/engine';

interface GuardrailsPanelProps {
  taskId: string;
  taskCreatedAt: string;
  capacity: string;
  templateKey: string;
  onActionAttempt?: (attempt: {
    changeKind: 'start' | 'update' | 'publish' | 'renew' | 'close';
    deltaEstimate?: number;
    coverageEstimatePct?: number;
    substepsRequested?: number;
  }) => void;
}

export const GuardrailsPanel: React.FC<GuardrailsPanelProps> = ({
  taskId,
  taskCreatedAt,
  capacity,
  templateKey,
  onActionAttempt
}) => {
  const {
    taskGuardrail,
    timeboxStatus,
    renewals,
    needsRenewal,
    needsEvaluation,
    isExpertMode,
    setIsExpertMode,
    evaluateAttempt,
    renewTask,
    createOverride,
    isEvaluating,
    isRenewing,
    isOverriding
  } = useGuardrails(taskId);

  const [overrideRationale, setOverrideRationale] = useState('');
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [previewAttempt, setPreviewAttempt] = useState<any>(null);

  const policy = taskGuardrail?.guardrail_policies;

  // Live validation preview
  const handlePreviewAttempt = (attempt: {
    changeKind: 'start' | 'update' | 'publish' | 'renew' | 'close';
    deltaEstimate?: number;
    coverageEstimatePct?: number;
    substepsRequested?: number;
  }) => {
    if (!policy) return;

    const context: GuardrailContext = {
      policy: {
        timeboxHours: policy.timebox_hours,
        dailyDeltaLimit: policy.daily_delta_limit || undefined,
        coverageLimitPct: policy.coverage_limit_pct || undefined,
        concurrentSubstepsLimit: policy.concurrent_substeps_limit || undefined,
        renewalLimit: policy.renewal_limit,
        evaluationRequiredAfterRenewals: policy.evaluation_required_after_renewals
      },
      task: {
        taskId,
        createdAt: taskCreatedAt,
        renewals: renewals.length
      },
      now: new Date().toISOString(),
      attempt
    };

    const decision = GuardrailEngine.evaluateGuardrails(context);
    setPreviewAttempt({ attempt, decision });
    
    if (onActionAttempt) {
      onActionAttempt(attempt);
    }
  };

  const handleRenewal = () => {
    renewTask(taskId);
  };

  const handleOverride = () => {
    if (!overrideRationale.trim() || !previewAttempt) return;

    createOverride({
      taskId,
      scope: 'guardrail',
      before: { blocked: true, decision: previewAttempt.decision },
      after: { overridden: true, rationale: overrideRationale },
      rationale: overrideRationale
    });

    setShowOverrideDialog(false);
    setOverrideRationale('');
  };

  if (!policy) {
    return (
      <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Settings className="h-4 w-4" />
            <span className="text-sm">No guardrail policy configured</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Policy Summary Card */}
      <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <Shield className="h-4 w-4" />
              Guardrails Policy
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Switch 
                  checked={isExpertMode}
                  onCheckedChange={setIsExpertMode}
                />
                <Eye className="h-3 w-3 text-gray-400" />
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {capacity}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Time-box Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Time-box</span>
              {timeboxStatus && (
                <span className={`text-sm font-mono ${
                  timeboxStatus.isExpired ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {timeboxStatus.remaining}
                </span>
              )}
            </div>
            
            {timeboxStatus && !timeboxStatus.isExpired && (
              <Progress 
                value={85} // TODO: Calculate actual progress
                className="h-1"
              />
            )}
            
            {needsRenewal && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRenewal}
                disabled={isRenewing}
                className="w-full gap-2"
              >
                <RefreshCw className={`h-3 w-3 ${isRenewing ? 'animate-spin' : ''}`} />
                {isRenewing ? 'Renewing...' : 'Renew Time-box'}
              </Button>
            )}
          </div>

          {/* Renewal Status */}
          {renewals.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Renewals</span>
              <div className="flex items-center gap-2">
                <Badge variant={needsEvaluation ? 'destructive' : 'secondary'} className="text-xs">
                  #{renewals.length} of {policy.renewal_limit}
                </Badge>
                {needsEvaluation && (
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                    Review Required
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Policy Limits */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {policy.daily_delta_limit && (
              <div>
                <span className="text-gray-400">Daily Delta</span>
                <div className="font-mono text-white">
                  ≤{(policy.daily_delta_limit * 100).toFixed(1)}%
                </div>
              </div>
            )}
            
            {policy.coverage_limit_pct && (
              <div>
                <span className="text-gray-400">Coverage</span>
                <div className="font-mono text-white">
                  ≤{(policy.coverage_limit_pct * 100).toFixed(1)}%
                </div>
              </div>
            )}
            
            {policy.concurrent_substeps_limit && (
              <div>
                <span className="text-gray-400">Substeps</span>
                <div className="font-mono text-white">
                  ≤{policy.concurrent_substeps_limit}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Validation */}
      {previewAttempt && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <Card className={`border ${
            previewAttempt.decision.result === 'block' ? 'border-red-500/30 bg-red-500/10' :
            previewAttempt.decision.result === 'throttle' ? 'border-yellow-500/30 bg-yellow-500/10' :
            'border-green-500/30 bg-green-500/10'
          }`}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                {previewAttempt.decision.result === 'block' ? (
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5" />
                ) : previewAttempt.decision.result === 'throttle' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    {previewAttempt.decision.result === 'block' ? 'Action Blocked' :
                     previewAttempt.decision.result === 'throttle' ? 'Limits Applied' :
                     'Safe to Proceed'}
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    {GuardrailEngine.formatDecision(previewAttempt.decision, isExpertMode)}
                  </div>
                  
                  {previewAttempt.decision.adjusted && (
                    <div className="mt-2 text-xs text-blue-300">
                      Adjusted values will be applied automatically
                    </div>
                  )}
                </div>
                
                {previewAttempt.decision.result === 'block' && (
                  <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-xs">
                        Override
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manager Override Required</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                          This action is blocked by guardrails. Provide justification for override:
                        </div>
                        <Textarea
                          placeholder="Explain why this override is necessary and safe..."
                          value={overrideRationale}
                          onChange={(e) => setOverrideRationale(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => setShowOverrideDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleOverride}
                            disabled={!overrideRationale.trim() || isOverriding}
                          >
                            {isOverriding ? 'Applying...' : 'Apply Override'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Test Actions (Development) */}
      <Card className="bg-glass/20 backdrop-blur-10 border-white/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-gray-400">Test Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => handlePreviewAttempt({ 
                changeKind: 'start',
                deltaEstimate: 0.05,
                coverageEstimatePct: 0.15
              })}
            >
              Start (Safe)
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => handlePreviewAttempt({ 
                changeKind: 'update',
                deltaEstimate: policy.daily_delta_limit ? policy.daily_delta_limit * 2 : 0.1,
                coverageEstimatePct: 0.25
              })}
            >
              Update (Over Limit)
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => handlePreviewAttempt({ 
                changeKind: 'publish',
                substepsRequested: policy.concurrent_substeps_limit ? policy.concurrent_substeps_limit + 1 : 5
              })}
            >
              Publish (Too Many)
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => handlePreviewAttempt({ changeKind: 'close' })}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};