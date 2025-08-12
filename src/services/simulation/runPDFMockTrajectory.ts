import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import { elasticityTable, lpPillarImpact } from '@/services/mock/modelElasticities'

export function runPDFMockTrajectory(
  scenario: { id: string; lps: { lpId: string; targetId: string; targetType: 'loop'|'bundle'|'policy' }[] },
  months = 36,
  sensitivity = 1
){
  const { leveragePoints } = useLeverageLadderStore.getState()
  const targets = { pop_dyn: 0.8, res_market: 0.75, prod_services: 0.78, soc_outcomes: 0.82 }
  const state: Record<'pop_dyn'|'res_market'|'prod_services'|'soc_outcomes', number> = { pop_dyn: 0.6, res_market: 0.55, prod_services: 0.5, soc_outcomes: 0.58 }

  const lpEffects = scenario.lps.map(lp => {
    const tier = (leveragePoints.find(x=>x.id===lp.lpId)?.tier || 'mid') as 'high'|'mid'|'low'
    const baseImpact = lpPillarImpact[lp.lpId] || {}
    return { ...baseImpact, elasticity: elasticityTable[tier] * sensitivity }
  })

  const monthlySeries: any[] = []

  for (let t = 0; t <= months; t++){
    // Record current step
    monthlySeries.push({
      t,
      [`${scenario.id}_pop_dyn`]: state.pop_dyn,
      [`${scenario.id}_res_market`]: state.res_market,
      [`${scenario.id}_prod_services`]: state.prod_services,
      [`${scenario.id}_soc_outcomes`]: state.soc_outcomes,
    })

    // Sum LP boosts by pillar
    const boostSum = { pop_dyn: 0, res_market: 0, prod_services: 0, soc_outcomes: 0 }
    lpEffects.forEach(e=>{
      boostSum.pop_dyn += (e as any).pop_dyn || 0
      boostSum.res_market += (e as any).res_market || 0
      boostSum.prod_services += (e as any).prod_services || 0
      boostSum.soc_outcomes += (e as any).soc_outcomes || 0
    })

    // Update each pillar toward its target using elasticity + boost
    ;(Object.keys(state) as (keyof typeof state)[]).forEach((key)=>{
      const gap = targets[key] - state[key]
      const elasticity = lpEffects.length ? Math.max(...lpEffects.map(e=>(e as any).elasticity as number)) : 0.05 * sensitivity
      state[key] = Math.min(1, Math.max(0, state[key] + elasticity * gap + (boostSum as any)[key]))
    })
  }

  return monthlySeries
}
