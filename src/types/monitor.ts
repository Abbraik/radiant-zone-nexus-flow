// Enhanced Monitor Zone Types for Multi-Level Loop Architecture
// Phase 1: Foundation & Multi-Level Loop Architecture

import { MetaSolveLayer } from './metasolve';

export type LoopLayer = 'macro' | 'meso' | 'micro';
export type LoopType = 'reinforcing' | 'balancing';
export type DEBandStatus = 'green' | 'yellow' | 'orange' | 'red';
export type AlertSeverity = 'info' | 'warning' | 'critical';

// Enhanced Loop interface with hierarchical support
export interface EnhancedLoop {
  id: string;
  name: string;
  description?: string;
  layer: LoopLayer;
  type: LoopType;
  parentLoopId?: string; // For hierarchical relationships
  childLoopIds?: string[];
  
  // Core metrics
  triScore: number;
  deBand: DEBandStatus;
  srtHorizon: number; // Sprint Rhythm Time horizon in weeks
  
  // Performance data
  trend: number[];
  status: 'healthy' | 'warning' | 'critical';
  lastCheck: string;
  nextCheck: string;
  
  // MetaSolve integration
  metasolveContext?: {
    layer: keyof MetaSolveLayer;
    leverageRank?: number;
    interventionIds?: string[];
  };
  
  // Loop-specific data based on layer
  layerData: MacroLoopData | MesoLoopData | MicroLoopData;
  
  // Alert configuration
  alertThresholds: {
    triLower: number;
    triUpper: number;
    deBandBreach: boolean;
    srtOverrun: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// Layer-specific data structures
export interface MacroLoopData {
  leveragePoints: string[];
  systemScope: 'population' | 'development' | 'environment' | 'economy';
  policyImpact: number;
  stakeholderCount: number;
  cldThumbnail?: string; // Base64 or URL to CLD visualization
}

export interface MesoLoopData {
  processType: 'budget' | 'compliance' | 'innovation' | 'coordination';
  throughputRate: number; // bundles/interventions per period
  averageDeviation: number; // % deviation from planned
  pilotSuccessRate: number;
  resourceUtilization: number;
}

export interface MicroLoopData {
  taskType: 'execution' | 'review' | 'approval' | 'monitoring';
  reworkPercentage: number;
  averageCompletionTime: number; // in hours
  alertFrequency: number; // alerts per week
  bottleneckIndicators: string[];
}

// Alert system types
export interface LoopAlert {
  id: string;
  loopId: string;
  type: 'breach' | 'threshold' | 'trend' | 'system';
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
  actionRequired: boolean;
  contextUrl?: string; // Deep link to relevant view
}

// Dashboard configuration
export interface DashboardConfig {
  layout: 'grid' | 'list' | 'hybrid';
  panels: DashboardPanel[];
  filters: DashboardFilters;
  autoRefresh: boolean;
  refreshInterval: number; // seconds
}

export interface DashboardPanel {
  id: string;
  type: 'macro' | 'meso' | 'micro' | 'alerts' | 'trends';
  position: { row: number; col: number; span: number };
  visible: boolean;
  config: Record<string, any>;
}

export interface DashboardFilters {
  layers: LoopLayer[];
  statuses: ('healthy' | 'warning' | 'critical')[];
  deBands: DEBandStatus[];
  timeRange: {
    start: Date;
    end: Date;
  };
  searchQuery: string;
  showOnlyBreached: boolean;
}

// Performance metrics aggregation
export interface LayerMetrics {
  layer: LoopLayer;
  totalLoops: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  averageTriScore: number;
  breachedLoops: number;
  trendDirection: 'improving' | 'declining' | 'stable';
}

// Real-time data simulation types
export interface LoopDataPoint {
  timestamp: Date;
  loopId: string;
  triScore: number;
  deBand: DEBandStatus;
  customMetrics: Record<string, number>;
}

export interface DataStream {
  id: string;
  loopId: string;
  type: 'real-time' | 'batch' | 'simulation';
  frequency: number; // update frequency in seconds
  lastUpdate: Date;
  isActive: boolean;
}