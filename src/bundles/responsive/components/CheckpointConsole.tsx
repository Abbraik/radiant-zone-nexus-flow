import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bookmark, Upload, Save, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface CheckpointConsoleProps {
  claimId: string;
  onCheckpointCreated?: () => void;
}

export const CheckpointConsole: React.FC<CheckpointConsoleProps> = ({
  claimId,
  onCheckpointCreated
}) => {
  const { toast } = useToast();
  const [summary, setSummary] = useState('');
  const [tValue, setTValue] = useState('');
  const [rValue, setRValue] = useState('');
  const [iValue, setIValue] = useState('');
  const [tag, setTag] = useState<'start' | 'mid' | 'final'>('mid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (summary.length < 120) {
      toast({
        title: "Summary too short",
        description: "Please provide at least 120 characters describing the current state.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const triData = {
        t: tValue ? parseFloat(tValue) : undefined,
        r: rValue ? parseFloat(rValue) : undefined,
        i: iValue ? parseFloat(iValue) : undefined
      };

      // Mock checkpoint creation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form
      setSummary('');
      setTValue('');
      setRValue('');
      setIValue('');
      setTag('mid');
      
      onCheckpointCreated?.();
      
      toast({
        title: "Checkpoint recorded",
        description: "Progress has been saved and TRI event logged."
      });
    } catch (error) {
      toast({
        title: "Failed to save checkpoint",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-500" />
            Checkpoint Console
            <Badge variant="outline" className="text-xs">TRI Snapshot</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tag Selection */}
          <div className="space-y-2">
            <Label>Checkpoint Type</Label>
            <div className="flex gap-2">
              {(['start', 'mid', 'final'] as const).map((checkpointTag) => (
                <Button
                  key={checkpointTag}
                  variant={tag === checkpointTag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTag(checkpointTag)}
                >
                  {checkpointTag.charAt(0).toUpperCase() + checkpointTag.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Progress Summary</Label>
            <Textarea
              id="summary"
              placeholder="Describe current progress, decisions made, and any blockers encountered (minimum 120 characters)..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="text-xs text-muted-foreground text-right">
              {summary.length}/120 characters minimum
            </div>
          </div>

          {/* TRI Values */}
          <div className="space-y-4">
            <Label>TRI Values (Optional)</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-value" className="text-sm">T (Throughput)</Label>
                <Input
                  id="t-value"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={tValue}
                  onChange={(e) => setTValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-value" className="text-sm">R (Resilience)</Label>
                <Input
                  id="r-value"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={rValue}
                  onChange={(e) => setRValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="i-value" className="text-sm">I (Impact)</Label>
                <Input
                  id="i-value"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={iValue}
                  onChange={(e) => setIValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Attach Files
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || summary.length < 120}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Checkpoint
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};