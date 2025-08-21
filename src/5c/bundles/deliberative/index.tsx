// Deliberative Bundle - Analysis & Decision-Making Capacity
import React, { useState } from 'react';
import { BundleProps5C } from '@/5c/types';
import DeliberativeBundle from './DeliberativeBundle';
import type { DeliberativeAnalysisProps, AnalysisFrameworkItem } from './types.ui';

const DeliberativeBundleWrapper: React.FC<BundleProps5C> = ({ task }) => {
  const [timeframe, setTimeframe] = useState("2 weeks");
  const [stakeholderGroup, setStakeholderGroup] = useState("Core Team");
  const [objectives, setObjectives] = useState("");
  const [analysisFramework, setAnalysisFramework] = useState<AnalysisFrameworkItem[]>([
    { id: 'swot', label: 'SWOT Analysis', enabled: false },
    { id: 'cost-benefit', label: 'Cost-Benefit', enabled: false },
    { id: 'risk', label: 'Risk Assessment', enabled: false },
    { id: 'impact', label: 'Impact Analysis', enabled: false }
  ]);

  const handleFrameworkToggle = (id: string, enabled: boolean) => {
    setAnalysisFramework(prev => 
      prev.map(item => item.id === id ? { ...item, enabled } : item)
    );
  };

  const deliberativeProps: DeliberativeAnalysisProps = {
    title: 'DELIBERATIVE Capacity Bundle',
    description: 'Strategic Architecture Planning',
    mode: 'Strategic Analysis Mode',
    modeDescription: 'This bundle focuses on thorough analysis, stakeholder consultation, and systematic decision-making processes.',
    timeframe,
    stakeholderGroup,
    objectives,
    analysisFramework,
    onTimeframeChange: setTimeframe,
    onStakeholderGroupChange: setStakeholderGroup,
    onObjectivesChange: setObjectives,
    onFrameworkToggle: handleFrameworkToggle,
    onInviteStakeholders: () => {
      console.log('Inviting stakeholders...');
    },
    onBeginAnalysis: () => {
      console.log('Beginning analysis with:', {
        timeframe,
        stakeholderGroup,
        objectives,
        enabledFrameworks: analysisFramework.filter(f => f.enabled)
      });
    },
    fullScreenMode: true
  };

  return <DeliberativeBundle {...deliberativeProps} />;
};

export default DeliberativeBundleWrapper;