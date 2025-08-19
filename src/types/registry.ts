// PAGS Loop Registry Types

export interface Loop {
  id: string;
  name: string;
  synopsis?: string;
  loop_type: 'reactive' | 'structural' | 'perceptual';
  motif: 'B' | 'R' | 'N' | 'C' | 'T';
  layer: 'meta' | 'macro' | 'meso' | 'micro';
  default_leverage: 'N' | 'P' | 'S';
  tags: string[];
  status: 'draft' | 'review' | 'published' | 'deprecated';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface LoopNode {
  id: string;
  loop_id: string;
  label: string;
  kind: 'stock' | 'flow' | 'aux' | 'actor' | 'indicator';
  meta: Record<string, any>;
}

export interface LoopEdge {
  id: string;
  loop_id: string;
  from_node: string;
  to_node: string;
  polarity: -1 | 1;
  delay_ms: number;
  weight: number;
  note?: string;
}

export interface SharedNode {
  id: string;
  label: string;
  domain: 'population' | 'resource' | 'product' | 'social' | 'institution';
  descriptor?: string;
  meta: Record<string, any>;
}

export interface LoopSummary {
  id: string;
  name: string;
  synopsis?: string;
  loop_type: string;
  motif: string;
  layer: string;
  default_leverage: string;
  tags: string[];
  status: string;
  node_count: number;
  edge_count: number;
  updated_at: string;
}

export interface LoopFilters {
  loop_type?: string[];
  motif?: string[];
  layer?: string[];
  status?: string[];
}

export interface LoopHydrationData {
  loop: Loop;
  nodes: LoopNode[];
  edges: LoopEdge[];
  shared_nodes: SharedNode[];
}

// Motif descriptions for UI
export const MOTIF_DESCRIPTIONS = {
  B: 'Balancing - Self-correcting behavior seeking equilibrium',
  R: 'Reinforcing - Self-amplifying growth or decline patterns',
  N: 'Saturation/Nonlinear - Capacity constraints and limits',
  C: 'Constraint/Bottleneck - System bottlenecks and restrictions', 
  T: 'Transport/Delay - Time delays and information flow'
};

// Layer descriptions
export const LAYER_DESCRIPTIONS = {
  meta: 'Meta-system governance and coordination',
  macro: 'Strategic system-wide patterns and policies',
  meso: 'Intermediate organizational and network structures',
  micro: 'Individual and local operational processes'
};

// Leverage descriptions  
export const LEVERAGE_DESCRIPTIONS = {
  N: 'Narrative - Stories, beliefs, and mental models',
  P: 'Policy - Rules, procedures, and formal structures',
  S: 'Structure - Physical systems and infrastructure'
};

// Domain colors for UI
export const DOMAIN_COLORS = {
  population: 'bg-blue-100 text-blue-800',
  resource: 'bg-green-100 text-green-800',
  product: 'bg-purple-100 text-purple-800',
  social: 'bg-orange-100 text-orange-800',
  institution: 'bg-gray-100 text-gray-800'
};