// Mission Control Data Types

export interface GlobalHealth {
  overall: number; // 0-100 percentage
  pillars: {
    think: number;
    act: number;
    monitor: number;
    innovate: number;
  };
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  target?: number;
  unit?: string;
  trend: 'up' | 'down' | 'stable';
  changePercent?: number;
  icon: string; // Lucide icon name
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  actionable: boolean;
  deepLink?: string;
}

export interface AIPrediction {
  id: string;
  prediction: string;
  confidence: number; // 0-100
  timeframe: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'resource' | 'timeline' | 'quality' | 'risk';
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  type: 'sprint' | 'milestone' | 'deadline' | 'review';
  status: 'planned' | 'active' | 'completed' | 'overdue';
  progress: number; // 0-100
  assignees: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ResourceMetric {
  id: string;
  name: string;
  category: 'budget' | 'personnel' | 'infrastructure' | 'tools';
  allocated: number;
  utilized: number;
  available: number;
  unit: string;
  burnRate: number; // per day/week/month
  forecast: number[];
  status: 'healthy' | 'warning' | 'critical';
}

export interface DigitalTwinData {
  id: string;
  name: string;
  type: 'loop' | 'sprint' | 'intervention' | 'system';
  status: 'running' | 'paused' | 'completed' | 'error';
  metrics: {
    efficiency: number;
    quality: number;
    velocity: number;
    satisfaction: number;
  };
  lastRun: Date;
  nextRun?: Date;
  responseData: number[]; // For micro-charts
}

export interface GoalTreeNode {
  id: string;
  title: string;
  type: 'goal' | 'okr' | 'task';
  parentId?: string;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  assignees: string[];
  children?: GoalTreeNode[];
}

export interface PresenceData {
  onlineUsers: {
    id: string;
    name: string;
    avatar?: string;
    currentTask?: string;
    zone: 'think' | 'act' | 'monitor' | 'innovate' | 'mission-control';
    lastActive: Date;
  }[];
  activeSessions: number;
  pairWorkSessions: number;
}

export interface MissionControlData {
  globalHealth: GlobalHealth;
  kpis: KPIMetric[];
  alerts: Alert[];
  predictions: AIPrediction[];
  timeline: TimelineEvent[];
  resources: ResourceMetric[];
  digitalTwins: DigitalTwinData[];
  goalTree: GoalTreeNode[];
  presence: PresenceData;
  systemStatus: {
    online: boolean;
    latency: number;
    uptime: number;
    lastSync: Date;
  };
}