export type Tier = 'high'|'mid'|'low'

export type ScoreInput = {
  lpId: string
  tier: Tier
  families: string[]
}

export type TargetMeta = {
  id: string
  type: 'loop' | 'bundle'
  // For loops
  loopClass?: 'R'|'B'|'N'|'C'|'T'
  // For bundles
  dominantFamily?: string
  // Optional readiness signals
  pathwayRiskPct?: number // 0-100
  expectedLatencyDays?: number
}

function tierBase(tier: Tier, pref: Tier): number {
  const base = tier === 'high' ? 3 : tier === 'mid' ? 2 : 1
  const bonus = tier === pref ? 1 : 0
  return base + bonus // max 4
}

function leverFamilyMatch(families: string[], dominant?: string): number {
  if (!dominant) return 0
  return families.includes(dominant) ? 2 : 0
}

function typologySynergy(lpId: string, loopClass?: 'R'|'B'|'N'|'C'|'T'): number {
  if (!loopClass) return 0
  const num = Number(lpId.replace('LP',''))
  if (Number.isNaN(num)) return 0
  if (loopClass === 'R') {
    // Reinforcing: favor LP5-LP8
    return (num >=5 && num <=8) ? 2 : 0
  }
  if (loopClass === 'B') {
    // Balancing: favor LP9-LP12
    return (num >=9 && num <=12) ? 2 : 0
  }
  return 0
}

function readinessBonus(riskPct?: number, latency?: number): number {
  const risk = riskPct ?? 60
  const lat = latency ?? 14
  if (risk < 40 && lat < 10) return 2
  if (risk < 70) return 1
  return 0
}

export function scoreLPsForTarget(
  allLPs: ScoreInput[],
  alreadyTaggedLpIds: string[],
  target: TargetMeta,
  preferredTier: Tier = 'high'
): { lpId: string; score: number }[] {
  const out: { lpId: string; score: number }[] = []
  for (const lp of allLPs) {
    if (alreadyTaggedLpIds.includes(lp.lpId)) continue
    const tWeight = tierBase(lp.tier, preferredTier)
    const fam = leverFamilyMatch(lp.families, target.dominantFamily)
    const syn = typologySynergy(lp.lpId, target.loopClass)
    const ready = readinessBonus(target.pathwayRiskPct, target.expectedLatencyDays)
    const baseScore = tWeight + fam + syn + ready // max 10
    const score = Math.max(0, Math.min(10, baseScore))
    out.push({ lpId: lp.lpId, score })
  }
  return out.sort((a,b)=> b.score - a.score)
}
