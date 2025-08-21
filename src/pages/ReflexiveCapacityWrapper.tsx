import React, { useState, createContext, useContext } from 'react';
import { ReflexiveHeaderLanguage } from '@/bundles/reflexive/ReflexiveLanguage';
import type { LangMode } from '@/bundles/reflexive/types.ui.lang';

interface ReflexiveCapacityWrapperProps {
  loopCode: string;
  indicator: string;
  controllerSettings: any;
  tuningHistory: any;
  onControllerUpdate?: (settings: any) => Promise<any>;
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

export const ReflexiveCapacityWrapper: React.FC<ReflexiveCapacityWrapperProps> = ({ children, ...props }) => {
  const [languageMode, setLanguageMode] = useState<LangMode>('general');

  return (
    <LanguageContext.Provider value={{ mode: languageMode, setMode: setLanguageMode }}>
      <div className="relative">
        {/* Language overlay - positioned absolutely in top-right */}
        <div className="absolute top-8 right-8 z-50">
          <ReflexiveHeaderLanguage 
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
