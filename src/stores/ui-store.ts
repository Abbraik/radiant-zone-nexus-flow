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
  newRgsUI: true,
  newTaskDrivenUI: true,
  cldStudio: true,
  advancedAnalytics: false,
  mockDataMode: process.env.NODE_ENV === 'development',
  realTimeCollab: true,
  workspacePro: true,
  aiCopilot: true,
  automation: true,
  pluginSystem: false,
  useCascadeBar: true,
  useTaskClaimPopup: true,
  useEnhancedTaskPopup: true,
  useTeamsButton: true,
  useUltimateWorkspace: true,
  useAIcopilot: true,
  useDigitalTwin: true,
  useCascade3D: true,
  useCollabEngine: true,
  use3DCLD: false,
  useKnowledgeGraph: false,
  useGamification: true,
  useOfflinePWA: true,
  usePluginEcosystem: true,
  useSecuritySuite: true,
  useMissionControl: true,
  CLAIMANT_ZONE_VIEW_MVP: true,
  useZoneBundles: true,
  // New Capacity-Mode Architecture flags
  META_LOOP_CONSOLE: true,
  CAPACITY_WORKSPACE: true,
  SUPABASE_LIVE: false,
  LEGACY_TAMLI: false,
  MANDATE_GATE: true,
  EQUILIBRIUM_SCORECARD: true,
  REL_CADENCE: true,
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