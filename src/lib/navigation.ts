import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore, type ZoneKey } from '@/stores/useWorkspaceStore'

export type ZoneParams = Record<string, string> | null

// Simple helper to drive zone navigation consistently.
// In later phases we can add a canonical path resolver per {zone, view}.
export function useGoToZone() {
  const nav = useNavigate()
  const getRouteForZone = useWorkspaceStore(s => s.getRouteForZone)
  const setViewForZone = useWorkspaceStore(s => s.setViewForZone)
  const setRouteForZone = useWorkspaceStore(s => s.setRouteForZone)

  return useCallback((zone: ZoneKey, view?: string | null, params?: ZoneParams, pathOverride?: string) => {
    if (typeof view !== 'undefined') {
      setViewForZone(zone, view, params ?? null)
    }
    const target = pathOverride || getRouteForZone(zone)
    setRouteForZone(zone, target)
    nav(target)
  }, [getRouteForZone, setRouteForZone, setViewForZone, nav])
}
