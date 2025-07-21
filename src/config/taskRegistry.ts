export interface TaskType {
  id: string;
  title: string;
  description: string;
  zone: 'think' | 'act' | 'monitor' | 'innovate-learn';
  type: string;
  components: string[];
}

export const taskRegistry: Record<string, string[]> = {
  // Think Zone Tasks
  define_tension: ['TensionSelector', 'SRTRangeSlider'],
  analyze_sprint: ['SprintAnalyzer', 'TensionChips'],
  set_srt_range: ['SRTRangeSlider', 'PolicySelector'],
  
  // Act Zone Tasks  
  publish_bundle: ['InterventionPicker', 'BundlePreview', 'SmartRolesPanel'],
  assign_roles: ['SmartRolesPanel', 'RACIMatrix'],
  schedule_interventions: ['InterventionScheduler', 'DependencyGraph'],
  
  // Monitor Zone Tasks
  review_tri: ['LoopTable', 'TRIDetailDrawer'],
  check_system_health: ['PulseBarOverview', 'LoopTable'],
  analyze_trends: ['TrendSparklines', 'AdvancedAnalytics'],
  
  // Innovate-Learn Zone Tasks
  run_simulation: ['SimulationParams', 'SimulationPreview'],
  capture_insight: ['InsightFeed', 'ExperimentStudio'],
  export_knowledge: ['KnowledgeGraph', 'OrsExporter']
};

export const mockTasks: TaskType[] = [
  {
    id: '1',
    title: 'Define Sprint Tension',
    description: 'Set up tension parameters for the current sprint cycle',
    zone: 'think',
    type: 'define_tension',
    components: taskRegistry.define_tension
  },
  {
    id: '2', 
    title: 'Publish Policy Bundle',
    description: 'Create and validate intervention bundle for Loop Alpha',
    zone: 'act',
    type: 'publish_bundle',
    components: taskRegistry.publish_bundle
  },
  {
    id: '3',
    title: 'Review TRI Scores',
    description: 'Monitor system health and TRI performance metrics',
    zone: 'monitor', 
    type: 'review_tri',
    components: taskRegistry.review_tri
  },
  {
    id: '4',
    title: 'Run Shock Simulation',
    description: 'Test system resilience with parameter variations',
    zone: 'innovate-learn',
    type: 'run_simulation', 
    components: taskRegistry.run_simulation
  }
];