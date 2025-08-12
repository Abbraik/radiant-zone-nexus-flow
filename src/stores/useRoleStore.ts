import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'viewer'|'analyst'|'admin'|'superuser'

type RoleState = {
  role: Role
  setRole: (r: Role) => void
}

export const useRoleStore = create<RoleState>()(persist((set)=>({
  role: 'analyst',
  setRole: (r)=> set({ role: r })
}),{ name: 'rznf:role' }))
