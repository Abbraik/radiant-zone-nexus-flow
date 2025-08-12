import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'

function zoneFromPath(pathname: string){
  if (pathname.startsWith('/think')) return 'think'
  if (pathname.startsWith('/act')) return 'act'
  if (pathname.startsWith('/monitor')) return 'monitor'
  if (pathname.startsWith('/innovate')) return 'innovate'
  if (pathname.startsWith('/admin')) return 'admin'
  return null
}

export function RouteWatcher(){
  const loc = useLocation()
  const setRouteForZone = useWorkspaceStore(s=> s.setRouteForZone)
  useEffect(()=>{
    const zone = zoneFromPath(loc.pathname)
    if (zone){
      setRouteForZone(zone as any, loc.pathname + (loc.search||''))
    }
  },[loc.pathname, loc.search, setRouteForZone])
  return null
}
