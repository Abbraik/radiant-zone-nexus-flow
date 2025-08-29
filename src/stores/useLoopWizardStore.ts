import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoopFormData {
  // Step 0 - Paradigm & Doctrine (RRE Enhanced)
  name: string;
  loop_code: string;
  description: string;
  type: 'reactive' | 'perceptual' | 'structural';
  scale: 'micro' | 'meso' | 'macro';
  domain: string;
  layer: string;
  doctrine_reference: string;
  
  // RRE Paradigm Fields
  worldview: 'cas' | 'coherence' | 'systems' | 'other';
  paradigm_statement: string;
  coherence_principles: string[];
  cas_assumptions: string;

  // Step 1 - Indicators & Sources
  indicators: Array<{
    indicator_key: string;
    title: string;
    unit: string;
    triad_tag: 'population' | 'domain' | 'institution';
    notes: string;
  }>;
  sources: Array<{
    name: string;
    type: 'pull' | 'push' | 'file';
    provider: string;
    schedule_cron: string;
    schema_version: number;
    enabled: boolean;
    pii_class: 'none' | 'low' | 'medium' | 'high' | 'restricted';
    config: Record<string, any>;
  }>;

  // Step 2 - Nodes & Edges (React Flow)
  nodes: Array<{
    label: string;
    kind: 'stock' | 'flow' | 'aux' | 'actor' | 'indicator';
    meta: Record<string, any>;
    pos: { x: number; y: number };
  }>;
  edges: Array<{
    from_label: string;
    to_label: string;
    polarity: -1 | 1;
    delay_ms: number;
    weight: number;
    note: string;
  }>;

  // Step 3 - Loop Atlas (RRE Enhanced)
  bands: Array<{
    indicator: string;
    lower_bound: number;
    upper_bound: number;
    asymmetry: number;
    smoothing_alpha: number;
    notes: string;
  }>;
  
  // RRE Loop Atlas Fields
  loop_classification: Array<{
    from_node: string;
    to_node: string;
    loop_type: 'reinforcing' | 'balancing';
    description: string;
    leverage_points: string[];
  }>;
  system_purpose: string;
  key_feedbacks: string[];

  // Step 4 - Modules & Experiments (RRE)
  experiments: Array<{
    name: string;
    hypothesis: string;
    methodology: 'did' | 'rct' | 'synthetic_control' | 'other';
    success_criteria: string;
    timeline_weeks: number;
    resources_required: string;
    evaluation_plan: string;
    ethical_considerations: string;
  }>;
  
  pilots: Array<{
    name: string;
    objective: string;
    scope: string;
    duration_weeks: number;
    stakeholders: string[];
    risk_mitigation: string;
    learning_objectives: string[];
  }>;

  // Step 5 - Baselines & Reflex Memory (RRE Enhanced)
  baselines: {
    trust: number;
    reciprocity: number;
    integrity: number;
    as_of: string;
  };
  
  // Enhanced Reflex Memory
  reflex_memory: {
    learning_objectives: string[];
    adaptation_triggers: string[];
    success_patterns: string;
    failure_patterns: string;
    contextual_factors: string;
    stakeholder_insights: string;
  };
  
  // RRE Outputs Configuration
  generate_paradigm_statement: boolean;
  generate_aggregate_dashboard: boolean;
  generate_loop_atlas: boolean;
  generate_module_reports: boolean;
  create_followup_task: boolean;
}

interface LoopWizardStore {
  currentStep: number;
  formData: LoopFormData;
  isLoading: boolean;
  errors: Record<string, string>;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (updates: Partial<LoopFormData>) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  
  // Step-specific actions
  addIndicator: () => void;
  removeIndicator: (index: number) => void;
  updateIndicator: (index: number, updates: Partial<LoopFormData['indicators'][0]>) => void;
  
  addSource: () => void;
  removeSource: (index: number) => void;
  updateSource: (index: number, updates: Partial<LoopFormData['sources'][0]>) => void;
  
  addExperiment: () => void;
  removeExperiment: (index: number) => void;
  updateExperiment: (index: number, updates: Partial<LoopFormData['experiments'][0]>) => void;
  
  addPilot: () => void;
  removePilot: (index: number) => void;
  updatePilot: (index: number, updates: Partial<LoopFormData['pilots'][0]>) => void;
  
  addLoopClassification: () => void;
  removeLoopClassification: (index: number) => void;
  updateLoopClassification: (index: number, updates: Partial<LoopFormData['loop_classification'][0]>) => void;
}

const initialFormData: LoopFormData = {
  name: '',
  loop_code: '',
  description: '',
  type: 'reactive',
  scale: 'micro',
  domain: '',
  layer: '',
  doctrine_reference: '',
  
  // RRE Paradigm Fields
  worldview: 'cas',
  paradigm_statement: '',
  coherence_principles: [],
  cas_assumptions: '',
  
  indicators: [],
  sources: [],
  
  nodes: [],
  edges: [],
  
  bands: [],
  loop_classification: [],
  system_purpose: '',
  key_feedbacks: [],
  
  experiments: [],
  pilots: [],
  
  baselines: {
    trust: 0.6,
    reciprocity: 0.6,
    integrity: 0.6,
    as_of: new Date().toISOString(),
  },
  
  reflex_memory: {
    learning_objectives: [],
    adaptation_triggers: [],
    success_patterns: '',
    failure_patterns: '',
    contextual_factors: '',
    stakeholder_insights: '',
  },
  
  generate_paradigm_statement: true,
  generate_aggregate_dashboard: true,
  generate_loop_atlas: true,
  generate_module_reports: true,
  create_followup_task: false,
};

export const useLoopWizardStore = create<LoopWizardStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: initialFormData,
      isLoading: false,
      errors: {},

      setCurrentStep: (step) => set({ currentStep: step }),

      updateFormData: (updates) =>
        set((state) => ({
          formData: { ...state.formData, ...updates },
        })),

      setError: (field, message) =>
        set((state) => ({
          errors: { ...state.errors, [field]: message },
        })),

      clearError: (field) =>
        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[field];
          return { errors: newErrors };
        }),

      clearAllErrors: () => set({ errors: {} }),

      resetForm: () => set({ 
        formData: { 
          ...initialFormData, 
          baselines: { 
            ...initialFormData.baselines, 
            as_of: new Date().toISOString() 
          } 
        }, 
        currentStep: 0, 
        errors: {} 
      }),

      setLoading: (loading) => set({ isLoading: loading }),

      // Indicator actions
      addIndicator: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            indicators: [
              ...state.formData.indicators,
              {
                indicator_key: '',
                title: '',
                unit: '',
                triad_tag: 'population' as const,
                notes: '',
              },
            ],
          },
        })),

      removeIndicator: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            indicators: state.formData.indicators.filter((_, i) => i !== index),
          },
        })),

      updateIndicator: (index, updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            indicators: state.formData.indicators.map((indicator, i) =>
              i === index ? { ...indicator, ...updates } : indicator
            ),
          },
        })),

      // Source actions
      addSource: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            sources: [
              ...state.formData.sources,
              {
                name: '',
                type: 'pull' as const,
                provider: '',
                schedule_cron: '0 6 * * *',
                schema_version: 1,
                enabled: true,
                pii_class: 'none' as const,
                config: {},
              },
            ],
          },
        })),

      removeSource: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            sources: state.formData.sources.filter((_, i) => i !== index),
          },
        })),

      updateSource: (index, updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            sources: state.formData.sources.map((source, i) =>
              i === index ? { ...source, ...updates } : source
            ),
          },
        })),

       // Experiment actions
       addExperiment: () =>
         set((state) => ({
           formData: {
             ...state.formData,
             experiments: [
               ...state.formData.experiments,
               {
                 name: '',
                 hypothesis: '',
                 methodology: 'rct' as const,
                 success_criteria: '',
                 timeline_weeks: 12,
                 resources_required: '',
                 evaluation_plan: '',
                 ethical_considerations: '',
               },
             ],
           },
         })),

       removeExperiment: (index) =>
         set((state) => ({
           formData: {
             ...state.formData,
             experiments: state.formData.experiments.filter((_, i) => i !== index),
           },
         })),

       updateExperiment: (index, updates) =>
         set((state) => ({
           formData: {
             ...state.formData,
             experiments: state.formData.experiments.map((experiment, i) =>
               i === index ? { ...experiment, ...updates } : experiment
             ),
           },
         })),

       // Pilot actions
       addPilot: () =>
         set((state) => ({
           formData: {
             ...state.formData,
             pilots: [
               ...state.formData.pilots,
               {
                 name: '',
                 objective: '',
                 scope: '',
                 duration_weeks: 8,
                 stakeholders: [],
                 risk_mitigation: '',
                 learning_objectives: [],
               },
             ],
           },
         })),

       removePilot: (index) =>
         set((state) => ({
           formData: {
             ...state.formData,
             pilots: state.formData.pilots.filter((_, i) => i !== index),
           },
         })),

       updatePilot: (index, updates) =>
         set((state) => ({
           formData: {
             ...state.formData,
             pilots: state.formData.pilots.map((pilot, i) =>
               i === index ? { ...pilot, ...updates } : pilot
             ),
           },
         })),

       // Loop Classification actions
       addLoopClassification: () =>
         set((state) => ({
           formData: {
             ...state.formData,
             loop_classification: [
               ...state.formData.loop_classification,
               {
                 from_node: '',
                 to_node: '',
                 loop_type: 'reinforcing' as const,
                 description: '',
                 leverage_points: [],
               },
             ],
           },
         })),

       removeLoopClassification: (index) =>
         set((state) => ({
           formData: {
             ...state.formData,
             loop_classification: state.formData.loop_classification.filter((_, i) => i !== index),
           },
         })),

       updateLoopClassification: (index, updates) =>
         set((state) => ({
           formData: {
             ...state.formData,
             loop_classification: state.formData.loop_classification.map((classification, i) =>
               i === index ? { ...classification, ...updates } : classification
             ),
           },
         })),
    }),
    {
      name: 'loop-wizard-storage',
      partialize: (state) => ({ 
        formData: state.formData, 
        currentStep: state.currentStep 
      }),
    }
  )
);