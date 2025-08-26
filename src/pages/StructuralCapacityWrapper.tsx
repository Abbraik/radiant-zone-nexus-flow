import React, { useState, createContext, useContext } from 'react';
import { StructuralHeaderLanguage } from '@/bundles/structural/StructuralLanguage';
import type { LangMode } from '@/bundles/structural/types.ui.lang';

interface StructuralCapacityWrapperProps {
  loopCode: string;
  indicator: string;
  screen?: "mandate-gate" | "mesh-planner" | "process-studio" | "standards-forge" | "market-lab";
  taskData?: any;
  onUpdateMandate?: (mandate: any) => Promise<any>;
  onSaveProcessMap?: (processMap: any) => Promise<any>;
  onPublishStandard?: (standard: any) => Promise<any>;
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

export const StructuralCapacityWrapper: React.FC<StructuralCapacityWrapperProps> = ({ children, ...props }) => {
  const [languageMode, setLanguageMode] = useState<LangMode>('general');

  return (
    <LanguageContext.Provider value={{ mode: languageMode, setMode: setLanguageMode }}>
      <div className="relative">
        {/* Language overlay - positioned absolutely in top-right */}
        <div className="absolute top-8 right-8 z-50">
          <StructuralHeaderLanguage 
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
