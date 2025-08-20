import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Activity } from "lucide-react";
import { SignalMonitor } from "@/components/capacity";
import type { EnhancedTask5C } from "@/5c/types";

export default function LoopSignalMonitor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loopCode = searchParams.get('loop') || 'Unknown';
  
  const [createdTasks, setCreatedTasks] = useState<EnhancedTask5C[]>([]);

  const handleTasksCreated = (tasks: EnhancedTask5C[]) => {
    setCreatedTasks(prev => [...prev, ...tasks]);
  };

  const goToWorkspace5C = () => {
    navigate('/workspace-5c');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6" />
                Signal Monitor
              </h1>
              <p className="text-gray-400">
                Loop: {loopCode} • Real-time capacity decision making
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {createdTasks.length > 0 && (
              <Button onClick={goToWorkspace5C} className="bg-teal-600 hover:bg-teal-700">
                View Tasks ({createdTasks.length})
              </Button>
            )}
          </div>
        </div>

        {/* Created Tasks Summary */}
        {createdTasks.length > 0 && (
          <Card className="p-4 mb-6 bg-teal-900/20 border-teal-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-teal-100">
                  Tasks Created from Signals
                </h3>
                <p className="text-sm text-teal-200">
                  {createdTasks.length} capacity tasks are ready for claiming
                </p>
              </div>
              <div className="flex gap-2">
                {Array.from(new Set(createdTasks.map(t => t.capacity))).map(capacity => (
                  <Badge key={capacity} variant="outline" className="capitalize">
                    {capacity}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Signal Monitor */}
        <SignalMonitor 
          onTasksCreated={handleTasksCreated}
          autoCreateTasks={false} // Manual analysis for now
        />
      </div>
    </div>
  );
}