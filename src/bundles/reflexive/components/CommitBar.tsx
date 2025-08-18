import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, ArrowRight, Zap, FileText, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CommitBarProps {
  hasChanges?: boolean;
  changesSummary?: {
    bandChanges?: any;
    srtChanges?: any;
    changeMagnitude?: number;
  };
  onApplyRetune?: (rationale: string) => void;
  onCreateRedesignTask?: (reason: string) => void;
  onSwitchMode?: () => void;
  isApplying?: boolean;
  requiresApproval?: boolean;
}

export const CommitBar: React.FC<CommitBarProps> = ({
  hasChanges = false,
  changesSummary,
  onApplyRetune,
  onCreateRedesignTask,
  onSwitchMode,
  isApplying = false,
  requiresApproval = false
}) => {
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const [isRedesignDialogOpen, setIsRedesignDialogOpen] = useState(false);
  const [rationale, setRationale] = useState('');
  const [redesignReason, setRedesignReason] = useState('');

  const handleApplyRetune = () => {
    if (rationale.trim().length < 20) return;
    
    onApplyRetune?.(rationale);
    setIsCommitDialogOpen(false);
    setRationale('');
  };

  const handleCreateRedesignTask = () => {
    if (redesignReason.trim().length < 10) return;
    
    onCreateRedesignTask?.(redesignReason);
    setIsRedesignDialogOpen(false);
    setRedesignReason('');
  };

  const isRationaleValid = rationale.trim().length >= 20;
  const isRedesignReasonValid = redesignReason.trim().length >= 10;

  const getMagnitudeColor = (magnitude?: number) => {
    if (!magnitude) return 'bg-gray-500/10 text-gray-700 border-gray-200';
    if (magnitude <= 0.05) return 'bg-green-500/10 text-green-700 border-green-200';
    if (magnitude <= 0.15) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    return 'bg-red-500/10 text-red-700 border-red-200';
  };

  const getMagnitudeLabel = (magnitude?: number) => {
    if (!magnitude) return 'No changes';
    if (magnitude <= 0.05) return 'Small change';
    if (magnitude <= 0.15) return 'Medium change';
    return 'Large change';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t"
    >
      <Card className="rounded-none border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${hasChanges ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  {hasChanges ? 'Changes Ready' : 'No Changes'}
                </span>
              </div>

              {changesSummary && hasChanges && (
                <div className="flex items-center gap-2">
                  <Badge className={getMagnitudeColor(changesSummary.changeMagnitude)} variant="outline">
                    {getMagnitudeLabel(changesSummary.changeMagnitude)}
                  </Badge>
                  
                  {requiresApproval && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                      Approval Required
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Create Redesign Task */}
              <Dialog open={isRedesignDialogOpen} onOpenChange={setIsRedesignDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Create Redesign Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Redesign Task</DialogTitle>
                    <DialogDescription>
                      Create a deliberative task if current changes show minimal improvement or system needs structural redesign.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="redesign-reason">Reason for Redesign</Label>
                      <Textarea
                        id="redesign-reason"
                        placeholder="Explain why the system needs redesign rather than parameter tuning..."
                        value={redesignReason}
                        onChange={(e) => setRedesignReason(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {redesignReason.length}/10 characters minimum
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRedesignDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateRedesignTask}
                      disabled={!isRedesignReasonValid}
                      className="gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Switch Mode */}
              <Button variant="outline" size="sm" onClick={onSwitchMode} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Switch Mode
              </Button>

              <Separator orientation="vertical" className="h-6" />

              {/* Apply Retune */}
              <Dialog open={isCommitDialogOpen} onOpenChange={setIsCommitDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    disabled={!hasChanges || isApplying} 
                    className="gap-2"
                    size="sm"
                  >
                    <Zap className="h-4 w-4" />
                    {isApplying ? 'Applying...' : 'Apply Retune'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply Retune Changes</DialogTitle>
                    <DialogDescription>
                      Provide a rationale for these changes. They will be applied immediately and evaluated at the next heartbeat.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {changesSummary && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Change Summary</h4>
                        <div className="space-y-1 text-xs">
                          {changesSummary.bandChanges && (
                            <div>Band adjustments: {Object.keys(changesSummary.bandChanges).length} parameters</div>
                          )}
                          {changesSummary.srtChanges && (
                            <div>SRT adjustments: {Object.keys(changesSummary.srtChanges).length} parameters</div>
                          )}
                          {changesSummary.changeMagnitude && (
                            <div>
                              Magnitude: {(changesSummary.changeMagnitude * 100).toFixed(1)}% change
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="rationale">Rationale (Required)</Label>
                      <Textarea
                        id="rationale"
                        placeholder="Explain the reasoning behind these changes, expected impact, and any relevant context..."
                        value={rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {rationale.length}/20 characters minimum
                      </p>
                    </div>

                    {requiresApproval && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800 text-sm font-medium">
                          <Check className="h-4 w-4" />
                          Manager Approval Required
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          These changes require manager approval due to their magnitude.
                        </p>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCommitDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleApplyRetune}
                      disabled={!isRationaleValid || isApplying}
                      className="gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      {requiresApproval ? 'Submit for Approval' : 'Apply Changes'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};