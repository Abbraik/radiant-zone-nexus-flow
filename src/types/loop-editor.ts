// TypeScript types for Loop Editor system

export type LoopType = 'reactive' | 'structural' | 'perceptual' | 'anticipatory';
export type Layer = 'meta' | 'macro' | 'meso' | 'micro';
export type NodeKind = 'stock' | 'flow' | 'aux' | 'actor' | 'indicator';
export type IndicatorKind = 'state' | 'rate';
export type CascadeRelation = 'upstream' | 'downstream';
export type Motif = 'B' | 'R' | 'N' | 'C' | 'T';

export interface LoopMeta {
  loop_code: string;
  motif?: Motif;
  tags?: string[];
  domain?: string;
}

export interface LoopRecord {
  id: string;
  name: string;
  description?: string;
  loop_type: LoopType;
  scale: Layer;
  status: 'draft' | 'published' | 'deprecated';
  leverage_default: 'N' | 'P' | 'S';
  notes?: string;
  metadata: LoopMeta;
  motif?: string;
  domain?: string;
  layer?: string;
  loop_code?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface LoopNode {
  id: string;
  loop_id: string;
  label: string;
  kind: NodeKind;
  meta?: any;
  pos?: { x: number; y: number } | null;
  created_at?: string;
}

export interface LoopEdge {
  id: string;
  loop_id: string;
  from_node: string;
  to_node: string;
  polarity: -1 | 1;
  delay_ms?: number | null;
  weight?: number;
  note?: string | null;
  created_at?: string;
}

export interface Indicator { 
  id: string;
  loop_id: string;
  name: string;
  kind: IndicatorKind;
  unit?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface DEBand {
  id: string;
  loop_id: string;
  indicator_id?: string;
  indicator: string;
  lower_bound: number;
  upper_bound: number;
  asymmetry: number;
  smoothing_alpha: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SRTWindow {
  id: string;
  loop_id: string;
  window_start: string;
  window_end: string;
  reflex_horizon: string;
  cadence: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface SNLItem {
  id: string;
  loop_id: string;
  snl_id: string;
  snl_label: string;
  role?: string;
  domain?: string;
  descriptor?: string;
}

export interface Cascade {
  id: string;
  from_loop_id: string;
  to_loop_id: string;
  relation: CascadeRelation;
  note?: string;
  created_at?: string;
  user_id?: string;
}

export interface HydratedLoopPayload {
  loop: LoopRecord;
  nodes: LoopNode[];
  edges: LoopEdge[];
  indicators: Indicator[];
  de_bands: DEBand[];
  srt_windows: SRTWindow[];
  shared_nodes: SNLItem[];
  cascades: Cascade[];
}

// Editor state interfaces
export interface EditorLintResult {
  id: string;
  level: 'error' | 'warning' | 'pass';
  category: string;
  message: string;
  section: string;
  fixHint?: string;
}

export interface EditorValidationResults {
  errors: EditorLintResult[];
  warnings: EditorLintResult[];
  passes: EditorLintResult[];
}

export interface AutosaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
}

// Atlas data import interfaces
export interface AtlasLoop {
  loop: {
    name: string;
    description?: string;
    type: string;
    scale: string;
    status: string;
    leverage_default: string;
    notes?: string;
    metadata: any;
  };
  nodes: Array<{
    id: string;
    label: string;
    kind: string;
    meta?: any;
  }>;
  edges: Array<{
    id: string;
    from_node: string;
    to_node: string;
    polarity: number;
    delay_ms?: number;
    weight?: number;
    note?: string;
  }>;
  indicators: Array<{
    id: string;
    name: string;
    kind: string;
    unit?: string;
  }>;
  de_bands: Array<{
    id: string;
    indicator_id: string;
    lower_bound: number;
    upper_bound: number;
    asymmetry: number;
    smoothing_alpha: number;
  }>;
  srt?: {
    window_start: string;
    window_end: string;
    reflex_horizon: string;
    cadence: string;
  };
  shared_nodes?: Array<{
    label: string;
    role?: string;
  }>;
}

export interface AtlasBatchData {
  snl_catalog_additions?: Array<{
    label: string;
    domain: string;
    descriptor: string;
  }>;
  loops: AtlasLoop[];
}