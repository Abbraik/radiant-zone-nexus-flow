import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RuntimeDashboard } from "@/components/anticipatory/RuntimeDashboard";
import { TriggerBuilder } from "@/components/anticipatory/TriggerBuilder";

export default function AnticipatoryRuntime() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Runtime Dashboard</TabsTrigger>
          <TabsTrigger value="builder">Trigger Builder</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <RuntimeDashboard />
        </TabsContent>
        
        <TabsContent value="builder" className="space-y-6">
          <TriggerBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}