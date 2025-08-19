// Workspace 5C Zustand Store - Isolated from legacy
import { create } from 'zustand';
import type { EnhancedTask5C, Capacity5C } from '../types';

interface Workspace5CState {
  currentTask: EnhancedTask5C | null;
  selectedCapacity: Capacity5C | null;
  overlayOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Actions
  setCurrentTask: (task: EnhancedTask5C | null) => void;
  setSelectedCapacity: (capacity: Capacity5C | null) => void;
  setOverlayOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // UI state for pixel parity
  breadcrumbs: Array<{ label: string; href?: string }>;
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void;
}

export const use5cStore = create<Workspace5CState>((set) => ({
  currentTask: null,
  selectedCapacity: null,
  overlayOpen: false,
  sidebarCollapsed: false,
  breadcrumbs: [],
  
  setCurrentTask: (task) => set({ currentTask: task }),
  setSelectedCapacity: (capacity) => set({ selectedCapacity: capacity }),
  setOverlayOpen: (open) => set({ overlayOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));