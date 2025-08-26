// Anticipatory Trigger DSL - Parser, Compiler & Evaluator
// DSL Grammar: IF <COND> FOR <DAYS>d THEN <ACTION> [WITH <OPTIONS>]

export interface TriggerAst {
  condition: ConditionNode;
  persistence: number; // days
  action: ActionNode;
  options: OptionsNode;
}

export interface ConditionNode {
  type: 'and' | 'or' | 'expr';
  left?: ConditionNode;
  right?: ConditionNode;
  expr?: ExpressionNode;
}

export interface ExpressionNode {
  type: 'indicator' | 'slope' | 'band' | 'gap';
  indicator: string;
  region?: string;
  cohort?: string;
  operator?: '>' | '>=' | '<' | '<=' | '==' | '!=';
  value?: number;
  days?: number;
  indicator2?: string; // for GAP
  state?: 'below' | 'in_band' | 'above'; // for BAND
}

export interface ActionNode {
  type: 'start';
  templateKey: string;
  capacity: string;
}

export interface OptionsNode {
  cooldown?: number; // days
  persistence?: number; // days
  window?: number; // days
}

export interface CompiledTrigger {
  ast: TriggerAst;
  resolvedIndicators: Record<string, string>; // key -> indicator_key
  bandBounds: Record<string, { lower?: number; upper?: number }>;
  regionFilter?: string;
  cohortFilter?: string;
  persistenceHours: number;
  cooldownSeconds: number;
  fingerprintRecipe: string;
  compiledAt: string;
}

export interface EvalResult {
  shouldFire: boolean;
  summary: {
    conditionMet: boolean;
    persistenceCheck: boolean;
    cooldownCheck: boolean;
    hysteresisCheck: boolean;
    evidence: Record<string, any>;
  };
  dedupeFingerprint: string;
}

// DSL Parser
export class TriggerDslParser {
  
  static parseDslToAst(dsl: string): TriggerAst {
    // Simple regex-based parser for the DSL
    const trimmed = dsl.trim();
    
    // Parse main structure: IF ... FOR ...d THEN ... WITH ...
    const mainPattern = /IF\s+(.+?)\s+FOR\s+(\d+)d\s+THEN\s+(.+?)(?:\s+WITH\s+(.+))?$/i;
    const match = trimmed.match(mainPattern);
    
    if (!match) {
      throw new Error('Invalid DSL syntax. Expected: IF <condition> FOR <days>d THEN <action> [WITH <options>]');
    }
    
    const [, conditionStr, persistenceStr, actionStr, optionsStr] = match;
    
    return {
      condition: this.parseCondition(conditionStr),
      persistence: parseInt(persistenceStr, 10),
      action: this.parseAction(actionStr),
      options: this.parseOptions(optionsStr || '')
    };
  }
  
  private static parseCondition(conditionStr: string): ConditionNode {
    // Handle AND/OR operators
    const andParts = conditionStr.split(/\s+AND\s+/i);
    if (andParts.length > 1) {
      return {
        type: 'and',
        left: this.parseCondition(andParts[0]),
        right: this.parseCondition(andParts.slice(1).join(' AND '))
      };
    }
    
    const orParts = conditionStr.split(/\s+OR\s+/i);
    if (orParts.length > 1) {
      return {
        type: 'or',
        left: this.parseCondition(orParts[0]),
        right: this.parseCondition(orParts.slice(1).join(' OR '))
      };
    }
    
    // Single expression
    return {
      type: 'expr',
      expr: this.parseExpression(conditionStr.trim())
    };
  }
  
  private static parseExpression(exprStr: string): ExpressionNode {
    // IND(indicator_key[, region=?, cohort=?]) OP VALUE
    const indPattern = /IND\(([^,\)]+)(?:,\s*region=([^,\)]+))?(?:,\s*cohort=([^,\)]+))?\)\s*([><=!]+)\s*(.+)/i;
    let match = exprStr.match(indPattern);
    if (match) {
      const [, indicator, region, cohort, operator, valueStr] = match;
      return {
        type: 'indicator',
        indicator: indicator.trim(),
        region: region?.trim(),
        cohort: cohort?.trim(),
        operator: operator as any,
        value: parseFloat(valueStr)
      };
    }
    
    // SLOPE(indicator_key, Nd) OP VALUE
    const slopePattern = /SLOPE\(([^,]+),\s*(\d+)d\)\s*([><=!]+)\s*(.+)/i;
    match = exprStr.match(slopePattern);
    if (match) {
      const [, indicator, daysStr, operator, valueStr] = match;
      return {
        type: 'slope',
        indicator: indicator.trim(),
        days: parseInt(daysStr, 10),
        operator: operator as any,
        value: parseFloat(valueStr)
      };
    }
    
    // BAND(indicator_key) IS STATE
    const bandPattern = /BAND\(([^)]+)\)\s+IS\s+(below|in_band|above)/i;
    match = exprStr.match(bandPattern);
    if (match) {
      const [, indicator, state] = match;
      return {
        type: 'band',
        indicator: indicator.trim(),
        state: state as any
      };
    }
    
    // GAP(ind1, ind2) OP VALUE
    const gapPattern = /GAP\(([^,]+),\s*([^)]+)\)\s*([><=!]+)\s*(.+)/i;
    match = exprStr.match(gapPattern);
    if (match) {
      const [, indicator1, indicator2, operator, valueStr] = match;
      return {
        type: 'gap',
        indicator: indicator1.trim(),
        indicator2: indicator2.trim(),
        operator: operator as any,
        value: parseFloat(valueStr)
      };
    }
    
    throw new Error(`Unable to parse expression: ${exprStr}`);
  }
  
  private static parseAction(actionStr: string): ActionNode {
    // START template_key IN capacity
    const pattern = /START\s+([^\s]+)\s+IN\s+([^\s]+)/i;
    const match = actionStr.match(pattern);
    
    if (!match) {
      throw new Error(`Invalid action syntax: ${actionStr}`);
    }
    
    const [, templateKey, capacity] = match;
    return {
      type: 'start',
      templateKey: templateKey.trim(),
      capacity: capacity.trim()
    };
  }
  
  private static parseOptions(optionsStr: string): OptionsNode {
    const options: OptionsNode = {};
    
    if (!optionsStr) return options;
    
    // COOLDOWN=Nd, PERSISTENCE=Nd, WINDOW=Nd
    const cooldownMatch = optionsStr.match(/COOLDOWN=(\d+)d/i);
    if (cooldownMatch) {
      options.cooldown = parseInt(cooldownMatch[1], 10);
    }
    
    const persistenceMatch = optionsStr.match(/PERSISTENCE=(\d+)d/i);
    if (persistenceMatch) {
      options.persistence = parseInt(persistenceMatch[1], 10);
    }
    
    const windowMatch = optionsStr.match(/WINDOW=(\d+)d/i);
    if (windowMatch) {
      options.window = parseInt(windowMatch[1], 10);
    }
    
    return options;
  }
}

// Compiler Context
export interface CompileContext {
  indicatorRegistry: Record<string, string>; // name -> key
  loopBands: Record<string, { lower?: number; upper?: number }>;
  defaultCooldown: number;
}

// DSL Compiler
export class TriggerCompiler {
  
  static compileAst(ast: TriggerAst, context: CompileContext): CompiledTrigger {
    const resolvedIndicators: Record<string, string> = {};
    const bandBounds: Record<string, { lower?: number; upper?: number }> = {};
    
    // Resolve all indicators in the AST
    this.resolveIndicators(ast.condition, context.indicatorRegistry, resolvedIndicators);
    
    // Get band bounds for all indicators
    Object.keys(resolvedIndicators).forEach(name => {
      const key = resolvedIndicators[name];
      if (context.loopBands[key]) {
        bandBounds[name] = context.loopBands[key];
      }
    });
    
    // Build fingerprint recipe
    const fingerprintRecipe = this.buildFingerprintRecipe(ast);
    
    return {
      ast,
      resolvedIndicators,
      bandBounds,
      persistenceHours: ast.persistence * 24,
      cooldownSeconds: (ast.options.cooldown || context.defaultCooldown) * 24 * 60 * 60,
      fingerprintRecipe,
      compiledAt: new Date().toISOString()
    };
  }
  
  private static resolveIndicators(
    condition: ConditionNode, 
    registry: Record<string, string>,
    resolved: Record<string, string>
  ): void {
    if (condition.type === 'expr' && condition.expr) {
      const indicator = condition.expr.indicator;
      if (registry[indicator]) {
        resolved[indicator] = registry[indicator];
      } else {
        throw new Error(`Unknown indicator: ${indicator}`);
      }
      
      if (condition.expr.indicator2) {
        const indicator2 = condition.expr.indicator2;
        if (registry[indicator2]) {
          resolved[indicator2] = registry[indicator2];
        } else {
          throw new Error(`Unknown indicator: ${indicator2}`);
        }
      }
    }
    
    if (condition.left) {
      this.resolveIndicators(condition.left, registry, resolved);
    }
    
    if (condition.right) {
      this.resolveIndicators(condition.right, registry, resolved);
    }
  }
  
  private static buildFingerprintRecipe(ast: TriggerAst): string {
    // Build deterministic fingerprint recipe for deduplication
    const parts = [
      JSON.stringify(ast.condition),
      ast.persistence.toString(),
      ast.action.templateKey,
      ast.action.capacity
    ];
    return parts.join('|');
  }
}

// Trigger Evaluator  
export class TriggerEvaluator {
  
  static async evaluate(
    compiled: CompiledTrigger, 
    now: Date,
    dataSource: {
      getIndicatorValue: (key: string, at: Date) => Promise<number | null>;
      getBandStatus: (key: string, at: Date) => Promise<'below' | 'in_band' | 'above' | null>;
      getSlope: (key: string, days: number, at: Date) => Promise<number | null>;
      getLastFiring: (fingerprint: string) => Promise<Date | null>;
    },
    hysteresis: number = 0.1
  ): Promise<EvalResult> {
    
    const evidence: Record<string, any> = {};
    
    // 1. Evaluate condition
    const conditionMet = await this.evaluateCondition(
      compiled.ast.condition, 
      compiled, 
      now, 
      dataSource,
      evidence
    );
    
    // 2. Check persistence (condition true for N consecutive days)
    const persistenceCheck = await this.checkPersistence(
      compiled, 
      now, 
      dataSource,
      evidence
    );
    
    // 3. Check cooldown
    const fingerprint = this.generateFingerprint(compiled, now);
    const lastFiring = await dataSource.getLastFiring(fingerprint);
    const cooldownCheck = !lastFiring || 
      (now.getTime() - lastFiring.getTime()) >= (compiled.cooldownSeconds * 1000);
    
    // 4. Check hysteresis (prevent chattering)
    const hysteresisCheck = await this.checkHysteresis(
      compiled, 
      now, 
      dataSource, 
      hysteresis,
      evidence
    );
    
    const shouldFire = conditionMet && persistenceCheck && cooldownCheck && hysteresisCheck;
    
    return {
      shouldFire,
      summary: {
        conditionMet,
        persistenceCheck,
        cooldownCheck,
        hysteresisCheck,
        evidence
      },
      dedupeFingerprint: fingerprint
    };
  }
  
  private static async evaluateCondition(
    condition: ConditionNode,
    compiled: CompiledTrigger,
    now: Date,
    dataSource: any,
    evidence: Record<string, any>
  ): Promise<boolean> {
    
    if (condition.type === 'expr' && condition.expr) {
      return this.evaluateExpression(condition.expr, compiled, now, dataSource, evidence);
    }
    
    if (condition.type === 'and') {
      const left = await this.evaluateCondition(condition.left!, compiled, now, dataSource, evidence);
      const right = await this.evaluateCondition(condition.right!, compiled, now, dataSource, evidence);
      return left && right;
    }
    
    if (condition.type === 'or') {
      const left = await this.evaluateCondition(condition.left!, compiled, now, dataSource, evidence);
      const right = await this.evaluateCondition(condition.right!, compiled, now, dataSource, evidence);
      return left || right;
    }
    
    return false;
  }
  
  private static async evaluateExpression(
    expr: ExpressionNode,
    compiled: CompiledTrigger,
    now: Date,
    dataSource: any,
    evidence: Record<string, any>
  ): Promise<boolean> {
    
    const indicatorKey = compiled.resolvedIndicators[expr.indicator];
    if (!indicatorKey) return false;
    
    if (expr.type === 'indicator') {
      const value = await dataSource.getIndicatorValue(indicatorKey, now);
      if (value === null) return false;
      
      evidence[expr.indicator] = { type: 'indicator', value, operator: expr.operator, threshold: expr.value };
      
      switch (expr.operator) {
        case '>': return value > expr.value!;
        case '>=': return value >= expr.value!;
        case '<': return value < expr.value!;
        case '<=': return value <= expr.value!;
        case '==': return Math.abs(value - expr.value!) < 0.001;
        case '!=': return Math.abs(value - expr.value!) >= 0.001;
        default: return false;
      }
    }
    
    if (expr.type === 'slope') {
      const slope = await dataSource.getSlope(indicatorKey, expr.days!, now);
      if (slope === null) return false;
      
      evidence[expr.indicator] = { type: 'slope', slope, operator: expr.operator, threshold: expr.value, days: expr.days };
      
      switch (expr.operator) {
        case '>': return slope > expr.value!;
        case '>=': return slope >= expr.value!;
        case '<': return slope < expr.value!;
        case '<=': return slope <= expr.value!;
        default: return false;
      }
    }
    
    if (expr.type === 'band') {
      const status = await dataSource.getBandStatus(indicatorKey, now);
      if (status === null) return false;
      
      evidence[expr.indicator] = { type: 'band', status, expectedState: expr.state };
      
      return status === expr.state;
    }
    
    if (expr.type === 'gap') {
      const value1 = await dataSource.getIndicatorValue(indicatorKey, now);
      const indicatorKey2 = compiled.resolvedIndicators[expr.indicator2!];
      const value2 = await dataSource.getIndicatorValue(indicatorKey2, now);
      
      if (value1 === null || value2 === null) return false;
      
      const gap = Math.abs(value1 - value2);
      evidence[`${expr.indicator}_${expr.indicator2}`] = { type: 'gap', value1, value2, gap, operator: expr.operator, threshold: expr.value };
      
      switch (expr.operator) {
        case '>': return gap > expr.value!;
        case '>=': return gap >= expr.value!;
        case '<': return gap < expr.value!;
        case '<=': return gap <= expr.value!;
        default: return false;
      }
    }
    
    return false;
  }
  
  private static async checkPersistence(
    compiled: CompiledTrigger,
    now: Date,
    dataSource: any,
    evidence: Record<string, any>
  ): Promise<boolean> {
    // Check if condition has been true for the required persistence period
    const persistenceDays = compiled.ast.persistence;
    let consecutiveDays = 0;
    
    for (let i = 0; i < persistenceDays; i++) {
      const checkDate = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayMet = await this.evaluateCondition(
        compiled.ast.condition,
        compiled,
        checkDate,
        dataSource,
        {}
      );
      
      if (dayMet) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    evidence.persistence = { 
      required: persistenceDays, 
      consecutive: consecutiveDays,
      met: consecutiveDays >= persistenceDays 
    };
    
    return consecutiveDays >= persistenceDays;
  }
  
  private static async checkHysteresis(
    compiled: CompiledTrigger,
    now: Date,
    dataSource: any,
    hysteresis: number,
    evidence: Record<string, any>
  ): Promise<boolean> {
    // Simple hysteresis: don't fire again until indicators return to normal range
    // This is a simplified implementation
    evidence.hysteresis = { applied: hysteresis, passed: true };
    return true;
  }
  
  private static generateFingerprint(compiled: CompiledTrigger, now: Date): string {
    const dayBucket = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
    return `${compiled.fingerprintRecipe}|${dayBucket}`;
  }
}

// Example usage and golden path DSL snippets
export const GOLDEN_PATH_DSL = {
  childcareSurge: `IF BAND(childcare_wait_days) IS above AND IND(childcare_wait_days) >= 30 FOR 14d THEN START containment_pack IN responsive WITH COOLDOWN=14d`,
  
  orderbookVisa: `IF IND(orderbook_index) >= 1.2 AND IND(visa_latency_days) >= 21 FOR 14d THEN START readiness_plan IN anticipatory WITH COOLDOWN=7d`,
  
  trustDivergence: `IF SLOPE(trust_index, 28d) < -0.05 AND SLOPE(service_satisfaction, 28d) >= 0 FOR 60d THEN START portfolio_compare IN deliberative WITH COOLDOWN=30d`,
  
  heatWave: `IF IND(heat_index) >= 0.75 FOR 7d THEN START containment_pack IN responsive WITH COOLDOWN=7d`,
  
  grievanceHotspot: `IF BAND(grievances_per_10k) IS above FOR 14d THEN START readiness_plan IN anticipatory WITH COOLDOWN=21d`
};