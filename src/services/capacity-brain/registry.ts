// Capacity → Screen → Template Registry
// Static mapping of capacities to UI routes and templates

import type { Capacity, HandoffAction } from './types';

export interface CapacityScreenTemplate {
  route: string;
  template: string;
  defaultHandoffs: HandoffAction[];
}

export const CAPACITY_SCREEN_TEMPLATE: Record<Capacity, CapacityScreenTemplate> = {
  responsive: {
    route: '/workspace-5c/responsive/checkpoint',
    template: 'containment_pack',
    defaultHandoffs: [
      { to: 'reflexive', when: 'end_of_timebox' }
    ]
  },
  
  reflexive: {
    route: '/workspace-5c/reflexive/learning',
    template: 'learning_review',
    defaultHandoffs: []
  },
  
  deliberative: {
    route: '/workspace-5c/deliberative/portfolio',
    template: 'portfolio_compare',
    defaultHandoffs: [
      { to: 'structural', when: 'immediate' }
    ]
  },
  
  anticipatory: {
    route: '/workspace-5c/anticipatory/watchboard',
    template: 'readiness_plan',
    defaultHandoffs: [
      { to: 'responsive', when: 'immediate', template: 'containment_pack' }
    ]
  },
  
  structural: {
    route: '/workspace-5c/structural/dossier',
    template: 'dossier_draft',
    defaultHandoffs: [
      { to: 'responsive', when: 'immediate', template: 'pilot_rollout' },
      { to: 'reflexive', when: 'review_due', template: 'post_adoption_review' }
    ]
  }
};

// Template metadata for UI display
export interface TemplateMetadata {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  sprintLevel: 'N' | 'P' | 'S'; // Narrative, Policy, Structure
}

export const TEMPLATE_METADATA: Record<string, TemplateMetadata> = {
  // Responsive templates
  containment_pack: {
    id: 'containment_pack',
    title: 'Containment Pack',
    description: 'Immediate response playbook for breach containment',
    estimatedDuration: '2-4 hours',
    sprintLevel: 'P'
  },
  
  pilot_rollout: {
    id: 'pilot_rollout',
    title: 'Pilot Rollout',
    description: 'Controlled deployment of structural changes',
    estimatedDuration: '1-2 weeks',
    sprintLevel: 'P'
  },

  // Reflexive templates  
  learning_review: {
    id: 'learning_review',
    title: 'Learning Review',
    description: 'Post-action analysis and controller tuning',
    estimatedDuration: '3-5 days',
    sprintLevel: 'N'
  },
  
  post_adoption_review: {
    id: 'post_adoption_review',
    title: 'Post-Adoption Review',
    description: 'Evaluate structural changes and adjust parameters',
    estimatedDuration: '1 week',
    sprintLevel: 'N'
  },

  // Deliberative templates
  portfolio_compare: {
    id: 'portfolio_compare',
    title: 'Portfolio Comparison',
    description: 'Multi-criteria analysis of intervention options',
    estimatedDuration: '2-3 weeks',
    sprintLevel: 'N'
  },

  // Anticipatory templates
  readiness_plan: {
    id: 'readiness_plan',
    title: 'Readiness Plan',
    description: 'Pre-positioning resources and trigger configuration',
    estimatedDuration: '1-2 weeks',
    sprintLevel: 'P'
  },

  // Structural templates
  dossier_draft: {
    id: 'dossier_draft',
    title: 'Structural Dossier',
    description: 'Comprehensive proposal for systemic changes',
    estimatedDuration: '4-8 weeks',
    sprintLevel: 'S'
  },

  // Data Quality templates
  dq_review: {
    id: 'dq_review',
    title: 'Data Quality Review',
    description: 'Diagnose and resolve data quality issues',
    estimatedDuration: '1-2 days',
    sprintLevel: 'N'
  }
};

// Get template metadata by ID
export function getTemplateMetadata(templateId: string): TemplateMetadata | null {
  return TEMPLATE_METADATA[templateId] || null;
}

// Get capacity configuration
export function getCapacityConfig(capacity: Capacity): CapacityScreenTemplate {
  return CAPACITY_SCREEN_TEMPLATE[capacity];
}

// Validate capacity and template combination
export function isValidCapacityTemplate(capacity: Capacity, template: string): boolean {
  const config = CAPACITY_SCREEN_TEMPLATE[capacity];
  return config.template === template || 
         config.defaultHandoffs.some(h => h.template === template);
}