# PAGS Production Cutover - Day of Execution

## Pre-Cutover (T-60 to T-0)

### T-60min: Final Preparation
- [ ] War room channel active (#pags-cutover)
- [ ] On-call team briefed and standing by
- [ ] Monitoring dashboards open and validated
- [ ] Rollback procedures reviewed by team
- [ ] Customer communication prepared (if needed)
- [ ] Shadow mode results final review completed

### T-30min: System Verification
- [ ] All monitoring systems operational
- [ ] Database connections healthy
- [ ] Materialized views refreshed recently (< 5min ago)
- [ ] Feature flag service responsive
- [ ] Load balancer health checks passing
- [ ] Synthetic monitors green

### T-15min: Environment Setup
- [ ] Feature flags set to shadow mode + canary ready
```bash
export VITE_SHADOW_MODE=false
export VITE_CANARY_PERCENTAGE=10
export VITE_USE_CAPACITY_BRAIN=true
export VITE_USE_GUARDRAILS_V2=true
export VITE_USE_NCF_COMPASS_OVERLAYS=true
```
- [ ] Publish gates set to enforced=false (initially)
- [ ] Alert thresholds adjusted for cutover
- [ ] Backup monitoring activated

### T-5min: Final Checks
- [ ] No active incidents or issues
- [ ] Team ready at stations
- [ ] Communication channels open
- [ ] Heartbeat synthetic tests passing
- [ ] Database performance nominal

## Cutover Execution (T-0 to T+60)

### T+0: Begin 10% Canary
**Action**: Enable 10% traffic to new stack
```bash
# Update feature flags
curl -X POST "${FEATURE_FLAG_API}/flags/canary-percentage" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{"value": 10}'
```

**Immediately Monitor**:
- [ ] Error rate < 0.5%
- [ ] P95 latency within SLO
- [ ] No spike in 5xx responses
- [ ] Task creation success rate > 99%
- [ ] Brain activation latency < 150ms P95

**Checkpoint T+15min**:
- [ ] Metrics stable for 15 minutes
- [ ] No user-reported issues
- [ ] Queue depths normal
- [ ] MV refresh continuing normally
- [ ] No anomalous patterns in logs

### T+15: Expand to 50% Canary
**Action**: Increase traffic split
```bash
curl -X POST "${FEATURE_FLAG_API}/flags/canary-percentage" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{"value": 50}'
```

**Monitor for 30 minutes**:
- [ ] All SLOs maintained
- [ ] Compass overlay performance acceptable
- [ ] Guardrails functioning (20-30% throttling rate)
- [ ] No database performance degradation
- [ ] Task deduplication working (>60% hit rate)

**Checkpoint T+45min**:
- [ ] System stable under 50% load
- [ ] User experience metrics normal
- [ ] Background job queues healthy
- [ ] NCF Compass overlays rendering correctly
- [ ] Consent/Coherence gate computations accurate

### T+45: Full Cutover (100%)
**Action**: Direct all traffic to new stack
```bash
curl -X POST "${FEATURE_FLAG_API}/flags/canary-percentage" \
  -H "Authorization: Bearer ${API_KEY}" \
  -d '{"value": 100}'
```

**Monitor intensively for 60 minutes**:
- [ ] All systems green
- [ ] Full user load handled successfully
- [ ] No rollback triggers activated
- [ ] Performance within expected parameters
- [ ] User-facing features working correctly

## Post-Cutover (T+60 to T+180)

### T+60: Enable Publishing Gates
**Action**: Activate enforcement of Consent/Coherence gates
```bash
export VITE_ENFORCE_CONSENT_GATE=true
export VITE_ENFORCE_COHERENCE_CHECK=true
```

**Verify**:
- [ ] Deliberative publish flow includes consent gate
- [ ] Structural publish flow includes coherence check
- [ ] Override mechanisms working for authorized users
- [ ] Gate blocking working as designed
- [ ] Documentation and user guidance accessible

### T+90: System Optimization
- [ ] Review performance metrics for tuning opportunities
- [ ] Adjust cache TTLs if needed
- [ ] Optimize materialized view refresh schedule if needed
- [ ] Review and adjust alert thresholds based on actual performance
- [ ] Document any required configuration changes

### T+120: Monitoring Validation
- [ ] All SLO dashboards showing green
- [ ] Alert rules firing appropriately (test with controlled spike)
- [ ] Log aggregation capturing all events
- [ ] Synthetic monitoring covering critical paths
- [ ] Performance baselines updated with production data

### T+180: Hypercare Begin
**Action**: Transition to 72-hour hypercare period
- [ ] Enhanced monitoring activated
- [ ] Daily team sync scheduled
- [ ] User feedback channels monitored
- [ ] Performance tuning backlog reviewed
- [ ] Documentation updated with any learnings

## Health Gates & Rollback Triggers

### Automatic Rollback Triggers
- **Error Rate**: > 1% for 10 minutes
- **Latency**: P95 > 200% of SLO for 15 minutes  
- **Availability**: < 99% for any core endpoint for 10 minutes
- **Database**: Connection pool exhaustion or deadlock spike
- **Queue Depth**: Any queue > 500 items for 15 minutes

### Manual Rollback Considerations
- User-reported functionality regressions
- Data corruption or inconsistencies detected
- Security concerns identified
- External dependency failures affecting core features
- Team consensus that risk exceeds tolerance

### Rollback Execution (if needed)
```bash
# Immediate rollback - disable all new features
export VITE_USE_CAPACITY_BRAIN=false
export VITE_USE_GUARDRAILS_V2=false
export VITE_USE_NCF_COMPASS_OVERLAYS=false
export VITE_READONLY_MODE=true
export VITE_CANARY_PERCENTAGE=0

# Redirect to legacy workspace
export VITE_LEGACY_WORKSPACE_MODE=true
```

## Communication Plan

### Internal Updates (Every 30min during cutover)
**Channel**: #pags-cutover
**Template**:
```
🟢 PAGS Cutover Update [T+XXmin]
Status: [On Track/Issue/Resolved]
Traffic: [10%/50%/100%]
Key Metrics: Error rate X.X%, P95 latency XXXms
Issues: [None/Description]
Next checkpoint: [Time]
```

### External Communication (if needed)
**Channel**: Status page, user notifications
**Template**:
```
We are currently deploying new features to improve performance and capabilities. 
Users may experience brief loading delays during this maintenance window.
Expected completion: [Time]
```

### Escalation Communication
**Trigger**: Any rollback or major issue
**Recipients**: Engineering Manager, Product Owner, CTO
**Template**:
```
🚨 PAGS Cutover Issue
Problem: [Description]
Impact: [User impact]
Action: [Rollback/Mitigation in progress]
ETA: [Resolution time]
War room: #pags-cutover
```

## Success Criteria

### Technical Success
- [ ] All SLOs met for 2+ hours after full cutover
- [ ] No data corruption or loss
- [ ] All core features functional
- [ ] Performance within expected parameters
- [ ] Security controls effective

### Business Success  
- [ ] User experience maintained or improved
- [ ] No major user-reported issues
- [ ] New features accessible and functional
- [ ] Publishing workflows operational
- [ ] Compliance requirements met

### Operational Success
- [ ] Team executed plan without major issues
- [ ] Monitoring and alerting effective
- [ ] Rollback procedures validated (even if not used)
- [ ] Documentation accurate and helpful
- [ ] Knowledge transfer successful

## Post-Cutover Actions

1. **Immediate (< 2 hours)**:
   - Update status page to "All Systems Operational"
   - Send success notification to stakeholders
   - Begin hypercare monitoring period
   - Schedule team retrospective

2. **Within 24 hours**:
   - Performance analysis and optimization recommendations
   - User feedback collection and analysis
   - Documentation updates based on actual experience
   - Alert threshold tuning based on production data

3. **Within 1 week**:
   - Cutover retrospective completed
   - Lessons learned documented
   - Process improvements identified
   - Next deployment procedures updated

---

**Cutover Lead**: [Name]
**Database Lead**: [Name]  
**Monitoring Lead**: [Name]
**Product Lead**: [Name]

**Emergency Contact**: [Phone] (for critical issues only)
**War Room**: #pags-cutover (Slack)
**Status Page**: [URL]