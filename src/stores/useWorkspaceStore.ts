import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ZoneKey = 'think'|'act'|'monitor'|'innovate'|'admin'

type ViewParams = Record<string, string> | null

type WorkspaceState = {
  zoneRoutes: Record<ZoneKey, string>
  zoneViews: Record<ZoneKey, string | null>
  zoneParams: Record<ZoneKey, ViewParams>
  getRouteForZone: (z: ZoneKey) => string
  setRouteForZone: (z: ZoneKey, path: string) => void
  getViewForZone: (z: ZoneKey) => { view: string | null; params: ViewParams }
  setViewForZone: (z: ZoneKey, view: string | null, params?: ViewParams) => void
}

const defaultRoutes: Record<ZoneKey, string> = {
  think: '/think',
  act: '/act',
  monitor: '/monitor/loop-health',
  innovate: '/innovate/network-explorer',
  admin: '/admin/changes-queue',
}

const defaultViews: Record<ZoneKey, string | null> = {
  think: null,
  act: null,
  monitor: null,
  innovate: 'network-explorer',
  admin: 'changes-queue',
}


const defaultParams: Record<ZoneKey, ViewParams> = {
  think: null,
  act: null,
  monitor: null,
  innovate: null,
  admin: null,
}

export const useWorkspaceStore = create<WorkspaceState>()(persist((set, get)=>({
  zoneRoutes: defaultRoutes,
  zoneViews: defaultViews,
  zoneParams: defaultParams,
  getRouteForZone: (z)=> get().zoneRoutes[z] || defaultRoutes[z],
  setRouteForZone: (z, path)=> set((s)=> ({ zoneRoutes: { ...s.zoneRoutes, [z]: path } })),
  getViewForZone: (z)=> ({ view: get().zoneViews[z], params: get().zoneParams[z] }),
  setViewForZone: (z, view, params = null)=> set((s)=> ({
    zoneViews: { ...s.zoneViews, [z]: view },
    zoneParams: { ...s.zoneParams, [z]: params },
  })),
}),{ name: 'rznf:workspace-routes' }))
