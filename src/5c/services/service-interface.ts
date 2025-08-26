// Unified Service Interface for Task Engine V2 and Capacity Brain Integration
import type {
  EnhancedTask5C,
  Claim5C,
  TRIEvent5C,
  DEBand5C,
  SRTWindow5C,
  LoopScorecard5C,
  ReflexMemory5C,
  MandateRule5C,
  Capacity5C,
  Leverage5C
} from '../types';

// Service interface that all implementations must follow
export interface Service5CInterface {
  // Task operations
  getTask5CById(id: string): Promise<EnhancedTask5C | null>;
  getTasks5C(filters?: { capacity?: Capacity5C }): Promise<EnhancedTask5C[]>;
  createTask5C(task: Partial<EnhancedTask5C>): Promise<EnhancedTask5C>;
  updateTask5C(id: string, updates: Partial<EnhancedTask5C>): Promise<EnhancedTask5C>;
  
  // Claim operations
  getClaims5C(taskId: string): Promise<Claim5C[]>;
  createClaim5C(claim: Partial<Claim5C>): Promise<Claim5C>;
  updateClaim5C(id: string, updates: Partial<Claim5C>): Promise<Claim5C>;
  
  // TRI Events
  getTRIEvents5C(loopId: string, limit?: number): Promise<TRIEvent5C[]>;
  createTRIEvent5C(event: Partial<TRIEvent5C>): Promise<TRIEvent5C>;
  
  // Scorecard operations
  getScorecard5C(loopId: string): Promise<LoopScorecard5C | null>;
  updateScorecard5C(loopId: string, updates: Partial<LoopScorecard5C>): Promise<LoopScorecard5C>;
  
  // DE Bands
  getDEBands5C(loopId: string): Promise<DEBand5C[]>;
  createDEBand5C(band: Partial<DEBand5C>): Promise<DEBand5C>;
  
  // SRT Windows
  getSRTWindows5C(loopId: string): Promise<SRTWindow5C[]>;
  createSRTWindow5C(window: Partial<SRTWindow5C>): Promise<SRTWindow5C>;
  
  // Reflex Memory
  getReflexMemory5C(loopId: string): Promise<ReflexMemory5C[]>;
  createReflexMemory5C(memory: Partial<ReflexMemory5C>): Promise<ReflexMemory5C>;
  
  // Mandate Rules
  getMandateRules5C(): Promise<MandateRule5C[]>;
  checkMandate5C(actor: string, leverage: Leverage5C): Promise<'allowed' | 'warning_required' | 'blocked'>;
  
  // Mode switching
  switchMode5C(fromTaskId: string, toCapacity: Capacity5C, rationale: string): Promise<EnhancedTask5C>;
}

// Service validation utility
export const validateServiceImplementation = (service: any): service is Service5CInterface => {
  const requiredMethods = [
    'getTask5CById', 'getTasks5C', 'createTask5C', 'updateTask5C',
    'getClaims5C', 'createClaim5C', 'updateClaim5C',
    'getTRIEvents5C', 'createTRIEvent5C',
    'getScorecard5C', 'updateScorecard5C',
    'getDEBands5C', 'createDEBand5C',
    'getSRTWindows5C', 'createSRTWindow5C',
    'getReflexMemory5C', 'createReflexMemory5C',
    'getMandateRules5C', 'checkMandate5C',
    'switchMode5C'
  ];
  
  return requiredMethods.every(method => typeof service[method] === 'function');
};

// Data transformation layer for consistent format
export const transformTaskData = (rawTask: any): EnhancedTask5C => {
  return {
    ...rawTask,
    tri: rawTask.tri || undefined,
    payload: rawTask.payload || {},
    created_at: rawTask.created_at || new Date().toISOString(),
    updated_at: rawTask.updated_at || new Date().toISOString()
  };
};

// Service fallback mechanism - simplified version
export const createServiceWithFallback = (primaryService: any, fallbackService: any) => {
  return new Proxy(primaryService, {
    get(target, prop) {
      return async (...args: any[]) => {
        try {
          return await target[prop](...args);
        } catch (error) {
          console.warn(`[Service Fallback] ${String(prop)} failed on primary service:`, error);
          return await fallbackService[prop](...args);
        }
      };
    }
  });
};