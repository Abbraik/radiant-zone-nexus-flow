import React, { useState, createContext, useContext } from 'react';
import { AnticipatoryHeaderLanguage } from '@/bundles/anticipatory/AnticipatoryLanguage';
import type { LangMode } from '@/bundles/anticipatory/types.ui.lang';

interface AnticipatoryCapacityWrapperProps {
  loopCode: string;
  indicator?: string;
  screen?: "risk-watchboard" | "scenario-sim" | "pre-positioner" | "trigger-library";
  onArmWatchpoint?: (riskChannel: any) => void;
  onRunScenario?: (scenarioId: string) => void;
  onStagePrePosition?: (packIds: string[]) => void;
  onSaveTrigger?: (templateId: string) => void;
  children: React.ReactNode;
}

// Language context for future use by child components
interface LanguageContextType {
  mode: LangMode;
  setMode: (mode: LangMode) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguageMode = () => {
  const context = useContext(LanguageContext);
  return context || { mode: 'general' as LangMode, setMode: () => {} };
};

export const AnticipatoryCapacityWrapper: React.FC<AnticipatoryCapacityWrapperProps> = ({ children, ...props }) => {
  const [languageMode, setLanguageMode] = useState<LangMode>('general');

  return (
    <LanguageContext.Provider value={{ mode: languageMode, setMode: setLanguageMode }}>
      <div className="relative">
        {/* Language overlay - positioned absolutely in top-right */}
        <div className="absolute top-8 right-8 z-50">
          <AnticipatoryHeaderLanguage 
            mode={languageMode} 
            onModeChange={setLanguageMode} 
          />
        </div>

        {/* Original component content - completely unchanged */}
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
