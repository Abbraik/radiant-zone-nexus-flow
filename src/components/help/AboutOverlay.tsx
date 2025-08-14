import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToolsStore } from '@/stores/toolsStore';
import { Info, Workflow, Building } from 'lucide-react';

export default function AboutOverlay() {
  const { global, close } = useToolsStore();

  return (
    <Dialog open={global.about} onOpenChange={() => close('global', 'about')}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About the Platform
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={global.aboutTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="entities" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Entities
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6 overflow-y-auto max-h-[60vh]">
            <TabsContent value="overview" className="space-y-4">
              <h3 className="text-lg font-semibold">Platform Overview</h3>
              <p className="text-muted-foreground">
                This is a comprehensive system dynamics platform for modeling, monitoring, and acting on complex systems.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Think Zone</h4>
                  <p className="text-sm text-muted-foreground">Model and analyze system dynamics with causal loop diagrams.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Monitor Zone</h4>
                  <p className="text-sm text-muted-foreground">Track system performance and health indicators.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Act Zone</h4>
                  <p className="text-sm text-muted-foreground">Execute interventions and manage change processes.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="workflow" className="space-y-4">
              <h3 className="text-lg font-semibold">Workflow Process</h3>
              <p className="text-muted-foreground">
                The platform follows a systematic approach to system change management.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Think:</strong> Model the system using causal loop diagrams and identify leverage points</li>
                <li><strong>Monitor:</strong> Track key indicators and system health metrics</li>
                <li><strong>Act:</strong> Design and execute targeted interventions</li>
                <li><strong>Learn:</strong> Analyze results and refine understanding</li>
              </ol>
            </TabsContent>
            
            <TabsContent value="entities" className="space-y-4">
              <h3 className="text-lg font-semibold">System Entities</h3>
              <p className="text-muted-foreground">
                Key concepts and entities within the platform.
              </p>
              <div className="grid gap-3">
                <div className="p-3 border rounded">
                  <h4 className="font-medium">RELs (Reinforcing & Limiting Loops)</h4>
                  <p className="text-xs text-muted-foreground">Fundamental feedback patterns that drive system behavior</p>
                </div>
                <div className="p-3 border rounded">
                  <h4 className="font-medium">Interventions</h4>
                  <p className="text-xs text-muted-foreground">Targeted actions designed to influence system dynamics</p>
                </div>
                <div className="p-3 border rounded">
                  <h4 className="font-medium">Leverage Points</h4>
                  <p className="text-xs text-muted-foreground">Strategic locations where small changes can produce big impacts</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}