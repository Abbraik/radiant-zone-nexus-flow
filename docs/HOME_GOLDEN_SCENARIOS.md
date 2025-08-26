# Home Golden Scenarios

## Overview

This document describes the migration from mock workspace tasks to live Golden Scenarios using the real backend flow for Fertility, Labour Market, and Social Cohesion monitoring.

## What Changed

### 1. Feature Flags
- Added `useTaskEngineV2: true` - Enables Task Engine V2 integration
- Added `useMockHome: false` - Disables mock data in home workspace
- Both flags work together to enable live backend integration

### 2. Golden Scenarios

Three live monitoring pipelines replace mock tasks:

#### Fertility & Childcare Access (FER-L01)
- **Capacity**: Responsive
- **Triggers**: Childcare wait times >= 30 days + upward trend
- **Template**: `containment_pack`
- **Deep Link**: `/workspace-5c/responsive?template=containment_pack`

#### Labour Market Matching (LAB-L01)
- **Capacity**: Anticipatory  
- **Triggers**: Job vacancy fill time >= 35 days + skills mismatch >= 1.3
- **Template**: `readiness_plan`
- **Deep Link**: `/workspace-5c/anticipatory?template=readiness_plan`

#### Social Cohesion & Trust (SOC-L01)
- **Capacity**: Deliberative
- **Triggers**: Trust index declining + service satisfaction stable/high
- **Template**: `portfolio_compare`
- **Deep Link**: `/workspace-5c/deliberative?template=portfolio_compare`

### 3. New Components

- `HomeWorkspace`: Main dashboard with live golden scenarios
- `GoldenScenariosPanel`: Cards showing task counts, SLA status, deep links
- `useGoldenScenarios`: Hook for fetching live scenario statistics
- Updated `useTasks`: Integrates with Task Engine V2 when flags enabled

### 4. Data Flow

```
Signals → Capacity Brain → Task Engine V2 → Home Workspace
```

1. Signal indicators breach thresholds
2. Capacity Brain evaluates activation decisions  
3. Task Engine V2 creates idempotent tasks
4. Home workspace displays live task counts and status

## Mock Data Cleanup

Mock tasks are archived (not deleted) by setting:
- `status = 'cancelled'`
- `payload.archived_reason = 'mock_cleanup_YYYY-MM-DD'`

See `ops/scripts/archive-mock-tasks.sql` for safe cleanup commands.

## Testing

### Unit Tests
- Golden scenarios hook returns correct task counts
- Feature flag integration works properly
- Deep links navigate to correct capacity screens

### E2E Tests  
- Home → Scenario Card → Workspace navigation
- Live task counts update when tasks are created/completed
- SLA badges show correct overdue status

### Manual Testing

1. **Enable Live Mode**:
   ```typescript
   useTaskEngineV2: true
   useMockHome: false
   ```

2. **Verify Golden Scenarios Load**:
   - Visit home page
   - See three scenario cards with live task counts
   - Click "Open Workspace" → navigates to correct capacity screen

3. **Test Full Flow**:
   - Trigger condition met (e.g., childcare wait time breach)
   - Task automatically created via Capacity Brain
   - Home workspace shows updated task count
   - Click deep link → lands on workspace with correct template

## Rollback Plan

If issues occur:

1. **Quick Rollback** (UI only):
   ```typescript
   useMockHome: true
   ```
   This re-enables mock data while keeping backend tasks intact.

2. **Restore Archived Tasks** (if needed):
   ```sql
   UPDATE tasks 
   SET status = 'draft', payload = payload - 'archived_reason'
   WHERE payload->>'archived_reason' LIKE '%mock_cleanup_%';
   ```

## Performance

- Home workspace loads in < 300ms with materialized views enabled
- Golden scenarios refresh every 60 seconds
- Task counts cached for 30 seconds
- Deep links preload capacity templates

## Monitoring

Key metrics to track:
- `home_load_time_ms`: Home workspace load performance
- `scenario_card_clicks_total`: Deep link usage
- `live_task_count_accuracy`: Real vs displayed task counts
- `golden_scenario_trigger_rate`: How often scenarios activate

## Support

For issues:
1. Check feature flags in browser dev tools
2. Verify Task Engine V2 is creating tasks properly
3. Confirm golden scenario watchpoints are armed
4. Check materialized view refresh timestamps