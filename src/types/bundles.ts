import type { Level } from '@/types/pags'
import type { Lever } from '@/types/pags'

export interface BundleItem {
  id: string
  title: string
  description?: string
  lever: Lever            // 'N' | 'P' | 'S'
  targetLoops: string[]   // loop IDs
  targetVariables: string[] // variable IDs
  expectedEffect?: string
  assignedLpId?: string
  pathwayStage?: Lever    // 'N' | 'P' | 'S'

}

export interface Bundle {
  id: string
  name: string
  description?: string
  level: Level
  items: BundleItem[]
  updatedAt: string
}
