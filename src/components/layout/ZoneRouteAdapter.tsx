import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Workspace } from '@/components/workspace/Workspace'
import { useWorkspaceStore, type ZoneKey } from '@/stores/useWorkspaceStore'
import { useRoleStore } from '@/stores/useRoleStore'

function zoneFromPath(pathname: string): ZoneKey | null {
  if (pathname.startsWith('/think')) return 'think'
  if (pathname.startsWith('/act')) return 'act'
  if (pathname.startsWith('/monitor')) return 'monitor'
  if (pathname.startsWith('/innovate')) return 'innovate'
  if (pathname.startsWith('/admin')) return 'admin'
  return null
}

function parseParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search)
  const obj: Record<string, string> = {}
  params.forEach((v, k) => { obj[k] = v })
  return obj
}

function inferView(zone: ZoneKey, subpath: string): string | null {
  const parts = (subpath || '').split('/').filter(Boolean)
  switch (zone) {
    case 'think': {
      if (parts[0] === 'loops') {
        if (parts[1]) return 'loop-studio'
        return 'loops'
      }
      if (parts[0] === 'variables') return 'variables'
      if (parts[0] === 'leverage') return 'leverage-ladder'
      if (parts[0] === 'leverage-analysis') return 'leverage-analysis'
      if (parts[0] === 'leverage-scenarios') return 'leverage-scenarios'
      return null
    }
    case 'act': {
      if (parts[0] === 'bundles') {
        if (parts[1]) return 'bundle-editor'
        return 'bundles'
      }
      if (parts[0] === 'pathway-builder') return 'pathway-builder'
      return null
    }
    case 'monitor': {
      return 'loop-health'
    }
    case 'innovate': {
      if (parts[0] === 'network-explorer') return 'network-explorer'
      if (parts[0] === 'shock-lab') return 'shock-lab'
      return null
    }
    case 'admin': {
      if (parts[0] === 'changes-queue') return 'changes-queue'
      return parts[0] || null
    }
    default:
      return null
  }
}

export default function ZoneRouteAdapter({ redirectToWorkspace = true }: { redirectToWorkspace?: boolean }){
  const loc = useLocation()
  const nav = useNavigate()
  const role = useRoleStore(s => s.role)
  const setViewForZone = useWorkspaceStore(s => s.setViewForZone)
  const setRouteForZone = useWorkspaceStore(s => s.setRouteForZone)
  const getViewForZone = useWorkspaceStore(s => s.getViewForZone)
  const getRouteForZone = useWorkspaceStore(s => s.getRouteForZone)

  useEffect(() => {
    const zone = zoneFromPath(loc.pathname)
    if (!zone) return

    // Role checks (basic)
    if (zone === 'admin' && role !== 'admin' && role !== 'superuser') {
      nav('/forbidden', { replace: true })
      return
    }
    if (zone === 'innovate' && !(role === 'analyst' || role === 'admin' || role === 'superuser')) {
      nav('/forbidden', { replace: true })
      return
    }

    const subpath = loc.pathname.replace(/^\/(think|act|monitor|innovate|admin)\/?/, '')
    const view = inferView(zone, subpath)
    const params = parseParams(loc.search)

    const nextParams = Object.keys(params).length ? params : null
    const current = getViewForZone(zone)
    const targetRoute = loc.pathname + (loc.search || '')

    if (current.view !== view || JSON.stringify(current.params ?? null) !== JSON.stringify(nextParams)) {
      setViewForZone(zone, view, nextParams)
    }
    if (getRouteForZone(zone) !== targetRoute) {
      setRouteForZone(zone, targetRoute)
    }

    if (redirectToWorkspace) {
      nav('/workspace', { replace: true })
    }
  }, [loc.pathname, loc.search, nav, role, setViewForZone, setRouteForZone, getViewForZone, getRouteForZone])

  if (redirectToWorkspace) return null
  return <Workspace />
}
