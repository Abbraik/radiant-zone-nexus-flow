// Task Engine V2 Capacity Templates for 5C Integration
import type { Capacity5C } from '@/5c/types';
import type { TaskPriority } from '@/types/taskEngine';

export interface CapacityTaskTemplate {
  capacity: Capacity5C;
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedDuration: number;
  context: Record<string, any>;
  tri?: {
    t_value: number;
    r_value: number;
    i_value: number;
  };
}

// Predefined templates for each 5C capacity type
export const CAPACITY_TEMPLATES: Record<Capacity5C, CapacityTaskTemplate[]> = {
  responsive: [
    {
      capacity: 'responsive',
      title: 'Reactive Signal Processing',
      description: 'Process and respond to incoming signals requiring immediate action',
      priority: 'high',
      estimatedDuration: 60,
      context: {
        loop_type: 'reactive',
        scale: 'micro',
        leverage: 'P',
        urgency: 'immediate'
      },
      tri: { t_value: 0.8, r_value: 0.3, i_value: 0.2 }
    },
    {
      capacity: 'responsive',
      title: 'Emergency Response Coordination',
      description: 'Coordinate rapid response to unexpected events',
      priority: 'critical',
      estimatedDuration: 45,
      context: {
        loop_type: 'reactive',
        scale: 'meso',
        leverage: 'N',
        response_type: 'emergency'
      },
      tri: { t_value: 0.9, r_value: 0.2, i_value: 0.1 }
    }
  ],

  reflexive: [
    {
      capacity: 'reflexive',
      title: 'System Reflex Tuning',
      description: 'Adjust and calibrate automatic system responses',
      priority: 'medium',
      estimatedDuration: 90,
      context: {
        loop_type: 'structural',
        scale: 'meso',
        leverage: 'S',
        adjustment_type: 'reflex_tuning'
      },
      tri: { t_value: 0.4, r_value: 0.7, i_value: 0.3 }
    },
    {
      capacity: 'reflexive',
      title: 'Pattern Recognition Enhancement',
      description: 'Improve automated pattern detection and response',
      priority: 'medium',
      estimatedDuration: 120,
      context: {
        loop_type: 'structural',
        scale: 'macro',
        leverage: 'P',
        enhancement_type: 'pattern_recognition'
      },
      tri: { t_value: 0.3, r_value: 0.8, i_value: 0.4 }
    }
  ],

  deliberative: [
    {
      capacity: 'deliberative',
      title: 'Strategic Option Assessment',
      description: 'Evaluate multiple strategic options for complex decisions',
      priority: 'high',
      estimatedDuration: 180,
      context: {
        loop_type: 'perceptual',
        scale: 'macro',
        leverage: 'S',
        decision_horizon: 'long_term'
      },
      tri: { t_value: 0.2, r_value: 0.4, i_value: 0.9 }
    },
    {
      capacity: 'deliberative',
      title: 'Stakeholder Consensus Building',
      description: 'Facilitate consensus among multiple stakeholders',
      priority: 'medium',
      estimatedDuration: 150,
      context: {
        loop_type: 'perceptual',
        scale: 'meso',
        leverage: 'P',
        consensus_type: 'multi_stakeholder'
      },
      tri: { t_value: 0.3, r_value: 0.6, i_value: 0.8 }
    }
  ],

  anticipatory: [
    {
      capacity: 'anticipatory',
      title: 'Scenario Planning Workshop',
      description: 'Develop and analyze future scenarios for strategic planning',
      priority: 'medium',
      estimatedDuration: 240,
      context: {
        loop_type: 'perceptual',
        scale: 'macro',
        leverage: 'S',
        scenario_type: 'strategic_planning'
      },
      tri: { t_value: 0.1, r_value: 0.3, i_value: 0.9 }
    },
    {
      capacity: 'anticipatory',
      title: 'Early Warning System Setup',
      description: 'Configure predictive monitoring for emerging risks',
      priority: 'high',
      estimatedDuration: 120,
      context: {
        loop_type: 'reactive',
        scale: 'meso',
        leverage: 'N',
        monitoring_type: 'predictive'
      },
      tri: { t_value: 0.2, r_value: 0.5, i_value: 0.8 }
    }
  ],

  structural: [
    {
      capacity: 'structural',
      title: 'System Architecture Review',
      description: 'Review and optimize overall system structure',
      priority: 'medium',
      estimatedDuration: 300,
      context: {
        loop_type: 'structural',
        scale: 'macro',
        leverage: 'S',
        review_type: 'architecture'
      },
      tri: { t_value: 0.1, r_value: 0.9, i_value: 0.7 }
    },
    {
      capacity: 'structural',
      title: 'Governance Framework Update',
      description: 'Update organizational governance structures',
      priority: 'high',
      estimatedDuration: 360,
      context: {
        loop_type: 'structural',
        scale: 'macro',
        leverage: 'S',
        governance_type: 'framework_update'
      },
      tri: { t_value: 0.1, r_value: 0.8, i_value: 0.8 }
    }
  ]
};

// Helper to get templates by capacity
export const getTemplatesByCapacity = (capacity: Capacity5C): CapacityTaskTemplate[] => {
  return CAPACITY_TEMPLATES[capacity] || [];
};

// Helper to create TaskV2 compatible data from template
export const templateToTaskData = (template: CapacityTaskTemplate) => ({
  title: template.title,
  description: template.description,
  priority: template.priority,
  estimated_duration: template.estimatedDuration,
  context: {
    ...template.context,
    capacity: template.capacity,
    tri: template.tri,
    is_5c_task: true
  }
});

// Default context for capacity types
export const DEFAULT_CAPACITY_CONTEXT: Record<Capacity5C, Record<string, any>> = {
  responsive: {
    loop_type: 'reactive',
    scale: 'micro',
    leverage: 'P',
    urgency: 'medium'
  },
  reflexive: {
    loop_type: 'structural',
    scale: 'meso',
    leverage: 'S',
    adjustment_type: 'standard'
  },
  deliberative: {
    loop_type: 'perceptual',
    scale: 'meso',
    leverage: 'P',
    decision_horizon: 'medium_term'
  },
  anticipatory: {
    loop_type: 'perceptual',
    scale: 'macro',
    leverage: 'S',
    forecast_horizon: 'long_term'
  },
  structural: {
    loop_type: 'structural',
    scale: 'macro',
    leverage: 'S',
    change_type: 'incremental'
  }
};