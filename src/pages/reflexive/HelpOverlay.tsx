import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Keyboard, HelpCircle } from 'lucide-react';

interface HelpOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpOverlay: React.FC<HelpOverlayProps> = ({
  open,
  onOpenChange
}) => {
  const shortcuts = [
    { key: 'R', description: 'Apply Safe Recipe (if available)' },
    { key: 'E', description: 'Advanced Edit (open tuner sheet)' },
    { key: 'W', description: 'Save Band/Weight Changes (in bands screen)' },
    { key: 'L', description: 'Add Governance Note (focus textarea)' },
    { key: 'H', description: 'Open Handoffs menu' },
    { key: 'S', description: 'Schedule Review' },
    { key: '?', description: 'Show this help overlay' }
  ];

  const capacityThresholds = [
    {
      capacity: 'Responsive',
      condition: 'severity ≥ 0.5 && slope > 0',
      description: 'Risk spike requiring immediate containment'
    },
    {
      capacity: 'Deliberative', 
      condition: 'dispersion ≥ 0.5 || consent required',
      description: 'Trade-offs and stakeholder concerns need attention'
    },
    {
      capacity: 'Structural',
      condition: 'persistence ≥ 0.5 || integral error ≥ 0.5',
      description: 'Chronic issues indicating systemic problems'
    }
  ];

  const policies = [
    { code: 'META-L01', description: 'Band changes require review within 14 days' },
    { code: 'META-L02', description: 'Controller family changes must be evaluated' },
    { code: 'META-L04', description: 'High data penalty blocks irreversible operations' },
    { code: 'META-L05', description: 'Maximum 2 renewals without evaluation' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Reflexive Capacity Help
          </DialogTitle>
          <DialogDescription>
            Quick reference for keyboard shortcuts, handoff conditions, and governance policies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Keyboard Shortcuts */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              Keyboard Shortcuts
            </h3>
            <div className="grid gap-2">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {shortcut.key}
                    </Badge>
                    <span className="text-sm">{shortcut.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Handoff Conditions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Handoff Conditions</h3>
            <div className="space-y-3">
              {capacityThresholds.map((item) => (
                <div key={item.capacity} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{item.capacity}</Badge>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {item.condition}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground pl-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Governance Policies */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Governance Policies</h3>
            <div className="space-y-2">
              {policies.map((policy) => (
                <div key={policy.code} className="flex items-start gap-3">
                  <Badge variant="outline" className="shrink-0">
                    {policy.code}
                  </Badge>
                  <p className="text-sm">{policy.description}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quick Tips */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Tips</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Recipe-first approach: Use suggested recipes for safe, tested changes</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Always provide rationale: All changes require documentation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Watch for guardrails: Yellow warnings indicate approaching limits</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                <span>Schedule evaluations: Track the impact of your changes</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};