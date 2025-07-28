export interface CLDPosition {
  x: number;
  y: number;
}

export type CLDNodeType = 'stock' | 'flow' | 'auxiliary' | 'constant';

export interface CLDNode {
  id: string;
  label: string;
  description?: string;
  type: CLDNodeType;
  position: CLDPosition;
  value?: number;
  delay?: number;
  volatility?: number;
  tracked?: boolean;
  category?: string;
  metadata?: Record<string, any>;
}

export interface CLDLink {
  id: string;
  sourceId: string;
  targetId: string;
  polarity: 'positive' | 'negative';
  strength?: number;
  delay?: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface CLDModel {
  id: string;
  name: string;
  description?: string;
  nodes: CLDNode[];
  links: CLDLink[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationResult {
  nodeId: string;
  values: number[];
  timestamps: Date[];
}

export interface SimulationResults {
  duration: number;
  timeSteps: number;
  convergence: 'stable' | 'oscillating' | 'divergent';
  results: SimulationResult[];
  metadata?: Record<string, any>;
}