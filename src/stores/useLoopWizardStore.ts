import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LoopFormData {
  // Step 0 - Basics & Doctrine
  name: string;
  loop_code: string;
  description: string;
  type: 'reactive' | 'perceptual' | 'structural';
  scale: 'micro' | 'meso' | 'macro';
  domain: string;
  layer: string;
  doctrine_reference: string;

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

  // Step 3 - Adaptive Bands
  bands: Array<{
    indicator: string;
    lower_bound: number;
    upper_bound: number;
    asymmetry: number;
    smoothing_alpha: number;
    notes: string;
  }>;

  // Step 4 - Watchpoints & Triggers
  watchpoints: Array<{
    indicator: string;
    direction: 'up' | 'down' | 'band';
    threshold_value: number | null;
    threshold_band: Record<string, any> | null;
    armed: boolean;
  }>;
  triggers: Array<{
    name: string;
    condition: string;
    threshold: number;
    window_hours: number;
    action_ref: string;
    authority: string;
    consent_note: string;
    valid_from: string;
    expires_at: string;
  }>;

  // Step 5 - Baselines & Publish
  baselines: {
    trust: number;
    reciprocity: number;
    integrity: number;
    as_of: string;
  };
  reflex_note: string;
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
  
  addWatchpoint: () => void;
  removeWatchpoint: (index: number) => void;
  updateWatchpoint: (index: number, updates: Partial<LoopFormData['watchpoints'][0]>) => void;
  
  addTrigger: () => void;
  removeTrigger: (index: number) => void;
  updateTrigger: (index: number, updates: Partial<LoopFormData['triggers'][0]>) => void;
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
  
  indicators: [],
  sources: [],
  
  nodes: [],
  edges: [],
  
  bands: [],
  
  watchpoints: [],
  triggers: [],
  
  baselines: {
    trust: 0.6,
    reciprocity: 0.6,
    integrity: 0.6,
    as_of: new Date().toISOString(),
  },
  reflex_note: '',
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

      // Watchpoint actions
      addWatchpoint: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            watchpoints: [
              ...state.formData.watchpoints,
              {
                indicator: '',
                direction: 'up' as const,
                threshold_value: 0,
                threshold_band: null,
                armed: true,
              },
            ],
          },
        })),

      removeWatchpoint: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            watchpoints: state.formData.watchpoints.filter((_, i) => i !== index),
          },
        })),

      updateWatchpoint: (index, updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            watchpoints: state.formData.watchpoints.map((watchpoint, i) =>
              i === index ? { ...watchpoint, ...updates } : watchpoint
            ),
          },
        })),

      // Trigger actions
      addTrigger: () =>
        set((state) => ({
          formData: {
            ...state.formData,
            triggers: [
              ...state.formData.triggers,
              {
                name: '',
                condition: '',
                threshold: 0,
                window_hours: 24,
                action_ref: '',
                authority: '',
                consent_note: '',
                valid_from: 'now',
                expires_at: 'in_180d',
              },
            ],
          },
        })),

      removeTrigger: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            triggers: state.formData.triggers.filter((_, i) => i !== index),
          },
        })),

      updateTrigger: (index, updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            triggers: state.formData.triggers.map((trigger, i) =>
              i === index ? { ...trigger, ...updates } : trigger
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