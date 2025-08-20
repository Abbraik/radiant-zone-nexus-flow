import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Zap, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTasks5C } from "@/5c/services";
import type { EnhancedTask5C } from "@/5c/types";

interface CapacityIntegrationWidgetProps {
  className?: string;
}

export function CapacityIntegrationWidget({ className }: CapacityIntegrationWidgetProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['5c', 'tasks'],
    queryFn: () => getTasks5C()
  });

  const capacityTaskCounts = tasks.reduce((acc, task) => {
    acc[task.capacity] = (acc[task.capacity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentTasks = tasks
    .filter(task => {
      const createdAt = new Date(task.created_at);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdAt > oneDayAgo;
    })
    .slice(0, 3);

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'active').length;
  const openTasks = tasks.filter(t => t.status === 'open').length;

  const getCapacityColor = (capacity: string) => {
    const colors = {
      responsive: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      reflexive: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      deliberative: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      anticipatory: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      structural: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
    };
    return colors[capacity as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="w-4 h-4 text-teal-400" />
          Capacity Brain Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Task Summary */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-muted/20">
            <div className="font-semibold text-foreground">{totalTasks}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 rounded bg-muted/20">
            <div className="font-semibold text-foreground">{openTasks}</div>
            <div className="text-muted-foreground">Available</div>
          </div>
          <div className="text-center p-2 rounded bg-muted/20">
            <div className="font-semibold text-foreground">{activeTasks}</div>
            <div className="text-muted-foreground">Active</div>
          </div>
        </div>

        {/* Capacity Distribution */}
        {Object.keys(capacityTaskCounts).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Capacity Distribution</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(capacityTaskCounts).map(([capacity, count]) => (
                <Badge 
                  key={capacity} 
                  className={`text-xs ${getCapacityColor(capacity)}`}
                >
                  {capacity}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentTasks.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Recent Tasks (24h)</div>
            <div className="space-y-1">
              {recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1">{task.title}</span>
                  <Badge className={`ml-2 ${getCapacityColor(task.capacity)} text-xs`}>
                    {task.capacity.charAt(0).toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.location.href = '/workspace-5c'}
              className="flex-1 text-xs h-6"
            >
              <Activity className="w-3 h-3 mr-1" />
              5C Tasks
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = '/signal-monitor'}
              className="flex-1 text-xs h-6"
            >
              <Zap className="w-3 h-3 mr-1" />
              Signals
            </Button>
          </div>

        {totalTasks === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
            No capacity tasks yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}