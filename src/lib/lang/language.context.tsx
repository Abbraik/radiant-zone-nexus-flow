import * as React from "react";
import type { LanguageMode, Dictionary } from "./language.types";

type Ctx = {
  mode: LanguageMode;
  setMode: (m: LanguageMode) => void;
  dict: Dictionary;
  t: (key: string) => string;            // label resolved by mode
  x: (key: string) => string | undefined; // short explainer
};

const LangContext = React.createContext<Ctx | null>(null);

export function LanguageProvider({ children, dict, initialMode="general" }:{
  children: React.ReactNode; dict: Dictionary; initialMode?: LanguageMode;
}) {
  const [mode, setMode] = React.useState<LanguageMode>(initialMode);

  const t = React.useCallback((key: string) => {
    const term = dict[key]; if (!term) return key;
    return term.labels[mode] || term.labels.general || key;
  }, [dict, mode]);

  const x = React.useCallback((key: string) => {
    const term = dict[key]; if (!term) return undefined;
    return term.explain?.[mode] ?? term.explain?.general;
  }, [dict, mode]);

  return (
    <LangContext.Provider value={{ mode, setMode, dict, t, x }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(){
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>");
  return ctx;
}