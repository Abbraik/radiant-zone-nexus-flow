
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
                          <Route path="/think" element={<ThinkZone />} />
                          <Route path="/think-zone-studio" element={<ThinkZoneStudio />} />
                          {import.meta.env.VITE_PAGS_FULL === '1' && (
                            <>
                              <Route path="/think/loops" element={<LoopRegistry />} />
                              <Route path="/think/loops/new" element={<LoopStudioPage />} />
                              <Route path="/think/loops/:loopId/edit" element={<LoopStudioPage />} />
                              <Route path="/think/variables" element={<VariableRegistry />} />
                              <Route path="/think/leverage" element={<LeverageLadder />} />
                              <Route path="/think/leverage-analysis" element={<LeverageAnalysis />} />
                              <Route path="/think/leverage-scenarios" element={<LeverageScenarios />} />
                              <Route path="/act/bundles" element={<BundlesList />} />
                              <Route path="/act/bundles/new" element={<BundlesList />} />
                              <Route path="/act/bundles/:bundleId" element={<BundleEditorPage />} />
                              <Route path="/act/pathway-builder/:bundleId/:itemId" element={<PathwayBuilderPage />} />
                            </>
                          )}
                          <Route path="/act" element={<ActZone />} />
                          <Route path="/monitor" element={<LoopHealthPage />} />
                          <Route path="/monitor/loop-health" element={<LoopHealthPage />} />
                          <Route path="/innovate" element={<InnovateLearnZone />} />
                          <Route path="/innovate/network-explorer" element={<NetworkExplorer />} />
                          <Route path="/innovate/shock-lab" element={<ShockLab />} />
                          <Route path="/demo-atlas" element={<DemoAtlas />} />
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
                  {/* Admin Pages */}
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/admin/changes-queue" element={<ChangesQueuePage />} />
                  <Route path="/plugins" element={<AdminPage />} />
                  <Route path="/offline" element={<AdminPage />} />
                  <Route path="/security" element={<AdminPage />} />
                  <Route path="/mission-control" element={<MissionControl />} />
                  {/* Legacy Zone Access */}
                  <Route path="/think" element={<ThinkZone />} />
                  <Route path="/think-zone-studio" element={<ThinkZoneStudio />} />
                  <Route path="/scenario-planner" element={<ScenarioPlannerPage />} />
                  {import.meta.env.VITE_PAGS_FULL === '1' && (
                    <>
                      <Route path="/think/loops" element={<LoopRegistry />} />
                      <Route path="/think/loops/new" element={<LoopStudioPage />} />
                      <Route path="/think/loops/:loopId/edit" element={<LoopStudioPage />} />
                      <Route path="/think/variables" element={<VariableRegistry />} />
                      <Route path="/think/leverage" element={<LeverageLadder />} />
                      <Route path="/think/leverage-analysis" element={<LeverageAnalysis />} />
                      <Route path="/think/leverage-scenarios" element={<LeverageScenarios />} />
                      <Route path="/act/bundles" element={<BundlesList />} />
                      <Route path="/act/bundles/new" element={<BundlesList />} />
                      <Route path="/act/bundles/:bundleId" element={<BundleEditorPage />} />
                      <Route path="/act/pathway-builder/:bundleId/:itemId" element={<PathwayBuilderPage />} />
                    </>
                  )}
                  <Route path="/act" element={<ActZone />} />
                  <Route path="/monitor" element={<LoopHealthPage />} />
                  <Route path="/monitor/loop-health" element={<LoopHealthPage />} />
                  <Route path="/demo-atlas" element={<DemoAtlas />} />
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
