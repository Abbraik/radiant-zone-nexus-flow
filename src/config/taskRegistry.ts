export interface TaskType {
  id: string;
  title: string;
  description: string;
  zone: 'think' | 'act' | 'monitor' | 'innovate-learn';
  type: string;
  components: string[];
}

export const taskRegistry: Record<string, string[]> = {
  // Think Zone Tasks - Use zone workspace for full experience
  define_tension: ['ZoneWorkspace'],
  analyze_sprint: ['ZoneWorkspace'], 
  set_srt_range: ['ZoneWorkspace'],
  
  // Act Zone Tasks - Use zone workspace for full experience
  publish_bundle: ['ZoneWorkspace'],
  assign_roles: ['ZoneWorkspace'],
  schedule_interventions: ['ZoneWorkspace'],
  
  // Monitor Zone Tasks - Use zone workspace for full experience
  review_tri: ['ZoneWorkspace'],
  check_system_health: ['ZoneWorkspace'],
  analyze_trends: ['ZoneWorkspace'],
  
  // Innovate-Learn Zone Tasks - Use zone workspace for full experience
  run_simulation: ['ZoneWorkspace'],
  capture_insight: ['ZoneWorkspace'],
  export_knowledge: ['ZoneWorkspace'],
  
  // Phase 2: 3D Enhanced Tasks
  view_cascade_3d: ['Cascade3DViewer'],
  monitor_digital_twin: ['DigitalTwinPreview', 'TrendSparklines']
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
  },
  {
    id: '5',
    title: 'View 3D Goals Cascade',
    description: 'Interactive 3D visualization of goal dependencies and progress',
    zone: 'think',
    type: 'view_cascade_3d',
    components: taskRegistry.view_cascade_3d
  },
  {
    id: '6',
    title: 'Monitor Digital Twin',
    description: 'Real-time digital twin analysis with system performance metrics',
    zone: 'monitor',
    type: 'monitor_digital_twin',
    components: taskRegistry.monitor_digital_twin
  }
];