
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { FeatureFlagGuard, FeatureFlagProvider } from "./components/layout/FeatureFlagProvider";
import { WorkspaceShell } from "./components/layout/WorkspaceShell";
import { Workspace } from "./components/workspace/Workspace";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import { ThinkZone } from "./pages/ThinkZone";
import { ThinkZoneStudio } from "./pages/ThinkZoneStudio";
import { ScenarioPlannerPage } from "./pages/ScenarioPlanner";
import { ActZone } from "./pages/ActZone";
import MonitorZone from "./pages/MonitorZone";
import { InnovateLearnZone } from "./pages/InnovateLearnZone";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import MissionControl from "./pages/MissionControl";
import { createQueryClient } from "./services/api";
import LoopRegistry from "./pages/think/LoopRegistry";
import LoopStudioPage from "./pages/think/LoopStudio";
import VariableRegistry from "./pages/think/VariableRegistry";
import LeverageLadder from "./pages/think/LeverageLadder";
import LeverageAnalysis from "./pages/think/LeverageAnalysis";
import LeverageScenarios from "./pages/think/LeverageScenarios";
import BundlesList from "./pages/act/BundlesList";
import BundleEditorPage from "./pages/act/BundleEditorPage";
import PathwayBuilderPage from "./pages/act/PathwayBuilder";
import LoopHealthPage from "./pages/monitor/LoopHealth";
import NetworkExplorer from "./pages/innovate/NetworkExplorer";
import ShockLab from "./pages/innovate/ShockLab";
import ChangesQueuePage from "./pages/admin/ChangesQueuePage";
import DemoAtlas from "./pages/DemoAtlas";
import { GuidedTourProvider } from "./modules/tours/GuidedTourProvider";
import { RouteWatcher } from "./components/layout/RouteWatcher";
import { RouteGuard } from "./components/layout/RouteGuard";
import Forbidden from "./pages/Forbidden";
import ZoneRouteAdapter from "./components/layout/ZoneRouteAdapter";
const queryClient = createQueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FeatureFlagProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GuidedTourProvider>
              <RouteWatcher />
            <FeatureFlagGuard 
              flag="newTaskDrivenUI"
              fallback={
                <FeatureFlagGuard 
                  flag="newTaskDrivenUI" 
                  fallback={
                    <Shell>
                      <FeatureFlagGuard 
                        flag="newRgsUI" 
                        fallback={
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        }
                      >
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/think" element={<ZoneRouteAdapter />} />
                          <Route path="/think/*" element={<ZoneRouteAdapter />} />
                          <Route path="/act" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                          <Route path="/act/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                          <Route path="/monitor" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                          <Route path="/monitor/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                          
                          <Route path="/innovate" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                          <Route path="/innovate/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                          <Route path="/demo-atlas" element={<Workspace />} />
                          <Route path="*" element={<NotFound />} />
                         </Routes>
                      </FeatureFlagGuard>
                    </Shell>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Workspace />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="*" element={<Workspace />} />
                  </Routes>
                </FeatureFlagGuard>
              }
            >
              {/* Ultimate Workspace Mode */}
              <Shell>
                <Routes>
                  <Route path="/" element={<Workspace />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/dashboard" element={
                    <div className="pt-4">
                      <Dashboard />
                    </div>
                  } />
                  {/* Admin Pages via Zone Adapter */}
                  <Route path="/admin" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/admin/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/plugins" element={<AdminPage />} />
                  <Route path="/offline" element={<AdminPage />} />
                  <Route path="/security" element={<AdminPage />} />
                  <Route path="/mission-control" element={<MissionControl />} />
                  {/* Legacy Zone Access */}
                  <Route path="/think" element={<ZoneRouteAdapter />} />
                  <Route path="/think/*" element={<ZoneRouteAdapter />} />
                  <Route path="/act" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/act/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/monitor" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/monitor/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/innovate" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/innovate/*" element={<ZoneRouteAdapter redirectToWorkspace={false} />} />
                  <Route path="/demo-atlas" element={<Workspace />} />
                  <Route path="/forbidden" element={<Forbidden />} />
                   <Route path="*" element={<Workspace />} />
                </Routes>
              </Shell>
            </FeatureFlagGuard>
            </GuidedTourProvider>
          </BrowserRouter>
        </FeatureFlagProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
