// Activation Panel - Shows capacity decision and provides action buttons
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Settings, Play } from 'lucide-react';
import type { ActivationDecision } from '@/services/capacity-brain/types';

interface ActivationPanelProps {
  decision: ActivationDecision;
  isLoading?: boolean;
  onOpen?: () => void;
  onOverride?: () => void;
}

export function ActivationPanel({ 
  decision, 
  isLoading, 
  onOpen, 
  onOverride 
}: ActivationPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (decision.blocked) {
    return (
      <Card className="border-destructive">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Data Check Needed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {decision.humanRationale}
          </p>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={onOpen}>
              Review Data Quality
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCapacityColor = (capacity: string) => {
    switch (capacity) {
      case 'responsive': return 'bg-red-500';
      case 'reflexive': return 'bg-blue-500';
      case 'deliberative': return 'bg-purple-500';
      case 'anticipatory': return 'bg-orange-500';
      case 'structural': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Badge className={getCapacityColor(decision.capacity || '')}>
            {decision.capacity?.toUpperCase()}
          </Badge>
          Capacity Activation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {decision.humanRationale}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {decision.reasonCodes.map(code => (
            <Badge key={code} variant="outline" className="text-xs">
              {code.replace('_', ' ')}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={onOpen} size="sm">
            <Play className="h-4 w-4 mr-1" />
            Open {decision.preselectTemplate}
          </Button>
          <Button variant="outline" size="sm" onClick={onOverride}>
            <Settings className="h-4 w-4 mr-1" />
            Override
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}