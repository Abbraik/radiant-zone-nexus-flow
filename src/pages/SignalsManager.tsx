// Signals Management Page
// Central hub for managing signals sources, indicators, and data quality

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Activity, AlertTriangle, Play } from "lucide-react";
import { SignalsSummaryCard } from "@/components/signals/SignalsSummaryCard";
import { DataQualityBanner } from "@/components/signals/DataQualityBanner";
import { useSignalSources, useIngestionRuns, useSeedGoldenPaths } from "@/hooks/useSignalsData";

export default function SignalsManager() {
  const [selectedSourceId, setSelectedSourceId] = useState<string>();
  
  const { data: sources, isLoading: sourcesLoading } = useSignalSources();
  const { data: runs, isLoading: runsLoading } = useIngestionRuns(selectedSourceId);
  const seedGoldenPaths = useSeedGoldenPaths();

  const handleSeedData = () => {
    seedGoldenPaths.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Database className="w-6 h-6" />
              Signals Layer
            </h1>
            <p className="text-gray-400">
              Production-grade signal ingestion, normalization & quality monitoring
            </p>
          </div>
          
          <Button 
            onClick={handleSeedData}
            disabled={seedGoldenPaths.isPending}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Seed Golden Paths
          </Button>
        </div>

        <DataQualityBanner className="mb-6" />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="ingestion">Ingestion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4">
              <Card className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-teal-400">
                        {sources?.length || 0}
                      </div>
                      <div className="text-sm text-gray-400">Sources</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        {sources?.filter(s => s.enabled).length || 0}
                      </div>
                      <div className="text-sm text-gray-400">Active</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {runs?.filter(r => r.status === 'ok').length || 0}
                      </div>
                      <div className="text-sm text-gray-400">Healthy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid gap-4">
              {sourcesLoading ? (
                <Card className="bg-gray-800/30">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-700 rounded w-1/2" />
                      <div className="h-3 bg-gray-700 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                sources?.map(source => (
                  <Card 
                    key={source.source_id} 
                    className="bg-gray-800/30 border-gray-700"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">
                          {source.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={source.enabled ? "default" : "secondary"}>
                            {source.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {source.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-300">
                          <span className="text-gray-400">Provider:</span> {source.provider}
                        </div>
                        {source.schedule_cron && (
                          <div className="text-gray-300">
                            <span className="text-gray-400">Schedule:</span> 
                            <code className="ml-1 text-xs bg-gray-700 px-1 rounded">
                              {source.schedule_cron}
                            </code>
                          </div>
                        )}
                        <div className="text-gray-300">
                          <span className="text-gray-400">PII Class:</span> {source.pii_class}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="ingestion" className="space-y-4">
            <div className="grid gap-4">
              {runsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-gray-800/30 rounded" />
                  <div className="h-16 bg-gray-800/30 rounded" />
                </div>
              ) : (
                runs?.slice(0, 10).map(run => (
                  <Card key={run.run_id} className="bg-gray-800/30 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={
                              run.status === 'ok' ? 'default' :
                              run.status === 'warn' ? 'secondary' : 'destructive'
                            }
                            className="capitalize"
                          >
                            {run.status}
                          </Badge>
                          <div className="text-sm">
                            <div className="text-white">
                              {run.rows_kept}/{run.rows_in} rows processed
                            </div>
                            <div className="text-gray-400">
                              {new Date(run.started_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                          <div>Lag: {run.lag_seconds}s</div>
                          {run.message && <div className="mt-1">{run.message}</div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}