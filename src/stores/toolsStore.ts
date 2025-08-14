import { create } from 'zustand';

type Zone = 'think'|'monitor';

type ThinkTools = { indicators:boolean; bands:boolean; };
type MonitorTools = { rel:boolean; };

type State = {
  think: ThinkTools;
  monitor: MonitorTools;
  open: (zone:Zone, tool:keyof ThinkTools|keyof MonitorTools)=>void;
  close: (zone:Zone, tool:keyof ThinkTools|keyof MonitorTools)=>void;
  toggle: (zone:Zone, tool:keyof ThinkTools|keyof MonitorTools)=>void;
};

export const useToolsStore = create<State>((set)=>({
  think:   { indicators:false, bands:false },
  monitor: { rel:false },
  open:   (zone, tool)=>set((s)=>({ [zone]: { ...s[zone], [tool]: true } } as any)),
  close:  (zone, tool)=>set((s)=>({ [zone]: { ...s[zone], [tool]: false } } as any)),
  toggle: (zone, tool)=>set((s)=>({ [zone]: { ...s[zone], [tool]: !s[zone][tool as any] } } as any)),
}));
