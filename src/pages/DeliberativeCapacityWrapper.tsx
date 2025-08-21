import React, { useState, createContext, useContext } from 'react';
import { DeliberativeHeaderLanguage } from '@/bundles/deliberative/DeliberativeLanguage';
import type { LangMode } from '@/bundles/deliberative/types.ui.lang';

interface DeliberativeCapacityWrapperProps {
  loopCode: string;
  indicator: string;
  taskData: any;
  onUpdateTaskStatus?: (taskId: string, status: any) => Promise<any>;
  onCreateTask?: (task: any) => Promise<any>;
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

export const DeliberativeCapacityWrapper: React.FC<DeliberativeCapacityWrapperProps> = ({ children, ...props }) => {
  const [languageMode, setLanguageMode] = useState<LangMode>('general');

  return (
    <LanguageContext.Provider value={{ mode: languageMode, setMode: setLanguageMode }}>
      <div className="relative">
        {/* Language overlay - positioned absolutely in top-right */}
        <div className="absolute top-8 right-8 z-50">
          <DeliberativeHeaderLanguage 
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
