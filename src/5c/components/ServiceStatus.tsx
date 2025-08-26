// Service Status Component for 5C Workspace
import { useEffect, useState } from 'react';
import { debugServiceHealth, validateTaskData } from '../services/enhanced-supabase';
import type { ServiceHealth } from '../services/service-monitor';

export const ServiceStatus = () => {
  const [health, setHealth] = useState<Record<string, ServiceHealth>>({});
  const [taskValidation, setTaskValidation] = useState<{ isValid: boolean; issues: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const checkServices = async () => {
    setLoading(true);
    try {
      const [healthResult, validationResult] = await Promise.all([
        debugServiceHealth(),
        validateTaskData()
      ]);
      setHealth(healthResult);
      setTaskValidation(validationResult);
    } catch (error) {
      console.error('Service check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkServices();
  }, []);

  return (
    <div className="p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Service Status</h3>
        <button
          onClick={checkServices}
          disabled={loading}
          className="text-xs px-2 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      <div className="space-y-2">
        {Object.entries(health).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between text-sm">
            <span className="font-medium">{service}</span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                status.status === 'healthy' ? 'bg-green-500' :
                status.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-muted-foreground">
                {status.status} {status.latency && `(${status.latency}ms)`}
              </span>
            </div>
          </div>
        ))}
        
        {taskValidation && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Tasks Data</span>
              <span className={`w-2 h-2 rounded-full ${
                taskValidation.isValid ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            {taskValidation.issues.length > 0 && (
              <div className="mt-1 text-xs text-destructive">
                {taskValidation.issues.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};