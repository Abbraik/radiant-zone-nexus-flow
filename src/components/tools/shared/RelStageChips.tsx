import React from 'react';
type Props={ stage:'think'|'act'|'monitor'|'learn'|'innovate'|'closed' };
const TINT:Record<Props['stage'],string>={
  think:'text-indigo-200 ring-indigo-400/30',
  act:'text-emerald-200 ring-emerald-400/30',
  monitor:'text-cyan-200 ring-cyan-400/30',
  learn:'text-amber-200 ring-amber-400/30',
  innovate:'text-fuchsia-200 ring-fuchsia-400/30',
  closed:'text-zinc-300 ring-zinc-400/30'
};
export default function RelStageChips({stage}:Props){
  return <span className={`glass-chip ring-1 ${TINT[stage]}`}>{stage}</span>;
}
