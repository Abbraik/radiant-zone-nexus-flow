import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Megaphone, 
  CheckCircle, 
  MessageSquare, 
  Plus,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface QuickActionsBarProps {
  onStartSprint: () => void;
  onPublishBanner: () => void;
  onAckAlert: () => void;
  onAddNote: () => void;
  isStartingSprint?: boolean;
  readonly?: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onStartSprint,
  onPublishBanner,
  onAckAlert,
  onAddNote,
  isStartingSprint = false,
  readonly = false
}) => {
  const primaryActions = [
    {
      key: 'sprint',
      label: 'Start Containment Sprint',
      icon: Play,
      onClick: onStartSprint,
      disabled: isStartingSprint || readonly,
      variant: 'default' as const,
      shortcut: 'A'
    },
    {
      key: 'banner',
      label: 'Publish Status Banner',
      icon: Megaphone,
      onClick: onPublishBanner,
      disabled: readonly,
      variant: 'secondary' as const,
      shortcut: 'B'
    },
    {
      key: 'ack',
      label: 'Acknowledge Alert',
      icon: CheckCircle,
      onClick: onAckAlert,
      disabled: readonly,
      variant: 'secondary' as const,
      shortcut: '.'
    }
  ];

  const secondaryActions = [
    {
      key: 'note',
      label: 'Create Note',
      icon: MessageSquare,
      onClick: onAddNote,
      disabled: readonly,
      shortcut: 'N'
    },
    {
      key: 'timeline',
      label: 'Add Timeline Event',
      icon: Plus,
      onClick: () => console.log('Add timeline event'),
      disabled: readonly,
      shortcut: null
    }
  ];

  return (
    <Card className="glass">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-foreground">Quick Actions</h3>
          </div>
          
          {/* Primary Actions */}
          <div className="flex flex-wrap gap-3">
            {primaryActions.map((action, index) => (
              <motion.div
                key={action.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={action.variant}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="relative group"
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                  {action.shortcut && (
                    <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded border">
                      {action.shortcut}
                    </kbd>
                  )}
                  {action.key === 'sprint' && isStartingSprint && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                    </div>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {secondaryActions.map((action, index) => (
              <motion.div
                key={action.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <action.icon className="h-4 w-4 mr-1" />
                  {action.label}
                  {action.shortcut && (
                    <kbd className="ml-2 px-1 py-0.5 text-xs bg-muted text-muted-foreground rounded border">
                      {action.shortcut}
                    </kbd>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              {primaryActions.slice(0, 2).map((action) => (
                <Button
                  key={action.key}
                  variant={action.variant}
                  size="sm"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="text-xs"
                >
                  <action.icon className="h-3 w-3 mr-1" />
                  {action.label.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div>

          {readonly && (
            <div className="flex items-center gap-2 text-sm text-warning p-2 bg-warning/10 rounded-md">
              <AlertTriangle className="h-4 w-4" />
              <span>Actions disabled in read-only mode</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};