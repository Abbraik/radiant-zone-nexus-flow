import React from 'react';
 type Props={ stage:'think'|'act'|'monitor'|'learn'|'innovate'|'closed' };
 const MAP:Record<Props['stage'],string> = {
   think:'bg-indigo-500/20 text-indigo-200',
   act:'bg-emerald-500/20 text-emerald-200',
   monitor:'bg-cyan-500/20 text-cyan-200',
   learn:'bg-amber-500/20 text-amber-200',
   innovate:'bg-fuchsia-500/20 text-fuchsia-200',
   closed:'bg-zinc-500/20 text-zinc-300'
 };
 export default function RelStageChips({stage}:Props){
   return <span className={`px-2 py-0.5 rounded-md text-xs ${MAP[stage]} border border-white/10`}>{stage}</span>;
 }
