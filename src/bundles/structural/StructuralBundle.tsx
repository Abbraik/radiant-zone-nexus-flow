import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import type { StructuralUiProps } from "./types.ui";
import MandateGate from "./panels/MandateGate";
import MeshPlanner from "./panels/MeshPlanner";
import ProcessStudio from "./panels/ProcessStudio";
import StandardsForge from "./panels/StandardsForge";
import MarketDesignLab from "./panels/MarketDesignLab";
import StructuralDossier from "./panels/StructuralDossier";

export default function StructuralBundle(props: StructuralUiProps){
  const { loopCode, mission, screen="mandate", errorText } = props;
  const [currentScreen, setCurrentScreen] = React.useState(screen);

  const handleTabChange = (value: string) => {
    setCurrentScreen(value as any);
    props.onEvent?.('struct_tab_change', { tab: value });
  };

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-muted-foreground">Workspace-5C · Structural</div>
          <h3 className="text-xl font-semibold leading-tight text-foreground">{loopCode}</h3>
          {mission && <div className="mt-1 text-sm text-muted-foreground">{mission}</div>}
        </div>
        <Badge variant="outline" className="border-primary text-primary">S-Levers</Badge>
      </div>

      <Tabs value={currentScreen} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="mandate">Mandate Gate</TabsTrigger>
          <TabsTrigger value="mesh">Mesh Planner</TabsTrigger>
          <TabsTrigger value="process">Process Studio</TabsTrigger>
          <TabsTrigger value="standards">Standards Forge</TabsTrigger>
          <TabsTrigger value="market">Market Lab</TabsTrigger>
          <TabsTrigger value="dossier">Dossier</TabsTrigger>
        </TabsList>
      </Tabs>

      {errorText && (
        <div className="rounded-2xl border border-destructive bg-background p-3 text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {errorText}
        </div>
      )}

      {currentScreen==="mandate"   && <MandateGate {...props} />}
      {currentScreen==="mesh"      && <MeshPlanner {...props} />}
      {currentScreen==="process"   && <ProcessStudio {...props} />}
      {currentScreen==="standards" && <StandardsForge {...props} />}
      {currentScreen==="market"    && <MarketDesignLab {...props} />}
      {currentScreen==="dossier"   && <StructuralDossier {...props} />}
    </div>
  );
}