import React, { useState, createContext, useContext } from 'react';
import { ResponsiveCapacityPage } from './ResponsiveCapacityPage';
import { ResponsiveHeaderLanguage } from '@/bundles/responsive/ResponsiveLanguage';
import type { LangMode } from '@/bundles/responsive/types.ui.lang';

interface ResponsiveCapacityWrapperProps {
  decision?: any;
  reading?: any;
  playbook?: any;
  onUpsertIncident?: (payload: any) => Promise<any>;
  onAppendIncidentEvent?: (incidentId: string, event: any) => Promise<any>;
  onCreateSprintWithTasks?: (payload: any) => Promise<any>;
  onOpenClaimDrawer?: (tasks: any[]) => void;
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

export const ResponsiveCapacityWrapper: React.FC<ResponsiveCapacityWrapperProps> = (props) => {
  const [languageMode, setLanguageMode] = useState<LangMode>('general');

  return (
    <LanguageContext.Provider value={{ mode: languageMode, setMode: setLanguageMode }}>
      <div className="relative">
        {/* Language overlay - positioned absolutely in top-right */}
        <div className="absolute top-8 right-8 z-50">
          <ResponsiveHeaderLanguage 
            mode={languageMode} 
            onModeChange={setLanguageMode} 
          />
        </div>

        {/* Original ResponsiveCapacityPage - completely unchanged */}
        <ResponsiveCapacityPage {...props} />
      </div>
    </LanguageContext.Provider>
  );
};
