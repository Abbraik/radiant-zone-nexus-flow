import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Globe, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react';

interface HarmonizationDrawerProps {
  hubSaturation: number;
  dispersion: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyThrottle: (config: { affectedLoops?: number }) => void;
  isManager?: boolean;
}

export const HarmonizationDrawer: React.FC<HarmonizationDrawerProps> = ({
  hubSaturation,
  dispersion,
  isOpen,
  onOpenChange,
  onApplyThrottle,
  isManager = false
}) => {
  const [throttleEnabled, setThrottleEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const affectedLoops = Math.floor(hubSaturation * 5) + 2; // Mock calculation
  const cascadePath = ['HEALTH-MAIN', 'HEALTH-REGIONAL', 'TRANSPORT-HUB'];

  const handleApplyThrottle = () => {
    if (!throttleEnabled) return;
    
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    onApplyThrottle({ affectedLoops });
    setShowConfirmation(false);
    setThrottleEnabled(false);
  };

  const getSaturationStatus = () => {
    if (hubSaturation > 0.8) return { color: 'destructive', label: 'Critical' };
    if (hubSaturation > 0.6) return { color: 'warning', label: 'High' };
    return { color: 'success', label: 'Normal' };
  };

  const getDispersionStatus = () => {
    if (dispersion > 0.7) return { color: 'destructive', label: 'High' };
    if (dispersion > 0.4) return { color: 'warning', label: 'Medium' };
    return { color: 'success', label: 'Low' };
  };

  const saturationStatus = getSaturationStatus();
  const dispersionStatus = getDispersionStatus();

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Harmonization
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onOpenChange(!isOpen)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hub Saturation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Hub Saturation</Label>
            <Badge variant={saturationStatus.color as any} className="text-xs">
              {saturationStatus.label}
            </Badge>
          </div>
          <Progress 
            value={hubSaturation * 100} 
            className={`h-2 ${
              saturationStatus.color === 'destructive' ? '[&>div]:bg-destructive' : 
              saturationStatus.color === 'warning' ? '[&>div]:bg-warning' : '[&>div]:bg-success'
            }`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium">{Math.round(hubSaturation * 100)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Dispersion */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Dispersion</Label>
            <Badge variant={dispersionStatus.color as any} className="text-xs">
              {dispersionStatus.label}
            </Badge>
          </div>
          <Progress 
            value={dispersion * 100} 
            className={`h-2 ${
              dispersionStatus.color === 'destructive' ? '[&>div]:bg-destructive' : 
              dispersionStatus.color === 'warning' ? '[&>div]:bg-warning' : '[&>div]:bg-success'
            }`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium">{Math.round(dispersion * 100)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Cross-loop Throttle Control */}
        <div className="p-3 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="throttle-switch" className="text-sm font-medium">
              Link throttle to neighbors
            </Label>
            <Switch
              id="throttle-switch"
              checked={throttleEnabled}
              onCheckedChange={setThrottleEnabled}
              disabled={!isManager}
            />
          </div>
          
          {throttleEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 text-sm text-warning">
                <AlertTriangle className="h-4 w-4" />
                <span>This affects {affectedLoops} loops</span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Coordinated throttle will be applied to shared nodes across the cascade path.
              </div>
            </motion.div>
          )}
          
          {!isManager && (
            <div className="text-xs text-muted-foreground">
              Manager privileges required for throttle control
            </div>
          )}
        </div>

        {/* Cascade Path */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Cascade Path
          </Label>
          <div className="flex items-center gap-2 text-sm">
            {cascadePath.map((path, index) => (
              <React.Fragment key={path}>
                <Badge variant="outline" className="text-xs">
                  {path}
                </Badge>
                {index < cascadePath.length - 1 && (
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="text-xs mt-2">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Cascade Viewer
          </Button>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border">
          {!showConfirmation ? (
            <Button 
              onClick={handleApplyThrottle}
              disabled={!throttleEnabled || !isManager}
              className="w-full"
              variant={throttleEnabled ? "default" : "secondary"}
            >
              Apply Cross-Loop Throttle
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2 text-warning text-sm font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Confirm Throttle Application
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  This will apply coordinated throttle across {affectedLoops} affected loops. 
                  The action cannot be undone without manual intervention.
                </p>
                <div className="text-xs text-muted-foreground">
                  Affected: {cascadePath.join(', ')}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleApplyThrottle}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};