import { SubLever } from './levers';
import { MicroLoop, PersonAssignment } from './metasolve';

// Enhanced Intervention Types for Act Zone
export interface EnhancedIntervention {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  
  // Sub-lever Configuration
  selectedSubLevers: string[];
  subLeverConfigurations: SubLeverConfiguration[];
  
  // Loop Context
  parentLoopId?: string;
  targetLoopVariables: string[];
  expectedLoopImpact: LoopImpact;
  
  // Parameters
  parameters: InterventionParameter[];
  
  // Micro-task Management
  microTasks: MicroTask[];
  microLoops: MicroLoop[];
  
  // Budget & Resources
  budget: InterventionBudget;
  resources: ResourceRequirement[];
  
  // Rules & Conditions
  automationRules: AutomationRule[];
  
  // Metadata
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
  timeToImpact: 'Short' | 'Medium' | 'Long';
  status: 'draft' | 'configured' | 'validated' | 'approved' | 'active';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface SubLeverConfiguration {
  subLeverId: string;
  subLever: SubLever;
  customizations: LeverCustomization[];
  targetMetrics: TargetMetric[];
  implementationNotes: string;
}

export interface LeverCustomization {
  parameter: string;
  value: string | number | boolean;
  rationale: string;
}

export interface TargetMetric {
  metric: string;
  baseline: number;
  target: number;
  unit: string;
  measurementMethod: string;
  timeline: string;
}

export interface LoopImpact {
  loopId: string;
  impactType: 'strengthen' | 'weaken' | 'redirect' | 'balance';
  targetVariables: string[];
  expectedMagnitude: number; // 1-10 scale
  confidenceLevel: 'low' | 'medium' | 'high';
  assumptions: string[];
}

export interface InterventionParameter {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'select' | 'date' | 'currency';
  value: any;
  defaultValue: any;
  constraints?: ParameterConstraints;
  description: string;
  category: string;
  required: boolean;
  sensitive: boolean; // for budget, personal data, etc.
}

export interface ParameterConstraints {
  min?: number;
  max?: number;
  options?: string[];
  pattern?: string; // regex for text validation
  dependencies?: ParameterDependency[];
}

export interface ParameterDependency {
  parameterName: string;
  condition: string;
  value: any;
}

export interface MicroTask {
  id: string;
  name: string;
  description: string;
  type: 'setup' | 'execution' | 'monitoring' | 'review' | 'closure';
  
  // Assignment
  assignedTo: PersonAssignment;
  reviewedBy?: PersonAssignment;
  
  // Timeline
  startDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours?: number;
  
  // Status & Progress
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed' | 'cancelled';
  progress: number; // 0-100
  blockers: TaskBlocker[];
  
  // Mini-loop Integration
  isPartOfMiniLoop: boolean;
  miniLoopId?: string;
  miniLoopRole?: 'trigger' | 'executor' | 'monitor' | 'feedback';
  
  // Dependencies
  dependencies: TaskDependency[];
  dependents: string[]; // task IDs that depend on this
  
  // Resources
  resourceRequirements: MicroTaskResource[];
  
  // Quality & Deliverables
  deliverables: Deliverable[];
  qualityCriteria: QualityCriterion[];
  
  // DE-Band tracking (if applicable)
  deBandTracking?: {
    enabled: boolean;
    currentBand: 'red' | 'orange' | 'yellow' | 'green';
    targetBand: 'red' | 'orange' | 'yellow' | 'green';
    escalationTriggers: string[];
  };
}

export interface TaskBlocker {
  id: string;
  description: string;
  type: 'resource' | 'dependency' | 'approval' | 'external' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedDate: Date;
  expectedResolution?: Date;
  mitigationActions: string[];
  responsible: string;
}

export interface TaskDependency {
  taskId: string;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
  lag?: number; // days
  lead?: number; // days
}

export interface MicroTaskResource {
  type: 'person' | 'equipment' | 'software' | 'facility' | 'budget';
  name: string;
  quantity: number;
  unit: string;
  cost?: number;
  availability?: string;
}

export interface Deliverable {
  name: string;
  type: 'document' | 'system' | 'process' | 'training' | 'communication';
  description: string;
  acceptanceCriteria: string[];
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'under-review' | 'accepted' | 'rejected';
}

export interface QualityCriterion {
  criterion: string;
  measurementMethod: string;
  target: string;
  priority: 'must-have' | 'should-have' | 'nice-to-have';
}

export interface InterventionBudget {
  totalBudget: number;
  currency: string;
  lineItems: BudgetLineItem[];
  contingency: number;
  contingencyPercent: number;
  approvalStatus: 'draft' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: Date;
}

export interface BudgetLineItem {
  id: string;
  category: 'personnel' | 'technology' | 'infrastructure' | 'operations' | 'training' | 'communications' | 'other';
  subcategory: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  justification: string;
  priority: 'essential' | 'important' | 'optional';
  timeline: 'upfront' | 'recurring' | 'milestone-based';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ResourceRequirement {
  type: 'human' | 'technology' | 'infrastructure' | 'data' | 'regulatory';
  name: string;
  description: string;
  quantity: number;
  unit: string;
  availability: 'available' | 'needs-acquisition' | 'needs-development' | 'external-dependency';
  cost?: number;
  timeline?: string;
  alternatives: string[];
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  
  // Trigger conditions
  trigger: RuleTrigger;
  conditions: RuleCondition[];
  
  // Actions to execute
  actions: RuleAction[];
  
  // Configuration
  enabled: boolean;
  priority: number;
  executionOrder: number;
  
  // Monitoring
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
  
  // Metadata
  createdBy: string;
  createdDate: Date;
  lastModified: Date;
}

export interface RuleTrigger {
  type: 'event' | 'schedule' | 'condition' | 'manual';
  eventType?: string;
  scheduleExpression?: string; // cron expression
  conditionExpression?: string;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'in' | 'not-in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface RuleAction {
  type: 'create-task' | 'update-status' | 'send-notification' | 'update-parameter' | 'escalate' | 'log';
  configuration: Record<string, any>;
  description: string;
}

// Bundle-level types
export interface InterventionBundle {
  id: string;
  name: string;
  description: string;
  interventions: EnhancedIntervention[];
  
  // MetaSolve layers
  macroVision: string; // reference to macro vision
  mesoConfiguration: string; // reference to meso layer config
  microConfiguration: string; // reference to micro layer config
  
  // Bundle-level properties
  totalBudget: number;
  totalTimelineWeeks: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Dependencies and conflicts
  dependencies: BundleDependency[];
  conflicts: BundleConflict[];
  
  // Status and workflow
  status: 'draft' | 'under-review' | 'approved' | 'in-execution' | 'completed' | 'paused' | 'cancelled';
  workflowStage: 'design' | 'validation' | 'approval' | 'deployment' | 'monitoring';
  
  // Timestamps and ownership
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  owner: string;
  stakeholders: string[];
}

export interface BundleDependency {
  type: 'sequence' | 'parallel' | 'conditional';
  fromInterventionId: string;
  toInterventionId: string;
  description: string;
  criticalPath: boolean;
}

export interface BundleConflict {
  type: 'resource' | 'timing' | 'policy' | 'stakeholder';
  interventionIds: string[];
  description: string;
  severity: 'low' | 'medium' | 'high' | 'blocking';
  resolutionStrategy: string;
  resolved: boolean;
}