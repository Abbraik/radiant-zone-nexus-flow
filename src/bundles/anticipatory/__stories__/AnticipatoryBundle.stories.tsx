import React from "react";
import AnticipatoryBundle from "../AnticipatoryBundle";

// Example stories for development - can be used without Storybook
export default {
  title: "Workspace5C/AnticipatoryBundle",
  component: AnticipatoryBundle
};

export const Watchboard = () => (
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
    scenarios={[]}
    prePositionPacks={[]}
    triggerTemplates={[]}
    handoff={{ enableResponsive: true, enableDeliberative: false, enableStructural: false, onHandoff: (to)=>alert(to) }}
    onArmWatchpoint={(rc)=>alert(`Arm ${rc}`)}
    onEvent={console.log}
  />
);