// Workspace 5C Service Router - Routes to Supabase or Mock based on flag
// For now, default to mock service for development
const SUPABASE_LIVE = import.meta.env.VITE_SUPABASE_LIVE === 'true' || false;

// Import both service implementations
import * as supabaseService from './supabase';
import * as mockService from './mock';

// Export the appropriate service based on flag
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
} = SUPABASE_LIVE ? supabaseService : mockService;