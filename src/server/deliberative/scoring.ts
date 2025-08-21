// Optional local helper mirroring SQL view math

export function mcdaTotal(
  weights: { id: string; w: number; dir: "maximize" | "minimize" }[], 
  row: { criterionId: string; score: number }[]
) {
  const map = new Map(weights.map(w => [w.id, w]));
  return row.reduce((sum, c) => {
    const w = map.get(c.criterionId); 
    if (!w) return sum;
    return sum + (w.dir === "maximize" ? c.score * w.w : (1 - c.score) * w.w);
  }, 0);
}

export function normalizeScores(scores: number[]): number[] {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;
  
  if (range === 0) {
    return scores.map(() => 0.5); // All scores are the same
  }
  
  return scores.map(score => (score - min) / range);
}

export function calculateRegret(optionScores: number[], bestScore: number): number {
  const maxOptionScore = Math.max(...optionScores);
  return Math.max(0, bestScore - maxOptionScore);
}

export function isParetoEfficient(
  candidate: { risk: number; cost: number; equity: number },
  allCandidates: { risk: number; cost: number; equity: number }[]
): boolean {
  return !allCandidates.some(other => 
    (other.risk <= candidate.risk && other.cost <= candidate.cost && other.equity >= candidate.equity) &&
    (other.risk < candidate.risk || other.cost < candidate.cost || other.equity > candidate.equity)
  );
}