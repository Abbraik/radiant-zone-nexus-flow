import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Users, Merge, Calendar, ArrowRight, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ConflictingClaim {
  id: string;
  loopName: string;
  actor: string;
  leverIntent: 'N→P' | 'P→S' | 'S→P';
  sharedNodes: string[];
  status: 'active' | 'pending';
  priority: 'high' | 'medium' | 'low';
}

interface HarmonizationDrawerProps {
  conflicts: ConflictingClaim[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isManager?: boolean;
}

export const HarmonizationDrawer: React.FC<HarmonizationDrawerProps> = ({
  conflicts,
  isOpen = false,
  onOpenChange,
  isManager = false
}) => {
  const { toast } = useToast();
  const [selectedDecision, setSelectedDecision] = useState<'merge' | 'sequence' | 'delegate' | 'keep'>('merge');
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDecision = async () => {
    if (!rationale.trim()) {
      toast({
        title: "Rationale required",
        description: "Please explain the reasoning for this decision.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock harmonization decision
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Decision recorded",
        description: `${selectedDecision.charAt(0).toUpperCase() + selectedDecision.slice(1)} action applied to conflicting claims.`
      });
      
      onOpenChange?.(false);
      setRationale('');
    } catch (error) {
      toast({
        title: "Failed to record decision",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const decisionOptions = [
    {
      id: 'merge',
      label: 'Merge',
      description: 'Combine overlapping substeps and consolidate actors',
      icon: Merge,
      color: 'blue'
    },
    {
      id: 'sequence',
      label: 'Sequence',
      description: 'Set execution order to prevent conflicts',
      icon: Calendar,
      color: 'green'
    },
    {
      id: 'delegate',
      label: 'Delegate',
      description: 'Reassign to different actors/shared nodes',
      icon: Users,
      color: 'orange'
    },
    {
      id: 'keep',
      label: 'Keep Parallel',
      description: 'Allow parallel execution with monitoring',
      icon: ArrowRight,
      color: 'purple'
    }
  ] as const;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Harmonization Required
            <Badge variant="destructive">{conflicts.length} Conflicts</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Conflicts Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conflicting Claims</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {conflicts.map((conflict, index) => (
                <motion.div
                  key={conflict.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{conflict.loopName}</h4>
                      <p className="text-sm text-muted-foreground">Actor: {conflict.actor}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={conflict.priority === 'high' ? 'destructive' : 'secondary'}>
                        {conflict.priority}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {conflict.leverIntent}
                      </div>
                    </div>
                  </div>
                  
                  {conflict.sharedNodes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Shared Nodes:</p>
                      <div className="flex flex-wrap gap-1">
                        {conflict.sharedNodes.map((node, nodeIndex) => (
                          <Badge key={nodeIndex} variant="outline" className="text-xs">
                            {node}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* Decision Options */}
          <div className="space-y-4">
            <h3 className="font-medium">Resolution Strategy</h3>
            <div className="grid grid-cols-2 gap-3">
              {decisionOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={selectedDecision === option.id ? "default" : "outline"}
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => setSelectedDecision(option.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="text-xs opacity-80">
                        {option.description}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Rationale */}
          <div className="space-y-2">
            <Label htmlFor="rationale">Decision Rationale</Label>
            <Textarea
              id="rationale"
              placeholder="Explain the reasoning behind this harmonization decision..."
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleDecision}
              disabled={!rationale.trim() || isSubmitting || !isManager}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Record Decision
            </Button>
          </div>

          {!isManager && (
            <div className="text-sm text-muted-foreground bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
              ℹ️ Manager approval required to record harmonization decisions.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};