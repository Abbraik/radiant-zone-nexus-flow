// Signal Normalization & Scoring Library
// Shared math between database functions and TypeScript processing

import { BandResult, SignalProcessingOptions } from './types';

/**
 * Compute band status and position for a given value
 */
export function computeBandStatus(
  value: number,
  lowerBound?: number,
  upperBound?: number
): BandResult {
  // Handle null bounds
  if (lowerBound === undefined && upperBound === undefined) {
    return { status: 'in_band', band_pos: 0 };
  }

  // Calculate band center and half-width
  const center = ((lowerBound ?? value) + (upperBound ?? value)) / 2.0;
  const halfWidth = ((upperBound ?? value) - (lowerBound ?? value)) / 2.0;

  // Avoid division by zero
  if (halfWidth === 0) {
    return { status: 'in_band', band_pos: 0 };
  }

  // Calculate normalized position: 0=center, ±1=edges, >1=outside
  const bandPos = (value - center) / halfWidth;

  // Determine status
  let status: 'below' | 'in_band' | 'above';
  if (lowerBound !== undefined && value < lowerBound) {
    status = 'below';
  } else if (upperBound !== undefined && value > upperBound) {
    status = 'above';
  } else {
    status = 'in_band';
  }

  return { status, band_pos: bandPos };
}

/**
 * Apply EWMA (Exponentially Weighted Moving Average) smoothing
 */
export function applyEWMASmoothing(
  currentValue: number,
  previousSmoothed?: number,
  alpha: number = 0.3
): number {
  if (previousSmoothed === undefined) {
    return currentValue;
  }
  
  return alpha * currentValue + (1 - alpha) * previousSmoothed;
}

/**
 * Compute loop signal scores from normalized observations
 */
export interface ScoreInputs {
  observations: Array<{
    indicator_key: string;
    ts: Date;
    band_pos: number;
    status: 'below' | 'in_band' | 'above';
    is_hub?: boolean; // SNL hub indicator
  }>;
  windowDays: number;
  asOf: Date;
}

export interface ScoreOutputs {
  severity: number; // mean |band_pos| clipped to [0, 2]
  persistence: number; // share of days outside band
  dispersion: number; // proportion of indicators outside band
  hub_load: number; // weighted avg of hub indicators
  legitimacy_delta: number; // trust vs service divergence
  metadata: {
    total_indicators: number;
    outside_indicators: number;
    total_days: number;
    outside_days: number;
    window_start: Date;
  };
}

export function computeLoopSignalScores(inputs: ScoreInputs): ScoreOutputs {
  const { observations, windowDays, asOf } = inputs;
  const windowStart = new Date(asOf.getTime() - windowDays * 24 * 60 * 60 * 1000);
  
  // Filter observations to window
  const windowObs = observations.filter(obs => 
    obs.ts >= windowStart && obs.ts <= asOf
  );

  // Calculate severity: mean |band_pos| clipped to [0, 2]
  const severity = Math.min(
    2.0,
    windowObs.length > 0 
      ? windowObs.reduce((sum, obs) => sum + Math.abs(obs.band_pos), 0) / windowObs.length
      : 0
  );

  // Calculate persistence: share of days with any indicator outside band
  const daysByDate = new Map<string, boolean>();
  windowObs.forEach(obs => {
    const dateKey = obs.ts.toISOString().split('T')[0];
    if (obs.status !== 'in_band') {
      daysByDate.set(dateKey, true);
    } else if (!daysByDate.has(dateKey)) {
      daysByDate.set(dateKey, false);
    }
  });

  const totalDays = daysByDate.size;
  const outsideDays = Array.from(daysByDate.values()).filter(Boolean).length;
  const persistence = totalDays > 0 ? outsideDays / totalDays : 0;

  // Calculate dispersion: proportion of indicators simultaneously outside band
  const latestByIndicator = new Map<string, typeof windowObs[0]>();
  windowObs.forEach(obs => {
    const current = latestByIndicator.get(obs.indicator_key);
    if (!current || obs.ts > current.ts) {
      latestByIndicator.set(obs.indicator_key, obs);
    }
  });

  const totalIndicators = latestByIndicator.size;
  const outsideIndicators = Array.from(latestByIndicator.values())
    .filter(obs => obs.status !== 'in_band').length;
  const dispersion = totalIndicators > 0 ? outsideIndicators / totalIndicators : 0;

  // Calculate hub load: weighted avg of hub indicators
  const hubObs = windowObs.filter(obs => obs.is_hub);
  const hubLoad = hubObs.length > 0 
    ? hubObs.reduce((sum, obs) => sum + Math.abs(obs.band_pos), 0) / hubObs.length
    : 0;

  // Legitimacy delta (placeholder - requires trust/participation indicators)
  const legitimacyDelta = 0;

  return {
    severity,
    persistence,
    dispersion,
    hub_load: hubLoad,
    legitimacy_delta: legitimacyDelta,
    metadata: {
      total_indicators: totalIndicators,
      outside_indicators: outsideIndicators,
      total_days: totalDays,
      outside_days: outsideDays,
      window_start: windowStart,
    },
  };
}

/**
 * Hash function for idempotency (matches SQL implementation)
 */
export async function generateObservationHash(
  sourceId: string,
  indicatorKey: string,
  timestamp: string,
  value: number
): Promise<string> {
  const input = `${sourceId}|${indicatorKey}|${timestamp}|${value}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate indicator value for basic data quality
 */
export function validateIndicatorValue(
  value: number,
  unit: string,
  previousValues: number[] = [],
  outlierSigma: number = 3
): {
  isValid: boolean;
  issues: string[];
  isOutlier: boolean;
} {
  const issues: string[] = [];
  let isValid = true;
  let isOutlier = false;

  // Basic numeric validation
  if (!Number.isFinite(value)) {
    issues.push('Value is not a finite number');
    isValid = false;
  }

  // Negative value checks for certain units
  if (value < 0 && ['days', 'rate', 'count', 'percentage'].includes(unit)) {
    issues.push(`Negative value not expected for unit: ${unit}`);
    isValid = false;
  }

  // Percentage bounds
  if (unit === 'percentage' && (value < 0 || value > 100)) {
    issues.push('Percentage value out of 0-100 range');
    isValid = false;
  }

  // Ratio bounds (often 0-2 range is reasonable)
  if (unit === 'ratio' && value < 0) {
    issues.push('Negative ratio value');
    isValid = false;
  }

  // Outlier detection using Z-score
  if (previousValues.length >= 3) {
    const mean = previousValues.reduce((a, b) => a + b, 0) / previousValues.length;
    const variance = previousValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / previousValues.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev > 0) {
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > outlierSigma) {
        isOutlier = true;
        issues.push(`Potential outlier (Z-score: ${zScore.toFixed(2)})`);
      }
    }
  }

  return { isValid, issues, isOutlier };
}

/**
 * Time series trend analysis
 */
export function analyzeTrend(values: Array<{ ts: Date; value: number }>): {
  trend: 'up' | 'down' | 'stable';
  slope: number;
  confidence: number;
} {
  if (values.length < 3) {
    return { trend: 'stable', slope: 0, confidence: 0 };
  }

  // Simple linear regression
  const n = values.length;
  const xSum = values.reduce((sum, _, i) => sum + i, 0);
  const ySum = values.reduce((sum, v) => sum + v.value, 0);
  const xySum = values.reduce((sum, v, i) => sum + i * v.value, 0);
  const x2Sum = values.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
  
  // Calculate R-squared for confidence
  const yMean = ySum / n;
  const ssRes = values.reduce((sum, v, i) => {
    const predicted = slope * i + (ySum - slope * xSum) / n;
    return sum + Math.pow(v.value - predicted, 2);
  }, 0);
  const ssTot = values.reduce((sum, v) => sum + Math.pow(v.value - yMean, 2), 0);
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  // Determine trend direction
  const threshold = 0.01; // Minimum slope to consider non-stable
  let trend: 'up' | 'down' | 'stable';
  if (Math.abs(slope) < threshold) {
    trend = 'stable';
  } else {
    trend = slope > 0 ? 'up' : 'down';
  }

  return {
    trend,
    slope,
    confidence: Math.max(0, Math.min(1, rSquared)),
  };
}