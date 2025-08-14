import { create } from 'zustand';
import { ds } from '@/services/datasource';
import type { PrecedenceState } from '@/services/datasource/types';

type State = {
  state: PrecedenceState;
  refresh: ()=>Promise<void>;
  set: (p: PrecedenceState)=>Promise<void>;
  clear: ()=>Promise<void>;
};

export const usePrecedenceStore = create<State>((set)=>({
  state: { active:false, relIds: [] },
  refresh: async ()=> {
    const s = await ds.getPrecedence(); set({ state: s });
  },
  set: async (p)=> { await ds.setPrecedence(p); set({ state: p }); },
  clear: async ()=> { await ds.clearPrecedence(); set({ state:{active:false, relIds: []} }); }
}));