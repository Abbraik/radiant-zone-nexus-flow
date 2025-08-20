import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { CapacityPanel } from "./CapacityPanel";
import { useSignalToTask } from "@/hooks/useSignalToTask";
import type { EnhancedTask5C } from "@/5c/types";

interface Signal {
  id: string;
  loopCode: string;
  indicator: string;
  value: number;
  band: { lower: number; upper: number };
  timestamp: string;
  severity: number;
  trend: 'up' | 'down' | 'stable';
}

interface SignalMonitorProps {
  signals?: Signal[];
  onTasksCreated?: (tasks: EnhancedTask5C[]) => void;
  autoCreateTasks?: boolean;
}

// Mock signals for demonstration
const mockSignals: Signal[] = [
  {
    id: 'sig-1',
    loopCode: 'MES-L07',
    indicator: 'Reserve Margin',
    value: 12.8,
    band: { lower: 15, upper: 25 },
    timestamp: new Date().toISOString(),
    severity: 0.4,
    trend: 'down'
  },
  {
    id: 'sig-2', 
    loopCode: 'MAC-L04',
    indicator: 'Price-to-Income',
    value: 7.2,
    band: { lower: 3, upper: 6 },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    severity: 0.8,
    trend: 'up'
  }
];

export function SignalMonitor({ 
  signals = mockSignals, 
  onTasksCreated, 
  autoCreateTasks = false 
}: SignalMonitorProps) {
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [showCapacityPanel, setShowCapacityPanel] = useState(false);
  const { createTasksFromSignal } = useSignalToTask({
    onTasksCreated
  });

  // Auto-create tasks for high severity signals
  useEffect(() => {
    if (!autoCreateTasks) return;
    
    const highSeveritySignals = signals.filter(s => s.severity >= 0.7);
    
    highSeveritySignals.forEach(async (signal) => {
      try {
        await createTasksFromSignal({
          loopCode: signal.loopCode,
          indicator: signal.indicator,
          tstamp: signal.timestamp,
          reading: {
            value: signal.value,
            band: signal.band,
            slope: signal.trend === 'up' ? 0.7 : signal.trend === 'down' ? -0.7 : 0,
            persistencePk: signal.severity > 0.8 ? 0.9 : 0.5,
            ewsProb: signal.severity,
            bufferAdequacy: 1 - signal.severity
          }
        });
      } catch (error) {
        console.error('Failed to auto-create tasks for signal:', signal.id, error);
      }
    });
  }, [signals, autoCreateTasks, createTasksFromSignal]);

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.7) return 'bg-red-500';
    if (severity >= 0.4) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 0.7) return 'Critical';
    if (severity >= 0.4) return 'Warning';
    return 'Normal';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const handleAnalyzeSignal = (signal: Signal) => {
    setSelectedSignal(signal);
    setShowCapacityPanel(true);
  };

  if (showCapacityPanel && selectedSignal) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Capacity Analysis</h3>
            <p className="text-sm text-muted-foreground">
              {selectedSignal.loopCode} • {selectedSignal.indicator}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowCapacityPanel(false)}
          >
            Back to Signals
          </Button>
        </div>
        
        <CapacityPanel
          loopCode={selectedSignal.loopCode}
          indicator={selectedSignal.indicator}
          reading={{
            value: selectedSignal.value,
            band: selectedSignal.band,
            slope: selectedSignal.trend === 'up' ? 0.7 : selectedSignal.trend === 'down' ? -0.7 : 0,
            persistencePk: selectedSignal.severity > 0.8 ? 0.9 : 0.5,
            ewsProb: selectedSignal.severity,
            bufferAdequacy: 1 - selectedSignal.severity
          }}
          onTasksComposed={(tasks) => {
            console.log('Tasks composed from signal:', tasks);
            onTasksCreated?.(tasks);
            setShowCapacityPanel(false);
          }}
        />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Signal Monitor</h3>
        </div>
        <Badge variant="outline">
          {signals.length} active signals
        </Badge>
      </div>

      <div className="space-y-3">
        {signals.map((signal) => (
          <div 
            key={signal.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getSeverityColor(signal.severity)}`} />
              <div>
                <div className="font-medium">
                  {signal.loopCode} • {signal.indicator}
                </div>
                <div className="text-sm text-muted-foreground">
                  Value: {signal.value} (Band: {signal.band.lower}-{signal.band.upper})
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {getTrendIcon(signal.trend)}
              <Badge variant="outline">
                {getSeverityLabel(signal.severity)}
              </Badge>
              <Button 
                size="sm" 
                onClick={() => handleAnalyzeSignal(signal)}
              >
                Analyze
              </Button>
            </div>
          </div>
        ))}
      </div>

      {signals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No active signals detected
        </div>
      )}
    </Card>
  );
}