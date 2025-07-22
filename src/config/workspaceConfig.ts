export interface WorkspaceModule {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export interface WorkspaceConfig {
  title: string;
  modules: WorkspaceModule[];
  featureFlags: Record<string, boolean>;
}

export const defaultWorkspaceConfig: WorkspaceConfig = {
  title: "Workspace Pro",
  modules: [
    { id: 'ai', name: 'AI Copilot', enabled: true, order: 1 },
    { id: 'collab', name: 'Collaboration', enabled: true, order: 2 },
    { id: 'automation', name: 'Automation', enabled: true, order: 3 },
    { id: 'analytics', name: 'Analytics', enabled: true, order: 4 },
    { id: 'plugins', name: 'Plugins', enabled: true, order: 5 },
    { id: 'learning', name: 'Learning', enabled: false, order: 6 },
    { id: 'offline', name: 'Offline Support', enabled: false, order: 7 },
    { id: 'personal', name: 'Personalization', enabled: true, order: 8 },
    { id: 'security', name: 'Security', enabled: false, order: 9 }
  ],
  featureFlags: {
    workspacePro: true,
    aiCopilot: true,
    realTimeCollab: true,
    automation: true,
    advancedAnalytics: true,
    pluginSystem: true
  }
};