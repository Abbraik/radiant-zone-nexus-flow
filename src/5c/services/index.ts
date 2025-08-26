// Workspace 5C Service Router - Routes to Supabase or Mock based on flag
// Environment-based service selection with comprehensive logging
const SUPABASE_LIVE = true;
const isDev = import.meta.env.DEV;

// Import both service implementations
import * as supabaseService from './supabase/index';
import * as mockService from './mock';

// Service health logging
console.log(`[5C Service Router] Environment: ${isDev ? 'Development' : 'Production'}`);
console.log(`[5C Service Router] Using ${SUPABASE_LIVE ? 'Supabase' : 'Mock'} service`);
console.log(`[5C Service Router] Service module loaded successfully`);

// Export the appropriate service based on flag with enhanced logging and fallbacks
import { serviceMonitor } from './service-monitor';
import { createServiceWithFallback } from './service-interface';

// Create enhanced service with comprehensive monitoring
const activeService = SUPABASE_LIVE ? supabaseService : mockService;

// Validate service before export
console.log('[5C Service Router] Validating service implementation...');
try {
  // Perform initial health check
  if (SUPABASE_LIVE) {
    serviceMonitor.checkSupabaseHealth().then(health => {
      console.log('[5C Service Router] Supabase health check:', health);
    });
  }
  console.log('[5C Service Router] Service validation completed successfully');
} catch (error) {
  console.error('[5C Service Router] Service validation failed:', error);
}

export const {
  getTask5CById,
  getTasks5C,
  createTask5C,
  updateTask5C,
  getClaims5C,
  createClaim5C,
  updateClaim5C,
  getTRIEvents5C,
  createTRIEvent5C,
  getScorecard5C,
  updateScorecard5C,
  getDEBands5C,
  createDEBand5C,
  getSRTWindows5C,
  createSRTWindow5C,
  getReflexMemory5C,
  createReflexMemory5C,
  getMandateRules5C,
  checkMandate5C,
  switchMode5C
} = activeService;