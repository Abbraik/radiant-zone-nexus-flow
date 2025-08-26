// Structural Bundle - System Architecture & Design Capacity  
import React, { useState } from 'react';
import { BundleProps5C } from '@/5c/types';
import { useStructuralData } from '@/hooks/useStructuralData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StructuralBundle: React.FC<BundleProps5C> = ({ task }) => {
  const [activeTab, setActiveTab] = useState('architecture');
  const loopId = task.loop_id;
  
  const {
    loopData,
    conformanceRuns,
    adoptionEntities,
    dossiers,
    isLoading,
    createDossier,
    runConformanceCheck
  } = useStructuralData(loopId, task);

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Loading structural data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Structural Capacity</h2>
          <p className="text-muted-foreground">System architecture and conformance management</p>
        </div>
        <Button onClick={() => createDossier.mutate({
          org_id: task.user_id,
          session_id: 'default',
          version: '1.0',
          title: `Structural Analysis for ${task.title}`,
          summary: 'Generated structural analysis'
        })}>
          Create Dossier
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="conformance">Conformance</TabsTrigger>
          <TabsTrigger value="adoption">Adoption</TabsTrigger>
          <TabsTrigger value="dossiers">Dossiers</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loop Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Loop ID: {loopId}
                </div>
                {loopData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded">
                      <div className="font-medium">Nodes</div>
                      <div className="text-lg">{loopData.loop_nodes?.length || 0}</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">Edges</div>
                      <div className="text-lg">{loopData.loop_edges?.length || 0}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conformance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Conformance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conformanceRuns.slice(0, 3).map((run) => (
                  <div key={run.run_id} className="p-3 border rounded">
                    <div className="flex justify-between">
                      <div className="font-medium">Run #{run.run_id.slice(0, 8)}</div>
                      <Badge>{run.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adoption" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Entities ({adoptionEntities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {adoptionEntities.slice(0, 5).map((entity) => (
                  <div key={entity.entity_id} className="p-2 border rounded text-sm">
                    {entity.name} ({entity.kind})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dossiers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dossiers ({dossiers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dossiers.slice(0, 3).map((dossier) => (
                  <div key={dossier.id} className="p-3 border rounded">
                    <div className="font-medium">{dossier.title}</div>
                    <div className="text-sm text-muted-foreground">{dossier.version}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StructuralBundle;