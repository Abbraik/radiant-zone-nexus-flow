export type ZoneKey = 'think'|'act'|'monitor'|'innovate'|'admin'

export type NavItem = {
  label: string
  icon?: string
  path: string
  zone: ZoneKey | 'workspace' | 'demo'
  promptRef?: number
}

export const NAV_CONFIG: Record<ZoneKey | 'demo', NavItem[]> = {
  think: [
    { label: 'Loop Registry', path: '/think/loops', zone: 'think', promptRef: 0 },
    { label: 'Loop Studio', path: '/think/loops/new', zone: 'think', promptRef: 1 },
    { label: 'Variables', path: '/think/variables', zone: 'think', promptRef: 2 },
    { label: 'Leverage Ladder', path: '/think/leverage', zone: 'think', promptRef: 10 },
    { label: 'Leverage Analysis', path: '/think/leverage-analysis', zone: 'think', promptRef: 11 },
    { label: 'Leverage Scenarios', path: '/think/leverage-scenarios', zone: 'think', promptRef: 12 },
  ],
  act: [
    { label: 'Bundles', path: '/act/bundles', zone: 'act', promptRef: 16 },
  ],
  monitor: [
    { label: 'Loop Health', path: '/monitor/loop-health', zone: 'monitor', promptRef: 19 },
  ],
  innovate: [
    { label: 'Network Explorer', path: '/innovate/network-explorer', zone: 'innovate', promptRef: 21 },
    { label: 'Shock Lab', path: '/innovate/shock-lab', zone: 'innovate', promptRef: 22 },
  ],
  admin: [
    { label: 'Changes Queue', path: '/admin/changes-queue', zone: 'admin', promptRef: 23 },
    { label: 'Meta-Loop Console', path: '/admin/meta-loop-console', zone: 'admin', promptRef: 24 },
  ],
  demo: [
    { label: 'Seed Atlas', path: '/demo-atlas', zone: 'demo', promptRef: 25 },
  ],
}
