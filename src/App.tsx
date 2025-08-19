
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
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { ThinkZone } from "./pages/ThinkZone";
import { ThinkZoneStudio } from "./pages/ThinkZoneStudio";
import { ScenarioPlannerPage } from "./pages/ScenarioPlanner";
import { ActZone } from "./pages/ActZone";
import { MonitorZone } from './pages/MonitorZoneNew';
import { InnovateLearnZone } from './pages/InnovateLearnZoneNew';
import { Index } from "./pages/Index";
import Auth from "./pages/Auth";
import LoopRegistry from "./pages/LoopRegistry";
import LoopDetail from "./pages/LoopDetail";
import LoopEditor from "./pages/LoopEditor";
import LoopDashboard from "./pages/LoopDashboard";
import NotFound from "./pages/NotFound";

import AdminPage from "./pages/AdminPage";
import MissionControl from "./pages/MissionControl";
import { Workspace5C } from "./pages/Workspace5C";
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
      <AuthProvider>
        <TooltipProvider>
          <FeatureFlagProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Index />} />
              </Routes>
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
                              <Route path="/think" element={
                                <ProtectedRoute>
                                  <ThinkZone />
                                </ProtectedRoute>
                              } />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          }
                        >
                          <Routes>
                            <Route path="/think" element={
                              <ProtectedRoute>
                                <ThinkZone />
                              </ProtectedRoute>
                            } />
                            <Route path="/think-zone-studio" element={
                              <ProtectedRoute>
                                <ThinkZoneStudio />
                              </ProtectedRoute>
                            } />
                            <Route path="/act" element={
                              <ProtectedRoute>
                                <ActZone />
                              </ProtectedRoute>
                            } />
                            <Route path="/monitor" element={
                              <ProtectedRoute>
                                <MonitorZone />
                              </ProtectedRoute>
                            } />
                            <Route path="/innovate" element={
                              <ProtectedRoute>
                                <InnovateLearnZone />
                              </ProtectedRoute>
                            } />
                            <Route path="*" element={<NotFound />} />
                           </Routes>
                        </FeatureFlagGuard>
                      </Shell>
                    }
                  >
                    <Routes>
                      <Route path="/workspace" element={
                        <ProtectedRoute>
                          <Workspace />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={
                        <ProtectedRoute>
                          <Workspace />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </FeatureFlagGuard>
                }
              >
                {/* Ultimate Workspace Mode */}
                <Shell>
                  <Routes>
                    <Route path="/workspace" element={
                      <ProtectedRoute>
                        <Workspace />
                      </ProtectedRoute>
                    } />
                    <Route path="/demo" element={
                      <ProtectedRoute>
                        <Demo />
                      </ProtectedRoute>
                    } />
                    <Route path="/registry" element={<LoopRegistry />} />
                    <Route path="/registry/:id" element={<LoopDetail />} />
                    <Route path="/registry/:id/edit" element={<LoopEditor />} />
                    <Route path="/dashboard/loops" element={
                      <ProtectedRoute>
                        <LoopDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <div className="pt-4">
                          <Dashboard />
                        </div>
                      </ProtectedRoute>
                    } />
                    {/* Admin Pages */}
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/plugins" element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/offline" element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/security" element={
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/mission-control" element={
                      <ProtectedRoute>
                        <MissionControl />
                      </ProtectedRoute>
                    } />
                    <Route path="/workspace-5c" element={
                      <ProtectedRoute>
                        <Workspace5C />
                      </ProtectedRoute>
                    } />
                    {/* Legacy Zone Access */}
                    <Route path="/think" element={
                      <ProtectedRoute>
                        <ThinkZone />
                      </ProtectedRoute>
                    } />
                    <Route path="/think-zone-studio" element={
                      <ProtectedRoute>
                        <ThinkZoneStudio />
                      </ProtectedRoute>
                    } />
                    <Route path="/scenario-planner" element={
                      <ProtectedRoute>
                        <ScenarioPlannerPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/act" element={
                      <ProtectedRoute>
                        <ActZone />
                      </ProtectedRoute>
                    } />
                    <Route path="/monitor" element={
                      <ProtectedRoute>
                        <MonitorZone />
                      </ProtectedRoute>
                    } />
                    <Route path="/innovate" element={
                      <ProtectedRoute>
                        <InnovateLearnZone />
                      </ProtectedRoute>
                    } />
                     <Route path="*" element={<Index />} />
                  </Routes>
                </Shell>
              </FeatureFlagGuard>
            </BrowserRouter>
          </FeatureFlagProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
