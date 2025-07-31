import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MetaSolveLayer, LeverageContext } from '../types/metasolve';
import { LoopArchetype } from '../components/think-zone/LoopBrowser';

interface ThinkZoneContextType {
  sprintBundle: SprintBundle | null;
  setSprintBundle: (bundle: SprintBundle | null) => void;
  navigateToActZone: (bundle: SprintBundle) => void;
}

interface SprintBundle {
  id: string;
  leverageContext: LeverageContext;
  selectedArchetypes: LoopArchetype[];
  macroVision: {
    text: string;
    timeHorizon: string;
    successMetrics: string[];
  };
  parameterConfiguration: {
    tensionSignal: any;
    deBandConfig: any;
    srtHorizon: any;
    allConfigurations: any[];
  };
  metadata: {
    createdAt: Date;
    createdBy: string;
    thinkZoneVersion: string;
  };
}

const ThinkZoneContext = createContext<ThinkZoneContextType | undefined>(undefined);

export const useThinkZone = () => {
  const context = useContext(ThinkZoneContext);
  if (!context) {
    throw new Error('useThinkZone must be used within a ThinkZoneProvider');
  }
  return context;
};

interface ThinkZoneProviderProps {
  children: ReactNode;
}

export const ThinkZoneProvider: React.FC<ThinkZoneProviderProps> = ({ children }) => {
  const [sprintBundle, setSprintBundle] = useState<SprintBundle | null>(null);

  const navigateToActZone = (bundle: SprintBundle) => {
    setSprintBundle(bundle);
    // Navigation will be handled by the parent component
    window.location.href = '/act-zone-wizard';
  };

  return (
    <ThinkZoneContext.Provider value={{
      sprintBundle,
      setSprintBundle,
      navigateToActZone
    }}>
      {children}
    </ThinkZoneContext.Provider>
  );
};

export type { SprintBundle };