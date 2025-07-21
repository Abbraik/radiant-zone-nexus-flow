import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { FeatureFlagGuard } from "./components/layout/FeatureFlagProvider";
import { Workspace } from "./components/workspace/Workspace";
import { ThinkZone } from "./pages/ThinkZone";
import { ActZone } from "./pages/ActZone";
import { MonitorZone } from "./pages/MonitorZone";
import { InnovateLearnZone } from "./pages/InnovateLearnZone";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
            <Route path="/" element={<Workspace />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="*" element={<Workspace />} />
          </Routes>
        </FeatureFlagGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
