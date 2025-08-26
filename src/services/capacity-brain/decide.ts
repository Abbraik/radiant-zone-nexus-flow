// Pure Decision Function - Deterministic capacity activation ladder
import crypto from 'crypto';
import type { 
  ActivationInput, 
  ActivationDecision, 
  Capacity, 
  HandoffAction,
  REASON_MAPPINGS
} from './types';

// Time bucket configuration for fingerprint deduplication
const TIME_BUCKETS = {
  responsive: 7 * 24 * 60 * 60 * 1000,    // 7 days in ms
  deliberative: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms  
  structural: 7 * 24 * 60 * 60 * 1000,    // 7 days in ms
  reflexive: 14 * 24 * 60 * 60 * 1000,    // 14 days in ms
  anticipatory: 3 * 24 * 60 * 60 * 1000,  // 3 days in ms
};

// Default handoffs by capacity
const DEFAULT_HANDOFFS: Record<Capacity, HandoffAction[]> = {
  responsive: [
    { to: 'reflexive', when: 'end_of_timebox' }
  ],
  reflexive: [],
  deliberative: [
    { to: 'structural', when: 'immediate' }
  ],
  anticipatory: [
    { to: 'responsive', when: 'immediate', template: 'containment_pack' }
  ],
  structural: [
    { to: 'responsive', when: 'immediate', template: 'pilot_rollout' },
    { to: 'reflexive', when: 'review_due', template: 'post_adoption_review' }
  ],
};

// Generate deterministic fingerprint
function generateFingerprint(
  loopId: string,
  capacity: Capacity | null,
  template: string,
  reasonCodes: string[],
  window: string,
  asOf: string
): string {
  if (!capacity) {
    // Blocked decisions use special fingerprint
    return crypto.createHash('sha256')
      .update(`${loopId}|BLOCKED|${reasonCodes.sort().join(',')}|${window}`)
      .digest('hex');
  }

  const timeBucket = TIME_BUCKETS[capacity];
  const bucketedTime = Math.floor(new Date(asOf).getTime() / timeBucket) * timeBucket;
  
  const input = [
    loopId,
    capacity,
    template,
    reasonCodes.sort().join(','),
    window,
    bucketedTime.toString()
  ].join('|');

  return crypto.createHash('sha256').update(input).digest('hex');
}

// Build human rationale from reason codes
function buildRationale(reasonCodes: string[], capacity: Capacity | null, confidence: number): string {
  if (!capacity) {
    return `Automation blocked: ${reasonCodes.join(', ')}. Manual review required.`;
  }

  // Import would normally be at top, but avoiding for pure function
  const reasonMap: Record<string, string> = {
    'DQ_BLOCK': 'Data quality insufficient',
    'SEVERITY_HIGH': 'High severity detected',
    'PERSISTENCE_MID': 'Sustained breach pattern',
    'LEGITIMACY_DIVERGENCE': 'Trust-service gap',
    'FAIRNESS_RISK': 'Equity concerns flagged',
    'PERSISTENT': 'Systemic pattern detected',
    'HUB_SATURATION': 'Hub capacity exceeded',
    'EARLY_WARNING': 'Risk signals emerging',
    'REVIEW_DUE': 'Review cycle due',
    'RECENT_ACTION': 'Follow-up required'
  };

  const reasons = reasonCodes.map(code => reasonMap[code] || code).join(', ');
  const confidenceText = confidence >= 0.8 ? 'High confidence' : 
                        confidence >= 0.6 ? 'Medium confidence' : 'Low confidence';
  
  return `${capacity.charAt(0).toUpperCase() + capacity.slice(1)} capacity activated. ${reasons}. ${confidenceText}.`;
}

// Pure decision function - implements the ladder logic
export function decideActivation(input: ActivationInput): ActivationDecision {
  const { scores, readiness, hints, now } = input;
  const reasonCodes: string[] = [];
  let capacity: Capacity | null = null;
  let confidence = 0.5; // default
  let blocked = false;
  let blockReasons: string[] = [];

  // LADDER STEP 1: Data safety gate
  if (!readiness.autoOk) {
    reasonCodes.push('DQ_BLOCK');
    blocked = true;
    blockReasons = readiness.reasons;
    capacity = null;
    confidence = 0.9; // high confidence in blocking bad data
  }
  
  // LADDER STEP 2: Safety first → Responsive
  else if (scores.severity >= 1.0 || (scores.severity >= 0.7 && scores.persistence >= 0.4)) {
    reasonCodes.push('SEVERITY_HIGH');
    if (scores.persistence >= 0.4) reasonCodes.push('PERSISTENCE_MID');
    capacity = 'responsive';
    confidence = 0.9;
  }
  
  // LADDER STEP 3: Legitimacy split → Deliberative
  else if (scores.legitimacyDelta <= -0.3 || hints?.fairnessRisk) {
    if (scores.legitimacyDelta <= -0.3) reasonCodes.push('LEGITIMACY_DIVERGENCE');
    if (hints?.fairnessRisk) reasonCodes.push('FAIRNESS_RISK');
    capacity = 'deliberative';
    confidence = 0.8;
  }
  
  // LADDER STEP 4: Recurring or hub bottleneck → Structural
  else if (scores.persistence >= 0.6 || scores.hubLoad >= 0.8 || hints?.recurrenceFlag) {
    if (scores.persistence >= 0.6) reasonCodes.push('PERSISTENT');
    if (scores.hubLoad >= 0.8) reasonCodes.push('HUB_SATURATION');
    if (hints?.recurrenceFlag) reasonCodes.push('PERSISTENT');
    capacity = 'structural';
    confidence = 0.8;
  }
  
  // LADDER STEP 5: Risk warming with lead time → Anticipatory
  else if (hints?.earlyWarning && scores.severity < 0.7) {
    reasonCodes.push('EARLY_WARNING');
    capacity = 'anticipatory';
    confidence = 0.7;
  }
  
  // LADDER STEP 6: After action → Reflexive
  else if (hints?.recentAction?.reviewDue || 
          (hints?.recentAction && hints.recentAction.withinDays <= 45)) {
    if (hints.recentAction.reviewDue) reasonCodes.push('REVIEW_DUE');
    else reasonCodes.push('RECENT_ACTION');
    capacity = 'reflexive';
    confidence = 0.6;
  }
  
  // LADDER STEP 7: Default fallback → Reflexive
  else {
    reasonCodes.push('RECENT_ACTION'); // default reason
    capacity = 'reflexive';
    confidence = 0.3; // low confidence fallback
  }

  // Determine route and template based on capacity
  let openRoute = '/';
  let preselectTemplate = 'default';
  
  if (blocked) {
    openRoute = '/data-triage';
    preselectTemplate = 'dq_review';
  } else if (capacity) {
    switch (capacity) {
      case 'responsive':
        openRoute = '/workspace-5c/responsive/checkpoint';
        preselectTemplate = 'containment_pack';
        break;
      case 'reflexive':
        openRoute = '/workspace-5c/reflexive/learning';
        preselectTemplate = 'learning_review';
        break;
      case 'deliberative':
        openRoute = '/workspace-5c/deliberative/portfolio';
        preselectTemplate = 'portfolio_compare';
        break;
      case 'anticipatory':
        openRoute = '/workspace-5c/anticipatory/watchboard';
        preselectTemplate = 'readiness_plan';
        break;
      case 'structural':
        openRoute = '/workspace-5c/structural/dossier';
        preselectTemplate = 'dossier_draft';
        break;
    }
  }

  // Get default handoffs
  const handoffs = capacity ? DEFAULT_HANDOFFS[capacity] : undefined;

  // Generate fingerprint
  const fingerprint = generateFingerprint(
    scores.loopId,
    capacity,
    preselectTemplate,
    reasonCodes,
    scores.window,
    now
  );

  // Build human rationale
  const humanRationale = buildRationale(reasonCodes, capacity, confidence);

  return {
    loopId: scores.loopId,
    capacity,
    reasonCodes,
    humanRationale,
    confidence,
    openRoute,
    preselectTemplate,
    handoffs,
    blocked,
    blockReasons: blocked ? blockReasons : undefined,
    fingerprint,
  };
}