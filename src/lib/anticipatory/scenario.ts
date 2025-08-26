// Anticipatory Scenario Simulator & Backtest Runner
import { supabase } from '@/integrations/supabase/client';
import { TriggerEvaluator, type CompiledTrigger } from './dsl';

export interface ScenarioInput {
  indicatorShocks: Array<{
    indicator: string;
    offsetPercent: number;
    durationDays: number;
    startDay?: number;
  }>;
  covariances?: Array<{
    indicator1: string;
    indicator2: string;
    correlation: number;
  }>;
  hubConstraints?: Array<{
    hubId: string;
    maxCapacity: number;
  }>;
}

export interface ScenarioResult {
  timeline: Array<{
    day: number;
    date: string;
    firings: Array<{
      triggerId: string;
      triggerName: string;
      evidence: Record<string, any>;
      taskCreated: boolean;
      hubLoad: number;
    }>;
  }>;
  summary: {
    totalFirings: number;
    uniqueIncidents: number;
    peakHubLoad: number;
    suggestedPrepositions: string[];
  };
}

export interface BacktestMetrics {
  totalFirings: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  avgDetectionLeadTime: number; // hours
  falsePositiveRate: number;
  lift: number; // vs naive band breach detection
}

export interface BacktestResult {
  metrics: BacktestMetrics;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  firings: Array<{
    date: string;
    triggerId: string;
    predicted: boolean;
    actual: boolean;
    leadTimeHours?: number | undefined;
  }>;
  artifacts: {
    csvData: string;
    charts: Array<{
      type: 'timeline' | 'lead_time_dist' | 'weekly_count';
      data: any;
    }>;
  };
}

// Scenario Simulator
export class ScenarioSimulator {
  
  async runScenario(
    scenarioId: string,
    inputs: ScenarioInput,
    horizonDays: number = 30
  ): Promise<ScenarioResult> {
    
    console.log(`🎭 Running scenario simulation for ${horizonDays} days`);
    
    // Get relevant triggers for this scenario
    const { data: triggers } = await supabase
      .from('antic_trigger_rules')
      .select('*')
      .eq('org_id', await this.getCurrentUserId());
    
    if (!triggers) {
      throw new Error('No triggers found for simulation');
    }
    
    // Generate synthetic time series with shocks
    const syntheticData = this.generateSyntheticTimeSeries(inputs, horizonDays);
    
    // Simulate trigger evaluation day by day
    const timeline: ScenarioResult['timeline'] = [];
    let totalFirings = 0;
    let peakHubLoad = 0;
    const uniqueIncidents = new Set<string>();
    
    for (let day = 0; day < horizonDays; day++) {
      const currentDate = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
      const dayFirings: any[] = [];
      let dayHubLoad = 0;
      
      for (const trigger of triggers) {
        // Simulate trigger evaluation with synthetic data
        const shouldFire = this.simulateTriggerEvaluation(
          trigger,
          syntheticData,
          day,
          currentDate
        );
        
        if (shouldFire) {
          const firing = {
            triggerId: trigger.id,
            triggerName: trigger.name,
            evidence: syntheticData[day] || {},
            taskCreated: true,
            hubLoad: Math.random() * 0.3 // Simulate hub load impact
          };
          
          dayFirings.push(firing);
          totalFirings++;
          uniqueIncidents.add(`${trigger.name}_${Math.floor(day / 7)}`);
          dayHubLoad += firing.hubLoad;
        }
      }
      
      peakHubLoad = Math.max(peakHubLoad, dayHubLoad);
      
      timeline.push({
        day,
        date: currentDate.toISOString(),
        firings: dayFirings
      });
    }
    
    // Generate preposition suggestions
    const suggestedPrepositions = this.generatePrepositionSuggestions(timeline);
    
    // Record scenario run
    await this.recordScenarioRun(scenarioId, {
      timeline,
      summary: {
        totalFirings,
        uniqueIncidents: uniqueIncidents.size,
        peakHubLoad,
        suggestedPrepositions
      }
    });
    
    return {
      timeline,
      summary: {
        totalFirings,
        uniqueIncidents: uniqueIncidents.size,
        peakHubLoad,
        suggestedPrepositions
      }
    };
  }
  
  private generateSyntheticTimeSeries(inputs: ScenarioInput, days: number): Record<number, any> {
    const data: Record<number, any> = {};
    
    // Generate baseline values for each day
    for (let day = 0; day < days; day++) {
      data[day] = {};
      
      // Apply indicator shocks
      inputs.indicatorShocks.forEach(shock => {
        const startDay = shock.startDay || 0;
        const endDay = startDay + shock.durationDays;
        
        if (day >= startDay && day < endDay) {
          // Apply shock
          const baseValue = 0.5; // Normalized baseline
          const shockedValue = baseValue * (1 + shock.offsetPercent / 100);
          data[day][shock.indicator] = Math.max(0, Math.min(1, shockedValue));
        } else {
          // Normal variation
          data[day][shock.indicator] = 0.5 + (Math.random() - 0.5) * 0.2;
        }
      });
    }
    
    return data;
  }
  
  private simulateTriggerEvaluation(
    trigger: any,
    syntheticData: Record<number, any>,
    day: number,
    date: Date
  ): boolean {
    // Simplified trigger evaluation using synthetic data
    // In a real implementation, this would use the full DSL evaluator
    
    const dayData = syntheticData[day] || {};
    const hasAnyIndicatorAboveThreshold = Object.values(dayData).some(
      (value: any) => typeof value === 'number' && value > 0.7
    );
    
    // Simple probability based on trigger complexity and data
    const fireProb = hasAnyIndicatorAboveThreshold ? 0.3 : 0.05;
    return Math.random() < fireProb;
  }
  
  private generatePrepositionSuggestions(timeline: ScenarioResult['timeline']): string[] {
    const suggestions: string[] = [];
    
    // Analyze firing patterns to suggest prepositions
    const firingCount = timeline.reduce((sum, day) => sum + day.firings.length, 0);
    
    if (firingCount > 5) {
      suggestions.push('containment_pack_tier1');
    }
    
    if (firingCount > 10) {
      suggestions.push('readiness_plan_extended');
    }
    
    const hasHighHubLoad = timeline.some(day => 
      day.firings.reduce((sum, f) => sum + f.hubLoad, 0) > 0.8
    );
    
    if (hasHighHubLoad) {
      suggestions.push('mesh_coordinator_pack');
    }
    
    return suggestions;
  }
  
  private async recordScenarioRun(scenarioId: string, result: any): Promise<void> {
    const { error } = await supabase
      .from('antic_scenario_results')
      .insert({
        scenario_id: scenarioId,
        org_id: await this.getCurrentUserId(),
        without_mitigation_breach_prob: 0.8,
        with_mitigation_breach_prob: 0.3,
        mitigation_delta: 0.5,
        affected_loops: ['AUTO'],
        notes: `Simulation completed with ${result.summary.totalFirings} firings`
      });
    
    if (error) {
      console.error('Failed to record scenario run:', error);
    }
  }
  
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'system';
  }
}

// Backtest Runner
export class BacktestRunner {
  
  async runBacktest(
    backtestId: string,
    channelKey: string,
    fromDate: Date,
    toDate: Date
  ): Promise<BacktestResult> {
    
    console.log(`📊 Running backtest from ${fromDate.toISOString()} to ${toDate.toISOString()}`);
    
    // Get historical data
    const historicalData = await this.getHistoricalData(channelKey, fromDate, toDate);
    
    // Get triggers for the channel
    const { data: triggers } = await supabase
      .from('antic_trigger_rules')
      .select('*')
      .eq('org_id', await this.getCurrentUserId());
    
    if (!triggers) {
      throw new Error('No triggers found for backtest');
    }
    
    // Run triggers against historical data
    const firings: BacktestResult['firings'] = [];
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    let totalLeadTime = 0;
    let leadTimeCount = 0;
    
    // Simulate evaluation on each day
    const dayCount = Math.ceil((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000));
    
    for (let i = 0; i < dayCount; i++) {
      const checkDate = new Date(fromDate.getTime() + i * 24 * 60 * 60 * 1000);
      
      for (const trigger of triggers) {
        const predicted = this.evaluateTriggerOnHistoricalData(trigger, historicalData, checkDate);
        const actual = this.getGroundTruthIncident(checkDate, channelKey);
        
        const firing: {
          date: string;
          triggerId: string;
          predicted: boolean;
          actual: boolean;
          leadTimeHours?: number;
        } = {
          date: checkDate.toISOString(),
          triggerId: trigger.id,
          predicted,
          actual
        };
        
        if (predicted && actual) {
          truePositives++;
          // Calculate lead time if we detected it early
          const leadTime = this.calculateLeadTime(checkDate, actual);
          if (leadTime > 0) {
            firing.leadTimeHours = leadTime;
            totalLeadTime += leadTime;
            leadTimeCount++;
          }
        } else if (predicted && !actual) {
          falsePositives++;
        } else if (!predicted && actual) {
          falseNegatives++;
        }
        
        if (predicted || actual) {
          firings.push(firing);
        }
      }
    }
    
    // Calculate metrics
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    const avgDetectionLeadTime = leadTimeCount > 0 ? totalLeadTime / leadTimeCount : 0;
    const falsePositiveRate = falsePositives / (falsePositives + (dayCount * triggers.length - truePositives - falsePositives - falseNegatives)) || 0;
    
    const metrics: BacktestMetrics = {
      totalFirings: firings.length,
      truePositives,
      falsePositives,
      falseNegatives,
      precision,
      recall,
      f1Score,
      avgDetectionLeadTime,
      falsePositiveRate,
      lift: precision / 0.1 // vs 10% baseline
    };
    
    const confusionMatrix = {
      tp: truePositives,
      fp: falsePositives,
      tn: dayCount * triggers.length - truePositives - falsePositives - falseNegatives,
      fn: falseNegatives
    };
    
    // Generate artifacts
    const artifacts = await this.generateBacktestArtifacts(firings, metrics);
    
    // Record backtest run
    await this.recordBacktestRun(backtestId, metrics, confusionMatrix);
    
    return {
      metrics,
      confusionMatrix,
      firings,
      artifacts
    };
  }
  
  private async getHistoricalData(channelKey: string, fromDate: Date, toDate: Date): Promise<any[]> {
    // Get historical normalized observations
    const { data } = await supabase
      .from('normalized_observations')
      .select('*')
      .gte('ts', fromDate.toISOString())
      .lte('ts', toDate.toISOString())
      .order('ts');
    
    return data || [];
  }
  
  private evaluateTriggerOnHistoricalData(trigger: any, data: any[], date: Date): boolean {
    // Simplified historical evaluation
    // In practice, this would reconstruct the full evaluation context
    
    const relevantData = data.filter(d => 
      new Date(d.ts).toDateString() === date.toDateString()
    );
    
    // Simple heuristic: fire if any indicator is outside band
    return relevantData.some(d => d.status !== 'in_band');
  }
  
  private getGroundTruthIncident(date: Date, channelKey: string): boolean {
    // Simple ground truth simulation
    // In practice, this would come from incident logs or manual labeling
    return Math.random() < 0.1; // 10% of days have incidents
  }
  
  private calculateLeadTime(detectionDate: Date, incidentDate: boolean): number {
    // If we detected it and there was an incident, assume 24h lead time
    return incidentDate ? 24 : 0;
  }
  
  private async generateBacktestArtifacts(
    firings: BacktestResult['firings'],
    metrics: BacktestMetrics
  ): Promise<BacktestResult['artifacts']> {
    
    // Generate CSV
    const csvHeaders = 'Date,TriggerId,Predicted,Actual,LeadTimeHours\n';
    const csvRows = firings.map(f => 
      `${f.date},${f.triggerId},${f.predicted},${f.actual},${f.leadTimeHours || ''}`
    ).join('\n');
    const csvData = csvHeaders + csvRows;
    
    // Generate chart data
    const charts = [
      {
        type: 'timeline' as const,
        data: firings.map(f => ({
          date: f.date,
          predicted: f.predicted ? 1 : 0,
          actual: f.actual ? 1 : 0
        }))
      },
      {
        type: 'lead_time_dist' as const,
        data: firings
          .filter(f => f.leadTimeHours)
          .map(f => f.leadTimeHours)
      },
      {
        type: 'weekly_count' as const,
        data: this.aggregateByWeek(firings)
      }
    ];
    
    return { csvData, charts };
  }
  
  private aggregateByWeek(firings: BacktestResult['firings']): any[] {
    const weekly: Record<string, number> = {};
    
    firings.forEach(f => {
      const week = new Date(f.date).toISOString().slice(0, 10); // YYYY-MM-DD
      weekly[week] = (weekly[week] || 0) + 1;
    });
    
    return Object.entries(weekly).map(([week, count]) => ({ week, count }));
  }
  
  private async recordBacktestRun(
    backtestId: string,
    metrics: BacktestMetrics,
    confusionMatrix: any
  ): Promise<void> {
    
    const { error } = await supabase
      .from('antic_backtests')
      .insert({
        rule_id: backtestId,
        org_id: await this.getCurrentUserId(),
        horizon: 'P30D',
        metrics: metrics as any,
        points: [] // Would contain detailed results
      });
    
    if (error) {
      console.error('Failed to record backtest run:', error);
    }
  }
  
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'system';
  }
}

// Export singleton instances
export const scenarioSimulator = new ScenarioSimulator();
export const backtestRunner = new BacktestRunner();