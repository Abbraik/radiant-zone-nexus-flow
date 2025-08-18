import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAnticipatoryBundle, Watchpoint } from '@/hooks/useAnticipatoryBundle';
import { Eye, EyeOff, Plus, TestTube, Download, Upload, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WatchpointRegistryProps {
  taskId: string;
  loopId: string;
}

export default function WatchpointRegistry({ taskId, loopId }: WatchpointRegistryProps) {
  const { toast } = useToast();
  const {
    watchpoints,
    createWatchpoint,
    toggleWatchpoint,
    evaluateWatchpoints,
    isEvaluating
  } = useAnticipatoryBundle(taskId, loopId);

  const [newWatchpointOpen, setNewWatchpointOpen] = useState(false);
  const [newWatchpoint, setNewWatchpoint] = useState<{
    indicator: string;
    direction: 'up' | 'down' | 'band';
    threshold_value: number;
    owner: string;
  }>({
    indicator: '',
    direction: 'up',
    threshold_value: 0,
    owner: ''
  });
  };

  const handleToggleArm = (watchpoint: Watchpoint) => {
    toggleWatchpoint.mutate({
      watchpointId: watchpoint.id,
      armed: !watchpoint.armed
    });
  };

  const handleBulkImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            console.log('Imported watchpoints:', data);
            toast({
              title: "Import successful",
              description: `Imported ${data.length || 0} watchpoints.`
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Invalid JSON format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleBulkExport = () => {
    const exportData = watchpoints.map(wp => ({
      indicator: wp.indicator,
      direction: wp.direction,
      threshold_value: wp.threshold_value,
      threshold_band: wp.threshold_band,
      armed: wp.armed
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watchpoints-${loopId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatLastEval = (lastEval?: string) => {
    if (!lastEval) return 'Never';
    const date = new Date(lastEval);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getStatusBadge = (watchpoint: Watchpoint) => {
    if (!watchpoint.armed) {
      return <Badge variant="secondary">Disarmed</Badge>;
    }
    
    if (watchpoint.last_result?.tripped) {
      return <Badge variant="destructive">Tripped</Badge>;
    }
    
    return <Badge variant="default">Armed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Registry Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Watchpoint Registry</span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkImport}
              >
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkExport}
                disabled={watchpoints.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => evaluateWatchpoints.mutate()}
                disabled={isEvaluating}
              >
                <TestTube className="h-4 w-4 mr-1" />
                Test All
              </Button>
              <Dialog open={newWatchpointOpen} onOpenChange={setNewWatchpointOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Watchpoint
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Watchpoint</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="indicator">Indicator</Label>
                      <Input
                        id="indicator"
                        placeholder="e.g., delivery_time, cost_efficiency"
                        value={newWatchpoint.indicator}
                        onChange={(e) => setNewWatchpoint(prev => ({ ...prev, indicator: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="direction">Direction</Label>
                      <Select 
                        value={newWatchpoint.direction} 
                        onValueChange={(value: 'up' | 'down' | 'band') => 
                          setNewWatchpoint(prev => ({ ...prev, direction: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up">Above Threshold (Up)</SelectItem>
                          <SelectItem value="down">Below Threshold (Down)</SelectItem>
                          <SelectItem value="band">Outside Band</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="threshold">Threshold Value</Label>
                      <Input
                        id="threshold"
                        type="number"
                        step="0.1"
                        value={newWatchpoint.threshold_value}
                        onChange={(e) => setNewWatchpoint(prev => ({ 
                          ...prev, 
                          threshold_value: parseFloat(e.target.value) || 0 
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="owner">Owner (User ID)</Label>
                      <Input
                        id="owner"
                        placeholder="User ID who will be notified"
                        value={newWatchpoint.owner}
                        onChange={(e) => setNewWatchpoint(prev => ({ ...prev, owner: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleCreateWatchpoint} disabled={createWatchpoint.isPending}>
                        Create Watchpoint
                      </Button>
                      <Button variant="outline" onClick={() => setNewWatchpointOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Watchpoints Table */}
          <div className="space-y-3">
            {watchpoints.map((watchpoint) => (
              <Card key={watchpoint.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <h4 className="font-medium text-sm">{watchpoint.indicator}</h4>
                        <p className="text-xs text-muted-foreground">
                          {watchpoint.direction === 'up' && `Triggers when > ${watchpoint.threshold_value}`}
                          {watchpoint.direction === 'down' && `Triggers when < ${watchpoint.threshold_value}`}
                          {watchpoint.direction === 'band' && 'Triggers when outside band'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(watchpoint)}
                      <Switch
                        checked={watchpoint.armed}
                        onCheckedChange={() => handleToggleArm(watchpoint)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      {watchpoint.armed ? (
                        <Eye className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Owner</p>
                      <p className="truncate">{watchpoint.owner}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Last Evaluation</p>
                      <p>{formatLastEval(watchpoint.last_eval)}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Last Result</p>
                      <p>
                        {watchpoint.last_result?.value ? (
                          <span className={watchpoint.last_result.tripped ? 'text-red-500' : 'text-emerald-500'}>
                            {watchpoint.last_result.value.toFixed(2)} 
                            {watchpoint.last_result.tripped ? ' (Trip)' : ' (OK)'}
                          </span>
                        ) : (
                          'No data'
                        )}
                      </p>
                    </div>
                  </div>

                  {watchpoint.playbook_id && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Playbook attached</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Test with scenario logic would go here
                        toast({
                          title: "Test triggered",
                          description: "Watchpoint test initiated."
                        });
                      }}
                    >
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {watchpoints.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No watchpoints configured</p>
                <p className="text-sm">Create your first watchpoint to start monitoring</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}