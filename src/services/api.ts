// API Service Layer - Foundation for Future Backend Integration
import { QueryClient } from '@tanstack/react-query';

export interface APIResponse<T = any> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Mock API service - will be replaced with real endpoints
class APIService {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api' 
      : '/api';
    
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Generic request handler
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      };

      // Mock delay for realistic API simulation
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
      }

      // Mock response for now - replace with actual fetch
      const mockResponse: APIResponse<T> = {
        data: {} as T,
        status: 'success',
        timestamp: new Date().toISOString(),
      };

      return mockResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): APIError {
    if (error instanceof Error) {
      return {
        code: 'REQUEST_FAILED',
        message: error.message,
        details: error,
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: error,
    };
  }

  // Auth methods (placeholder for Phase 3)
  async authenticate(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(token: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Task management
  async getTasks(filters?: any) {
    return this.request('/tasks', {
      method: 'GET',
    });
  }

  async createTask(task: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: string, updates: any) {
    return this.request(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Loop management
  async getLoops() {
    return this.request('/loops');
  }

  async updateLoop(id: string, updates: any) {
    return this.request(`/loops/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Metrics and analytics
  async getMetrics(timeRange?: string) {
    return this.request('/metrics', {
      method: 'GET',
    });
  }

  async getInsights(filters?: any) {
    return this.request('/insights');
  }

  // AI Copilot
  async getCopilotResponse(message: string, context?: any) {
    return this.request('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  // Collaboration (placeholder for Phase 2)
  async getTeamMembers() {
    return this.request('/team/members');
  }

  async startPairSession(taskId: string, partnerId: string) {
    return this.request('/collab/pair', {
      method: 'POST',
      body: JSON.stringify({ taskId, partnerId }),
    });
  }

  // Plugin system (placeholder for Phase 3)
  async getPlugins() {
    return this.request('/plugins');
  }

  async installPlugin(pluginId: string) {
    return this.request(`/plugins/${pluginId}/install`, {
      method: 'POST',
    });
  }
}

// Create singleton instance
export const apiService = new APIService();

// React Query configuration
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
        retry: (failureCount, error: any) => {
          // Don't retry for auth errors
          if (error?.code === 'UNAUTHORIZED') return false;
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Error boundary helper
export class APIErrorBoundary extends Error {
  constructor(public apiError: APIError) {
    super(apiError.message);
    this.name = 'APIErrorBoundary';
  }
}