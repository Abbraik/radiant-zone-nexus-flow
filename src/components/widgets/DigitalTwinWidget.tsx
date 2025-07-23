import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, TrendingUp, Cpu } from 'lucide-react';

interface DigitalTwinWidgetProps {
  task: any;
}

const DigitalTwinWidget: React.FC<DigitalTwinWidgetProps> = ({ task }) => {
  // Generate realistic sample data based on task
  const [metrics] = React.useState(() => {
    const tensions = ['low', 'medium', 'high'] as const;
    const tension = tensions[Math.floor(Math.random() * tensions.length)];
    
    return {
      srt: (Math.random() * 0.5 + 0.2).toFixed(2),
      tension,
      throughput: (50 + Math.random() * 30).toFixed(1),
      responseTime: (1.5 + Math.random() * 1.0).toFixed(2),
      resourceUtilization: Math.floor(60 + Math.random() * 35)
    };
  });

  const getTensionColor = (tension: string) => {
    switch (tension) {
      case 'high': return 'text-destructive bg-destructive/20 border-destructive/30';
      case 'medium': return 'text-warning bg-warning/20 border-warning/30';
      case 'low': return 'text-success bg-success/20 border-success/30';
      default: return 'text-foreground-subtle bg-background-secondary border-border-subtle';
    }
  };

  return (
    <Card className="w-full glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Digital Twin Preview
          <Badge variant="outline" className={`text-xs ${getTensionColor(metrics.tension)}`}>
            {metrics.tension} tension
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 bg-gradient-to-br from-background via-background-secondary to-background-tertiary rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">SRT Score</div>
                  <div className="text-xl font-bold text-primary">{metrics.srt}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <div>
                  <div className="text-sm font-medium">Throughput</div>
                  <div className="text-xl font-bold text-success">{metrics.throughput}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-warning" />
                <div>
                  <div className="text-sm font-medium">Response Time</div>
                  <div className="text-xl font-bold text-warning">{metrics.responseTime}s</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-sm font-medium">CPU Usage</div>
                  <div className="text-xl font-bold text-accent">{metrics.resourceUtilization}%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-foreground-subtle">
              Digital Twin Analysis for: {task?.title}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalTwinWidget;