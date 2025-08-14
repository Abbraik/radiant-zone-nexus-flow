import { create } from 'zustand';

type Zone = 'think'|'monitor'|'act'|'admin';

type ThinkTools = { indicators:boolean; bands:boolean; };
type MonitorTools = { rel:boolean; transparency:boolean; pilot:boolean; };
type ActTools = { ship:boolean; gate:boolean; participation:boolean; stacks:boolean; pdi:boolean; };
type AdminTools = { meta:boolean; };

type State = {
  think: ThinkTools;
  monitor: MonitorTools;
  act: ActTools;
  admin: AdminTools;
  open: (zone:Zone, tool:any)=>void;
  close: (zone:Zone, tool:any)=>void;
  toggle: (zone:Zone, tool:any)=>void;
};

export const useToolsStore = create<State>((set)=>({
  think:   { indicators:false, bands:false },
  monitor: { rel:false, transparency:false, pilot:false },
  act:     { ship:false, gate:false, participation:false, stacks:false, pdi:false },
  admin:   { meta:false },
  open:   (zone, tool)=>set((s)=>({ [zone]: { ...(s as any)[zone], [tool]: true } } as any)),
  close:  (zone, tool)=>set((s)=>({ [zone]: { ...(s as any)[zone], [tool]: false } } as any)),
  toggle: (zone, tool)=>set((s)=>({ [zone]: { ...(s as any)[zone], [tool]: !(s as any)[zone][tool] } } as any)),
}));
