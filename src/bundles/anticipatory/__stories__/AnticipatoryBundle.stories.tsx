import React from "react";
import AnticipatoryBundle from "../AnticipatoryBundle";

// Example stories for development - can be used without Storybook
export default {
  title: "Workspace5C/AnticipatoryBundle",
  component: AnticipatoryBundle
};

export const RiskWatchboard = () => (
  <AnticipatoryBundle
    loopCode="MAC-L06"
    screen="risk-watchboard"
    ewsProb={0.78}
    leadTimeDays={9}
    bufferAdequacy={0.32}
    consentRequired={false}
    watchboard={[
      { riskChannel: "ExternalDemand", ewsProb: 0.82, trend: "up", leadTimeDays: 9, linkedLoops: ["MAC-L06","MES-L03"], bufferAdequacy: 0.32 },
      { riskChannel: "Heat", ewsProb: 0.66, trend: "flat", leadTimeDays: 6, linkedLoops: ["MES-L01"], bufferAdequacy: 0.5 },
      { riskChannel: "WaterStress", ewsProb: 0.58, trend: "up", leadTimeDays: 14, linkedLoops: ["MES-L08"], bufferAdequacy: 0.41 },
    ]}
    ewsComposition={[]}
    buffers={[]}
    scenarios={[]}
    prePositionPacks={[]}
    triggerTemplates={[]}
    handoff={{ enableResponsive: true, enableDeliberative: false, enableStructural: false, onHandoff: (to)=>alert(to) }}
    onArmWatchpoint={(rc)=>alert(`Arm ${rc}`)}
    onEvent={console.log}
  />
);

export const ScenarioSimulator = () => (
  <AnticipatoryBundle
    loopCode="MAC-L06"
    screen="scenario-sim"
    ewsProb={0.78}
    leadTimeDays={9}
    bufferAdequacy={0.32}
    consentRequired={true}
    ewsComposition={[]}
    buffers={[]}
    scenarios={[
      { id: "s1", name: "Heat + 3°C", summary: "High temperature scenario with supply chain impacts" },
      { id: "s2", name: "Supply Shock", summary: "Major supplier disruption scenario" },
      { id: "s3", name: "Demand Surge", summary: "Unexpected demand increase scenario" },
    ]}
    prePositionPacks={[]}
    triggerTemplates={[]}
    handoff={{ enableResponsive: false, enableDeliberative: true, enableStructural: false, onHandoff: (to)=>alert(to) }}
    onRunScenario={(id)=>alert(`Run ${id}`)}
    onEvent={console.log}
  />
);

export const PrePositioner = () => (
  <AnticipatoryBundle
    loopCode="MAC-L06"
    screen="pre-positioner"
    ewsProb={0.78}
    leadTimeDays={9}
    bufferAdequacy={0.32}
    consentRequired={false}
    ewsComposition={[]}
    buffers={[]}
    scenarios={[]}
    prePositionPacks={[
      { 
        id: "pack1", 
        title: "Resource Pack", 
        items: [
          { label: "Emergency supplies", note: "72hr capacity" },
          { label: "Backup generators", note: "3x units" },
          { label: "Medical kits", note: "Level 2 trauma" }
        ],
        status: "draft"
      },
      { 
        id: "pack2", 
        title: "Regulatory Pack", 
        items: [
          { label: "Emergency declarations" },
          { label: "Price controls", note: "Essential goods" },
          { label: "Import waivers" }
        ],
        status: "armed"
      },
      { 
        id: "pack3", 
        title: "Comms Pack", 
        items: [
          { label: "Public advisories" },
          { label: "Media briefings", note: "Hourly updates" },
          { label: "Stakeholder alerts" }
        ],
        status: "draft"
      }
    ]}
    triggerTemplates={[]}
    handoff={{ enableResponsive: true, enableDeliberative: false, enableStructural: false, onHandoff: (to)=>alert(to) }}
    onStagePrePosition={(ids)=>alert(`Stage ${ids.join(', ')}`)}
    onEvent={console.log}
  />
);

export const TriggerLibrary = () => (
  <AnticipatoryBundle
    loopCode="MAC-L06"
    screen="trigger-library"
    ewsProb={0.78}
    leadTimeDays={9}
    bufferAdequacy={0.32}
    consentRequired={false}
    ewsComposition={[]}
    buffers={[]}
    scenarios={[]}
    prePositionPacks={[]}
    triggerTemplates={[
      {
        id: "t1",
        name: "Heat Emergency",
        condition: "Temperature threshold exceeded",
        thresholdLabel: "Max temp ≥ 38°C for 3+ days",
        windowLabel: "72 hour window",
        authorityHint: "Emergency Services + Health",
        ttlHint: "Valid 90 days"
      },
      {
        id: "t2",
        name: "Supply Chain Alert",
        condition: "Critical supplier disruption",
        thresholdLabel: "Lead supplier unavailable ≥ 48hrs",
        windowLabel: "24 hour window",
        authorityHint: "Supply Chain + Trade",
        ttlHint: "Valid 30 days"
      },
      {
        id: "t3",
        name: "Demand Surge",
        condition: "Abnormal demand pattern detected",
        thresholdLabel: "Orders ≥ 200% baseline for 4+ hours",
        windowLabel: "4 hour window",
        authorityHint: "Operations + Finance",
        ttlHint: "Valid 60 days"
      }
    ]}
    handoff={{ enableResponsive: false, enableDeliberative: false, enableStructural: true, onHandoff: (to)=>alert(to) }}
    onSaveTrigger={(id)=>alert(`Save trigger ${id}`)}
    onEvent={console.log}
  />
);