export type Id = string;

export type AnalysisFrameworkItem = {
  id: string;
  label: string;
  enabled: boolean;
};

export type DeliberativeAnalysisProps = {
  title: string;
  description: string;
  mode: string;
  modeDescription: string;
  
  // Analysis configuration
  timeframe: string;
  stakeholderGroup: string;
  objectives: string;
  analysisFramework: AnalysisFrameworkItem[];
  
  // Handlers
  onTimeframeChange: (timeframe: string) => void;
  onStakeholderGroupChange: (group: string) => void;
  onObjectivesChange: (objectives: string) => void;
  onFrameworkToggle: (id: string, enabled: boolean) => void;
  onInviteStakeholders: () => void;
  onBeginAnalysis: () => void;
  
  // UI state
  busy?: boolean;
  fullScreenMode?: boolean;
};