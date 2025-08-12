export type Tier = 'high'|'mid'|'low'

export type ImpactParams = {
  tier: Tier
  families: string[]
  dominantFamily?: string
  baselineRisk: number // 0-1
  baselineLatency: number // days
  baselineIndex: number // 0-1
  resolvesMandateGap?: boolean
}

export function applyMockImpact({ tier, families, dominantFamily, baselineRisk, baselineLatency, baselineIndex, resolvesMandateGap }: ImpactParams){
  // Tier effects
  const tierMap: Record<Tier,{ idx:number; risk:number; lat:number }> = {
    high: { idx: 0.15, risk: -0.20, lat: -0.20 },
    mid:  { idx: 0.10, risk: -0.10, lat: -0.10 },
    low:  { idx: 0.05, risk: -0.05, lat: -0.05 },
  }
  const t = tierMap[tier]

  let idxGain = t.idx
  let riskDelta = t.risk
  let latFactor = 1 + t.lat // multiplicative factor (e.g., -20% => 0.8)

  const assumptions: string[] = []
  assumptions.push(`Tier boost (${tier}) → index +${Math.round(t.idx*100)}pp, risk ${Math.round(t.risk*100)}pp, latency ${Math.round(t.lat*100)}%`)

  if (dominantFamily && families.includes(dominantFamily)) {
    idxGain += 0.03
    assumptions.push('Family synergy bonus: +3pp to index')
  }

  if (resolvesMandateGap) {
    riskDelta -= 0.05
    assumptions.push('Mandate alignment bonus: risk -5pp')
  }

  const projectedIndex = clamp01(baselineIndex + idxGain)
  const projectedRisk = clamp01(baselineRisk + riskDelta)
  const projectedLatency = Math.max(0, Math.round(baselineLatency * latFactor))

  return {
    projectedIndex,
    projectedRisk,
    projectedLatency,
    assumptions
  }
}

function clamp01(x:number){ return Math.max(0, Math.min(1, x)) }
