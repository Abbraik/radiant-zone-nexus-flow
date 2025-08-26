// Enhanced Supabase Service with Logging, Validation, and Error Handling
import * as baseSupabaseService from './supabase/index';
import { serviceMonitor } from './service-monitor';
import { validateServiceImplementation, transformTaskData } from './service-interface';
import type { EnhancedTask5C, Capacity5C } from '../types';

// Enhanced service wrapper with comprehensive logging and monitoring
const createEnhancedMethod = <T extends keyof typeof baseSupabaseService>(methodName: T) => {
  return async (...args: Parameters<typeof baseSupabaseService[T]>) => {
    const startTime = Date.now();
    
    try {
      console.log(`[5C Enhanced Service] ${String(methodName)} called with:`, args);
      
      // @ts-ignore - TypeScript struggles with dynamic method calls
      const result = await baseSupabaseService[methodName](...args);
      
      const duration = Date.now() - startTime;
      console.log(`[5C Enhanced Service] ${String(methodName)} completed in ${duration}ms`);
      
      // Transform and validate result for task operations
      if (methodName.includes('Task') && result) {
        if (Array.isArray(result)) {
          return result.map(transformTaskData);
        } else if (typeof result === 'object') {
          return transformTaskData(result);
        }
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[5C Enhanced Service] ${String(methodName)} failed after ${duration}ms:`, error);
      
      // Update service health status
      await serviceMonitor.checkSupabaseHealth();
      
      throw error;
    }
  };
};

// Validate the base service implements the required interface
if (!validateServiceImplementation(baseSupabaseService)) {
  console.error('[5C Enhanced Service] Base Supabase service does not implement required interface');
}

// Enhanced service with all methods wrapped
export const getTask5CById = createEnhancedMethod('getTask5CById');
export const getTasks5C = createEnhancedMethod('getTasks5C');
export const createTask5C = createEnhancedMethod('createTask5C');
export const updateTask5C = createEnhancedMethod('updateTask5C');
export const getClaims5C = createEnhancedMethod('getClaims5C');
export const createClaim5C = createEnhancedMethod('createClaim5C');
export const updateClaim5C = createEnhancedMethod('updateClaim5C');
export const getTRIEvents5C = createEnhancedMethod('getTRIEvents5C');
export const createTRIEvent5C = createEnhancedMethod('createTRIEvent5C');
export const getScorecard5C = createEnhancedMethod('getScorecard5C');
export const updateScorecard5C = createEnhancedMethod('updateScorecard5C');
export const getDEBands5C = createEnhancedMethod('getDEBands5C');
export const createDEBand5C = createEnhancedMethod('createDEBand5C');
export const getSRTWindows5C = createEnhancedMethod('getSRTWindows5C');
export const createSRTWindow5C = createEnhancedMethod('createSRTWindow5C');
export const getReflexMemory5C = createEnhancedMethod('getReflexMemory5C');
export const createReflexMemory5C = createEnhancedMethod('createReflexMemory5C');
export const getMandateRules5C = createEnhancedMethod('getMandateRules5C');
export const checkMandate5C = createEnhancedMethod('checkMandate5C');
export const switchMode5C = createEnhancedMethod('switchMode5C');

// Additional enhanced methods for debugging
export const debugServiceHealth = async () => {
  return await serviceMonitor.performHealthChecks();
};

export const validateTaskData = async (): Promise<{ isValid: boolean; issues: string[] }> => {
  try {
    const tasks = await getTasks5C();
    const issues: string[] = [];
    
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      issues.push('No tasks found in database');
    } else {
      console.log(`[5C Debug] Found ${tasks.length} tasks in database`);
      tasks.slice(0, 3).forEach((task, idx) => {
        console.log(`[5C Debug] Task ${idx + 1}:`, {
          id: task.id,
          title: task.title,
          capacity: task.capacity,
          status: task.status
        });
      });
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [`Failed to validate task data: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
};