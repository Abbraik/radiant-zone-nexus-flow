import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { FeatureFlagGuard, FeatureFlagProvider } from "./components/layout/FeatureFlagProvider";
import { WorkspaceShell } from "./components/layout/WorkspaceShell";
import { EnhancedHeader } from "./components/layout/EnhancedHeader";
import { Workspace } from "./components/workspace/Workspace";
import { WorkspaceHeader } from "./components/workspace/WorkspaceHeader";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import { ThinkZone } from "./pages/ThinkZone";
import { ActZone } from "./pages/ActZone";
import { MonitorZone } from "./pages/MonitorZone";
import { InnovateLearnZone } from "./pages/InnovateLearnZone";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AchievementsPage from "./pages/AchievementsPage";
import PluginsPage from "./pages/PluginsPage";
import OfflinePage from "./pages/OfflinePage";
import SecurityPage from "./pages/SecurityPage";
import { createQueryClient } from "./services/api";

const queryClient = createQueryClient();

const App = () => (
  <ErrorBoundary>
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
                    <div className="min-h-screen">
                      <EnhancedHeader />
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
                          <Route path="/act" element={<ActZone />} />
                          <Route path="/monitor" element={<MonitorZone />} />
                          <Route path="/innovate" element={<InnovateLearnZone />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </FeatureFlagGuard>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Workspace />} />
                    <Route path="/workspace" element={<Workspace />} />
                    <Route path="/dashboard" element={
                      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        <WorkspaceHeader activeTask={null} myTasks={[]} isDashboard={true} />
                        <div className="flex-1 overflow-auto">
                          <Dashboard />
                        </div>
                      </div>
                    } />
                    <Route path="*" element={<Workspace />} />
                  </Routes>
                </FeatureFlagGuard>
              }
            >
              {/* Ultimate Workspace Mode */}
              <div className="min-h-screen">
                <EnhancedHeader />
                <Routes>
                  <Route path="/" element={<Workspace />} />
                  <Route path="/workspace" element={<Workspace />} />
                  <Route path="/dashboard" element={
                    <div className="pt-4">
                      <Dashboard />
                    </div>
                  } />
                  {/* Phase 3 Pages */}
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/plugins" element={<PluginsPage />} />
                  <Route path="/offline" element={<OfflinePage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  {/* Legacy Zone Access */}
                  <Route path="/think" element={<ThinkZone />} />
                  <Route path="/act" element={<ActZone />} />
                  <Route path="/monitor" element={<MonitorZone />} />
                  <Route path="/innovate" element={<InnovateLearnZone />} />
                  <Route path="*" element={<Workspace />} />
                </Routes>
              </div>
            </FeatureFlagGuard>
          </BrowserRouter>
        </FeatureFlagProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
