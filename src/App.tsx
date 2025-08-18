
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
import { MonitorZone } from './pages/MonitorZoneNew';
import { InnovateLearnZone } from './pages/InnovateLearnZoneNew';
import { Index } from "./pages/Index";
import LoopRegistry from "./pages/LoopRegistry";
import LoopDetail from "./pages/LoopDetail";
import LoopDashboard from "./pages/LoopDashboard";
import NotFound from "./pages/NotFound";

import AdminPage from "./pages/AdminPage";
import MissionControl from "./pages/MissionControl";
import { Demo } from "./pages/Demo";
import { createQueryClient } from "./services/api";
import DemoBootstrap from "@/bootstrap/DemoBootstrap";
import GlobalPortals from '@/components/global/GlobalPortals';
import '@/styles/glass.css';

const queryClient = createQueryClient();

const App = () => (
  <ErrorBoundary>
    <DemoBootstrap />
    <GlobalPortals />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FeatureFlagProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                          <Route path="/act" element={<ActZone />} />
                          <Route path="/monitor" element={<MonitorZone />} />
                          <Route path="/innovate" element={<InnovateLearnZone />} />
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
                  <Route path="/" element={<Index />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/registry" element={<LoopRegistry />} />
                  <Route path="/registry/:id" element={<LoopDetail />} />
                  <Route path="/dashboard/loops" element={<LoopDashboard />} />
                  <Route path="/dashboard" element={
                    <div className="pt-4">
                      <Dashboard />
                    </div>
                  } />
                  {/* Admin Pages */}
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/plugins" element={<AdminPage />} />
                  <Route path="/offline" element={<AdminPage />} />
                  <Route path="/security" element={<AdminPage />} />
                  <Route path="/mission-control" element={<MissionControl />} />
                  {/* Legacy Zone Access */}
                  <Route path="/think" element={<ThinkZone />} />
                  <Route path="/think-zone-studio" element={<ThinkZoneStudio />} />
                  <Route path="/scenario-planner" element={<ScenarioPlannerPage />} />
                  <Route path="/act" element={<ActZone />} />
                  <Route path="/monitor" element={<MonitorZone />} />
                  <Route path="/innovate" element={<InnovateLearnZone />} />
                   <Route path="*" element={<Index />} />
                </Routes>
              </Shell>
            </FeatureFlagGuard>
          </BrowserRouter>
        </FeatureFlagProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
