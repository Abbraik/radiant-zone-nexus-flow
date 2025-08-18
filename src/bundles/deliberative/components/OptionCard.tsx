import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  Plus, 
  Target, 
  DollarSign, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import type { Option } from '@/hooks/useDeliberativeBundle';

interface OptionCardProps {
  option?: Option;
  onSave: (optionData: Partial<Option>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  isEditing?: boolean;
  onEditToggle?: () => void;
  readonly?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  onSave,
  onDelete,
  onDuplicate,
  isEditing = false,
  onEditToggle,
  readonly = false
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: option?.name || '',
    lever: option?.lever || 'N',
    actor: option?.actor || '',
    effect: {
      description: option?.effect?.description || '',
      impact_score: option?.effect?.impact_score || 0.5,
      risk_score: option?.effect?.risk_score || 0.3
    },
    cost: option?.cost || 0,
    effort: option?.effort || 1,
    time_to_impact: option?.time_to_impact || '30 days'
  });

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for this option.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.actor.trim()) {
      toast({
        title: "Actor required",
        description: "Please specify who will execute this option.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    onEditToggle?.();
  };

  const leverColors = {
    N: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    P: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    S: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  const leverLabels = {
    N: 'Narrow (Technical)',
    P: 'Policy (Structural)', 
    S: 'Strategy (Paradigm)'
  };

  if (isEditing || !option) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {option ? 'Edit Option' : 'New Option'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Option Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Automated monitoring system"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lever">Leverage Level</Label>
                <Select 
                  value={formData.lever} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, lever: value as 'N' | 'P' | 'S' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">N - Narrow (Technical)</SelectItem>
                    <SelectItem value="P">P - Policy (Structural)</SelectItem>
                    <SelectItem value="S">S - Strategy (Paradigm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actor">Target Actor</Label>
              <Input
                id="actor"
                value={formData.actor}
                onChange={(e) => setFormData(prev => ({ ...prev, actor: e.target.value }))}
                placeholder="e.g., DevOps Team, Product Manager"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Expected Effect</Label>
              <Textarea
                id="description"
                value={formData.effect.description}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  effect: { ...prev.effect, description: e.target.value }
                }))}
                placeholder="Describe the intended outcome and impact..."
                className="min-h-[80px]"
              />
            </div>

            {/* Metrics */}
            <Separator />
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost (USD)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effort">Effort (1-10)</Label>
                <Input
                  id="effort"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.effort}
                  onChange={(e) => setFormData(prev => ({ ...prev, effort: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time to Impact</Label>
                <Input
                  id="time"
                  value={formData.time_to_impact}
                  onChange={(e) => setFormData(prev => ({ ...prev, time_to_impact: e.target.value }))}
                  placeholder="e.g., 30 days, 3 months"
                />
              </div>
            </div>

            {/* Impact & Risk Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="impact">Impact Score (0-1)</Label>
                <Input
                  id="impact"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.effect.impact_score}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    effect: { ...prev.effect, impact_score: parseFloat(e.target.value) || 0.5 }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk">Risk Score (0-1)</Label>
                <Input
                  id="risk"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.effect.risk_score}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    effect: { ...prev.effect, risk_score: parseFloat(e.target.value) || 0.3 }
                  }))}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={onEditToggle}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {option ? 'Update Option' : 'Create Option'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">{option.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={leverColors[option.lever]}>
                  {leverLabels[option.lever]}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {option.actor}
                </Badge>
              </div>
            </div>
            
            {!readonly && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={onEditToggle}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDuplicate}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Description */}
          {option.effect?.description && (
            <p className="text-sm text-muted-foreground">
              {option.effect.description}
            </p>
          )}

          <Separator />

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">${option.cost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Cost</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">{option.effort}/10</div>
                <div className="text-xs text-muted-foreground">Effort</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-sm font-medium">{option.time_to_impact}</div>
                <div className="text-xs text-muted-foreground">Time to Impact</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-sm font-medium">
                  {Math.round((option.effect?.risk_score || 0.3) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Risk Level</div>
              </div>
            </div>
          </div>

          {/* Impact Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Impact Score</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((option.effect?.impact_score || 0.5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(option.effect?.impact_score || 0.5) * 100}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="pt-2">
            <Badge variant={option.status === 'approved' ? 'default' : 'secondary'}>
              {option.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};