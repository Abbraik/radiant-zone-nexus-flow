import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, Shield, Users, Building } from 'lucide-react';

interface HandoffStates {
  responsive: boolean;
  deliberative: boolean;
  structural: boolean;
}

interface HandoffsPanelProps {
  states: HandoffStates;
  onHandoff: (to: string, reason: string) => void;
}

export const HandoffsPanel: React.FC<HandoffsPanelProps> = ({
  states,
  onHandoff
}) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    target: string;
    reason: string;
  }>({
    isOpen: false,
    target: '',
    reason: ''
  });

  const handoffOptions = [
    {
      id: 'responsive',
      label: 'Responsive',
      subtitle: '(risk spike)',
      icon: <Shield className="h-4 w-4" />,
      enabled: states.responsive,
      disabledReason: 'Enable when severity ≥ 0.5 and slope > 0',
      reason: 'Retune risk requires short-term containment',
      description: 'Hand off to Responsive capacity to contain immediate risk and stabilize the system.'
    },
    {
      id: 'deliberative',
      label: 'Deliberative', 
      subtitle: '(consent/trade-offs)',
      icon: <Users className="h-4 w-4" />,
      enabled: states.deliberative,
      disabledReason: 'Enable when dispersion ≥ 0.5 or consent required',
      reason: 'Trade-offs/consent threshold reached',
      description: 'Hand off to Deliberative capacity to address stakeholder concerns and evaluate trade-offs.'
    },
    {
      id: 'structural',
      label: 'Structural',
      subtitle: '(chronic)',
      icon: <Building className="h-4 w-4" />,
      enabled: states.structural,
      disabledReason: 'Enable when persistence ≥ 0.5 or integral error ≥ 0.5',
      reason: 'Chronic drift indicates structural cause',
      description: 'Hand off to Structural capacity to address systemic issues and governance gaps.'
    }
  ];

  const handleHandoffClick = (option: typeof handoffOptions[0]) => {
    if (!option.enabled) return;
    
    setConfirmDialog({
      isOpen: true,
      target: option.id,
      reason: option.reason
    });
  };

  const confirmHandoff = () => {
    onHandoff(confirmDialog.target, confirmDialog.reason);
    setConfirmDialog({ isOpen: false, target: '', reason: '' });
  };

  const getButtonVariant = (enabled: boolean) => {
    return enabled ? 'outline' : 'ghost';
  };

  return (
    <>
      <Card data-testid="handoffs-panel" tabIndex={-1}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Handoffs
          </CardTitle>
          <CardDescription>
            Route to other capacities based on signal conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {handoffOptions.map((option) => (
              <div key={option.id} className="space-y-2">
                <Button
                  variant={getButtonVariant(option.enabled)}
                  disabled={!option.enabled}
                  onClick={() => handleHandoffClick(option)}
                  className="w-full justify-start h-auto p-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    {option.icon}
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">→ {option.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {option.subtitle}
                        </span>
                      </div>
                    </div>
                  </div>
                </Button>
                
                {!option.enabled && (
                  <p className="text-xs text-muted-foreground px-3">
                    {option.disabledReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        setConfirmDialog({ ...confirmDialog, isOpen: open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Handoff</DialogTitle>
            <DialogDescription>
              {handoffOptions.find(opt => opt.id === confirmDialog.target)?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Handoff Reason:</div>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {confirmDialog.reason}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
            >
              Cancel
            </Button>
            <Button onClick={confirmHandoff}>
              Confirm Handoff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};