// RGS MVUI Core Types

export interface Loop {
  id: string;
  name: string;
  tension: TensionLevel;
  srt: number; // Sprint Rhythm Time in months
  leverage: LeverageType;
  deBand: DEBandLevel;
  triScore: number;
  status: LoopStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  loopId: string;
  week: number;
  totalWeeks: number;
  tension: TensionLevel;
  srt: number;
  leverage: LeverageType;
  interventions: Intervention[];
  status: SprintStatus;
  createdAt: Date;
}

export interface Intervention {
  id: string;
  name: string;
  description?: string;
  type: InterventionType;
  effort: EffortLevel;
  impact: ImpactLevel;
  roles: Role[];
  dueDate?: Date;
  status: InterventionStatus;
  dependencies?: string[];
}

export interface Bundle {
  id: string;
  sprintId: string;
  interventions: Intervention[];
  roles: Role[];
  dueDate: Date;
  status: BundleStatus;
  raci?: RACIMatrix;
}

export interface Role {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  type: RoleType;
  responsibilities: string[];
}

export interface RACIMatrix {
  [interventionId: string]: {
    [roleId: string]: RACIRole;
  };
}

export interface Metric {
  id: string;
  loopId: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: MetricCategory;
  trend: TrendDirection;
  sparklineData: number[];
  lastUpdated: Date;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  category: InsightCategory;
  confidence: number;
  experimentId?: string;
  createdAt: Date;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  parameters: ExperimentParameter[];
  results?: ExperimentResult[];
  status: ExperimentStatus;
  createdAt: Date;
}

export interface ExperimentParameter {
  name: string;
  value: any;
  type: 'number' | 'string' | 'boolean' | 'select';
  options?: string[];
}

export interface ExperimentResult {
  metric: string;
  before: number;
  after: number;
  delta: number;
  confidence: number;
}

// Enums
export type TensionLevel = 'high' | 'medium' | 'low' | 'neutral';
export type LeverageType = 'high-leverage' | 'medium-leverage' | 'low-leverage';
export type DEBandLevel = 'red' | 'orange' | 'yellow' | 'green';
export type LoopStatus = 'active' | 'paused' | 'completed' | 'archived';
export type SprintStatus = 'planning' | 'active' | 'review' | 'completed';
export type InterventionType = 'process' | 'technology' | 'people' | 'governance';
export type InterventionStatus = 'planned' | 'in-progress' | 'completed' | 'blocked';
export type BundleStatus = 'draft' | 'published' | 'in-progress' | 'completed';
export type EffortLevel = 'low' | 'medium' | 'high';
export type ImpactLevel = 'low' | 'medium' | 'high';
export type RoleType = 'lead' | 'contributor' | 'reviewer' | 'stakeholder';
export type RACIRole = 'responsible' | 'accountable' | 'consulted' | 'informed';
export type MetricCategory = 'efficiency' | 'quality' | 'delivery' | 'satisfaction' | 'population' | 'development' | 'environment' | 'economics';
export type TrendDirection = 'up' | 'down' | 'stable' | 'volatile';
export type InsightCategory = 'opportunity' | 'risk' | 'pattern' | 'anomaly';
export type ExperimentStatus = 'draft' | 'running' | 'completed' | 'failed';

// Feature Flag Types
export interface FeatureFlags {
  newRgsUI: boolean;
  newTaskDrivenUI: boolean;
  cldStudio: boolean;
  advancedAnalytics: boolean;
  mockDataMode: boolean;
  realTimeCollab: boolean;
  workspacePro: boolean;
  aiCopilot: boolean;
  automation: boolean;
  pluginSystem: boolean;
  // New Cascade Feature Flags
  useCascadeBar: boolean;
  useTaskClaimPopup: boolean;
  useEnhancedTaskPopup: boolean;
  useTeamsButton: boolean;
  // Phase 1: Ultimate Workspace Foundation
  useUltimateWorkspace: boolean;
  useAIcopilot: boolean;
  useDigitalTwin: boolean;
  useCascade3D: boolean;
  useCollabEngine: boolean;
  use3DCLD: boolean;
  useKnowledgeGraph: boolean;
  useGamification: boolean;
  useOfflinePWA: boolean;
  usePluginEcosystem: boolean;
  useSecuritySuite: boolean;
  useMissionControl: boolean;
}

// UI State Types
export interface UIState {
  sidebarCollapsed: boolean;
  currentZone: Zone;
  featureFlags: FeatureFlags;
  activePanel?: string;
}

export type Zone = 'think' | 'act' | 'monitor' | 'innovate-learn';

// Form Types
export interface ThinkFormData {
  tension: TensionLevel;
  srt: number;
  leverage: LeverageType;
  deBandLower?: number;
  deBandUpper?: number;
  enableSRTBreakdown?: boolean;
  loopId?: string;
  tags?: string[];
}

export interface ActFormData {
  interventions: string[];
  roles: Role[];
  dueDate: Date;
  raci?: RACIMatrix;
  dependencies?: string[];
}

export interface MonitorFilters {
  showLowTRI: boolean;
  tensionLevels: TensionLevel[];
  deBandLevels: DEBandLevel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}