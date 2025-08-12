import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import type { TargetType } from '@/stores/useLeverageLadderStore'

export type ScenarioInput = {
  id: string
  lps: { lpId: string; targetId: string; targetType: TargetType }[]
}

// Mock sim: baseline trend + LP-induced changes with exponential decay
export function runTrajectory(scenario: ScenarioInput, months = 36){
  const stress = useLeverageLadderStore.getState().stressTest
  const baselineSHI = 0.6
  const baselineSPI = 0.5
  const monthlyDrift = 0.002 // baseline system drift

  const lpEffects = scenario.lps.map(lp => stress(lp.lpId, lp.targetId, lp.targetType))
  const denom = Math.max(lpEffects.length, 1)
  const avgIndexBoost = lpEffects.reduce((sum,e)=>sum + (e.projectedIndex - e.baselineIndex), 0) / denom
  const avgRiskReduction = lpEffects.reduce((sum,e)=>sum + (e.baselineRisk - e.projectedRisk), 0) / denom

  const series: any[] = []
  let shi = baselineSHI
  let spi = baselineSPI

  for (let t=0; t<=months; t++){
    const decayFactor = Math.exp(-t/18)
    shi = Math.min(1, Math.max(0, shi + monthlyDrift + (avgIndexBoost * decayFactor)))
    spi = Math.min(1, Math.max(0, spi + monthlyDrift + ((avgIndexBoost + avgRiskReduction) * 0.5 * decayFactor)))
    series.push({
      t,
      [`${scenario.id}_SHI`]: shi,
      [`${scenario.id}_SPI`]: spi
    })
  }
  return series
}
