import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react';
import { useGlue } from '@/hooks/useGlue';

interface ModeSwitchUXProps {
  isOpen: boolean;
  onClose: () => void;
  currentLoopId: string;
  currentTaskId?: string;
  onModeSwitch?: (taskId: string) => void;
}

export default function ModeSwitchUX({ 
  isOpen, 
  onClose, 
  currentLoopId, 
  currentTaskId,
  onModeSwitch 
}: ModeSwitchUXProps) {
  const { suggestCapacity, createTaskWithLink, logEvent } = useGlue();
  const [rationale, setRationale] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('');
  const [isOverriding, setIsOverriding] = useState(false);

  // Get recommendation when dialog opens
  useEffect(() => {
    if (isOpen && currentLoopId) {
      suggestCapacity.mutate({ 
        loopId: currentLoopId,
        context: { current_task_id: currentTaskId }
      });
    }
  }, [isOpen, currentLoopId, currentTaskId]);

  const recommendation = suggestCapacity.data;

  const handleCapacitySelect = (capacity: string) => {
    setSelectedCapacity(capacity);
    if (capacity !== recommendation?.capacity) {
      setIsOverriding(true);
    } else {
      setIsOverriding(false);
      setRationale('');
    }
  };

  const handleConfirm = () => {
    if (isOverriding && rationale.length < 120) {
      return; // Don't proceed if override rationale too short
    }

    const context = {
      recommended_capacity: recommendation?.capacity,
      override: isOverriding,
      rationale: rationale || `Switching to ${selectedCapacity} capacity based on system recommendation.`,
      confidence: recommendation?.confidence
    };

    createTaskWithLink.mutate({
      fromTaskId: currentTaskId,
      capacity: selectedCapacity,
      loopId: currentLoopId,
      context
    }, {
      onSuccess: (data) => {
        // Log the mode switch event
        logEvent.mutate({
          eventType: isOverriding ? 'mode_overridden' : 'mode_accepted',
          loopId: currentLoopId,
          taskId: (data as any).task_id,
          capacity: selectedCapacity,
          metadata: context
        });

        onModeSwitch?.((data as any).task_id);
        onClose();
        setRationale('');
        setSelectedCapacity('');
        setIsOverriding(false);
      }
    });
  };

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'responsive': return 'bg-red-100 text-red-800 border-red-200';
      case 'reflexive': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deliberative': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'anticipatory': return 'bg-green-100 text-green-800 border-green-200';
      case 'structural': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCapacityDescription = (capacity: string) => {
    switch (capacity) {
      case 'responsive': return 'React to immediate issues and breaches';
      case 'reflexive': return 'Retune system parameters and optimize';
      case 'deliberative': return 'Analyze options and make strategic decisions';
      case 'anticipatory': return 'Prepare for future scenarios and risks';
      case 'structural': return 'Redesign governance and authority structures';
      default: return '';
    }
  };

  const capacities = ['responsive', 'reflexive', 'deliberative', 'anticipatory', 'structural'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Switch Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Diagnostics */}
          {recommendation?.scorecard_snapshot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Current Loop State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">DE State</p>
                    <p className="font-medium">{recommendation.scorecard_snapshot.de_state || 'stable'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">TRI Slope</p>
                    <p className="font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {recommendation.scorecard_snapshot.tri_slope?.toFixed(3) || '0.000'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Breach Days</p>
                    <p className="font-medium">{recommendation.scorecard_snapshot.breach_days || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendation */}
          {suggestCapacity.isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Analyzing loop state...</span>
            </div>
          ) : recommendation ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  Recommended Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline" 
                    className={`${getCapacityColor(recommendation.capacity)} font-medium`}
                  >
                    {recommendation.capacity}
                  </Badge>
                  <Badge variant="secondary">
                    {Math.round(recommendation.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getCapacityDescription(recommendation.capacity)}
                </p>
                {recommendation.reasons && recommendation.reasons.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Reasoning:</p>
                    {recommendation.reasons.map((reason, index) => (
                      <p key={index} className="text-xs text-muted-foreground">• {reason}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Mode</Label>
            <div className="grid grid-cols-1 gap-2">
              {capacities.map((capacity) => (
                <button
                  key={capacity}
                  onClick={() => handleCapacitySelect(capacity)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedCapacity === capacity
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCapacityColor(capacity)}`}
                      >
                        {capacity}
                      </Badge>
                      {capacity === recommendation?.capacity && (
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getCapacityDescription(capacity)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Override Rationale */}
          {isOverriding && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Override Rationale (required, min. 120 characters)
              </Label>
              <Textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Explain why you're overriding the system recommendation..."
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {rationale.length}/120 characters
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={
                !selectedCapacity || 
                createTaskWithLink.isPending ||
                (isOverriding && rationale.length < 120)
              }
            >
              {createTaskWithLink.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Task...
                </>
              ) : (
                `Create ${selectedCapacity} Task`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}