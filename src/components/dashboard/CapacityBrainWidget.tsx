import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Activity, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTasks5C } from "@/5c/services";
import type { EnhancedTask5C } from "@/5c/types";

interface CapacityBrainWidgetProps {
  className?: string;
}

export function CapacityBrainWidget({ className }: CapacityBrainWidgetProps) {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['5c', 'tasks'],
    queryFn: () => getTasks5C(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const capacityStats = tasks.reduce((acc, task) => {
    if (!acc[task.capacity]) {
      acc[task.capacity] = { total: 0, active: 0, open: 0 };
    }
    acc[task.capacity].total++;
    if (task.status === 'active') acc[task.capacity].active++;
    if (task.status === 'open') acc[task.capacity].open++;
    return acc;
  }, {} as Record<string, { total: number; active: number; open: number }>);

  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'active').length;
  const openTasks = tasks.filter(t => t.status === 'open').length;
  
  const recentTasks = tasks
    .filter(task => {
      const createdAt = new Date(task.created_at);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdAt > oneDayAgo;
    })
    .slice(0, 3);

  const getCapacityColor = (capacity: string) => {
    const colors = {
      responsive: 'text-amber-400',
      reflexive: 'text-indigo-400',  
      deliberative: 'text-cyan-400',
      anticipatory: 'text-emerald-400',
      structural: 'text-violet-400'
    };
    return colors[capacity as keyof typeof colors] || 'text-gray-400';
  };

  const getCapacityIcon = (capacity: string) => {
    switch (capacity) {
      case 'responsive': return <Zap className="w-3 h-3" />;
      case 'reflexive': return <TrendingUp className="w-3 h-3" />;
      case 'deliberative': return <Activity className="w-3 h-3" />;
      case 'anticipatory': return <AlertTriangle className="w-3 h-3" />;
      case 'structural': return <Brain className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
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
          Capacity Brain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded bg-muted/20">
            <div className="font-semibold text-foreground">{totalTasks}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="text-center p-2 rounded bg-amber-500/10">
            <div className="font-semibold text-amber-400">{activeTasks}</div>
            <div className="text-muted-foreground">Active</div>
          </div>
          <div className="text-center p-2 rounded bg-teal-500/10">
            <div className="font-semibold text-teal-400">{openTasks}</div>
            <div className="text-muted-foreground">Available</div>
          </div>
        </div>

        {/* Capacity Breakdown */}
        {Object.keys(capacityStats).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Active Capacities</div>
            <div className="space-y-1">
              {Object.entries(capacityStats).map(([capacity, stats]) => (
                <div key={capacity} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={getCapacityColor(capacity)}>
                      {getCapacityIcon(capacity)}
                    </div>
                    <span className="capitalize">{capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">{stats.active}</span>
                    <span className="text-muted-foreground/60">/</span>
                    <span className="text-muted-foreground">{stats.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentTasks.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Recent (24h)</div>
            <div className="space-y-1">
              {recentTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 text-xs">
                  <div className={getCapacityColor(task.capacity)}>
                    {getCapacityIcon(task.capacity)}
                  </div>
                  <span className="truncate flex-1">{task.title}</span>
                  <Badge variant="outline" className="text-xs h-4 px-1">
                    {task.leverage}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-1 pt-2 border-t">
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
            <Brain className="w-3 h-3 mr-1" />
            Monitor
          </Button>
        </div>

        {totalTasks === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            <Brain className="w-4 h-4 mx-auto mb-1 opacity-50" />
            No capacity tasks yet
            <div className="mt-1">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => window.location.href = '/signal-monitor'}
                className="text-xs h-6"
              >
                Start Signal Monitoring
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}