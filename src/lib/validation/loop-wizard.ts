import { z } from 'zod';

// Loop Code validation regex
const LOOP_CODE_REGEX = /^[A-Z0-9\-_]+$/;

// Step 0 - Paradigm & Doctrine (RRE Enhanced with Registry Alignment)
export const paradigmDoctrineSchema = z.object({
  name: z.string().min(1, 'Loop name is required').max(100, 'Loop name too long'),
  loop_code: z
    .string()
    .min(1, 'Loop code is required')
    .max(50, 'Loop code too long')
    .regex(LOOP_CODE_REGEX, 'Loop code must contain only A-Z, 0-9, hyphens, and underscores'),
  description: z.string().max(500, 'Description too long'),
  synopsis: z.string().max(200, 'Synopsis too long').optional(),
  type: z.enum(['reactive', 'perceptual', 'structural']),
  scale: z.enum(['micro', 'meso', 'macro']),
  domain: z.string().min(1, 'Domain is required').max(50, 'Domain too long'),
  layer: z.enum(['meta', 'macro', 'meso', 'micro']),
  motif: z.enum(['B', 'R', 'N', 'C', 'T']),
  default_leverage: z.enum(['N', 'P', 'S']),
  tags: z.array(z.string()).max(20, 'Too many tags'),
  doctrine_reference: z.string().max(200, 'Doctrine reference too long'),
  
  // RRE Paradigm Fields
  worldview: z.enum(['cas', 'coherence', 'systems', 'other']),
  paradigm_statement: z.string().min(1, 'Paradigm statement is required').max(1000, 'Paradigm statement too long'),
  coherence_principles: z.array(z.string()).max(10, 'Too many coherence principles'),
  cas_assumptions: z.string().max(500, 'CAS assumptions too long'),
});

// Backward compatibility
export const basicsSchema = paradigmDoctrineSchema;

// Step 1 - Indicators & Sources
export const indicatorSchema = z.object({
  indicator_key: z.string().min(1, 'Indicator key is required').max(50, 'Indicator key too long'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit too long'),
  triad_tag: z.enum(['population', 'domain', 'institution']),
  notes: z.string().max(300, 'Notes too long'),
});

export const sourceSchema = z.object({
  name: z.string().min(1, 'Source name is required').max(100, 'Source name too long'),
  type: z.enum(['pull', 'push', 'file']),
  provider: z.string().min(1, 'Provider is required').max(50, 'Provider too long'),
  schedule_cron: z.string().max(50, 'Schedule too long'),
  schema_version: z.number().int().min(1, 'Schema version must be >= 1'),
  enabled: z.boolean(),
  pii_class: z.enum(['none', 'low', 'medium', 'high', 'restricted']),
  config: z.record(z.any()),
});

export const indicatorsSourcesSchema = z.object({
  indicators: z.array(indicatorSchema).min(1, 'At least one indicator is required'),
  sources: z.array(sourceSchema),
});

// Step 2 - Nodes & Edges (React Flow)
export const nodeSchema = z.object({
  label: z.string().min(1, 'Node label is required').max(50, 'Node label too long'),
  kind: z.enum(['stock', 'flow', 'aux', 'actor', 'indicator']),
  meta: z.record(z.any()),
  pos: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export const edgeSchema = z.object({
  from_label: z.string().min(1, 'From node is required'),
  to_label: z.string().min(1, 'To node is required'),
  polarity: z.union([z.literal(-1), z.literal(1)]),
  delay_ms: z.number().int().min(0, 'Delay must be >= 0'),
  weight: z.number().min(0, 'Weight must be >= 0'),
  note: z.string().max(200, 'Note too long'),
});

export const flowSchema = z.object({
  nodes: z.array(nodeSchema).min(1, 'At least one node is required'),
  edges: z.array(edgeSchema),
});

// Step 3 - Loop Atlas (RRE Enhanced)
export const bandSchema = z.object({
  indicator: z.string().min(1, 'Indicator is required'),
  lower_bound: z.number(),
  upper_bound: z.number(),
  asymmetry: z.number().min(-1, 'Asymmetry must be >= -1').max(1, 'Asymmetry must be <= 1'),
  smoothing_alpha: z.number().min(0, 'Alpha must be >= 0').max(1, 'Alpha must be <= 1'),
  notes: z.string().max(300, 'Notes too long'),
}).refine(
  (data) => data.lower_bound <= data.upper_bound,
  {
    message: 'Lower bound must be <= upper bound',
    path: ['upper_bound'],
  }
);

export const loopClassificationSchema = z.object({
  from_node: z.string().min(1, 'From node is required'),
  to_node: z.string().min(1, 'To node is required'),
  loop_type: z.enum(['reinforcing', 'balancing']),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  leverage_points: z.array(z.string()).max(10, 'Too many leverage points'),
});

// Cascade schema for connecting loops
export const cascadeSchema = z.object({
  to_loop_id: z.string().min(1, 'Target loop is required'),
  relation: z.enum(['drives', 'influences', 'constrains', 'enables']),
  note: z.string().max(200, 'Cascade note too long').optional(),
});

// Shared node link schema
export const sharedNodeLinkSchema = z.object({
  snl_id: z.string().min(1, 'Shared node ID is required'),
  role: z.enum(['actor', 'system', 'bottleneck', 'beneficiary']),
  note: z.string().max(200, 'Link note too long').optional(),
});

export const loopAtlasSchema = z.object({
  bands: z.array(bandSchema),
  loop_classification: z.array(loopClassificationSchema),
  system_purpose: z.string().min(1, 'System purpose is required').max(500, 'System purpose too long'),
  key_feedbacks: z.array(z.string()).max(15, 'Too many key feedbacks'),
  cascades: z.array(cascadeSchema),
  shared_node_links: z.array(sharedNodeLinkSchema),
});

// Backward compatibility
export const bandsSchema = z.object({
  bands: z.array(bandSchema),
});

// Step 4 - Modules & Experiments (RRE)
export const experimentSchema = z.object({
  name: z.string().min(1, 'Experiment name is required').max(100, 'Experiment name too long'),
  hypothesis: z.string().min(1, 'Hypothesis is required').max(500, 'Hypothesis too long'),
  methodology: z.enum(['did', 'rct', 'synthetic_control', 'other']),
  success_criteria: z.string().min(1, 'Success criteria is required').max(300, 'Success criteria too long'),
  timeline_weeks: z.number().int().min(1, 'Timeline must be > 0 weeks').max(104, 'Timeline too long'),
  resources_required: z.string().max(500, 'Resources description too long'),
  evaluation_plan: z.string().min(1, 'Evaluation plan is required').max(500, 'Evaluation plan too long'),
  ethical_considerations: z.string().max(500, 'Ethical considerations too long'),
});

export const pilotSchema = z.object({
  name: z.string().min(1, 'Pilot name is required').max(100, 'Pilot name too long'),
  objective: z.string().min(1, 'Objective is required').max(300, 'Objective too long'),
  scope: z.string().min(1, 'Scope is required').max(300, 'Scope too long'),
  duration_weeks: z.number().int().min(1, 'Duration must be > 0 weeks').max(52, 'Duration too long'),
  stakeholders: z.array(z.string()).max(20, 'Too many stakeholders'),
  risk_mitigation: z.string().max(500, 'Risk mitigation too long'),
  learning_objectives: z.array(z.string()).max(15, 'Too many learning objectives'),
});

export const modulesExperimentsSchema = z.object({
  experiments: z.array(experimentSchema),
  pilots: z.array(pilotSchema),
});

// Step 5 - Baselines & Reflex Memory (RRE Enhanced)
export const baselinesReflexMemorySchema = z.object({
  baselines: z.object({
    trust: z.number().min(0, 'Trust must be >= 0').max(1, 'Trust must be <= 1'),
    reciprocity: z.number().min(0, 'Reciprocity must be >= 0').max(1, 'Reciprocity must be <= 1'),
    integrity: z.number().min(0, 'Integrity must be >= 0').max(1, 'Integrity must be <= 1'),
    as_of: z.string().min(1, 'As of date is required'),
  }),
  
  reflex_memory: z.object({
    learning_objectives: z.array(z.string()).max(10, 'Too many learning objectives'),
    adaptation_triggers: z.array(z.string()).max(15, 'Too many adaptation triggers'),
    success_patterns: z.string().max(500, 'Success patterns too long'),
    failure_patterns: z.string().max(500, 'Failure patterns too long'),
    contextual_factors: z.string().max(500, 'Contextual factors too long'),
    stakeholder_insights: z.string().max(500, 'Stakeholder insights too long'),
  }),
  
  generate_paradigm_statement: z.boolean(),
  generate_aggregate_dashboard: z.boolean(),
  generate_loop_atlas: z.boolean(),
  generate_module_reports: z.boolean(),
  create_followup_task: z.boolean(),
});

// Backward compatibility
export const baselinesSchema = baselinesReflexMemorySchema;

// Complete form validation (RRE)
export const completeFormSchema = paradigmDoctrineSchema
  .merge(indicatorsSourcesSchema)
  .merge(flowSchema)
  .merge(loopAtlasSchema)
  .merge(modulesExperimentsSchema)
  .merge(baselinesReflexMemorySchema);

export type CompleteFormData = z.infer<typeof completeFormSchema>;