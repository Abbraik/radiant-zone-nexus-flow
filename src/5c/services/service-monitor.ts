// Service Health Monitoring for 5C Workspace
import { supabase } from '@/integrations/supabase/client';

export interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'offline';
  latency?: number;
  lastCheck: Date;
  errors?: string[];
}

export class ServiceMonitor {
  private static instance: ServiceMonitor;
  private healthStatus: Record<string, ServiceHealth> = {};

  static getInstance(): ServiceMonitor {
    if (!ServiceMonitor.instance) {
      ServiceMonitor.instance = new ServiceMonitor();
    }
    return ServiceMonitor.instance;
  }

  async checkSupabaseHealth(): Promise<ServiceHealth> {
    const startTime = Date.now();
    
    try {
      // Simple health check query
      const { data, error } = await supabase
        .from('tasks_5c')
        .select('id')
        .limit(1);
      
      const latency = Date.now() - startTime;
      
      if (error) {
        this.healthStatus.supabase = {
          status: 'degraded',
          latency,
          lastCheck: new Date(),
          errors: [error.message]
        };
      } else {
        this.healthStatus.supabase = {
          status: 'healthy',
          latency,
          lastCheck: new Date()
        };
      }
    } catch (err) {
      this.healthStatus.supabase = {
        status: 'offline',
        lastCheck: new Date(),
        errors: [err instanceof Error ? err.message : 'Unknown error']
      };
    }
    
    return this.healthStatus.supabase;
  }

  getHealthStatus(): Record<string, ServiceHealth> {
    return { ...this.healthStatus };
  }

  async performHealthChecks(): Promise<Record<string, ServiceHealth>> {
    await Promise.all([
      this.checkSupabaseHealth()
    ]);
    
    return this.getHealthStatus();
  }
}

// Global service monitor instance
export const serviceMonitor = ServiceMonitor.getInstance();