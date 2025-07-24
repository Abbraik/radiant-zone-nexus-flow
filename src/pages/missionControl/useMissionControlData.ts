import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mockMissionControlData } from './mockData';
import type { MissionControlData } from './types';

// Simulate API delay
const simulateApiDelay = (ms: number = 800) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
const fetchMissionControlData = async (): Promise<MissionControlData> => {
  await simulateApiDelay();
  
  // Simulate some dynamic data changes
  const data = { ...mockMissionControlData };
  
  // Update timestamps to current time
  data.globalHealth.lastUpdated = new Date();
  data.systemStatus.lastSync = new Date(Date.now() - Math.random() * 60000);
  
  // Simulate some randomness in metrics
  data.kpis = data.kpis.map(kpi => ({
    ...kpi,
    value: typeof kpi.value === 'number' 
      ? Math.floor(kpi.value + (Math.random() - 0.5) * 2)
      : kpi.value
  }));
  
  // Simulate health fluctuations
  data.globalHealth.overall = Math.max(75, Math.min(95, 
    data.globalHealth.overall + (Math.random() - 0.5) * 4
  ));
  
  return data;
};

const fetchGlobalHealth = async () => {
  await simulateApiDelay(200);
  return mockMissionControlData.globalHealth;
};

const fetchKPIs = async () => {
  await simulateApiDelay(300);
  return mockMissionControlData.kpis;
};

const fetchAlerts = async () => {
  await simulateApiDelay(150);
  return mockMissionControlData.alerts;
};

const fetchPredictions = async () => {
  await simulateApiDelay(400);
  return mockMissionControlData.predictions;
};

const fetchTimeline = async () => {
  await simulateApiDelay(350);
  return mockMissionControlData.timeline;
};

const fetchResources = async () => {
  await simulateApiDelay(250);
  return mockMissionControlData.resources;
};

const fetchDigitalTwins = async () => {
  await simulateApiDelay(300);
  return mockMissionControlData.digitalTwins;
};

const fetchGoalTree = async () => {
  await simulateApiDelay(450);
  return mockMissionControlData.goalTree;
};

const fetchPresence = async () => {
  await simulateApiDelay(100);
  return mockMissionControlData.presence;
};

// Query keys
export const missionControlKeys = {
  all: ['mission-control'] as const,
  data: () => [...missionControlKeys.all, 'data'] as const,
  globalHealth: () => [...missionControlKeys.all, 'global-health'] as const,
  kpis: () => [...missionControlKeys.all, 'kpis'] as const,
  alerts: () => [...missionControlKeys.all, 'alerts'] as const,
  predictions: () => [...missionControlKeys.all, 'predictions'] as const,
  timeline: () => [...missionControlKeys.all, 'timeline'] as const,
  resources: () => [...missionControlKeys.all, 'resources'] as const,
  digitalTwins: () => [...missionControlKeys.all, 'digital-twins'] as const,
  goalTree: () => [...missionControlKeys.all, 'goal-tree'] as const,
  presence: () => [...missionControlKeys.all, 'presence'] as const,
};

// Main hook for complete mission control data
export const useMissionControlData = () => {
  return useQuery({
    queryKey: missionControlKeys.data(),
    queryFn: fetchMissionControlData,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000, // Data is fresh for 10 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Individual data hooks for granular loading
export const useGlobalHealth = () => {
  return useQuery({
    queryKey: missionControlKeys.globalHealth(),
    queryFn: fetchGlobalHealth,
    refetchInterval: 15000,
    staleTime: 5000,
  });
};

export const useKPIs = () => {
  return useQuery({
    queryKey: missionControlKeys.kpis(),
    queryFn: fetchKPIs,
    refetchInterval: 20000,
    staleTime: 10000,
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: missionControlKeys.alerts(),
    queryFn: fetchAlerts,
    refetchInterval: 10000, // More frequent for alerts
    staleTime: 5000,
  });
};

export const usePredictions = () => {
  return useQuery({
    queryKey: missionControlKeys.predictions(),
    queryFn: fetchPredictions,
    refetchInterval: 60000, // Less frequent for predictions
    staleTime: 30000,
  });
};

export const useTimeline = () => {
  return useQuery({
    queryKey: missionControlKeys.timeline(),
    queryFn: fetchTimeline,
    refetchInterval: 30000,
    staleTime: 15000,
  });
};

export const useResources = () => {
  return useQuery({
    queryKey: missionControlKeys.resources(),
    queryFn: fetchResources,
    refetchInterval: 45000,
    staleTime: 20000,
  });
};

export const useDigitalTwins = () => {
  return useQuery({
    queryKey: missionControlKeys.digitalTwins(),
    queryFn: fetchDigitalTwins,
    refetchInterval: 25000,
    staleTime: 10000,
  });
};

export const useGoalTree = () => {
  return useQuery({
    queryKey: missionControlKeys.goalTree(),
    queryFn: fetchGoalTree,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

export const usePresence = () => {
  return useQuery({
    queryKey: missionControlKeys.presence(),
    queryFn: fetchPresence,
    refetchInterval: 5000, // Very frequent for presence
    staleTime: 2000,
  });
};

// Utility hook for invalidating all mission control data
export const useMissionControlActions = () => {
  const queryClient = useQueryClient();
  
  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: missionControlKeys.all });
  };
  
  const refreshSection = (section: keyof typeof missionControlKeys) => {
    if (typeof missionControlKeys[section] === 'function') {
      queryClient.invalidateQueries({ 
        queryKey: (missionControlKeys[section] as () => readonly string[])() 
      });
    }
  };
  
  return {
    refreshAll,
    refreshSection,
  };
};