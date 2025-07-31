// Advanced Analytics Types for Phase 2
// Sub-Lever Performance & Analytics

import { EnhancedLoop, LoopLayer } from './monitor';

// Sub-lever performance tracking
export interface SubLever {
  id: string;
  name: string;
  category: 'economic' | 'fiscal' | 'regulatory' | 'technological' | 'informational' | 'social';
  parentLeverId?: string;
  description?: string;
  targetImpact: number;
  currentImpact: number;
  projectedImpact: number;
  confidenceLevel: number; // 0-100%
  lastUpdated: Date;
}

export interface LeveragePoint {
  id: string;
  name: string;
  rank: number; // 1-6 (Donella Meadows leverage hierarchy)
  category: string;
  subLevers: SubLever[];
  associatedLoopId?: string;
  effectivenessScore: number;
  implementationComplexity: number;
}

export interface PerformanceMetric {
  id: string;
  subLeverId: string;
  metricName: string;
  value: number;
  target: number;
  unit: string;
  timestamp: Date;
  trend: 'improving' | 'declining' | 'stable';
  benchmarkComparison?: {
    internal: number;
    industry: number;
    bestPractice: number;
  };
}

// Advanced analytics
export interface PredictiveModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'time_series' | 'causal_inference';
  targetVariable: string;
  features: string[];
  accuracy: number;
  confidence: number;
  lastTrained: Date;
  predictions: Prediction[];
}

export interface Prediction {
  id: string;
  modelId: string;
  targetDate: Date;
  predictedValue: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  factor: string;
  impact: number; // -1 to 1
  confidence: number;
  explanation: string;
}

// Historical analysis
export interface HistoricalPattern {
  id: string;
  name: string;
  description: string;
  pattern: 'cyclical' | 'seasonal' | 'trending' | 'anomalous';
  frequency: string; // e.g., "weekly", "monthly", "quarterly"
  strength: number; // 0-1
  lastOccurrence: Date;
  nextPredicted?: Date;
  associatedMetrics: string[];
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'pattern' | 'anomaly' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  actionable: boolean;
  suggestedActions?: string[];
  evidence: InsightEvidence[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface InsightEvidence {
  type: 'data_point' | 'correlation' | 'trend' | 'benchmark';
  description: string;
  value?: number;
  source: string;
  reliability: number; // 0-1
}

// Custom dashboard configuration
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'alert' | 'insight' | 'performance' | 'prediction';
  title: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  position: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
  config: WidgetConfig;
  dataSource: string;
  refreshRate: number; // seconds
  visible: boolean;
  permissions: string[]; // role-based access
}

export interface WidgetConfig {
  // Common config
  timeRange?: {
    start: Date;
    end: Date;
  };
  
  // Chart-specific
  chartType?: 'line' | 'bar' | 'area' | 'scatter' | 'heatmap' | 'gauge';
  
  // Metric-specific
  thresholds?: {
    warning: number;
    critical: number;
  };
  
  // Filter-specific
  filters?: Record<string, any>;
  
  // Display options
  showTrend?: boolean;
  showBenchmark?: boolean;
  showPrediction?: boolean;
}

export interface UserDashboard {
  id: string;
  userId: string;
  name: string;
  description?: string;
  layout: 'grid' | 'masonry' | 'flex';
  widgets: DashboardWidget[];
  isDefault: boolean;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  lastModified: Date;
}

// Micro-loop alert rail
export interface MicroLoopAlert {
  id: string;
  loopId: string;
  taskId?: string;
  type: 'delay' | 'quality' | 'resource' | 'bottleneck' | 'rework';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  suggestedAction?: string;
  autoResolvable: boolean;
  timestamp: Date;
  resolvedAt?: Date;
  escalatedAt?: Date;
  metadata: Record<string, any>;
}

export interface TaskMetrics {
  taskId: string;
  averageCompletionTime: number;
  targetCompletionTime: number;
  reworkRate: number;
  qualityScore: number;
  resourceUtilization: number;
  blockerFrequency: number;
  dependencyHealth: number;
  currentStatus: 'on_track' | 'at_risk' | 'delayed' | 'blocked';
}

// Data aggregation and export
export interface AnalyticsQuery {
  id: string;
  name: string;
  description?: string;
  sql?: string; // For advanced users
  filters: QueryFilter[];
  groupBy: string[];
  metrics: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  refreshSchedule?: 'real_time' | 'hourly' | 'daily' | 'weekly';
}

export interface QueryFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'contains';
  value: any;
}

export interface DataExport {
  id: string;
  name: string;
  format: 'csv' | 'json' | 'xlsx' | 'pdf';
  query: AnalyticsQuery;
  schedule?: ExportSchedule;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

export interface ExportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  hour: number; // 0-23
  timezone: string;
  enabled: boolean;
}