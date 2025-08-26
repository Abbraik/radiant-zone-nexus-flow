// Guardrail Engine - Safety limits and enforcement
export interface GuardrailContext {
  policy: {
    timeboxHours: number;
    dailyDeltaLimit?: number;
    coverageLimitPct?: number;
    concurrentSubstepsLimit?: number;
    renewalLimit: number;
    evaluationRequiredAfterRenewals: number;
  };
  task: { 
    taskId: string; 
    createdAt: string; 
    renewals: number;
  };
  now: string;
  attempt: {
    changeKind: 'start' | 'update' | 'publish' | 'renew' | 'close';
    deltaEstimate?: number;
    coverageEstimatePct?: number;
    substepsRequested?: number;
  };
}

export interface GuardrailRule {
  rule: string;
  message: string;
}

export type GuardrailResult = 'allow' | 'throttle' | 'block';

export interface GuardrailDecision {
  result: GuardrailResult;
  rulesFired: GuardrailRule[];
  adjusted?: { 
    deltaEstimate?: number; 
    coverageEstimatePct?: number;
    substepsRequested?: number;
  };
  evaluationMs: number;
}

export class GuardrailEngine {
  
  static evaluateGuardrails(ctx: GuardrailContext): GuardrailDecision {
    const startTime = performance.now();
    const rulesFired: GuardrailRule[] = [];
    let result: GuardrailResult = 'allow';
    let adjusted: GuardrailDecision['adjusted'] = {};

    // Rule 1: Time-box expired (hard block unless renew|close)
    const taskStart = new Date(ctx.task.createdAt);
    const now = new Date(ctx.now);
    const timeboxEndMs = taskStart.getTime() + (ctx.policy.timeboxHours * 60 * 60 * 1000);
    const isExpired = now.getTime() > timeboxEndMs;
    
    if (isExpired && !['renew', 'close'].includes(ctx.attempt.changeKind)) {
      rulesFired.push({
        rule: 'TIMEBOX_EXPIRED',
        message: `Time limit of ${ctx.policy.timeboxHours}h reached. Renewal or task closure required.`
      });
      result = 'block';
    }

    // Rule 2: Renewal limit exceeded without evaluation (hard block)
    if (ctx.attempt.changeKind === 'renew') {
      if (ctx.task.renewals >= ctx.policy.renewalLimit) {
        rulesFired.push({
          rule: 'RENEWAL_LIMIT_EXCEEDED',
          message: `Renewal limit (${ctx.policy.renewalLimit}) exceeded. Reflexive evaluation required.`
        });
        result = 'block';
      }
    }

    // Only apply throttling rules if not already blocked
    if (result !== 'block') {
      
      // Rule 3: Daily delta limit (throttle)
      if (ctx.policy.dailyDeltaLimit && ctx.attempt.deltaEstimate !== undefined) {
        if (ctx.attempt.deltaEstimate > ctx.policy.dailyDeltaLimit) {
          const throttledDelta = ctx.policy.dailyDeltaLimit;
          rulesFired.push({
            rule: 'DAILY_DELTA_LIMIT',
            message: `Delta ${(ctx.attempt.deltaEstimate * 100).toFixed(1)}% exceeds limit ${(ctx.policy.dailyDeltaLimit * 100).toFixed(1)}%. Throttled to ${(throttledDelta * 100).toFixed(1)}%.`
          });
          adjusted.deltaEstimate = throttledDelta;
          result = 'throttle';
        }
      }

      // Rule 4: Coverage limit (throttle)
      if (ctx.policy.coverageLimitPct && ctx.attempt.coverageEstimatePct !== undefined) {
        if (ctx.attempt.coverageEstimatePct > ctx.policy.coverageLimitPct) {
          const throttledCoverage = ctx.policy.coverageLimitPct;
          rulesFired.push({
            rule: 'COVERAGE_LIMIT',
            message: `Coverage ${(ctx.attempt.coverageEstimatePct * 100).toFixed(1)}% exceeds limit ${(ctx.policy.coverageLimitPct * 100).toFixed(1)}%. Throttled to ${(throttledCoverage * 100).toFixed(1)}%.`
          });
          adjusted.coverageEstimatePct = throttledCoverage;
          result = 'throttle';
        }
      }

      // Rule 5: Concurrent substeps limit (throttle)
      if (ctx.policy.concurrentSubstepsLimit && ctx.attempt.substepsRequested !== undefined) {
        if (ctx.attempt.substepsRequested > ctx.policy.concurrentSubstepsLimit) {
          const throttledSubsteps = ctx.policy.concurrentSubstepsLimit;
          rulesFired.push({
            rule: 'CONCURRENT_SUBSTEPS_LIMIT',
            message: `Requested ${ctx.attempt.substepsRequested} substeps exceeds limit ${ctx.policy.concurrentSubstepsLimit}. Throttled to ${throttledSubsteps}.`
          });
          adjusted.substepsRequested = throttledSubsteps;
          result = 'throttle';
        }
      }
    }

    const evaluationMs = Math.round(performance.now() - startTime);

    return {
      result,
      rulesFired,
      adjusted: Object.keys(adjusted).length > 0 ? adjusted : undefined,
      evaluationMs
    };
  }

  // Helper to format decision for display
  static formatDecision(decision: GuardrailDecision, isExpertMode: boolean = false): string {
    if (decision.result === 'allow') {
      return isExpertMode 
        ? `✓ ALLOW - All guardrails passed (${decision.evaluationMs}ms)`
        : '✓ Safe to proceed';
    }

    const messages = decision.rulesFired.map(rule => 
      isExpertMode ? `${rule.rule}: ${rule.message}` : rule.message
    );

    const prefix = decision.result === 'block' 
      ? (isExpertMode ? '🚫 BLOCK' : '🚫 Blocked') 
      : (isExpertMode ? '⚠️ THROTTLE' : '⚠️ Limits applied');

    const suffix = isExpertMode ? ` (${decision.evaluationMs}ms)` : '';

    return `${prefix} - ${messages.join(', ')}${suffix}`;
  }

  // Get time remaining in timebox
  static getTimeboxStatus(taskCreatedAt: string, timeboxHours: number, now?: string): {
    remaining: string;
    isExpired: boolean;
    expiresAt: string;
  } {
    const taskStart = new Date(taskCreatedAt);
    const currentTime = new Date(now || new Date().toISOString());
    const timeboxEndMs = taskStart.getTime() + (timeboxHours * 60 * 60 * 1000);
    const expiresAt = new Date(timeboxEndMs).toISOString();
    const isExpired = currentTime.getTime() > timeboxEndMs;
    
    if (isExpired) {
      return { remaining: 'EXPIRED', isExpired: true, expiresAt };
    }

    const remainingMs = timeboxEndMs - currentTime.getTime();
    const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
    const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    
    let remaining: string;
    if (remainingHours > 24) {
      const days = Math.floor(remainingHours / 24);
      remaining = `${days}d ${remainingHours % 24}h`;
    } else if (remainingHours > 0) {
      remaining = `${remainingHours}h ${remainingMinutes}m`;
    } else {
      remaining = `${remainingMinutes}m`;
    }

    return { remaining, isExpired: false, expiresAt };
  }
}

// Dictionary keys for internationalization
export const GUARDRAIL_DICT_KEYS = {
  TIMEBOX_EXPIRED: 'GUARDRAIL.TIMEBOX_EXPIRED',
  RENEWAL_LIMIT_EXCEEDED: 'GUARDRAIL.RENEWAL_LIMIT_EXCEEDED', 
  DAILY_DELTA_LIMIT: 'GUARDRAIL.DAILY_DELTA_LIMIT',
  COVERAGE_LIMIT: 'GUARDRAIL.COVERAGE_LIMIT',
  CONCURRENT_SUBSTEPS_LIMIT: 'GUARDRAIL.CONCURRENT_SUBSTEPS_LIMIT',
  BAND_BREACH: 'GUARDRAIL.BAND_BREACH'
} as const;