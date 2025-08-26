// Harmonization Service - Conflict detection and resolution
export interface HarmonizationContext {
  task: {
    taskId: string;
    timeWindow: {
      start: string;
      end: string;
    };
    hubAllocations: Array<{
      snlId: string;
      allocPct: number;
      region?: string;
    }>;
    loopId?: string;
  };
  existingAllocations?: Array<{
    taskId: string;
    snlId: string;
    allocPct: number;
    region?: string;
    timeWindow: { start: string; end: string };
  }>;
  hubLoad?: Record<string, number>; // snlId -> current hub load (0-1)
  localDispersion?: number; // proportion of local indicators outside band (0-1)
}

export type ConflictLevel = 'CLEAR' | 'TENSION' | 'CONFLICT';

export interface ConflictSuggestion {
  type: 'sequence' | 'scope' | 'throttle' | 'mesh';
  title: string;
  description: string;
  adjustment: {
    timeShiftDays?: number;
    scopeReductionPct?: number;
    deltaThrottlePct?: number;
    meshTaskIds?: string[];
  };
  riskReduction: number; // how much this reduces risk (0-1)
}

export interface HarmonizationResult {
  riskScore: number;
  level: ConflictLevel;
  reason: string;
  conflictingTasks: string[];
  suggestions: ConflictSuggestion[];
  evaluationMs: number;
}

export class HarmonizationService {
  
  static computeRisk(ctx: HarmonizationContext): HarmonizationResult {
    const startTime = performance.now();
    let riskScore = 0;
    const conflictingTasks: string[] = [];
    
    // Base risk components (weights sum to 1.0)
    const weights = {
      currentHubLoad: 0.4,
      projectedAllocation: 0.3,
      overlapStrength: 0.2,
      dispersionLocal: 0.1
    };

    // Component 1: Current hub load
    const avgCurrentHubLoad = ctx.task.hubAllocations.reduce((sum, alloc) => {
      const hubLoad = ctx.hubLoad?.[alloc.snlId] || 0;
      return sum + hubLoad;
    }, 0) / Math.max(1, ctx.task.hubAllocations.length);

    riskScore += weights.currentHubLoad * avgCurrentHubLoad;

    // Component 2: Projected allocation percentage
    const maxProjectedAlloc = Math.max(...ctx.task.hubAllocations.map(a => a.allocPct));
    riskScore += weights.projectedAllocation * maxProjectedAlloc;

    // Component 3: Overlap strength with existing allocations
    let overlapStrength = 0;
    const taskWindow = ctx.task.timeWindow;
    
    if (ctx.existingAllocations) {
      for (const existingAlloc of ctx.existingAllocations) {
        // Skip self
        if (existingAlloc.taskId === ctx.task.taskId) continue;
        
        // Check for hub overlap
        const hasHubOverlap = ctx.task.hubAllocations.some(taskAlloc => 
          taskAlloc.snlId === existingAlloc.snlId &&
          (!taskAlloc.region || !existingAlloc.region || taskAlloc.region === existingAlloc.region)
        );
        
        if (hasHubOverlap) {
          // Check for time overlap
          const taskStart = new Date(taskWindow.start).getTime();
          const taskEnd = new Date(taskWindow.end).getTime();
          const existingStart = new Date(existingAlloc.timeWindow.start).getTime();
          const existingEnd = new Date(existingAlloc.timeWindow.end).getTime();
          
          const overlapStart = Math.max(taskStart, existingStart);
          const overlapEnd = Math.min(taskEnd, existingEnd);
          
          if (overlapStart < overlapEnd) {
            // Calculate overlap intensity
            const overlapDuration = overlapEnd - overlapStart;
            const taskDuration = taskEnd - taskStart;
            const overlapRatio = overlapDuration / taskDuration;
            
            overlapStrength += existingAlloc.allocPct * overlapRatio;
            conflictingTasks.push(existingAlloc.taskId);
          }
        }
      }
    }

    riskScore += weights.overlapStrength * Math.min(overlapStrength, 1.0);

    // Component 4: Local dispersion
    const localDispersion = ctx.localDispersion || 0;
    riskScore += weights.dispersionLocal * localDispersion;

    // Ensure risk score is bounded [0, 1]
    riskScore = Math.max(0, Math.min(1, riskScore));

    // Determine conflict level
    let level: ConflictLevel;
    let reason: string;

    if (riskScore >= 0.75) {
      level = 'CONFLICT';
      reason = `High collision risk (${(riskScore * 100).toFixed(0)}%) detected on shared resources`;
    } else if (riskScore >= 0.5) {
      level = 'TENSION';
      reason = `Moderate tension (${(riskScore * 100).toFixed(0)}%) with competing resource demands`;
    } else {
      level = 'CLEAR';
      reason = `Low risk (${(riskScore * 100).toFixed(0)}%) - sufficient resource headroom`;
    }

    // Generate suggestions
    const suggestions = this.generateSuggestions(ctx, riskScore, conflictingTasks);

    const evaluationMs = Math.round(performance.now() - startTime);

    return {
      riskScore,
      level,
      reason,
      conflictingTasks: Array.from(new Set(conflictingTasks)),
      suggestions,
      evaluationMs
    };
  }

  private static generateSuggestions(
    ctx: HarmonizationContext, 
    currentRisk: number,
    conflictingTasks: string[]
  ): ConflictSuggestion[] {
    const suggestions: ConflictSuggestion[] = [];

    // Only generate suggestions if there's meaningful risk
    if (currentRisk < 0.3) return suggestions;

    // Suggestion 1: Sequence (shift start time)
    if (conflictingTasks.length > 0) {
      const shiftDays = Math.ceil(currentRisk * 7); // 1-7 days based on risk
      suggestions.push({
        type: 'sequence',
        title: `Shift start by ${shiftDays} days`,
        description: `Delay task start to reduce overlap with ${conflictingTasks.length} conflicting task(s)`,
        adjustment: { timeShiftDays: shiftDays },
        riskReduction: Math.min(0.4, currentRisk * 0.6)
      });
    }

    // Suggestion 2: Scope reduction
    const maxAlloc = Math.max(...ctx.task.hubAllocations.map(a => a.allocPct));
    if (maxAlloc > 0.1) {
      const reductionPct = Math.min(0.5, currentRisk * 0.8);
      const newScope = Math.max(0.05, maxAlloc * (1 - reductionPct));
      suggestions.push({
        type: 'scope',
        title: `Reduce scope to ${(newScope * 100).toFixed(0)}%`,
        description: `Lower resource allocation to minimize hub contention`,
        adjustment: { scopeReductionPct: reductionPct },
        riskReduction: Math.min(0.3, reductionPct * currentRisk)
      });
    }

    // Suggestion 3: Throttle (reduce delta/intensity)
    if (currentRisk > 0.6) {
      const throttlePct = Math.min(0.4, (currentRisk - 0.5) * 0.8);
      suggestions.push({
        type: 'throttle',
        title: `Throttle intensity by ${(throttlePct * 100).toFixed(0)}%`,
        description: 'Reduce change rate to ease system stress during overlap period',
        adjustment: { deltaThrottlePct: throttlePct },
        riskReduction: throttlePct * 0.5
      });
    }

    // Suggestion 4: Mesh coordination
    if (conflictingTasks.length >= 2) {
      suggestions.push({
        type: 'mesh',
        title: `Coordinate with ${conflictingTasks.length} related tasks`,
        description: 'Create mesh coordination compact to synchronize shared resource usage',
        adjustment: { meshTaskIds: conflictingTasks },
        riskReduction: Math.min(0.35, conflictingTasks.length * 0.15)
      });
    }

    // Sort by risk reduction (highest first)
    return suggestions.sort((a, b) => b.riskReduction - a.riskReduction);
  }

  // Apply suggestion and recalculate risk
  static applySuggestion(
    ctx: HarmonizationContext, 
    suggestion: ConflictSuggestion
  ): HarmonizationContext {
    const newCtx = JSON.parse(JSON.stringify(ctx)); // Deep clone

    switch (suggestion.type) {
      case 'sequence':
        if (suggestion.adjustment.timeShiftDays) {
          const shiftMs = suggestion.adjustment.timeShiftDays * 24 * 60 * 60 * 1000;
          const newStart = new Date(new Date(newCtx.task.timeWindow.start).getTime() + shiftMs);
          const newEnd = new Date(new Date(newCtx.task.timeWindow.end).getTime() + shiftMs);
          newCtx.task.timeWindow = {
            start: newStart.toISOString(),
            end: newEnd.toISOString()
          };
        }
        break;
        
      case 'scope':
        if (suggestion.adjustment.scopeReductionPct) {
          newCtx.task.hubAllocations = newCtx.task.hubAllocations.map(alloc => ({
            ...alloc,
            allocPct: alloc.allocPct * (1 - suggestion.adjustment.scopeReductionPct!)
          }));
        }
        break;
        
      case 'throttle':
        // Throttling would be applied at the task execution level
        // This is more about signaling the intention
        break;
        
      case 'mesh':
        // Mesh coordination creates links between tasks but doesn't change allocations
        break;
    }

    return newCtx;
  }

  // Format result for display
  static formatResult(result: HarmonizationResult, isExpertMode: boolean = false): string {
    const { level, reason, riskScore, evaluationMs } = result;
    
    if (level === 'CLEAR') {
      return isExpertMode 
        ? `✓ ${level} - ${reason} (${evaluationMs}ms)`
        : `✓ ${reason}`;
    }

    const icon = level === 'CONFLICT' ? '🔴' : '🟡';
    const suffix = isExpertMode ? ` (${evaluationMs}ms)` : '';
    
    return `${icon} ${level} - ${reason}${suffix}`;
  }

  // Get color for risk level
  static getRiskColor(level: ConflictLevel): string {
    switch (level) {
      case 'CLEAR': return 'text-green-500';
      case 'TENSION': return 'text-yellow-500'; 
      case 'CONFLICT': return 'text-red-500';
    }
  }
}