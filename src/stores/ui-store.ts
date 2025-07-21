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
  cldStudio: true,
  advancedAnalytics: false,
  mockDataMode: process.env.NODE_ENV === 'development'
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
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        featureFlags: state.featureFlags
      })
    }
  )
);