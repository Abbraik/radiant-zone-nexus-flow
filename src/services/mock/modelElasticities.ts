export const elasticityTable = {
  high: 0.12,
  mid: 0.08,
  low: 0.04,
} as const

// Mock LP → pillar impact mapping (values are monthly additive boosts)
// These are placeholders inspired by PDF mapping and will be tuned later.
export const lpPillarImpact: Record<string, Partial<Record<'pop_dyn'|'res_market'|'prod_services'|'soc_outcomes', number>>> = {
  LP12: { pop_dyn: 0.00, res_market: 0.01, prod_services: 0.02, soc_outcomes: 0.00 },
  LP11: { pop_dyn: 0.00, res_market: 0.015, prod_services: 0.00, soc_outcomes: 0.00 },
  LP10: { pop_dyn: 0.00, res_market: 0.01, prod_services: 0.01, soc_outcomes: 0.00 },
  LP9:  { pop_dyn: 0.02, res_market: 0.00, prod_services: 0.00, soc_outcomes: 0.01 },
  LP8:  { pop_dyn: 0.00, res_market: 0.005, prod_services: 0.00, soc_outcomes: 0.01 },
  LP7:  { pop_dyn: 0.00, res_market: 0.00, prod_services: 0.012, soc_outcomes: 0.00 },
  LP6:  { pop_dyn: 0.00, res_market: 0.00, prod_services: 0.008, soc_outcomes: 0.008 },
  LP5:  { pop_dyn: 0.00, res_market: 0.012, prod_services: 0.00, soc_outcomes: 0.00 },
  LP4:  { pop_dyn: 0.01, res_market: 0.00, prod_services: 0.00, soc_outcomes: 0.01 },
  LP3:  { pop_dyn: 0.00, res_market: 0.00, prod_services: 0.00, soc_outcomes: 0.015 },
  LP2:  { pop_dyn: 0.015, res_market: 0.00, prod_services: 0.00, soc_outcomes: 0.02 },
  LP1:  { pop_dyn: 0.02, res_market: 0.00, prod_services: 0.00, soc_outcomes: 0.02 },
}
