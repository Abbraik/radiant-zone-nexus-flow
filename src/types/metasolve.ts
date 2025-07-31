// MetaSolve Framework Types
// Layered approach: Macro (strategic vision) -> Meso (institutional) -> Micro (frontline delivery)

export interface MetaSolveLayer {
  macro: MacroVision;
  meso: MesoLayer;
  micro: MicroLayer;
}

export interface MacroVision {
  id: string;
  title: string;
  description: string;
  timeHorizon: string;
  successMetrics: string[];
  leverageContext: LeverageContext;
}

export interface LeverageContext {
  leveragePointRank: number;
  leveragePointName: string;
  loopId: string;
  loopName: string;
  loopType: 'Reinforcing' | 'Balancing';
  deBandStatus: 'red' | 'orange' | 'yellow' | 'green';
}

export interface MesoLayer {
  institutionalOwners: InstitutionalOwner[];
  governanceStructure: GovernanceStructure;
  resourceAllocation: ResourceAllocation;
  coordinationMechanisms: CoordinationMechanism[];
}

export interface InstitutionalOwner {
  id: string;
  name: string;
  type: 'department' | 'agency' | 'ministry' | 'office' | 'authority';
  role: 'lead' | 'supporting' | 'consulting' | 'informed';
  mandate: string;
  capabilities: string[];
  constraints: string[];
}

export interface GovernanceStructure {
  governanceCell: GovernanceCellRole[];
  decisionRights: DecisionRight[];
  escalationPaths: EscalationPath[];
}

export interface GovernanceCellRole {
  cellFunction: 'Strategy' | 'Operations' | 'Analytics' | 'Engagement' | 'Delivery';
  assignedPersons: PersonAssignment[];
  responsibilities: string[];
  authorities: string[];
}

export interface PersonAssignment {
  personId: string;
  name: string;
  title: string;
  organization: string;
  raciBadge: 'R' | 'A' | 'C' | 'I';
  timeCommitment: string; // e.g., "20% FTE"
}

export interface DecisionRight {
  decisionType: string;
  authority: 'governance-cell' | 'institutional-owner' | 'frontline-unit';
  escalationThreshold?: string;
}

export interface EscalationPath {
  trigger: string;
  escalatesTo: string;
  timelineHours: number;
}

export interface ResourceAllocation {
  budget: BudgetAllocation;
  staffing: StaffingAllocation;
  technology: TechnologyAllocation;
}

export interface BudgetAllocation {
  totalBudget: number;
  budgetByCategory: Record<string, number>;
  fundingSources: FundingSource[];
  contingencyPercent: number;
}

export interface FundingSource {
  source: string;
  amount: number;
  conditions: string[];
  timeline: string;
}

export interface StaffingAllocation {
  requiredFTE: number;
  skillsRequired: string[];
  trainingNeeds: string[];
  hiringTimeline: string;
}

export interface TechnologyAllocation {
  platformsRequired: string[];
  dataRequirements: string[];
  integrationsNeeded: string[];
  securityRequirements: string[];
}

export interface CoordinationMechanism {
  type: 'meetings' | 'dashboards' | 'reports' | 'systems' | 'processes';
  frequency: string;
  participants: string[];
  outputs: string[];
}

export interface MicroLayer {
  frontlineUnits: FrontlineUnit[];
  pilotSites: PilotSite[];
  deliveryMechanisms: DeliveryMechanism[];
  microLoops: MicroLoop[];
}

export interface FrontlineUnit {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  currentLoad: number;
  capabilities: string[];
  constraints: string[];
  stakeholders: Stakeholder[];
}

export interface PilotSite {
  id: string;
  name: string;
  type: string;
  location: string;
  population: number;
  characteristics: string[];
  readinessLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  successFactors: string[];
}

export interface DeliveryMechanism {
  id: string;
  name: string;
  channel: 'digital' | 'physical' | 'hybrid';
  touchpoints: string[];
  userJourney: UserJourneyStep[];
  qualityMetrics: QualityMetric[];
}

export interface UserJourneyStep {
  step: string;
  actor: string;
  actions: string[];
  painPoints: string[];
  opportunities: string[];
}

export interface QualityMetric {
  metric: string;
  target: number;
  measurement: string;
  frequency: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  type: 'citizen' | 'business' | 'organization' | 'government';
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  concerns: string[];
  expectations: string[];
}

export interface MicroLoop {
  id: string;
  name: string;
  type: 'Reinforcing' | 'Balancing';
  description: string;
  variables: LoopVariable[];
  delayFactors: DelayFactor[];
  interventionPoints: InterventionPoint[];
  parentInterventionId: string;
}

export interface LoopVariable {
  name: string;
  type: 'stock' | 'flow' | 'auxiliary';
  measurable: boolean;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
}

export interface DelayFactor {
  source: string;
  target: string;
  delayType: 'material' | 'information' | 'perception';
  estimatedDelay: string;
  mitigationStrategies: string[];
}

export interface InterventionPoint {
  variable: string;
  leverageType: string;
  interventionOptions: string[];
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}