import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, Shield, Brain, Zap, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { anticipatoryWorker } from "@/lib/anticipatory/runtime";
import { seedAnticipatoryRuntime } from "@/lib/anticipatory/seeders";

export function RuntimeDashboard() {
  const [workerStatus, setWorkerStatus] = useState<'stopped' | 'running'>('stopped');
  
  // Fetch watchpoints
  const { data: watchpoints } = useQuery({
    queryKey: ['antic_watchpoints'],
    queryFn: async () => {
      const { data } = await supabase
        .from('antic_watchpoints')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  // Fetch trigger rules
  const { data: triggers } = useQuery({
    queryKey: ['antic_trigger_rules'],
    queryFn: async () => {
      const { data } = await supabase
        .from('antic_trigger_rules')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  // Fetch recent trigger firings
  const { data: recentFirings } = useQuery({
    queryKey: ['antic_trigger_firings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('antic_trigger_firings')
        .select('*')
        .order('fired_at', { ascending: false })
        .limit(10);
      return data || [];
    }
  });

  // Fetch scenarios
  const { data: scenarios } = useQuery({
    queryKey: ['antic_scenarios'],
    queryFn: async () => {
      const { data } = await supabase
        .from('antic_scenarios')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  const handleStartWorker = () => {
    anticipatoryWorker.start(15); // 15 minute intervals
    setWorkerStatus('running');
  };

  const handleStopWorker = () => {
    anticipatoryWorker.stop();
    setWorkerStatus('stopped');
  };

  const handleSeedData = async () => {
    try {
      await seedAnticipatoryRuntime();
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error('Failed to seed data:', error);
    }
  };

  const armedWatchpoints = watchpoints?.filter(w => w.status === 'armed').length || 0;
  const activeTriggers = triggers?.filter(t => new Date(t.expires_at) > new Date()).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Anticipatory Runtime</h1>
          <p className="text-muted-foreground">
            Early warning system for proactive governance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSeedData}>
            <Brain className="h-4 w-4 mr-2" />
            Seed Demo Data
          </Button>
          {workerStatus === 'stopped' ? (
            <Button onClick={handleStartWorker}>
              <Zap className="h-4 w-4 mr-2" />
              Start Runtime
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleStopWorker}>
              <Activity className="h-4 w-4 mr-2" />
              Stop Runtime
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runtime Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={workerStatus === 'running' ? 'default' : 'secondary'}>
                {workerStatus === 'running' ? 'Active' : 'Stopped'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {workerStatus === 'running' ? '15min evaluation cycle' : 'Worker inactive'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Armed Watchpoints</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{armedWatchpoints}</div>
            <p className="text-xs text-muted-foreground">
              +{watchpoints?.length || 0} total watchpoints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Triggers</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTriggers}</div>
            <p className="text-xs text-muted-foreground">
              {triggers?.length || 0} total trigger rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Firings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentFirings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="watchpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="watchpoints">Watchpoints</TabsTrigger>
          <TabsTrigger value="triggers">Trigger Rules</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="backtests">Backtests</TabsTrigger>
        </TabsList>

        <TabsContent value="watchpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Channel Watchpoints</CardTitle>
              <CardDescription>
                Monitoring critical indicators across risk channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {watchpoints?.length ? (
                <div className="space-y-4">
                  {watchpoints.map((watchpoint) => (
                    <div key={watchpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{watchpoint.risk_channel}</h3>
                          <Badge variant={watchpoint.status === 'armed' ? 'default' : 'secondary'}>
                            {watchpoint.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          EWS Probability: {(watchpoint.ews_prob * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {(watchpoint.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium">
                          Lead Time: {watchpoint.lead_time_days}d
                        </div>
                        <Progress 
                          value={watchpoint.ews_prob * 100} 
                          className="w-24"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No watchpoints configured. Click "Seed Demo Data" to populate with sample data.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trigger Rules</CardTitle>
              <CardDescription>
                Automated trigger rules for early warning detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {triggers?.length ? (
                <div className="space-y-4">
                  {triggers.map((trigger) => (
                    <div key={trigger.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{trigger.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {trigger.expr_raw}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">{trigger.authority}</Badge>
                          <Badge variant="outline">{trigger.window_hours}h window</Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium">
                          Valid until: {new Date(trigger.expires_at).toLocaleDateString()}
                        </div>
                        <Badge variant={new Date(trigger.expires_at) > new Date() ? 'default' : 'secondary'}>
                          {new Date(trigger.expires_at) > new Date() ? 'Active' : 'Expired'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No trigger rules configured. Click "Seed Demo Data" to populate with sample data.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Simulations</CardTitle>
              <CardDescription>
                Test trigger performance against simulated scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scenarios?.length ? (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{scenario.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Targets: {scenario.target_loops.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Ready</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No scenarios available. Click "Seed Demo Data" to populate with sample scenarios.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backtests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
              <CardDescription>
                Historical performance metrics for trigger rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  Backtest functionality will be available after seeding demo data and running scenarios.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}