import React, { Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { Zone, TaskType, ZoneBundleProps, ZoneBundleDefinition } from '@/types/zone-bundles';

// Lazy load zone bundle components
const ThinkZoneBundle = React.lazy(() => import('./zone-bundles/ThinkZoneBundle'));
const ActZoneBundle = React.lazy(() => import('./zone-bundles/ActZoneBundle'));
const MonitorZoneBundle = React.lazy(() => import('./zone-bundles/MonitorZoneBundle'));
const InnovateZoneBundle = React.lazy(() => import('./zone-bundles/InnovateZoneBundle'));

// Zone bundle registry with mapping matrix
const ZONE_BUNDLE_REGISTRY: Record<Zone, ZoneBundleDefinition> = {
  THINK: {
    zone: 'THINK',
    taskTypes: ['loop_design', 'general'],
    component: ThinkZoneBundle,
    validationRules: [
      {
        key: 'has_nodes',
        message: 'At least one Population, Domain, or Institution node required',
        validator: (payload) => payload?.nodes?.length > 0,
        required: true
      },
      {
        key: 'has_indicator',
        message: 'At least one indicator with band method required',
        validator: (payload) => payload?.indicators?.some((i: any) => i.bandMethod),
        required: true
      },
      {
        key: 'no_dangling_edges',
        message: 'No dangling edges allowed',
        validator: (payload) => !payload?.edges?.some((e: any) => !e.source || !e.target),
        required: true
      }
    ],
    checklistItems: [
      { id: 'purpose', label: 'Define loop purpose and steward', required: true, order: 1 },
      { id: 'nodes', label: 'Add Population/Domain/Institution nodes', required: true, order: 2 },
      { id: 'indicators', label: 'Map ≥1 indicator + band/guardrail', required: true, order: 3 },
      { id: 'levers', label: 'Map Meadows lever + instrument family', required: true, order: 4 },
      { id: 'publish', label: 'Validate + Publish to MONITOR', required: true, order: 5 }
    ]
  },
  ACT: {
    zone: 'ACT',
    taskTypes: ['sprint_planning', 'general'],
    component: ActZoneBundle,
    validationRules: [
      {
        key: 'instrument_selected',
        message: 'At least one instrument must be selected',
        validator: (payload) => payload?.instruments?.length > 0,
        required: true
      },
      {
        key: 'pathway_valid',
        message: 'Pathway graph must be complete',
        validator: (payload) => payload?.pathway?.isValid,
        required: true
      },
      {
        key: 'mandate_gate',
        message: 'Mandate gate must be passed or waiver attached',
        validator: (payload) => payload?.mandateGate?.passed || payload?.mandateGate?.waiver,
        required: true
      }
    ],
    checklistItems: [
      { id: 'instruments', label: 'Choose instrument(s)', required: true, order: 1 },
      { id: 'pathway', label: 'Build pathway graph', required: true, order: 2 },
      { id: 'mandate', label: 'Pass Mandate Gate or attach waiver', required: true, order: 3 },
      { id: 'raci', label: 'Define RACI + timeframe', required: true, order: 4 },
      { id: 'submit', label: 'Submit sprint plan', required: true, order: 5 }
    ]
  },
  MONITOR: {
    zone: 'MONITOR',
    taskTypes: ['breach_response', 'general'],
    component: MonitorZoneBundle,
    validationRules: [
      {
        key: 'breach_acknowledged',
        message: 'Breach must be acknowledged',
        validator: (payload) => payload?.breach?.acknowledged,
        required: true
      },
      {
        key: 'triage_decision',
        message: 'Triage decision must be made',
        validator: (payload) => payload?.triage?.decision,
        required: true
      },
      {
        key: 'playbook_assigned',
        message: 'Playbook must be assigned',
        validator: (payload) => payload?.playbook?.id,
        required: true
      }
    ],
    checklistItems: [
      { id: 'acknowledge', label: 'Acknowledge breach', required: true, order: 1 },
      { id: 'playbook', label: 'Select playbook', required: true, order: 2 },
      { id: 'owner', label: 'Assign owner & deadline', required: true, order: 3 },
      { id: 'link', label: 'Link to loop/sprint', required: true, order: 4 }
    ]
  },
  INNOVATE: {
    zone: 'INNOVATE',
    taskTypes: ['experiment_design', 'general'],
    component: InnovateZoneBundle,
    validationRules: [
      {
        key: 'hypothesis_complete',
        message: 'Hypothesis and outcome metric required',
        validator: (payload) => payload?.hypothesis && payload?.outcomeMetric,
        required: true
      },
      {
        key: 'evaluation_design',
        message: 'Evaluation design must be selected',
        validator: (payload) => payload?.evaluationDesign?.type,
        required: true
      },
      {
        key: 'stop_scale_rules',
        message: 'Stop/scale rules must be defined',
        validator: (payload) => payload?.stopScaleRules?.length > 0,
        required: true
      }
    ],
    checklistItems: [
      { id: 'hypothesis', label: 'State hypothesis & outcome metric', required: true, order: 1 },
      { id: 'design', label: 'Select evaluation design', required: true, order: 2 },
      { id: 'register', label: 'Register experiment', required: true, order: 3 },
      { id: 'rules', label: 'Define stop/scale rules', required: true, order: 4 }
    ]
  }
};

interface DynamicZoneBundleLoaderProps {
  zone: Zone;
  taskType: TaskType;
  taskId: string;
  taskData: any;
  payload: any;
  onPayloadUpdate: (payload: any) => void;
  onValidationChange: (isValid: boolean) => void;
  readonly?: boolean;
}

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center p-12"
  >
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading zone bundle...</p>
    </div>
  </motion.div>
);

export function DynamicZoneBundleLoader({
  zone,
  taskType,
  taskId,
  taskData,
  payload,
  onPayloadUpdate,
  onValidationChange,
  readonly = false
}: DynamicZoneBundleLoaderProps) {
  const bundleDefinition = useMemo(() => {
    return ZONE_BUNDLE_REGISTRY[zone];
  }, [zone]);

  const bundleProps: ZoneBundleProps = {
    taskId,
    taskData,
    payload,
    onPayloadUpdate,
    onValidationChange,
    readonly
  };

  if (!bundleDefinition) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Unknown zone: {zone}</p>
          <p className="text-sm text-muted-foreground">
            This zone type is not supported yet.
          </p>
        </div>
      </div>
    );
  }

  const BundleComponent = bundleDefinition.component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Suspense fallback={<LoadingSkeleton />}>
        <BundleComponent {...bundleProps} />
      </Suspense>
    </motion.div>
  );
}

export function resolveBundle(zone: Zone, taskType: TaskType): ZoneBundleDefinition | null {
  const bundle = ZONE_BUNDLE_REGISTRY[zone];
  if (!bundle) return null;
  
  // Check if task type is supported by this zone
  if (!bundle.taskTypes.includes(taskType)) {
    return null;
  }
  
  return bundle;
}

export function validateBundlePayload(zone: Zone, payload: any): {
  isValid: boolean;
  errors: string[];
} {
  const bundle = ZONE_BUNDLE_REGISTRY[zone];
  if (!bundle) {
    return { isValid: false, errors: ['Unknown zone'] };
  }

  const errors: string[] = [];
  
  for (const rule of bundle.validationRules) {
    if (rule.required && !rule.validator(payload)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export { ZONE_BUNDLE_REGISTRY };