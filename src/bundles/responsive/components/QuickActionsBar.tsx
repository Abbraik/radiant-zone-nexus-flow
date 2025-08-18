import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Plus, 
  ArrowUpDown, 
  Bookmark, 
  AlertTriangle, 
  RotateCcw 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsBarProps {
  claimId: string;
  claimStatus?: 'draft' | 'active' | 'paused' | 'done';
  onAddSubstep?: () => void;
  onReorderMode?: () => void;
  onMarkCheckpoint?: () => void;
  onRequestEscalation?: () => void;
  onSwitchMode?: () => void;
  readonly?: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  claimId,
  claimStatus = 'draft',
  onAddSubstep,
  onReorderMode,
  onMarkCheckpoint,
  onRequestEscalation,
  onSwitchMode,
  readonly = false
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlayPause = async () => {
    if (readonly || isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (claimStatus === 'active') {
        // Mock pause action
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({
          title: "Claim paused",
          description: "Work has been temporarily suspended."
        });
      } else {
        // Mock start action
        await new Promise(resolve => setTimeout(resolve, 500));
        toast({
          title: "Claim activated",
          description: "Work is now in progress."
        });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const actions = [
    {
      id: 'play-pause',
      icon: claimStatus === 'active' ? Pause : Play,
      label: claimStatus === 'active' ? 'Pause' : 'Start',
      onClick: handlePlayPause,
      variant: claimStatus === 'active' ? 'outline' : 'default',
      disabled: readonly || isProcessing,
      primary: true
    },
    {
      id: 'add-substep',
      icon: Plus,
      label: 'Add Sub-Step',
      onClick: onAddSubstep,
      variant: 'outline',
      disabled: readonly || claimStatus !== 'active',
      primary: false
    },
    {
      id: 'reorder',
      icon: ArrowUpDown,
      label: 'Reorder',
      onClick: onReorderMode,
      variant: 'outline',
      disabled: readonly,
      primary: false
    },
    {
      id: 'checkpoint',
      icon: Bookmark,
      label: 'Mark Checkpoint',
      onClick: onMarkCheckpoint,
      variant: 'outline',
      disabled: readonly || claimStatus !== 'active',
      primary: false
    },
    {
      id: 'escalation',
      icon: AlertTriangle,
      label: 'Request Escalation',
      onClick: onRequestEscalation,
      variant: 'outline',
      disabled: readonly,
      primary: false
    },
    {
      id: 'switch-mode',
      icon: RotateCcw,
      label: 'Switch Mode',
      onClick: onSwitchMode,
      variant: 'ghost',
      disabled: readonly,
      primary: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4"
    >
      <div className="flex items-center justify-between">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <Badge variant={
            claimStatus === 'active' ? 'default' : 
            claimStatus === 'paused' ? 'secondary' : 
            'outline'
          }>
            {claimStatus}
          </Badge>
          {claimStatus === 'active' && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant as any}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className={`flex items-center gap-2 ${
                  action.primary ? 'min-w-[100px]' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="sm:hidden mt-3 grid grid-cols-3 gap-2">
        {actions.slice(1, 4).map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
};