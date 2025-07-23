import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Target, TrendingUp } from 'lucide-react';

interface Cascade3DWidgetProps {
  task: any;
}

const Cascade3DWidget: React.FC<Cascade3DWidgetProps> = ({ task }) => {
  return (
    <Card className="w-full h-[400px] glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" />
          3D Goals Cascade
          <Badge variant="outline" className="text-xs">Interactive</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-full bg-gradient-to-br from-background via-background-secondary to-background-tertiary rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3D Goals Visualization</h3>
              <p className="text-sm text-foreground-subtle">
                Interactive 3D cascade view for task: {task?.title}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Goals Progress</span>
                  <span className="text-success">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>OKRs Health</span>
                  <span className="text-warning">65%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasks Complete</span>
                  <span className="text-primary">82%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cascade3DWidget;