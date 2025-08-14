import { create } from 'zustand';

type State = {
  hasLoopMapping: boolean;
  hasPdiArc: boolean;
  gateOutcome: 'ALLOW'|'REWORK'|'BLOCK'|null;
  participationDebtOverdue: boolean;
  set:(p: Partial<State>)=>void;
};
export const useActDemo = create<State>((set)=>({
  hasLoopMapping: true,
  hasPdiArc: false,
  gateOutcome: 'REWORK',
  participationDebtOverdue: true, // seeded debt (from Phase 2.1 tweak)
  set: (p)=>set(p),
}));
