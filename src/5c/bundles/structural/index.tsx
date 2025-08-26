// Structural Bundle - System Architecture & Design Capacity
import React, { useState } from 'react';
import { BundleProps5C } from '@/5c/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DossierWizard } from '@/components/structural/DossierWizard';
import { ConformanceDashboard } from '@/components/structural/ConformanceDashboard';
import { AdoptionMap } from '@/components/structural/AdoptionMap';

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