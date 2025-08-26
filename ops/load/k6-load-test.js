import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const activationLatency = new Trend('activation_latency');
const taskCreateLatency = new Trend('task_create_latency');
const signalsLatency = new Trend('signals_latency');
const compassLatency = new Trend('compass_latency');

// Test configuration
export const options = {
  scenarios: {
    // Browse & Decide scenario
    browse_decide: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 200 },
        { duration: '10m', target: 200 },
        { duration: '2m', target: 500 }, // Spike test
        { duration: '1m', target: 500 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 0 },
      ],
      exec: 'browseAndDecide',
    },
    
    // Task Operations scenario
    task_ops: {
      executor: 'constant-rate',
      rate: 30,
      timeUnit: '1s',
      duration: '25m',
      preAllocatedVUs: 20,
      maxVUs: 50,
      exec: 'taskOperations',
    },
    
    // Anticipatory Burst scenario
    anticipatory_burst: {
      executor: 'constant-arrival-rate',
      rate: 200,
      timeUnit: '1m',
      duration: '5m',
      preAllocatedVUs: 10,
      maxVUs: 30,
      exec: 'anticipatoryBurst',
      startTime: '5m',
    },

    // Guardrails scenario
    guardrails_test: {
      executor: 'constant-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '15m',
      preAllocatedVUs: 5,
      maxVUs: 15,
      exec: 'guardrailsTest',
      startTime: '10m',
    }
  },
  
  thresholds: {
    'errors': ['rate<0.005'], // <0.5% error rate
    'activation_latency': ['p(95)<150', 'p(99)<300'],
    'task_create_latency': ['p(95)<200'],
    'signals_latency': ['p(95)<120'],
    'compass_latency': ['p(95)<180'],
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.01'],
  },
};

// Test data
const LOOPS = [
  'FER-L01', 'FER-L02', 'LAB-L01', 'LAB-L02', 'SOC-L01'
];

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const API_KEY = __ENV.SUPABASE_ANON_KEY || 'your-anon-key';

const headers = {
  'Content-Type': 'application/json',
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
};

// Browse & Decide scenario
export function browseAndDecide() {
  const loopCode = LOOPS[Math.floor(Math.random() * LOOPS.length)];
  
  // 1. Browse loops
  let response = http.get(`${BASE_URL}/api/loops`, { headers });
  check(response, {
    'loops list status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  sleep(0.5);
  
  // 2. Get signals summary
  const start = Date.now();
  response = http.post(`${BASE_URL}/api/signals/loop/${loopCode}/summary`, {}, { headers });
  const signalsDuration = Date.now() - start;
  signalsLatency.add(signalsDuration);
  
  check(response, {
    'signals summary status is 200': (r) => r.status === 200,
    'signals summary has data': (r) => r.json('severity') !== undefined,
  }) || errorRate.add(1);
  
  sleep(0.3);
  
  // 3. Brain activate (read-only in shadow mode)
  const activateStart = Date.now();
  response = http.post(`${BASE_URL}/api/brain/activate`, {
    loopCode,
    indicator: 'test_indicator',
    signals: {
      severity: 0.6,
      persistence: 0.4,
      dispersion: 0.3,
      hubLoad: 0.2,
      legitimacyDelta: 0.1
    },
    hints: { capacity: 'responsive' }
  }, { headers });
  const activateDuration = Date.now() - start;
  activationLatency.add(activateDuration);
  
  check(response, {
    'brain activate status is 200': (r) => r.status === 200,
    'brain activate has decision': (r) => r.json('capacity') !== undefined,
  }) || errorRate.add(1);
  
  sleep(0.2);
  
  // 4. Compass overlay
  const compassStart = Date.now();
  response = http.get(`${BASE_URL}/api/compass/loop/${loopCode}/summary`, { headers });
  const compassDuration = Date.now() - compassStart;
  compassLatency.add(compassDuration);
  
  check(response, {
    'compass summary status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  
  sleep(1);
}

// Task Operations scenario
export function taskOperations() {
  const fingerprint = `test-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create task (idempotent)
  const createStart = Date.now();
  const response = http.post(`${BASE_URL}/api/tasks/createByFingerprint`, {
    fingerprint,
    title: 'Load Test Task',
    capacity: 'responsive',
    loopCode: LOOPS[Math.floor(Math.random() * LOOPS.length)],
    priority: 'medium'
  }, { headers });
  const createDuration = Date.now() - createStart;
  taskCreateLatency.add(createDuration);
  
  check(response, {
    'task create status is 200 or 409': (r) => r.status === 200 || r.status === 409,
  }) || errorRate.add(1);
  
  if (response.status === 200) {
    const taskId = response.json('taskId');
    
    sleep(0.1);
    
    // Update checklist
    http.patch(`${BASE_URL}/api/tasks/${taskId}/checklist`, {
      items: [{ label: 'Test item', completed: true }]
    }, { headers });
    
    sleep(0.1);
    
    // Claim/unclaim
    http.post(`${BASE_URL}/api/tasks/${taskId}/claim`, {}, { headers });
    sleep(0.1);
    http.post(`${BASE_URL}/api/tasks/${taskId}/unclaim`, {}, { headers });
  }
  
  sleep(0.5);
}

// Anticipatory Burst scenario  
export function anticipatoryBurst() {
  const response = http.post(`${BASE_URL}/api/anticipatory/evaluate`, {
    rules: Array.from({length: 10}, (_, i) => ({
      id: `rule-${i}`,
      expr: 'severity > 0.7',
      window: '1h'
    })),
    data: {
      severity: Math.random(),
      persistence: Math.random(),
      dispersion: Math.random()
    }
  }, { headers });
  
  check(response, {
    'anticipatory evaluate status is 200': (r) => r.status === 200,
    'anticipatory evaluate duration < 50ms': (r) => r.timings.duration < 50,
  }) || errorRate.add(1);
  
  sleep(0.1);
}

// Guardrails Test scenario
export function guardrailsTest() {
  const response = http.post(`${BASE_URL}/api/tasks/create`, {
    title: 'Guardrail Test Task',
    capacity: 'responsive',
    loopCode: LOOPS[Math.floor(Math.random() * LOOPS.length)],
    scope: Math.random() > 0.7 ? 'high' : 'medium', // Some high-scope to trigger throttling
    priority: 'medium'
  }, { headers });
  
  check(response, {
    'guardrail response status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    'throttled tasks < 30%': () => response.status !== 429 || Math.random() > 0.3,
    'blocked tasks < 5%': () => response.status !== 403 || Math.random() > 0.05,
  }) || errorRate.add(1);
  
  sleep(2);
}

export function setup() {
  console.log('Starting PAGS Load Test');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test loops: ${LOOPS.join(', ')}`);
}

export function teardown(data) {
  console.log('Load test completed');
  console.log('Check results for SLO compliance');
}