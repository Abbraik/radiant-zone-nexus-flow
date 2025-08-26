/**
 * Language Label System - i18n-lite with Expert/General modes
 */

export interface LabelDict {
  label_general: string;
  label_expert: string;
}

export type LangMode = 'general' | 'expert';

// Base workspace dictionary
export const workspaceDict: Record<string, LabelDict> = {
  WORKSPACE: { label_general: "Control center", label_expert: "Workspace-5C" },
  TENSION: { label_general: "Problem level", label_expert: "Severity" },
  GUARDRAIL: { label_general: "Safety settings", label_expert: "Guardrails" },
  SRT: { label_general: "Response rhythm", label_expert: "SRT" },
  BAND_BREACH: { label_general: "Safety limit exceeded", label_expert: "Guardrail breach" },
  TRI: { label_general: "Trust • Reciprocity • Integrity", label_expert: "TRI" },
  ACTUATION: { label_general: "Actions", label_expert: "Actuation" },
  OSCILLATION: { label_general: "Back-and-forth swings", label_expert: "Oscillation" },
  
  // Capacity labels
  RESPONSIVE_CAPACITY: { label_general: "Quick response", label_expert: "Responsive capacity" },
  REFLEXIVE: { label_general: "Auto-adjust", label_expert: "Reflexive" },
  DELIBERATIVE: { label_general: "Group decision", label_expert: "Deliberative" },
  STRUCTURAL: { label_general: "System change", label_expert: "Structural" },
  ANTICIPATORY: { label_general: "Early warning", label_expert: "Anticipatory" },
  
  // Status/Severity
  STATUS_CRITICAL: { label_general: "Emergency", label_expert: "Critical" },
  STATUS_HIGH: { label_general: "Above limits", label_expert: "High severity" },
  STATUS_MED: { label_general: "Moderate", label_expert: "Medium" },
  STATUS_LOW: { label_general: "Minor", label_expert: "Low" },
  STATUS_NORMAL: { label_general: "Safe", label_expert: "Normal" },
  
  // KPIs
  MTTD: { label_general: "Time to spot issue", label_expert: "MTTD" },
  MTTA: { label_general: "Time to respond", label_expert: "MTTA" },
  MTTR: { label_general: "Time to fix", label_expert: "MTTR" },
  
  // Actions & Tasks
  APPLY_START_SPRINT: { label_general: "Start quick response", label_expert: "Apply containment sprint" },
  CHECKPOINT: { label_general: "Status check", label_expert: "Checkpoint" },
  HANDOFF: { label_general: "Pass to team", label_expert: "Handoff" },
  MANDATE: { label_general: "Official permission", label_expert: "Mandate authorization" },
  DELEGATION: { label_general: "Passing authority down", label_expert: "Delegation structure" },
  AUTHORITY: { label_general: "Decision-making power", label_expert: "Authority source" },
  
  // Learning & Support
  LEARNING_HUB: { label_general: "Help & Guides", label_expert: "Learning Hub" },
  PURPOSE: { label_general: "What this does", label_expert: "Purpose" },
  WORKFLOWS: { label_general: "How to use", label_expert: "Workflows" },
  COMPONENTS: { label_general: "Tools available", label_expert: "Components" },
  EXPECTED_OUTPUTS: { label_general: "What you'll get", label_expert: "Expected outputs" },
  
  // Sharing
  SHARE: { label_general: "Share", label_expert: "Share" },
  SHARE_PUBLIC: { label_general: "Share publicly", label_expert: "Public share" },
  SHARE_PARTNER: { label_general: "Share with partners", label_expert: "Partner share" },
  SHARE_INTERNAL: { label_general: "Internal sharing", label_expert: "Internal share" },
  REDACTED: { label_general: "Private details hidden", label_expert: "Redacted view" },
};

// Responsive capacity dictionary
export const responsiveDict: Record<string, LabelDict> = {
  CONTAINMENT: { label_general: "Quick fix", label_expert: "Containment" },
  SPRINT: { label_general: "Quick response", label_expert: "Sprint" },
  CHECKPOINT: { label_general: "Progress check", label_expert: "Checkpoint" },
  ESCALATION: { label_general: "Get more help", label_expert: "Escalation" },
  STATUS_BANNER: { label_general: "Situation summary", label_expert: "Status banner" },
  INCIDENT_RESPONSE: { label_general: "Emergency response", label_expert: "Incident response" },
};

// Reflexive capacity dictionary
export const reflexiveDict: Record<string, LabelDict> = {
  LEARNING_DECK: { label_general: "Lessons learned", label_expert: "Learning deck" },
  CONTROLLER_TUNING: { label_general: "Auto-adjustment settings", label_expert: "Controller tuning" },
  ADAPTATION: { label_general: "System learning", label_expert: "Adaptation" },
  FEEDBACK_LOOP: { label_general: "Improvement cycle", label_expert: "Feedback loop" },
  VERDICT: { label_general: "Final assessment", label_expert: "Verdict" },
};

// Deliberative capacity dictionary
export const deliberativeDict: Record<string, LabelDict> = {
  DECISION_SESSION: { label_general: "Group meeting", label_expert: "Deliberative session" },
  CRITERIA: { label_general: "What matters", label_expert: "Decision criteria" },
  OPTIONS: { label_general: "Choices available", label_expert: "Options" },
  TRADEOFFS: { label_general: "Pros and cons", label_expert: "Tradeoffs" },
  CONSENSUS: { label_general: "Agreement", label_expert: "Consensus" },
  DECISION_NOTE: { label_general: "Decision summary", label_expert: "Decision note" },
  DOSSIER: { label_general: "Decision package", label_expert: "Dossier" },
  MANDATE_GATE: { label_general: "Permission check", label_expert: "Mandate gate" },
  PARTICIPATION: { label_general: "Who's involved", label_expert: "Participation" },
};

// Anticipatory capacity dictionary
export const anticipatoryDict: Record<string, LabelDict> = {
  EARLY_WARNING: { label_general: "Warning system", label_expert: "Early warning system" },
  WATCHPOINT: { label_general: "Watch area", label_expert: "Watchpoint" },
  TRIGGER_RULE: { label_general: "Alert rule", label_expert: "Trigger rule" },
  SCENARIO: { label_general: "What-if situation", label_expert: "Scenario" },
  PREPOSITION: { label_general: "Get ready action", label_expert: "Pre-position order" },
  READINESS_PLAN: { label_general: "Preparation plan", label_expert: "Readiness plan" },
  BUFFER: { label_general: "Safety margin", label_expert: "Buffer" },
  EWS_PROBABILITY: { label_general: "Warning likelihood", label_expert: "EWS probability" },
};

// Structural capacity dictionary
export const structuralDict: Record<string, LabelDict> = {
  SYSTEM_DESIGN: { label_general: "How things work", label_expert: "System architecture" },
  MANDATE: { label_general: "Official permission", label_expert: "Mandate authorization" },
  DELEGATION: { label_general: "Passing authority down", label_expert: "Delegation structure" },
  AUTHORITY: { label_general: "Decision-making power", label_expert: "Authority source" },
  BUDGET_ENVELOPE: { label_general: "Money available", label_expert: "Budget envelope" },
  GUARDRAILS: { label_general: "Safety rules", label_expert: "Guardrails" },
  PARTICIPATION_PLAN: { label_general: "Who gets involved", label_expert: "Participation plan" },
  PUBLIC_DOSSIER: { label_general: "Public summary", label_expert: "Public dossier" },
};

// Master dictionary combining all capacity dictionaries
export const masterDict: Record<string, LabelDict> = {
  ...workspaceDict,
  ...responsiveDict,
  ...reflexiveDict,
  ...deliberativeDict,
  ...anticipatoryDict,
  ...structuralDict,
};

/**
 * Get localized label based on current language mode
 */
export function label(dict: Record<string, LabelDict>, key: string, mode: LangMode = 'general'): string {
  const entry = dict[key] || masterDict[key];
  
  if (!entry) {
    console.warn(`Missing i18n key: ${key}`);
    return key;
  }
  
  return mode === 'expert' ? entry.label_expert : entry.label_general;
}

/**
 * Get both general and expert versions of a label
 */
export function labelBoth(dict: Record<string, LabelDict>, key: string): { general: string; expert: string } {
  const entry = dict[key] || masterDict[key];
  
  if (!entry) {
    console.warn(`Missing i18n key: ${key}`);
    return { general: key, expert: key };
  }
  
  return {
    general: entry.label_general,
    expert: entry.label_expert
  };
}