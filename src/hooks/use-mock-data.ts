import { useQuery } from '@tanstack/react-query';
import { mockLoops, mockSprints, mockMetrics, mockInsights, mockInterventions, mockRoles } from '../services/mock/data';
import type { Loop, Sprint, Metric, Insight, Intervention, Role } from '../types';

// Simulate API delay
const simulateDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));

export const useMockLoops = () => {
  return useQuery({
    queryKey: ['loops'],
    queryFn: async (): Promise<Loop[]> => {
      await simulateDelay();
      return mockLoops;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMockSprints = (loopId?: string) => {
  return useQuery({
    queryKey: ['sprints', loopId],
    queryFn: async (): Promise<Sprint[]> => {
      await simulateDelay();
      return loopId 
        ? mockSprints.filter(sprint => sprint.loopId === loopId)
        : mockSprints;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useMockMetrics = (loopId?: string) => {
  return useQuery({
    queryKey: ['metrics', loopId],
    queryFn: async (): Promise<Metric[]> => {
      await simulateDelay();
      return loopId 
        ? mockMetrics.filter(metric => metric.loopId === loopId)
        : mockMetrics;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for metrics
  });
};

export const useMockInsights = () => {
  return useQuery({
    queryKey: ['insights'],
    queryFn: async (): Promise<Insight[]> => {
      await simulateDelay();
      return mockInsights;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useMockInterventions = () => {
  return useQuery({
    queryKey: ['interventions'],
    queryFn: async (): Promise<Intervention[]> => {
      await simulateDelay();
      return mockInterventions;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useMockRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<Role[]> => {
      await simulateDelay();
      return mockRoles;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Mutations for mock data updates
export const useMockCreateSprint = () => {
  // This would normally be a useMutation, but for mock purposes:
  const createSprint = async (sprintData: Partial<Sprint>): Promise<Sprint> => {
    await simulateDelay(500);
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      week: 1,
      totalWeeks: 12,
      interventions: [],
      status: 'planning',
      createdAt: new Date(),
      ...sprintData
    } as Sprint;
    
    // In real implementation, this would trigger a cache update
    console.log('Mock: Created sprint', newSprint);
    return newSprint;
  };
  
  return { createSprint };
};