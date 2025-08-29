import { z } from 'zod';

// Loop Code validation regex
const LOOP_CODE_REGEX = /^[A-Z0-9\-_]+$/;

// Step 0 - Basics & Doctrine
export const basicsSchema = z.object({
  name: z.string().min(1, 'Loop name is required').max(100, 'Loop name too long'),
  loop_code: z
    .string()
    .min(1, 'Loop code is required')
    .max(50, 'Loop code too long')
    .regex(LOOP_CODE_REGEX, 'Loop code must contain only A-Z, 0-9, hyphens, and underscores'),
  description: z.string().max(500, 'Description too long'),
  type: z.enum(['reactive', 'perceptual', 'structural']),
  scale: z.enum(['micro', 'meso', 'macro']),
  domain: z.string().min(1, 'Domain is required').max(50, 'Domain too long'),
  layer: z.string().min(1, 'Layer is required').max(50, 'Layer too long'),
  doctrine_reference: z.string().max(200, 'Doctrine reference too long'),
});

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

// Step 3 - Adaptive Bands
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

export const bandsSchema = z.object({
  bands: z.array(bandSchema),
});

// Step 4 - Watchpoints & Triggers
export const watchpointSchema = z.object({
  indicator: z.string().min(1, 'Indicator is required'),
  direction: z.enum(['up', 'down', 'band']),
  threshold_value: z.number().nullable(),
  threshold_band: z.record(z.any()).nullable(),
  armed: z.boolean(),
});

export const triggerSchema = z.object({
  name: z.string().min(1, 'Trigger name is required').max(100, 'Trigger name too long'),
  condition: z.string().min(1, 'Condition is required').max(200, 'Condition too long'),
  threshold: z.number(),
  window_hours: z.number().int().min(1, 'Window hours must be > 0'),
  action_ref: z.string().min(1, 'Action reference is required').max(100, 'Action reference too long'),
  authority: z.string().min(1, 'Authority is required').max(100, 'Authority too long'),
  consent_note: z.string().max(300, 'Consent note too long'),
  valid_from: z.string().min(1, 'Valid from is required'),
  expires_at: z.string().min(1, 'Expires at is required'),
});

export const watchpointsTriggersSchema = z.object({
  watchpoints: z.array(watchpointSchema),
  triggers: z.array(triggerSchema),
});

// Step 5 - Baselines & Publish
export const baselinesSchema = z.object({
  baselines: z.object({
    trust: z.number().min(0, 'Trust must be >= 0').max(1, 'Trust must be <= 1'),
    reciprocity: z.number().min(0, 'Reciprocity must be >= 0').max(1, 'Reciprocity must be <= 1'),
    integrity: z.number().min(0, 'Integrity must be >= 0').max(1, 'Integrity must be <= 1'),
    as_of: z.string().min(1, 'As of date is required'),
  }),
  reflex_note: z.string().min(1, 'Reflex note is required').max(500, 'Reflex note too long'),
  create_followup_task: z.boolean(),
});

// Complete form validation
export const completeFormSchema = basicsSchema
  .merge(indicatorsSourcesSchema)
  .merge(flowSchema)
  .merge(bandsSchema)
  .merge(watchpointsTriggersSchema)
  .merge(baselinesSchema);

export type CompleteFormData = z.infer<typeof completeFormSchema>;