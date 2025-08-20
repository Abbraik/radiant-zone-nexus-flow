// src/services/capacity-decision.test.ts
import { describe, it, expect } from 'vitest';
import { computeCapacityDecision } from './capacity-decision';

const base = {
  loopCode: 'MES-L07',
  indicator: 'Reserve Margin',
  tstamp: '2025-08-20T10:00:00Z',
};

describe('capacity decision service', () => {
  it('picks Responsive under acute breach, fast slope, thin buffers', () => {
    const out = computeCapacityDecision({
      ...base,
      reading: {
        value: 12.8,
        band: { lower: 15, upper: 25 },
        slope: 0.7,
        bufferAdequacy: 0.3, // thin buffers → invB=0.7
        ewsProb: 0.55,
      },
    });
    expect(out.recommendedCapacities).toContain('responsive');
    expect(out.srt.cadence).toBe('daily');
  });

  it('picks Structural for chronic persistence + integral error + data penalty', () => {
    const out = computeCapacityDecision({
      loopCode: 'MAC-L04',
      indicator: 'Price-to-Income',
      tstamp: '2025-08-20T10:00:00Z',
      reading: {
        value: 7.2,
        band: { lower: 3, upper: 6 },
        persistencePk: 0.9,
        integralError: 0.8,
        dataPenalty: 0.3,
      },
    });
    expect(out.recommendedCapacities[0]).toBe('structural');
    expect(out.srt.horizon === 'P180D' || out.srt.horizon === 'P90D').toBe(true);
  });

  it('composes Anticipatory → Responsive when EWS is high with severity', () => {
    const out = computeCapacityDecision({
      ...base,
      reading: {
        value: 14.1,
        band: { lower: 15, upper: 25 },
        ewsProb: 0.85,
        slope: 0.5,
        bufferAdequacy: 0.4,
        leadTimeWeight: 0.8,
      },
    });
    expect(out.order[0]).toBe('anticipatory');
    expect(out.order).toContain('responsive');
  });

  it('adds Deliberative when legitimacy gap is high (no life-safety)', () => {
    const out = computeCapacityDecision({
      ...base,
      reading: {
        value: 13.0,
        band: { lower: 15, upper: 25 },
        legitimacyGap: 0.5,
        ewsProb: 0.2,
        slope: 0.2,
      },
      context: { lifeSafety: false },
    });
    expect(out.recommendedCapacities).toContain('deliberative');
    expect(out.consent?.transparency).toBe('pack');
  });

  it('picks Reflexive when oscillation and guardrail violation dominate', () => {
    const out = computeCapacityDecision({
      loopCode: 'META-L02',
      indicator: 'Oscillation Score',
      tstamp: '2025-08-20T10:00:00Z',
      reading: {
        value: 0.4, // irrelevant here
        band: { lower: 0, upper: 1 },
        oscillation: 0.9,
        guardrailViolation: 0.7,
        rmseRel: 0.6,
      },
    });
    expect(out.recommendedCapacities[0]).toBe('reflexive');
  });
});