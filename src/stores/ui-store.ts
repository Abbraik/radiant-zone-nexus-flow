import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState, Zone, FeatureFlags } from '../types';

interface UIStore extends UIState {
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentZone: (zone: Zone) => void;
  setActivePanel: (panel: string | undefined) => void;
  updateFeatureFlag: (flag: keyof FeatureFlags, value: boolean) => void;
  resetUI: () => void;
}

const defaultFeatureFlags: FeatureFlags = {
  newRgsUI: true, // Enable by default for new UI
  newTaskDrivenUI: true, // New task-driven workspace - ENABLED
  cldStudio: true,
  advancedAnalytics: false,
  mockDataMode: process.env.NODE_ENV === 'development',
  realTimeCollab: true,
  workspacePro: true,
  aiCopilot: true,
  automation: true,
  pluginSystem: false,
  // New Cascade Features - ENABLED
  useCascadeBar: true,
  useTaskClaimPopup: true,
  useEnhancedTaskPopup: true,
  useTeamsButton: true,
  // Phase 1: Ultimate Workspace Foundation
  useUltimateWorkspace: true,
  useAIcopilot: true,
  useDigitalTwin: true,
  useCascade3D: true,
  useCollabEngine: true,
  use3DCLD: false, // Phase 3
  useKnowledgeGraph: false, // Phase 2
  useGamification: true, // Phase 3 - ENABLED
  useOfflinePWA: true, // Phase 3 - ENABLED
  usePluginEcosystem: true, // Phase 3 - ENABLED
  useSecuritySuite: true, // Phase 3 - ENABLED
  useMissionControl: true, // Mission Control Dashboard - ENABLED
  // Zone-Aware Dynamic Task View
  CLAIMANT_ZONE_VIEW_MVP: true, // ENABLED for development
  useZoneBundles: true // Zone Bundle Integration - ENABLED
};

const initialState: UIState = {
  sidebarCollapsed: false,
  currentZone: 'think',
  featureFlags: defaultFeatureFlags,
  activePanel: undefined
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      setCurrentZone: (zone) =>
        set({ currentZone: zone }),

      setActivePanel: (panel) =>
        set({ activePanel: panel }),

      updateFeatureFlag: (flag, value) =>
        set((state) => ({
          featureFlags: {
            ...state.featureFlags,
            [flag]: value
          }
        })),

      resetUI: () => set(initialState)
    }),
    {
      name: 'rgs-ui-store',
      version: 2, // Increment version to force reset of persisted state
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        featureFlags: state.featureFlags
      })
    }
  )
);