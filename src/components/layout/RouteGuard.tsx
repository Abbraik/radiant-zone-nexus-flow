import React from 'react'
import { Navigate } from 'react-router-dom'
import { useRoleStore } from '@/stores/useRoleStore'

export function RouteGuard({ roles, children }:{ roles: Array<'viewer'|'analyst'|'admin'|'superuser'>; children: React.ReactElement }){
  const role = useRoleStore(s=> s.role)
  const allowed = roles.includes(role as any) || (role==='superuser')
  if (!allowed) return <Navigate to="/forbidden" replace />
  return children
}
