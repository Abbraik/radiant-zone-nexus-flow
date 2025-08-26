// Supabase 5C Services - Fallback to mock for now until database tables are created
import * as mockService from './mock';

// Re-export all mock services for now - will be replaced with real Supabase implementation later
export const getTasks5C = mockService.getTasks5C;
export const getTask5CById = mockService.getTask5CById;
export const createTask5C = mockService.createTask5C;
export const updateTask5C = mockService.updateTask5C;
export const getClaims5C = mockService.getClaims5C;
export const createClaim5C = mockService.createClaim5C;
export const updateClaim5C = mockService.updateClaim5C;
export const getTRIEvents5C = mockService.getTRIEvents5C;
export const createTRIEvent5C = mockService.createTRIEvent5C;
export const getScorecard5C = mockService.getScorecard5C;
export const updateScorecard5C = mockService.updateScorecard5C;
export const getDEBands5C = mockService.getDEBands5C;
export const createDEBand5C = mockService.createDEBand5C;
export const getSRTWindows5C = mockService.getSRTWindows5C;
export const createSRTWindow5C = mockService.createSRTWindow5C;
export const getReflexMemory5C = mockService.getReflexMemory5C;
export const createReflexMemory5C = mockService.createReflexMemory5C;
export const getMandateRules5C = mockService.getMandateRules5C;
export const checkMandate5C = mockService.checkMandate5C;
export const switchMode5C = mockService.switchMode5C;