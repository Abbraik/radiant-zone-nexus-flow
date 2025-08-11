export type Level = 'micro'|'meso'|'macro'
export type LoopType = 'Reactive'|'Structural'|'Perceptual'
export type StructuralClass = 'R'|'B'|'N'|'C'|'T'
export type Pillar = 'Population'|'Behavior'|'Resource'|'Economic'|'Resilience'
export type Lever = 'N'|'P'|'S'  // Narrative, Program, Structure

export type Polarity = '+'|'-'

export interface Variable {
  id: string
  name: string
  isShared?: boolean   // from SNL palette
  unit?: string
}

export interface Edge {
  id: string
  fromVarId: string
  toVarId: string
  polarity: Polarity
  delay?: boolean
  weight?: number        // optional, 0–1
}

export interface LoopDraft {
  draftId: string
  name: string
  type: LoopType
  class: StructuralClass
  level: Level
  pillar: Pillar
  variables: Variable[]
  edges: Edge[]
  sharedNodes: string[]  // ids of SNL variables
  deBand: { low: number; high: number }
  thresholds: { soft: number; hard: number }
  triggerNote?: string
  leveragePath: Lever[]  // e.g., ['N','P'], must be non-empty
  tierAnchors: { t1: number; t2: number; t3: number }
  expectedLagDays?: number
  evaluationNote?: string
  confidence: number     // 0–1
}

export interface LoopRecord extends Omit<LoopDraft,'draftId'> {
  id: string
  version: number
  dominance: number
  gain: number
}
