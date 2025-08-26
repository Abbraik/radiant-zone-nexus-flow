# 5C Service Architecture Documentation

## Overview

The 5C Workspace uses a robust, future-proof service architecture designed to handle Task Engine V2 and Capacity Brain integration seamlessly. This document outlines the architecture and provides guidelines for future backend modifications.

## Service Layer Structure

### Core Files

1. **`src/5c/services/index.ts`** - Main service router
   - Routes requests to appropriate service (Supabase vs Mock)
   - Environment-based service selection
   - Comprehensive logging and health monitoring

2. **`src/5c/services/supabase/index.ts`** - Real Supabase implementation
   - Direct integration with `tasks_5c` and related 5C tables
   - Proper data transformation and validation
   - Error handling and type safety

3. **`src/5c/services/service-monitor.ts`** - Health monitoring
   - Service availability checks
   - Performance monitoring
   - Error tracking and reporting

4. **`src/5c/services/service-interface.ts`** - Unified interface
   - Standardized service contracts
   - Fallback mechanisms
   - Data validation utilities

## Architecture Benefits

### 1. **Environment-Based Selection**
- Development: Can easily switch between mock and real data
- Production: Reliable Supabase integration
- Clear logging indicates which service is active

### 2. **Health Monitoring**
- Real-time service status tracking
- Performance metrics (latency, errors)
- Proactive issue detection

### 3. **Fallback Mechanisms**
- Automatic fallback to mock data if Supabase fails
- Graceful degradation of service
- User experience preservation

### 4. **Future-Proof Design**
- Standardized interface for all services
- Easy to add new backend integrations
- Consistent data transformation layer

## Integration Guidelines

### Adding New Backend Services

1. **Create Service Implementation**
   ```typescript
   // src/5c/services/new-backend.ts
   export const getTasks5C = async (filters?: any) => {
     // Implementation
   };
   // ... other required methods
   ```

2. **Update Service Router**
   ```typescript
   // src/5c/services/index.ts
   import * as newBackendService from './new-backend';
   
   const activeService = USE_NEW_BACKEND ? newBackendService : supabaseService;
   ```

3. **Add Health Checks**
   ```typescript
   // src/5c/services/service-monitor.ts
   async checkNewBackendHealth(): Promise<ServiceHealth> {
     // Health check implementation
   }
   ```

### Backend Modification Checklist

- [ ] Update service implementation in `supabase/index.ts`
- [ ] Test with service monitor health checks
- [ ] Verify data transformation consistency
- [ ] Check fallback behavior
- [ ] Update documentation

## Troubleshooting

### Golden Scenario Tasks Not Appearing

1. Check service router logs in browser console
2. Verify database connection via ServiceStatus component
3. Ensure RLS policies allow data access
4. Validate service health status

### Service Performance Issues

1. Monitor service latency via health checks
2. Check database query performance
3. Verify proper data transformation
4. Review error logs for patterns

## Service Status Component

Use the `ServiceStatus` component to monitor real-time service health:

```tsx
import { ServiceStatus } from '@/5c/components/ServiceStatus';

// Add to any 5C workspace component
<ServiceStatus />
```

## Environment Variables

- `import.meta.env.DEV` - Development mode detection
- No VITE_ variables needed (not supported by Lovable)

## Best Practices

1. **Always log service operations** for debugging
2. **Validate data** at service boundaries
3. **Handle errors gracefully** with fallbacks
4. **Monitor performance** continuously
5. **Document changes** for future developers

## Future Enhancements

- [ ] Implement service caching layer
- [ ] Add retry mechanisms for failed requests
- [ ] Create service analytics dashboard
- [ ] Implement A/B testing for service selection
- [ ] Add service performance alerts
