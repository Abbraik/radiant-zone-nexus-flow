import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ZoneKey = 'think'|'act'|'monitor'|'innovate'|'admin'

type WorkspaceState = {
  zoneRoutes: Record<ZoneKey, string>
  getRouteForZone: (z: ZoneKey) => string
  setRouteForZone: (z: ZoneKey, path: string) => void
}

const defaults: Record<ZoneKey, string> = {
  think: '/think',
  act: '/act',
  monitor: '/monitor/loop-health',
  innovate: '/innovate/network-explorer',
  admin: '/admin/changes-queue',
}

export const useWorkspaceStore = create<WorkspaceState>()(persist((set, get)=>({
  zoneRoutes: defaults,
  getRouteForZone: (z)=> get().zoneRoutes[z] || defaults[z],
  setRouteForZone: (z, path)=> set((s)=> ({ zoneRoutes: { ...s.zoneRoutes, [z]: path } })),
}),{ name: 'rznf:workspace-routes' }))
