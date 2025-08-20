import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Brain, 
  Users, 
  Building2,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface HandoffsCardProps {
  eligibility: {
    reflexive: boolean;
    deliberative: boolean;
    structural: boolean;
  };
  reading: {
    oscillation: number;
    dispersion: number;
    persistencePk: number;
    integralError: number;
  };
  onHandoff: (to: 'reflexive' | 'deliberative' | 'structural', reason: string) => void;
}

export const HandoffsCard: React.FC<HandoffsCardProps> = ({
  eligibility,
  reading,
  onHandoff
}) => {
  const [showConfirmation, setShowConfirmation] = useState<{
    to: 'reflexive' | 'deliberative' | 'structural';
    reason: string;
  } | null>(null);

  const handoffOptions = [
    {
      key: 'reflexive' as const,
      label: 'Reflexive',
      description: 'Retune controllers',
      icon: Brain,
      enabled: eligibility.reflexive,
      reason: reading.oscillation >= 0.4 
        ? `Oscillation detected (${Math.round(reading.oscillation * 100)}%)`
        : 'Re-breach pattern identified',
      disabledReason: `Enable when oscillation ≥ 40% (current: ${Math.round(reading.oscillation * 100)}%)`
    },
    {
      key: 'deliberative' as const,
      label: 'Deliberative',
      description: 'Trade-offs analysis',
      icon: Users,
      enabled: eligibility.deliberative,
      reason: reading.dispersion >= 0.5
        ? `High dispersion (${Math.round(reading.dispersion * 100)}%)`
        : 'Consent gate required',
      disabledReason: `Enable when dispersion ≥ 50% (current: ${Math.round(reading.dispersion * 100)}%)`
    },
    {
      key: 'structural' as const,
      label: 'Structural',  
      description: 'System redesign',
      icon: Building2,
      enabled: eligibility.structural,
      reason: reading.persistencePk >= 0.5
        ? `Persistent issues (${Math.round(reading.persistencePk * 100)}%)`
        : `Integral error accumulation (${Math.round(reading.integralError * 100)}%)`,
      disabledReason: `Enable when persistence ≥ 50% (current: ${Math.round(reading.persistencePk * 100)}%)`
    }
  ];

  const handleHandoffRequest = (option: typeof handoffOptions[0]) => {
    if (!option.enabled) return;
    
    setShowConfirmation({
      to: option.key,
      reason: option.reason
    });
  };

  const confirmHandoff = () => {
    if (!showConfirmation) return;
    
    onHandoff(showConfirmation.to, showConfirmation.reason);
    setShowConfirmation(null);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-primary" />
          Handoffs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {handoffOptions.map((option, index) => (
            <motion.div
              key={option.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 border rounded-lg transition-all ${
                option.enabled 
                  ? 'border-border bg-card/50 hover:bg-card/80 cursor-pointer' 
                  : 'border-border/30 bg-muted/30 cursor-not-allowed opacity-60'
              }`}
              onClick={() => handleHandoffRequest(option)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <option.icon className={`h-4 w-4 ${option.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${option.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                    → {option.label}
                  </span>
                </div>
                {option.enabled ? (
                  <Badge variant="secondary" className="text-xs text-success border-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {option.description}
              </p>
              
              <div className="text-xs">
                {option.enabled ? (
                  <div className="text-success">
                    <strong>Reason:</strong> {option.reason}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    {option.disabledReason}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 border border-warning/20 bg-warning/5 rounded-lg"
            >
              <div className="flex items-center gap-2 text-warning text-sm font-medium mb-3">
                <Info className="h-4 w-4" />
                Confirm Handoff to {showConfirmation.to.charAt(0).toUpperCase() + showConfirmation.to.slice(1)}
              </div>
              
              <p className="text-sm text-foreground mb-2">
                <strong>Evidence:</strong> {showConfirmation.reason}
              </p>
              
              <p className="text-xs text-muted-foreground mb-4">
                This will transfer control to {showConfirmation.to} capacity and log a handoff event.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={confirmHandoff}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm Handoff
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowConfirmation(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <div className="pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-1 mb-1">
            <Info className="h-3 w-3" />
            <span>Handoffs available: {handoffOptions.filter(o => o.enabled).length}/3</span>
          </div>
          <p>
            Use keyboard shortcut <kbd className="px-1 py-0.5 bg-muted rounded text-xs">R</kbd> to focus this section
          </p>
        </div>
      </CardContent>
    </Card>
  );
};