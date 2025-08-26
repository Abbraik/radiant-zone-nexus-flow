# PAGS Production Incident Runbooks

## Emergency Contacts

- **Primary On-Call (App)**: [Slack: @pags-oncall-app]
- **Secondary On-Call (DB)**: [Slack: @pags-oncall-db]  
- **Tertiary On-Call (Data)**: [Slack: @pags-oncall-data]

**Escalation Path**: Primary (15min) → Secondary (30min) → Tertiary (45min) → Engineering Manager

## Rollback Procedures

### Emergency Rollback
```bash
# 1. Disable all new features
export VITE_USE_CAPACITY_BRAIN=false
export VITE_USE_GUARDRAILS_V2=false  
export VITE_USE_NCF_COMPASS_OVERLAYS=false

# 2. Enable readonly mode
export VITE_READONLY_MODE=true

# 3. Pause triggers 
export VITE_PAUSE_TRIGGERS=true

# 4. Revert to legacy workspace
# Update feature flags in production deployment
```

### Database Rollback
```sql
-- Emergency disable of materialized views
-- Only if severe performance issues
DROP MATERIALIZED VIEW IF EXISTS mv_indicator_latest CASCADE;
DROP MATERIALIZED VIEW IF EXISTS mv_loop_signals_summary CASCADE; 
DROP MATERIALIZED VIEW IF EXISTS mv_tasks_inbox CASCADE;
```

## Incident Response Playbooks

### 1. Activation Spike (High Load)

**Symptoms**: Brain activation latency > 300ms P99, activation queue depth > 50

**Immediate Actions**:
1. Check dedupe hit rate: `SELECT COUNT(*) FROM tasks WHERE fingerprint IS NOT NULL AND created_at > NOW() - INTERVAL '1 hour' GROUP BY fingerprint HAVING COUNT(*) > 1`
2. Enable deduplication if disabled: `VITE_ACTIVATION_DEDUPE_ENABLED=true`
3. Check guardrail block rate: Should be 20-30% under load
4. Enable activation throttling: `VITE_ACTIVATION_THROTTLE_ENABLED=true`

**Diagnostics**:
```bash
# Check brain activation metrics
curl -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/api/metrics/brain-activations?last=1h"

# Check for duplicate tasks
psql -c "SELECT fingerprint, COUNT(*) FROM tasks 
         WHERE created_at > NOW() - INTERVAL '1 hour' 
         GROUP BY fingerprint HAVING COUNT(*) > 1 LIMIT 10"
```

**Resolution Criteria**: P95 latency < 150ms, dedupe hit rate > 60%

### 2. Ingestion Lag (Data Pipeline)

**Symptoms**: `mv_last_refresh_timestamp` age > 5 minutes, DQ bad sources > 2

**Immediate Actions**:
1. Pause trigger evaluation: `VITE_PAUSE_TRIGGERS=true`
2. Check ingestion queue depth: `SELECT COUNT(*) FROM raw_observations WHERE created_at > NOW() - INTERVAL '10 minutes'`
3. Mark affected indicators as bad quality: `UPDATE dq_status SET quality='bad' WHERE staleness_seconds > 600`
4. Create Data Triage tasks for affected loops

**Diagnostics**:
```sql
-- Check ingestion lag by source
SELECT source_id, COUNT(*), MAX(created_at), MIN(created_at)
FROM raw_observations 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY source_id ORDER BY COUNT(*) DESC;

-- Check materialized view refresh status  
SELECT viewname, last_refresh 
FROM pg_stat_user_tables 
WHERE schemaname = 'public' AND viewname LIKE 'mv_%';
```

**Resolution**: Resume triggers once lag < 2 minutes, mark sources as good quality

### 3. Materialized View Stuck

**Symptoms**: MV refresh age > 10x normal schedule, query latency spike

**Immediate Actions**:
1. Check for lock conflicts: `SELECT * FROM pg_stat_activity WHERE state = 'active' AND query LIKE '%REFRESH%'`
2. Force concurrent refresh: `REFRESH MATERIALIZED VIEW CONCURRENTLY mv_indicator_latest`
3. If stuck, enable fallback to raw queries: `VITE_USE_RAW_QUERIES_FALLBACK=true`
4. Consider non-concurrent refresh as last resort

**Diagnostics**:
```sql
-- Check MV sizes and index status
SELECT schemaname, matviewname, matviewsize 
FROM pg_matviews WHERE schemaname = 'public';

-- Check for blocking queries
SELECT pid, state, query, query_start 
FROM pg_stat_activity 
WHERE state = 'active' AND query LIKE '%materialized%';
```

### 4. Conformance Runner Failures

**Symptoms**: Conformance pass rate < 50%, dossier publish failures

**Immediate Actions**:
1. Switch to mock endpoints: `VITE_CONFORMANCE_MOCK_MODE=true`
2. Check failed dossiers: `SELECT * FROM conformance_runs WHERE status = 'failed' ORDER BY started_at DESC LIMIT 10`
3. Log exceptions against specific dossiers
4. Disable conformance checks if critical: `VITE_CONFORMANCE_CHECKS_ENABLED=false`

**Diagnostics**:
```bash
# Check conformance runner logs
curl -H "Authorization: Bearer $SERVICE_KEY" \
  "$SUPABASE_URL/functions/v1/struct-conformance-runner" \
  -d '{"dossier_id": "test"}'

# Check endpoint availability
curl -I https://external-conformance-api.example.com/health
```

### 5. NCF Compass Overlays Issues

**Symptoms**: Compass summary calls timing out, consent gate failures

**Immediate Actions**:
1. Disable compass overlays: `VITE_USE_NCF_COMPASS_OVERLAYS=false`
2. Check consent data freshness: `SELECT MAX(as_of) FROM consent_cells`
3. Bypass consent gates if critical: `VITE_ENFORCE_CONSENT_GATE=false` (manager approval required)
4. Fall back to cached compass data

**Diagnostics**:
```sql
-- Check compass computation performance
SELECT loop_id, COUNT(*), AVG(ci), MAX(created_at)
FROM compass_snapshots 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY loop_id;

-- Check consent cell coverage
SELECT region, domain, COUNT(*) 
FROM consent_cells 
WHERE as_of > CURRENT_DATE - 7
GROUP BY region, domain;
```

## Communications Templates

### Internal Status Update
```
🚨 PAGS Incident: [TITLE]
Status: [INVESTIGATING/IDENTIFIED/MONITORING/RESOLVED]
Impact: [User-facing impact description]
ETA: [Resolution estimate]
Actions: [Current mitigation steps]
Next Update: [Time]
```

### Public Status (for Open Status dossier)
```
We are experiencing [brief description] affecting [affected services]. 
Our team is actively working on a resolution. 
Current workaround: [if available]
Updates: status.example.com
```

## Post-Incident Process

1. **Immediate (< 2h)**: Timeline documented, root cause identified
2. **24h**: Draft incident report with 5 Whys analysis  
3. **72h**: Final report published, action items assigned
4. **Follow-up**: Preventive measures implemented, runbooks updated

## Health Checks & Synthetic Monitoring

### Heartbeat Endpoints
```bash
# Brain activation health
curl $BASE_URL/api/health/brain-activate

# Task system health  
curl $BASE_URL/api/health/task-system

# Compass overlay health
curl $BASE_URL/api/health/compass

# Expected: HTTP 200 with {"status": "healthy", "timestamp": "..."}
```

### Critical Path Synthetic Tests
Run every 5 minutes:
1. Create responsive task → claim → complete (E2E: <30s)
2. Brain activation with golden path data (latency: <150ms)
3. Compass summary for active loop (latency: <180ms)
4. Consent gate check (pass/fail determined correctly)

## Feature Flag Emergency Toggles

| Flag | Purpose | Emergency Setting |
|------|---------|-------------------|
| `readonlyMode` | Disable all writes | `true` |
| `pauseTriggers` | Stop trigger evaluation | `true` |
| `blockAutoOnDQ` | Block automation on bad data | `true` |
| `useRawQueriesFallback` | Bypass MVs | `true` |
| `conformanceMockMode` | Use mock conformance | `true` |
| `activationThrottleEnabled` | Throttle high load | `true` |

## Monitoring & Alerting Setup

### Critical Alerts (PagerDuty)
- Core endpoint availability < 99.5% (5min window)
- P95 latency > SLO (5min window)  
- Trigger queue depth > 100 (10min window)
- MV refresh age > 5x schedule
- DQ bad sources ≥ 2 for golden paths

### Warning Alerts (Slack)
- Error rate > 0.1% (10min window)
- Task dedupe hit rate < 40%
- Compass overlays error rate > 1%
- Conformance pass rate < 80%

### Dashboard Links
- **SLO Dashboard**: [Grafana/monitoring-url]
- **Error Tracking**: [Sentry/error-tracking-url]  
- **Infrastructure**: [AWS CloudWatch/infra-url]
- **Database**: [Supabase Dashboard/db-url]