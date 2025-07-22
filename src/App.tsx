import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { FeatureFlagGuard, FeatureFlagProvider } from "./components/layout/FeatureFlagProvider";
import { Workspace } from "./components/workspace/Workspace";
import { WorkspaceHeader } from "./components/workspace/WorkspaceHeader";
import Dashboard from "./pages/Dashboard";
import { ThinkZone } from "./pages/ThinkZone";
import { ActZone } from "./pages/ActZone";
import { MonitorZone } from "./pages/MonitorZone";
import { InnovateLearnZone } from "./pages/InnovateLearnZone";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log('🔥 App.tsx rendering - Route structure check');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FeatureFlagProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
                <Route path="/" element={<Index />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/dashboard" element={
                  <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <WorkspaceHeader activeTask={null} myTasks={[]} isDashboard={true} />
                    <div className="flex-1 overflow-auto">
                      <Dashboard />
                    </div>
                  </div>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </FeatureFlagGuard>
          </BrowserRouter>
        </FeatureFlagProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
