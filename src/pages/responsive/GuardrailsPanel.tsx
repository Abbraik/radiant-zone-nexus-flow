import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users, 
  TrendingUp,
  Settings,
  History,
  ChevronRight
} from 'lucide-react';

interface GuardrailsPanelProps {
  guardrails: {
    timeboxDays: number;
    caps: string[];
  };
  violation?: string;
  isManager?: boolean;
  onGuardrailUpdate?: (updates: any) => void;
}

export const GuardrailsPanel: React.FC<GuardrailsPanelProps> = ({
  guardrails,
  violation,
  isManager = false,
  onGuardrailUpdate
}) => {
  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempTimeboxDays, setTempTimeboxDays] = useState(guardrails.timeboxDays);

  const guardrailItems = [
    {
      name: 'Concurrent Substeps',
      description: 'Maximum parallel work streams',
      current: 3,
      limit: 5,
      unit: 'tasks',
      status: 'normal' as const,
      icon: Users,
      progress: (3 / 5) * 100
    },
    {
      name: 'Coverage Percentage',
      description: 'Maximum system coverage change',
      current: 32,
      limit: 40,
      unit: '%',
      status: 'warning' as const,
      icon: TrendingUp,
      progress: (32 / 40) * 100
    },
    {
      name: 'Time-box Duration',
      description: 'Maximum containment window',
      current: guardrails.timeboxDays,
      limit: 14,
      unit: 'days',
      status: guardrails.timeboxDays > 10 ? 'warning' as const : 'normal' as const,
      icon: Clock,
      progress: (guardrails.timeboxDays / 14) * 100
    },
    {
      name: 'Daily Delta Limit',
      description: 'Maximum change per day',
      current: 0.08,
      limit: 0.1,
      unit: '',
      status: 'normal' as const,
      icon: TrendingUp,
      progress: (0.08 / 0.1) * 100
    }
  ];

  const handleOverrideToggle = (enabled: boolean) => {
    if (enabled && !isManager) {
      return; // Prevent non-managers from enabling
    }
    
    if (enabled && !overrideReason.trim()) {
      return; // Require reason
    }
    
    setOverrideActive(enabled);
    if (!enabled) {
      setOverrideReason('');
    }
  };

  const handleSaveChanges = () => {
    onGuardrailUpdate?.({
      timeboxDays: tempTimeboxDays,
      overrideActive,
      overrideReason
    });
    setIsEditing(false);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Guardrails
          </CardTitle>
          {violation && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Violation
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Guardrail Items */}
        <div className="space-y-3">
          {guardrailItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                </div>
                <Badge 
                  variant={item.status === 'warning' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {item.current} / {item.limit} {item.unit}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {item.description}
              </p>
              
              <Progress 
                value={item.progress} 
                className={`h-2 ${item.status === 'warning' ? '[&>div]:bg-destructive' : '[&>div]:bg-success'}`}
              />
            </motion.div>
          ))}
        </div>

        {/* Manager Override Controls */}
        {isManager && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-warning/20 bg-warning/5 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <Label htmlFor="override-switch" className="text-sm font-medium">
                Manager Override
              </Label>
              <Switch
                id="override-switch"
                checked={overrideActive}
                onCheckedChange={handleOverrideToggle}
              />
            </div>
            
            {overrideActive && (
              <div className="space-y-2">
                <Label htmlFor="override-reason" className="text-xs text-muted-foreground">
                  Override Reason (Required)
                </Label>
                <Input
                  id="override-reason"
                  placeholder="Enter justification for override..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-3 text-xs text-warning">
              <AlertTriangle className="h-3 w-3" />
              <span>Override will bypass all capacity controls</span>
            </div>
          </motion.div>
        )}

        {/* Critical Breach Alert */}
        {violation === 'timebox_renewed_twice' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg"
          >
            <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-1">
              <AlertTriangle className="h-4 w-4" />
              Critical Guardrail Breach
            </div>
            <p className="text-xs text-muted-foreground">
              Time-box has been renewed twice without evaluation. Manager review required.
            </p>
          </motion.div>
        )}

        {/* Capacity Controls Section */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">Capacity Controls</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <History className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Adjust Limits
            </Button>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground">Emergency Actions</h4>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-between text-destructive border-destructive/20 hover:bg-destructive/5"
              disabled={!isManager}
            >
              Emergency Bypass
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {!isManager && (
              <p className="text-xs text-muted-foreground">
                Emergency actions require manager privileges
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};