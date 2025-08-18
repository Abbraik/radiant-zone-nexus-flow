export interface LoopNode {
  id: string;
  label: string;
  domain: 'population' | 'resource' | 'products' | 'social' | 'institution';
  descriptor?: string;
  role?: string;
}

export interface LoopEdge {
  id: string;
  from_node: string;
  to_node: string;
  polarity: -1 | 1;
  delay_ms?: number;
  weight?: number;
  note?: string;
}

export interface LoopData {
  id: string;
  name: string;
  loop_type: 'reactive' | 'structural' | 'perceptual';
  scale: 'micro' | 'meso' | 'macro';
  leverage_default?: 'N' | 'P' | 'S';
  controller: Record<string, any>;
  thresholds: Record<string, any>;
  notes?: string;
  status: 'draft' | 'published';
  version: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  nodes?: LoopNode[];
  edges?: LoopEdge[];
  tags?: string[];
  node_count?: number;
}

export interface LoopVersion {
  id: string;
  loop_id: string;
  version: number;
  payload: Record<string, any>;
  created_at: string;
}

export interface LoopSearchFilters {
  loop_type?: string;
  scale?: string;
  status?: string;
}

export interface HydratedLoop extends LoopData {
  nodes: LoopNode[];
  edges: LoopEdge[];
}