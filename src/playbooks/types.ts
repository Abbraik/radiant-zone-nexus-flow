export type PlaybookAction = { key: string; label: string; params?: Record<string, any>; };

export type ResponsivePlaybook = {
  id: string;
  name: string;
  loops: string[];                 // loop codes
  conditions?: Record<string, any>;
  actions: PlaybookAction[];
  guardrails?: string[];
};