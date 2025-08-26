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
  } = useStructuralData(loopId);

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

const StructuralBundle: React.FC<BundleProps5C> = ({ task }) => {
  const [activeTab, setActiveTab] = useState('architecture');
  const [activeDossier, setActiveDossier] = useState<string | null>(null);

  const handleDossierPublish = (dossierId: string) => {
    setActiveDossier(dossierId);
    setActiveTab('conformance');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Structural Capacity</h2>
          <p className="text-muted-foreground">
            System architecture, dossier management, and conformance tracking
          </p>
        </div>
          <Button 
            variant="outline" 
            disabled={!task.id || activeDossier === null}
            onClick={() => {
              if (task.id) {
                // Navigate or emit event for structural handoff
                console.log('Structural handoff for task:', task.id);
              }
            }}
          >
            → Create Implementation Plan
          </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="dossier">Dossier Wizard</TabsTrigger>
          <TabsTrigger value="conformance">Conformance</TabsTrigger>
          <TabsTrigger value="adoption">Adoption Map</TabsTrigger>
          <TabsTrigger value="leverage">Leverage Points</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loop Design */}
            <Card>
              <CardHeader>
                <CardTitle>Loop Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    System structure and relationships
                  </div>
                  <div className="h-32 bg-muted/20 rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground">CLD canvas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain Mapping */}
            <Card>
              <CardHeader>
                <CardTitle>Domain Architecture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Cross-domain relationships and dependencies
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-md">
                      <div className="font-medium">Economic</div>
                      <div className="text-sm text-muted-foreground">{task.scale}</div>
                    </div>
                    <div className="text-center p-3 border rounded-md">
                      <div className="font-medium">Social</div>
                      <div className="text-sm text-muted-foreground">{task.type}</div>
                    </div>
                    <div className="text-center p-3 border rounded-md">
                      <div className="font-medium">Technical</div>
                      <div className="text-sm text-muted-foreground">{task.leverage}</div>
                    </div>
                    <div className="text-center p-3 border rounded-md">
                      <div className="font-medium">Political</div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dossier" className="mt-6">
          <DossierWizard 
            loopId={task.loop_id} 
            onPublish={handleDossierPublish}
          />
        </TabsContent>

        <TabsContent value="conformance" className="mt-6">
          {activeDossier ? (
            <ConformanceDashboard dossierId={activeDossier} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  Publish a dossier first to view conformance dashboard
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="adoption" className="mt-6">
          {activeDossier ? (
            <AdoptionMap dossierId={activeDossier} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  Publish a dossier first to view adoption map
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leverage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Leverage Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  System intervention points
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">Parameters (N)</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Low Impact</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">Paradigms (P)</span>
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">Med Impact</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">Structure (S)</span>
                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">High Impact</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StructuralBundle;